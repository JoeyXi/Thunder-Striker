import { GameEntity, Point } from '../types';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const checkCollision = (entity1: GameEntity, entity2: GameEntity, buffer: number = 0): boolean => {
  // Simple AABB Collision
  return (
    entity1.x < entity2.x + entity2.width - buffer &&
    entity1.x + entity1.width - buffer > entity2.x &&
    entity1.y < entity2.y + entity2.height - buffer &&
    entity1.y + entity1.height - buffer > entity2.y
  );
};

export const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor;
};