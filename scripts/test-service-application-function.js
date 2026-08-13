import assert from 'node:assert/strict';
import { buildEmailText, onRequestGet, onRequestPost, validatePayload } from '../functions/api/service-application.js';

const validPayload = {
  application_version: 'service-application-v2',
  submission_id: '0f166463-8df9-41fd-9949-b1c7a4be81b8',
  service: 'coaching',
  name: '測試申請人',
  email: 'learner@example.com',
  situation: '我正在整理一套內容工作流程，但每次換題目就要全部重來，不確定真正卡點是不是 AI。',
  focus: 'using_but_reworking',
  consent: true,
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
assert.equal(valid.data.serviceConfig.label, '30 分鐘免費陪跑訪談');
assert.match(buildEmailText(valid.data, 'CAB-20260813-0F16646'), /已經在用 AI，卻還是一直重做/);

const invalid = validatePayload({ ...validPayload, email: 'bad', situation: '太短', focus: 'unknown', consent: false });
assert.deepEqual(Object.keys(invalid.errors).sort(), ['consent', 'email', 'focus', 'situation']);

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
assert.equal(successBody.message, '我會用你留下的 Email 回覆陪跑是否適合，以及接下來怎麼進行。');

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
