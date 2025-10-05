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

async function capturePayPalOrder(orderId: string, settings: PayPalSettings) {
  const baseUrl = settings.paypal_mode === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

  const auth = btoa(`${settings.paypal_client_id}:${settings.paypal_secret}`);

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PayPal capture error: ${error}`);
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
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return Response.redirect(`${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/checkout?error=missing_token`);
    }

    const settings = await getPayPalSettings();
    if (!settings) {
      return Response.redirect(`${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/checkout?error=config`);
    }

    const captureData = await capturePayPalOrder(token, settings);

    if (captureData.status === 'COMPLETED') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase
        .from('orders')
        .update({
          payment_status: 'completed',
          paypal_capture_id: captureData.id,
        })
        .eq('paypal_order_id', token);

      return Response.redirect(`${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/track-order?success=true`);
    } else {
      return Response.redirect(`${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/checkout?error=payment_failed`);
    }
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    return Response.redirect(`${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/checkout?error=capture_failed`);
  }
});
