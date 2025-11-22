import React from 'react';
import { COLORS } from '../../constants';

export const PlayerShip: React.FC<{ width: number; height: number; banking?: number }> = ({ width, height, banking = 0 }) => {
  // Banking simulates the tilt of the ship when moving left/right
  const tilt = banking * 15; 

  return (
    <g transform={`rotate(${tilt}, ${width/2}, ${height/2})`}>
      <defs>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#991b1b" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Engine Flames */}
      <path d={`M ${width * 0.3} ${height * 0.8} L ${width * 0.35} ${height * 1.1} L ${width * 0.4} ${height * 0.8} Z`} fill="#fbbf24" opacity="0.8" className="animate-pulse" />
      <path d={`M ${width * 0.6} ${height * 0.8} L ${width * 0.65} ${height * 1.1} L ${width * 0.7} ${height * 0.8} Z`} fill="#fbbf24" opacity="0.8" className="animate-pulse" />

      {/* Rear Wings / Stabilizers */}
      <path d={`M ${width * 0.1} ${height * 0.8} L ${width * 0.3} ${height * 0.6} L ${width * 0.3} ${height * 0.9} Z`} fill={COLORS.metalGrey} stroke="#111" strokeWidth="1" />
      <path d={`M ${width * 0.9} ${height * 0.8} L ${width * 0.7} ${height * 0.6} L ${width * 0.7} ${height * 0.9} Z`} fill={COLORS.metalGrey} stroke="#111" strokeWidth="1" />

      {/* Main Wings (Delta) */}
      <path 
        d={`M ${width * 0.5} ${height * 0.2} 
           L ${width * 0.95} ${height * 0.7} 
           L ${width * 0.8} ${height * 0.8} 
           L ${width * 0.5} ${height * 0.7} 
           L ${width * 0.2} ${height * 0.8} 
           L ${width * 0.05} ${height * 0.7} Z`} 
        fill="url(#bodyGrad)" 
        stroke="#450a0a" 
        strokeWidth="1"
      />

      {/* Fuselage Body */}
      <path 
        d={`M ${width * 0.5} 0 
           L ${width * 0.65} ${height * 0.3} 
           L ${width * 0.65} ${height * 0.85} 
           L ${width * 0.5} ${height} 
           L ${width * 0.35} ${height * 0.85} 
           L ${width * 0.35} ${height * 0.3} Z`} 
        fill="url(#bodyGrad)" 
        stroke="#450a0a" 
        strokeWidth="1"
      />

      {/* Cockpit */}
      <ellipse cx={width * 0.5} cy={height * 0.45} rx={width * 0.1} ry={height * 0.15} fill={COLORS.glassCyan} filter="url(#glow)" />
      
      {/* Details / Vents */}
      <rect x={width * 0.38} y={height * 0.6} width={width * 0.05} height={height * 0.1} fill="#111" />
      <rect x={width * 0.57} y={height * 0.6} width={width * 0.05} height={height * 0.1} fill="#111" />
      
      {/* Cannons */}
      <rect x={width * 0.25} y={height * 0.5} width={width * 0.05} height={height * 0.2} fill={COLORS.metalGrey} />
      <rect x={width * 0.70} y={height * 0.5} width={width * 0.05} height={height * 0.2} fill={COLORS.metalGrey} />
    </g>
  );
};