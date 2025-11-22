export const GAME_WIDTH = 600;
export const GAME_HEIGHT = 800;

export const PLAYER_SPEED = 0; // Handled by mouse/touch direct mapping usually, or smoothed
export const PLAYER_SIZE = 48;
export const PLAYER_HITBOX = 12;

export const BULLET_SPEED_PLAYER = 12;
export const BULLET_SPEED_ENEMY = 5;
export const FIRE_RATE = 8; // Frames between shots

export const ENEMY_SPAWN_RATE = 60; // Frames between spawns (decreases as level increases)

// SVG Colors mimicking Raiden aesthetic
export const COLORS = {
  raidenRed: '#d62828',
  raidenBlue: '#0077b6',
  metalGrey: '#4a5568',
  glassCyan: '#38bdf8',
  enemyGreen: '#4d7c0f',
  enemyPurple: '#7c3aed',
  bulletRed: '#ef4444',
  bulletYellow: '#fbbf24'
};