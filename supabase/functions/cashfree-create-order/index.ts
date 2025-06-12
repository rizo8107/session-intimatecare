import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Cashfree } from 'npm:cashfree-pg@latest'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { 
      orderId, 
      orderAmount, 
      orderCurrency, 
      customerDetails, 
      orderMeta,
      cartDetails,
      orderNote,
      orderTags 
    } = await req.json()

    // Add diagnostic logging to check if secrets are loaded
    const appId = Deno.env.get('CASHFREE_APP_ID');
    const secretKey = Deno.env.get('CASHFREE_SECRET_KEY');
    const mode = Deno.env.get('CASHFREE_MODE');

    console.log('Attempting to initialize Cashfree with the following credentials:');
    console.log('CASHFREE_APP_ID loaded:', appId ? `found (ending with ...${appId.slice(-4)})` : 'NOT FOUND');
    console.log('CASHFREE_SECRET_KEY loaded:', secretKey ? 'found' : 'NOT FOUND');
    console.log('CASHFREE_MODE loaded:', mode || 'NOT FOUND');

    if (!appId || !secretKey) {
      throw new Error('Cashfree App ID or Secret Key is missing from environment variables.');
    }

    // Initialize Cashfree using secure environment variables
    const cashfree = new Cashfree({
      env: mode === 'PRODUCTION' ? 'PRODUCTION' : 'SANDBOX',
      appId: appId!,
      secretKey: secretKey!,
    });

    const orderRequest = {
      order_amount: orderAmount,
      order_currency: orderCurrency,
      order_id: orderId,
      customer_details: {
        customer_id: customerDetails.customerId,
        customer_phone: customerDetails.customerPhone,
        customer_name: customerDetails.customerName,
        customer_email: customerDetails.customerEmail,
      },
      order_meta: {
        return_url: orderMeta.returnUrl,
        notify_url: orderMeta.notifyUrl,
        payment_methods: orderMeta.paymentMethods || 'cc,dc,upi,nb,wallet',
      },
      cart_details: cartDetails,
      order_expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      order_note: orderNote,
      order_tags: orderTags,
    }

    const response = await cashfree.PGCreateOrder(orderRequest)
    
    return new Response(
      JSON.stringify(response.data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating Cashfree order:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create order',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})