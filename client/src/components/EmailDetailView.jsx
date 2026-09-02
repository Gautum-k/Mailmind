import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import {
  Sparkles,
  Archive,
  Trash2,
  Star,
  Send,
  Loader2,
  CheckCircle2,
  ListTodo,
  Paperclip,
  ArrowLeft,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import {
  summarizeEmailApi,
  generateReplyApi,
  extractActionsApi,
  extractDatesApi,
} from '../api/ai';
import { replyEmailApi } from '../api/emails';

const EmailDetailView = ({
  email,
  isLoading,
  onBack,
  onArchive,
  onDelete,
  onToggleStar,
}) => {
  const [summaryData, setSummaryData] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizeError, setSummarizeError] = useState('');

  const [aiTone, setAiTone] = useState('Professional');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [replyGenError, setReplyGenError] = useState('');

  const [actionItems, setActionItems] = useState([]);
  const [isExtractingActions, setIsExtractingActions] = useState(false);

  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState('');
  const [replyError, setReplyError] = useState('');

  useEffect(() => {
    setSummaryData(null);
    setSummarizeError('');
    setGeneratedDraft('');
    setReplyGenError('');
    setActionItems([]);
    setReplyText('');
    setReplySuccess('');
    setReplyError('');
  }, [email?.id]);

  if (isLoading || !email) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-sm font-medium text-slate-300">Loading email contents...</p>
      </div>
    );
  }

  const sanitizedHtml = DOMPurify.sanitize(email.bodyHtml || email.bodyText || '<p>No message body content</p>');

  const handleSummarize = async () => {
    try {
      setIsSummarizing(true);
      setSummarizeError('');
      const res = await summarizeEmailApi({
        emailId: email.id,
        subject: email.subject,
        bodyText: email.bodyText || email.bodyHtml,
      });
      if (res.success) {
        setSummaryData(res.data);
      }
    } catch (err) {
      setSummarizeError(err.response?.data?.message || 'Gemini API key is missing or failed.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateReply = async () => {
    try {
      setIsGeneratingReply(true);
      setReplyGenError('');
      const res = await generateReplyApi({
        emailId: email.id,
        subject: email.subject,
        bodyText: email.bodyText || email.bodyHtml,
        tone: aiTone,
        senderName: email.from,
      });
      if (res.success && res.data.reply) {
        setGeneratedDraft(res.data.reply);
        setReplyText(res.data.reply);
      }
    } catch (err) {
      setReplyGenError(err.response?.data?.message || 'Gemini API key is missing or failed.');
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const handleExtractActions = async () => {
    try {
      setIsExtractingActions(true);
      const res = await extractActionsApi({
        emailId: email.id,
        subject: email.subject,
        bodyText: email.bodyText || email.bodyHtml,
      });
      if (res.success && res.data.actionItems) {
        setActionItems(res.data.actionItems);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExtractingActions(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setIsSendingReply(true);
      setReplyError('');
      setReplySuccess('');
      await replyEmailApi(email.id, replyText);
      setReplySuccess('Reply sent successfully via Gmail API!');
      setReplyText('');
    } catch (err) {
      setReplyError(err.response?.data?.message || 'Failed to send reply.');
    } finally {
      setIsSendingReply(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto">
      {/* Header Toolbar */}
      <div className="px-4 sm:px-6 py-3 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          {/* Back to Inbox button on mobile */}
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            onClick={() => onToggleStar(email.id, !email.isStarred)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Star email"
          >
            <Star
              className={`w-4 h-4 ${
                email.isStarred ? 'text-amber-400 fill-amber-400' : ''
              }`}
            />
          </button>
          <button
            onClick={() => onArchive(email.id)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Archive email"
          >
            <Archive className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(email.id)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-red-400 transition-colors"
            title="Delete email"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* AI Triggers */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-semibold text-xs transition-all shadow-sm"
          >
            {isSummarizing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span>Summarize</span>
          </button>

          <button
            onClick={handleExtractActions}
            disabled={isExtractingActions}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 font-semibold text-xs transition-all"
          >
            {isExtractingActions ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ListTodo className="w-3.5 h-3.5 text-purple-400" />
            )}
            <span className="hidden sm:inline">Action Items</span>
          </button>
        </div>
      </div>

      {/* Main Email Body */}
      <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full">
        {/* Subject Header */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
            {email.subject}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-medium">
              {email.date ? new Date(email.date).toLocaleString() : ''}
            </span>
          </div>
        </div>

        {/* AI Error Notification */}
        {summarizeError && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
              <span>{summarizeError}</span>
            </div>
            <button
              onClick={handleSummarize}
              className="ml-3 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold min-h-[36px] flex items-center space-x-1.5 transition-colors border border-amber-500/30"
            >
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* AI Summary Widget Box */}
        {summaryData && (
          <div className="glass-panel p-5 rounded-2xl border border-indigo-500/40 ai-border-glow space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-indigo-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-xs font-bold tracking-wider uppercase">AI Executive Summary</h3>
              </div>
              <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                {summaryData.estimatedReadTime || '1 min read'}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              💡 {summaryData.keyTakeaway}
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300 pl-4 list-disc">
              {summaryData.summary?.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Extracted Actions Box */}
        {actionItems.length > 0 && (
          <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-purple-400">
              <ListTodo className="w-5 h-5" />
              <h3 className="text-xs font-bold tracking-wider uppercase">Extracted Action Checklist</h3>
            </div>
            <div className="space-y-2 pt-1">
              {actionItems.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs text-slate-200 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>{item.task}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sender Card */}
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800/80 flex items-start justify-between">
          <div className="flex items-start space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
              {(email.from || 'S').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{email.from}</h4>
              <p className="text-xs text-slate-400 truncate mt-0.5">To: {email.to}</p>
              {email.cc && <p className="text-xs text-slate-500 truncate">Cc: {email.cc}</p>}
            </div>
          </div>
        </div>

        {/* Message Content Body */}
        <div className="p-5 sm:p-6 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-200 text-sm leading-relaxed overflow-x-auto min-h-[150px]">
          <div
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            className="prose prose-invert max-w-none text-xs sm:text-sm"
          />
        </div>

        {/* Attachments */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Paperclip className="w-4 h-4 text-indigo-400" />
              <span>Attachments ({email.attachments.length})</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {email.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center space-x-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                >
                  <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-medium">{att.filename}</span>
                  <span className="text-[10px] text-slate-500">
                    ({Math.round(att.size / 1024)} KB)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Reply Assistant Panel */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-sm font-bold tracking-wide">AI Reply Assistant</h3>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-xs text-slate-400 font-medium">Tone:</label>
              <select
                value={aiTone}
                onChange={(e) => setAiTone(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Professional">Professional</option>
                <option value="Friendly">Friendly</option>
                <option value="Formal">Formal</option>
                <option value="Concise">Concise</option>
              </select>

              <button
                onClick={handleGenerateReply}
                disabled={isGeneratingReply}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-md"
              >
                {isGeneratingReply ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Generate Reply</span>
              </button>
            </div>
          </div>

          {replyGenError && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{replyGenError}</span>
              </div>
              <button
                type="button"
                onClick={handleGenerateReply}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-medium text-[11px] border border-amber-500/30 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="space-y-3">
            <textarea
              rows={5}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply or click 'Generate Reply' above to use AI..."
              className="w-full p-4 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />

            {replySuccess && (
              <div className="text-xs text-emerald-400 font-medium bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/30">
                {replySuccess}
              </div>
            )}
            {replyError && (
              <div className="text-xs text-red-400 font-medium bg-red-500/10 p-2.5 rounded-xl border border-red-500/30">
                {replyError}
              </div>
            )}

            <div className="flex items-center justify-end space-x-3">
              <button
                type="submit"
                disabled={isSendingReply || !replyText.trim()}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg transition-all"
              >
                {isSendingReply ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Reply</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailDetailView;
