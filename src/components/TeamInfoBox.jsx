import React from 'react';
import './TeamInfoBox.css';

const TeamInfoBox = () => {
  return (
    <>
      <div className="team-info-box fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 max-w-sm w-full md:w-auto bg-black/90 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-2xl border border-zinc-800">
        <h2 className="font-['Exo'] text-2xl md:text-3xl font-thin tracking-widest text-white text-center md:text-left mb-6">
          Equipo 25-1-0015
        </h2>
        <ul className="mt-4 space-y-4 md:space-y-3 font-['Exo'] text-zinc-400 tracking-wider text-center md:text-left text-sm md:text-base">
          <li className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors">
            Luis Angel Cordova Gil
          </li>
          <li className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors">
            Jose Lopez Mercado
          </li>
          <li className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors">
            Raul Romo Alonso
          </li>
        </ul>

        {/* Botón para cerrar en móvil */}
        <button 
          className="md:hidden mt-4 w-full py-2 px-4 border border-zinc-700 rounded-lg text-zinc-400 hover:bg-zinc-800/50 transition-colors"
          onClick={() => {
            const box = document.querySelector('.team-info-box');
            box.classList.add('hidden');
          }}
        >
          Cerrar
        </button>
      </div>

      {/* Botón para mostrar en móvil */}
      <button 
        className="fixed bottom-4 right-4 md:hidden bg-black/90 p-3 rounded-full border border-zinc-800 shadow-lg team-info-show-btn"
        onClick={() => {
          const box = document.querySelector('.team-info-box');
          box.classList.remove('hidden');
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </>
  );
};

export default TeamInfoBox;