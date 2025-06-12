import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useDatabase';
import { toast } from 'react-hot-toast';
import { cashfreeService } from '../services/cashfree';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const orderId = searchParams.get('orderId');

        if (!orderId) {
          toast.error('Invalid order ID');
          navigate('/');
          return;
        }

        setIsVerifying(true);
        const result = await cashfreeService.verifyPayment(orderId);
        
        if (result && result.order_status) {
          setPaymentStatus(result.order_status);
          setPaymentDetails(result);
          
          if (result.order_status === 'PAID') {
            toast.success('Payment successful!');
          } else if (result.order_status === 'ACTIVE') {
            toast('Payment is being processed.');
          } else {
            toast.error('Payment failed or cancelled.');
          }
        } else {
          setPaymentStatus('UNKNOWN');
          toast.error('Could not verify payment status');
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        toast.error(error.message || 'Failed to verify payment');
        setPaymentStatus('ERROR');
      } finally {
        setIsVerifying(false);
      }
    };

    if (user) {
      verifyPayment();
    }
  }, [location.search, user, navigate]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your booking</h1>
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Booking Confirmation</h1>
        
        {isVerifying ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Verifying payment status...</p>
          </div>
        ) : (
          <div>
            {paymentStatus === 'PAID' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-700 font-medium">Payment successful! Your booking is confirmed.</p>
                </div>
              </div>
            )}
            
            {paymentStatus === 'ACTIVE' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-yellow-700 font-medium">Your payment is being processed. We'll update you once confirmed.</p>
                </div>
              </div>
            )}
            
            {(paymentStatus !== 'PAID' && paymentStatus !== 'ACTIVE') && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p className="text-red-700 font-medium">
                    {paymentStatus === 'ERROR' 
                      ? 'There was an error processing your payment.' 
                      : 'Payment failed or was cancelled.'}
                  </p>
                </div>
              </div>
            )}
            
            {paymentDetails && (
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3">Order Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Order ID</p>
                    <p className="font-medium">{paymentDetails.order_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-medium">₹{paymentDetails.order_amount}</p>
                  </div>
                  {paymentDetails.payment_id && (
                    <div>
                      <p className="text-gray-600">Payment ID</p>
                      <p className="font-medium">{paymentDetails.payment_id}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-medium">{paymentDetails.order_status}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => navigate('/')}
                className="bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                Back to Home
              </button>
              
              <button
                onClick={() => navigate('/bookings')}
                className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                View My Bookings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingConfirmation;
