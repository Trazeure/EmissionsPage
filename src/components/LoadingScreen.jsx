import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  
  const loadingPhrases = [
    "Preparando esfera terrestre...",
    "Cargando datos ambientales...",
    "Inicializando visualización...",
    "Calibrando sensores...",
    "Activando partículas...",
    "Sincronizando ecosistemas...",
  ];

  useEffect(() => {
    let currentProgress = 0;
    const phraseInterval = setInterval(() => {
      const phraseIndex = Math.floor((currentProgress / 100) * loadingPhrases.length);
      setLoadingText(loadingPhrases[phraseIndex] || loadingPhrases[loadingPhrases.length - 1]);
    }, 2500);

    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress > 100) {
        currentProgress = 100;
        clearInterval(interval);
        clearInterval(phraseInterval);
        setTimeout(() => {
          onLoadComplete();
        }, 1000);
      }
      setProgress(Math.min(currentProgress, 100));
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(phraseInterval);
    };
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#E7F0DC] to-[#597445]">
      {/* Container principal */}
      <div className="relative w-full max-w-md px-8 py-12">
        {/* Icono de carga animado */}
        <div className="flex justify-center mb-8">
          <Loader2 className="w-12 h-12 text-[#2A3B1F] animate-spin" />
        </div>
        
        {/* Texto de carga con fade */}
        <div className="h-6 mb-6 text-center">
          <p className="text-[#2A3B1F] font-medium animate-pulse">
            {loadingText}
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="relative h-2 mb-4 overflow-hidden bg-white/30 rounded-full">
          <div
            className="absolute top-0 left-0 h-full bg-[#2A3B1F] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
          {/* Efecto de brillo */}
          <div
            className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-fast"
            style={{ transform: `translateX(${progress}%)` }}
          />
        </div>

        {/* Porcentaje */}
        <div className="text-center font-bold text-[#2A3B1F]">
          {Math.round(progress)}%
        </div>

        {/* Partículas decorativas */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#2A3B1F]/20 animate-float-random"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;