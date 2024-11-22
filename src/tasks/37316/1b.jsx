import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GAME_DURATION = 30; // seconds
const MOLE_COUNT = 9;

const Mole = ({ isActive, onClick }) => (
  <div
    className={`w-full h-full rounded-full transition-all duration-200 ${
      isActive ? "bg-brown-500 scale-110" : "bg-green-600 scale-100"
    }`}
    onClick={onClick}
  >
    {isActive && (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-1/2 h-1/2 bg-black rounded-full"></div>
      </div>
    )}
  </div>
);

const GameBoard = ({ moles, onWhack }) => (
  <div className="grid grid-cols-3 gap-4 w-full max-w-md mx-auto">
    {moles.map((isActive, index) => (
      <div key={index} className="aspect-square">
        <Mole isActive={isActive} onClick={() => onWhack(index)} />
      </div>
    ))}
  </div>
);

export default function App() {
  const [gameState, setGameState] = useState("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [moles, setMoles] = useState(Array(MOLE_COUNT).fill(false));

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setMoles(Array(MOLE_COUNT).fill(false));
  };

  const endGame = useCallback(() => {
    setGameState("ended");
    setMoles(Array(MOLE_COUNT).fill(false));
  }, []);

  const whackMole = (index) => {
    if (moles[index]) {
      setScore((prevScore) => prevScore + 1);
      setMoles((prevMoles) => {
        const newMoles = [...prevMoles];
        newMoles[index] = false;
        return newMoles;
      });
    }
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, endGame]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const moleTimer = setInterval(() => {
      setMoles((prevMoles) => {
        const newMoles = [...prevMoles];
        const randomIndex = Math.floor(Math.random() * MOLE_COUNT);
        newMoles[randomIndex] = true;
        setTimeout(() => {
          setMoles((prevMoles) => {
            const newMoles = [...prevMoles];
            newMoles[randomIndex] = false;
            return newMoles;
          });
        }, 1000);
        return newMoles;
      });
    }, 1000);

    return () => clearInterval(moleTimer);
  }, [gameState]);

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Whack-a-Mole
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {gameState === "idle" && (
              <Button
                onClick={startGame}
                className="w-full py-2 text-lg font-semibold"
              >
                Start Game
              </Button>
            )}
            {gameState === "playing" && (
              <>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Score: {score}</span>
                  <span>Time: {timeLeft}s</span>
                </div>
                <GameBoard moles={moles} onWhack={whackMole} />
              </>
            )}
            {gameState === "ended" && (
              <div className="text-center space-y-4">
                <p className="text-2xl font-bold">Game Over!</p>
                <p className="text-xl">Your score: {score}</p>
                <Button
                  onClick={startGame}
                  className="w-full py-2 text-lg font-semibold"
                >
                  Play Again
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
