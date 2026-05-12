// Full Auth.js v5 config -- Node.js runtime only.
// Wraps the edge-safe config in auth.config.ts with the Drizzle adapter and
// the Resend magic-link provider.

import NextAuth from 'next-auth';
import Resend from 'next-auth/providers/resend';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db, users, accounts, sessions, verificationTokens } from '@/db';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.AUTH_EMAIL_FROM || 'onboarding@resend.dev',
      // Custom email template -- text-only for V1, keep it simple
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const { host } = new URL(url);
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: provider.from,
            to: email,
            subject: `Sign in to ${host}`,
            html: emailHtml({ url, host }),
            text: emailText({ url, host }),
          }),
        });
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`Resend send failed (${res.status}): ${body}`);
        }
      },
    }),
  ],
});

function emailHtml({ url, host }: { url: string; host: string }) {
  return `
<!DOCTYPE html>
<html>
  <body style="background:#0a0a0a;color:#e5e5e5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:40px 20px;margin:0;">
    <div style="max-width:480px;margin:0 auto;background:#141414;border:1px solid #262626;border-radius:8px;padding:32px;">
      <div style="font-family:'JetBrains Mono',monospace;color:#f97316;font-weight:600;font-size:13px;letter-spacing:0.05em;margin-bottom:24px;">PILL.FINANCE</div>
      <h1 style="font-size:22px;font-weight:600;margin:0 0 16px 0;color:#fafafa;">Your sign-in link</h1>
      <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 24px 0;">Click the button below to sign in to pill.finance. The link expires in 24 hours.</p>
      <a href="${url}" style="display:inline-block;background:#f97316;color:#0a0a0a;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:15px;">Sign in to ${host}</a>
      <p style="font-size:13px;color:#737373;margin:32px 0 0 0;line-height:1.5;">If you didn't request this email, you can safely ignore it. Nobody else can use this link.</p>
    </div>
    <div style="text-align:center;color:#525252;font-size:12px;margin-top:24px;">pill.finance &middot; market briefings without the bloat</div>
  </body>
</html>
  `.trim();
}

function emailText({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n\nClick the link below to sign in. The link expires in 24 hours.\n\n${url}\n\nIf you didn't request this, you can safely ignore this email.`;
}
