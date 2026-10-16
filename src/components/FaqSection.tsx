import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Check, AlertCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: '¿Es gratuito este descargador de videos de Instagram?',
    answer:
      'Sí, InstaSave es 100% gratuito. No requiere registro, suscripción ni instalación de programas. Puedes descargar todos los videos y Reels que desees de manera ilimitada.',
  },
  {
    question: '¿Los videos descargados tienen marca de agua?',
    answer:
      'No. Los videos se descargan exactamente en su flujo original de Instagram, limpios y sin ninguna marca de agua añadida por nosotros ni logos superpuestos.',
  },
  {
    question: '¿Dónde se guardan los videos después de descargarlos?',
    answer:
      'En Windows y Mac, los videos se guardan de forma predeterminada en tu carpeta de "Descargas" (Downloads). En Android se guardan en la carpeta Descargas y aparecen en la Galería. En iPhone / iPad (iOS), el archivo se descarga en la app "Archivos" o puedes guardarlo directamente en tu Carrete de Fotos desde Safari.',
  },
  {
    question: '¿Puedo descargar videos de cuentas privadas?',
    answer:
      'Por políticas de privacidad de Instagram, solo es posible descargar contenido de cuentas públicas. Si una cuenta es privada, sus videos están restringidos exclusivamente para sus seguidores autorizados.',
  },
  {
    question: '¿En qué formato y resolución se descargan los videos?',
    answer:
      'Los videos se descargan en formato MP4 estándar (códec H.264 / AAC), compatible con cualquier reproductor, editor de video, televisor y smartphone. La calidad corresponde a la máxima resolución disponible en los servidores de Instagram (usualmente 1080p Full HD o 720p HD).',
  },
  {
    question: '¿Es posible descargar únicamente el audio de un Reel?',
    answer:
      '¡Sí! Junto al botón principal de video MP4, tienes la opción "Descargar Solo Audio", ideal para guardar canciones, efectos de sonido y audios en tendencia.',
  },
  {
    question: '¿InstaSave almacena copias de los videos descargados?',
    answer:
      'No. InstaSave no almacena ni conserva copias de ningún video en sus servidores. Toda la información se procesa en tiempo real para que descargues directamente el archivo.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full max-w-4xl mx-auto mt-20 px-4 sm:px-6 mb-16">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
          Respuestas Claras
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
          Preguntas Frecuentes (FAQ)
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-2">
          Todo lo que necesitas saber sobre la descarga de videos y Reels de Instagram.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white hover:text-rose-400 transition"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-rose-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
