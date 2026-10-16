import React, { useState } from 'react';
import { X, QrCode, Smartphone, Copy, Check } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose, url }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=0f172a&margin=10`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-rose-950/40">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white">Escanear con tu Móvil</h3>
        <p className="text-xs text-slate-400 mt-1">
          Apunta la cámara de tu iPhone o Android a este código para abrir y descargar directamente en tu teléfono.
        </p>

        {/* QR container */}
        <div className="my-6 p-4 bg-white rounded-2xl inline-block shadow-inner">
          <img
            src={qrImageUrl}
            alt="Código QR para descargar en móvil"
            className="w-48 h-48 mx-auto rounded-lg"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
