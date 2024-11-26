import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const icons = [
  "🍎", "🍌", "🍒", "🍓", "🍊", "🍇", "🍉", "🍋",
  "🍍", "🥝", "🥑", "🍅", "🍆", "🥕", "🌽", "🥦"
];

function shuffleArray(array) {
  let newArray = array.concat(array); // Duplica a array
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function MemoryCard({ icon, isFlipped, onClick }) {
  return (
    <Card
      className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center cursor-pointer transition-all duration-300 ${
        isFlipped ? "bg-white" : "bg-gray-200"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0 text-3xl sm:text-4xl">
        {isFlipped ? icon : "?"}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = useCallback(() => {
    setCards(shuffleArray(icons));
    setFlippedIndices([]);
    setMatchedPairs([]);
    setScore(0);
    setIsGameWon(false);
  }, []);

  const handleCardClick = useCallback((index) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedPairs.includes(index)) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      const [firstIndex, secondIndex] = newFlippedIndices;
      if (cards[firstIndex] === cards[secondIndex]) {
        const newMatchedPairs = [...matchedPairs, firstIndex, secondIndex];
        setMatchedPairs(newMatchedPairs);
        setScore(prevScore => prevScore + 1);
        setFlippedIndices([]);

        if (newMatchedPairs.length === cards.length) {
          setIsGameWon(true);
        }
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  }, [cards, flippedIndices, matchedPairs]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-center mb-4">Memory Game</h1>
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-semibold">Score: {score}</p>
        <Button onClick={startNewGame}>New Game</Button>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-4 max-w-2xl mx-auto">
        {cards.map((icon, index) => (
          <MemoryCard
            key={index}
            icon={icon}
            isFlipped={flippedIndices.includes(index) || matchedPairs.includes(index)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
      {isGameWon && (
        <Alert className="mt-8 max-w-md mx-auto">
          <AlertTitle>Congratulations!</AlertTitle>
          <AlertDescription>
            You've won the game! Your final score is {score}.
          </AlertDescription>
          <Button className="mt-4" onClick={startNewGame}>
            Play Again
          </Button>
        </Alert>
      )}
    </div>
  );
}
