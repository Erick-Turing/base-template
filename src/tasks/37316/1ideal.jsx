import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Duration of the game in seconds
const GAME_DURATION = 30;

// Total number of moles on the board
const MOLE_COUNT = 9;

// Mole component representing a single mole on the board
const Mole = ({ isActive, onClick }) => (
  <div
    className={`w-full h-full rounded-full transition-all duration-200 ${
      isActive ? "bg-brown-500 scale-110" : "bg-green-600 scale-100"
    }`}
    onClick={onClick}
  >
    {/* Visual feedback when the mole is active */}
    {isActive && (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-1/2 h-1/2 bg-black rounded-full"></div>
      </div>
    )}
  </div>
);

// GameBoard component to render the grid of moles
const GameBoard = ({ moles, onWhack }) => (
  <div className="grid grid-cols-3 gap-4 w-full max-w-md mx-auto">
    {/* Render each mole */}
    {moles.map((isActive, index) => (
      <div key={index} className="aspect-square">
        <Mole isActive={isActive} onClick={() => onWhack(index)} />
      </div>
    ))}
  </div>
);

// Main App component managing the game state and rendering the UI
export default function App() {
  const [gameState, setGameState] = useState("idle"); // "idle", "playing", or "ended"
  const [score, setScore] = useState(0); // Player's score
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION); // Remaining game time
  const [moles, setMoles] = useState(Array(MOLE_COUNT).fill(false)); // State of all moles (active/inactive)

  // Start a new game
  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setMoles(Array(MOLE_COUNT).fill(false)); // Reset all moles to inactive
  };

  // End the game and reset the board
  const endGame = useCallback(() => {
    setGameState("ended");
    setMoles(Array(MOLE_COUNT).fill(false)); // Clear active moles
  }, []);

  // Handle mole clicks
  const whackMole = (index) => {
    if (moles[index]) {
      setScore((prevScore) => prevScore + 1); // Increase score
      setMoles((prevMoles) => {
        const newMoles = [...prevMoles];
        newMoles[index] = false; // Set the mole to inactive after it's hit
        return newMoles;
      });
    }
  };

  // Timer to manage game duration
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); // Stop the timer when time runs out
          endGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Clean up on unmount or state change
  }, [gameState, endGame]);

  // Timer to activate and deactivate moles randomly
  useEffect(() => {
    if (gameState !== "playing") return;

    const moleTimer = setInterval(() => {
      setMoles((prevMoles) => {
        const newMoles = [...prevMoles];
        const randomIndex = Math.floor(Math.random() * MOLE_COUNT); // Randomly pick a mole
        newMoles[randomIndex] = true; // Activate the mole

        // Deactivate the mole after 1 second
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

    return () => clearInterval(moleTimer); // Clean up on unmount or state change
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
            {/* Idle state: Show start button */}
            {gameState === "idle" && (
              <Button
                onClick={startGame}
                className="w-full py-2 text-lg font-semibold"
              >
                Start Game
              </Button>
            )}

            {/* Playing state: Show the game board and stats */}
            {gameState === "playing" && (
              <>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Score: {score}</span>
                  <span>Time: {timeLeft}s</span>
                </div>
                <GameBoard moles={moles} onWhack={whackMole} />
              </>
            )}

            {/* Ended state: Show game over screen */}
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
