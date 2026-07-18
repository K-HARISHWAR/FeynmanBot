import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Brain, Menu, X, LogOut } from 'lucide-react';
import { Button } from '../common/Button';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../features/auth/useAuth';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAuth = !!user;
  
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutConfirm(false);
    await logout();
    navigate('/login');
  };
  
  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-primary-600 p-1.5 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">FeynmanBot</span>
              </Link>
            </div>
            
            {isAuth && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <NavLink to="/dashboard" className={({ isActive }) => `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive ? 'border-primary-500 text-slate-900 dark:text-white' : 'border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                  Dashboard
                </NavLink>
                <NavLink to="/teach" className={({ isActive }) => `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive ? 'border-primary-500 text-slate-900 dark:text-white' : 'border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                  Teach
                </NavLink>
                <NavLink to="/history" className={({ isActive }) => `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive ? 'border-primary-500 text-slate-900 dark:text-white' : 'border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                  History
                </NavLink>
              </div>
            )}
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <ThemeToggle />
            {!isAuth && location.pathname !== '/login' && location.pathname !== '/register' && (
               <>
                 <Link to="/login" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium text-sm">Log in</Link>
                 <Link to="/register">
                   <Button variant="primary" size="sm">Sign up</Button>
                 </Link>
               </>
            )}
            {isAuth && (
               <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold uppercase">
                   {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                 </div>
                 <button onClick={handleLogoutClick} className="cursor-pointer text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                   <LogOut className="w-5 h-5" />
                 </button>
               </div>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className={({ isActive }) => `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/50 border-primary-500 text-primary-700 dark:text-primary-300' : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-300'}`}>Dashboard</NavLink>
            <NavLink to="/teach" onClick={() => setIsOpen(false)} className={({ isActive }) => `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/50 border-primary-500 text-primary-700 dark:text-primary-300' : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-300'}`}>Teach</NavLink>
            <NavLink to="/history" onClick={() => setIsOpen(false)} className={({ isActive }) => `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/50 border-primary-500 text-primary-700 dark:text-primary-300' : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-300'}`}>History</NavLink>
          </div>
        </div>
      )}

      {/* Custom Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl max-w-sm w-full border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Log out</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleLogoutConfirm}>Log out</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
