import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, RefreshCw, Server } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading, refreshUser } = useAuth();
  const location = useLocation();
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    let timer;
    if (loading) {
      setShowRetry(false);
      timer = setTimeout(() => {
        setShowRetry(true);
      }, 8000); // Show retry if initial auth check exceeds 8 seconds (free tier cold start)
    }
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-300 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 shadow-xl">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight">Connecting to server...</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-sm leading-relaxed">
          Waking up backend server (free hosting instances may take up to 10–15 seconds to spin up).
        </p>

        {showRetry && (
          <button
            onClick={() => {
              setShowRetry(false);
              refreshUser();
            }}
            className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs min-h-[44px] shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        )}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
