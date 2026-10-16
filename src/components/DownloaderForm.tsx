import React, { useState } from 'react';
import { Search, Clipboard, X, Loader2, Sparkles, AlertCircle, ArrowRight, Video, Flame } from 'lucide-react';

interface DownloaderFormProps {
  onSearch: (url: string) => Promise<void>;
  isLoading: boolean;
  onSelectSample: (shortcode: string) => void;
}

export const DownloaderForm: React.FC<DownloaderFormProps> = ({
  onSearch,
  isLoading,
  onSelectSample,
}) => {
  const [url, setUrl] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
          setInputError(null);
        }
      }
    } catch {
      setInputError('Por favor pega el enlace manualmente usando Ctrl+V o manteniendo presionado en tu teléfono.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setInputError('Por favor ingresa o pega un enlace de Instagram.');
      return;
    }
    setInputError(null);
    onSearch(url.trim());
  };

  const handleSampleClick = (code: string) => {
    setUrl(`https://www.instagram.com/reel/${code}/`);
    setInputError(null);
    onSelectSample(code);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Form Container */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 opacity-40 blur-xl"></div>
        <form
          onSubmit={handleSubmit}
          className="relative rounded-2xl bg-slate-900/90 border border-slate-700/80 p-2 sm:p-3 shadow-2xl backdrop-blur-xl transition"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Input & icons */}
            <div className="relative flex-1 flex items-center">
              <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-rose-400/80" />
              </div>

              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (inputError) setInputError(null);
                }}
                placeholder="Pega aquí el enlace del Reel, Video o Post de Instagram..."
                className="w-full pl-11 pr-24 py-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition font-mono sm:font-sans"
                disabled={isLoading}
              />

              {/* Paste & Clear action inside input */}
              <div className="absolute right-2 flex items-center gap-1.5">
                {url ? (
                  <button
                    type="button"
                    onClick={() => setUrl('')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Borrar texto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white transition border border-slate-700/60 shadow-sm"
                    title="Pegar desde el portapapeles"
                  >
                    <Clipboard className="w-3.5 h-3.5 text-rose-400" />
                    <span>Pegar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative group overflow-hidden px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white transition-all disabled:opacity-60 shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 transition-all duration-300 group-hover:scale-105"></div>
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <span>Descargar Video</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </div>

          {inputError && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{inputError}</span>
            </div>
          )}
        </form>
      </div>

      {/* Loading state indicators */}
      {isLoading && (
        <div className="mt-5 p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col items-center justify-center text-center animate-pulse">
          <div className="flex items-center gap-2 text-rose-400 font-medium text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
            <span>Extrayendo video de Instagram en máxima resolución...</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Analizando streams de video MP4 sin compresión adicional.
          </p>
        </div>
      )}

      {/* Quick Sample Selector */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-medium text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          ¿No tienes un enlace a mano? Prueba un Reel de demostración:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleSampleClick('C_sample_nature')}
            className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition text-[11px] font-medium flex items-center gap-1 hover:border-emerald-500/40"
          >
            <span>🌊 Cascada 4K</span>
          </button>
          <button
            type="button"
            onClick={() => handleSampleClick('C_sample_food')}
            className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition text-[11px] font-medium flex items-center gap-1 hover:border-amber-500/40"
          >
            <span>🍝 Receta Pasta</span>
          </button>
          <button
            type="button"
            onClick={() => handleSampleClick('C_sample_tech')}
            className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition text-[11px] font-medium flex items-center gap-1 hover:border-purple-500/40"
          >
            <span>💻 Setup Tech</span>
          </button>
        </div>
      </div>
    </div>
  );
};
