const TEST_SITE_KEY = '1x00000000000000000000AA';
const TEST_SECRET_KEY = '1x0000000000000000000000000000000AA';
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_EMAIL_URL = 'https://api.resend.com/emails';
const APPLICATION_ACTION = 'service_application';

const services = {
  consulting: {
    label: '專案卡關諮詢',
    focusQuestion: '這 60 分鐘，你最需要帶走什麼？',
    focus: {
      find_root_cause: '找出真正卡點',
      compare_options: '比較方向、做取捨',
      set_next_step: '決定先做什麼',
      review_current_plan: '檢查目前做法',
    },
  },
  coaching: {
    label: '五週一對一陪跑申請',
    focusQuestion: '下面哪一句最像你現在的狀況？',
    focus: {
      unsure_where_to_start: '事情很多，最後沒有一個真的做下去',
      using_but_reworking: '已經在用 AI，卻還是一直重做',
      prototype_stuck: '已經做了一版，卻不知道怎麼繼續',
      unsure_if_ai_problem: '還不確定是不是 AI 的問題',
    },
  },
  enterprise: {
    label: '企業合作',
    focusQuestion: '這次最想先談哪一類合作？',
    focus: {
      team_diagnosis: '團隊使用診斷',
      training_workshop: '內訓或工作坊',
      pilot_implementation: '小規模導入',
      not_sure_yet: '還不確定',
    },
  },
  partnerships: {
    label: '講師與內容合作',
    focusQuestion: '這次合作比較接近哪一種？',
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

export const makeLeadId = (submissionId, now = new Date()) => {
  const dateParts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now).map(({ type, value }) => [type, value]));
  const date = `${dateParts.year}${dateParts.month}${dateParts.day}`;
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
  if (situation.length < 20) errors.situation = '請再多說一點，至少 20 個字，讓我看得懂你正在做什麼、卡在哪裡。';
  if (!serviceConfig?.focus[focus]) errors.focus = '請選擇一個最接近的狀況。';
  if (payload.consent !== true) errors.consent = '請先確認資料使用方式。';
  if (!submissionPattern.test(submissionId)) errors.submission_id = '這次申請無法辨識，請重新整理後再試。';
  if (!turnstileToken) errors.turnstile = '請完成安全檢查。';

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
    `新服務申請｜${data.serviceConfig.label}`,
    '直接回覆這封信即可聯絡申請人。',
    '',
    `申請編號：${leadId}`,
    `姓名：${data.name}`,
    `Email：${data.email}`,
    `公司／團隊：${optional(data.organization)}`,
    '',
    '【這次想處理的事】',
    data.situation,
    '',
    `【${data.serviceConfig.focusQuestion}】`,
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

const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
}[character]));

const htmlText = (value) => escapeHtml(value).replace(/\r?\n/g, '<br>');

export const buildEmailHtml = (data, leadId) => {
  const focusLabel = data.serviceConfig.focus[data.focus];
  const optional = (value) => value || '未提供';
  const source = data.attribution.source_key || 'direct';
  return `<!doctype html>
<html lang="zh-Hant">
  <body style="margin:0;background:#f4f0e8;color:#25324a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans TC',sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(data.name)} 提交了 ${escapeHtml(data.serviceConfig.label)} 申請。</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f0e8;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#fffdf8;border:1px solid #d8d1c5;">
            <tr>
              <td style="padding:30px 32px 24px;border-top:5px solid #6f5bd3;">
                <p style="margin:0 0 12px;color:#6f5bd3;font-size:13px;font-weight:700;letter-spacing:.06em;">${escapeHtml(data.serviceConfig.label)}</p>
                <h1 style="margin:0;color:#25324a;font-size:28px;line-height:1.35;letter-spacing:-.02em;">${escapeHtml(data.name)} 提交了新申請</h1>
                <p style="margin:12px 0 0;color:#5f6674;font-size:15px;line-height:1.7;">直接回覆這封信，就會寄到 ${escapeHtml(data.email)}。</p>
                <p style="margin:20px 0 0;">
                  <a href="mailto:${escapeHtml(data.email)}" style="display:inline-block;background:#25324a;color:#fffdf8;text-decoration:none;padding:12px 18px;font-size:15px;font-weight:700;">回覆申請人</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="width:96px;padding:10px 0;border-top:1px solid #e3ddd2;color:#7a7f89;font-size:13px;vertical-align:top;">申請編號</td>
                    <td style="padding:10px 0;border-top:1px solid #e3ddd2;color:#25324a;font-size:14px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;">${escapeHtml(leadId)}</td>
                  </tr>
                  <tr>
                    <td style="width:96px;padding:10px 0;border-top:1px solid #e3ddd2;color:#7a7f89;font-size:13px;vertical-align:top;">聯絡方式</td>
                    <td style="padding:10px 0;border-top:1px solid #e3ddd2;color:#25324a;font-size:14px;line-height:1.7;">${escapeHtml(data.email)}<br>${escapeHtml(optional(data.organization))}</td>
                  </tr>
                </table>

                <h2 style="margin:28px 0 10px;color:#25324a;font-size:17px;line-height:1.5;">這次想處理的事</h2>
                <div style="padding:16px 18px;background:#f7f3eb;border-left:4px solid #6f5bd3;color:#343d50;font-size:15px;line-height:1.8;">${htmlText(data.situation)}</div>

                <h2 style="margin:28px 0 8px;color:#25324a;font-size:17px;line-height:1.5;">${escapeHtml(data.serviceConfig.focusQuestion)}</h2>
                <p style="margin:0;color:#343d50;font-size:15px;line-height:1.8;">${escapeHtml(focusLabel)}</p>

                <h2 style="margin:28px 0 8px;color:#25324a;font-size:17px;line-height:1.5;">其他線索</h2>
                <p style="margin:0;color:#343d50;font-size:14px;line-height:1.8;"><strong>希望時間：</strong>${escapeHtml(optional(data.preferredTiming))}<br><strong>公開參考連結：</strong><br>${htmlText(optional(data.referenceLinks))}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#eee8dd;color:#737985;font-size:12px;line-height:1.75;">
                來源：${escapeHtml(source)} ／ ${escapeHtml(data.sourcePath || 'unknown')}<br>
                UTM：${escapeHtml(data.attribution.utm_source || 'none')} ／ ${escapeHtml(data.attribution.utm_medium || 'none')} ／ ${escapeHtml(data.attribution.utm_campaign || 'none')} ／ ${escapeHtml(data.attribution.utm_content || 'none')}<br>
                表單版本：${escapeHtml(data.applicationVersion || 'unknown')} ／ consent：agreed
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
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
      subject: `【新申請｜${data.serviceConfig.label}】${data.name}｜${leadId}`,
      text: buildEmailText(data, leadId),
      html: buildEmailHtml(data, leadId),
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
  if (!contentType.includes('application/json')) return json({ ok: false, message: '資料沒有正確送出，請重新整理後再試。' }, 415);

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 20_000) return json({ ok: false, message: '申請內容過長，請精簡後再試。' }, 413);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: '資料沒有正確送出，請重新整理後再試。' }, 400);
  }

  if (trimText(payload.website, 200)) {
    return json({ ok: true, leadId: 'CAB-RECEIVED', message: '資料已送出。' }, 201);
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
    return json({ ok: false, message: '安全檢查暫時無法完成，請稍後再試。', code: 'turnstile_unavailable' }, 503);
  }
  if (!turnstile.success) {
    return json({ ok: false, message: '安全檢查已失效，請再試一次。', code: 'turnstile_invalid' }, 422);
  }

  const leadId = makeLeadId(data.submissionId);
  let delivery;
  try {
    delivery = await sendApplicationEmail({ env, data, leadId });
  } catch {
    return json({ ok: false, message: '資料還沒有送出。請稍後再試，或直接寄到 cablate@cablate.com。', code: 'delivery_failed' }, 502);
  }

  return json({
    ok: true,
    leadId,
    service: data.service,
    delivery: delivery.id?.startsWith('dry-run-') ? 'dry_run' : 'email_sent',
    message: delivery.id?.startsWith('dry-run-')
      ? '本地測試完成，沒有寄出 Email。'
      : data.service === 'coaching'
        ? '我會先看你寫的內容。如果這次陪跑適合，我會寄信邀請你免費聊 30 分鐘。談完確認合作，才會收到正式方案與專屬優惠。'
        : '我會用你留下的 Email 回覆是否適合合作，以及接下來怎麼進行。',
  }, 201);
};
