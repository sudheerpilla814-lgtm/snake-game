import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food spawned on snake
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    generateFood(INITIAL_SNAKE);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment, index) => index !== 0 && segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const loop = (time: number) => {
      if (time - lastUpdateRef.current > INITIAL_SPEED) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    if (isPlaying && !gameOver) {
      gameLoopRef.current = requestAnimationFrame(loop);
    } else {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, moveSnake]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] mb-2 px-1">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-mono font-bold">Current Score</span>
          <span className="text-4xl font-mono font-bold text-cyan-400 tracking-tighter">{score.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-mono font-bold">High Score</span>
          <span className="text-4xl font-mono font-bold text-pink-500 tracking-tighter">{highScore.toLocaleString()}</span>
        </div>
      </div>

      <div 
        className="relative bg-zinc-900 border-2 border-zinc-800 rounded-lg overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.1)]"
        style={{ 
          width: 'min(80vw, 400px)', 
          height: 'min(80vw, 400px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '1px'
        }}
      >
        {/* Grid lines pattern */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none">
          {[...Array(400)].map((_, i) => (
            <div key={i} className="border-[0.5px] border-zinc-800/30" />
          ))}
        </div>

        {/* Render Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${i}-${segment.x}-${segment.y}`}
            className={`
              ${i === 0 ? 'bg-cyan-400 shadow-[0_0_15px_#22d3ee] z-10' : 'bg-cyan-500/60'}
              rounded-[1px] transition-all duration-150
            `}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Render Food */}
        <motion.div
           initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="bg-pink-500 shadow-[0_0_20px_#ec4899] rounded-full z-20 m-1"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Overlay */}
        <AnimatePresence>
          {!isPlaying && !gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30"
            >
              <h2 className="text-4xl font-bold tracking-tighter uppercase italic text-cyan-400 mb-6 glow-cyan">READY?</h2>
              <button 
                onClick={resetGame}
                className="group flex items-center gap-3 px-10 py-3 bg-cyan-500 text-black rounded-sm font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Initialize</span>
              </button>
            </motion.div>
          )}

          {gameOver && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30"
            >
              <Trophy className="w-12 h-12 text-pink-500 mb-2 box-glow-pink" />
              <h2 className="text-3xl font-bold italic tracking-tighter text-pink-500 mb-1 leading-none uppercase">LINK_SEVERED</h2>
              <p className="font-mono text-zinc-500 mb-6 uppercase tracking-[0.3em] text-[10px]">Data Lost • Final Score {score}</p>
              <button 
                onClick={resetGame}
                className="group flex items-center gap-3 px-10 py-3 bg-pink-500 text-black rounded-sm font-bold uppercase tracking-widest hover:bg-white hover:text-pink-600 transition-all duration-300 shadow-[0_0_20px_rgba(236,72,153,0.4)]"
              >
                <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Reconnect</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-[400px] flex justify-center gap-2 font-mono text-[9px] uppercase tracking-widest opacity-40">
        <span className="flex items-center gap-1 bg-zinc-800 px-3 py-1 rounded-sm border border-white/5">WASD To Stream</span>
        <span className="flex items-center gap-1 bg-zinc-800 px-3 py-1 rounded-sm border border-white/5">Collect Packets</span>
      </div>
    </div>
  );
}
