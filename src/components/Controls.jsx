import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pause,
  Play,
  Mouse,
  TouchpadIcon,
  Maximize2,
  Minimize2
} from 'lucide-react';

const Controls = ({ onPause, isPlaying }) => {
  const instructions = [
    { icon: Mouse, text: "Arrastrar", color: "from-blue-500/30 to-cyan-500/30" },
    { icon: TouchpadIcon, text: "Seleccionar", color: "from-purple-500/30 to-pink-500/30" },
    { icon: Maximize2, text: "Acercar", color: "from-green-500/30 to-emerald-500/30" },
    { icon: Minimize2, text: "Alejar", color: "from-orange-500/30 to-red-500/30" }
  ];

  return (
    <div className="fixed inset-x-0 bottom-22 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20 
        }}
        className="w-auto"
      >
        <motion.div 
          className="bg-gradient-to-t from-black/95 via-black/90 to-black/80 backdrop-blur-lg rounded-2xl p-3 shadow-lg border border-white/10 relative overflow-hidden min-w-[300px]"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {/* Ambient glow effects */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
          
          {/* Pause/Play Control */}
          <div className="flex justify-center mb-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPause()}
              className="p-2 rounded-full bg-gradient-to-br from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 transition-all text-black shadow-lg relative group"
              title={isPlaying ? "Pausar" : "Reproducir"}
            >
              <div className="absolute inset-0 rounded-full bg-white/30 blur-md group-hover:blur-lg transition-all" />
              <motion.div 
                className="relative"
                animate={{ rotate: isPlaying ? 0 : 360 }}
                transition={{ duration: 0.5 }}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </motion.div>
            </motion.button>
          </div>

          {/* Instructions Grid */}
          <div className="grid grid-cols-4 gap-2 px-2">
            <AnimatePresence>
              {instructions.map((instruction, index) => (
                <motion.div
                  key={instruction.text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  className="flex flex-col items-center gap-1 group bg-black/20 rounded-lg p-1.5 hover:bg-black/30 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div 
                    className={`p-1.5 rounded-md bg-gradient-to-br ${instruction.color} group-hover:shadow-sm transition-all duration-300 flex-shrink-0`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <instruction.icon size={14} className="text-white" />
                  </motion.div>
                  <span className="text-xs text-white/90 font-medium text-center">
                    {instruction.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Controls;