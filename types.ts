
export enum EntityType {
  PLAYER = 'PLAYER',
  ENEMY_SCOUT = 'ENEMY_SCOUT',
  ENEMY_HEAVY = 'ENEMY_HEAVY',
  ENEMY_TANK = 'ENEMY_TANK',
  BULLET_PLAYER = 'BULLET_PLAYER',
  BULLET_ENEMY = 'BULLET_ENEMY',
  EXPLOSION = 'EXPLOSION',
  POWERUP = 'POWERUP'
}

export interface Point {
  x: number;
  y: number;
}

export interface GameEntity {
  id: string;
  type: EntityType;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  hp: number;
  rotation?: number;
  frame?: number; // For animation
  maxFrame?: number;
}

export interface GameState {
  isPlaying: boolean;
  gameOver: boolean;
  score: number;
  highScore: number;
  level: number;
  player: GameEntity;
  enemies: GameEntity[];
  bullets: GameEntity[];
  particles: GameEntity[];
}
