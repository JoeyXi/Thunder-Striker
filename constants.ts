
export const GAME_WIDTH = 600;
export const GAME_HEIGHT = 800;

export const PLAYER_SPEED = 0; // Handled by mouse/touch
export const PLAYER_SIZE = 64; 
export const PLAYER_HITBOX = 12; // Smaller hitbox for "bullet dodging"

export const BULLET_SPEED_PLAYER = 20;
export const BULLET_SPEED_ENEMY = 7;
export const FIRE_RATE = 5; 

export const ENEMY_SPAWN_RATE = 45; 

// Authentic Raiden Colors
export const COLORS = {
  raidenRed: '#d00000',      // Deeper Arcade Red
  raidenWhite: '#e0e0e0',    
  raidenBlue: '#1a56db',     
  raidenGrey: '#52525b',     
  
  // Enemy Colors
  enemyGreen: '#4a5d23',     // Military Olive
  enemyTan: '#857a54',       // Desert Camo
  enemySilver: '#a1a1aa',    
  
  // Projectiles
  bulletRed: '#ff2200',      // Player Vulcan
  bulletPink: '#ff00ff',     // Classic Raiden Enemy Bullet
  bulletOrange: '#ffaa00',   // Laser color
  
  explosionInner: '#ffff00',
  explosionOuter: '#ff4400'
};
