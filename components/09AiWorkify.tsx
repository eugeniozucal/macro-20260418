
import React, { useRef, useState, useEffect } from 'react';
import { Globe, Award, ShieldCheck } from 'lucide-react';

const LOGOS = [
  "01.png", "02.png", "03.png", "03b.png", "04.png", "05.png",
  "06.png", "07.png", "08.png", "09.png", "10.png", "11.png"
];

export const Experience: React.FC = () => {
  // Refs for both scroll sections
  const textContainerRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  
  // Progress states
  const [textScrollProgress, setTextScrollProgress] = useState(0);
  const [logoScrollProgress, setLogoScrollProgress] = useState(0);

  // Constants for scroll heights
  // Tripled from 2000 to 6000 per user request for slower build up
  const TEXT_SCROLL_HEIGHT = 6000;
  const LOGO_SCROLL_HEIGHT = 2000;

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // --- Logic for Text Section ---
      if (textContainerRef.current) {
        const container = textContainerRef.current;
        const containerTop = container.offsetTop;
        const startScroll = containerTop;
        const endScroll = containerTop + TEXT_SCROLL_HEIGHT - windowHeight;
        
        let progress = 0;
        if (scrollY > startScroll) {
          progress = (scrollY - startScroll) / (endScroll - startScroll);
        }
        
        // Clamp 0-1
        progress = Math.min(Math.max(progress, 0), 1);
        
        // One-way latch
        setTextScrollProgress(prev => Math.max(prev, progress));
      }

      // --- Logic for Logo Section ---
      if (logoContainerRef.current) {
        const container = logoContainerRef.current;
        const containerTop = container.offsetTop;
        // Offset start slightly so logos start appearing once the title is settled
        const startScroll = containerTop; 
        const endScroll = containerTop + LOGO_SCROLL_HEIGHT - windowHeight;

        let progress = 0;
        if (scrollY > startScroll) {
          progress = (scrollY - startScroll) / (endScroll - startScroll);
        }

        // Clamp 0-1
        progress = Math.min(Math.max(progress, 0), 1);

        // One-way latch
        setLogoScrollProgress(prev => Math.max(prev, progress));
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Text Content - Using backticks to ensure safety against newlines in source
  const paragraph1 = `Desde el año 2013 somos pioneros en mejora de procesos mediante la implementación de tecnología de punta y hemos ganado, mantenido y hecho crecer la confianza de las corporaciones multinacionales más importantes a nivel global como su proveedor internacional en esta materia.`;
  const paragraph2 = `A partir de 2023 operamos desde el Reino Unido para los cinco continentes. Nuestros equipos están conformados por talento internacional ex-Google, ex-Microsoft, ex-Accenture, ex-Deloitte, ex-Globant, ex-Scale AI, ex-Toptal, ex-Delivery Hero y ex-VML, con las mejores prácticas aprendidas en los casos de optimización más complejos y desafiantes del mercado.`;
  const paragraph3 = `Con esta calidad y compromiso, hemos colaborado en la optimización de las operaciones en empresas del sector financiero, tecnológico, de consumo masivo, movilidad, farmacéutica y entretenimiento, y mencionamos a continuación algunas de las más relevantes.`;

  const words1 = paragraph1.split(" ");
  const words2 = paragraph2.split(" ");
  const words3 = paragraph3.split(" ");
  const totalWords = words1.length + words2.length + words3.length;
  let globalWordIndex = 0;

  const renderWord = (word: string, index: number, total: number) => {
    const startThreshold = index / total;
    const isVisible = textScrollProgress > startThreshold;
    const opacity = isVisible ? 1 : 0; 
    
    return (
      <span 
        key={index} 
        className="transition-opacity duration-300 mr-1.5 inline-block"
        style={{ opacity }}
      >
        {word}
      </span>
    );
  };

  return (
    <section className="bg-white border-t border-slate-50">
      
      {/* --- Section 1: Text Scroll Reveal --- */}
      <div 
        ref={textContainerRef} 
        style={{ height: `${TEXT_SCROLL_HEIGHT}px` }} 
        className="relative w-full"
      >
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 w-full">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Contenedor izquierdo centrado verticalmente con márgenes internos ajustados */}
              <div className="lg:col-span-5 flex flex-col justify-center h-full min-h-[400px]">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aiw-blue/10 text-aiw-blue text-sm font-bold tracking-wide uppercase mb-6 shadow-sm self-start">
                  <span className="w-2 h-2 rounded-full bg-aiw-blue animate-pulse"></span>
                  Trayectoria Global
                </div>
                <div className="mb-6">
                  <img 
                    src="https://images.aiworkify.com/macro-project/aiw-iso.png" 
                    alt="AI Workify ISO" 
                    className="h-14 w-auto object-contain drop-shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h2 className="text-4xl font-display font-bold text-slate-900 leading-tight mb-12">
                  AI Workify, expertos en automatización de procesos corporativos<br />
                  <span className="text-aiw-blue">con Inteligencia Artificial</span>.
                </h2>
                <div className="flex gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex-1 shadow-sm">
                    <Globe className="w-5 h-5 text-aiw-blue mb-2" />
                    <p className="text-xs font-bold text-slate-900">Alcance</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">5 Continentes</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex-1 shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-aiw-blue mb-2" />
                    <p className="text-xs font-bold text-slate-900">Trayectoria</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">13 años</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex-1 shadow-sm">
                    <Award className="w-5 h-5 text-aiw-blue mb-2" />
                    <p className="text-xs font-bold text-slate-900">Standard</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Enterprise Level</p>
                  </div>
                </div>
              </div>

              {/* Contenedor derecho del texto */}
              <div className="lg:col-span-7 flex items-center">
                <div className="prose prose-slate max-w-none text-xl text-slate-950 leading-relaxed font-normal py-12">
                  <p className="mb-8">
                    {words1.map(w => renderWord(w, globalWordIndex++, totalWords))}
                  </p>
                  <p className="mb-8">
                    {words2.map(w => renderWord(w, globalWordIndex++, totalWords))}
                  </p>
                  <p>
                    {words3.map(w => renderWord(w, globalWordIndex++, totalWords))}
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* --- Section 2: Logo Scroll Reveal --- */}
      <div 
        ref={logoContainerRef}
        style={{ height: `${LOGO_SCROLL_HEIGHT}px` }}
        className="relative w-full bg-white"
      >
        <div className="sticky top-0 h-screen flex flex-col justify-center items-center overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 w-full">
            
            <div className="text-center mb-24 transition-all duration-700">
               <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-600 tracking-tight uppercase">
                 CONFÍAN EN NUESTRO EQUIPO
               </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-12 gap-y-16 items-center">
              {LOGOS.map((logo, index) => {
                // Calculate threshold for each logo
                // We want them to finish appearing before the scroll ends, say by 80% progress
                const threshold = (index / LOGOS.length) * 0.8;
                const isVisible = logoScrollProgress > threshold;
                
                return (
                  <div 
                    key={index} 
                    className={`
                      flex justify-center transition-all duration-700 ease-out transform
                      ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}
                    `}
                  >
                    <img 
                      src={`https://images.aiworkify.com/fonplata-project/${logo}`} 
                      alt={`Partner ${index + 1}`}
                      className="h-48 md:h-64 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
