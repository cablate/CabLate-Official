export type ServiceId = 'consulting' | 'coaching' | 'enterprise' | 'partnerships';

export type AnalyticsEvent =
  | { name: 'service_hub_view'; properties?: Record<string, never> }
  | { name: 'service_page_view'; properties: { service: ServiceId } }
  | { name: 'service_route_click'; properties: { service: ServiceId; placement: string } }
  | { name: 'service_cta_click'; properties: { service: ServiceId; placement: string } }
  | { name: 'application_view'; properties: { service: ServiceId | 'unknown'; source: string } }
  | { name: 'form_start'; properties: { service: ServiceId | 'unknown'; source: string } }
  | { name: 'service_choice_change'; properties: { service: ServiceId } }
  | { name: 'form_submit_attempt'; properties: { service: ServiceId | 'unknown' } }
  | { name: 'form_submit_invalid'; properties: { service: ServiceId | 'unknown'; reason: string } }
  | { name: 'form_submit_error'; properties: { service: ServiceId | 'unknown'; error_type: string } }
  | { name: 'generate_lead'; properties: { service: ServiceId | 'unknown'; source: string; delivery: 'email_sent' | 'dry_run' } }
  | { name: 'diagnostic_start'; properties: { page: '/expertise/'; version: 'b20-v1'; placement: 'hero' | 'worksheet' } }
  | { name: 'diagnostic_complete'; properties: { page: '/expertise/'; version: 'b20-v1' } }
  | { name: 'diagnostic_result_layer'; properties: { layer: string } }
  | { name: 'primary_cta_click'; properties: { layer: string; placement: 'diagnostic_result'; destination: 'agentskill' | 'handbook' } }
  | { name: 'article_scroll'; properties: { percent: 25 | 50 | 75 | 100 } };

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    cablateConsentHandlersReady?: boolean;
    cablateAnalytics?: {
      track: (name: AnalyticsEvent['name'], properties?: Record<string, unknown>) => void;
      openPreferences: () => void;
      setPreference: (value: 'granted' | 'denied') => void;
      getPreference: () => 'granted' | 'denied' | null;
      trackPage: () => void;
    };
  }
}

export function trackAnalyticsEvent(event: AnalyticsEvent): void {
  window.cablateAnalytics?.track(event.name, event.properties);
}
