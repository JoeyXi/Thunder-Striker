
import React from 'react';
import { COLORS } from '../../constants';

// Basic Enemy: Interceptor (Fast, Silver/Grey)
export const EnemyScout: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  return (
    <g transform={`rotate(180, ${width/2}, ${height/2})`}> {/* Pointing down */}
      <defs>
        <linearGradient id="scoutMetal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4b5563" />
          <stop offset="50%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#4b5563" />
        </linearGradient>
      </defs>
      
      {/* Wings */}
      <path d={`M ${width * 0.5} ${height * 0.2} L ${width} ${height * 0.7} L ${width * 0.8} ${height * 0.9} L ${width * 0.5} ${height * 0.8} L ${width * 0.2} ${height * 0.9} L 0 ${height * 0.7} Z`} fill="#374151" />
      
      {/* Fuselage */}
      <path 
        d={`M ${width * 0.5} 0 
           L ${width * 0.7} ${height * 0.4} 
           L ${width * 0.7} ${height * 0.9} 
           L ${width * 0.5} ${height} 
           L ${width * 0.3} ${height * 0.9} 
           L ${width * 0.3} ${height * 0.4} Z`} 
        fill="url(#scoutMetal)" 
        stroke="#1f2937" 
        strokeWidth="1"
      />

      {/* Cockpit/Eye */}
      <rect x={width * 0.4} y={height * 0.3} width={width * 0.2} height={height * 0.15} fill={COLORS.enemyOrange} />
      
      {/* Engine Exhausts */}
      <circle cx={width * 0.35} cy={height * 0.9} r={4} fill="#f59e0b" />
      <circle cx={width * 0.65} cy={height * 0.9} r={4} fill="#f59e0b" />
      
      {/* Insignia / Detail */}
      <path d={`M ${width * 0.2} ${height * 0.6} L ${width * 0.8} ${height * 0.6}`} stroke="#374151" strokeWidth="2" />
    </g>
  );
};

// Heavy Enemy: Bomber/Gunship (Slow, Green, Tough)
export const EnemyHeavy: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  return (
    <g transform={`rotate(180, ${width/2}, ${height/2})`}>
      <defs>
        <linearGradient id="heavyGreen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#14532d" />
          <stop offset="30%" stopColor="#3f6212" />
          <stop offset="70%" stopColor="#3f6212" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.5"/>
        </filter>
      </defs>
      
      {/* Massive Delta Wing Structure */}
      <path 
        d={`M ${width * 0.5} ${height * 0.1} 
           L ${width} ${height * 0.5} 
           L ${width * 0.9} ${height * 0.9} 
           L ${width * 0.1} ${height * 0.9} 
           L 0 ${height * 0.5} Z`} 
        fill="#1f2937" 
        stroke="#000"
      />
      
      {/* Main Hull Armor */}
      <rect x={width * 0.25} y={height * 0.1} width={width * 0.5} height={height * 0.8} rx={4} fill="url(#heavyGreen)" stroke="#1a2e05" strokeWidth="2" />
      
      {/* Cockpit / Bridge */}
      <path d={`M ${width * 0.35} ${height * 0.3} L ${width * 0.65} ${height * 0.3} L ${width * 0.5} ${height * 0.15} Z`} fill={COLORS.enemyOrange} />
      
      {/* Propellers / Hover Engines on wings */}
      <circle cx={width * 0.15} cy={height * 0.6} r={width * 0.12} fill="#52525b" stroke="#000" />
      <circle cx={width * 0.85} cy={height * 0.6} r={width * 0.12} fill="#52525b" stroke="#000" />
      {/* Propeller Blades (Static simulation) */}
      <path d={`M ${width * 0.15} ${height * 0.6} L ${width * 0.15} ${height * 0.45}`} stroke="#ccc" strokeWidth="3" />
      <path d={`M ${width * 0.15} ${height * 0.6} L ${width * 0.25} ${height * 0.7}`} stroke="#ccc" strokeWidth="3" />
      <path d={`M ${width * 0.15} ${height * 0.6} L ${width * 0.05} ${height * 0.7}`} stroke="#ccc" strokeWidth="3" />
      
      <path d={`M ${width * 0.85} ${height * 0.6} L ${width * 0.85} ${height * 0.45}`} stroke="#ccc" strokeWidth="3" />
      <path d={`M ${width * 0.85} ${height * 0.6} L ${width * 0.95} ${height * 0.7}`} stroke="#ccc" strokeWidth="3" />
      <path d={`M ${width * 0.85} ${height * 0.6} L ${width * 0.75} ${height * 0.7}`} stroke="#ccc" strokeWidth="3" />

      {/* Turrets */}
      <circle cx={width * 0.5} cy={height * 0.6} r={width * 0.1} fill="#4b5563" stroke="#000" />
      <rect x={width * 0.48} y={height * 0.6} width={width * 0.04} height={height * 0.2} fill="#000" />
    </g>
  );
};

export const Bullet: React.FC<{ width: number; height: number; isEnemy: boolean }> = ({ width, height, isEnemy }) => {
  return (
    <g>
       {isEnemy ? (
         // Raiden-style enemy bullet: Pink/Orange orb with white center
         <g>
            <circle cx={width/2} cy={height/2} r={width/2} fill="#be185d" opacity="0.6" />
            <circle cx={width/2} cy={height/2} r={width/3} fill={COLORS.bulletPink} />
            <circle cx={width/2} cy={height/2} r={width/6} fill="white" />
         </g>
       ) : (
         // Player Vulcan: Red elongated streak
         <rect x={0} y={0} width={width} height={height} rx={2} fill={COLORS.bulletRed} stroke="#fecaca" strokeWidth="1" />
       )}
    </g>
  );
};

export const Explosion: React.FC<{ width: number; height: number; progress: number }> = ({ width, height, progress }) => {
    // Classic Arcade Explosion: Expands rapidly, changes from yellow to red to smoke
    const scale = 0.5 + (progress * 2);
    const opacity = 1 - Math.pow(progress, 3); // Fade out faster at end
    
    return (
        <g transform={`translate(${width/2}, ${height/2}) scale(${scale}) translate(-${width/2}, -${height/2})`} opacity={opacity}>
            {/* Outer flash */}
            <circle cx={width/2} cy={height/2} r={width/2} fill={COLORS.explosionOuter} />
            {/* Inner core */}
            <circle cx={width/2} cy={height/2} r={width/2.5} fill="#f59e0b" />
            {/* White hot center */}
            <circle cx={width/2} cy={height/2} r={width/4} fill={COLORS.explosionInner} />
            
            {/* Debris particles */}
            <rect x={width*0.2} y={height*0.2} width={4} height={4} fill="#555" transform={`rotate(${progress * 360})`} />
            <rect x={width*0.8} y={height*0.8} width={4} height={4} fill="#555" transform={`rotate(-${progress * 360})`} />
        </g>
    )
}
