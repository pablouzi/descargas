import React, { useState } from 'react';
import { Smartphone, Laptop, Copy, ArrowDownToLine, PlayCircle, CheckCircle2 } from 'lucide-react';

export const HowToGuide: React.FC = () => {
  const [deviceTab, setDeviceTab] = useState<'mobile' | 'desktop'>('mobile');

  return (
    <section id="como-funciona" className="w-full max-w-5xl mx-auto mt-20 px-4 sm:px-6">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
          Guía Rápida
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
          ¿Cómo descargar videos de Instagram?
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl mx-auto">
          En solo 3 sencillos pasos puedes guardar cualquier Reel, Video o Publicación directamente en tu galería o disco local.
        </p>

        {/* Device toggle */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-900 border border-slate-800 mt-6 shadow-inner">
          <button
            onClick={() => setDeviceTab('mobile')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              deviceTab === 'mobile'
                ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Móvil (iPhone / Android)</span>
          </button>
          <button
            onClick={() => setDeviceTab('desktop')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              deviceTab === 'desktop'
                ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Computadora (PC / Mac)</span>
          </button>
        </div>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div className="relative rounded-3xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between group hover:border-slate-700 transition">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-black text-xl mb-5 shadow-lg shadow-rose-950/40">
              1
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Copy className="w-4 h-4 text-rose-400" />
              Copia el Enlace
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {deviceTab === 'mobile'
                ? 'Abre Instagram en tu teléfono, ve al Reel o Video deseado, pulsa el icono del avión de papel (o los tres puntos ...) y selecciona "Copiar enlace".'
                : 'Navega en Instagram Web, abre el video que deseas guardar y copia la URL completa de la barra de direcciones de tu navegador.'}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-rose-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Compatible con Reels, Posts e IGTV</span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative rounded-3xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between group hover:border-slate-700 transition">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-500 flex items-center justify-center text-white font-black text-xl mb-5 shadow-lg shadow-purple-950/40">
              2
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-purple-400" />
              Pega en InstaSave
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Regresa a esta página y pulsa el botón <strong className="text-slate-200">"Pegar"</strong> o usa Ctrl+V en el campo de texto superior. Luego presiona <strong className="text-slate-200">"Descargar Video"</strong>.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-purple-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Detección automática de video</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative rounded-3xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between group hover:border-slate-700 transition">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-black text-xl mb-5 shadow-lg shadow-blue-950/40">
              3
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4 text-blue-400" />
              Descarga en MP4 HD
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Previsualiza el video con sonido y haz clic en <strong className="text-slate-200">"Descargar Video MP4"</strong>. Se guardará directamente en tu carpeta de descargas sin marcas de agua.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-blue-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Resolución original 1080p Full HD</span>
          </div>
        </div>
      </div>
    </section>
  );
};
