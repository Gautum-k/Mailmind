import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Inbox,
  Star,
  Send,
  Archive,
  Trash2,
  Activity as ActivityIcon,
  FileText,
  Settings,
  PlusCircle,
  Sparkles,
  X,
  MailCheck,
  AlertCircle,
} from 'lucide-react';

const Sidebar = ({
  activeLabel = 'INBOX',
  onSelectLabel,
  onOpenCompose,
  isMobileOpen = false,
  onCloseMobile = () => {},
}) => {
  const { gmailConnected } = useAuth();

  const mainNav = [
    { id: 'INBOX', name: 'Inbox', icon: Inbox },
    { id: 'STARRED', name: 'Starred', icon: Star },
    { id: 'SENT', name: 'Sent', icon: Send },
    { id: 'ARCHIVE', name: 'Archive', icon: Archive },
    { id: 'TRASH', name: 'Trash', icon: Trash2 },
  ];

  const appNav = [
    { to: '/activity', name: 'Activity Log', icon: ActivityIcon },
    { to: '/templates', name: 'Templates', icon: FileText },
    { to: '/settings', name: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900/95 border-r border-slate-800/80 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out md:static md:z-auto md:w-64 md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Header on Mobile */}
          <div className="flex items-center justify-between md:hidden pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">MailMind</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              onOpenCompose();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all duration-200"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Compose Message</span>
          </button>

          {/* Folder Navigation */}
          <div>
            <h3 className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Folders
            </h3>
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeLabel === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectLabel(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-indigo-400' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Management Links */}
          <div>
            <h3 className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Workspace
            </h3>
            <nav className="space-y-1">
              {appNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Connection Footer */}
        <div className="pt-4 border-t border-slate-800/80">
          <NavLink
            to="/connect-gmail"
            onClick={onCloseMobile}
            className={`flex items-center space-x-3 p-3 rounded-xl border transition-all ${
              gmailConnected
                ? 'bg-slate-950/60 border-slate-800 hover:border-emerald-500/40'
                : 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                gmailConnected ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {gmailConnected ? 'Gmail Connected' : 'Connect Gmail'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {gmailConnected ? 'Live API Active' : 'OAuth Consent Required'}
              </p>
            </div>
            {gmailConnected ? (
              <MailCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            )}
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
