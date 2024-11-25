import React from 'react';
import uniLogo from '/src/assets/logo-uni.png';

const NeonTitle = ({ isMobile }) => {
  return (
    <div className={`
      fixed top-0 w-full z-50 
      ${isMobile ? 'px-4 py-2' : 'px-8 py-4'}
      bg-gradient-to-b from-black/80 to-transparent
      backdrop-blur-sm
    `}>
      <div className={`
        max-w-7xl mx-auto
        flex ${isMobile ? 'flex-col' : 'flex-row'} 
        items-center gap-4
      `}>
        {/* Contenedor de texto */}
        <div className={`
          flex-grow text-center
          flex flex-col gap-2
          ${isMobile ? 'order-2' : 'order-1'}
        `}>
          <h1 className={`
            font-['Exo_2'] font-thin tracking-widest text-white
            ${isMobile ? 'text-lg' : 'text-2xl md:text-3xl'}
            transition-all duration-300
            relative
          `}>
            <span className="relative">
              <span className="absolute -inset-1 blur-sm bg-blue-500/20 rounded-lg" />
              <span className="relative">EMISIONES DE CARBONO GLOBALES</span>
            </span>
          </h1>
          
          <p className={`
            font-['Exo_2'] tracking-wider text-zinc-400
            ${isMobile ? 'text-xs px-4' : 'text-sm md:text-base'}
            line-clamp-2 sm:line-clamp-none
          `}>
            Modelado Predictivo de Emisiones de Carbono: 
            <span className="hidden sm:inline">
              {" "}Enfoque Comparativo entre Sectores Empresariales y Públicos
            </span>
          </p>
        </div>

        {/* Logo */}
        <div className={`
          flex-shrink-0
          ${isMobile ? 'order-1 -mb-2' : 'order-2 ml-4'}
        `}>
          <img
            src={uniLogo}
            alt="Logo Universidad"
            className={`
              object-contain brightness-150
              transition-all duration-300
              ${isMobile ? 'h-16' : 'h-20 md:h-24'}
              hover:scale-105 hover:brightness-200
            `}
          />
        </div>
      </div>

      {/* Línea decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </div>
  );
};

export default NeonTitle;