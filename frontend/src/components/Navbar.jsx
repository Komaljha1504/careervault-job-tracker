import React from 'react';
import { Menu, User, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  
  // Format current date
  const formatDate = () => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/70 px-4 backdrop-blur-md md:px-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 lg:hidden border border-slate-200/80 transition-all duration-200"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div>
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">CareerVault Portfolio</span>
          <h2 className="text-sm font-medium text-slate-500 hidden sm:block mt-0.5">
            Welcome back, <span className="text-[#0F172A] font-bold font-display">{user?.username || 'Guest'}</span>
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Date Display */}
        <div className="hidden items-center gap-2 rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-500 border border-slate-200/80 md:flex shadow-sm">
          <Calendar className="h-3.5 w-3.5 text-blue-500" />
          <span className="font-semibold">{formatDate()}</span>
        </div>

        {/* Profile indicator */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-1.5 border border-slate-200/80 shadow-sm">
          <div className="h-5.5 w-5.5 rounded-lg bg-blue-100 flex items-center justify-center border border-blue-200">
            <User className="h-3 w-3 text-blue-600" />
          </div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Verified Account
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
