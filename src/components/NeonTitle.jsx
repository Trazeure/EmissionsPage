import React, { useEffect, useState } from 'react';
import uniLogo from '/src/assets/logo-uni.png';

const ModernHeader = ({ isMobile }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`
        fixed top-0 w-full z-50
        transition-all duration-500 ease-in-out
        ${scrolled ? 'bg-white/10' : 'bg-transparent'}
        backdrop-blur-md
      `}
    >
      <div className={`
        max-w-7xl mx-auto
        ${isMobile ? 'px-4 py-2' : 'px-8 py-4'}
        flex ${isMobile ? 'flex-col' : 'flex-row'}
        items-center gap-4
      `}>
        <div className={`
          flex-grow
          ${isMobile ? 'order-2' : 'order-1'}
        `}>
          <h1 className={`
            font-['Exo_2'] font-light
            ${isMobile ? 'text-lg' : 'text-2xl md:text-3xl'}
            text-white
            transition-all duration-500
            animate-slide-up-fade
          `}>
            <span className="inline-block animate-fade-in opacity-0 [animation-delay:200ms]">
              EMISIONES DE CARBONO GLOBALES
            </span>
        
          </h1>
          
          <p className={`
            mt-2 font-['Exo_2'] 
            ${isMobile ? 'text-xs' : 'text-sm md:text-base'}
            text-zinc-300/90
            animate-fade-in opacity-0 [animation-delay:600ms]
          `}>
            Modelado Predictivo de Emisiones de Carbono:
            <span className="hidden sm:inline">
              {" "}Enfoque Comparativo entre Sectores Empresariales y Públicos
            </span>
          </p>
        </div>

        <div className={`
          flex-shrink-0
          ${isMobile ? 'order-1 -mb-2' : 'order-2 ml-4'}
        `}>
          <img
            src={uniLogo}
            alt="Logo Universidad"
            className={`
              object-contain
              transition-all duration-500
              ${isMobile ? 'h-16' : 'h-20 md:h-24'}
              animate-fade-in opacity-0 [animation-delay:800ms]
              hover:scale-102
            `}
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div className="
          h-full mx-auto
          bg-gradient-radial from-white/20 to-transparent
          animate-gradient
        "/>
      </div>
    </header>
  );
};

export default ModernHeader;