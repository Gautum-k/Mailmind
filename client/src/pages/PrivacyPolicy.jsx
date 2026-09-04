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
  Server,
  UserX,
  Clock,
  ShieldAlert,
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
            Effective Date: September 4, 2026 &bull; MailMind is committed to transparent, secure, and user-first data practices.
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
              We never sell, rent, share, or monetize your Gmail data or personal information with advertisers or third parties.
            </p>
          </div>

          <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">No Email Caching</h3>
            <p className="text-xs text-slate-400">
              Emails are fetched live from Gmail API on-demand and are never stored or cached in a database.
            </p>
          </div>

          <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Full Access Control</h3>
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
              This Privacy Policy explains how we collect, use, process, store, and protect your information when you access our application at <span className="text-indigo-300 font-mono text-xs">https://mailmind.onrender.com</span> or associated client interfaces. By connecting your Google Gmail account, you agree to the practices outlined in this document.
            </p>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">2.</span>
              <span>Exact Gmail OAuth Scopes Requested & Permissions</span>
            </h2>
            <p>
              MailMind connects to Google services strictly via official <strong>Google OAuth 2.0</strong> authorization. Below is the exact list of Google API permissions requested and a plain-language explanation of how each is used:
            </p>
            <div className="space-y-3 pt-2">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-indigo-400 font-mono">https://www.googleapis.com/auth/gmail.readonly</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Read-only access:</strong> Used to fetch and display your email messages, headers (From, To, Subject, Date), snippets, thread structures, and message body text/HTML inside your MailMind dashboard, as well as to power natural language search and AI email summarization.
                </p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-indigo-400 font-mono">https://www.googleapis.com/auth/gmail.modify</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Label & Status modification:</strong> Used to add or remove message labels (such as starring/unstarring, archiving by removing INBOX label, marking messages as read/unread, or moving messages to trash) when you perform those actions in the app.
                </p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-indigo-400 font-mono">https://www.googleapis.com/auth/gmail.send</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Send emails:</strong> Used exclusively to transmit new emails or thread replies that you explicitly compose, review, and confirm inside MailMind.
                </p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-indigo-400 font-mono">userinfo.email &amp; userinfo.profile</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Identity verification:</strong> Used to verify your primary Gmail address and display name for session authentication and account creation.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">3.</span>
              <span>Data Collection, Ephemeral Handling & Storage Location</span>
            </h2>
            <p>
              MailMind strictly adheres to data minimization and privacy-first principles:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>
                <strong>No Email Caching or Storage:</strong> We do <em>not</em> store, archive, or cache your actual email body text, HTML contents, attachments, subject lines, or recipient lists in any database or file system. Email data is fetched live on-demand from Google's Gmail API and is discarded from memory immediately after rendering in your browser.
              </li>
              <li>
                <strong>Data Retention Period:</strong> Live email content exists only temporarily in volatile server memory for the duration of the HTTP rendering request (fraction of a second).
              </li>
              <li>
                <strong>OAuth Tokens Storage:</strong> Encrypted Google OAuth access tokens, refresh tokens, and expiration timestamps are stored securely in our MongoDB database strictly to maintain your active connection without requiring re-authentication on every page visit.
              </li>
              <li>
                <strong>Operational Activity Logs:</strong> Minimal operational logs (e.g. action timestamp, action type such as "starred" or "sent", and email subject line) are stored to populate your personal Activity Log feature inside MailMind.
              </li>
            </ul>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">4.</span>
              <span>No Third-Party Sharing, Sales, or Advertising</span>
            </h2>
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-2 text-xs text-emerald-200">
              <p className="font-semibold text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Strict Prohibition on Data Sales & Advertising:</span>
              </p>
              <p>
                MailMind <strong>NEVER SHARES, SELLS, RENTS, OR TRADES YOUR GMAIL DATA</strong> or personal information to third parties, data brokers, or advertising networks under any circumstances.
              </p>
              <p>
                Your Gmail data is <strong>never used for serving advertisements</strong>, retargeting, building user profiles for commercial targeting, or training generalized artificial intelligence models.
              </p>
            </div>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">5.</span>
              <span>Google API Limited Use Disclosure Compliance</span>
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
              <span>Data Security Measures</span>
            </h2>
            <p>We enforce industry-standard security protections to keep your connection safe:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start space-x-2">
                <Lock className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span><strong>Encryption in Transit:</strong> All data transmitted between your browser, MailMind backend servers, and Google APIs is encrypted using TLS/HTTPS 1.3 protocols.</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start space-x-2">
                <Server className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span><strong>Secure Token Handling:</strong> OAuth refresh tokens are encrypted at rest and accessed strictly through authenticated backend logic.</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Session Protections:</strong> Authentication tokens are secured with HTTP-only cookies and Bearer JWT validation.</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start space-x-2">
                <Clock className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span><strong>Automatic Token Expiry:</strong> OAuth tokens proactively expire and refresh, reducing authorization exposure.</span>
              </div>
            </div>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">7.</span>
              <span>Disconnecting Gmail & Revoking Access</span>
            </h2>
            <p>You maintain 100% ownership and control over your Gmail integration. You can revoke access at any time through either of the following methods:</p>
            <div className="space-y-2 text-xs">
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span><strong>Inside MailMind:</strong> Go to <strong>Settings</strong> or <strong>Connect Gmail</strong> and click "Disconnect Gmail".</span>
                </div>
                <Link to="/settings" className="text-indigo-400 hover:underline font-semibold">Settings &rarr;</Link>
              </div>
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  <span><strong>Via Google Permissions:</strong> Manage third-party app access on Google Account Permissions.</span>
                </div>
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline font-semibold inline-flex items-center"
                >
                  myaccount.google.com/permissions <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Upon disconnection inside MailMind, your stored OAuth tokens are immediately revoked with Google and purged permanently from our database.
            </p>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">8.</span>
              <span>User Rights & Account / Data Deletion Requests</span>
            </h2>
            <p>
              You have the right to request access to, correction of, or permanent deletion of your MailMind account and personal data:
            </p>
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2 text-xs">
              <p>
                To request complete account deletion, disconnect your Gmail integration and send an email request to <a href="mailto:ofcgautum2007@gmail.com" className="text-indigo-400 underline font-mono">ofcgautum2007@gmail.com</a> with the subject line <em>"Data Deletion Request"</em>.
              </p>
              <p>
                All account profile records, preferences, and OAuth tokens associated with your email address will be purged from our database within 7 business days.
              </p>
            </div>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">9.</span>
              <span>Children's Privacy Protection</span>
            </h2>
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-200 font-semibold">
                <UserX className="w-4 h-4 text-indigo-400" />
                <span>Under 13 Restriction Notice:</span>
              </div>
              <p>
                MailMind is an email productivity platform intended solely for individuals who are at least 13 years of age (or older, where required by local law).
              </p>
              <p>
                We do not knowingly collect, solicit, or process personal data or Gmail access from children under 13. If we become aware that a user under 13 has connected an account, we will immediately revoke tokens and delete all associated user records.
              </p>
            </div>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">10.</span>
              <span>Policy Updates & Changes</span>
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our service, regulatory requirements, or Google API policy updates.
            </p>
            <p className="text-xs text-slate-400">
              When updates are published, we will revise the "Effective Date" at the top of this policy. For material changes affecting data usage or permissions, we will provide notice via the platform or through email.
            </p>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 11 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">11.</span>
              <span>Contact Us</span>
            </h2>
            <p>
              If you have any questions, concerns, or privacy requests regarding this Privacy Policy or MailMind's data security practices, please contact our Data Protection Officer:
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
            <Link to="/terms" className="text-slate-400 hover:text-slate-200">Terms of Service</Link>
            <span>&bull;</span>
            <Link to="/login" className="text-slate-400 hover:text-slate-200">Sign In</Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
