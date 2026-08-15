import assert from 'node:assert/strict';
import { buildEmailHtml, buildEmailText, makeLeadId, onRequestGet, onRequestPost, validatePayload } from '../functions/api/service-application.js';

const validPayload = {
  application_version: 'service-application-v4',
  submission_id: '0f166463-8df9-41fd-9949-b1c7a4be81b8',
  service: 'coaching',
  name: '測試申請人',
  email: 'learner@example.com',
  situation: '我正在整理一套內容工作流程，目前已有幾份素材，希望五週後能完成可以持續使用的第一版。',
  focus: 'clear_direction_no_first_version',
  source_path: '/services/apply/',
  source_key: 'coaching_page',
  utm_source: 'local',
  utm_medium: 'test',
  utm_campaign: '',
  utm_content: '',
  cf_turnstile_response: 'XXXX.DUMMY.TOKEN.XXXX',
  website: '',
};

const valid = validatePayload(validPayload);
assert.deepEqual(valid.errors, {});
assert.equal(valid.data.serviceConfig.label, '五週一對一陪跑申請');
assert.match(buildEmailText(valid.data, 'CAB-20260813-0F16646'), /有明確方向和素材/);
assert.match(buildEmailHtml(valid.data, 'CAB-20260813-0F16646'), /回覆申請人/);
assert.match(buildEmailHtml({ ...valid.data, situation: '<script>alert(1)</script>' }, 'CAB-20260813-0F16646'), /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
assert.doesNotMatch(buildEmailHtml({ ...valid.data, situation: '<script>alert(1)</script>' }, 'CAB-20260813-0F16646'), /<script>/);
assert.equal(makeLeadId(validPayload.submission_id, new Date('2026-08-13T16:01:00.000Z')), 'CAB-20260814-0F16646');

const invalid = validatePayload({ ...validPayload, email: 'bad', situation: '太短', focus: 'unknown' });
assert.deepEqual(Object.keys(invalid.errors).sort(), ['email', 'focus', 'situation']);

const env = {
  ENVIRONMENT: 'preview',
  SERVICE_APPLICATION_DRY_RUN: 'true',
};

const configResponse = await onRequestGet({ env });
assert.equal(configResponse.status, 200);
assert.equal((await configResponse.json()).turnstileSiteKey, '1x00000000000000000000AA');

const request = new Request('http://127.0.0.1:8788/api/service-application', {
  method: 'POST',
  headers: {
    origin: 'http://127.0.0.1:8788',
    'content-type': 'application/json',
  },
  body: JSON.stringify(validPayload),
});
const successResponse = await onRequestPost({ request, env });
assert.equal(successResponse.status, 201);
const successBody = await successResponse.json();
assert.equal(successBody.ok, true);
assert.match(successBody.leadId, /^CAB-\d{8}-0F16646$/);
assert.equal(successBody.delivery, 'dry_run');
assert.equal(successBody.message, '本地測試完成，沒有寄出 Email。');

const crossOriginRequest = new Request('http://127.0.0.1:8788/api/service-application', {
  method: 'POST',
  headers: {
    origin: 'https://attacker.example',
    'content-type': 'application/json',
  },
  body: JSON.stringify(validPayload),
});
assert.equal((await onRequestPost({ request: crossOriginRequest, env })).status, 403);

console.log('Service application function tests passed.');
