import React from 'react';
import { motion } from 'framer-motion';

export const HeroTeaser: React.FC = () => {
  const text = "Queremos acompañarlos en todos los aspectos que construirán la Cultura IA en Banco Macro.";
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#0039e3] overflow-hidden">
      {/* Subtle, slow-moving macroCoral mesh gradient blur */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute w-[800px] h-[800px] bg-macroCoral/20 rounded-full blur-[120px] -top-[200px] -right-[200px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute w-[600px] h-[600px] bg-aiw-blue/20 rounded-full blur-[100px] -bottom-[100px] -left-[100px] pointer-events-none"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-x-3 gap-y-2 md:gap-x-4 md:gap-y-4"
        >
          {words.map((word, index) => (
            <motion.span
              variants={child}
              key={index}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-tight"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="mt-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-sm font-medium tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-macroCoral animate-pulse"></span>
            AI WORKIFY - ABRIL 2026
          </div>
        </motion.div>
      </div>
    </section>
  );
};
