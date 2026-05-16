import React from 'react';
import { Search, Menu, Filter, Info, Shield, MessageSquare, BookOpen, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-brand-slate overflow-x-hidden">
      {/* Header */}
      <header className="h-16 bg-brand-blue text-white flex items-center shrink-0 shadow-md border-b-4 border-brand-emerald sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-blue font-bold text-xl shadow-sm">
              🇰🇪
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none tracking-tight uppercase">Budget Watchdog</h1>
              <span className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold block mt-0.5">Sauti ya Wananchi • Accountability</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#" className="text-emerald-400 border-b-2 border-emerald-400 pb-1">Dashboard</a>
            <a href="#" className="hover:text-emerald-300 transition-colors">Documents</a>
            <a href="#" className="hover:text-emerald-300 transition-colors">Gazette Notices</a>
            <div className="flex items-center gap-2 bg-blue-800 px-3 py-1.5 rounded-full border border-blue-700 ml-4">
              <span className="text-[10px] font-bold uppercase opacity-70">Language:</span>
              <button className="text-[10px] font-bold underline underline-offset-4">EN</button>
              <span className="opacity-40 text-[10px]">|</span>
              <button className="text-[10px] font-medium opacity-60 hover:opacity-100 transition-opacity">SW</button>
            </div>
          </nav>

          <button 
            className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-16 left-0 right-0 bg-brand-blue border-t border-white/10 overflow-hidden shadow-xl"
            >
              <nav className="flex flex-col p-4 gap-2 text-sm font-medium uppercase">
                <a href="#" className="p-3 hover:bg-white/5 rounded-lg">Dashboard</a>
                <a href="#" className="p-3 hover:bg-white/5 rounded-lg">Documents</a>
                <a href="#" className="p-3 hover:bg-white/5 rounded-lg">Gazette Notices</a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 md:px-8 py-8 max-w-7xl">
        {children}
      </main>

      {/* Status Bar */}
      <div className="h-8 bg-white border-t border-slate-200 px-4 md:px-8 flex items-center justify-between text-[10px] font-medium text-slate-500 shrink-0">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> 
            Gemini AI Online
          </span>
          <span className="hidden sm:inline border-l border-slate-200 pl-4 truncate">Data Source: Controller of Budget Reports (Official)</span>
        </div>
        <div className="flex gap-4 uppercase tracking-tighter">
          <span className="hidden xs:inline">Privacy Policy</span>
          <span className="hidden xs:inline">Help Desk</span>
          <span className="font-bold text-slate-400">WCAG 2.1 Compliant</span>
        </div>
      </div>
    </div>
  );
}
