import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Search, LogOut, Menu, Zap, Loader2, User } from 'lucide-react';
import { smartSearchApi } from '../api/ai';

const Navbar = ({
  searchQuery,
  setSearchQuery,
  onExecuteSearch,
  onToggleMobileSidebar = () => {},
}) => {
  const [isSmartSearch, setIsSmartSearch] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const { user, logout } = useAuth();

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (isSmartSearch) {
      try {
        setIsTranslating(true);
        const res = await smartSearchApi(searchQuery);
        if (res.success && res.data.gmailQuery) {
          onExecuteSearch(res.data.gmailQuery);
        } else {
          onExecuteSearch(searchQuery);
        }
      } catch (err) {
        onExecuteSearch(searchQuery);
      } finally {
        setIsTranslating(false);
      }
    } else {
      onExecuteSearch(searchQuery);
    }
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Menu Toggle & Brand */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors md:hidden"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              MailMind
            </h1>
            <span className="hidden sm:inline-block text-[10px] uppercase font-semibold text-indigo-400 tracking-wider">
              AI Email Platform
            </span>
          </div>
        </div>
      </div>

      {/* Search Input supporting Natural Language AI Query */}
      <div className="flex-1 max-w-xl mx-3 sm:mx-6">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              {isTranslating ? (
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              ) : isSmartSearch ? (
                <Zap className="w-4 h-4 text-purple-400" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isSmartSearch
                  ? 'AI Search: "unread invoices from last week"'
                  : 'Search messages (from:subject:)'
              }
              className={`w-full pl-9 pr-24 py-2 bg-slate-950/80 border rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                isSmartSearch
                  ? 'border-purple-500/50 focus:ring-2 focus:ring-purple-500'
                  : 'border-slate-800 focus:ring-2 focus:ring-indigo-500'
              }`}
            />
          </div>

          <button
            type="button"
            onClick={() => setIsSmartSearch(!isSmartSearch)}
            className={`absolute right-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1 transition-all ${
              isSmartSearch
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Natural Language AI Search"
          >
            <Zap className="w-3 h-3" />
            <span className="hidden sm:inline">AI Search</span>
          </button>
        </form>
      </div>

      {/* User Info & Actions */}
      <div className="flex items-center space-x-3">
        <div className="text-right hidden lg:block">
          <p className="text-xs font-semibold text-slate-200">{user?.name}</p>
          <p className="text-[11px] text-slate-400">{user?.email}</p>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/50"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
