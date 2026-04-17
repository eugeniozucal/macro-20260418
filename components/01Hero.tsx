import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <div className="relative h-screen w-full bg-white flex items-center justify-center overflow-hidden">
      
      {/* Fondo de Grilla Sutil */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-60"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Logos Institucionales */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-12 mb-16 w-full max-w-3xl transition-all duration-500">
           <div className="flex justify-end">
             <img 
               src="https://images.aiworkify.com/macro-project/macro-isologo.png" 
               alt="Banco Macro" 
               className="h-[76px] md:h-[83px] w-auto object-contain drop-shadow-sm"
               referrerPolicy="no-referrer"
             />
           </div>
           
           <div className="h-20 w-px bg-slate-200"></div>
           
           <div className="flex justify-start">
             <img 
               src="https://images.aiworkify.com/macro-project/aiw-logo.png" 
               alt="AI Workify" 
               className="h-14 md:h-16 w-auto object-contain drop-shadow-sm"
               referrerPolicy="no-referrer"
             />
           </div>
        </div>

        {/* Título Principal */}
        <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
          Cultura IA en Banco Macro <br />
          <span className="text-[#0039e3]">
            2026
          </span>
        </h1>
        
        {/* Subtítulo con NEXUS */}
        <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          Entrenamiento de habilidades y desarrollo conjunto de soluciones.
        </p>

        {/* Call to Scroll */}
        <div className="flex flex-col items-center mt-8 pointer-events-none select-none">
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-slate-400 mb-3">
            Descubrir
          </span>
          <div className="flex flex-col -space-y-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: [0, 1, 0], y: [0, 10, 20] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              >
                <ChevronDown className="w-6 h-6 text-slate-400" strokeWidth={2} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
