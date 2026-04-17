import React from 'react';
import { motion } from 'framer-motion';
import { Server, ShieldCheck, FileCheck, Award, LockKeyhole } from 'lucide-react';

export const Security: React.FC = () => {
  const cards = [
    {
      icon: ShieldCheck,
      title: "Seguridad Bancaria",
      desc: "Datos encriptados end-to-end. Ningún dato de cliente se utiliza para entrenar modelos públicos."
    },
    {
      icon: Server,
      title: "Infraestructura Híbrida",
      desc: "Despliegue on-premise o en nube privada según los requerimientos de seguridad."
    },
    {
      icon: FileCheck,
      title: "Compliance Normativo",
      desc: "Alineamiento con directivas BCRA y estándares globales para instituciones reguladas."
    },
    {
      icon: Award,
      title: "Calidad Internacional",
      desc: "Auditorías de arquitectura, procesos de control continuo y certificaciones globales."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
  };

  return (
    <section className="py-24 bg-[#011429] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-macroCoral/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-macroCoral/10 text-macroCoral text-sm font-bold tracking-wide uppercase mb-6 shadow-sm">
              <LockKeyhole size={16} className="text-macroCoral" />
              Enterprise Grade Security
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
              Estándares de<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                Calidad y Seguridad
              </span>
            </h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed font-light">
              Con sede central en Londres, Ai Workify opera en conjunto con instituciones financieras altamente reguladas en Estados Unidos y Europa, así como con Bancos Multilaterales de Crédito. Nuestra arquitectura de gestión de datos está diseñada bajo los más rigurosos estándares internacionales de la industria. Asimismo, nuestro modelo de implementación prioriza la integración absoluta con las políticas internas de seguridad de la información exigidas por Banco Macro, garantizando el cumplimiento estricto de todas las normativas locales vigentes.
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/5 to-transparent rounded-3xl -z-10 blur-xl"></div>
            {cards.map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl shadow-black/20 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-12 h-12 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center shrink-0 text-blue-400 mb-5 group-hover:scale-110 transition-transform duration-500 group-hover:text-teal-300 group-hover:border-teal-500/50 group-hover:bg-teal-900/30">
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
