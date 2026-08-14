import type { DiagnosticLayerCode } from '../config/workflowDiagnostic';
import { trackAnalyticsEvent } from './analytics-client';

type EntrySurfaceEvent =
  | { name: 'diagnostic_start'; properties: { page: '/expertise/'; version: 'b20-v1'; placement: 'hero' | 'worksheet' } }
  | { name: 'diagnostic_complete'; properties: { page: '/expertise/'; version: 'b20-v1' } }
  | { name: 'diagnostic_result_layer'; properties: { layer: DiagnosticLayerCode } }
  | { name: 'primary_cta_click'; properties: { layer: DiagnosticLayerCode; placement: 'diagnostic_result'; destination: 'agentskill' | 'handbook' } };

/**
 * Sends only the diagnostic stage and result category. Text entered into the
 * worksheet remains in the browser and is never admitted by this event type.
 */
export function emitEntrySurfaceEvent(event: EntrySurfaceEvent): void {
  trackAnalyticsEvent(event);
}
