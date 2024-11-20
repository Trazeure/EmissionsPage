import React from 'react';
import { Pause, Play, ZoomIn, ZoomOut, Mouse, TouchpadIcon } from 'lucide-react';

const Controls = ({ onPause, isPlaying }) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
      {/* Control Panel Container */}
      <div className="bg-black/70 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/10">
        {/* Pause/Play Control */}
        <div className="flex flex-col items-center gap-4 mb-4">
          <button
            onClick={() => onPause()}
            className="p-4 rounded-full bg-white hover:bg-gray-200 transition-all transform hover:scale-110 text-black shadow-lg"
            title={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-2 gap-3 text-xs text-white/80">
          <div className="flex items-center gap-2">
            <Mouse size={14} />
            <span>Arrastrar para rotar</span>
          </div>
          <div className="flex items-center gap-2">
            <TouchpadIcon size={14} />
            <span>Tocar para seleccionar</span>
          </div>
          <div className="flex items-center gap-2">
            <ZoomIn size={14} />
            <span>Rueda para acercar</span>
          </div>
          <div className="flex items-center gap-2">
            <ZoomOut size={14} />
            <span>Rueda para alejar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
