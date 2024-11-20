import React from 'react';
import uniLogo from '/src/assets/logo-uni.png';

const NeonTitle = () => {
    return (
      <div className="fixed top-0 w-full px-8 py-2 z-50 flex justify-between items-center">
        {/* Título y subtítulo centrados */}
        <div className="flex-grow text-center flex flex-col gap-2">
          <h1 className="exo text-3xl font-thin tracking-widest text-white">
            EMISIONES DE CARBONO GLOBALES
          </h1>
          <p className="exo text-sm font-thin tracking-wider text-zinc-400">
            Modelado Predictivo de Emisiones de Carbono: Enfoque Comparativo entre Sectores Empresariales y Públicos
          </p>
        </div>
        
        {/* Logo a la derecha */}
        <div className="flex-shrink-0 ml-4">
          <img 
            src={uniLogo}
            alt="Logo Universidad"
            className="h-24 w-auto object-contain brightness-150"
          />
        </div>
        
        <style jsx>{`
          .exo {
            font-family: 'Exo 2', sans-serif;
            letter-spacing: 0.25em;
            font-weight: 200;
          }
        `}</style>
      </div>
    );
};
   
export default NeonTitle;