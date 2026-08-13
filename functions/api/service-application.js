const TEST_SITE_KEY = '1x00000000000000000000AA';
const TEST_SECRET_KEY = '1x0000000000000000000000000000000AA';
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_EMAIL_URL = 'https://api.resend.com/emails';
const APPLICATION_ACTION = 'service_application';

const services = {
  consulting: {
    label: 'AI 專案卡關諮詢',
    focus: {
      find_root_cause: '找出真正卡點',
      compare_options: '比較方向、做取捨',
      set_next_step: '決定先做什麼',
      review_current_plan: '檢查目前做法',
    },
  },
  coaching: {
    label: '30 分鐘免費陪跑訪談',
    focus: {
      unsure_where_to_start: '想做，但不知道從哪裡開始',
      using_but_reworking: '已經在用，但一直重做',
      prototype_stuck: '已有做法或原型，但推不下去',
      unsure_if_ai_problem: '還不確定問題是不是 AI',
    },
  },
  enterprise: {
    label: '企業合作',
    focus: {
      team_diagnosis: '團隊使用診斷',
      training_workshop: '內訓或工作坊',
      pilot_implementation: '小規模導入',
      not_sure_yet: '還不確定',
    },
  },
  partnerships: {
    label: '講師與內容合作',
    focus: {
      speaking: '演講或分享',
      workshop: '工作坊',
      content: '內容共創',
      product: '產品或其他合作',
    },
  },
};

const attributionPattern = /^[A-Za-z0-9._~-]{0,100}$/;
const submissionPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body, status = 200, extraHeaders = {}) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...extraHeaders,
  },
});

const trimText = (value, maxLength) => typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

const isProduction = (env) => env.ENVIRONMENT === 'production';

const getTurnstileSiteKey = (env) => {
  if (env.TURNSTILE_SITE_KEY) return env.TURNSTILE_SITE_KEY;
  return isProduction(env) ? '' : TEST_SITE_KEY;
};

const getTurnstileSecretKey = (env) => {
  if (env.TURNSTILE_SECRET_KEY) return env.TURNSTILE_SECRET_KEY;
  return isProduction(env) ? '' : TEST_SECRET_KEY;
};

const sameOrigin = (request) => {
  const origin = request.headers.get('origin');
  if (!origin) return !isProductionRequest(request);
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
};

const isProductionRequest = (request) => {
  const hostname = new URL(request.url).hostname;
  return hostname === 'cablate.com' || hostname === 'www.cablate.com';
};

const makeLeadId = (submissionId) => {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  return `CAB-${date}-${submissionId.replaceAll('-', '').slice(0, 7).toUpperCase()}`;
};

export const validatePayload = (payload) => {
  const errors = {};
  const service = trimText(payload.service, 40);
  const serviceConfig = services[service];
  const name = trimText(payload.name, 80);
  const email = trimText(payload.email, 160).toLowerCase();
  const situation = trimText(payload.situation, 1600);
  const focus = trimText(payload.focus, 80);
  const organization = trimText(payload.organization, 120);
  const preferredTiming = trimText(payload.preferred_timing, 120);
  const referenceLinks = trimText(payload.reference_links, 1000);
  const submissionId = trimText(payload.submission_id, 64);
  const turnstileToken = trimText(payload.cf_turnstile_response, 2048);

  if (!serviceConfig) errors.service = '請選擇一種合作方式。';
  if (name.length < 1) errors.name = '請填寫姓名。';
  if (!emailPattern.test(email)) errors.email = '請填寫可正常收信的 Email。';
  if (situation.length < 20) errors.situation = '請至少用 20 個字說明目前情況與卡點。';
  if (!serviceConfig?.focus[focus]) errors.focus = '請選擇一個最接近的狀況。';
  if (payload.consent !== true) errors.consent = '請先確認資料使用方式。';
  if (!submissionPattern.test(submissionId)) errors.submission_id = '申請識別碼無效，請重新整理後再試。';
  if (!turnstileToken) errors.turnstile = '請完成人機驗證。';

  const attribution = {};
  for (const key of ['source_key', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
    const value = trimText(payload[key], 100);
    if (!attributionPattern.test(value)) errors[key] = '來源欄位格式無效。';
    attribution[key] = value;
  }

  return {
    errors,
    data: {
      service,
      serviceConfig,
      name,
      email,
      situation,
      focus,
      organization,
      preferredTiming,
      referenceLinks,
      submissionId,
      turnstileToken,
      sourcePath: trimText(payload.source_path, 200),
      applicationVersion: trimText(payload.application_version, 80),
      attribution,
    },
  };
};

const verifyTurnstile = async ({ token, secret, request, production }) => {
  const remoteIp = request.headers.get('CF-Connecting-IP') || '';
  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      secret,
      response: token,
      remoteip: remoteIp || undefined,
      idempotency_key: crypto.randomUUID(),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) return { success: false, errorCodes: ['verification-unavailable'] };
  const result = await response.json();
  const expectedHostname = new URL(request.url).hostname;
  const actionMatches = !production || result.action === APPLICATION_ACTION;
  const hostnameMatches = !production || result.hostname === expectedHostname;
  return {
    success: Boolean(result.success && actionMatches && hostnameMatches),
    errorCodes: result['error-codes'] || [],
  };
};

export const buildEmailText = (data, leadId) => {
  const focusLabel = data.serviceConfig.focus[data.focus];
  const optional = (value) => value || '未提供';
  return [
    `申請編號：${leadId}`,
    `申請路線：${data.serviceConfig.label}`,
    `姓名：${data.name}`,
    `Email：${data.email}`,
    `公司／團隊：${optional(data.organization)}`,
    '',
    '【想推進的事與目前卡點】',
    data.situation,
    '',
    '【這次最需要的方向／目前階段】',
    focusLabel,
    '',
    `希望時間：${optional(data.preferredTiming)}`,
    '公開參考連結：',
    optional(data.referenceLinks),
    '',
    '【來源】',
    `application_version：${data.applicationVersion || 'unknown'}`,
    `source_path：${data.sourcePath || 'unknown'}`,
    `source_key：${data.attribution.source_key || 'direct'}`,
    `utm_source：${data.attribution.utm_source || 'none'}`,
    `utm_medium：${data.attribution.utm_medium || 'none'}`,
    `utm_campaign：${data.attribution.utm_campaign || 'none'}`,
    `utm_content：${data.attribution.utm_content || 'none'}`,
    'consent：agreed',
  ].join('\n');
};

const sendApplicationEmail = async ({ env, data, leadId }) => {
  if (env.SERVICE_APPLICATION_DRY_RUN === 'true' && !isProduction(env)) {
    return { id: `dry-run-${leadId}` };
  }

  const required = ['RESEND_API_KEY', 'SERVICE_APPLICATION_FROM', 'SERVICE_APPLICATION_TO'];
  if (required.some((key) => !env[key])) throw new Error('email-not-configured');

  const response = await fetch(RESEND_EMAIL_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
      'Idempotency-Key': `service-application/${data.submissionId}`,
    },
    body: JSON.stringify({
      from: env.SERVICE_APPLICATION_FROM,
      to: [env.SERVICE_APPLICATION_TO],
      reply_to: data.email,
      subject: `CabLate｜${data.serviceConfig.label}｜${data.name}｜${leadId}`,
      text: buildEmailText(data, leadId),
      tags: [
        { name: 'service', value: data.service },
        { name: 'source', value: data.attribution.source_key || 'direct' },
      ],
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) throw new Error('email-send-failed');
  return response.json();
};

export const onRequestGet = async ({ env }) => {
  const siteKey = getTurnstileSiteKey(env);
  if (!siteKey) return json({ ok: false, message: '表單暫時無法使用，請改用 Email 聯絡。' }, 503);
  return json({ ok: true, turnstileSiteKey: siteKey, action: APPLICATION_ACTION });
};

export const onRequestPost = async ({ request, env }) => {
  if (!sameOrigin(request)) return json({ ok: false, message: '無法確認申請來源，請重新整理後再試。' }, 403);

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return json({ ok: false, message: '申請格式不正確。' }, 415);

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 20_000) return json({ ok: false, message: '申請內容過長，請精簡後再試。' }, 413);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: '申請格式不正確。' }, 400);
  }

  if (trimText(payload.website, 200)) {
    return json({ ok: true, leadId: 'CAB-RECEIVED', message: '已收到你的資料。' }, 201);
  }

  const { errors, data } = validatePayload(payload);
  if (Object.keys(errors).length > 0) {
    return json({ ok: false, message: '還有幾個地方需要確認。', fields: errors }, 400);
  }

  const secret = getTurnstileSecretKey(env);
  if (!secret) return json({ ok: false, message: '表單驗證暫時無法使用，請稍後再試。' }, 503);

  let turnstile;
  try {
    turnstile = await verifyTurnstile({ token: data.turnstileToken, secret, request, production: isProduction(env) });
  } catch {
    return json({ ok: false, message: '人機驗證暫時無法完成，請稍後再試。', code: 'turnstile_unavailable' }, 503);
  }
  if (!turnstile.success) {
    return json({ ok: false, message: '人機驗證已失效，請重新驗證後再送出。', code: 'turnstile_invalid' }, 422);
  }

  const leadId = makeLeadId(data.submissionId);
  try {
    await sendApplicationEmail({ env, data, leadId });
  } catch {
    return json({ ok: false, message: '申請目前沒有成功送達。請稍後再試，或直接寄 Email 聯絡。', code: 'delivery_failed' }, 502);
  }

  return json({
    ok: true,
    leadId,
    service: data.service,
    message: '申請已送達，我會依照你選擇的方式回覆下一步。',
  }, 201);
};
