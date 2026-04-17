import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Hero } from './components/01Hero';
import { HeroTeaser } from './components/02Teaser';
import MacroStrategicAperture from './components/03Proposal';
import { WorkspaceAgentDemo } from './components/04Automation';
import { DiscoverySimulator } from './components/05Discovery';
import { Academy } from './components/06Academy';
import { DevelopmentCase } from './components/07DevelopmentCase';
import { Security } from './components/08Security';
import { Experience } from './components/09AiWorkify';
import { Contacto } from './components/10Contacto';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'bM@cr0_2026!_$AiW#9') {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-macroLight flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-slate-200/50 max-w-md w-full border border-white ring-1 ring-slate-100"
        >
           <div className="flex justify-center mb-8">
             <div className="w-20 h-20 bg-gradient-to-br from-macroBlue/10 to-white rounded-2xl flex items-center justify-center text-macroBlue shadow-sm border border-macroBlue/10">
               <Lock size={36} strokeWidth={1.5} />
             </div>
           </div>
           
           <div className="text-center mb-8">
             <h2 className="text-2xl font-display font-bold text-macroBlue mb-3 tracking-tight">Acceso Restringido</h2>
             <p className="text-slate-500 text-sm leading-relaxed px-4">
               Propuesta Estratégica Confidencial<br/>
               <span className="font-semibold text-[#0039e3]">BANCO MACRO 2026</span>
             </p>
           </div>
           
           <form onSubmit={handleLogin} className="space-y-5">
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contraseña de Seguridad</label>
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => {
                    setPassword(e.target.value);
                    if(error) setError(false);
                 }}
                 className={`w-full px-4 py-3.5 rounded-xl border outline-none transition-all text-center tracking-widest font-medium placeholder:tracking-normal ${
                   error 
                    ? 'border-red-300 bg-red-50/50 text-red-900 focus:border-red-500' 
                    : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-macroBlue focus:ring-4 focus:ring-macroBlue/5'
                 }`}
                 placeholder="Ingrese clave de acceso"
                 autoFocus
               />
             </div>
             
             <AnimatePresence>
               {error && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0, marginTop: 0 }}
                   animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                   exit={{ opacity: 0, height: 0, marginTop: 0 }}
                   className="overflow-hidden"
                 >
                   <div className="text-red-600 text-xs font-bold text-center bg-red-50 p-3 rounded-lg border border-red-100 flex items-center justify-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                     <span>Acceso denegado. Verifique credenciales.</span>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>

             <button 
               type="submit"
               className="w-full bg-macroBlue hover:bg-[#00224D] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-macroBlue/10 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
             >
               Acceder al Sitio
             </button>
           </form>
           
           <div className="mt-10 pt-8 border-t border-slate-50 text-center">
             <div className="flex justify-center items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <img 
                   src="https://images.aiworkify.com/macro-project/aiw-logo.png" 
                   alt="AI Workify" 
                   className="h-5 object-contain"
                 />
             </div>
             <p className="text-[9px] text-slate-300 mt-4 font-mono tracking-wider">
               SECURE GATEWAY • AUTHORIZED PERSONNEL ONLY
             </p>
           </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-macroLight font-sans text-slate-900 selection:bg-macroCoral selection:text-white">
      <main>
        <Hero />
        <HeroTeaser />
        <MacroStrategicAperture />
        <WorkspaceAgentDemo />
        <DiscoverySimulator />
        <Academy />
        <DevelopmentCase />
        <Security />
        <Experience />
        <Contacto />
      </main>

      <footer className="bg-macroBlue text-white py-12 text-center text-sm">
        <div className="max-w-7xl mx-auto px-6 opacity-90">
          <p className="mb-2">Documento confidencial para uso interno de Banco Macro.</p>
          <p>© 2026 AI WORKIFY LTD. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;