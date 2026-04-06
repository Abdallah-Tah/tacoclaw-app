import React from 'react';
import { LayoutDashboard, UserCircle, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => (
  <nav className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-50">
    <div className="flex items-center gap-8">
      <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
        <Activity className="text-blue-500 w-6 h-6" />
        <span>TACO<span className="text-blue-500">CLAW</span></span>
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4" /> Overview
        </Link>
        <Link to="/faces" className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">
          <UserCircle className="w-4 h-4" /> Face Manager
        </Link>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        SYSTEM ONLINE
      </div>
    </div>
  </nav>
);
