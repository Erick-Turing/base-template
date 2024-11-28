import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const BOARD_SIZE = 8;
const UNIT_TYPES = {
  archer: { name: "Archer", damage: 2, health: 3, range: 3 },
  warrior: { name: "Warrior", damage: 3, health: 5, range: 1 },
  ogre: { name: "Ogre", damage: 5, health: 8, range: 2 },
};

function createEmptyBoard(size) {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
}

function calculateDistance(pos1, pos2) {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

function App() {
  const [board, setBoard] = useState(createEmptyBoard(BOARD_SIZE));
  const [currentPlayer, setCurrentPlayer] = useState("Player 1");
  const [winner, setWinner] = useState(null);

  const handlePlaceUnit = (x, y, unitType) => {
    if (board[x][y] || winner) return;
    const newBoard = [...board];
    newBoard[x][y] = { ...UNIT_TYPES[unitType], owner: currentPlayer };
    setBoard(newBoard);
  };

  const handleEndTurn = () => {
    const updatedBoard = [...board];
    let playerPieces = { "Player 1": [], "Player 2": [] };

    // Collect pieces by player
    board.forEach((row, x) =>
      row.forEach((cell, y) => {
        if (cell) {
          playerPieces[cell.owner].push({ ...cell, position: { x, y } });
        }
      })
    );

    // Resolve battles
    playerPieces["Player 1"].forEach((piece) => attackClosestEnemy(piece, playerPieces["Player 2"], updatedBoard));
    playerPieces["Player 2"].forEach((piece) => attackClosestEnemy(piece, playerPieces["Player 1"], updatedBoard));

    // Remove dead units
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        if (updatedBoard[x][y] && updatedBoard[x][y].health <= 0) {
          updatedBoard[x][y] = null;
        }
      }
    }

    // Check for winner
    const player1Units = updatedBoard.flat().filter((cell) => cell && cell.owner === "Player 1").length;
    const player2Units = updatedBoard.flat().filter((cell) => cell && cell.owner === "Player 2").length;

    if (player1Units === 0) setWinner("Player 2");
    else if (player2Units === 0) setWinner("Player 1");

    setBoard(updatedBoard);
    setCurrentPlayer((prev) => (prev === "Player 1" ? "Player 2" : "Player 1"));
  };

  const attackClosestEnemy = (attacker, enemies, boardState) => {
    let closestEnemy = null;
    let minDistance = Infinity;

    enemies.forEach((enemy) => {
      const distance = calculateDistance(attacker.position, enemy.position);
      if (distance <= attacker.range && distance < minDistance) {
        closestEnemy = enemy;
        minDistance = distance;
      }
    });

    if (closestEnemy) {
      const { x, y } = closestEnemy.position;
      boardState[x][y].health -= attacker.damage;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4 sm:p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-center text-lg font-semibold">
            {winner ? `Winner: ${winner}` : `${currentPlayer}'s Turn`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-1 sm:gap-2">
            {board.map((row, x) =>
              row.map((cell, y) => (
                <div
                  key={`${x}-${y}`}
                  className={`w-8 h-8 sm:w-12 sm:h-12 border flex items-center justify-center cursor-pointer ${
                    cell
                      ? cell.owner === "Player 1"
                        ? "bg-blue-300"
                        : "bg-red-300"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => handlePlaceUnit(x, y, "archer")}
                >
                  {cell && (
                    <span className="text-xs sm:text-sm font-medium">
                      {cell.name[0]} ({cell.health})
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <button
            onClick={() => handlePlaceUnit(Math.floor(Math.random() * BOARD_SIZE), Math.floor(Math.random() * BOARD_SIZE), "warrior")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Warrior
          </button>
          <button
            onClick={handleEndTurn}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            End Turn
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
