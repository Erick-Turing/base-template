import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GAME_WIDTH = 300;
const GAME_HEIGHT = 500;
const PLAYER_SIZE = 20;
const ENEMY_SIZE = 20;
const ENEMY_SPEED = 2;
const LEVEL_UP_SCORE = 10;

function Player({ position }) {
  return (
    <div 
      style={{
        position: 'absolute',
        left: position.x - PLAYER_SIZE / 2,
        top: position.y - PLAYER_SIZE / 2,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        backgroundColor: 'blue',
        borderRadius: '50%'
      }}
    />
  );
}

function Enemy({ position }) {
  return (
    <div 
      style={{
        position: 'absolute',
        left: position.x - ENEMY_SIZE / 2,
        top: position.y - ENEMY_SIZE / 2,
        width: ENEMY_SIZE,
        height: ENEMY_SIZE,
        backgroundColor: 'red',
        borderRadius: '50%'
      }}
    />
  );
}

function Game() {
  const [playerPosition, setPlayerPosition] = useState({x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50});
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const movePlayer = useCallback((e) => {
    if (gameOver) return;
    const newX = e.clientX - (PLAYER_SIZE / 2);
    setPlayerPosition(prev => ({
      ...prev,
      x: Math.max(0, Math.min(newX, GAME_WIDTH - PLAYER_SIZE))
    }));
  }, [gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setPlayerPosition(prev => ({...prev, x: Math.max(0, prev.x - 10)}));
      } else if (e.key === 'ArrowRight') {
        setPlayerPosition(prev => ({...prev, x: Math.min(GAME_WIDTH - PLAYER_SIZE, prev.x + 10)}));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setEnemies(prev => {
        let newEnemies = prev.map(enemy => ({
          ...enemy,
          y: enemy.y + ENEMY_SPEED * level
        }));

        // Remove enemies that are off-screen
        newEnemies = newEnemies.filter(enemy => enemy.y < GAME_HEIGHT);

        // Check for collisions
        newEnemies.forEach(enemy => {
          if (
            Math.abs(enemy.x - playerPosition.x) < (PLAYER_SIZE + ENEMY_SIZE) / 2 &&
            Math.abs(enemy.y - playerPosition.y) < (PLAYER_SIZE + ENEMY_SIZE) / 2
          ) {
            setGameOver(true);
          }
        });

        // Add new enemy
        if (Math.random() < 0.02) {
          newEnemies.push({x: Math.random() * GAME_WIDTH, y: 0});
        }

        // Score and level up
        const currentScore = GAME_HEIGHT - Math.min(...newEnemies.map(e => e.y));
        setScore(currentScore);
        if (currentScore > level * LEVEL_UP_SCORE) {
          setLevel(prev => prev + 1);
        }

        return newEnemies;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [playerPosition, level]);

  return (
    <div className="relative w-full h-[500px] bg-gray-100 border border-black" onMouseMove={movePlayer}>
      <Player position={playerPosition} />
      {enemies.map((enemy, idx) => <Enemy key={idx} position={enemy} />)}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Game Over</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your Score: {score}</p>
              <Button onClick={() => { setEnemies([]); setScore(0); setLevel(1); setGameOver(false); }}>Restart</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="flex flex-col items-center p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">Simple 2D Game</h1>
      <Game />
      <div className="mt-4 text-center">
        <p>Score: <span className="font-bold">{score}</span></p>
        <p>Level: <span className="font-bold">{level}</span></p>
      </div>
    </div>
  );
}