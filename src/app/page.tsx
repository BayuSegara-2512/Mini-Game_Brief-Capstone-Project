'use client';

import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

export default function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Generate random food position
  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE));
    const y = Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE));
    return { x, y };
  }, []);

  // Start game
  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
  };

  // Reset game
  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 0, y: 0 });
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
  };

  // Handle keyboard input
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!gameStarted || gameOver) return;

    switch (e.key) {
      case 'ArrowUp':
        if (direction.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x !== -1) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [direction.x, direction.y, gameStarted, gameOver]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };
        
        // Move head
        head.x += direction.x;
        head.y += direction.y;

        // Check wall collision
        if (head.x < 0 || head.x >= CANVAS_WIDTH / GRID_SIZE || 
            head.y < 0 || head.y >= CANVAS_HEIGHT / GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(prev => prev + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(gameLoop);
  }, [direction, food, gameStarted, gameOver, generateFood]);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6 text-green-400">🐍 Snake Game</h1>
      
      <div className="mb-4">
        <span className="text-xl font-semibold">Score: {score}</span>
      </div>

      <div className="relative mb-6">
        <div 
          className="border-2 border-green-400 bg-gray-800"
          style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
        >
          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className={`absolute ${index === 0 ? 'bg-green-300' : 'bg-green-500'}`}
              style={{
                left: segment.x * GRID_SIZE,
                top: segment.y * GRID_SIZE,
                width: GRID_SIZE - 1,
                height: GRID_SIZE - 1,
              }}
            />
          ))}

          {/* Food */}
          <div
            className="absolute bg-red-500 rounded-full"
            style={{
              left: food.x * GRID_SIZE + 1,
              top: food.y * GRID_SIZE + 1,
              width: GRID_SIZE - 2,
              height: GRID_SIZE - 2,
            }}
          />
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-500 mb-4">Game Over!</h2>
              <p className="text-xl mb-4">Final Score: {score}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {!gameStarted ? (
          <button
            onClick={startGame}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
          >
            Start Game
          </button>
        ) : (
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
          >
            Reset Game
          </button>
        )}
      </div>

      <div className="mt-6 text-center text-gray-400">
        <p className="mb-2">Gunakan tombol panah untuk mengontrol ular</p>
        <div className="flex justify-center gap-2">
          <span className="px-2 py-1 bg-gray-700 rounded">↑</span>
          <span className="px-2 py-1 bg-gray-700 rounded">↓</span>
          <span className="px-2 py-1 bg-gray-700 rounded">←</span>
          <span className="px-2 py-1 bg-gray-700 rounded">→</span>
        </div>
      </div>
    </div>
  );
}