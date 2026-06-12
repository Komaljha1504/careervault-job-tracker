import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, LogOut, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const { showToast } = useToast();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);
  const handleLogoutClick = () => {
    logout();
    showToast('Logged out successfully. See you soon!', 'success');
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Job Applications',
      path: '/jobs',
      icon: Briefcase,
    },
  ];

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-5 flex flex-col transition-all duration-300 lg:static lg:translate-x-0 border-r border-slate-200/80 lg:border lg:m-4 lg:mr-0 lg:rounded-3xl lg:h-[calc(100vh-2rem)] shadow-[0_4px_20px_rgba(15,23,42,0.015)] ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#243B53] shadow-md border border-[#243B53]/15">
              <Briefcase className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 leading-none font-display">CareerVault</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Premium</span>
            </div>
          </div>
          <button
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-800 lg:hidden border border-slate-200 transition"
            onClick={toggleSidebar}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-8 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group border ${isActive
                    ? 'bg-slate-700 text-white border-slate-600'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-transparent'
                  }`
                }
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
              >
                <Icon className="h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-105" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout bottom section */}
        <div className="pt-4 border-t border-slate-100 mt-auto">
          <div className="flex flex-col gap-3.5 bg-slate-50/60 border border-slate-200/50 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold uppercase border border-blue-100/50 shrink-0">
                {user?.username?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-slate-800 truncate leading-none font-display">{user?.username}</h4>
                <p className="text-[10px] text-slate-400 truncate mt-1 font-medium">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex w-full items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-white mb-3"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button
              onClick={handleLogoutClick}
              className="flex w-full items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 border border-slate-200/60 bg-white shadow-sm hover:border-rose-100 hover:text-rose-600 transition-all duration-200"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside >
    </>
  );
};

export default Sidebar;
