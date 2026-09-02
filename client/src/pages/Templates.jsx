import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTemplatesApi, createTemplateApi, deleteTemplateApi } from '../api/templates';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FileText, Plus, Trash2, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Templates = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState('');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplatesApi,
  });

  const templates = data?.data || [];

  const createMutation = useMutation({
    mutationFn: (newTmpl) => createTemplateApi(newTmpl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      setName('');
      setSubject('');
      setBody('');
      setIsCreating(false);
    },
    onError: (err) => {
      setFormError(err.response?.data?.message || 'Failed to create template.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTemplateApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!name || !body) {
      setFormError('Template name and body content are required.');
      return;
    }
    createMutation.mutate({ name, subject, body });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar searchQuery="" setSearchQuery={() => {}} onExecuteSearch={() => navigate('/dashboard')} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeLabel="" onSelectLabel={() => navigate('/dashboard')} onOpenCompose={() => {}} />

        <main className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Email Templates</h1>
                <p className="text-xs text-slate-400">
                  Save reusable email responses and insert them instantly into any compose draft.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCreating(!isCreating)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isCreating ? 'Cancel' : 'Create Template'}</span>
            </button>
          </div>

          {/* Create Form */}
          {isCreating && (
            <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Add New Email Template</h3>
              {formError && (
                <div className="text-xs text-red-400 font-medium bg-red-500/10 p-3 rounded-xl border border-red-500/30">
                  {formError}
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-slate-300">Template Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Follow Up After Meeting"
                  className="mt-1 w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Default Subject (Optional)</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Following up on our discussion"
                  className="mt-1 w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Template Body Content</label>
                <textarea
                  rows={5}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write reusable template body content..."
                  className="mt-1 w-full p-4 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition-all"
                >
                  {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Template'}
                </button>
              </div>
            </form>
          )}

          {/* Templates Grid */}
          {isError ? (
            <div className="glass-panel p-8 text-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-300 space-y-3">
              <p className="text-sm font-semibold">Unable to load templates.</p>
              <p className="text-xs text-amber-400/80">{error?.response?.data?.message || error?.message || 'Network request failed or timed out.'}</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs min-h-[44px] shadow-lg transition-all"
              >
                Retry Loading Templates
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : templates.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 text-slate-400">
              <p className="text-sm font-medium">No saved templates found.</p>
              <p className="text-xs text-slate-500 mt-1">
                Click 'Create Template' above to add your first reusable message template.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {templates.map((tmpl) => (
                <div key={tmpl._id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">{tmpl.name}</h3>
                      <button
                        onClick={() => deleteMutation.mutate(tmpl._id)}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete Template"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {tmpl.subject && (
                      <p className="text-xs font-semibold text-indigo-400 mt-1">
                        Subject: {tmpl.subject}
                      </p>
                    )}
                    <p className="text-xs text-slate-300 line-clamp-4 mt-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      {tmpl.body}
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Created {new Date(tmpl.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Templates;
