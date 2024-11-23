import React from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, ZoomIn, ZoomOut, Mouse, TouchpadIcon } from 'lucide-react';

const Controls = ({ onPause, isPlaying }) => {
  const instructions = [
    { icon: Mouse, text: "Arrastrar para rotar" },
    { icon: TouchpadIcon, text: "Tocar para seleccionar" },
    { icon: ZoomIn, text: "Rueda para acercar" },
    { icon: ZoomOut, text: "Rueda para alejar" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-24 inset-x-0 mx-auto flex justify-center items-center"
    >
      <div className="bg-gradient-to-b from-black/80 to-black/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10 relative overflow-hidden max-w-md w-auto">
        {/* Ambient glow effects */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl" />
        
        {/* Pause/Play Control */}
        <div className="flex justify-center mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPause()}
            className="p-4 rounded-full bg-gradient-to-br from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 transition-all text-black shadow-lg relative group"
            title={isPlaying ? "Pausar" : "Reproducir"}
          >
            <div className="absolute inset-0 rounded-full bg-white/20 blur-md group-hover:blur-lg transition-all" />
            <div className="relative">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </div>
          </motion.button>
        </div>

        {/* Instructions Grid */}
        <div className="grid grid-cols-2 gap-4">
          {instructions.map((instruction, index) => (
            <motion.div
              key={instruction.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 group"
            >
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                <instruction.icon size={14} className="text-white/80" />
              </div>
              <span className="text-sm text-white/80 font-medium tracking-wide whitespace-nowrap">
                {instruction.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Controls;