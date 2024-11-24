import React, { useState } from 'react';
import { Star } from 'lucide-react';
import RatingModal from './RatingModal';

const RatingButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 
                   bg-black/70 backdrop-blur-sm border border-gray-700
                   rounded-xl shadow-lg hover:bg-black/90 transition-all duration-300
                   text-white group"
      >
        <Star className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Valorar Experiencia</span>
      </button>

      <RatingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default RatingButton;