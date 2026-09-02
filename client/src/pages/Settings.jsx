import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Settings as SettingsIcon, ShieldCheck, Mail, Sparkles, LogOut, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Settings = () => {
  const { user, gmailConnected, refreshUser, logout } = useAuth();
  const navigate = useNavigate();

  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [disconnectMsg, setDisconnectMsg] = useState('');

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      await api.post('/gmail/disconnect');
      await refreshUser();
      setDisconnectMsg('Gmail account disconnected successfully.');
    } catch (err) {
      setDisconnectMsg('Failed to disconnect Gmail account.');
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar searchQuery="" setSearchQuery={() => {}} onExecuteSearch={() => navigate('/dashboard')} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeLabel="" onSelectLabel={() => navigate('/dashboard')} onOpenCompose={() => {}} />

        <main className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Account & Settings</h1>
              <p className="text-xs text-slate-400">
                Manage your MailMind profile, Gmail OAuth connection, and security.
              </p>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>MailMind Account Profile</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Full Name</span>
                <span className="text-slate-200 font-medium">{user?.name}</span>
              </div>
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email Address</span>
                <span className="text-slate-200 font-medium">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Gmail OAuth Connection Settings */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Mail className="w-5 h-5 text-indigo-400" />
                <span>Gmail OAuth Authorization</span>
              </h3>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  gmailConnected
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                {gmailConnected ? 'Connected & Active' : 'Not Connected'}
              </span>
            </div>

            {disconnectMsg && (
              <div className="text-xs text-indigo-300 bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/30">
                {disconnectMsg}
              </div>
            )}

            {gmailConnected ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Your Gmail account is authorized via Google OAuth 2.0. MailMind reads live messages and sends replies directly using official Google APIs.
                </p>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDisconnect}
                    disabled={isDisconnecting}
                    className="px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 font-semibold text-xs transition-colors"
                  >
                    {isDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Disconnect Gmail Account'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Connect your Gmail account to unlock live inbox sync, AI summarization, and reply drafting.
                </p>
                <button
                  onClick={() => navigate('/connect-gmail')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition-all"
                >
                  Connect Gmail Now
                </button>
              </div>
            )}
          </div>

          {/* Security & System Info */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Security & Privacy Controls</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>JWT Authentication tokens stored in secure HTTP-only cookies</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero raw passwords ever stored or requested for email access</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>DOMPurify XSS HTML body sanitization active on email views</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
