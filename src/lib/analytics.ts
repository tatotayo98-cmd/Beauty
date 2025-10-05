import { supabase } from './supabase';

let sessionId: string | null = null;

function getSessionId(): string {
  if (sessionId) return sessionId;

  sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }

  return sessionId;
}

export async function initSession() {
  const sid = getSessionId();

  const { data: existing } = await supabase
    .from('analytics_sessions')
    .select('id')
    .eq('session_id', sid)
    .maybeSingle();

  if (!existing) {
    await supabase.from('analytics_sessions').insert({
      session_id: sid,
      ip_address: 'unknown',
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
      landing_page: window.location.pathname,
      started_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
    });
  } else {
    await supabase
      .from('analytics_sessions')
      .update({ last_activity_at: new Date().toISOString() })
      .eq('session_id', sid);
  }
}

export async function trackPageView(pagePath: string, pageTitle?: string) {
  const sid = getSessionId();

  const { data: session } = await supabase
    .from('analytics_sessions')
    .select('id')
    .eq('session_id', sid)
    .maybeSingle();

  if (session) {
    await supabase.from('analytics_page_views').insert({
      session_id: session.id,
      page_path: pagePath,
      page_title: pageTitle || document.title,
      viewed_at: new Date().toISOString(),
    });

    await supabase
      .from('analytics_sessions')
      .update({ last_activity_at: new Date().toISOString() })
      .eq('id', session.id);
  }
}

export async function trackConversion(orderId: string, revenue: number) {
  const sid = getSessionId();

  const { data: session } = await supabase
    .from('analytics_sessions')
    .select('id')
    .eq('session_id', sid)
    .maybeSingle();

  if (session) {
    await supabase.from('analytics_conversions').insert({
      session_id: session.id,
      order_id: orderId,
      revenue,
      converted_at: new Date().toISOString(),
    });
  }
}
