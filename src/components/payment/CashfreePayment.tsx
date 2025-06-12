import React, { useState } from 'react';
import { CreditCard, Loader } from 'lucide-react';
import { cashfreeService, CreateOrderRequest } from '../../services/cashfree';
import { useAuth, usePayment } from '../../hooks/useDatabase';

interface CashfreePaymentProps {
  bookingData: {
    id: string;
    expertId: string;
    serviceId: string;
    amount: number;
    currency: string;
    expertName: string;
    serviceName: string;
    clientId: string;
  };
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
}

const CashfreePayment: React.FC<CashfreePaymentProps> = ({
  bookingData,
  onSuccess,
  onError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, profile } = useAuth();
  const { createPayment, updatePayment } = usePayment();

  const handlePayment = async () => {
    if (!user || !profile) {
      onError('Please log in to continue with payment');
      return;
    }

    setIsProcessing(true);

    try {
      // Generate unique order ID
      const orderId = cashfreeService.generateOrderId();
      
      // Calculate fees
      const platformFee = cashfreeService.calculatePlatformFee(bookingData.amount);
      const expertEarnings = cashfreeService.calculateExpertEarnings(bookingData.amount, platformFee);

      // Create payment record in database
      const payment = await createPayment({
        booking_id: bookingData.id,
        payer_id: bookingData.clientId,
        recipient_id: bookingData.expertId,
        amount: bookingData.amount,
        currency: bookingData.currency,
        platform_fee: platformFee,
        expert_earnings: expertEarnings,
        cashfree_order_id: orderId,
        status: 'pending'
      });

      // Prepare Cashfree order request
      const orderRequest: CreateOrderRequest = {
        orderId,
        orderAmount: bookingData.amount,
        orderCurrency: bookingData.currency,
        customerDetails: {
          customerId: profile.id,
          customerName: profile.full_name,
          customerEmail: profile.email,
          customerPhone: profile.phone || '9999999999'
        },
        orderMeta: {
          returnUrl: `${window.location.origin}/booking-success?orderId=${orderId}`,
          notifyUrl: `${window.location.origin}/api/cashfree/webhook`,
          paymentMethods: 'cc,dc,upi,nb,wallet'
        },
        cartDetails: {
          cartItems: [{
            itemId: bookingData.serviceId,
            itemName: bookingData.serviceName,
            itemDescription: `Session with ${bookingData.expertName}`,
            itemOriginalUnitPrice: bookingData.amount,
            itemDiscountedUnitPrice: bookingData.amount,
            itemQuantity: 1,
            itemCurrency: bookingData.currency
          }]
        },
        orderNote: `Payment for session with ${bookingData.expertName}`,
        orderTags: {
          bookingId: bookingData.id,
          expertId: bookingData.expertId,
          clientId: bookingData.clientId
        }
      };

      // Create order with Cashfree
      const paymentSession = await cashfreeService.createOrder(orderRequest);

      // Update payment record with session ID
      await updatePayment(payment.id, {
        cashfree_payment_id: paymentSession.paymentSessionId
      });

      // Process payment
      const result = await cashfreeService.processPayment(paymentSession.paymentSessionId);

      if (result.error) {
        await updatePayment(payment.id, { status: 'failed' });
        onError('Payment failed. Please try again.');
        return;
      }

      if (result.paymentDetails) {
        // Verify payment status
        const verification = await cashfreeService.verifyPayment(orderId);
        
        if (verification.order_status === 'SUCCESS') {
          await updatePayment(payment.id, {
            status: 'completed',
            processed_at: new Date().toISOString()
          });
          
          onSuccess({
            orderId,
            paymentId: result.paymentDetails.paymentId,
            amount: bookingData.amount,
            status: 'completed'
          });
        } else {
          await updatePayment(payment.id, { status: 'failed' });
          onError('Payment verification failed. Please contact support.');
        }
      }

    } catch (error) {
      console.error('Payment error:', error);
      onError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-blue-700">
          <CreditCard className="h-5 w-5" />
          <span className="font-medium">Secure Payment with Cashfree</span>
        </div>
        <p className="text-sm text-blue-600 mt-1">
          Your payment is secured by Cashfree's industry-standard encryption.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium">{bookingData.serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Expert:</span>
            <span className="font-medium">{bookingData.expertName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">{bookingData.currency} {bookingData.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Platform Fee:</span>
            <span className="font-medium">{bookingData.currency} {cashfreeService.calculatePlatformFee(bookingData.amount)}</span>
          </div>
          <div className="border-t pt-2 mt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary-600">{bookingData.currency} {bookingData.amount}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <Loader className="h-5 w-5 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            <span>Pay Securely</span>
          </>
        )}
      </button>

      <div className="text-center text-sm text-gray-500">
        <p>Supported payment methods: Credit Card, Debit Card, UPI, Net Banking, Wallets</p>
      </div>
    </div>
  );
};

export default CashfreePayment;