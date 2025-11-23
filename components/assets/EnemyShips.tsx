
import React from 'react';
import { COLORS } from '../../constants';

// --- GROUND UNIT: BATTLE TANK ---
export const EnemyTank: React.FC<{ width: number; height: number; rotation?: number }> = ({ width, height, rotation = 0 }) => {
  // Tanks usually point down (180) or track player. We'll just have them face down for now.
  return (
    <g transform={`rotate(180, ${width/2}, ${height/2})`}>
      <defs>
        <linearGradient id="tankCamo" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#655c3f" /> {/* Dark Tan */}
          <stop offset="50%" stopColor="#857a54" /> {/* Light Tan */}
          <stop offset="100%" stopColor="#4d4632" />
        </linearGradient>
        <pattern id="treads" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="2" fill="#111" />
          <rect y="2" width="4" height="2" fill="#333" />
        </pattern>
      </defs>
      
      {/* Left Tread */}
      <rect x={0} y={0} width={width * 0.25} height={height} fill="url(#treads)" />
      {/* Right Tread */}
      <rect x={width * 0.75} y={0} width={width * 0.25} height={height} fill="url(#treads)" />
      
      {/* Main Chassis */}
      <rect x={width * 0.2} y={height * 0.1} width={width * 0.6} height={height * 0.8} fill="url(#tankCamo)" stroke="#3e3722" strokeWidth="2" />
      
      {/* Turret Base */}
      <circle cx={width/2} cy={height/2} r={width * 0.25} fill="#5c533a" stroke="#222" strokeWidth="1" />
      
      {/* Turret Barrel (Rotated independently typically, but fixed here) */}
      <rect x={width * 0.45} y={height * 0.5} width={width * 0.1} height={height * 0.6} fill="#222" />
      <rect x={width * 0.4} y={height * 1.05} width={width * 0.2} height={height * 0.1} fill="#111" /> {/* Muzzle brake */}
      
      {/* Detail */}
      <rect x={width * 0.3} y={height * 0.2} width={width * 0.4} height={height * 0.15} fill="#3e3722" opacity="0.5" />
    </g>
  );
};


// --- AIR UNIT: SCOUT HELICOPTER (Replacing standard jet) ---
// The screenshot showed helicopters. Let's make a sci-fi helicopter/jet hybrid.
export const EnemyScout: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  return (
    <g transform={`rotate(180, ${width/2}, ${height/2})`}>
      <defs>
        <linearGradient id="heliGreen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3f6212" />
          <stop offset="50%" stopColor="#65a30d" />
          <stop offset="100%" stopColor="#3f6212" />
        </linearGradient>
      </defs>
      
      {/* Rotor Blades Blur */}
      <circle cx={width/2} cy={height/2} r={width * 0.8} fill="#000" opacity="0.1" />
      <g className="animate-spin" style={{transformOrigin: 'center', animationDuration: '0.1s'}}>
         <rect x={width * 0.45} y={-10} width={width * 0.1} height={height + 20} fill="#222" opacity="0.5" />
         <rect x={-10} y={height * 0.45} width={width + 20} height={height * 0.1} fill="#222" opacity="0.5" />
      </g>

      {/* Body */}
      <ellipse cx={width/2} cy={height/2} rx={width * 0.25} ry={height * 0.4} fill="url(#heliGreen)" stroke="#1a2e05" strokeWidth="1"/>
      
      {/* Cockpit */}
      <path d={`M ${width*0.35} ${height*0.3} Q ${width*0.5} ${height*0.1} ${width*0.65} ${height*0.3} L ${width*0.65} ${height*0.5} L ${width*0.35} ${height*0.5} Z`} fill="#fbbf24" />
      
      {/* Tail */}
      <rect x={width * 0.45} y={height * 0.8} width={width * 0.1} height={height * 0.3} fill="#3f6212" />
    </g>
  );
};

// --- AIR UNIT: TWIN FUSELAGE HEAVY BOMBER ---
// Modeled after the large plane in the screenshot
export const EnemyHeavy: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  return (
    <g transform={`rotate(180, ${width/2}, ${height/2})`}>
      <defs>
        <linearGradient id="heavyMetal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4b5563" />
          <stop offset="50%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#4b5563" />
        </linearGradient>
      </defs>

      {/* Connecting Wing */}
      <rect x={width * 0.1} y={height * 0.4} width={width * 0.8} height={height * 0.2} fill="url(#heavyMetal)" stroke="#1f2937" strokeWidth="1" />

      {/* Left Fuselage */}
      <ellipse cx={width * 0.25} cy={height * 0.5} rx={width * 0.1} ry={height * 0.4} fill="url(#heavyMetal)" stroke="#1f2937" strokeWidth="1" />
      <circle cx={width * 0.25} cy={height * 0.15} r={width * 0.08} fill="#ef4444" /> {/* Prop spinner */}
      <g transform={`translate(${width * 0.25}, ${height * 0.15})`} opacity="0.5">
         <circle r={width * 0.2} fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2,2" />
      </g>

      {/* Right Fuselage */}
      <ellipse cx={width * 0.75} cy={height * 0.5} rx={width * 0.1} ry={height * 0.4} fill="url(#heavyMetal)" stroke="#1f2937" strokeWidth="1" />
      <circle cx={width * 0.75} cy={height * 0.15} r={width * 0.08} fill="#ef4444" /> {/* Prop spinner */}
      <g transform={`translate(${width * 0.75}, ${height * 0.15})`} opacity="0.5">
         <circle r={width * 0.2} fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2,2" />
      </g>

      {/* Central Cockpit / Turret Hub */}
      <circle cx={width * 0.5} cy={height * 0.4} r={width * 0.12} fill="#374151" stroke="#000" strokeWidth="2" />
      <circle cx={width * 0.5} cy={height * 0.4} r={width * 0.06} fill="#fbbf24" className="animate-pulse" />

      {/* Rear Stabilizers */}
      <path d={`M ${width * 0.15} ${height * 0.8} L ${width * 0.35} ${height * 0.8} L ${width * 0.35} ${height * 0.9} Z`} fill="#374151" />
      <path d={`M ${width * 0.65} ${height * 0.8} L ${width * 0.85} ${height * 0.8} L ${width * 0.65} ${height * 0.9} Z`} fill="#374151" />
    </g>
  );
};

export const Bullet: React.FC<{ width: number; height: number; isEnemy: boolean }> = ({ width, height, isEnemy }) => {
  return (
    <g>
       {isEnemy ? (
         // Raiden-style enemy bullet: Bright Pink Energy Orb
         <g>
            <circle cx={width/2} cy={height/2} r={width/1.5} fill={COLORS.bulletPink} opacity="0.4" />
            <circle cx={width/2} cy={height/2} r={width/2} fill={COLORS.bulletPink} stroke="white" strokeWidth="1" />
            <circle cx={width/2} cy={height/2} r={width/4} fill="white" />
         </g>
       ) : (
         // Player Vulcan: High contrast Red/Yellow
         <g>
             <rect x={0} y={0} width={width} height={height} rx={2} fill="#ffff00" />
             <rect x={2} y={2} width={width-4} height={height-4} rx={1} fill={COLORS.bulletRed} />
         </g>
       )}
    </g>
  );
};

export const Explosion: React.FC<{ width: number; height: number; progress: number }> = ({ width, height, progress }) => {
    const scale = 0.5 + (progress * 2.5);
    const opacity = 1 - Math.pow(progress, 2);
    
    return (
        <g transform={`translate(${width/2}, ${height/2}) scale(${scale}) translate(-${width/2}, -${height/2})`} opacity={opacity}>
            <circle cx={width/2} cy={height/2} r={width/2} fill={COLORS.explosionOuter} />
            <circle cx={width/2} cy={height/2} r={width/2.5} fill="#fbbf24" />
            <circle cx={width/2} cy={height/2} r={width/3} fill={COLORS.explosionInner} />
            <circle cx={width/2} cy={height/2} r={width/6} fill="white" />
        </g>
    )
}
