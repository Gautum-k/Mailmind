import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, Paperclip, Sparkles, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { sendEmailApi } from '../api/emails';
import { fetchTemplatesApi } from '../api/templates';

const ComposeModal = ({ isOpen, onClose, onSent }) => {
  const [to, setTo] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const [templates, setTemplates] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchTemplatesApi()
        .then((res) => {
          if (res.success) setTemplates(res.data || []);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectTemplate = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    const tmpl = templates.find((t) => t._id === selectedId);
    if (tmpl) {
      if (tmpl.subject) setSubject(tmpl.subject);
      if (tmpl.body) setBody(tmpl.body);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!to || !subject || !body) {
      setError('Please fill in recipient email, subject, and body.');
      return;
    }

    try {
      setIsSending(true);
      await sendEmailApi({ to, cc, bcc, subject, body });
      onSent();
      onClose();
      // Reset form
      setTo('');
      setCc('');
      setBcc('');
      setSubject('');
      setBody('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send email.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">New Message</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          {error && (
            <div className="text-xs text-red-400 font-medium bg-red-500/10 p-3 rounded-xl border border-red-500/30">
              {error}
            </div>
          )}

          {/* Template Selector if available */}
          {templates.length > 0 && (
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <select
                onChange={handleSelectTemplate}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Insert Saved Template...</option>
                {templates.map((tmpl) => (
                  <option key={tmpl._id} value={tmpl._id}>
                    {tmpl.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Recipients */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">To</label>
              <button
                type="button"
                onClick={() => setShowCc(!showCc)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {showCc ? 'Hide Cc/Bcc' : 'Cc / Bcc'}
              </button>
            </div>
            <input
              type="email"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="mt-1 w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Collapsible Cc / Bcc */}
          {showCc && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-medium text-slate-300">Cc</label>
                <input
                  type="email"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="cc@example.com"
                  className="mt-1 w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">Bcc</label>
                <input
                  type="email"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  placeholder="bcc@example.com"
                  className="mt-1 w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="text-xs font-medium text-slate-300">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject line"
              className="mt-1 w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email Body */}
          <div>
            <label className="text-xs font-medium text-slate-300">Body</label>
            <textarea
              rows={8}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email body..."
              className="mt-1 w-full p-4 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Footer controls */}
          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Email</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComposeModal;
