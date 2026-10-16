/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DownloaderForm } from './components/DownloaderForm';
import { VideoResultCard } from './components/VideoResultCard';
import { DownloadHistory } from './components/DownloadHistory';
import { HowToGuide } from './components/HowToGuide';
import { FaqSection } from './components/FaqSection';
import { QrCodeModal } from './components/QrCodeModal';
import { Footer } from './components/Footer';
import { InstagramMediaData, DownloadHistoryItem } from './types/instagram';
import {
  Download,
  Sparkles,
  Zap,
  ShieldCheck,
  Film,
  Video,
  Music,
  AlertTriangle,
  Smartphone,
  CheckCircle,
} from 'lucide-react';

const STORAGE_KEY = 'instasave_download_history_v1';

export default function App() {
  const [currentMedia, setCurrentMedia] = useState<InstagramMediaData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<DownloadHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (items: DownloadHistoryItem[]) => {
    setHistory(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  };

  const handleSearch = async (url: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/instagram/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No se pudo obtener el video. Verifica que el enlace sea público y válido.');
      }

      setCurrentMedia(result.data);

      // Smooth scroll to results
      setTimeout(() => {
        const element = document.getElementById('resultado-video');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Search error:', err);
      setErrorMessage(
        err.message || 'Error al conectar con los servidores de Instagram. Por favor verifica el enlace o intenta con un Reel de prueba.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (shortcode: string) => {
    handleSearch(`https://www.instagram.com/reel/${shortcode}/`);
  };

  const handleDownloaded = (media: InstagramMediaData) => {
    // Add to history
    const existingIndex = history.findIndex((h) => h.shortcode === media.shortcode);
    let updatedHistory: DownloadHistoryItem[];

    const newItem: DownloadHistoryItem = {
      ...media,
      timestamp: Date.now(),
    };

    if (existingIndex >= 0) {
      updatedHistory = [newItem, ...history.filter((_, idx) => idx !== existingIndex)];
    } else {
      updatedHistory = [newItem, ...history].slice(0, 20); // Keep max 20
    }

    saveHistory(updatedHistory);
  };

  const handleRemoveHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
  };

  const handleClearHistory = () => {
    saveHistory([]);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onScrollToGuide={() => scrollToSection('como-funciona')}
        onScrollToFaq={() => scrollToSection('faq')}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {/* Background Ambient Glows */}
        <div className="relative overflow-hidden pt-10 sm:pt-16 pb-12 px-4 sm:px-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-600/20 via-purple-600/20 to-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

          {/* Hero Header */}
          <div className="relative max-w-4xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner text-xs font-semibold text-rose-300 mb-5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span>Descargador de Instagram 2026 • Sin Marcas de Agua</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Descargar Videos de{' '}
              <span className="bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                Instagram
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Guarda tus <strong className="text-white font-semibold">Reels</strong>,{' '}
              <strong className="text-white font-semibold">Videos</strong> e{' '}
              <strong className="text-white font-semibold">Historias</strong> en alta definición (1080p MP4) de forma
              gratuita, directa y a máxima velocidad.
            </p>
          </div>

          {/* Search / Downloader Form */}
          <div className="relative z-10">
            <DownloaderForm
              onSearch={handleSearch}
              isLoading={isLoading}
              onSelectSample={handleSelectSample}
            />
          </div>

          {/* Error Message with fallback options */}
          {errorMessage && (
            <div className="max-w-2xl mx-auto mt-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-sm flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => handleSelectSample('C_sample_nature')}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-bold text-white shrink-0 transition"
              >
                Probar Reel de Ejemplo
              </button>
            </div>
          )}

          {/* Result Card */}
          {currentMedia && (
            <div id="resultado-video">
              <VideoResultCard
                media={currentMedia}
                onOpenQr={(url) => setQrModalUrl(url)}
                onDownloaded={handleDownloaded}
              />
            </div>
          )}

          {/* Feature Highlights Grid */}
          <div className="max-w-5xl mx-auto mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center flex flex-col items-center">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 mb-2.5">
                <Film className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-white">Full HD 1080p</span>
              <span className="text-xs text-slate-400 mt-0.5">Calidad original sin compresión</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center flex flex-col items-center">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 mb-2.5">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-white">Descarga Inmediata</span>
              <span className="text-xs text-slate-400 mt-0.5">Descarga directa en un clic</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center flex flex-col items-center">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 mb-2.5">
                <Music className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-white">Video o Audio</span>
              <span className="text-xs text-slate-400 mt-0.5">MP4 y extracción MP3</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center flex flex-col items-center">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 mb-2.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-white">100% Seguro</span>
              <span className="text-xs text-slate-400 mt-0.5">Sin registro ni anuncios molestos</span>
            </div>
          </div>
        </div>

        {/* Step-by-Step How To Guide */}
        <HowToGuide />

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* History Drawer/Modal */}
      <DownloadHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={history}
        onSelectItem={(item) => {
          setCurrentMedia(item);
          setTimeout(() => {
            const el = document.getElementById('resultado-video');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onClearHistory={handleClearHistory}
        onRemoveItem={handleRemoveHistoryItem}
      />

      {/* QR Code Modal for Mobile Downloads */}
      <QrCodeModal
        isOpen={!!qrModalUrl}
        onClose={() => setQrModalUrl(null)}
        url={qrModalUrl || ''}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
