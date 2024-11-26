import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const icons = [
  '🌟', '🍎', '🚀', '🐱', '🌈', '🎨', '🍔', '🚲'
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function CardItem({ icon, onClick, isFlipped, isMatched }) {
  return (
    <Card className={cn("w-20 h-20 sm:w-24 sm:h-24 cursor-pointer transform transition-transform", isFlipped || isMatched ? 'rotate-y-180' : '')} onClick={onClick}>
      <CardContent className="flex justify-center items-center p-0">
        <div className="text-3xl sm:text-4xl">
          {isFlipped || isMatched ? icon : '❓'}
        </div>
      </CardContent>
    </Card>
  );
}

function GameBoard() {
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (firstCard && secondCard) {
      if (firstCard.icon === secondCard.icon) {
        setCards(prevCards => 
          prevCards.map(card => 
            card.id === firstCard.id || card.id === secondCard.id ? { ...card, isMatched: true } : card
          )
        );
        setScore(prevScore => prevScore + 1);
        checkGameOver();
      } else {
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              card.id === firstCard.id || card.id === secondCard.id ? { ...card, isFlipped: false } : card
            )
          );
        }, 1000);
      }
      setFirstCard(null);
      setSecondCard(null);
    }
  }, [firstCard, secondCard]);

  const checkGameOver = () => {
    if (cards.every(card => card.isMatched)) {
      setIsGameOver(true);
    }
  };

  const handleCardClick = (card) => {
    if (card.isFlipped || card.isMatched) return;
    
    if (!firstCard) {
      setFirstCard(card);
      setCards(prevCards => 
        prevCards.map(c => c.id === card.id ? { ...c, isFlipped: true } : c)
      );
    } else if (!secondCard && firstCard.id !== card.id) {
      setSecondCard(card);
      setCards(prevCards => 
        prevCards.map(c => c.id === card.id ? { ...c, isFlipped: true } : c)
      );
    }
  };

  const resetGame = () => {
    const doubledIcons = [...icons, ...icons];
    setCards(shuffle(doubledIcons).map((icon, index) => ({ id: index, icon, isFlipped: false, isMatched: false })));
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h1 className="text-2xl font-bold">Memory Game</h1>
      <p>Score: {score}</p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {cards.map(card => (
          <CardItem key={card.id} {...card} onClick={() => handleCardClick(card)} />
        ))}
      </div>
      {isGameOver && (
        <div className="text-center">
          <p className="text-lg mb-2">You've won!</p>
          <Button onClick={resetGame}>Play Again</Button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <GameBoard />
    </div>
  );
}