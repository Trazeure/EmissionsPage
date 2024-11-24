import React, { useState, useEffect } from 'react';
import { Star, X, Users, BarChart2, Globe } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const RatingsDashboard = ({ isVisible, onClose }) => {
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState({
    totalVotes: 0,
    averageRating: 0,
    lastWeekVotes: 0,
    distribution: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    }
  });

  useEffect(() => {
    if (isVisible) {
      fetchRatings();
    }
  }, [isVisible]);

  const fetchRatings = async () => {
    try {
      const ratingsRef = collection(db, 'ratings');
      const q = query(ratingsRef, orderBy('timestamp', 'desc'), limit(100));
      const querySnapshot = await getDocs(q);
      
      const ratingsData = [];
      let totalRating = 0;
      let validRatings = 0;
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      let lastWeekCount = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const rating = Number(data.rating);
        
        // Verificar que el rating sea válido
        if (!isNaN(rating) && rating >= 1 && rating <= 5) {
          totalRating += rating;
          validRatings++;
          distribution[rating]++;

          const timestamp = data.timestamp?.toDate() || new Date();
          if (timestamp > oneWeekAgo) {
            lastWeekCount++;
          }
        }

        ratingsData.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
          rating: rating
        });
      });

      setRatings(ratingsData);
      setStats({
        totalVotes: validRatings,
        averageRating: validRatings > 0 ? totalRating / validRatings : 0,
        lastWeekVotes: lastWeekCount,
        distribution
      });
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setStats({
        totalVotes: 0,
        averageRating: 0,
        lastWeekVotes: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-black w-full max-w-6xl m-4 rounded-xl shadow-2xl relative border border-gray-800 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-br from-gray-900 to-black p-6 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Star className="w-8 h-8 text-yellow-400" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Valoraciones y Opiniones
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 p-6 rounded-xl border border-blue-500/30">
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Total Valoraciones</p>
                  <p className="text-3xl font-bold text-white">{stats.totalVotes}</p>
                </div>
              </div>
            </div>

            <div className="bg-black/40 p-6 rounded-xl border border-yellow-500/30">
              <div className="flex items-center gap-4">
                <Star className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">Calificación Promedio</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/40 p-6 rounded-xl border border-green-500/30">
              <div className="flex items-center gap-4">
                <BarChart2 className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Última Semana</p>
                  <p className="text-3xl font-bold text-white">{stats.lastWeekVotes}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-4">Distribución de Estrellas</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(star => {
                const count = stats.distribution[star] || 0;
                const percentage = stats.totalVotes > 0 ? (count / stats.totalVotes) * 100 : 0;
                
                return (
                  <div key={star} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-20">
                      <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                      <span className="text-gray-400">{star}</span>
                    </div>
                    <div className="flex-1 h-4 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400/50 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-32 text-right">
                      <span className="text-gray-400">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Ratings */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Valoraciones Recientes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ratings.map((rating) => (
                <div 
                  key={rating.id}
                  className="bg-black/40 p-4 rounded-xl border border-gray-800"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-white">{rating.name}</span>
                        <span className="text-sm text-gray-500">
                          {rating.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < rating.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-400">{rating.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingsDashboard;