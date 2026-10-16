import React from 'react';
import { History, X, Download, Trash2, ExternalLink, Film, Clock } from 'lucide-react';
import { DownloadHistoryItem } from '../types/instagram';

interface DownloadHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  items: DownloadHistoryItem[];
  onSelectItem: (item: DownloadHistoryItem) => void;
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
}

export const DownloadHistory: React.FC<DownloadHistoryProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onClearHistory,
  onRemoveItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Historial de Descargas</h2>
              <p className="text-xs text-slate-400">Tus videos procesados recientemente en este dispositivo</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 transition border border-rose-500/20"
                title="Vaciar historial"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Vaciar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto flex-1 divide-y divide-slate-800/80">
          {items.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
              <Film className="w-12 h-12 text-slate-600 mb-3" />
              <p className="font-semibold text-slate-300">No hay descargas registradas todavía</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Pega cualquier enlace de un Reel o Video de Instagram en el buscador principal para descargarlo.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id + item.timestamp}
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group"
              >
                <div
                  className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                >
                  {/* Thumbnail */}
                  <div className="relative w-14 h-18 sm:w-16 sm:h-20 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800 group-hover:border-rose-500/50 transition">
                    <img
                      src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold mb-0.5">
                      <span>@{item.author.username}</span>
                      <span className="text-[10px] text-slate-500">•</span>
                      <span className="text-[11px] text-slate-400 font-normal flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(item.timestamp).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white truncate group-hover:text-rose-300 transition">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {item.caption.slice(0, 70)}...
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={item.downloadUrl}
                    download={`instagram_${item.shortcode}.mp4`}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition"
                    title="Descargar de nuevo"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Eliminar del historial"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{items.length} {items.length === 1 ? 'video guardado' : 'videos guardados'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
