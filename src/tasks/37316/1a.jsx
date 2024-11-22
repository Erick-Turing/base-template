import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GameBoard = () => {
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);

  const popUpRandomMole = useCallback(() => {
    if (!gameActive) return;
    
    const randomIndex = Math.floor(Math.random() * moles.length);
    const newMoles = moles.map((_, index) => index === randomIndex);
    setMoles(newMoles);

    // Mole disappears after a random time between 500ms to 1500ms
    setTimeout(() => {
      setMoles(prev => prev.map((mole, i) => i === randomIndex ? false : mole));
    }, Math.random() * 1000 + 500);
  }, [moles, gameActive]);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      const moleTimer = setInterval(popUpRandomMole, 750);
      
      return () => {
        clearTimeout(timer);
        clearInterval(moleTimer);
      };
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [gameActive, timeLeft, popUpRandomMole]);

  const whackMole = (index) => {
    if (moles[index] && gameActive) {
      setMoles(prev => prev.map((mole, i) => i === index ? false : mole));
      setScore(prev => prev + 1);
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setMoles(Array(9).fill(false));
    setGameActive(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-400 to-purple-500">
      <Card className="w-full max-w-md p-4 sm:p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl mb-2">Whack-A-Mole</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {gameActive ? (
            <>
              <p className="mb-4">Time: {timeLeft} | Score: {score}</p>
              <div className="grid grid-cols-3 gap-4">
                {moles.map((isUp, index) => (
                  <div 
                    key={index} 
                    className={`h-20 w-20 mx-auto bg-brown-700 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${isUp ? 'scale-110 bg-green-600' : 'hover:scale-105'}`}
                    onClick={() => whackMole(index)}
                  >
                    {isUp && <span className="text-white text-3xl">🦔</span>}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="mb-4">Game Over! Your score: {score}</p>
              <Button onClick={startGame} className="w-full">Start Game</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  return <GameBoard />;
}