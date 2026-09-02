import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
        <Sparkles className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-black text-white tracking-tight mb-2">404</h1>
      <h2 className="text-2xl font-bold text-slate-200 mb-4">Page Not Found</h2>
      <p className="text-slate-400 max-w-md mb-8">
        The requested page does not exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
      >
        <Home className="w-4 h-4 mr-2" />
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
