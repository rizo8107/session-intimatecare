import { ensureCashfreeLoaded } from '../utils/cashfreeLoader';

export interface CashfreeConfig {
  appId: string;
  secretKey: string;
  mode: 'sandbox' | 'production';
}

export interface CreateOrderRequest {
  orderId: string;
  orderAmount: number;
  orderCurrency: string;
  customerDetails: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
  orderMeta: {
    returnUrl: string;
    notifyUrl?: string;
    paymentMethods?: string;
  };
  cartDetails?: {
    cartItems: Array<{
      itemId: string;
      itemName: string;
      itemDescription: string;
      itemImageUrl?: string;
      itemOriginalUnitPrice: number;
      itemDiscountedUnitPrice: number;
      itemQuantity: number;
      itemCurrency: string;
    }>;
  };
  orderNote?: string;
  orderTags?: Record<string, string>;
}

export interface PaymentSession {
  paymentSessionId: string;
  orderId: string;
}

export interface PaymentResult {
  error?: any;
  redirect?: boolean;
  paymentDetails?: {
    paymentMessage: string;
    paymentStatus: string;
    orderId: string;
    paymentId?: string;
  };
}

class CashfreeService {
  private cashfree: any = null;
  private config: CashfreeConfig;

  constructor() {
    const mode = (import.meta.env.VITE_CASHFREE_MODE as 'sandbox' | 'production') || 'sandbox'; // Default to sandbox if not set
    const appId = import.meta.env.VITE_CASHFREE_APP_ID;

    if (!appId) {
      console.error("VITE_CASHFREE_APP_ID is not defined in .env file. Payments will fail.");
    }

    this.config = {
      appId: appId,
      secretKey: import.meta.env.VITE_CASHFREE_SECRET_KEY, // This is not used on client, but good practice
      mode: mode
    };
  }

  async initialize() {
    if (!this.cashfree) {
      try {
        // Use the utility function to ensure Cashfree is loaded
        await ensureCashfreeLoaded();
        
        // Now initialize Cashfree
        this.cashfree = window.Cashfree({
          mode: this.config.mode
        });
        console.log(`Cashfree SDK initialized successfully.`);
        console.log(`Frontend SDK Mode: ${this.config.mode}`);
        console.log(`Frontend SDK App ID being used (from .env): ${this.config.appId ? 'found' : 'NOT FOUND'}`);
      } catch (error) {
        console.error('Error initializing Cashfree SDK:', error);
        throw error;
      }
    }
    
    return this.cashfree;
  }

  async createOrder(orderRequest: CreateOrderRequest): Promise<PaymentSession> {
    try {
      console.log('Creating Cashfree order with request:', orderRequest);
      const response = await fetch('https://bmieuvwjqjewslnfqybi.supabase.co/functions/v1/cashfree-create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ''}`,
        },
        body: JSON.stringify(orderRequest)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      return {
        paymentSessionId: data.payment_session_id,
        orderId: data.order_id
      };
    } catch (error) {
      console.error('Error creating Cashfree order:', error);
      throw error;
    }
  }

  async processPayment(paymentSessionId: string, containerId: string): Promise<PaymentResult> {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Checkout container with id #${containerId} not found`);
    }
    await this.initialize();

    if (!this.cashfree) {
      throw new Error('Cashfree SDK not loaded');
    }

    console.log('Processing payment with session ID:', paymentSessionId);
    
    const checkoutOptions = {
      paymentSessionId,
      redirectTarget: container,
      appearance: {
        width: "100%", // Make it responsive
      },
    };

    return new Promise((resolve, reject) => {
      try {
        this.cashfree.checkout(checkoutOptions)
          .then((result: PaymentResult) => {
            console.log('Cashfree checkout result:', result);
            resolve(result);
          })
          .catch((error: any) => {
            console.error('Cashfree checkout error:', error);
            reject(error);
          });
      } catch (error) {
        console.error('Error in Cashfree checkout:', error);
        reject(error);
      }
    });
  }

  async verifyPayment(orderId: string): Promise<any> {
    try {
      console.log('Verifying payment for order:', orderId);
      const response = await fetch(`https://bmieuvwjqjewslnfqybi.supabase.co/functions/v1/cashfree-verify-payment/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ''}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to verify payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  generateOrderId(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  calculatePlatformFee(amount: number, feePercentage: number = 10): number {
    return Math.round((amount * feePercentage) / 100 * 100) / 100;
  }

  calculateExpertEarnings(amount: number, platformFee: number): number {
    return amount - platformFee;
  }
}

export const cashfreeService = new CashfreeService();