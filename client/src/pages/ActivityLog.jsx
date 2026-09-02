import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActivityApi } from '../api/activity';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Activity, Sparkles, Send, Trash2, Archive, Star, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActivityLog = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['activity'],
    queryFn: fetchActivityApi,
  });

  const activities = data?.data || [];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'summarize':
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case 'reply_generated':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'sent':
        return <Send className="w-4 h-4 text-emerald-400" />;
      case 'deleted':
        return <Trash2 className="w-4 h-4 text-red-400" />;
      case 'archived':
        return <Archive className="w-4 h-4 text-amber-400" />;
      case 'starred':
        return <Star className="w-4 h-4 text-yellow-400" />;
      case 'smart_search':
        return <Search className="w-4 h-4 text-blue-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar searchQuery="" setSearchQuery={() => {}} onExecuteSearch={() => navigate('/dashboard')} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeLabel="" onSelectLabel={() => navigate('/dashboard')} onOpenCompose={() => {}} />

        <main className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto w-full space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Activity Log</h1>
              <p className="text-xs text-slate-400">
                Track all actions and AI operations performed in your MailMind workspace.
              </p>
            </div>
          </div>

          {isError ? (
            <div className="glass-panel p-8 text-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-300 space-y-3">
              <p className="text-sm font-semibold">Unable to load activity logs.</p>
              <p className="text-xs text-amber-400/80">{error?.response?.data?.message || error?.message || 'Network request failed or timed out.'}</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs min-h-[44px] shadow-lg transition-all"
              >
                Retry Loading Activity
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : activities.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 text-slate-400">
              <p className="text-sm font-medium">No activity recorded yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Actions like AI summarization, reply generation, and email sending will appear here.
              </p>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
              {activities.map((act) => (
                <div key={act._id} className="p-4 flex items-center justify-between hover:bg-slate-900/60 transition-colors">
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0">
                      {getActivityIcon(act.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200 capitalize">
                        {act.type.replace('_', ' ')}
                      </h4>
                      {act.emailSubject && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          Subject: {act.emailSubject}
                        </p>
                      )}
                      {act.details && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {act.details}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(act.createdAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ActivityLog;
