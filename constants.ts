
export const GAME_WIDTH = 600;
export const GAME_HEIGHT = 800;

export const PLAYER_SPEED = 0; // Handled by mouse/touch direct mapping usually, or smoothed
export const PLAYER_SIZE = 64; // Slightly larger to show off detail
export const PLAYER_HITBOX = 16;

export const BULLET_SPEED_PLAYER = 16;
export const BULLET_SPEED_ENEMY = 6;
export const FIRE_RATE = 6; // Faster fire rate for that arcade feel

export const ENEMY_SPAWN_RATE = 50; // Frames between spawns

// SVG Colors mimicking Raiden aesthetic
export const COLORS = {
  raidenRed: '#dc2626',      // Main ship body
  raidenWhite: '#e5e7eb',    // Intakes/Highlights
  raidenBlue: '#2563eb',     // Wing tips/Cockpit tint
  raidenGrey: '#4b5563',     // Mechanical parts
  
  enemyGreen: '#3f6212',     // Classic tank/heavy plane green
  enemySilver: '#9ca3af',    // Standard interceptor silver
  enemyOrange: '#d97706',    // Enemy cockpits/lights
  
  bulletRed: '#ef4444',      // Player vulcan
  bulletPink: '#f472b6',     // Enemy distinct bullets
  explosionInner: '#fef08a',
  explosionOuter: '#b91c1c'
};
