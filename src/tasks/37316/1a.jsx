import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BoardSquare = ({ piece, onClick, position }) => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    if (piece && piece.canAttack) {
      setIsHighlighted(true);
    } else {
      setIsHighlighted(false);
    }
  }, [piece]);

  return (
    <div 
      className={`w-16 h-16 border flex items-center justify-center ${isHighlighted ? 'bg-yellow-200' : 'bg-white'} cursor-pointer hover:bg-gray-100 transition-colors`}
      onClick={() => onClick(position)}
    >
      {piece && (
        <div className={`text-${piece.player === 1 ? 'red' : 'blue'}-500`}>
          {piece.type === 'archer' && '🏹'}
          {piece.type === 'warrior' && '⚔️'}
          {piece.type === 'ogre' && '👹'}
        </div>
      )}
    </div>
  );
};

const GameBoard = () => {
  const [board, setBoard] = useState(Array(8).fill().map(() => Array(8).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [pieces, setPieces] = useState({
    1: { archer: 2, warrior: 2, ogre: 1 },
    2: { archer: 2, warrior: 2, ogre: 1 }
  });
  const [winner, setWinner] = useState(null);

  const handlePlacePiece = (type, position) => {
    if (pieces[currentPlayer][type] > 0 && !board[position.row][position.col]) {
      const newBoard = board.map(row => [...row]);
      newBoard[position.row][position.col] = {
        type,
        player: currentPlayer,
        life: type === 'archer' ? 50 : (type === 'warrior' ? 100 : 150),
        damage: type === 'archer' ? 20 : (type === 'warrior' ? 30 : 50),
        canAttack: true,
      };
      setBoard(newBoard);
      setPieces(prev => ({
        ...prev,
        [currentPlayer]: { ...prev[currentPlayer], [type]: prev[currentPlayer][type] - 1 }
      }));
    }
  };

  const checkForWinner = () => {
    const player1Pieces = board.flat().filter(piece => piece && piece.player === 1).length;
    const player2Pieces = board.flat().filter(piece => piece && piece.player === 2).length;
    if (player1Pieces === 0) setWinner(2);
    else if (player2Pieces === 0) setWinner(1);
  };

  const simulateBattle = () => {
    const newBoard = board.map(row => row.map(piece => ({...piece})));
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = newBoard[row][col];
        if (piece && piece.canAttack) {
          const targets = findTargets(newBoard, {row, col}, piece.type);
          if (targets.length) {
            const target = targets[0];
            target.life -= piece.damage;
            if (target.life <= 0) {
              newBoard[target.row][target.col] = null;
            }
          }
          piece.canAttack = false;
        }
      }
    }
    setBoard(newBoard);
    checkForWinner();
  };

  const findTargets = (board, position, type) => {
    const targets = [];
    const directions = type === 'archer' ? [[-2,0],[2,0],[0,-2],[0,2]] : [[-1,0],[1,0],[0,-1],[0,1]];
    for (let [dx, dy] of directions) {
      const newRow = position.row + dx, newCol = position.col + dy;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && board[newRow][newCol] && board[newRow][newCol].player !== currentPlayer) {
        targets.push({row: newRow, col: newCol});
      }
    }
    return targets.sort((a, b) => 
      Math.abs(position.row - a.row) + Math.abs(position.col - a.col) - 
      Math.abs(position.row - b.row) - Math.abs(position.col - b.col)
    );
  };

  const endTurn = () => {
    setCurrentPlayer(prev => prev === 1 ? 2 : 1);
    const updatedBoard = board.map(row => row.map(piece => piece ? {...piece, canAttack: true} : piece));
    setBoard(updatedBoard);
    simulateBattle();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl mb-4">Board Game</h1>
      {winner ? (
        <h2 className="text-xl mb-4 text-green-500">Player {winner} wins!</h2>
      ) : (
        <>
          <div className="grid grid-cols-8 gap-1 mb-4">
            {board.map((row, i) => row.map((_, j) => 
              <BoardSquare key={`${i}-${j}`} piece={board[i][j]} onClick={(position) => handlePlacePiece('archer', position)} position={{row: i, col: j}} />
            ))}
          </div>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Player {currentPlayer}'s Turn</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(pieces[currentPlayer]).map(type => 
                <Button key={type} onClick={() => handlePlacePiece(type, {row: 0, col: 0})} disabled={pieces[currentPlayer][type] === 0}>
                  Place {type} ({pieces[currentPlayer][type]})
                </Button>
              )}
            </CardContent>
          </Card>
          <Button onClick={endTurn}>End Turn</Button>
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <GameBoard />
    </div>
  );
}