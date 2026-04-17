import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, Minus, ThumbsDown, Clock, Sparkles, TrendingUp, Zap } from 'lucide-react';

const MessageMock = ({ name, channel, text, time, sentiment, type }: any) => {
  const styles = {
    positive: {
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      Icon: ThumbsUp
    },
    neutral: {
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      Icon: Minus
    },
    negative: {
      color: 'text-macroCoral',
      bg: 'bg-macroCoral/10',
      border: 'border-macroCoral/20',
      Icon: ThumbsDown
    }
  };

  const currentStyle = styles[type as keyof typeof styles];
  const Icon = currentStyle.Icon;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 transition-colors hover:border-slate-300 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 items-center">
          <span className="text-sm font-bold text-slate-900">{name}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 bg-slate-50">{channel}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${currentStyle.bg} ${currentStyle.border} ${currentStyle.color}`}>
          <Icon size={10} strokeWidth={2.5}/>
          {sentiment}
        </div>
      </div>
      <p className="text-slate-600 text-xs mb-3 italic">"{text}"</p>
      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
        <Clock size={10} />
        {time}
      </div>
    </div>
  );
};

export const DevelopmentCase: React.FC = () => {
  return (
    <section className="py-24 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Header */}
        <div className="mb-16">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-macroCoral/10 text-macroCoral text-sm font-bold tracking-wide uppercase mb-6 shadow-sm">
              <Sparkles size={16} className="text-macroCoral" />
              Soluciones con IA
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-8">
              Casos de Uso Estratégicos
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              La IA se ha convertido en una capacidad troncal en las empresas competitivas, pero muchas gerencias luchan por traducir su potencial en impacto real. Identificamos en qué puntos la IA puede generar un valor exponencial, diseñamos soluciones de rápida implementación y alta ganancia medible para luego pensar en cambios más estructurales.
            </p>
          </motion.div>
        </div>

        {/* Bottom Panel: Dashboard UI + Explanations */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-slate-200 bg-gradient-to-b from-white to-slate-50 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden"
        >
          {/* Subtle glow effect in background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-macroBlue/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-macroCoral/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Fake Dashboard UI */}
            <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/50 overflow-hidden relative drop-shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
              <div className="mb-6">
                <h5 className="text-slate-900 text-sm font-bold mb-1">Pipeline de Feedback de Clientes</h5>
                <p className="text-[11px] text-slate-500 font-medium">Canales de atención automatizados</p>
              </div>
              
              <div className="space-y-3 relative z-10">
                 <MessageMock 
                   name="Damián S." 
                   channel="App Macro" 
                   text="La validación con biometría es excelente. Pude transferir más rápido que antes."
                   time="Hace 2 horas"
                   sentiment="Positivo"
                   type="positive"
                 />
                 <MessageMock 
                   name="Luciana M." 
                   channel="Sucursal" 
                   text="Me asesoraron muy bien sobre inversiones, aunque esperé unos minutos en caja."
                   time="Hace 3 horas"
                   sentiment="Neutral"
                   type="neutral"
                 />
                 <MessageMock 
                   name="Roberto G." 
                   channel="Búho Center" 
                   text="Intento hace semanas pedir un stop debit y el autogestión falla. Nadie lo resuelve."
                   time="Hace 4 horas"
                   sentiment="Crítico"
                   type="negative"
                 />
                 <MessageMock 
                   name="Camila R." 
                   channel="Banca Empresa" 
                   text="El onboarding digital fue súper fluido, me ahorré de llevar papeles."
                   time="Hace 5 horas"
                   sentiment="Positivo"
                   type="positive"
                 />
              </div>
              
              {/* Overlay fade out at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent z-20 pointer-events-none rounded-b-2xl"></div>
            </div>

            {/* Right: Dashboard Analytics */}
            <div className="lg:col-span-6 flex flex-col gap-6 w-full">
               
               {/* Main KPI */}
               <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-macroCoral/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 group-hover:bg-macroCoral/30 transition-colors duration-500"></div>
                  <div className="relative z-10">
                     <p className="text-[11px] text-slate-400 font-bold tracking-widest uppercase mb-2">Volumen de Insights Extraídos</p>
                     <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
                        <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter">10.478</span>
                        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md mb-2 w-fit">
                           <TrendingUp size={14} />
                           <span className="text-xs font-bold">+24% en 30 días</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Sentiment Breakdown */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/50">
                    <p className="text-[11px] text-slate-500 font-bold tracking-widest uppercase mb-5">Sentimiento en Tiempo Real</p>
                    <div className="space-y-4">
                      {/* Positive */}
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5"><span className="text-emerald-600">Positivo</span><span className="text-slate-900">68%</span></div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: '68%' }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-emerald-500 rounded-full"></motion.div></div>
                      </div>
                      {/* Neutral */}
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5"><span className="text-slate-500">Neutral</span><span className="text-slate-900">21%</span></div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: '21%' }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-slate-400 rounded-full"></motion.div></div>
                      </div>
                      {/* Negative */}
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5"><span className="text-macroCoral">Crítico</span><span className="text-slate-900">11%</span></div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: '11%' }} transition={{ duration: 1, delay: 0.6 }} className="h-full bg-macroCoral rounded-full"></motion.div></div>
                      </div>
                    </div>
                  </div>

                  {/* Time / Performance Metric */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/50 flex flex-col justify-center items-center text-center">
                     <div className="w-12 h-12 bg-macroBlue/10 text-macroBlue rounded-full flex items-center justify-center mb-4">
                        <Zap size={24} />
                     </div>
                     <p className="text-[11px] text-slate-500 font-bold tracking-widest uppercase mb-1">Latencia SLA</p>
                     <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-4xl font-black text-slate-900">0.8</span>
                        <span className="text-sm font-medium text-slate-500">seg</span>
                     </div>
                     <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider border border-emerald-100">Etiquetado Automático</p>
                  </div>
               </div>

               {/* Entities / Intents Bottom Panel */}
               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/50">
                  <div className="flex justify-between items-center mb-5">
                    <p className="text-[11px] text-slate-500 font-bold tracking-widest uppercase">Tópicos Estructurales Detectados</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {[
                       { label: 'Onboarding Digital', count: '4.2k' },
                       { label: 'Transferencias', count: '2.8k' },
                       { label: 'Inversiones', count: '1.9k' },
                       { label: 'Tarjetas de Mediano Riesgo', count: '980' },
                       { label: 'Préstamos Hipotecarios', count: '598' }
                     ].map((intent, idx) => (
                       <motion.div 
                         initial={{ opacity: 0, scale: 0.9 }}
                         whileInView={{ opacity: 1, scale: 1 }}
                         transition={{ delay: 0.1 * idx }}
                         key={intent.label} 
                         className="flex justify-between items-center bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-lg flex-grow hover:bg-slate-100 transition-colors"
                       >
                          <span className="text-xs font-bold text-slate-700 mr-4">{intent.label}</span>
                          <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200">{intent.count}</span>
                       </motion.div>
                     ))}
                  </div>
               </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};
