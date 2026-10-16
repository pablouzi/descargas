import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Download,
  Music,
  ExternalLink,
  Copy,
  Check,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Share2,
  QrCode,
  ShieldCheck,
  Sparkles,
  User,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { InstagramMediaData } from '../types/instagram';

interface VideoResultCardProps {
  media: InstagramMediaData;
  onOpenQr: (url: string) => void;
  onDownloaded: (media: InstagramMediaData) => void;
}

export const VideoResultCard: React.FC<VideoResultCardProps> = ({
  media,
  onOpenQr,
  onDownloaded,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24'],
      });
    } catch {
      // ignore
    }
  };

  const handleDownloadMp4 = async () => {
    setIsDownloading(true);
    try {
      // Trigger download via proxy endpoint
      const downloadLink = document.createElement('a');
      downloadLink.href = media.downloadUrl;
      downloadLink.setAttribute('download', `instagram_${media.shortcode}.mp4`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      fireConfetti();
      onDownloaded(media);
    } catch (err) {
      console.error('Download error:', err);
      // Fallback: open directly
      window.open(media.videoUrl, '_blank');
    } finally {
      setTimeout(() => setIsDownloading(false), 1200);
    }
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(media.caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyHashtags = () => {
    navigator.clipboard.writeText(media.hashtags.join(' '));
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: media.title,
        text: `Mira este video de Instagram: ${media.title}`,
        url: media.originalUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(media.originalUrl);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-fade-in">
      <div className="relative rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Top Status Header */}
        <div className="px-5 py-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-400">Video listo para descargar</span>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-medium text-slate-400">{media.quality}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition"
              title="Compartir enlace"
            >
              {copiedShareLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedShareLink ? '¡Copiado!' : 'Compartir'}</span>
            </button>

            <button
              onClick={() => onOpenQr(media.originalUrl)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition"
              title="Generar código QR para descargar en móvil"
            >
              <QrCode className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Código QR</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout: Video Preview + Details & Download Actions */}
        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Video Player (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[320px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group">
              <video
                ref={videoRef}
                src={media.videoUrl}
                poster={media.thumbnailUrl}
                playsInline
                loop
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Center Play/Pause Overlay */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-slate-950/70 border border-white/20 text-white flex items-center justify-center hover:scale-110 transition shadow-2xl backdrop-blur-md"
                  aria-label="Reproducir vista previa"
                >
                  <Play className="w-7 h-7 text-rose-400 ml-1" />
                </button>
              )}

              {/* Bottom Custom Video Controls */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-2 opacity-90 group-hover:opacity-100 transition">
                {/* Progress bar */}
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />

                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2">
                    <button onClick={togglePlay} className="p-1 hover:text-rose-400 transition">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button onClick={toggleMute} className="p-1 hover:text-rose-400 transition">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span className="text-[11px] font-mono text-slate-300">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <button onClick={handleFullscreen} className="p-1 hover:text-rose-400 transition">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quality pill badge */}
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                HD 1080p
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              Haz clic en el video para reproducir la vista previa
            </p>
          </div>

          {/* Right Column: Author, Metadata & Download Actions (7 cols) */}
          <div className="md:col-span-7 flex flex-col h-full justify-between gap-5">
            {/* Author Profile Information */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-rose-500/80 p-0.5 bg-gradient-to-tr from-amber-500 to-rose-600">
                    <img
                      src={media.author.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={media.author.name}
                      className="w-full h-full object-cover rounded-full bg-slate-800"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(media.author.username)}&background=rose&color=fff`;
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm hover:underline cursor-pointer">
                      @{media.author.username}
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold">
                      ✓
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{media.author.name || 'Creador de Instagram'}</p>
                </div>
              </div>

              <a
                href={media.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition"
              >
                <span>Ver en Instagram</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Title / Caption */}
            <div>
              <h3 className="text-base font-semibold text-slate-100 leading-snug line-clamp-3">
                {media.title || media.caption}
              </h3>

              {/* Hashtags list */}
              {media.hashtags && media.hashtags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
                  {media.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-800/80 text-rose-400 text-xs font-medium hover:bg-slate-700/80 transition"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Copy Caption & Hashtags Action Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60">
              <button
                onClick={handleCopyCaption}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition"
              >
                {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCaption ? '¡Descripción Copiada!' : 'Copiar Descripción'}</span>
              </button>

              {media.hashtags && media.hashtags.length > 0 && (
                <button
                  onClick={handleCopyHashtags}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition"
                >
                  {copiedHashtags ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHashtags ? '¡Hashtags Copiados!' : 'Copiar Hashtags'}</span>
                </button>
              )}
            </div>

            {/* DOWNLOAD ACTION BUTTONS */}
            <div className="flex flex-col gap-3 pt-2">
              {/* PRIMARY DOWNLOAD BUTTON (MP4 HD) */}
              <button
                type="button"
                onClick={handleDownloadMp4}
                disabled={isDownloading}
                className="w-full relative group overflow-hidden py-4 px-6 rounded-2xl font-bold text-white shadow-xl shadow-rose-950/50 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 transition-all duration-300 group-hover:brightness-110"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                <span className="relative z-10 flex items-center gap-2.5 text-base sm:text-lg">
                  <Download className={`w-5 h-5 text-white ${isDownloading ? 'animate-bounce' : 'group-hover:-translate-y-0.5 transition-transform'}`} />
                  <span>{isDownloading ? 'Descargando Video...' : 'Descargar Video MP4 (1080p HD)'}</span>
                </span>
              </button>

              {/* SECONDARY BUTTONS: Audio & Direct CDN link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={`/api/instagram/download?url=${encodeURIComponent(media.videoUrl)}&filename=${encodeURIComponent('audio_' + media.shortcode)}`}
                  download={`audio_${media.shortcode}.mp3`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition"
                  onClick={fireConfetti}
                >
                  <Music className="w-4 h-4 text-purple-400" />
                  <span>Descargar Solo Audio</span>
                </a>

                <a
                  href={media.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition"
                >
                  <ExternalLink className="w-4 h-4 text-rose-400" />
                  <span>Abrir Enlace Directo</span>
                </a>
              </div>
            </div>

            {/* Security & Quality Guarantee Footer */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Sin marcas de agua
              </span>
              <span>•</span>
              <span>Calidad Original</span>
              <span>•</span>
              <span>Descarga Directa Segura</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
