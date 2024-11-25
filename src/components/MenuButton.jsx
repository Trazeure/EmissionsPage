import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Activity, BarChart, Star, BookOpen, TreePine } from 'lucide-react';

const MenuButton = ({ isMobile, onToggleMenu, setShowGlobal, setShowSimulation, setShowPredictions, setShowGlobalPredictions, setShowDictionary, setShowEducational, setIsRatingModalOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Animar el botón cada 5 segundos si está cerrado
    const interval = setInterval(() => {
      if (!isOpen) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (onToggleMenu) onToggleMenu(!isOpen);
  };

  const handleOptionClick = (action) => {
    action(true);
    setIsOpen(false);
  };

  return (
    <div className="fixed z-50 left-4 bottom-4">
      <button
        onClick={handleToggle}
        className={`
          relative flex items-center justify-center 
          w-16 h-16 rounded-full 
          bg-gradient-to-r from-blue-500 to-purple-600
          text-white shadow-lg 
          hover:from-blue-600 hover:to-purple-700
          transition-all duration-300
          ${isAnimating ? 'animate-pulse scale-110' : ''}
          group
        `}
        aria-label="Menú de opciones"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute left-20 hidden group-hover:flex items-center">
            <div className="bg-black/90 text-white px-3 py-2 rounded-lg whitespace-nowrap text-sm">
              Click para ver opciones
            </div>
          </div>
        )}

        {/* Indicador de pulso */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full">
            <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className={`
          absolute left-0 bottom-20 py-2 w-72
          bg-gradient-to-br from-black/95 to-gray-900/95
          backdrop-blur-lg rounded-2xl shadow-2xl
          border border-gray-700/50
          transform transition-all duration-300 ease-in-out
        `}>
          {/* Flecha decorativa */}
          <div className="absolute -bottom-2 left-6 w-4 h-4 bg-gray-900 transform rotate-45" />

          <button
            onClick={() => handleOptionClick(setShowGlobal)}
            className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-white/10 transition-colors"
          >
            <Globe size={20} className="text-blue-400" />
            <span>Estadísticas Globales</span>
          </button>

          <button
            onClick={() => handleOptionClick(setShowSimulation)}
            className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-white/10 transition-colors"
          >
            <Activity size={20} className="text-green-400" />
            <span>Simulador</span>
          </button>

          <button
            onClick={() => handleOptionClick(setShowPredictions)}
            className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-white/10 transition-colors"
          >
            <BarChart size={20} className="text-purple-400" />
            <span>Predicciones</span>
          </button>

          <button
            onClick={() => handleOptionClick(setShowGlobalPredictions)}
            className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-white/10 transition-colors"
          >
            <Globe size={20} className="text-cyan-400" />
            <span>Predicciones Globales</span>
          </button>

          <button
            onClick={() => handleOptionClick(setShowDictionary)}
            className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-white/10 transition-colors"
          >
            <BookOpen size={20} className="text-indigo-400" />
            <span>Fuente de datos</span>
          </button>

          <button
            onClick={() => handleOptionClick(setShowEducational)}
            className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-white/10 transition-colors"
          >
            <TreePine size={20} className="text-green-500" />
            <span>Guía del Proyecto</span>
          </button>

          <button
            onClick={() => handleOptionClick(setIsRatingModalOpen)}
            className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-white/10 transition-colors"
          >
            <Star size={20} className="text-yellow-400" />
            <span>Valorar Experiencia</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuButton;