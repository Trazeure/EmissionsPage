import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X, Plus } from 'lucide-react';

const TeamInfoBox = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  const teamMembers = [
    "Luis Angel Cordova Gil",
    "Jose Lopez Mercado",
    "Raul Romo Alonso"
  ];

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="team-info-box fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 max-w-sm w-full md:w-auto bg-gradient-to-br from-zinc-900/95 to-black/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-zinc-800/50"
          >
            <div className="absolute -top-3 -left-3 w-16 h-16 bg-blue-500 rounded-2xl -z-10 blur-2xl opacity-20" />
            <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-purple-500 rounded-2xl -z-10 blur-2xl opacity-20" />
            
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-blue-400" />
              <h2 className="font-['Exo'] text-2xl md:text-3xl font-thin tracking-widest text-white">
                Equipo 25-1-0015
              </h2>
            </div>

            <ul className="mt-4 space-y-2">
              {teamMembers.map((member, index) => (
                <motion.li
                  key={member}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 hover:bg-white/5 rounded-xl transition-all duration-300 font-['Exo'] text-zinc-300 tracking-wider cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                  <span className="relative">{member}</span>
                </motion.li>
              ))}
            </ul>

            <button
              className="md:hidden mt-6 w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-zinc-700/50 rounded-xl text-zinc-300 transition-all duration-300 flex items-center justify-center gap-2"
              onClick={() => setIsVisible(false)}
            >
              <X className="w-4 h-4" />
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!isVisible && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-4 right-4 md:hidden bg-gradient-to-br from-blue-500 to-purple-500 p-4 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          onClick={() => setIsVisible(true)}
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.button>
      )}
    </>
  );
};

export default TeamInfoBox;