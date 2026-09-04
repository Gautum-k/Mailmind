import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  Lock,
  EyeOff,
  Database,
  KeyRound,
  Mail,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Trash2,
} from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">MailMind</span>
              <span className="text-[10px] uppercase font-semibold text-indigo-400 tracking-wider block -mt-1">
                Privacy Center
              </span>
            </div>
          </Link>
        </div>

        <Link
          to="/login"
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-700/60 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to MailMind</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 z-10 space-y-10">
        {/* Document Header Banner */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 rounded-full text-indigo-300 text-xs sm:text-sm font-medium">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Official MailMind Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy & Data Security
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Last Updated: September 4, 2026 &bull; MailMind is committed to transparent, secure, and user-first data practices.
          </p>
        </div>

        {/* Highlight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Zero Data Sales</h3>
            <p className="text-xs text-slate-400">
              We never sell, rent, or monetize your personal information or email data to advertisers or third parties.
            </p>
          </div>

          <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">No Email Caching</h3>
            <p className="text-xs text-slate-400">
              Emails are fetched live from Gmail API for real-time display and are never stored in a database.
            </p>
          </div>

          <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Full User Control</h3>
            <p className="text-xs text-slate-400">
              Disconnect your account or revoke Google OAuth permissions anytime with a single click.
            </p>
          </div>
        </div>

        {/* Detailed Sections Panel */}
        <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-slate-800 space-y-8 text-slate-300 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">1.</span>
              <span>Introduction & Scope</span>
            </h2>
            <p>
              MailMind ("we", "our", or "us") provides an AI-enhanced email productivity platform designed to help users summarize messages, organize threads, search in natural language, and draft replies efficiently.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, process, and protect your information when you access our application at <span className="text-indigo-300 font-mono text-xs">https://mailmind.onrender.com</span> or associated client interfaces. By connecting your Google Gmail account, you agree to the practices outlined in this document.
            </p>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">2.</span>
              <span>Gmail API Data & Information We Access</span>
            </h2>
            <p>
              MailMind connects directly to Google services using official <strong>Google OAuth 2.0</strong> authorization. We request access strictly to the minimum necessary Google API scopes to provide core email management functionality:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
              <li>
                <strong>Profile & Identity</strong> (<code className="text-indigo-300">userinfo.email</code>, <code className="text-indigo-300">userinfo.profile</code>): Primary email address and user display name to authenticate your session.
              </li>
              <li>
                <strong>Read Access</strong> (<code className="text-indigo-300">gmail.readonly</code>): Email message headers (From, To, Subject, Date), snippets, thread details, labels, and text/HTML body content for inbox display and AI features.
              </li>
              <li>
                <strong>Modify Access</strong> (<code className="text-indigo-300">gmail.modify</code>): Modifying message labels (marking read/unread, starring, archiving, moving to trash) when requested by you.
              </li>
              <li>
                <strong>Send Access</strong> (<code className="text-indigo-300">gmail.send</code>): Transmitting new email compositions or thread replies composed or confirmed by you.
              </li>
            </ul>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">3.</span>
              <span>How We Use Your Gmail Information</span>
            </h2>
            <p>We use the data accessed from Gmail exclusively for the following operational purposes:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs">Rendering your inbox folders, email threads, and search results in real time.</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs">Generating AI summaries, key action item extractions, and reply drafts via Gemini AI.</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs">Executing your explicit email actions (starring, archiving, sending, or deleting).</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs">Translating natural language queries into valid Gmail API search parameters.</span>
              </div>
            </div>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">4.</span>
              <span>Data Storage & Ephemeral Handling</span>
            </h2>
            <p>
              MailMind adheres to strict data minimization principles:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>
                <strong>No Email Database Storage</strong>: We do <em>not</em> store, archive, or cache your actual email messages, subject lines, body contents, or attachments in any persistent database. Email data is requested live from Gmail API on-demand and discarded immediately after rendering.
              </li>
              <li>
                <strong>OAuth Tokens</strong>: Encrypted Google OAuth access and refresh tokens are stored securely in MongoDB strictly to maintain your authenticated connection without requiring you to log in repeatedly.
              </li>
              <li>
                <strong>Activity Logs</strong>: Minimal operational logs (e.g. action timestamp, action type such as "starred" or "sent") are maintained for your personal Activity Log feature inside the platform.
              </li>
            </ul>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">5.</span>
              <span>Google Limited Use Disclosure Compliance</span>
            </h2>
            <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-2 text-xs text-indigo-200">
              <p className="font-semibold text-white">Google API Services User Data Policy Notice:</p>
              <p>
                MailMind's use and transfer to any other app of information received from Google APIs will adhere to the{' '}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-indigo-400 hover:text-indigo-300 inline-flex items-center"
                >
                  Google API Services User Data Policy <ExternalLink className="w-3 h-3 ml-1" />
                </a>
                , including the <strong>Limited Use requirements</strong>.
              </p>
              <p>
                Specifically: We do not transfer user data to third parties unless necessary to provide or improve app functionality, comply with applicable law, or as part of a merger/acquisition with explicit user consent.
              </p>
            </div>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">6.</span>
              <span>Disconnecting Gmail & Revoking Access</span>
            </h2>
            <p>You maintain total control over your Gmail integration and can revoke access at any time:</p>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span><strong>Inside MailMind:</strong> Go to <strong>Settings</strong> or <strong>Connect Gmail</strong> and click "Disconnect Gmail".</span>
                </div>
                <Link to="/settings" className="text-indigo-400 hover:underline font-semibold">Settings &rarr;</Link>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  <span><strong>Via Google Account:</strong> Visit your Google Security Settings page under Third-Party Apps.</span>
                </div>
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline font-semibold inline-flex items-center"
                >
                  Google Permissions <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Upon disconnection, stored OAuth tokens are permanently removed from our database and active API tokens are revoked with Google.
            </p>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">7.</span>
              <span>Contact Us</span>
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or MailMind's data security practices, please contact our Data Protection Officer:
            </p>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center space-x-3 text-slate-200 text-sm">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-white">MailMind Privacy Support</p>
                <a href="mailto:ofcgautum2007@gmail.com" className="text-indigo-400 hover:underline font-mono text-xs">
                  ofcgautum2007@gmail.com
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Page Footer */}
        <footer className="text-center text-xs text-slate-500 space-y-2 pt-6 border-t border-slate-800/60">
          <p>&copy; 2026 MailMind AI Platform. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <Link to="/privacy" className="text-slate-400 hover:text-slate-200">Privacy Policy</Link>
            <span>&bull;</span>
            <Link to="/login" className="text-slate-400 hover:text-slate-200">Sign In</Link>
            <span>&bull;</span>
            <Link to="/signup" className="text-slate-400 hover:text-slate-200">Get Started</Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
