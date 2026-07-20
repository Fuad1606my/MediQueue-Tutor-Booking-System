import React from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const NotFound = ({ setActiveTab }) => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 bg-slate-50 font-sans">
      <div className="bg-white p-10 rounded-3xl border border-slate-200/80 shadow-xl max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100 shadow-sm">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-blue-600 font-mono text-xs font-black uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Error 404</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Page Not Found</h1>
          <p className="text-xs font-bold text-slate-500 leading-relaxed max-w-xs mx-auto">
            The page or route you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <button 
          onClick={() => setActiveTab('home')}
          className="w-full inline-flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home Page
        </button>
      </div>
    </div>
  );
};

export default NotFound;