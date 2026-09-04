import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getApiBaseUrl } from '../api/axios';

const ConnectGmail = () => {
  const { user, gmailConnected } = useAuth();
  const navigate = useNavigate();

  const handleConnect = () => {
    const backendUrl = getApiBaseUrl();
    const token = localStorage.getItem('mailmind_token');
    const connectUrl = token
      ? `${backendUrl}/gmail/connect?token=${encodeURIComponent(token)}`
      : `${backendUrl}/gmail/connect`;

    window.location.href = connectUrl;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center z-10">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl mb-4 text-indigo-400">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Connect your Gmail Account
        </h2>
        <p className="mt-2 text-slate-400">
          Link your Gmail via secure OAuth 2.0 to start managing your inbox with AI.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg z-10 px-4">
        <div className="glass-panel py-8 px-6 shadow-2xl rounded-2xl border border-slate-800">
          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3 p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-slate-200">100% OAuth 2.0 Secure</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  MailMind never requests or stores your password. Access is granted via Google official tokens.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <Sparkles className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-slate-200">AI Intelligent Features</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Summarize messages, generate replies, extract action items, and query inbox in natural language.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Minimal Scopes Required</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Only read, modify, and send permissions needed for inbox operation. Revoke anytime.
                </p>
              </div>
            </div>
          </div>

          {gmailConnected ? (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-400 text-sm font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Gmail account is connected and ready!</span>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 shadow-lg"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleConnect}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-indigo-600/30"
              >
                <img
                  src="https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_32dp.png"
                  alt="Gmail logo"
                  className="w-5 h-5 mr-3"
                />
                Connect Gmail with Google
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-300 transition-colors"
              >
                Skip for now (Preview Dashboard)
              </button>
            </div>
          )}

          <div className="mt-6 text-center border-t border-slate-800/80 pt-4 flex justify-center space-x-4 text-xs text-slate-400">
            <Link
              to="/terms"
              className="hover:text-slate-200 underline font-medium transition-colors"
            >
              Terms of Service
            </Link>
            <span>&bull;</span>
            <Link
              to="/privacy"
              className="hover:text-slate-200 underline font-medium transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectGmail;
