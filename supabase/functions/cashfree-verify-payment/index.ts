import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Cashfree, CFEnvironment } from 'npm:cashfree-pg';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const orderId = url.pathname.split('/').pop()

    if (!orderId) {
      throw new Error('Order ID is required')
    }

    // Get environment variables
    const mode = Deno.env.get('VITE_CASHFREE_MODE') === 'production' ? 'production' : 'sandbox';
    const appId = Deno.env.get('VITE_CASHFREE_APP_ID')!;
    const secretKey = Deno.env.get('VITE_CASHFREE_SECRET_KEY')!;
    
    const cfEnvironment = mode === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;
    const cashfree = new Cashfree({
      env: cfEnvironment,
      appId: appId,
      secretKey: secretKey,
    });

    console.log(`Fetching payments for orderId: ${orderId} in ${mode} mode`);
    const sdkResponse = await cashfree.PGOrderFetchPayments(orderId);
    // Assuming sdkResponse.data contains the array of payment transactions
    // The SDK might wrap the response, so we access .data if that's the case
    // If sdkResponse itself is the array, then use sdkResponse directly.
    // Based on the user's snippet: `response.data` was logged.
    const orderResponse = sdkResponse.data; 
    console.log('Order response:', orderResponse);
    
    let orderStatus;
    let payments: any[] = []; // Initialize payments to an empty array
    
    // orderResponse holds sdkResponse.data which should be the array of payment transactions
    if (orderResponse && Array.isArray(orderResponse)) {
      payments = orderResponse; // Assign the transaction array to payments for the response
      
      if (payments.filter((transaction: any) => transaction.payment_status === "SUCCESS").length > 0) {
        orderStatus = "Success";
      } else if (payments.filter((transaction: any) => transaction.payment_status === "PENDING").length > 0) {
        orderStatus = "Pending";
      } else {
        // This handles cases where payments array is empty or all transactions are in a non-SUCCESS/PENDING state (e.g., FAILED)
        orderStatus = "Failure"; 
      }
    } else {
      console.log('Invalid order response format or no payments found:', orderResponse);
      orderStatus = "Failure"; // Default if orderResponse is not an array or is null/undefined
      // payments remains an empty array in this case, which is appropriate for the JSON response
    }

    return new Response(
      JSON.stringify({
        order_id: orderId,
        order_status: orderStatus,
        payments: payments
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error verifying payment:', error);
    // Try to get a more specific error message from Cashfree SDK response
    const errorMessage = error.response?.data?.message || error.message || 'Failed to verify payment';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.response?.data || error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})