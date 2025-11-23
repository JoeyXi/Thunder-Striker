
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  GAME_WIDTH, 
  GAME_HEIGHT, 
  PLAYER_SIZE, 
  BULLET_SPEED_PLAYER, 
  BULLET_SPEED_ENEMY,
  FIRE_RATE,
  ENEMY_SPAWN_RATE 
} from '../constants';
import { EntityType, GameEntity, GameState } from '../types';
import { generateId, checkCollision } from '../utils/gameUtils';
import { PlayerShip } from './assets/PlayerShip';
import { EnemyScout, EnemyHeavy, EnemyTank, Bullet, Explosion } from './assets/EnemyShips';
import { Play, RotateCcw } from 'lucide-react';

export const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    gameOver: false,
    score: 0,
    highScore: 0,
    level: 1,
    player: {
      id: 'player',
      type: EntityType.PLAYER,
      x: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
      y: GAME_HEIGHT - 150,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      vx: 0,
      vy: 0,
      hp: 3
    },
    enemies: [],
    bullets: [],
    particles: []
  });

  const stateRef = useRef<GameState>(gameState);
  const frameRef = useRef<number>(0);
  const lastShotTime = useRef<number>(0);
  const gameLoopRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const inputPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState.isPlaying, gameState.gameOver]);

  const spawnEnemy = (currentLevel: number) => {
    const rand = Math.random();
    let type = EntityType.ENEMY_SCOUT;
    let width = 48;
    let height = 48;
    let hp = 1;
    let speed = 3;
    let isGround = false;

    if (rand > 0.9) {
        type = EntityType.ENEMY_HEAVY;
        width = 100;
        height = 80;
        hp = 15;
        speed = 1;
    } else if (rand > 0.6) {
        type = EntityType.ENEMY_TANK;
        width = 50;
        height = 60;
        hp = 5;
        speed = 2; // Moves same speed as background roughly
        isGround = true;
    } else {
        type = EntityType.ENEMY_SCOUT;
        width = 40;
        height = 40;
        hp = 2;
        speed = 3.5;
    }

    const x = Math.random() * (GAME_WIDTH - width);
    
    stateRef.current.enemies.push({
      id: generateId(),
      type,
      x,
      y: -height,
      width,
      height,
      vx: (type === EntityType.ENEMY_SCOUT) ? Math.sin(Date.now()) * 1.5 : 0, 
      vy: speed,
      hp
    });
  };

  const createExplosion = (x: number, y: number, size: number = 60) => {
    stateRef.current.particles.push({
      id: generateId(),
      type: EntityType.EXPLOSION,
      x,
      y,
      width: size,
      height: size,
      vx: 0,
      vy: 0,
      hp: 0,
      frame: 0,
      maxFrame: 20
    });
  };

  const spawnBullet = (source: GameEntity, isPlayer: boolean) => {
    const width = isPlayer ? 8 : 14;
    const height = isPlayer ? 24 : 14;
    
    // Player Spread Shot (Raiden Style)
    if (isPlayer) {
        // Level 1: 2 bullets straight
        // Level 2: 3 spread
        // Level 3+: 5 spread wide
        const level = stateRef.current.level;
        const angles = level === 1 ? [-0.1, 0.1] : (level === 2 ? [-0.2, 0, 0.2] : [-0.4, -0.15, 0, 0.15, 0.4]);
        
        angles.forEach(angle => {
            stateRef.current.bullets.push({
                id: generateId(),
                type: EntityType.BULLET_PLAYER,
                x: source.x + source.width / 2 - width / 2,
                y: source.y - 10,
                width,
                height,
                vx: angle * 10,
                vy: -BULLET_SPEED_PLAYER,
                hp: 1
            });
        });
    } else {
        // Enemy Bullet
        // Aim at player
        const dx = stateRef.current.player.x - source.x;
        const dy = stateRef.current.player.y - source.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        stateRef.current.bullets.push({
            id: generateId(),
            type: EntityType.BULLET_ENEMY,
            x: source.x + source.width / 2 - width / 2,
            y: source.y + source.height / 2,
            width,
            height,
            vx: (dx / dist) * BULLET_SPEED_ENEMY,
            vy: (dy / dist) * BULLET_SPEED_ENEMY,
            hp: 1
        });
    }
  };

  const update = useCallback(() => {
    if (!stateRef.current.isPlaying || stateRef.current.gameOver) return;

    frameRef.current++;
    const state = stateRef.current;

    // 1. Player Movement
    if (inputPos.current) {
        const targetX = inputPos.current.x - state.player.width / 2;
        const targetY = inputPos.current.y - state.player.height / 2;
        
        state.player.x += (targetX - state.player.x) * 0.2;
        state.player.y += (targetY - state.player.y) * 0.2;

        state.player.x = Math.max(0, Math.min(GAME_WIDTH - state.player.width, state.player.x));
        state.player.y = Math.max(0, Math.min(GAME_HEIGHT - state.player.height, state.player.y));

        state.player.vx = (targetX - state.player.x) * 0.1; // For banking
    }

    // 2. Player Shooting
    if (frameRef.current - lastShotTime.current > FIRE_RATE) {
        spawnBullet(state.player, true);
        lastShotTime.current = frameRef.current;
    }

    // 3. Enemy Spawning
    if (frameRef.current % ENEMY_SPAWN_RATE === 0) {
        spawnEnemy(state.level);
    }

    // 4. Update Entities
    state.enemies.forEach(enemy => {
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;

        // Enemy Shooting logic
        let shootChance = 0.01;
        if (enemy.type === EntityType.ENEMY_HEAVY) shootChance = 0.05;
        if (enemy.type === EntityType.ENEMY_TANK) shootChance = 0.02;

        if (Math.random() < shootChance && enemy.y > 0 && enemy.y < GAME_HEIGHT - 100) {
            spawnBullet(enemy, false);
        }
    });

    state.bullets.forEach(bullet => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
    });

    state.particles.forEach(p => {
        if (p.frame !== undefined) p.frame++;
    });

    // 5. Cleanup
    state.enemies = state.enemies.filter(e => e.y < GAME_HEIGHT + 100 && e.hp > 0);
    state.bullets = state.bullets.filter(b => b.y > -50 && b.y < GAME_HEIGHT + 50 && b.hp > 0);
    state.particles = state.particles.filter(p => p.frame !== undefined && p.maxFrame !== undefined && p.frame < p.maxFrame);

    // 6. Collision
    state.bullets.filter(b => b.type === EntityType.BULLET_PLAYER).forEach(bullet => {
        state.enemies.forEach(enemy => {
            if (bullet.hp > 0 && enemy.hp > 0 && checkCollision(bullet, enemy)) {
                bullet.hp = 0;
                enemy.hp--;
                createExplosion(bullet.x, bullet.y, 20); // Small impact
                if (enemy.hp <= 0) {
                    createExplosion(enemy.x, enemy.y, enemy.width);
                    state.score += (enemy.type === EntityType.ENEMY_HEAVY ? 1000 : 100);
                    
                    // Level Up logic
                    if (state.score > state.level * 2000) {
                        state.level = Math.min(3, state.level + 1);
                    }
                }
            }
        });
    });

    state.bullets.filter(b => b.type === EntityType.BULLET_ENEMY).forEach(bullet => {
        if (bullet.hp > 0 && checkCollision(bullet, state.player, 15)) {
            bullet.hp = 0;
            handlePlayerHit();
        }
    });

    state.enemies.forEach(enemy => {
        // Don't collide with tanks if you are flying over them? 
        // For arcade simplicity, crashing into a tank on the ground is usually not possible in some games, but in Raiden you often fly "above" them.
        // Let's say Heavy and Scout are air collisions. Tank is safe to fly over.
        if (enemy.type !== EntityType.ENEMY_TANK && enemy.hp > 0 && checkCollision(enemy, state.player, 15)) {
            enemy.hp = 0;
            createExplosion(enemy.x, enemy.y, enemy.width);
            handlePlayerHit();
        }
    });

    setGameState({ ...state });
    gameLoopRef.current = requestAnimationFrame(update);
  }, []);

  const handlePlayerHit = () => {
      stateRef.current.player.hp--; 
      createExplosion(stateRef.current.player.x, stateRef.current.player.y, 80);
      
      if (stateRef.current.player.hp <= 0) {
          stateRef.current.gameOver = true;
          stateRef.current.isPlaying = false;
          if (stateRef.current.score > stateRef.current.highScore) {
            stateRef.current.highScore = stateRef.current.score;
          }
      }
  };

  const handlePointerMove = (e: React.PointerEvent | React.TouchEvent) => {
      if (!svgRef.current) return;
      const point = svgRef.current.createSVGPoint();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.PointerEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.PointerEvent).clientY;
      point.x = clientX;
      point.y = clientY;
      const cursor = point.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
      inputPos.current = { x: cursor.x, y: cursor.y - 50 };
  };

  const startGame = () => {
      setGameState(prev => ({
          ...prev,
          isPlaying: true,
          gameOver: false,
          score: 0,
          enemies: [],
          bullets: [],
          particles: [],
          level: 1,
          player: { ...prev.player, x: GAME_WIDTH/2 - PLAYER_SIZE/2, y: GAME_HEIGHT - 150, hp: 1 }
      }));
      stateRef.current.score = 0;
      stateRef.current.level = 1;
      stateRef.current.gameOver = false;
      stateRef.current.isPlaying = true;
      stateRef.current.enemies = [];
      stateRef.current.bullets = [];
      gameLoopRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
      return () => {
          if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      };
  }, []);

  return (
    <div className="relative w-full h-full max-w-[600px] max-h-[800px] bg-black border-x border-gray-800 overflow-hidden shadow-2xl select-none">
        <div className="background-layer"></div>
        <div className="shadow-layer absolute inset-0 pointer-events-none"></div>

        <svg 
            ref={svgRef}
            viewBox={`0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`}
            className="w-full h-full cursor-none touch-none absolute inset-0"
            onPointerMove={handlePointerMove}
            onTouchMove={handlePointerMove}
            preserveAspectRatio="xMidYMid slice"
        >
            {/* GROUND LAYER: TANKS */}
            {gameState.enemies.filter(e => e.type === EntityType.ENEMY_TANK).map(e => (
                <g key={e.id} transform={`translate(${e.x}, ${e.y})`}>
                     <EnemyTank width={e.width} height={e.height} />
                </g>
            ))}

            {/* AIR SHADOWS */}
            {gameState.enemies.filter(e => e.type !== EntityType.ENEMY_TANK).map(e => (
                <ellipse key={`shadow-${e.id}`} cx={e.x + e.width/2 + 10} cy={e.y + e.height/2 + 20} rx={e.width/3} ry={e.height/3} fill="black" opacity="0.3" />
            ))}
             {!gameState.gameOver && (
                <ellipse cx={gameState.player.x + gameState.player.width/2 + 10} cy={gameState.player.y + gameState.player.height/2 + 20} rx={20} ry={20} fill="black" opacity="0.3" />
             )}


            {/* AIR LAYER: BULLETS (Below planes usually, but sprites overlap differently. Lets put bullets low.) */}
            {gameState.bullets.map(b => (
                <g key={b.id} transform={`translate(${b.x}, ${b.y})`}>
                    <Bullet width={b.width} height={b.height} isEnemy={b.type === EntityType.BULLET_ENEMY} />
                </g>
            ))}

            {/* AIR LAYER: PLANES */}
            {gameState.enemies.filter(e => e.type !== EntityType.ENEMY_TANK).map(e => (
                <g key={e.id} transform={`translate(${e.x}, ${e.y})`}>
                    {e.type === EntityType.ENEMY_HEAVY ? (
                        <EnemyHeavy width={e.width} height={e.height} />
                    ) : (
                        <EnemyScout width={e.width} height={e.height} />
                    )}
                </g>
            ))}

            {/* PLAYER */}
            {!gameState.gameOver && (
                <g transform={`translate(${gameState.player.x}, ${gameState.player.y})`}>
                    <PlayerShip width={gameState.player.width} height={gameState.player.height} banking={gameState.player.vx} />
                </g>
            )}

            {/* FX LAYER */}
            {gameState.particles.map(p => (
                <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
                    <Explosion width={p.width} height={p.height} progress={(p.frame || 0) / (p.maxFrame || 1)} />
                </g>
            ))}
        </svg>

        {/* HUD */}
        <div className="absolute top-4 left-4 text-white font-mono text-xl font-bold drop-shadow-md pointer-events-none flex gap-4">
            <span>SCORE: {gameState.score.toString().padStart(6, '0')}</span>
            <span className="text-yellow-400">LEVEL {gameState.level}</span>
        </div>

        {/* Start/End Screen */}
        {(!gameState.isPlaying || gameState.gameOver) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50">
                <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-yellow-500 italic mb-4 transform -skew-x-12 drop-shadow-lg">
                    THUNDER<br/>STRIKER
                </h1>
                <div className="mb-8 flex gap-4 text-sm font-mono text-gray-400">
                    <span>MISSION: 01</span>
                    <span>TARGET: DESTROY ALL</span>
                </div>
                
                {gameState.gameOver && (
                    <div className="text-center mb-8 animate-bounce">
                        <p className="text-red-500 text-3xl font-bold mb-2">MISSION FAILED</p>
                        <p className="text-gray-300">SCORE: {gameState.score}</p>
                    </div>
                )}

                <button 
                    onClick={startGame}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold text-xl rounded transform transition hover:scale-105 active:scale-95 flex items-center gap-3 border-2 border-blue-400"
                >
                    {gameState.gameOver ? <RotateCcw size={24}/> : <Play size={24}/>}
                    {gameState.gameOver ? "RETRY MISSION" : "INSERT COIN"}
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
            </div>
        )}
    </div>
  );
};
