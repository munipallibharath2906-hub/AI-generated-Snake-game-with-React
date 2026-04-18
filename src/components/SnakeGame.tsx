import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, Position, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { RefreshCcw, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    food: { x: 5, y: 5 },
    direction: 'UP',
    score: 0,
    highScore: parseInt(localStorage.getItem('snake-high-score') || '0'),
    isGameOver: false,
    isPaused: false,
  });

  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const directionRef = useRef<Direction>('UP');
  const lastUpdateRef = useRef<number>(0);
  const requestRef = useRef<number>(0);

  const generateFood = useCallback((snake: Position[]): Position => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const initialSnake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    setGameState({
      snake: initialSnake,
      food: generateFood(initialSnake),
      direction: 'UP',
      score: 0,
      highScore: parseInt(localStorage.getItem('snake-high-score') || '0'),
      isGameOver: false,
      isPaused: false,
    });
    setSpeed(INITIAL_SPEED);
    directionRef.current = 'UP';
    lastUpdateRef.current = 0;
  };

  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused) return prev;

      const newSnake = [...prev.snake];
      const head = { ...newSnake[0] };

      switch (directionRef.current) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return { ...prev, isGameOver: true };
      }

      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return { ...prev, isGameOver: true };
      }

      newSnake.unshift(head);

      if (head.x === prev.food.x && head.y === prev.food.y) {
        const newScore = prev.score + 10;
        const newHighScore = Math.max(newScore, prev.highScore);
        if (newHighScore > prev.highScore) {
          localStorage.setItem('snake-high-score', newHighScore.toString());
        }
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));

        return {
          ...prev,
          snake: newSnake,
          food: generateFood(newSnake),
          score: newScore,
          highScore: newHighScore,
        };
      } else {
        newSnake.pop();
        return { ...prev, snake: newSnake };
      }
    });
  }, [generateFood]);

  const animate = useCallback((time: number) => {
    if (lastUpdateRef.current === 0) lastUpdateRef.current = time;
    const delta = time - lastUpdateRef.current;

    if (delta > speed) {
      moveSnake();
      lastUpdateRef.current = time;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d', { alpha: false });
      if (ctx) {
        const size = canvas.width / GRID_SIZE;
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        for (let i = 0; i <= GRID_SIZE; i++) {
          ctx.beginPath();
          ctx.moveTo(i * size, 0); ctx.lineTo(i * size, canvas.height); ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, i * size); ctx.lineTo(canvas.width, i * size); ctx.stroke();
        }

        // Draw food - Magenta
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(gameState.food.x * size + 2, gameState.food.y * size + 2, size - 4, size - 4);

        // Draw snake - Cyan
        gameState.snake.forEach((segment, index) => {
          ctx.fillStyle = index === 0 ? '#00ffff' : '#00aaaa';
          ctx.fillRect(segment.x * size + 1, segment.y * size + 1, size - 2, size - 2);
          
          // Glitch effect on snake head
          if (index === 0 && Math.random() > 0.95) {
             ctx.fillStyle = '#ff00ff';
             ctx.fillRect(segment.x * size - 2, segment.y * size, 4, size);
          }
        });
      }
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [moveSnake, gameState.food, gameState.snake, speed]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': if (gameState.direction !== 'DOWN') directionRef.current = 'UP'; break;
        case 'ArrowDown': case 's': case 'S': if (gameState.direction !== 'UP') directionRef.current = 'DOWN'; break;
        case 'ArrowLeft': case 'a': case 'A': if (gameState.direction !== 'RIGHT') directionRef.current = 'LEFT'; break;
        case 'ArrowRight': case 'd': case 'D': if (gameState.direction !== 'LEFT') directionRef.current = 'RIGHT'; break;
        case ' ': setGameState(prev => ({ ...prev, isPaused: !prev.isPaused })); break;
      }
      setGameState(prev => ({ ...prev, direction: directionRef.current }));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.direction]);

  return (
    <div className="flex flex-col items-center gap-6 p-4 glitch-container font-mono">
      <div className="flex justify-between w-full max-w-[400px] mb-2 px-4 border-l-4 border-[#ff00ff] bg-white/5 py-2">
        <div className="flex flex-col">
          <span className="text-[8px] text-[#00ffff] opacity-70">P_O_I_N_T_S</span>
          <span className="text-xl font-bold text-[#ff00ff] leading-none">{gameState.score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] text-[#ff00ff] opacity-70">R_E_C_O_R_D</span>
          <span className="text-xl font-bold text-[#00ffff] leading-none">{gameState.highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative border-4 border-[#00ffff] shadow-[8px_8px_0_#ff00ff]">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black block"
        />

        <AnimatePresence>
          {gameState.isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-10"
            >
              <h2 className="text-2xl font-bold text-[#ff00ff] mb-2 glitch-text" data-text="C_R_I_T_I_C_A_L_E_R_R_O_R">C_R_I_T_I_C_A_L_E_R_R_O_R</h2>
              <p className="text-[#00ffff] mb-8 text-[10px] tracking-widest">[S_I_G_N_A_L_L_O_S_T]</p>
              <button
                onClick={resetGame}
                className="flex items-center gap-4 px-8 py-4 border-2 border-[#00ffff] hover:bg-[#00ffff] hover:text-black text-[#00ffff] font-bold uppercase tracking-widest transition-all shadow-[4px_4px_0_#ff00ff]"
              >
                <RefreshCcw size={20} /> R_E_B_O_O_T
              </button>
            </motion.div>
          )}

          {gameState.isPaused && !gameState.isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10"
            >
              <div className="w-16 h-16 border-4 border-[#ff00ff] flex items-center justify-center text-[#ff00ff] shadow-[4px_4px_0_#00ffff]">
                <Play size={32} className="ml-1" />
              </div>
              <p className="mt-8 text-[#00ffff] text-[10px] tracking-widest">S_T_A_N_D_B_Y</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-8 items-center mt-4">
        <div className="px-4 py-2 border-2 border-[#ff00ff]/30 text-[9px] text-[#00ffff] tracking-widest bg-black">
           V_E_C_T_O_R: {gameState.direction}
        </div>
        <div className="px-4 py-2 border-2 border-[#00ffff]/30 text-[9px] text-[#ff00ff] tracking-widest bg-black">
           S_P_E_E_D: {(200 - speed).toFixed(0)}
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;

