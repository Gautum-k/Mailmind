import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Scale,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

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
                Terms & Conditions
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
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Official MailMind Terms of Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service & Usage Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Effective Date: September 4, 2026 &bull; Please read these terms carefully before using the MailMind platform.
          </p>
        </div>

        {/* Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Fair Usage</h3>
            <p className="text-xs text-slate-400">
              Users agree to use MailMind for lawful email productivity and organization purposes.
            </p>
          </div>

          <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Google Integration</h3>
            <p className="text-xs text-slate-400">
              Gmail connectivity is authorized via official Google OAuth 2.0 protocols.
            </p>
          </div>

          <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">AI Assistance</h3>
            <p className="text-xs text-slate-400">
              AI generated summaries and reply drafts are computer-assisted tools for user review.
            </p>
          </div>
        </div>

        {/* Detailed Sections Panel */}
        <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-slate-800 space-y-8 text-slate-300 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">1.</span>
              <span>Acceptance of Terms</span>
            </h2>
            <p>
              By creating an account, accessing, or using MailMind ("the Platform", "Service", "we", "us"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access or use the Service.
            </p>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">2.</span>
              <span>Description of Service & AI Features</span>
            </h2>
            <p>
              MailMind is an intelligent email assistant application that connects to your Google Gmail account via Google OAuth 2.0. The Service provides:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
              <li>Inbox display, folder filtering, and message thread viewing.</li>
              <li>Natural language search query translation for Gmail.</li>
              <li>AI-powered email summarization and action item extraction using Gemini AI.</li>
              <li>Automated smart reply draft generation for user review and sending.</li>
              <li>Email organization actions (starring, archiving, moving to trash, sending messages).</li>
            </ul>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">3.</span>
              <span>User Responsibilities & Acceptable Use</span>
            </h2>
            <p>As a condition of using MailMind, you agree to the following obligations:</p>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials and for all activities conducted under your account.</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Lawful Use:</strong> You agree not to use the Service for sending spam, transmitting illegal content, violating copyright or privacy rights, or attempting unauthorized access to any system.</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Reviewing AI Content:</strong> AI-generated reply drafts and summaries are provided for assistance. You are solely responsible for reviewing and confirming the accuracy of any email before sending it.</span>
              </div>
            </div>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">4.</span>
              <span>Google Gmail Integration & Token Security</span>
            </h2>
            <p>
              MailMind integrates with Google API Services strictly in accordance with Google's official policies:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>
                <strong>Google OAuth Authorization:</strong> Access to your Gmail account is authorized via Google OAuth 2.0 using requested scopes. MailMind does not request or see your Google password.
              </li>
              <li>
                <strong>Privacy Policy Compliance:</strong> All Gmail data processing adheres to our <Link to="/privacy" className="text-indigo-400 underline">Privacy Policy</Link> and the Google API Services User Data Policy.
              </li>
              <li>
                <strong>Access Revocation:</strong> You may disconnect your Gmail integration at any time inside MailMind Settings or directly via <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">Google Security Permissions</a>.
              </li>
            </ul>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">5.</span>
              <span>Limitation of Liability & Disclaimers</span>
            </h2>
            <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl space-y-2 text-xs text-amber-200">
              <p className="font-semibold text-white flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Service Disclaimer ("AS IS" Basis):</span>
              </p>
              <p>
                MailMind is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied, including merchantability, fitness for a particular purpose, or non-infringement.
              </p>
              <p>
                In no event shall MailMind or its developers be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service, third-party API outages, or computer-generated AI output errors.
              </p>
            </div>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">6.</span>
              <span>Account Termination & Suspension</span>
            </h2>
            <p>
              We reserve the right to suspend or terminate your account or access to the Service at our sole discretion, without prior notice, if you violate these Terms of Service or engage in fraudulent or abusive activities.
            </p>
            <p className="text-xs text-slate-400">
              You may stop using the Service and request account deletion at any time by disconnecting your Gmail integration and contacting support.
            </p>
          </section>

          <hr className="border-slate-800/80" />

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-indigo-400">7.</span>
              <span>Contact & Questions</span>
            </h2>
            <p>
              If you have any questions or feedback regarding these Terms of Service, please reach out to our team:
            </p>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center space-x-3 text-slate-200 text-sm">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-white">MailMind Legal & Terms Support</p>
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
            <Link to="/terms" className="text-slate-400 hover:text-slate-200">Terms of Service</Link>
            <span>&bull;</span>
            <Link to="/privacy" className="text-slate-400 hover:text-slate-200">Privacy Policy</Link>
            <span>&bull;</span>
            <Link to="/login" className="text-slate-400 hover:text-slate-200">Sign In</Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default TermsOfService;
