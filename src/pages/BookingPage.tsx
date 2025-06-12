import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useExpert, useServices, useAvailability, useAuth, useBookings } from '../hooks/useDatabase';
import { Service } from '../types/database';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-hot-toast';
import { cashfreeService } from '../services/cashfree';
import { ensureCashfreeLoaded } from '../utils/cashfreeLoader';

// Define extended time slot interface
interface TimeSlot {
  id: string;
  start_time: string;
  original_start_time: string;
}

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isCashfreeLoaded, setCashfreeLoaded] = useState(false);
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [showInlineCheckout, setShowInlineCheckout] = useState(false);

  // Ensure Cashfree SDK is loaded
  useEffect(() => {
    const loadCashfree = async () => {
      try {
        await ensureCashfreeLoaded();
        setCashfreeLoaded(true);
      } catch (error) {
        console.error('Failed to load Cashfree SDK:', error);
        toast.error('Payment system is currently unavailable. Please try again later.');
      }
    };
    loadCashfree();
  }, []);

  const { data: expert, loading: expertLoading, error: expertError } = useExpert(id);
  const { data: services, loading: servicesLoading, error: servicesError } = useServices(id);
  const { data: availability, loading: availabilityLoading, error: availabilityError } = useAvailability(id);
  const { createBooking } = useBookings(user?.id);

  const availableDates = useMemo(() => {
    if (!availability) return new Set();
    const dates = new Set<string>();
    availability.forEach(slot => {
      if (slot.start_time) {
        const date = new Date(slot.start_time).toISOString().split('T')[0];
        dates.add(date);
      }
    });
    return dates;
  }, [availability]);

  const timeSlotsForSelectedDate = useMemo(() => {
    if (!selectedDate || !availability) return [];
    const dateString = selectedDate.toISOString().split('T')[0];
    return availability
      .filter(slot => {
        if (!slot.start_time) return false;
        const slotDate = new Date(slot.start_time).toISOString().split('T')[0];
        return slotDate === dateString && !slot.is_booked;
      })
      .map(slot => ({
        id: slot.id,
        original_start_time: slot.start_time,
        start_time: new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })) as TimeSlot[];
  }, [selectedDate, availability]);

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setSelectedTimeSlot(null);
  };

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setSelectedTimeSlot(null);
    }
  };

  const processBookingWithEmail = async () => {
    if (!guestEmail || !/^\S+@\S+\.\S+$/.test(guestEmail)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setShowEmailModal(false);
    await handleBookingProcess(guestEmail);
  };

  const handleBooking = async () => {
    if (!user) {
      setShowEmailModal(true);
      return;
    }
    if (user.email) {
      await handleBookingProcess(user.email);
    } else {
        toast.error("Your email is not available, cannot proceed with booking.");
    }
  };

  const handleBookingProcess = async (customerEmail: string) => {
    if (!id || !selectedService || !selectedDate || !selectedTimeSlot?.original_start_time) {
      toast.error('Please ensure you have selected a service, date, and time.');
      return;
    }
    if (!isCashfreeLoaded) {
      toast.error('Payment system is initializing. Please try again in a moment.');
      return;
    }

    setIsProcessing(true);
    try {
      const generatedOrderId = cashfreeService.generateOrderId();
      const bookingData = {
        expert_id: id,
        service_id: selectedService.id,
        scheduled_at: selectedTimeSlot.original_start_time,
        duration_minutes: selectedService.duration_minutes || 60,
        status: 'pending' as 'pending',
        total_amount: selectedService.price,
        currency: 'INR',
        ...(user?.id ? { client_id: user.id } : {}),
        client_notes: !user ? `Guest booking - Email: ${customerEmail}` : undefined
      };

      const newBooking = await createBooking(bookingData);
      if (!newBooking || (Array.isArray(newBooking) && (!newBooking[0] || !newBooking[0].id))) {
          throw new Error('Booking creation failed: Invalid response from server.');
      }

      const orderData = {
        orderId: generatedOrderId,
        orderAmount: selectedService.price,
        orderCurrency: 'INR',
        customerDetails: {
          customerId: user?.id || `guest-${Date.now()}`,
          customerName: customerEmail.split('@')[0],
          customerEmail: customerEmail,
          customerPhone: '9999999999'
        },
        orderMeta: {
          returnUrl: `${import.meta.env.VITE_APP_BASE_URL}/booking/confirmation?orderId=${generatedOrderId}`,
          notifyUrl: `${import.meta.env.VITE_APP_BASE_URL}/api/cashfree-webhook`
        },
      };

      const paymentSession = await cashfreeService.createOrder(orderData);
      if (!paymentSession || !paymentSession.paymentSessionId) {
        throw new Error('Invalid payment session returned from Cashfree');
      }

      setShowInlineCheckout(true);

      setTimeout(async () => {
        try {
          await cashfreeService.processPayment(paymentSession.paymentSessionId, 'cf_checkout');
        } catch (paymentError) {
          console.error('Error rendering inline checkout:', paymentError);
          toast.error('Could not display payment form. Please refresh and try again.');
          setShowInlineCheckout(false);
        }
      }, 100);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process payment.';
      toast.error(errorMessage);
      console.error('Payment error:', errorMessage);
      setShowInlineCheckout(false);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      return !availableDates.has(dateString);
    }
    return false;
  };

  const EmailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Enter Your Email</h2>
        <p className="text-gray-600 mb-6">Please provide your email to continue with the booking.</p>
        <input
          type="email"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          placeholder="your.email@example.com"
          className="w-full p-3 border rounded-lg mb-2"
        />
        {emailError && <p className="text-red-500 text-sm mb-4">{emailError}</p>}
        <div className="flex justify-end space-x-4">
          <button onClick={() => setShowEmailModal(false)} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={processBookingWithEmail} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700">
            Confirm & Proceed
          </button>
        </div>
      </div>
    </div>
  );

  if (expertLoading || servicesLoading || availabilityLoading) {
    return <div className="text-center p-10">Loading booking details...</div>;
  }

  if (expertError || servicesError || availabilityError) {
    return <div className="text-center p-10 text-red-500">Error loading booking information. Please try again later.</div>;
  }
    
  if (!expert) {
    return <div className="text-center p-10">Expert not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      {showEmailModal && <EmailModal />}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        
        {showInlineCheckout ? (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center">Complete Your Payment</h2>
            <p className="text-gray-600 mb-6 text-center">Please follow the instructions in the payment window below.</p>
            <div id="cf_checkout" className="w-full h-96"></div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">Book a session with {expert.profile?.full_name}</h1>
            <p className="text-gray-600 mb-8">Follow the steps below to schedule your session.</p>

            {/* Step 1: Choose a service */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Step 1: Choose a Service</h2>
              <div className="space-y-4">
                {services && services.length > 0 ? (
                  services.map((service) => (
                    <div
                      key={service.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedService?.id === service.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
                      onClick={() => handleSelectService(service)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{service.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="font-bold text-lg">${service.price}</p>
                          <p className="text-gray-500 text-sm">{service.duration_minutes} mins</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">This expert has not listed any services yet.</p>
                )}
              </div>
            </div>

            {/* Step 2: Choose a Date & Time */}
            {selectedService && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Step 2: Choose a Date & Time</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Select a date:</h3>
                    <Calendar
                      onChange={handleDateChange}
                      value={selectedDate}
                      tileDisabled={tileDisabled}
                      minDate={new Date()}
                      className="rounded-lg border"
                    />
                  </div>
                  {selectedDate && timeSlotsForSelectedDate.length > 0 ? (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Select a time slot:</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlotsForSelectedDate.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`p-2 rounded-lg border text-center transition ${selectedTimeSlot?.id === slot.id ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                          >
                            {slot.start_time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No available slots for this date.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Confirmation and Booking */}
            {selectedService && selectedDate && selectedTimeSlot && (
              <div className="mt-8 pt-8 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold">Total</h2>
                    <p className="text-lg font-bold text-blue-600">${selectedService?.price || 0}</p>
                  </div>
                  <button
                    onClick={handleBooking}
                    disabled={isProcessing}
                    className="px-8 py-3 rounded-lg text-white font-bold bg-green-500 hover:bg-green-600 disabled:bg-gray-400"
                  >
                    {isProcessing ? 'Processing...' : 'Book Now'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingPage;