import { getAccessToken } from './auth';

export interface DailyReminderEmailData {
  recipientEmail: string;
  recipientName: string;
  trackTitle: string;
  questions: {
    category: string;
    question: string;
    tip: string;
  }[];
  dateString: string;
}

export interface SentEmailLog {
  id: string;
  recipient: string;
  subject: string;
  timestamp: string;
  status: 'sent' | 'failed';
  previewText: string;
}

/**
 * Encodes a string to RFC 4648 Base64URL without padding, handling UTF-8 characters safely.
 */
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Builds an RFC 2822 email format string with MIME HTML parts.
 */
export function buildReminderEmailHtml(data: DailyReminderEmailData): string {
  const questionsHtml = data.questions
    .map(
      (q, idx) => `
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
        <div style="display: inline-block; font-size: 11px; font-weight: bold; color: #1d4ed8; background: #dbeafe; padding: 2px 8px; border-radius: 6px; margin-bottom: 8px;">
          Question ${idx + 1} • ${q.category}
        </div>
        <div style="font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 6px;">
          ${q.question}
        </div>
        <div style="font-size: 12px; color: #475569; font-style: italic;">
          💡 Pro Tip: ${q.tip}
        </div>
      </div>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Daily Interview Drill</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fb; margin: 0; padding: 24px; color: #0f172a;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb, #1e1b4b); padding: 32px 24px; color: #ffffff; text-align: center;">
          <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.9; font-weight: bold; margin-bottom: 8px;">
            AI Interview Mentor • Daily Placement Drill
          </div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 800;">
            Ready for your daily practice, ${data.recipientName}?
          </h1>
          <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.85;">
            Track: <strong style="color: #fde047;">${data.trackTitle}</strong> • ${data.dateString}
          </p>
        </div>

        <!-- Body Content -->
        <div style="padding: 24px;">
          <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-top: 0;">
            Consistency is the single highest predictor of placement success. Here are your 3 high-yield questions for today, curated by AI Interviewers Ananya (HR) and Arjun (Tech):
          </p>

          ${questionsHtml}

          <!-- Quote / Coach encouragement -->
          <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 14px; border-radius: 8px; margin: 20px 0;">
            <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #1d4ed8; margin-bottom: 4px;">
              Interviewer Advice of the Day:
            </div>
            <div style="font-size: 13px; color: #334155;">
              "Structure your answers with the STAR framework for behavioral questions, and state time/space complexity before coding on technical algorithms."
            </div>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 28px 0 16px 0;">
            <a href="${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}" style="display: inline-block; background: #1d4ed8; color: #ffffff; font-weight: bold; font-size: 14px; padding: 12px 28px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 10px rgba(29, 78, 216, 0.3);">
              Start Spoken Live Mock Now →
            </a>
          </div>

          <p style="text-align: center; font-size: 11px; color: #94a3b8; margin: 0;">
            You received this email because you configured automated daily interview drills in AI Interview Mentor.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export interface SmtpStatus {
  configured: boolean;
  hasAddress: boolean;
  hasPassword: boolean;
  maskedAddress: string;
  host: string;
  port: number;
  security: string;
  guidance: string;
}

/**
 * Checks server-side SMTP configuration status.
 */
export async function checkSmtpStatus(): Promise<SmtpStatus> {
  try {
    const res = await fetch('/api/email/status');
    if (!res.ok) {
      throw new Error(`Failed to check SMTP status (${res.status})`);
    }
    return await res.json();
  } catch (err: any) {
    return {
      configured: false,
      hasAddress: false,
      hasPassword: false,
      maskedAddress: '',
      host: 'smtp.gmail.com',
      port: 587,
      security: 'STARTTLS',
      guidance: err?.message || 'Unable to check SMTP status from server.',
    };
  }
}

/**
 * Triggers server-side SMTP handshake verification to smtp.gmail.com:587.
 */
export async function verifySmtpConnection(): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/email/verify-smtp', { method: 'POST' });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'SMTP verification failed.' };
    }
    return { success: true, message: data.message };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error reaching SMTP verification service.' };
  }
}

/**
 * Sends a daily reminder email.
 * Primary method: Server-side Gmail SMTP (smtp.gmail.com:587 with STARTTLS).
 * Fallback method: Direct Gmail REST API if a client OAuth token is authorized.
 */
export async function sendDailyReminderEmail(
  data: DailyReminderEmailData
): Promise<{ success: boolean; messageId?: string; method?: 'smtp' | 'oauth'; error?: string }> {
  const subject = `🎯 Daily Interview Drill: ${data.trackTitle} (${data.dateString})`;
  const htmlBody = buildReminderEmailHtml(data);

  // 1. Attempt Server-Side Gmail SMTP
  try {
    const smtpRes = await fetch('/api/email/send-reminder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientEmail: data.recipientEmail,
        recipientName: data.recipientName,
        trackTitle: data.trackTitle,
        dateString: data.dateString,
        questions: data.questions,
        subject,
        htmlBody,
      }),
    });

    const smtpJson = await smtpRes.json();
    if (smtpRes.ok && smtpJson.success) {
      return {
        success: true,
        messageId: smtpJson.messageId,
        method: 'smtp',
      };
    }

    // If SMTP failed with a specific server error, capture it
    const smtpError = smtpJson.error || `Server SMTP responded with status ${smtpRes.status}`;

    // 2. Check if user has connected a client OAuth Google token as an alternative
    const token = await getAccessToken();
    if (token) {
      try {
        const emailLines = [
          `To: ${data.recipientEmail}`,
          `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
          'MIME-Version: 1.0',
          'Content-Type: text/html; charset=utf-8',
          'Content-Transfer-Encoding: base64',
          '',
          btoa(unescape(encodeURIComponent(htmlBody))),
        ];
        const rawMessage = emailLines.join('\r\n');
        const base64UrlMessage = base64UrlEncode(rawMessage);

        const oauthRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ raw: base64UrlMessage }),
        });

        if (oauthRes.ok) {
          const oauthJson = await oauthRes.json();
          return { success: true, messageId: oauthJson.id, method: 'oauth' };
        }
      } catch (oauthErr) {
        console.warn('OAuth fallback also failed:', oauthErr);
      }
    }

    // Return the informative server SMTP error message
    throw new Error(smtpError);
  } catch (err: any) {
    console.error('sendDailyReminderEmail failure:', err);
    throw err;
  }
}
