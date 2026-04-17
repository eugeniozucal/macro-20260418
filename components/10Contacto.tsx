import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar } from 'lucide-react';

export const Contacto: React.FC = () => {
  return (
    <section className="py-24 bg-macroBlue text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-display font-bold mb-6">¿Listos para el siguiente paso?</h2>
          <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto">
            Agendemos una reunión ejecutiva para profundizar en esta propuesta y definir los próximos pasos para Banco Macro.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a href="mailto:ez@aiworkify.com" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors px-6 py-4 rounded-xl backdrop-blur-sm border border-white/10">
              <Mail className="text-macroCoral" />
              <span className="font-medium">ez@aiworkify.com</span>
            </a>
            <a href="https://calendar.app.google/Ximi3qMCFnsgFjSz5" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-macroCoral hover:bg-amber-500 transition-colors px-6 py-4 rounded-xl font-bold shadow-lg shadow-macroCoral/20">
              <Calendar />
              <span>Agendar Reunión</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
