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
import { EnemyScout, EnemyHeavy, Bullet, Explosion } from './assets/EnemyShips';
import { Play, RotateCcw, Trophy } from 'lucide-react';

export const Game: React.FC = () => {
  // --- State & Refs ---
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

  // Use refs for the game loop to avoid closure staleness and frequent re-renders of non-visual logic
  const stateRef = useRef<GameState>(gameState);
  const frameRef = useRef<number>(0);
  const lastShotTime = useRef<number>(0);
  const gameLoopRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Input tracking
  const inputPos = useRef<{ x: number; y: number } | null>(null);

  // Sync state ref with react state for initial load/reset
  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState.isPlaying, gameState.gameOver]);

  // --- Game Logic Helpers ---

  const spawnEnemy = (currentLevel: number) => {
    const type = Math.random() > 0.8 ? EntityType.ENEMY_HEAVY : EntityType.ENEMY_SCOUT;
    const width = type === EntityType.ENEMY_HEAVY ? 60 : 40;
    const height = type === EntityType.ENEMY_HEAVY ? 60 : 40;
    const hp = type === EntityType.ENEMY_HEAVY ? 5 : 1;
    const speed = type === EntityType.ENEMY_HEAVY ? 1.5 : 3;

    // Spawn somewhat randomly but keep within bounds
    const x = Math.random() * (GAME_WIDTH - width);
    
    stateRef.current.enemies.push({
      id: generateId(),
      type,
      x,
      y: -height,
      width,
      height,
      vx: Math.sin(Date.now() / 1000) * (type === EntityType.ENEMY_SCOUT ? 1 : 0), // Slight sway for scouts
      vy: speed + (currentLevel * 0.2),
      hp
    });
  };

  const createExplosion = (x: number, y: number) => {
    stateRef.current.particles.push({
      id: generateId(),
      type: EntityType.EXPLOSION,
      x,
      y,
      width: 60,
      height: 60,
      vx: 0,
      vy: 0,
      hp: 0,
      frame: 0,
      maxFrame: 20
    });
  };

  const spawnBullet = (source: GameEntity, isPlayer: boolean) => {
    const width = isPlayer ? 8 : 12;
    const height = isPlayer ? 20 : 12;
    
    // Spread shot for player if powerup (simulated by level > 3)
    const spread = stateRef.current.level >= 3 && isPlayer ? [-0.5, 0, 0.5] : [0];

    spread.forEach(vxOffset => {
        stateRef.current.bullets.push({
            id: generateId(),
            type: isPlayer ? EntityType.BULLET_PLAYER : EntityType.BULLET_ENEMY,
            x: source.x + source.width / 2 - width / 2,
            y: isPlayer ? source.y - height : source.y + source.height,
            width,
            height,
            vx: vxOffset * 2,
            vy: isPlayer ? -BULLET_SPEED_PLAYER : BULLET_SPEED_ENEMY,
            hp: 1
          });
    });
  };

  // --- Main Game Loop ---
  const update = useCallback(() => {
    if (!stateRef.current.isPlaying || stateRef.current.gameOver) return;

    frameRef.current++;
    const state = stateRef.current;

    // 1. Player Movement (Follow Mouse/Touch)
    if (inputPos.current) {
        const targetX = inputPos.current.x - state.player.width / 2;
        const targetY = inputPos.current.y - state.player.height / 2; // Optional Y movement
        
        // Smooth lerp
        state.player.x += (targetX - state.player.x) * 0.15;
        state.player.y += (targetY - state.player.y) * 0.15; // Enable vertical movement

        // Clamp to screen
        state.player.x = Math.max(0, Math.min(GAME_WIDTH - state.player.width, state.player.x));
        state.player.y = Math.max(0, Math.min(GAME_HEIGHT - state.player.height, state.player.y));

        // Calculate banking (visual only)
        state.player.vx = (targetX - state.player.x) * 0.1;
    }

    // 2. Player Shooting (Auto-fire)
    if (frameRef.current - lastShotTime.current > FIRE_RATE) {
        spawnBullet(state.player, true);
        lastShotTime.current = frameRef.current;
    }

    // 3. Enemy Spawning
    if (frameRef.current % Math.max(20, ENEMY_SPAWN_RATE - state.level * 2) === 0) {
        spawnEnemy(state.level);
    }

    // 4. Update Entities
    
    // Enemies
    state.enemies.forEach(enemy => {
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;

        // Enemy Shooting
        if (enemy.type === EntityType.ENEMY_HEAVY && Math.random() < 0.02) {
            spawnBullet(enemy, false);
        }
    });

    // Bullets
    state.bullets.forEach(bullet => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
    });

    // Particles
    state.particles.forEach(p => {
        if (p.frame !== undefined) p.frame++;
    });

    // 5. Cleanup (Out of bounds & Dead)
    state.enemies = state.enemies.filter(e => e.y < GAME_HEIGHT && e.hp > 0);
    state.bullets = state.bullets.filter(b => b.y > -50 && b.y < GAME_HEIGHT + 50 && b.hp > 0);
    state.particles = state.particles.filter(p => p.frame !== undefined && p.maxFrame !== undefined && p.frame < p.maxFrame);

    // 6. Collision Detection
    
    // Player Bullets vs Enemies
    state.bullets.filter(b => b.type === EntityType.BULLET_PLAYER).forEach(bullet => {
        state.enemies.forEach(enemy => {
            if (bullet.hp > 0 && enemy.hp > 0 && checkCollision(bullet, enemy)) {
                bullet.hp = 0;
                enemy.hp--;
                if (enemy.hp <= 0) {
                    createExplosion(enemy.x, enemy.y);
                    state.score += (enemy.type === EntityType.ENEMY_HEAVY ? 500 : 100);
                } else {
                    // Hit effect?
                }
            }
        });
    });

    // Enemy Bullets vs Player
    state.bullets.filter(b => b.type === EntityType.BULLET_ENEMY).forEach(bullet => {
        if (bullet.hp > 0 && checkCollision(bullet, state.player, 10)) { // 10px forgiveness buffer
            bullet.hp = 0;
            handlePlayerHit();
        }
    });

    // Enemy vs Player (Crash)
    state.enemies.forEach(enemy => {
        if (enemy.hp > 0 && checkCollision(enemy, state.player, 10)) {
            enemy.hp = 0;
            createExplosion(enemy.x, enemy.y);
            handlePlayerHit();
        }
    });

    // Trigger Render
    setGameState({ ...state });
    gameLoopRef.current = requestAnimationFrame(update);
  }, []);

  const handlePlayerHit = () => {
      stateRef.current.player.hp--; // In this simplified version, 1 hit kill or HP system
      createExplosion(stateRef.current.player.x, stateRef.current.player.y);
      
      if (stateRef.current.player.hp <= 0) {
          stateRef.current.gameOver = true;
          stateRef.current.isPlaying = false;
          if (stateRef.current.score > stateRef.current.highScore) {
            stateRef.current.highScore = stateRef.current.score;
          }
      }
  };

  // --- Inputs ---
  const handlePointerMove = (e: React.PointerEvent | React.TouchEvent) => {
      if (!svgRef.current) return;
      
      // Normalize coordinates to SVG space
      const point = svgRef.current.createSVGPoint();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.PointerEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.PointerEvent).clientY;
      
      point.x = clientX;
      point.y = clientY;
      
      const cursor = point.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
      inputPos.current = { x: cursor.x, y: cursor.y - 50 }; // Offset slightly so finger doesn't cover ship
  };

  // --- Lifecycle ---
  const startGame = () => {
      setGameState(prev => ({
          ...prev,
          isPlaying: true,
          gameOver: false,
          score: 0,
          enemies: [],
          bullets: [],
          particles: [],
          player: { ...prev.player, x: GAME_WIDTH/2 - PLAYER_SIZE/2, y: GAME_HEIGHT - 150, hp: 1 }
      }));
      stateRef.current.score = 0;
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

  // --- Rendering ---
  return (
    <div className="relative w-full h-full max-w-[600px] max-h-[800px] bg-black border-x border-gray-800 overflow-hidden shadow-2xl select-none">
        {/* Dynamic Starfield Background */}
        <div className="absolute inset-0 starfield opacity-50 pointer-events-none"></div>

        {/* Game SVG Layer */}
        <svg 
            ref={svgRef}
            viewBox={`0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`}
            className="w-full h-full cursor-none touch-none"
            onPointerMove={handlePointerMove}
            onTouchMove={handlePointerMove}
            preserveAspectRatio="xMidYMid slice"
        >
            {/* Bullets */}
            {gameState.bullets.map(b => (
                <g key={b.id} transform={`translate(${b.x}, ${b.y})`}>
                    <Bullet width={b.width} height={b.height} isEnemy={b.type === EntityType.BULLET_ENEMY} />
                </g>
            ))}

            {/* Enemies */}
            {gameState.enemies.map(e => (
                <g key={e.id} transform={`translate(${e.x}, ${e.y})`}>
                    {e.type === EntityType.ENEMY_HEAVY ? (
                        <EnemyHeavy width={e.width} height={e.height} />
                    ) : (
                        <EnemyScout width={e.width} height={e.height} />
                    )}
                </g>
            ))}

            {/* Player */}
            {!gameState.gameOver && (
                <g transform={`translate(${gameState.player.x}, ${gameState.player.y})`}>
                    <PlayerShip width={gameState.player.width} height={gameState.player.height} banking={gameState.player.vx} />
                </g>
            )}

            {/* Explosions */}
            {gameState.particles.map(p => (
                <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
                    <Explosion width={p.width} height={p.height} progress={(p.frame || 0) / (p.maxFrame || 1)} />
                </g>
            ))}
        </svg>

        {/* HUD */}
        <div className="absolute top-4 left-4 text-white font-mono text-xl font-bold drop-shadow-md pointer-events-none">
            SCORE: {gameState.score.toString().padStart(6, '0')}
        </div>
        <div className="absolute top-4 right-4 text-yellow-400 font-mono text-sm font-bold drop-shadow-md pointer-events-none">
            HI: {gameState.highScore.toString().padStart(6, '0')}
        </div>

        {/* Start Screen / Game Over Overlay */}
        {(!gameState.isPlaying || gameState.gameOver) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50">
                <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-yellow-500 italic mb-4 transform -skew-x-12">
                    THUNDER<br/>STRIKER
                </h1>
                
                {gameState.gameOver && (
                    <div className="text-center mb-8">
                        <p className="text-red-500 text-3xl font-bold animate-pulse mb-2">MISSION FAILED</p>
                        <p className="text-gray-300">FINAL SCORE: {gameState.score}</p>
                    </div>
                )}

                <button 
                    onClick={startGame}
                    className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl rounded transform transition hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                    {gameState.gameOver ? <RotateCcw size={24}/> : <Play size={24}/>}
                    {gameState.gameOver ? "RETRY MISSION" : "START MISSION"}
                    
                    {/* Button Glow Effect */}
                    <div className="absolute inset-0 rounded ring-4 ring-blue-400 ring-opacity-50 animate-pulse group-hover:ring-opacity-75"></div>
                </button>
                
                <div className="mt-8 text-gray-500 text-xs text-center max-w-xs">
                    <p>DRAG TO MOVE • AUTO FIRE ENGAGED</p>
                    <p className="mt-2 opacity-50">CLASSIC ARCADE MODE</p>
                </div>
            </div>
        )}
    </div>
  );
};