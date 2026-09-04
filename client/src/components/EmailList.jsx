import React from 'react';
import { Star, Mail, Trash2, Archive, CheckSquare, Square, RefreshCw, Sparkles, Inbox, AlertTriangle } from 'lucide-react';

const EmailList = ({
  emails = [],
  isLoading,
  isError = false,
  error = null,
  selectedId,
  onSelectEmail,
  onToggleStar,
  onArchive,
  onDelete,
  onRefresh,
  selectedIds = [],
  onToggleSelect,
  onSelectAll,
  nextPageToken = null,
  onLoadMore = () => {},
  isLoadingMore = false,
}) => {
  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-200">Unable to load messages</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {error?.response?.data?.message || error?.message || 'Network request timed out or server is unavailable.'}
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white min-h-[44px] shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading Inbox</span>
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2 p-3 overflow-y-auto">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <div
            key={n}
            className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center space-x-3"
          >
            <div className="w-4 h-4 bg-slate-800 rounded skeleton-shimmer flex-shrink-0" />
            <div className="w-9 h-9 bg-slate-800 rounded-full skeleton-shimmer flex-shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="w-1/3 h-3.5 bg-slate-800 rounded skeleton-shimmer" />
              <div className="w-3/4 h-3 bg-slate-800/60 rounded skeleton-shimmer" />
            </div>
            <div className="w-12 h-3 bg-slate-800 rounded skeleton-shimmer flex-shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  if (!emails || emails.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shadow-lg">
          <Inbox className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-200">No emails found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Your folder is empty or no emails matched your search parameters.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors border border-slate-700/60"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Inbox</span>
        </button>
      </div>
    );
  }

  const allSelected = emails.length > 0 && selectedIds.length === emails.length;

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* List Header Toolbar */}
      <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onSelectAll}
            className="text-slate-400 hover:text-slate-200 transition-colors"
            title={allSelected ? 'Deselect All' : 'Select All'}
          >
            {allSelected ? (
              <CheckSquare className="w-4 h-4 text-indigo-400" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </button>
          <span className="text-xs text-slate-400 font-medium">
            {selectedIds.length > 0 ? `${selectedIds.length} selected` : `${emails.length} messages`}
          </span>
        </div>

        <button
          onClick={onRefresh}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          title="Refresh message list"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Message Items */}
      <div className="divide-y divide-slate-800/60 overflow-y-auto flex-1">
        {emails.map((email) => {
          const isSelected = selectedId === email.id;
          const isChecked = selectedIds.includes(email.id);

          return (
            <div
              key={email.id}
              onClick={() => onSelectEmail(email.id)}
              className={`group px-4 py-3.5 flex items-center space-x-3 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-indigo-600/15 border-l-4 border-indigo-500'
                  : email.isUnread
                  ? 'bg-slate-900/70 hover:bg-slate-900'
                  : 'bg-slate-950 hover:bg-slate-900/40'
              }`}
            >
              {/* Checkbox */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect(email.id);
                }}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-indigo-400" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>

              {/* Star */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar(email.id, !email.isStarred);
                }}
                className="text-slate-500 hover:text-amber-400 transition-colors"
              >
                <Star
                  className={`w-4 h-4 ${
                    email.isStarred ? 'text-amber-400 fill-amber-400' : ''
                  }`}
                />
              </button>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center text-xs font-bold text-indigo-400 flex-shrink-0">
                {(email.from || 'S').charAt(0).toUpperCase()}
              </div>

              {/* Message Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4
                    className={`text-xs sm:text-sm truncate pr-2 ${
                      email.isUnread ? 'font-bold text-white' : 'font-medium text-slate-300'
                    }`}
                  >
                    {email.from.split('<')[0].replace(/"/g, '') || 'Unknown Sender'}
                  </h4>
                  <span className="text-[11px] text-slate-500 whitespace-nowrap">
                    {email.date ? new Date(email.date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                  </span>
                </div>
                <p
                  className={`text-xs truncate ${
                    email.isUnread ? 'text-slate-200 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {email.subject}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {email.snippet}
                </p>
              </div>

              {/* Hover Quick Actions */}
              <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive(email.id);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Archive"
                >
                  <Archive className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(email.id);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Pagination Load More Button */}
        {nextPageToken && (
          <div className="p-4 text-center border-t border-slate-800/40">
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-indigo-400 border border-slate-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoadingMore ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Loading more messages...</span>
                </>
              ) : (
                <span>Load More Messages</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailList;
