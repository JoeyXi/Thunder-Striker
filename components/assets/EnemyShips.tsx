import React from 'react';
import { COLORS } from '../../constants';

export const EnemyScout: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  return (
    <g>
      <defs>
        <linearGradient id="enemyGreenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#365314" />
          <stop offset="50%" stopColor="#65a30d" />
          <stop offset="100%" stopColor="#365314" />
        </linearGradient>
      </defs>
      {/* Simple triangular jet shape */}
      <path d={`M ${width/2} ${height} L ${width} 0 L ${width/2} ${height * 0.2} L 0 0 Z`} fill="url(#enemyGreenGrad)" stroke="#1a2e05" strokeWidth="1" />
      {/* Engine glow */}
      <circle cx={width/2} cy={height * 0.1} r={width * 0.1} fill="#fbbf24" />
    </g>
  );
};

export const EnemyHeavy: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  return (
    <g>
      <defs>
        <linearGradient id="enemyHeavyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4c1d95" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
      </defs>
      
      {/* Big Wings */}
      <path d={`M 0 ${height*0.3} L ${width} ${height*0.3} L ${width/2} ${height} Z`} fill="#374151" />
      
      {/* Main Body - Heavy Tanker style */}
      <rect x={width * 0.25} y={0} width={width * 0.5} height={height * 0.8} rx={5} fill="url(#enemyHeavyGrad)" stroke="#2e1065" strokeWidth="2" />
      
      {/* Turret */}
      <circle cx={width/2} cy={height * 0.4} r={width * 0.15} fill="#e5e7eb" />
      <rect x={width * 0.45} y={height * 0.4} width={width * 0.1} height={height * 0.4} fill="#111" />
      
      {/* Red lights */}
      <circle cx={width * 0.2} cy={height * 0.3} r={3} fill="red" className="animate-pulse" />
      <circle cx={width * 0.8} cy={height * 0.3} r={3} fill="red" className="animate-pulse" />
    </g>
  );
};

export const Bullet: React.FC<{ width: number; height: number; isEnemy: boolean }> = ({ width, height, isEnemy }) => {
  return (
    <g>
       {isEnemy ? (
         <circle cx={width/2} cy={height/2} r={width/2} fill={COLORS.bulletYellow} stroke="white" strokeWidth="1" />
       ) : (
         <rect x={0} y={0} width={width} height={height} rx={2} fill={COLORS.bulletRed} opacity="0.9" />
       )}
    </g>
  );
};

export const Explosion: React.FC<{ width: number; height: number; progress: number }> = ({ width, height, progress }) => {
    const opacity = 1 - progress;
    const scale = 0.5 + (progress * 1.5);
    
    return (
        <g transform={`translate(${width/2}, ${height/2}) scale(${scale}) translate(-${width/2}, -${height/2})`} opacity={opacity}>
            <circle cx={width/2} cy={height/2} r={width/2} fill="#fef08a" />
            <circle cx={width/2} cy={height/2} r={width/3} fill="#f97316" />
            <circle cx={width/2} cy={height/2} r={width/4} fill="#ef4444" />
        </g>
    )
}