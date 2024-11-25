import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X } from 'lucide-react';

const TeamInfoBox = ({ isMobile }) => {
  const [isVisible, setIsVisible] = useState(false);

  const teamMembers = [
    "Luis Angel Cordova Gil",
    "Jose Lopez Mercado",
    "Raul Romo Alonso"
  ];

  return (
    <>
      {/* Botón flotante */}
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className={`
          fixed z-50 bottom-4 right-4 md:bottom-8 md:right-8
          flex items-center gap-2 px-4 py-3
          bg-gradient-to-r from-indigo-500/90 to-purple-600/90
          hover:from-indigo-500 hover:to-purple-600
          rounded-xl shadow-lg backdrop-blur-sm
          border border-white/10 transition-all duration-300
          text-white group
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Users className="w-6 h-6" />
        <span className="text-sm font-medium">Equipo 25-1</span>
        
        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Indicador de pulso */}
        <div className="absolute -top-1 -right-1 w-3 h-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500" />
        </div>
      </motion.button>

      {/* Panel de información */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`
              fixed z-40 
              ${isMobile 
                ? 'bottom-20 right-4 left-4' 
                : 'bottom-24 right-8 max-w-sm'
              }
              bg-gradient-to-br from-zinc-900/95 to-black/95 
              backdrop-blur-md rounded-2xl p-4 sm:p-6
              shadow-2xl border border-zinc-800/50
              transition-all duration-300 ease-in-out
            `}
          >
            {/* Efectos de gradiente */}
            <div className="absolute -top-3 -left-3 w-16 h-16 bg-blue-500 rounded-2xl -z-10 blur-2xl opacity-20" />
            <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-purple-500 rounded-2xl -z-10 blur-2xl opacity-20" />

            {/* Encabezado */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Users className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-blue-400`} />
                <h2 className={`
                  font-['Exo'] font-thin tracking-widest text-white
                  ${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl'}
                `}>
                  Equipo 25-1-0015
                </h2>
              </div>
              
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {/* Lista de miembros */}
            <ul className={`space-y-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
              {teamMembers.map((member, index) => (
                <motion.li
                  key={member}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    p-2 sm:p-3 
                    hover:bg-white/5 rounded-xl 
                    transition-all duration-300 
                    font-['Exo'] text-zinc-300 tracking-wider 
                    cursor-pointer group relative overflow-hidden
                  `}
                >
                  <div className="
                    absolute inset-0 
                    bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                    translate-x-[-100%] group-hover:translate-x-0 
                    transition-transform duration-300
                  " />
                  <span className="relative">{member}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TeamInfoBox;