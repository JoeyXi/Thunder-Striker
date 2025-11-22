
import React from 'react';
import { COLORS } from '../../constants';

export const PlayerShip: React.FC<{ width: number; height: number; banking?: number }> = ({ width, height, banking = 0 }) => {
  // Banking simulates the tilt of the ship when moving left/right
  const tilt = banking * 20; 

  return (
    <g transform={`rotate(${tilt}, ${width/2}, ${height/2})`}>
      <defs>
        {/* Main Body Red Gradient */}
        <linearGradient id="fighterRed" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#991b1b" /> {/* Dark Red */}
          <stop offset="40%" stopColor="#dc2626" /> {/* Red */}
          <stop offset="60%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>

        {/* Metallic / White Gradient */}
        <linearGradient id="fighterSilver" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9ca3af" />
          <stop offset="50%" stopColor="#f3f4f6" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>

        {/* Cockpit Glass */}
        <linearGradient id="glassBlue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>

      {/* --- Engine Flames (Animated) --- */}
      <g transform="translate(0, 2)">
        <path d={`M ${width * 0.4} ${height * 0.85} L ${width * 0.45} ${height * 1.1} L ${width * 0.5} ${height * 0.85} Z`} fill="#3b82f6" opacity="0.8" className="animate-pulse" />
        <path d={`M ${width * 0.6} ${height * 0.85} L ${width * 0.55} ${height * 1.1} L ${width * 0.5} ${height * 0.85} Z`} fill="#3b82f6" opacity="0.8" className="animate-pulse" />
      </g>

      {/* --- Shadow/Understructure --- */}
      <path d={`M ${width * 0.5} 0 L ${width} ${height * 0.8} L ${width * 0.5} ${height} L 0 ${height * 0.8} Z`} fill="#000" opacity="0.3" transform="translate(4, 4)" />

      {/* --- Rear Stabilizers (The twin tails) --- */}
      <path d={`M ${width * 0.35} ${height * 0.6} L ${width * 0.35} ${height * 0.95} L ${width * 0.25} ${height * 0.9} Z`} fill="url(#fighterRed)" stroke="#500" strokeWidth="0.5" />
      <path d={`M ${width * 0.65} ${height * 0.6} L ${width * 0.65} ${height * 0.95} L ${width * 0.75} ${height * 0.9} Z`} fill="url(#fighterRed)" stroke="#500" strokeWidth="0.5" />

      {/* --- Main Wings --- */}
      {/* Left Wing */}
      <path 
        d={`M ${width * 0.45} ${height * 0.4} 
           L ${width * 0.1} ${height * 0.65} 
           L ${width * 0.1} ${height * 0.8} 
           L ${width * 0.4} ${height * 0.75} Z`} 
        fill="url(#fighterRed)" 
        stroke="#450a0a" 
        strokeWidth="0.5"
      />
      {/* Right Wing */}
      <path 
        d={`M ${width * 0.55} ${height * 0.4} 
           L ${width * 0.9} ${height * 0.65} 
           L ${width * 0.9} ${height * 0.8} 
           L ${width * 0.6} ${height * 0.75} Z`} 
        fill="url(#fighterRed)" 
        stroke="#450a0a" 
        strokeWidth="0.5"
      />

      {/* Blue Wing Tips */}
      <path d={`M ${width * 0.1} ${height * 0.65} L ${width * 0.05} ${height * 0.7} L ${width * 0.1} ${height * 0.8} Z`} fill="#1d4ed8" />
      <path d={`M ${width * 0.9} ${height * 0.65} L ${width * 0.95} ${height * 0.7} L ${width * 0.9} ${height * 0.8} Z`} fill="#1d4ed8" />

      {/* --- Main Fuselage --- */}
      {/* Central Body */}
      <path 
        d={`M ${width * 0.5} ${height * 0.05} 
           L ${width * 0.65} ${height * 0.3} 
           L ${width * 0.6} ${height * 0.9} 
           L ${width * 0.4} ${height * 0.9} 
           L ${width * 0.35} ${height * 0.3} Z`} 
        fill="url(#fighterRed)" 
      />

      {/* Air Intakes (Silver/White parts on side) */}
      <path d={`M ${width * 0.35} ${height * 0.3} L ${width * 0.25} ${height * 0.4} L ${width * 0.25} ${height * 0.7} L ${width * 0.38} ${height * 0.8} Z`} fill="url(#fighterSilver)" stroke="#4b5563" strokeWidth="0.5" />
      <path d={`M ${width * 0.65} ${height * 0.3} L ${width * 0.75} ${height * 0.4} L ${width * 0.75} ${height * 0.7} L ${width * 0.62} ${height * 0.8} Z`} fill="url(#fighterSilver)" stroke="#4b5563" strokeWidth="0.5" />

      {/* Nose Cone Detail */}
      <path d={`M ${width * 0.5} 0 L ${width * 0.55} ${height * 0.15} L ${width * 0.45} ${height * 0.15} Z`} fill="#cbd5e1" />

      {/* Cockpit */}
      <path 
        d={`M ${width * 0.5} ${height * 0.2} 
           L ${width * 0.58} ${height * 0.35} 
           L ${width * 0.58} ${height * 0.5} 
           L ${width * 0.42} ${height * 0.5} 
           L ${width * 0.42} ${height * 0.35} Z`} 
        fill="url(#glassBlue)" 
        stroke="#1e3a8a" 
        strokeWidth="1"
      />
      {/* Cockpit Glint */}
      <path d={`M ${width * 0.52} ${height * 0.25} L ${width * 0.55} ${height * 0.45}`} stroke="white" strokeWidth="2" opacity="0.6" strokeLinecap="round" />

      {/* Vulcan Cannons (Front) */}
      <rect x={width * 0.3} y={height * 0.4} width={4} height={10} fill="#333" />
      <rect x={width * 0.65} y={height * 0.4} width={4} height={10} fill="#333" />
    </g>
  );
};
