import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const GAME_WIDTH = 300;
const GAME_HEIGHT = 400;
const PLAYER_SIZE = 30;
const OBSTACLE_SIZE = 20;
const COLLECTIBLE_SIZE = 15;

const Player = ({ x, y }) => (
  <div
    className="absolute bg-blue-500 rounded-full"
    style={{
      left: x,
      top: y,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
    }}
  />
);

const Obstacle = ({ x, y }) => (
  <div
    className="absolute bg-red-500 rounded-full"
    style={{
      left: x,
      top: y,
      width: OBSTACLE_SIZE,
      height: OBSTACLE_SIZE,
    }}
  />
);

const Collectible = ({ x, y }) => (
  <div
    className="absolute bg-yellow-500 rounded-full"
    style={{
      left: x,
      top: y,
      width: COLLECTIBLE_SIZE,
      height: COLLECTIBLE_SIZE,
    }}
  />
);

const GameArea = ({ children }) => (
  <div
    className="relative bg-gray-800 overflow-hidden"
    style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
  >
    {children}
  </div>
);

export default function App() {
  const [gameState, setGameState] = useState("start");
  const [playerPos, setPlayerPos] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - PLAYER_SIZE - 10 });
  const [obstacles, setObstacles] = useState([]);
  const [collectibles, setCollectibles] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);

  const movePlayer = useCallback((direction) => {
    setPlayerPos((prev) => {
      let newX = prev.x + direction * 5;
      newX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_SIZE, newX));
      return { ...prev, x: newX };
    });
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "ArrowLeft") movePlayer(-1);
    if (e.key === "ArrowRight") movePlayer(1);
  }, [movePlayer]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const startGame = () => {
    setGameState("playing");
    setPlayerPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - PLAYER_SIZE - 10 });
    setObstacles([]);
    setCollectibles([]);
    setScore(0);
    setLevel(1);
    setLives(3);
  };

  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return;

    // Move obstacles and collectibles
    setObstacles((prev) => prev.map((o) => ({ ...o, y: o.y + 2 })).filter((o) => o.y < GAME_HEIGHT));
    setCollectibles((prev) => prev.map((c) => ({ ...c, y: c.y + 1 })).filter((c) => c.y < GAME_HEIGHT));

    // Spawn new obstacles and collectibles
    if (Math.random() < 0.02 * level) {
      setObstacles((prev) => [...prev, { x: Math.random() * (GAME_WIDTH - OBSTACLE_SIZE), y: -OBSTACLE_SIZE }]);
    }
    if (Math.random() < 0.01) {
      setCollectibles((prev) => [...prev, { x: Math.random() * (GAME_WIDTH - COLLECTIBLE_SIZE), y: -COLLECTIBLE_SIZE }]);
    }

    // Check collisions
    obstacles.forEach((obstacle) => {
      if (
        playerPos.x < obstacle.x + OBSTACLE_SIZE &&
        playerPos.x + PLAYER_SIZE > obstacle.x &&
        playerPos.y < obstacle.y + OBSTACLE_SIZE &&
        playerPos.y + PLAYER_SIZE > obstacle.y
      ) {
        setLives((prev) => prev - 1);
        if (lives <= 1) {
          setGameState("gameover");
        }
      }
    });

    collectibles.forEach((collectible, index) => {
      if (
        playerPos.x < collectible.x + COLLECTIBLE_SIZE &&
        playerPos.x + PLAYER_SIZE > collectible.x &&
        playerPos.y < collectible.y + COLLECTIBLE_SIZE &&
        playerPos.y + PLAYER_SIZE > collectible.y
      ) {
        setScore((prev) => prev + 10);
        setCollectibles((prev) => prev.filter((_, i) => i !== index));
      }
    });

    // Level up
    if (score > level * 100) {
      setLevel((prev) => prev + 1);
    }
  }, [gameState, level, lives, obstacles, collectibles, playerPos, score]);

  useEffect(() => {
    const gameInterval = setInterval(gameLoop, 16);
    return () => clearInterval(gameInterval);
  }, [gameLoop]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Space Dodger</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <GameArea>
            <Player x={playerPos.x} y={playerPos.y} />
            {obstacles.map((o, i) => (
              <Obstacle key={`obstacle-${i}`} x={o.x} y={o.y} />
            ))}
            {collectibles.map((c, i) => (
              <Collectible key={`collectible-${i}`} x={c.x} y={c.y} />
            ))}
          </GameArea>
          <div className="mt-4 w-full">
            <div className="flex justify-between mb-2">
              <span>Score: {score}</span>
              <span>Level: {level}</span>
              <span>Lives: {lives}</span>
            </div>
            <Progress value={(score % 100) / 100 * 100} className="w-full" />
          </div>
          {gameState === "start" && (
            <Button onClick={startGame} className="mt-4">
              Start Game
            </Button>
          )}
          {gameState === "gameover" && (
            <div className="mt-4 text-center">
              <p className="text-xl font-bold mb-2">Game Over!</p>
              <p>Final Score: {score}</p>
              <Button onClick={startGame} className="mt-2">
                Play Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}