import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface PayPalSettings {
  paypal_client_id: string;
  paypal_secret: string;
  paypal_mode: 'sandbox' | 'production';
}

async function getPayPalSettings(): Promise<PayPalSettings | null> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('store_settings')
    .select('paypal_client_id, paypal_secret, paypal_mode')
    .single();

  if (error || !data) {
    console.error('Error fetching PayPal settings:', error);
    return null;
  }

  return data;
}

async function createPayPalOrder(amount: number, settings: PayPalSettings) {
  const baseUrl = settings.paypal_mode === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

  const auth = btoa(`${settings.paypal_client_id}:${settings.paypal_secret}`);

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: (amount / 10).toFixed(2),
        },
        description: 'Commande Beauty&Home.ma',
      }],
      application_context: {
        return_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/paypal-capture-order`,
        cancel_url: `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/checkout`,
        brand_name: 'Beauty&Home.ma',
        user_action: 'PAY_NOW',
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PayPal API error: ${error}`);
  }

  return await response.json();
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { amount, orderId } = await req.json();

    if (!amount || !orderId) {
      return new Response(
        JSON.stringify({ error: 'Missing amount or orderId' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const settings = await getPayPalSettings();
    if (!settings || !settings.paypal_client_id || !settings.paypal_secret) {
      return new Response(
        JSON.stringify({ error: 'PayPal not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const paypalOrder = await createPayPalOrder(amount, settings);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase
      .from('orders')
      .update({ paypal_order_id: paypalOrder.id })
      .eq('id', orderId);

    const approveLink = paypalOrder.links.find((link: any) => link.rel === 'approve');

    return new Response(
      JSON.stringify({
        id: paypalOrder.id,
        approveUrl: approveLink?.href,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
