import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const isAuth = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/teach') || location.pathname.startsWith('/history');
  
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-primary-600 p-1.5 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">FeynmanBot</span>
              </Link>
            </div>
            
            {isAuth && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <NavLink to="/dashboard" className={({ isActive }) => `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive ? 'border-primary-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}>
                  Dashboard
                </NavLink>
                <NavLink to="/teach" className={({ isActive }) => `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive ? 'border-primary-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}>
                  Teach
                </NavLink>
                <NavLink to="/history" className={({ isActive }) => `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive ? 'border-primary-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}>
                  History
                </NavLink>
              </div>
            )}
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {!isAuth && (
               <>
                 <Link to="/login" className="text-slate-500 hover:text-slate-900 font-medium text-sm">Log in</Link>
                 <Link to="/teach">
                   <Button variant="primary" size="sm">Start Teaching</Button>
                 </Link>
               </>
            )}
            {isAuth && (
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                   U
                 </div>
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
            <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className={({ isActive }) => `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'}`}>Dashboard</NavLink>
            <NavLink to="/teach" onClick={() => setIsOpen(false)} className={({ isActive }) => `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'}`}>Teach</NavLink>
            <NavLink to="/history" onClick={() => setIsOpen(false)} className={({ isActive }) => `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'}`}>History</NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};
