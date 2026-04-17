import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  Map, 
  Users, 
  Zap, 
  Video, 
  Mic, 
  Award, 
  ArrowRight,
  Monitor,
  Sparkles,
  BookOpen,
  FileBarChart,
  MessageSquare,
  Globe,
  Lightbulb,
  ClipboardCheck,
  Mail
} from 'lucide-react';

// --- Types & Data ---

interface Track {
  id: string;
  title: string;
  label: string;
  icon: any;
  objective: string;
  description: string;
}

const ACADEMY_TRACKS: Track[] = [
  {
    id: 'horizon',
    label: 'C-Level',
    title: 'Horizon Track',
    icon: Compass,
    objective: 'Gobernanza y Estrategia de IA',
    description: 'Visión, Gobernanza y Narrativa Estratégica ante el Directorio.'
  },
  {
    id: 'blueprint',
    label: 'VPs',
    title: 'Blueprint Track',
    icon: Map,
    objective: 'Arquitectura de Flujos Operativos',
    description: 'Arquitectura de nuevos flujos operativos y liderazgo del cambio.'
  },
  {
    id: 'strategy',
    label: 'Managers',
    title: 'Strategy Track',
    icon: Users,
    objective: 'Orquestación Humano-IA',
    description: 'Orquestación de equipos híbridos (Humano + IA) y delegación inteligente.'
  },
  {
    id: 'performance',
    label: 'Operativos',
    title: 'Performance Track',
    icon: Zap,
    objective: 'Prompt Engineering & Copilot',
    description: 'Prompt Engineering avanzado para Excel/Word y automatización personal.'
  }
];

const ZOOM_USERS = [
  // Using curated UI faces with appropriate framing and face-centric cropping
  { name: 'Ana M.', dept: 'Finanzas', badge: 'Certified Azure AI', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&crop=faces&w=500&h=281&q=80' },
  { name: 'Carlos R.', dept: 'Riesgo', badge: 'Prompt Master', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&crop=faces&w=500&h=281&q=80' },
  { name: 'Lucía B.', dept: 'Legal', badge: 'AI Champion', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&crop=faces&w=500&h=281&q=80' },
  { name: 'Pedro S.', dept: 'Operaciones', badge: 'Workflow Arch', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&crop=faces&w=500&h=281&q=80' },
  { name: 'Sofía T.', dept: 'ESG', badge: 'Certified Azure AI', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&crop=faces&w=500&h=281&q=80' },
  { name: 'Jorge L.', dept: 'TI', badge: 'Privacy Lead', img: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&crop=faces&w=500&h=281&q=80' },
  { name: 'Marta V.', dept: 'RRHH', badge: 'AI Champion', img: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&crop=faces&w=500&h=281&q=80' },
  { name: 'Luis D.', dept: 'Auditoría', badge: 'Audit AI Nvl 2', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&w=500&h=281&q=80' },
  { name: 'Elena G.', dept: 'Presidencia', badge: 'Strategy Lead', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&w=500&h=281&q=80' },
];

const DELIVERABLES = [
  { icon: Users, title: 'Workshops Colaborativos en Vivo', desc: 'Tres sesiones quincenales obligatorias de inmersión técnica, diseñadas para la resolución de problemas grupales y la transferencia de habilidades prácticas.' },
  { icon: BookOpen, title: 'Biblioteca de Activos Digitales', desc: 'Repositorio integral de videos, tutoriales y guías estratégicas que se transferirán a los servidores internos de Banco Macro para consulta permanente.' },
  { icon: FileBarChart, title: 'Auditoría de Impacto Final', desc: 'Reporte exhaustivo de resultados cualitativos y cuantitativos que sustenta el Business Case para el despliegue de IA a escala organizacional.' },
  { icon: MessageSquare, title: 'Centro de Comunidad IA', desc: 'Canal interno exclusivo para funcionarios, facilitando el intercambio de hallazgos, discusión de ideas y demostración de avances técnicos.' },
  { icon: Globe, title: 'Briefings Globales de Tendencias', desc: 'Seis meses de acceso preferente a las sesiones de expertos de AI Workify sobre la evolución del mercado de IA a nivel mundial.' },
  { icon: Lightbulb, title: 'Foro de Innovadores', desc: 'Espacio mensual post-programa para que los equipos presenten sus propios desarrollos, reciban feedback experto y fomenten el crecimiento orgánico.' },
  { icon: ClipboardCheck, title: 'Monitor de Adopción (Pulse Survey)', desc: 'Mecanismo estructurado de feedback semestral para documentar el progreso individual y medir el impacto continuo del programa en los procesos del Banco.' },
  { icon: Mail, title: 'Soporte Directo y Consultoría', desc: 'Línea de comunicación prioritaria (macro@aiworkify.com) para asistencia experta bajo demanda durante todo el ciclo de vida del proyecto.' }
];

// --- Sub-components ---

const TrackCard = ({ track }: { track: Track }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = track.icon;

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative h-64 bg-white rounded-2xl border border-slate-200 overflow-hidden group cursor-default transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50 hover:border-macroCoral/30"
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-macroCoral group-hover:text-white transition-colors duration-500">
            <Icon size={24} />
          </div>
          <span className="text-[10px] font-bold text-slate-900 group-hover:text-macroCoral uppercase tracking-widest transition-colors duration-500">{track.label}</span>
        </div>
        
        <h4 className="text-lg font-bold text-slate-900 mb-1">{track.title}</h4>
        <p className="text-xs font-bold text-slate-400 mb-3">{track.objective}</p>
        
        <AnimatePresence>
          {isHovered ? (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-xs text-slate-500 leading-relaxed mt-auto"
            >
              {track.description}
            </motion.p>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-auto flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider"
            >
              <span>Ver Detalle</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-macroCoral/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
  );
};

export const Academy: React.FC = () => {
  const [employees, setEmployees] = useState(85);
  const [hours, setHours] = useState(6);

  const productivityHours = employees * hours * 52;

  return (
    <section className="pt-24 pb-12 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-macroCoral/10 text-macroCoral text-sm font-bold tracking-wide uppercase mb-4 shadow-sm">
            <Sparkles size={16} className="text-macroCoral" />
            Entrenamiento
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">Cultura de IA y Capacitación</h2>
          <div className="text-slate-500 text-lg mt-6 max-w-4xl leading-relaxed space-y-4">
            <p>
              El principio de la generación de una cultura de IA en la empresa se logra mejor cuando cada persona encuentra el valor individual en sumarse. Por eso trabajamos con cada participante, con su propio flujo de trabajo y sus propias tareas, para que vea los beneficios de apoyarse en la IA para solucionar sus cuellos de botella, esté motivado a ampliar el uso de las herramientas, comparta sus logros y contagie a otros para dar el paso.
            </p>
            <p>
              Trabajamos también con los líderes para que aprendan un uso más estratégico de la IA y guíen a sus equipos en este proceso de transformación. Además, mantenemos conversaciones de alto nivel con el comité ejecutivo y la comisión directiva para trazar panoramas a largo plazo, aconsejar en las decisiones macro de transformación y ayudarlos a ellos también a tener sus propias herramientas de IA para cumplir su misión.
            </p>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Methodology Intro */}
          <div className="col-span-12 mb-2">
            <p className="text-slate-700 font-semibold text-sm">
              Metodología Estratificada: Rechazamos el enfoque de 'talle único'. Estructuramos el aprendizaje en 4 niveles de responsabilidad para garantizar impacto inmediato:
            </p>
          </div>

          {/* Module A: Academy Tracks (Full Width) */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            {ACADEMY_TRACKS.map(track => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>

          {/* Module B: Fake Zoom Call (Col 1-8) */}
          <div className="col-span-12 lg:col-span-8 bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl flex flex-col overflow-hidden relative group">
            {/* Header Simulation */}
            <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white">
                   <Video size={20} />
                </div>
                <div>
                   <h3 className="text-white font-bold text-sm">Macro Academy</h3>
                   <div className="flex items-center gap-2 mt-0.5">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">150+ Usuarios Activos</p>
                   </div>
                </div>
              </div>
              <div className="flex gap-2">
                {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-700"></div>)}
              </div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-3 gap-3 flex-1">
              {ZOOM_USERS.map((user, idx) => (
                <div key={idx} className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden group/cell border border-slate-700/50 hover:border-macroCoral/40 transition-colors">
                  
                  {/* Webcam Feed full width */}
                  <img 
                    src={user.img}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/cell:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0"
                  />

                  {/* Dark gradient at the bottom for text contrast */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

                  {/* Name Tag */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-2 z-10 drop-shadow-md">
                    <Mic size={10} className="text-emerald-400" />
                    <span className="text-[10px] text-white font-bold tracking-wide">{user.name} - {user.dept}</span>
                  </div>

                  {/* Floating Badge (Animated) */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + (idx * 0.1), repeat: Infinity, repeatType: 'reverse', duration: 3 }}
                    className="absolute top-2 right-2 bg-slate-900/40 backdrop-blur-md border border-slate-700/50 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter z-10"
                  >
                    <span className="text-macroCoral mr-1">•</span>
                    {user.badge}
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Bottom Caption Overlay */}
            <div className="mt-8 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-300 leading-relaxed text-center font-medium italic">
                "Compartiendo casos de uso reales: El equipo de Riesgo logró automatizar el análisis de salvaguardas reduciendo el tiempo de revisión manual en un 70%."
              </p>
            </div>
          </div>

          {/* Module C: ROI Calculator (Col 9-12) */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl flex flex-col">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Monitor className="text-macroCoral" size={20} /> Simulador de ROI
              </h3>
              <p className="text-xs text-slate-500 mt-2">Cálculo dinámico del impacto de la capacitación en la productividad del Banco.</p>
            </div>

            <div className="space-y-10 flex-1">
              {/* Slider 1: Employees */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Funcionarios Capacitados</span>
                  <span className="text-lg font-black text-slate-900">{employees}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="150" 
                  value={employees} 
                  onChange={(e) => setEmployees(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-macroCoral"
                />
              </div>

              {/* Slider 2: Hours */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Ahorro Semanal (h)</span>
                  <span className="text-lg font-black text-slate-900">{hours}h</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  value={hours} 
                  onChange={(e) => setHours(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-macroCoral"
                />
              </div>

              {/* Result */}
              <div className="p-6 bg-macroCoral/5 rounded-2xl border border-macroCoral/10 flex flex-col items-center justify-center text-center mt-auto">
                 <span className="text-[10px] font-bold text-macroCoral uppercase tracking-[0.2em] mb-2">Productividad Recuperada Anual</span>
                 <motion.div 
                   key={productivityHours}
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   className="text-4xl font-black text-slate-900 font-mono"
                 >
                   {productivityHours.toLocaleString()} <span className="text-lg text-slate-500">Horas</span>
                 </motion.div>
                 <p className="text-[10px] text-slate-400 mt-4 leading-relaxed font-medium">
                   Equivale a la capacidad operativa de <br/>
                   <span className="font-bold text-slate-800">~{(productivityHours / 1920).toFixed(1)} funcionarios</span> adicionales de tiempo completo.
                 </p>
              </div>
            </div>
          </div>

        </div>

        {/* Puntos de Contacto y Entregables de la Capacitación */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-12">Puntos de Contacto y Entregables de las Capacitaciones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-slate-200 border border-slate-200 gap-px rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
            {DELIVERABLES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white p-6 md:p-8 flex flex-col items-start hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#0039e3]/5 border border-[#0039e3]/10 flex items-center justify-center text-[#0039e3] mb-5">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-base font-bold text-[#003057] mb-3">{item.title}</h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed mb-6 flex-1">{item.desc}</p>
                  <div className="w-8 h-1 bg-[#003057]/10 rounded-full mt-auto"></div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
};