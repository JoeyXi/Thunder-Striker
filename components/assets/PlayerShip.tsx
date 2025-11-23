
import React from 'react';
import { COLORS } from '../../constants';

export const PlayerShip: React.FC<{ width: number; height: number; banking?: number }> = ({ width, height, banking = 0 }) => {
  const tilt = banking * 25; 

  return (
    <g transform={`rotate(${tilt}, ${width/2}, ${height/2})`}>
      <defs>
        <linearGradient id="mk2Red" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#991b1b" />
          <stop offset="45%" stopColor="#ef4444" />
          <stop offset="55%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="engineGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Afterburners */}
      <path d={`M ${width*0.4} ${height*0.9} L ${width*0.45} ${height*1.3} L ${width*0.5} ${height*0.9} Z`} fill="url(#engineGlow)" className="animate-pulse" />
      <path d={`M ${width*0.6} ${height*0.9} L ${width*0.55} ${height*1.3} L ${width*0.5} ${height*0.9} Z`} fill="url(#engineGlow)" className="animate-pulse" />

      {/* --- WINGS --- */}
      {/* The Raiden MK-II has distinct swept forward then back delta wings */}
      <path 
        d={`M ${width * 0.5} ${height * 0.2} 
           L ${width * 0.95} ${height * 0.7} 
           L ${width * 0.95} ${height * 0.85} 
           L ${width * 0.6} ${height * 0.8} 
           Z`} 
        fill="url(#mk2Red)" stroke="#450a0a" strokeWidth="1" 
      />
      <path 
        d={`M ${width * 0.5} ${height * 0.2} 
           L ${width * 0.05} ${height * 0.7} 
           L ${width * 0.05} ${height * 0.85} 
           L ${width * 0.4} ${height * 0.8} 
           Z`} 
        fill="url(#mk2Red)" stroke="#450a0a" strokeWidth="1" 
      />

      {/* Blue Wing Tips / Stabilizers */}
      <path d={`M ${width * 0.05} ${height * 0.7} L ${width * 0.05} ${height * 0.85} L ${width * 0.15} ${height * 0.8} Z`} fill={COLORS.raidenBlue} />
      <path d={`M ${width * 0.95} ${height * 0.7} L ${width * 0.95} ${height * 0.85} L ${width * 0.85} ${height * 0.8} Z`} fill={COLORS.raidenBlue} />

      {/* --- CANARDS (Small front wings) --- */}
      <path d={`M ${width * 0.45} ${height * 0.35} L ${width * 0.25} ${height * 0.45} L ${width * 0.45} ${height * 0.5} Z`} fill="url(#mk2Red)" stroke="#450a0a" />
      <path d={`M ${width * 0.55} ${height * 0.35} L ${width * 0.75} ${height * 0.45} L ${width * 0.55} ${height * 0.5} Z`} fill="url(#mk2Red)" stroke="#450a0a" />

      {/* --- FUSELAGE --- */}
      <path 
        d={`M ${width * 0.5} 0 
           L ${width * 0.65} ${height * 0.3} 
           L ${width * 0.6} ${height * 0.95} 
           L ${width * 0.4} ${height * 0.95} 
           L ${width * 0.35} ${height * 0.3} Z`} 
        fill="url(#mk2Red)" 
      />

      {/* Cockpit */}
      <path 
        d={`M ${width * 0.5} ${height * 0.25} 
           L ${width * 0.58} ${height * 0.4} 
           L ${width * 0.58} ${height * 0.55} 
           L ${width * 0.42} ${height * 0.55} 
           L ${width * 0.42} ${height * 0.4} Z`} 
        fill="#3b82f6" 
        stroke="#1e3a8a" strokeWidth="1"
      />
      {/* Highlight on glass */}
      <path d={`M ${width * 0.45} ${height * 0.35} L ${width * 0.5} ${height * 0.28}`} stroke="white" strokeWidth="2" opacity="0.7" />

      {/* Engine Vents (White) */}
      <rect x={width * 0.32} y={height * 0.6} width={width * 0.08} height={height * 0.15} fill="#e5e7eb" rx={2} />
      <rect x={width * 0.60} y={height * 0.6} width={width * 0.08} height={height * 0.15} fill="#e5e7eb" rx={2} />
      
      {/* Central Spine Detail */}
      <path d={`M ${width * 0.5} ${height * 0.1} L ${width * 0.5} ${height * 0.9}`} stroke="#7f1d1d" strokeWidth="1" />

    </g>
  );
};
