import React from 'react';
import { Download, Heart, Shield, Lock, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 text-slate-400 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white font-bold">
              <Download className="w-4 h-4" />
            </div>
            <span className="text-base font-extrabold text-white">InstaSave</span>
          </div>
          <p className="text-xs text-slate-500 text-center md:text-left max-w-sm">
            Herramienta rápida y gratuita para descargar videos, Reels y audios de Instagram en alta definición (HD 1080p).
          </p>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            100% Privado y Seguro
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Sin Marcas de Agua
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            Sin Registro
          </span>
        </div>
      </div>

      {/* Legal disclaimer */}
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-900 text-[11px] text-slate-400 text-center flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          Aviso legal: InstaSave es una herramienta independiente y no está afiliada, respaldada ni patrocinada por Instagram o Meta Platforms, Inc. Por favor, respeta los derechos de autor de los creadores de contenido.
        </p>
        <p className="shrink-0 flex items-center gap-1">
          Hecho con <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" /> para creadores y usuarios
        </p>
      </div>
    </footer>
  );
};
