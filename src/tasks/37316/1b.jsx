import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BOARD_SIZE = 8;
const PIECE_TYPES = {
  ARCHER: { name: "Archer", damage: 3, life: 7, range: 3 },
  WARRIOR: { name: "Warrior", damage: 5, life: 10, range: 1 },
  OGRE: { name: "Ogre", damage: 7, life: 15, range: 1 },
};

function Square({ piece, onClick }) {
  return (
    <div
      className="w-12 h-12 border border-gray-300 flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      {piece && (
        <div
          className={`w-10 h-10 rounded-full ${
            piece.player === 1 ? "bg-blue-500" : "bg-red-500"
          } flex items-center justify-center text-white text-xs`}
        >
          {piece.type.name[0]}
        </div>
      )}
    </div>
  );
}

function Board({ board, onSquareClick }) {
  return (
    <div className="grid grid-cols-8 gap-0">
      {board.map((row, i) =>
        row.map((piece, j) => (
          <Square key={`${i}-${j}`} piece={piece} onClick={() => onSquareClick(i, j)} />
        ))
      )}
    </div>
  );
}

function PieceSelector({ onSelect }) {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a piece" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(PIECE_TYPES).map(([key, value]) => (
          <SelectItem key={key} value={key}>
            {value.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function calculateDistance(x1, y1, x2, y2) {
  return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
}

function findClosestEnemy(board, piece, i, j) {
  let closestEnemy = null;
  let minDistance = Infinity;

  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      const target = board[x][y];
      if (target && target.player !== piece.player) {
        const distance = calculateDistance(i, j, x, y);
        if (distance <= piece.type.range && distance < minDistance) {
          closestEnemy = { piece: target, x, y };
          minDistance = distance;
        }
      }
    }
  }

  return closestEnemy;
}

function battle(board) {
  const newBoard = JSON.parse(JSON.stringify(board));

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const piece = newBoard[i][j];
      if (piece) {
        const closestEnemy = findClosestEnemy(newBoard, piece, i, j);
        if (closestEnemy) {
          closestEnemy.piece.life -= piece.type.damage;
          if (closestEnemy.piece.life <= 0) {
            newBoard[closestEnemy.x][closestEnemy.y] = null;
          }
        }
      }
    }
  }

  return newBoard;
}

function checkWinner(board) {
  let player1Pieces = 0;
  let player2Pieces = 0;

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j]) {
        if (board[i][j].player === 1) player1Pieces++;
        else player2Pieces++;
      }
    }
  }

  if (player1Pieces === 0) return 2;
  if (player2Pieces === 0) return 1;
  return null;
}

export default function App() {
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const newWinner = checkWinner(board);
    if (newWinner) setWinner(newWinner);
  }, [board]);

  const handleSquareClick = (i, j) => {
    if (winner) return;

    if (selectedPiece) {
      const newBoard = [...board];
      newBoard[i][j] = { type: PIECE_TYPES[selectedPiece], player: currentPlayer };
      setBoard(newBoard);
      setSelectedPiece(null);
    }
  };

  const handleEndTurn = () => {
    if (winner) return;

    const newBoard = battle(board);
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Multiplayer Board Game</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Game Board</CardTitle>
          </CardHeader>
          <CardContent>
            <Board board={board} onSquareClick={handleSquareClick} />
          </CardContent>
        </Card>
        <Card className="w-full sm:w-64">
          <CardHeader>
            <CardTitle>Game Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>Current Player: {currentPlayer}</div>
            <PieceSelector onSelect={setSelectedPiece} />
            <Button onClick={handleEndTurn}>End Turn</Button>
            {winner && <div className="font-bold">Player {winner} wins!</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}