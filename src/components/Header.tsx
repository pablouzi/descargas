import React from 'react';
import { Download, Sparkles, ShieldCheck, Zap, History, HelpCircle } from 'lucide-react';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onScrollToFaq: () => void;
  onScrollToGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  onScrollToFaq,
  onScrollToGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 opacity-80 blur group-hover:opacity-100 transition duration-300"></div>
            <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-white shadow-xl shadow-rose-950/30">
              <Download className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-rose-300 bg-clip-text text-transparent">
                InstaSave
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                HD 1080p
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Descargador de Videos & Reels</p>
          </div>
        </div>

        {/* Quick Nav / Badges */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onScrollToGuide}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            ¿Cómo funciona?
          </button>

          <button
            onClick={onScrollToFaq}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
          >
            FAQ
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition shadow-sm"
            title="Ver videos descargados recientemente"
          >
            <History className="w-3.5 h-3.5 text-purple-400" />
            <span>Historial</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full text-[10px] text-white font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
