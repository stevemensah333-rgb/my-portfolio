const env = (globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
}).process?.env;

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
});

const clean = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') return json({ ok: false, message: 'Method not allowed.' }, 405);

    const origin = request.headers.get('origin');
    const forwardedHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host');

    if (origin && forwardedHost) {
      try {
        if (new URL(origin).host !== forwardedHost) return json({ ok: false, message: 'Request origin rejected.' }, 403);
      } catch {
        return json({ ok: false, message: 'Request origin rejected.' }, 403);
      }
    }

    let payload: Record<string, unknown>;
    try {
      payload = await request.json();
    } catch {
      return json({ ok: false, message: 'Invalid request body.' }, 400);
    }

    const name = clean(payload.name);
    const email = clean(payload.email);
    const message = clean(payload.message);
    const company = clean(payload.company);
    const startedAt = Number(payload.startedAt);

    if (company) return json({ ok: false, message: 'Submission rejected.' }, 400);
    if (!Number.isFinite(startedAt) || Date.now() - startedAt < 1500 || Date.now() - startedAt > 86_400_000) {
      return json({ ok: false, message: 'Please refresh the page and try again.' }, 400);
    }
    if (name.length < 2 || name.length > 100) return json({ ok: false, message: 'Enter a valid name.' }, 400);
    if (email.length > 254 || !emailPattern.test(email)) return json({ ok: false, message: 'Enter a valid email address.' }, 400);
    if (message.length < 20 || message.length > 5000) return json({ ok: false, message: 'Message must be between 20 and 5,000 characters.' }, 400);

    const apiKey = env?.RESEND_API_KEY;
    const from = env?.CONTACT_FROM_EMAIL;
    const to = env?.CONTACT_TO_EMAIL ?? 'stevemensah333@gmail.com';

    if (!apiKey || !from) {
      return json({ ok: false, message: 'The contact form is not configured yet.' }, 503);
    }

    const safeName = name.replace(/[\r\n]+/g, ' ');
    const providerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `portfolio-contact/${crypto.randomUUID()}`,
        'User-Agent': 'Stephen-Mensah-Portfolio/1.0',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio enquiry from ${safeName}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });

    const providerResult = await providerResponse.json().catch(() => null) as { id?: string } | null;
    if (!providerResponse.ok || !providerResult?.id) {
      return json({ ok: false, message: 'The email provider did not accept the message.' }, 502);
    }

    return json({ ok: true }, 202);
  },
};
