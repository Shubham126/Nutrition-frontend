import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Image as ImageIcon } from 'lucide-react';

export default function DrinkCard({ id, name, status, imageUrl }) {
  const navigate = useNavigate();

  // Color mapping based on health status
  const getStatusBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'safe':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40';
      case 'moderate':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'not safe':
        return 'bg-rose-950/80 text-rose-400 border-rose-500/40';
      default:
        return 'bg-carbon text-lime border-olive';
    }
  };

  const handleCardClick = () => {
    // Navigates to a detailed view for this drink
    navigate(`/drink/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer relative flex flex-col justify-between bg-carbon/90 border border-olive/50 hover:border-gold rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(197,160,89,0.15)]"
    >
      {/* Top Health Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border ${getStatusBadgeStyle(
            status
          )}`}
        >
          {status}
        </span>
        <div className="w-8 h-8 rounded-full bg-forest border border-olive/40 flex items-center justify-center text-lime/50 group-hover:text-gold group-hover:border-gold/60 transition-colors">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Central Image Placeholder */}
      <div className="w-full h-44 rounded-xl bg-forest/80 border border-dashed border-olive/80 flex flex-col items-center justify-center text-lime/40 group-hover:border-gold/40 transition-colors overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <ImageIcon className="w-8 h-8 opacity-40 text-lime" />
            <span className="text-xs tracking-wide">Image Placeholder</span>
          </div>
        )}
      </div>

      {/* Drink Information */}
      <div className="mt-5">
        <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-gold transition-colors">
          {name}
        </h3>
        <p className="text-xs text-lime/60 mt-1">Click to analyze full nutritional profile</p>
      </div>

      {/* Subtle Metallic Gold Accent Bottom Border */}
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent mt-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
}