import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { LayoutDashboard, Wallet, ArrowRightLeft, DollarSign, Settings, Moon, Sun, UserCircle } from 'lucide-react';

export const Header = () => {
  const { role, setRole, theme, toggleTheme } = useFinance();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 min-h-[5rem] flex flex-wrap items-center justify-between py-3 max-w-7xl gap-y-3">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary to-emerald-400 p-2.5 rounded-xl text-white shadow-lg shadow-primary/20">
            <Wallet size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">FinDash.</h1>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4 w-full sm:w-auto mt-[0.5%] sm:mt-0">
          <div className="flex items-center rounded-xl border border-border/50 bg-white/5 backdrop-blur-md p-1 sm:p-1.5">
            <button
              onClick={() => setRole('viewer')}
              className={`px-2 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${role === 'viewer' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Viewer
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`px-2 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${role === 'admin' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Admin
            </button>
          </div>

          <div className="w-px h-6 sm:h-8 bg-border/50 hidden sm:block"></div>

          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-white/10 border border-transparent hover:border-border/50 text-foreground transition-all"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md ml-2 border border-white/10 ring-2 ring-background">
            <UserCircle size={24} />
          </div>
        </div>
      </div>
    </header>
  );
};
