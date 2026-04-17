import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ArrowRight, Activity, Users, Cpu, Layers, Ear } from 'lucide-react';

// ============================================================================
// NARRATIVA ESTRATÉGICA
// ============================================================================

const NARRATIVE = [
  {
    phase: 0,
    tag: "BANCO MACRO 2026",
    title: "Cultura IA y\nAutomatización.",
    text: "Proponemos explorar en nuestra primera reunión un potencial de trabajo conjunto organizado en tres dimensiones estratégicas para la innovación con IA en el Banco.",
    icon: Activity
  },
  {
    phase: 1,
    tag: "DIMENSIÓN 01",
    title: "Capacidades.",
    text: "El entrenamiento de cada persona de la compañía en el uso de IA con las herramientas del paquete de Google y otras que ya esten implementadas en el Banco.",
    icon: Users
  },
  {
    phase: 2,
    tag: "DIMENSIÓN 02",
    title: "Arquitectura Operativa.",
    text: "El análisis profundo de los procesos del Banco para identificar fricciones sistémicas y cuellos de botella y aplicar Inteligencia Artificial directamente en el corazón operativo.",
    icon: Cpu
  },
  {
    phase: 3,
    tag: "DIMENSIÓN 03",
    title: "Desarrollo Conjunto",
    text: "La creación construida de forma colaborativa de nuevas soluciones internas y al público que aprovechen toda la data y experiencia de ambos equipos para generar nuevo valor en el Banco.",
    icon: Layers
  },
  {
    phase: 4,
    tag: "EL PRINCIPIO",
    title: "Escuchar Primero.",
    text: "Proponemos agendar una reunión para explorar las 3 dimensiones compartidas, pero en la reunión comenzaremos por escuchar las preocupaciones que ya existen en sus conversaciones sobre estos temas en miras a crear un proyecto que haga pleno sentido para Banco Macro.",
    icon: Ear
  }
];

const PHASE_DURATION = 8000;

// ============================================================================
// MOTOR MATEMÁTICO DEL SISTEMA 3D
// ============================================================================

const pseudoRandom = (seed: number) => {
  let value = seed;
  return function() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

const generateNodes = () => {
  const prng = pseudoRandom(12345); // Semilla fija para evitar Hydration Errors
  const nodes = [];
  const TOTAL = 125; 
  
  for (let i = 0; i < TOTAL; i++) {
    // Fase 0: Dispersión Galáctica (El Ecosistema Actual)
    const p0Radius = 120 + prng() * 120;
    const p0Theta = prng() * Math.PI * 2;
    const p0Y = (prng() - 0.5) * 90;
    const p0 = { x: Math.cos(p0Theta) * p0Radius, y: p0Y, z: Math.sin(p0Theta) * p0Radius };

    // Fase 1: 5 Constelaciones (Capacidad Humana)
    const clusterIdx = i % 5;
    const clusterTheta = (clusterIdx / 5) * Math.PI * 2;
    const clusterRadius = 132;
    const cx = Math.cos(clusterTheta) * clusterRadius;
    const cz = Math.sin(clusterTheta) * clusterRadius;
    const localR = prng() * 27;
    const localTheta = prng() * Math.PI * 2;
    const localPhi = Math.acos(2 * prng() - 1);
    const p1 = { 
      x: cx + localR * Math.sin(localPhi) * Math.cos(localTheta), 
      y: localR * Math.cos(localPhi), 
      z: cz + localR * Math.sin(localPhi) * Math.sin(localTheta) 
    };

    // Fase 2: Matriz Isométrica (Procesos)
    const gridSize = 5;
    const spacing = 60;
    const gx = (i % gridSize) - 2;
    const gy = (Math.floor(i / gridSize) % gridSize) - 2;
    const gz = (Math.floor(i / 25)) - 2;
    const p2 = { x: gx * spacing, y: gy * spacing, z: gz * spacing };

    // Fase 3: Núcleo Denso (Desarrollo Conjunto)
    const coreR = prng() * 40 + 10;
    const coreTheta = prng() * Math.PI * 2;
    const corePhi = Math.acos(2 * prng() - 1);
    const p3 = {
      x: coreR * Math.sin(corePhi) * Math.cos(coreTheta),
      y: coreR * Math.cos(corePhi),
      z: coreR * Math.sin(corePhi) * Math.sin(coreTheta)
    };

    // Fase 4: Anillos Planos (Radar de Escucha)
    const ringIdx = i % 4; 
    const ringRadius = 80 + ringIdx * 80;
    const ringTheta = (i / TOTAL) * Math.PI * 2 * 4; 
    const p4 = {
      x: Math.cos(ringTheta) * ringRadius,
      y: 0, // Al setear Y en 0 y rotar la cámara 90 grados, logramos un plano 2D perfecto
      z: Math.sin(ringTheta) * ringRadius
    };

    const isOrange = i % 4 === 0;
    const isCyan = i % 4 === 1;
    const color = isOrange ? '#FF4050' : isCyan ? '#0040FF' : '#0f172a';
    const size = isOrange ? 6 : isCyan ? 4 : 3;

    nodes.push({ id: i, p0, p1, p2, p3, p4, color, size, clusterIdx });
  }
  return nodes;
};

const getPhaseState = (node: any, phase: number) => {
  switch (phase) {
    case 0: return node.p0;
    case 1: return node.p1;
    case 2: return node.p2;
    case 3: return node.p3;
    case 4: return node.p4;
    default: return node.p0;
  }
};

// ============================================================================
// COMPONENTE VISUAL 3D (Coreografía)
// ============================================================================

const SystemVisualizer = ({ phase }: { phase: number }) => {
  const nodes = useMemo(() => generateNodes(), []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ perspective: 1200 }}>
      {/* Outer Wrapper: Controla la inclinación de la cámara según la narrativa */}
      <motion.div
        animate={{ 
          rotateX: phase === 4 ? 90 : phase === 2 ? 35 : phase === 1 ? 20 : 15,
          y: phase === 4 ? 40 : 0 
        }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: 'preserve-3d', width: 0, height: 0 }}
      >
        {/* Inner Wrapper: Rotación continua del sistema */}
        <motion.div
          animate={{ rotateY: 360 }}
          transition={{ duration: phase === 4 ? 120 : 60, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: 'preserve-3d', width: 0, height: 0 }}
        >
          
          {/* Backdrop Fase 1: Resplandores de Equipos */}
          <AnimatePresence>
            {phase === 1 && [0, 1, 2, 3, 4].map(idx => {
              const theta = (idx / 5) * Math.PI * 2;
              return (
                <motion.div
                  key={`glow-${idx}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute"
                  style={{
                    x: Math.cos(theta) * 132, y: 0, z: Math.sin(theta) * 132,
                    width: 84, height: 84, marginLeft: -42, marginTop: -42,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,64,255,0.08)_0%,transparent_70%)]" style={{ transform: 'rotateX(90deg)' }} />
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,64,255,0.08)_0%,transparent_70%)]" style={{ transform: 'rotateY(90deg)' }} />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Backdrop Fase 3: Solución Central (El Sol Naranja) */}
          <AnimatePresence>
            {phase === 3 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute" style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute w-[300px] h-[300px] -ml-[150px] -mt-[150px] rounded-full bg-[radial-gradient(circle,rgba(255,64,80,0.15)_0%,transparent_60%)]" style={{ transform: 'rotateX(90deg)' }} />
                <div className="absolute w-[300px] h-[300px] -ml-[150px] -mt-[150px] rounded-full bg-[radial-gradient(circle,rgba(255,64,80,0.15)_0%,transparent_60%)]" style={{ transform: 'rotateY(90deg)' }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Backdrop Fase 4: Ondas de Escucha (Radar) */}
          <AnimatePresence>
            {phase === 4 && [1, 2, 3].map(i => (
              <motion.div
                key={`radar-${i}`}
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{ width: 800, height: 800, marginLeft: -400, marginTop: -400, opacity: [0, 0.4, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: i * 2, ease: "easeOut" }}
                className="absolute border border-slate-900/10 rounded-full"
                style={{ rotateX: 90 }} // Alineado perfecto al plano XY resultante
              />
            ))}
          </AnimatePresence>

          {/* Renderizado de Nodos Físicos */}
          {nodes.map(node => {
            const state = getPhaseState(node, phase);
            return (
              <motion.div
                key={node.id}
                initial={false}
                animate={{ x: state.x, y: state.y, z: state.z }}
                transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute rounded-full"
                style={{
                  width: node.size, height: node.size,
                  marginLeft: -node.size / 2, marginTop: -node.size / 2,
                  backgroundColor: node.color,
                  boxShadow: node.color === '#0f172a' ? 'none' : `0 0 ${node.size * 1.5}px ${node.color}`,
                  transformStyle: 'preserve-3d'
                }}
              />
            );
          })}
          
        </motion.div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL (UI y Lógica)
// ============================================================================

export default function MacroStrategicAperture() {
  const [phase, setPhase] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const nextPhase = () => {
    setPhase(prev => (prev < NARRATIVE.length - 1 ? prev + 1 : 0));
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeData = NARRATIVE[phase];
  const Icon = activeData.icon;

  return (
    <section ref={sectionRef} className="relative w-full h-[100dvh] min-h-[800px] bg-white text-slate-900 overflow-hidden font-sans selection:bg-[#FF4050]/20">
      
      {/* 1. Atmósfera y Texturas Premium */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 1) 50%)', backgroundSize: '100% 4px' }} />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      <motion.div 
        className="absolute top-1/2 left-1/2 md:left-3/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none mix-blend-multiply z-0"
        animate={{ background: phase === 4 ? 'radial-gradient(circle, rgba(255,64,80,0.08) 0%, transparent 60%)' : 'radial-gradient(circle, rgba(0,64,255,0.06) 0%, transparent 60%)' }}
        transition={{ duration: 2 }}
      />

      {/* 2. Capa Visual 3D (Lado Derecho) */}
      <div className="absolute inset-0 md:left-[30%] w-full md:w-[70%] h-full z-10 opacity-70 md:opacity-100 flex items-center justify-center scale-[1.1] sm:scale-[1.3] md:scale-[1.6] lg:scale-[2] xl:scale-[2.4] origin-center sm:origin-right md:origin-center pointer-events-none">
        <SystemVisualizer phase={phase} />
      </div>

      {/* 3. Panel Narrativo (Lado Izquierdo) */}
      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white via-white/95 to-transparent w-full md:w-[50%] z-20 pointer-events-none" />
      
      <div className="absolute inset-0 z-30 flex flex-col justify-center px-8 md:px-16 lg:px-32 pointer-events-none">
        
        {/* Header Institucional */}
        <header className="absolute top-8 md:top-12 left-8 md:left-16 lg:left-32 flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <img 
              src="https://images.aiworkify.com/macro-project/macro-iso.png" 
              alt="Macro" 
              className="h-6 md:h-8 w-auto object-contain"
              referrerPolicy="no-referrer" 
            />
            <span className="text-slate-400 font-medium text-sm md:text-base">+</span>
            <img 
              src="https://images.aiworkify.com/macro-project/aiw-iso.png" 
              alt="AIW" 
              className="h-6 md:h-8 w-auto object-contain"
              referrerPolicy="no-referrer" 
            />
          </div>
          <div className="h-5 w-px bg-slate-300" />
          <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-slate-500 font-mono font-bold">
            Propuesta Estratégica
          </span>
        </header>

        {/* Contenido Dinámico */}
        <div className="w-full max-w-2xl lg:max-w-3xl pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Icono de Fase */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-[20px] bg-white border border-slate-200 flex items-center justify-center mb-6 lg:mb-8 shadow-sm">
                <Icon className="w-6 h-6 md:w-8 md:h-8 text-[#0040FF]" strokeWidth={2} />
              </div>

              <div className="text-[11px] md:text-sm uppercase font-mono tracking-[0.2em] text-[#FF4050] mb-4 md:mb-6 font-bold">
                {activeData.tag}
              </div>
              
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-display font-medium text-slate-950 mb-6 lg:mb-10 leading-[1.05] tracking-tight whitespace-pre-line">
                {activeData.title}
              </h2>
              
              <p className="text-lg md:text-xl lg:text-[22px] text-slate-600 font-normal leading-relaxed">
                {activeData.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controles del Timeline */}
        <footer className="absolute bottom-8 md:bottom-12 left-8 md:left-16 lg:left-32 flex items-center gap-6 md:gap-10 pointer-events-auto">
          <button 
            onClick={nextPhase}
            className="group flex items-center gap-4 px-6 md:px-8 py-3.5 md:py-4 bg-slate-950 text-white rounded-full text-base md:text-lg font-medium hover:bg-slate-800 transition-all shadow-[0_8px_30px_rgba(15,23,42,0.12)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.25)] active:scale-95"
          >
            <span>{phase === NARRATIVE.length - 1 ? 'Reiniciar Secuencia' : 'Siguiente Fase'}</span>
            <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
          
          <div className="flex gap-2.5 md:gap-4">
            {NARRATIVE.map((_, i) => (
              <button
                key={i}
                onClick={() => setPhase(i)}
                className={`h-2 md:h-3 rounded-full transition-all duration-500 cursor-pointer ${
                  phase === i ? 'w-10 md:w-14 bg-[#0040FF]' : 'w-2.5 md:w-3 bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Ir a fase ${i}`}
              />
            ))}
          </div>
        </footer>

      </div>
    </section>
  );
}