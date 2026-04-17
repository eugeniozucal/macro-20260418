import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  Target, 
  Settings, 
  UserPlus, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Monitor,
  Users,
  Zap,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const screenshots = [
  {
    id: 'command-center',
    src: 'https://images.aiworkify.com/bizmri-views/command-center.png',
    title: 'Command Center',
    icon: BarChart3,
  },
  {
    id: 'results-dashboard',
    src: 'https://images.aiworkify.com/bizmri-views/results-dashboard.png',
    title: 'Results Dashboard',
    icon: Target,
  },
  {
    id: 'sentiment-analysis',
    src: 'https://images.aiworkify.com/bizmri-views/sentiment-analysis.png',
    title: 'Sentiment Analysis',
    icon: Settings,
  },
  {
    id: 'validation',
    src: 'https://images.aiworkify.com/bizmri-views/validation.png',
    title: 'AI Validation',
    icon: ShieldCheck,
  },
  {
    id: 'live-monitoring',
    src: 'https://images.aiworkify.com/bizmri-views/live-monitoring.png',
    title: 'Live Monitoring',
    icon: UserPlus,
  }
];

const features = [
  {
    icon: Users,
    text: "Además de realizar entrevistas personales, en la etapa de discovery implementaremos un agente que, en menos de una hora, entrevista a todos los empleados de la compañía en un espacio disponible de sus agendas.",
    label: "Escalabilidad Total"
  },
  {
    icon: Zap,
    text: "Este proceso aporta valor transversal para el desarrollo de todos los proyectos previstos y, de forma inmediata, genera información accionable a partir de los datos obtenidos en las conversaciones. Además, los resultados e indicadores pueden configurarse para resaltar los aspectos que se necesiten medir en cada momento.",
    label: "Valor Instantáneo"
  },
  {
    icon: GraduationCap,
    text: "Por último, esta base servirá para diseñar futuros entrenamientos de Inteligencia Artificial para toda la organización, enfocados específicamente en las fricciones operacionales detectadas.",
    label: "Capacitación Estratégica"
  }
];

export const DiscoverySimulator: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const active = screenshots[activeIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') setActiveIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
      if (e.key === 'ArrowRight') setActiveIndex((prev) => (prev + 1) % screenshots.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header - Left Aligned */}
        <div className="text-left mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-macroCoral/10 text-macroCoral text-sm font-bold tracking-wide uppercase mb-6">
            <Sparkles size={16} />
            Discovery a Escala
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-macroBlue mb-6 leading-tight">
            Escuchamos primero.<br/>
            <span className="text-slate-400">Construimos después.</span>
          </h2>
          <p className="text-lg text-slate-600 mb-12 leading-relaxed max-w-3xl">
            No asumimos cuáles son los problemas. Desplegamos agentes conversacionales que entrevistan a cientos de colaboradores simultáneamente para descubrir las fricciones reales en su día a día.
          </p>
          
          {/* Feature Layout: Staggered Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative p-6 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-macroCoral/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-5 h-5 text-macroCoral" />
                </div>
                <div className="text-[10px] font-bold text-macroCoral uppercase tracking-widest mb-2 opacity-60">
                  {feature.label}
                </div>
                <p className="text-slate-600 text-[13px] leading-relaxed">
                  {feature.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- 1. Main Display Area (Clean, No-Crop) --- */}
        <div className="relative mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden group">
            
            {/* Image Container with contain logic to show full image */}
            <div 
              className="relative min-h-[400px] md:min-h-[600px] bg-slate-50 cursor-zoom-in overflow-hidden flex items-center justify-center"
              onClick={() => setLightboxOpen(true)}
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={active.id}
                  src={active.src} 
                  alt={active.title} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-auto max-h-[800px] object-contain block"
                />
              </AnimatePresence>
              
              {/* Expand Overlay */}
              <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <Maximize2 size={16} className="text-slate-900" />
                  <span className="text-sm font-bold text-slate-900">Ver en Pantalla Completa</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 2. Interactive Navigation (Compact & Flat) --- */}
        <div className="space-y-8 pt-4">
          
          {/* Navigation Instruction Label - Now Centered and Above Buttons */}
          <div className="text-center mb-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] select-none">
              NAVEGAR ENTRE LAS DISTINTAS VISTAS DEL SOFTWARE PRESIONANDO LOS BOTONES DEBAJO
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {screenshots.map((shot, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={shot.id}
                  onClick={() => setActiveIndex(index)}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-200
                    ${isActive 
                      ? 'bg-[#0039e3]/5 border-[#0039e3] text-[#0039e3] shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                    }
                  `}
                >
                  <shot.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#0039e3]' : 'text-slate-400'}`} />
                  <span className={`text-xs font-bold ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                    {shot.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* --- 3. Lightbox Modal --- */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
          >
            {/* Top Bar Controls */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between text-white">
              <span className="text-xl font-bold">{active.title}</span>
              <button 
                onClick={() => setLightboxOpen(false)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors group"
                title="Cerrar (Esc)"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length); }}
              className="absolute left-6 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all hidden md:block"
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev + 1) % screenshots.length); }}
              className="absolute right-6 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all hidden md:block"
            >
              <ChevronRight size={32} />
            </button>

            {/* Main Image in Modal */}
            <motion.img 
              key={active.id}
              src={active.src} 
              alt={active.title}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Bottom Counter */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/50 text-xs font-mono font-bold uppercase tracking-widest">
              <span>{String(activeIndex + 1).padStart(2, '0')}</span>
              <div className="w-12 h-px bg-white/20"></div>
              <span>{String(screenshots.length).padStart(2, '0')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
