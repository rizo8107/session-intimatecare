import { load, CashfreeOptions } from '@cashfreepayments/cashfree-js';

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
  private cashfree: any = null; // This will store the loaded Cashfree instance
  private config: CashfreeConfig;
  
  /**
   * Generates a unique order ID for Cashfree payments
   * @returns A unique order ID string
   */
  generateOrderId(): string {
    // Format: order_<timestamp>_<random>
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `order_${timestamp}_${random}`;
  }

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
        console.log(`Initializing Cashfree SDK with mode: ${this.config.mode}`);
        // Use the load function from the package
        this.cashfree = await load({
          mode: this.config.mode as CashfreeOptions['mode'] // Cast to satisfy CashfreeOptions type
        });
        console.log('Cashfree SDK initialized successfully using @cashfreepayments/cashfree-js.');
        console.log(`Frontend SDK Mode: ${this.config.mode}`);
        // App ID is not directly used by the 'load' function for client-side SDK, but good to log its presence
        console.log(`VITE_CASHFREE_APP_ID (from .env): ${this.config.appId ? 'found' : 'NOT FOUND'}`);
      } catch (error) {
        console.error('Error initializing Cashfree SDK with @cashfreepayments/cashfree-js:', error);
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

    // Ensure Cashfree SDK is initialized via the class method
    await this.initialize();

    if (!this.cashfree) {
      console.error('Cashfree SDK not initialized before processPayment.');
      throw new Error('Cashfree SDK not loaded or initialized');
    }

    console.log('Processing payment with session ID:', paymentSessionId);
    console.log('SDK mode is set to:', this.config.mode);
    
    // Use exact same format as in example for checkout options
    const checkoutOptions = {
      paymentSessionId,
      redirectTarget: container,
      appearance: {
        width: "100%",
        height: "400px"
      }
    };
    
    console.log('Checkout options:', checkoutOptions);

    return new Promise((resolve, reject) => {
      try {
        // Add a wrapper for better debugging
        const checkout = async () => {
          try {
            const result = await this.cashfree.checkout(checkoutOptions);
            console.log('Cashfree checkout result:', result);
            resolve(result);
          } catch (err) {
            console.error('Error in checkout call:', err);
            // If specific error about mode, try to log information
            const errorString = String(err);
            if (errorString.includes('mode')) {
              console.error('Mode related error. Current mode:', this.config.mode);
              console.error('SDK instance:', this.cashfree);
            }
            reject(err);
          }
        };
        
        checkout();
      } catch (error) {
        console.error('Error in Cashfree checkout outer block:', error);
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

  // generateOrderId is implemented at the top of this class

  calculatePlatformFee(amount: number, feePercentage: number = 10): number {
    return Math.round((amount * feePercentage) / 100 * 100) / 100;
  }

  calculateExpertEarnings(amount: number, platformFee: number): number {
    return amount - platformFee;
  }
}

export const cashfreeService = new CashfreeService();