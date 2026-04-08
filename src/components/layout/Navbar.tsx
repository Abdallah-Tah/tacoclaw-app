import React from 'react';
import { LayoutDashboard, UserCircle, Activity, Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useThemeStore } from '../../store/useThemeStore';
import { NotificationPanel } from '../shared/NotificationPanel';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <nav className="h-16 glass border-b-0 sticky top-0 z-50 px-4 sm:px-6 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-4 sm:gap-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">
            <Activity className="text-orange-400 w-5 h-5" />
            <div className="absolute inset-0 bg-orange-400/20 blur-xl rounded-full" />
          </div>
          <span className="text-white font-extrabold text-lg sm:text-xl tracking-tight">
            TACO<span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">CLAW</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
              location.pathname === '/'
                ? 'bg-orange-500/20 text-orange-100 shadow-inner border border-orange-500/20'
                : 'text-orange-200/60 hover:text-orange-100 hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link
            to="/faces"
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
              location.pathname === '/faces'
                ? 'bg-orange-500/20 text-orange-100 shadow-inner border border-orange-500/20'
                : 'text-orange-200/60 hover:text-orange-100 hover:bg-white/5'
            }`}
          >
            <UserCircle className="w-4 h-4" /> Face Manager
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationPanel />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-all group"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-colors" />
          ) : (
            <Moon className="w-4 h-4 text-orange-600 group-hover:text-orange-500 transition-colors" />
          )}
        </button>

        {/* System Status */}
        <div className="relative group cursor-help hidden sm:block">
          <div className="absolute -inset-1 bg-emerald-500/20 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-500" />
          <div className="relative px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            SYSTEM ONLINE
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-orange-200/70 hover:text-orange-100 hover:bg-orange-500/10 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 glass border-t border-taco-border p-4 md:hidden animate-in slide-in-from-top-4 duration-300 z-[70]">
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className={`px-4 py-3 rounded-xl text-base font-semibold flex items-center gap-3 ${
                location.pathname === '/' ? 'bg-orange-500/20 text-orange-100' : 'text-orange-200/60'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LayoutDashboard className="w-5 h-5" /> Overview
            </Link>
            <Link
              to="/faces"
              className={`px-4 py-3 rounded-xl text-base font-semibold flex items-center gap-3 ${
                location.pathname === '/faces' ? 'bg-orange-500/20 text-orange-100' : 'text-orange-200/60'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <UserCircle className="w-5 h-5" /> Face Manager
            </Link>
            <div className="mt-2 pt-4 border-t border-taco-border flex items-center justify-between">
              <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                SYSTEM ONLINE
              </div>
              <button
                onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-all"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-orange-400" /> : <Moon className="w-5 h-5 text-orange-600" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};