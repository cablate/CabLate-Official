import type { DiagnosticLayerCode } from '../config/workflowDiagnostic';

type EntrySurfaceEvent =
  | { name: 'diagnostic_start'; properties: { page: '/expertise/'; version: 'b20-v1'; placement: 'hero' | 'worksheet' } }
  | { name: 'diagnostic_complete'; properties: { page: '/expertise/'; version: 'b20-v1' } }
  | { name: 'diagnostic_result_layer'; properties: { layer: DiagnosticLayerCode } }
  | { name: 'primary_cta_click'; properties: { layer: DiagnosticLayerCode; placement: 'diagnostic_result'; destination: 'agentskill' | 'handbook' } };

/**
 * Batch 20 deliberately has no analytics sink. This typed boundary documents
 * the only safe event shapes without transmitting diagnostic content.
 */
export function emitEntrySurfaceEvent(_event: EntrySurfaceEvent): void {
  // no-op until the A04 consent gate is approved
}
