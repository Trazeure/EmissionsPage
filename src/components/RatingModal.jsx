import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const RatingModal = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!rating || rating < 1 || rating > 5) {
      alert('Por favor selecciona una calificación válida');
      return;
    }
    
    if (!name.trim() || name.length < 2) {
      alert('Por favor ingresa un nombre válido');
      return;
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Por favor ingresa un email válido');
      return;
    }

    // Limitar la frecuencia de valoraciones
    const lastRating = localStorage.getItem('lastRating');
    if (lastRating) {
      const timeSinceLastRating = Date.now() - parseInt(lastRating);
      if (timeSinceLastRating < 24 * 60 * 60 * 1000) { // 24 horas
        alert('Solo puedes enviar una valoración por día');
        return;
      }
    }

    try {
      await addDoc(collection(db, 'ratings'), {
        name,
        email,
        rating,
        timestamp: new Date(),
        url: window.location.href
      });

      localStorage.setItem('lastRating', Date.now().toString());
      setShowThankYou(true);
      setTimeout(() => {
        setShowThankYou(false);
        onClose();
        // Resetear el formulario
        setRating(0);
        setName('');
        setEmail('');
      }, 2000);

    } catch (error) {
      console.error("Error:", error);
      alert('Hubo un error al enviar tu valoración');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-black w-full max-w-md m-4 rounded-xl shadow-2xl relative border border-gray-800">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {!showThankYou ? (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Valora tu Experiencia
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="transform transition-all duration-300 hover:scale-110"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-600'
                      } transition-colors duration-300`}
                    />
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                />
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:opacity-90 transition-opacity text-white"
              >
                Enviar Valoración
              </button>
            </form>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              ¡Gracias por tu valoración!
            </h3>
            <p className="text-gray-400">
              Tu opinión nos ayuda a mejorar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingModal;