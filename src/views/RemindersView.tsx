import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  BellRing,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldCheck,
  Calendar,
  Eye,
  RefreshCw,
  Zap,
  PhoneCall,
  Volume2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { initAuth, googleSignIn, getAccessToken, logout } from '../services/auth';
import {
  sendDailyReminderEmail,
  buildReminderEmailHtml,
  checkSmtpStatus,
  verifySmtpConnection,
  SmtpStatus,
} from '../services/gmail';
import { User } from 'firebase/auth';

export const RemindersView: React.FC = () => {
  const {
    profile,
    updateProfile,
    reminderSettings,
    updateReminderSettings,
    triggerIncomingCall,
    sentEmailRecords,
    addSentEmailRecord,
  } = useApp();

  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);
  const [sendErrorMessage, setSendErrorMessage] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // Server-side SMTP diagnostics state
  const [smtpStatus, setSmtpStatus] = useState<SmtpStatus | null>(null);
  const [isVerifyingSmtp, setIsVerifyingSmtp] = useState<boolean>(false);
  const [smtpVerifyResult, setSmtpVerifyResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
  } | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState<boolean>(false);

  // Surprise call timer state
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);
  const [scheduledCaller, setScheduledCaller] = useState<'ananya' | 'arjun'>('ananya');

  // Confirmation modal state
  const [confirmSendOpen, setConfirmSendOpen] = useState<boolean>(false);

  const loadSmtpStatus = async () => {
    try {
      const status = await checkSmtpStatus();
      setSmtpStatus(status);
    } catch (e) {
      console.error('Failed to load SMTP status:', e);
    }
  };

  useEffect(() => {
    loadSmtpStatus();
  }, []);

  const handleVerifySmtp = async () => {
    setIsVerifyingSmtp(true);
    setSmtpVerifyResult(null);
    try {
      const result = await verifySmtpConnection();
      setSmtpVerifyResult(result);
    } catch (err: any) {
      setSmtpVerifyResult({ success: false, error: err?.message || 'SMTP verification failed.' });
    } finally {
      setIsVerifyingSmtp(false);
    }
  };

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setHasToken(!!token);
      },
      () => {
        setGoogleUser(null);
        setHasToken(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Surprise phone call countdown timer
  useEffect(() => {
    if (countdownSeconds === null) return;
    if (countdownSeconds <= 0) {
      setCountdownSeconds(null);
      triggerIncomingCall(scheduledCaller, profile.selectedTrack, profile.targetCompany);
      return;
    }
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdownSeconds, scheduledCaller, profile.selectedTrack, profile.targetCompany]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setSendErrorMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setHasToken(true);
      }
    } catch (err: any) {
      console.error('Google sign-in failed:', err);
      setSendErrorMessage(err.message || 'Google sign-in was cancelled or failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setGoogleUser(null);
    setHasToken(false);
  };

  // Sample questions for the email
  const sampleEmailQuestions = [
    {
      category: 'System Architecture',
      question: 'How do you design an idempotent payment processing API to handle network retries?',
      tip: 'Mention UUID idempotency keys, distributed database transactions, and deduplication caches.',
    },
    {
      category: 'Data Structures & Algorithms',
      question: 'Explain the difference between B-Tree and Hash Indexing in relational database query planners.',
      tip: 'Highlight range scan queries (BETWEEN/ORDER BY) for B-Trees vs O(1) point lookups for Hash tables.',
    },
    {
      category: 'Behavioral & Leadership',
      question: 'Tell me about a time you had a technical disagreement with a team member and how you resolved it.',
      tip: 'Follow the STAR method: Situation, Task, Action, and Quantifiable Result.',
    },
  ];

  const handleTriggerSendEmail = async () => {
    setConfirmSendOpen(false);
    setIsSending(true);
    setSendSuccessMessage(null);
    setSendErrorMessage(null);

    try {
      const emailTarget = reminderSettings.recipientEmail || profile.email;
      const todayDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const res = await sendDailyReminderEmail({
        recipientEmail: emailTarget,
        recipientName: profile.name || 'Candidate',
        trackTitle: profile.selectedTrack,
        dateString: todayDate,
        questions: sampleEmailQuestions,
      });

      if (res.success) {
        const methodLabel =
          res.method === 'smtp'
            ? 'Gmail SMTP (smtp.gmail.com:587 STARTTLS)'
            : 'Gmail REST API';
        setSendSuccessMessage(
          `Daily reminder email successfully delivered to ${emailTarget} via ${methodLabel}! Message ID: ${res.messageId || 'generated'}`
        );
        addSentEmailRecord({
          recipient: emailTarget,
          subject: `Daily Interview Drill: ${profile.selectedTrack}`,
          status: 'sent',
          trackTitle: profile.selectedTrack,
          questionCount: sampleEmailQuestions.length,
        });
        updateReminderSettings({ lastSentDate: new Date().toISOString() });
      }
    } catch (err: any) {
      console.error('Failed to send reminder email:', err);
      const emailTarget = reminderSettings.recipientEmail || profile.email;
      const errorText = err.message || 'Failed to dispatch email via SMTP service.';
      setSendErrorMessage(errorText);
      addSentEmailRecord({
        recipient: emailTarget,
        subject: `Daily Interview Drill: ${profile.selectedTrack}`,
        status: 'failed',
        trackTitle: profile.selectedTrack,
        questionCount: sampleEmailQuestions.length,
      });
    } finally {
      setIsSending(false);
    }
  };

  const scheduleSurpriseCall = (minutes: number, caller: 'ananya' | 'arjun') => {
    setScheduledCaller(caller);
    setCountdownSeconds(minutes * 60);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[var(--primary)] via-[var(--accent)] to-[#0B0F19] text-white p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[var(--highlight)] border border-white/15">
            <BellRing className="w-3.5 h-3.5 text-[var(--highlight)]" />
            <span>Automated Candidate Engagement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Email Automation & Phone Call Reminders
          </h1>
          <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed">
            Configure automated daily practice drills sent straight to your inbox via Gmail API, and simulate
            spontaneous recruiter screening phone calls from Ananya and Arjun.
          </p>
        </div>
      </div>

      {/* Server-Side Gmail SMTP & OAuth Integration Card */}
      <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-card)] pb-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Gmail SMTP Delivery Service
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  smtp.gmail.com:587 (STARTTLS)
                </span>
                {smtpStatus?.configured ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    SMTP Configured ({smtpStatus.maskedAddress || 'Active'})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    Server Secrets Required
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                {smtpStatus?.configured
                  ? `Authenticated through server-side environment secrets. Daily reminder drills are dispatched directly to student inboxes.`
                  : `Automated delivery requires GMAIL_ADDRESS and GMAIL_APP_PASSWORD configured in server environment secrets.`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleVerifySmtp}
              disabled={isVerifyingSmtp}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-page)] text-[var(--text-primary)] border border-[var(--border-card)] hover:border-[var(--primary)] transition-all cursor-pointer disabled:opacity-50"
              title="Test direct STARTTLS connection to smtp.gmail.com:587"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[var(--primary)] ${isVerifyingSmtp ? 'animate-spin' : ''}`} />
              <span>{isVerifyingSmtp ? 'Testing Handshake...' : 'Test SMTP Handshake'}</span>
            </button>

            <button
              onClick={() => setShowSetupGuide((prev) => !prev)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-page)] border border-[var(--border-card)] cursor-pointer"
            >
              {showSetupGuide ? 'Hide Setup Guide' : 'Setup Guide'}
            </button>
          </div>
        </div>

        {/* Verification Result Banner */}
        {smtpVerifyResult && (
          <div
            className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
              smtpVerifyResult.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
            }`}
          >
            {smtpVerifyResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 space-y-1">
              <div className="font-bold">
                {smtpVerifyResult.success ? 'SMTP Verification Succeeded' : 'SMTP Verification Failed'}
              </div>
              <div className="leading-relaxed">
                {smtpVerifyResult.success ? smtpVerifyResult.message : smtpVerifyResult.error}
              </div>
            </div>
            <button
              onClick={() => setSmtpVerifyResult(null)}
              className="text-xs opacity-60 hover:opacity-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Setup Guide for Google App Password */}
        {showSetupGuide && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2.5">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>How to Configure Gmail SMTP Server Secrets:</span>
            </div>
            <p className="leading-relaxed">
              Google requires an <strong>App Password</strong> (not your regular account password) for SMTP over Port 587. Follow these 4 steps:
            </p>
            <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] leading-relaxed">
              <li>
                Open{' '}
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline font-semibold"
                >
                  myaccount.google.com/apppasswords
                </a>{' '}
                (requires 2-Step Verification enabled on your Google account).
              </li>
              <li>Name the app <strong>AI Interview Mentor</strong> and click <strong>Create</strong>.</li>
              <li>Copy the generated 16-character code (e.g. <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">abcd efgh ijkl mnop</code>).</li>
              <li>Add these server environment variables in your runtime settings or <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">.env</code>:
                <div className="mt-1.5 p-2.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-[10px] space-y-0.5">
                  <div>GMAIL_ADDRESS="your_email@gmail.com"</div>
                  <div>GMAIL_APP_PASSWORD="abcdefghijklmnop"</div>
                </div>
              </li>
            </ol>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              Note: Credentials remain strictly server-side and are never exposed in JavaScript bundles, responses, or client logs.
            </div>
          </div>
        )}

        {/* Companion Option: Google Workspace Account Connection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-card)]">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">
                {hasToken ? `Connected as ${googleUser?.email || profile.email}` : 'Google Workspace Account'}
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">
                {hasToken ? 'OAuth token active for fallback' : 'Sign in to link Google account & profile'}
              </div>
            </div>
          </div>
          <div>
            {!hasToken ? (
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="px-3.5 py-1.5 rounded-xl font-semibold text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer disabled:opacity-50"
              >
                {isSigningIn ? 'Connecting...' : 'Sign in with Google'}
              </button>
            ) : (
              <button
                onClick={handleSignOut}
                className="px-3 py-1 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>

        {/* Global Notifications */}
        {sendSuccessMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{sendSuccessMessage}</span>
            </div>
            <button
              onClick={() => setSendSuccessMessage(null)}
              className="text-xs opacity-60 hover:opacity-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {sendErrorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block">Email Delivery Failed:</span>
                <span className="leading-relaxed">{sendErrorMessage}</span>
              </div>
            </div>
            <button
              onClick={() => setSendErrorMessage(null)}
              className="text-xs opacity-60 hover:opacity-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Email Automation Settings (Left) & Phone Call Simulator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Email Configuration & Immediate Dispatch */}
        <div className="lg:col-span-7 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-card)] p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-3">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[var(--primary)]" />
              Daily Email Automation Settings
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={reminderSettings.enabled}
                onChange={(e) => updateReminderSettings({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-1.5">
                Recipient Email
              </label>
              <input
                type="email"
                value={reminderSettings.recipientEmail}
                onChange={(e) => updateReminderSettings({ recipientEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[var(--bg-page)] border border-[var(--border-card)] text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--primary)]"
                placeholder="name@gmail.com"
              />
              <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                Primary placement notification address
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-1.5">
                Preferred Reminder Time
              </label>
              <input
                type="time"
                value={reminderSettings.reminderTime}
                onChange={(e) => updateReminderSettings({ reminderTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[var(--bg-page)] border border-[var(--border-card)] text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
              <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                Daily scheduled morning dispatch
              </span>
            </div>
          </div>

          {/* Email Content Inclusions */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-1">
              Included in Each Daily Email:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-card)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderSettings.includeDailyQuestions}
                  onChange={(e) => updateReminderSettings({ includeDailyQuestions: e.target.checked })}
                  className="rounded text-[var(--primary)]"
                />
                <span className="text-[var(--text-primary)] font-medium">3 High-Yield Placement Questions</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-card)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderSettings.includeCoachTip}
                  onChange={(e) => updateReminderSettings({ includeCoachTip: e.target.checked })}
                  className="rounded text-[var(--primary)]"
                />
                <span className="text-[var(--text-primary)] font-medium">Coach Pro Tip from Ananya & Arjun</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-card)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderSettings.includeTrackProgress}
                  onChange={(e) => updateReminderSettings({ includeTrackProgress: e.target.checked })}
                  className="rounded text-[var(--primary)]"
                />
                <span className="text-[var(--text-primary)] font-medium">Track Readiness & STAR Checklist</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-card)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderSettings.autoSendEnabled}
                  onChange={(e) => updateReminderSettings({ autoSendEnabled: e.target.checked })}
                  className="rounded text-[var(--primary)]"
                />
                <span className="text-[var(--text-primary)] font-medium">Instant One-Click Mock Link</span>
              </label>
            </div>
          </div>

          {/* Email Actions */}
          <div className="pt-3 border-t border-[var(--border-card)] flex flex-wrap items-center gap-3">
            <button
              onClick={() => setConfirmSendOpen(true)}
              disabled={isSending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Delivering via Gmail SMTP...' : "Send Today's Reminder Email Now"}</span>
            </button>

            <button
              onClick={() => setShowPreviewModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--bg-page)] border border-[var(--border-card)] text-[var(--text-primary)] hover:border-[var(--primary)] cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[var(--primary)]" />
              <span>Preview HTML Email</span>
            </button>
          </div>
        </div>

        {/* Right Column: AI Phone Call Simulator */}
        <div className="lg:col-span-5 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-card)] p-6 shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-3">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                AI Phone Screening Simulator
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Live Audio
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Real cellular PSTN mobile calls require an external paid telephony carrier line (e.g. Twilio Voice).
              To give you the exact same authentic practice, this simulator triggers realistic incoming screening calls directly in your browser with dual-tone ringtones and spoken voice questions.
            </p>

            {/* Countdown Active Banner */}
            {countdownSeconds !== null && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-spin text-amber-600" />
                  <span>Incoming Recruiter Call Scheduled!</span>
                </div>
                <p>
                  {scheduledCaller === 'ananya' ? 'Ananya (HR)' : 'Arjun (Tech)'} will ring your browser in{' '}
                  <strong className="text-base font-mono">{countdownSeconds}s</strong>. Be ready!
                </p>
                <button
                  onClick={() => setCountdownSeconds(null)}
                  className="text-[11px] underline text-amber-800 dark:text-amber-300 hover:text-black cursor-pointer pt-1"
                >
                  Cancel scheduled call
                </button>
              </div>
            )}

            {/* Instant Test Call Buttons */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block">
                Trigger Immediate Phone Screening Call:
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => triggerIncomingCall('ananya', 'General HR Interview', profile.targetCompany)}
                  className="p-3 rounded-2xl bg-linear-to-br from-amber-500/10 to-amber-600/5 border border-amber-400/30 text-left hover:border-amber-500 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="font-bold text-xs text-[var(--text-primary)]">Ananya (HR)</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Behavioral & cultural phone screening
                  </p>
                </button>

                <button
                  onClick={() => triggerIncomingCall('arjun', profile.selectedTrack, profile.targetCompany)}
                  className="p-3 rounded-2xl bg-linear-to-br from-blue-500/10 to-blue-600/5 border border-blue-400/30 text-left hover:border-blue-500 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="font-bold text-xs text-[var(--text-primary)]">Arjun (Tech)</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Technical & problem-solving drill
                  </p>
                </button>
              </div>
            </div>

            {/* Surprise Call Timers */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block">
                Schedule Surprise Recruiter Call:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => scheduleSurpriseCall(1, 'ananya')}
                  className="py-2 px-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-card)] text-[var(--text-primary)] hover:border-[var(--primary)] text-xs font-semibold text-center cursor-pointer"
                >
                  In 1 Minute
                </button>
                <button
                  onClick={() => scheduleSurpriseCall(5, 'arjun')}
                  className="py-2 px-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-card)] text-[var(--text-primary)] hover:border-[var(--primary)] text-xs font-semibold text-center cursor-pointer"
                >
                  In 5 Minutes
                </button>
                <button
                  onClick={() => scheduleSurpriseCall(15, 'ananya')}
                  className="py-2 px-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-card)] text-[var(--text-primary)] hover:border-[var(--primary)] text-xs font-semibold text-center cursor-pointer"
                >
                  In 15 Minutes
                </button>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-card)] text-[11px] text-[var(--text-muted)] flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[var(--primary)] shrink-0" />
            <span>Audio ringtones use Web Audio API synthesizers. Ensure your browser speaker volume is enabled.</span>
          </div>
        </div>
      </div>

      {/* Sent Email History Records */}
      <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-card)] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Email Delivery & Dispatch Log
          </h3>
          <span className="text-xs text-[var(--text-muted)]">
            {sentEmailRecords.length} emails recorded
          </span>
        </div>

        {sentEmailRecords.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-muted)] text-xs border border-dashed border-[var(--border-card)] rounded-2xl">
            No emails sent yet. Connect with Google and click "Send Today's Reminder Email Now" to trigger your first drill!
          </div>
        ) : (
          <div className="space-y-2">
            {sentEmailRecords.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-card)] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                      item.status === 'sent'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {item.status === 'sent' ? '✓' : '!'}
                  </div>
                  <div>
                    <div className="font-bold text-[var(--text-primary)]">{item.subject}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      To: {item.recipient} • {item.trackTitle} • {item.questionCount} questions
                    </div>
                  </div>
                </div>
                <div className="text-right text-[11px] text-[var(--text-muted)]">
                  {new Date(item.timestamp).toLocaleTimeString()} • {new Date(item.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Confirmation Modal for email sending */}
      {confirmSendOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--border-card)] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              Send Daily Placement Reminder?
            </h3>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              This will dispatch your daily placement interview drill with 3 high-yield questions for{' '}
              <strong>{profile.selectedTrack}</strong> directly via server-side{' '}
              <strong>Gmail SMTP (smtp.gmail.com:587 STARTTLS)</strong> to:
            </p>

            <div className="p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-card)] text-xs font-mono font-bold text-[var(--text-primary)]">
              {reminderSettings.recipientEmail || profile.email}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmSendOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-page)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleTriggerSendEmail}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer shadow-xs"
              >
                Confirm & Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HTML Email Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                Live HTML Email Preview
              </h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 my-2 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div
                dangerouslySetInnerHTML={{
                  __html: buildReminderEmailHtml({
                    recipientEmail: reminderSettings.recipientEmail || profile.email,
                    recipientName: profile.name || 'Candidate',
                    trackTitle: profile.selectedTrack,
                    dateString: new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }),
                    questions: sampleEmailQuestions,
                  }),
                }}
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
