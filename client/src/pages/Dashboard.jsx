import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import EmailList from '../components/EmailList';
import EmailDetailView from '../components/EmailDetailView';
import ComposeModal from '../components/ComposeModal';
import {
  fetchEmails,
  fetchEmailDetail,
  toggleStarStatus,
  archiveEmailApi,
  deleteEmailApi,
  toggleReadStatus,
} from '../api/emails';
import { AlertTriangle, Sparkles, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, gmailConnected } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeLabel, setActiveLabel] = useState('INBOX');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // 1. Fetch Email List via TanStack Query
  const {
    data: emailData,
    isLoading: isListLoading,
    refetch: refetchEmails,
    error: listError,
  } = useQuery({
    queryKey: ['emails', activeLabel, activeSearch],
    queryFn: () => fetchEmails({ label: activeLabel, q: activeSearch }),
    enabled: gmailConnected,
    retry: 1,
  });

  const emails = emailData?.data || [];

  // 2. Fetch Selected Email Detail
  const { data: detailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ['emailDetail', selectedEmailId],
    queryFn: () => fetchEmailDetail(selectedEmailId),
    enabled: !!selectedEmailId && gmailConnected,
  });

  const selectedEmail = detailData?.data;

  // Star Mutation
  const starMutation = useMutation({
    mutationFn: ({ id, star }) => toggleStarStatus(id, star),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });

  // Archive Mutation
  const archiveMutation = useMutation({
    mutationFn: (id) => archiveEmailApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      if (selectedEmailId) setSelectedEmailId(null);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteEmailApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      if (selectedEmailId) setSelectedEmailId(null);
    },
  });

  const handleSelectEmail = (id) => {
    setSelectedEmailId(id);
    toggleReadStatus(id, true).then(() => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    });
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === emails.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(emails.map((e) => e.id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* Navbar with mobile menu trigger */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onExecuteSearch={(q) => setActiveSearch(q)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeLabel={activeLabel}
          onSelectLabel={(lbl) => {
            setActiveLabel(lbl);
            setActiveSearch('');
            setSearchQuery('');
            setSelectedEmailId(null);
          }}
          onOpenCompose={() => setIsComposeOpen(true)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Workspace Body */}
        <main className="flex-1 flex overflow-hidden">
          {!gmailConnected ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-5 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  Connect Your Gmail Account
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  MailMind reads real email messages and drafts replies directly via official Google OAuth 2.0. Please connect your Gmail account to access your live inbox.
                </p>
              </div>
              <button
                onClick={() => navigate('/connect-gmail')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
              >
                Connect Gmail via Google OAuth 2.0
              </button>
            </div>
          ) : (
            <div className="flex-1 flex overflow-hidden">
              {/* Left Column: Email List */}
              <div
                className={`w-full md:w-5/12 lg:w-4/12 border-r border-slate-800 flex flex-col ${
                  selectedEmailId ? 'hidden md:flex' : 'flex'
                }`}
              >
                <EmailList
                  emails={emails}
                  isLoading={isListLoading}
                  isError={!!listError}
                  error={listError}
                  selectedId={selectedEmailId}
                  onSelectEmail={handleSelectEmail}
                  onToggleStar={(id, star) => starMutation.mutate({ id, star })}
                  onArchive={(id) => archiveMutation.mutate(id)}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  onRefresh={refetchEmails}
                  selectedIds={selectedIds}
                  onToggleSelect={handleToggleSelect}
                  onSelectAll={handleSelectAll}
                />
              </div>

              {/* Right Column: Email Detail View */}
              <div
                className={`w-full md:w-7/12 lg:w-8/12 flex flex-col ${
                  !selectedEmailId ? 'hidden md:flex' : 'flex'
                }`}
              >
                {selectedEmailId ? (
                  <EmailDetailView
                    email={selectedEmail}
                    isLoading={isDetailLoading}
                    onBack={() => setSelectedEmailId(null)}
                    onArchive={(id) => archiveMutation.mutate(id)}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    onToggleStar={(id, star) => starMutation.mutate({ id, star })}
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mb-4 shadow-md">
                      <Mail className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-slate-300">Select an email to view</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Choose a message from the list to read the full thread, generate AI summaries, or draft replies.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Compose Email Modal */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSent={() => refetchEmails()}
      />
    </div>
  );
};

export default Dashboard;
