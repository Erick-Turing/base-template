import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const GameArea = ({ onScore, gameSpeed }) => {
  const canvasRef = useRef(null);
  const ballRef = useRef({
    x: 300,
    y: 200,
    dx: Math.random() > 0.5 ? 2 : -2, // Random initial direction on X-axis
    dy: Math.random() > 0.5 ? 1 : -1, // Random initial direction on Y-axis
  });
  const paddle1Ref = useRef({ y: 150 });
  const paddle2Ref = useRef({ y: 150 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update ball position based on speed
      const ball = ballRef.current;
      ball.x += ball.dx * (gameSpeed * 0.5);
      ball.y += ball.dy * (gameSpeed * 0.5);

      // Ball collision with top and bottom walls
      if (ball.y + 10 > canvas.height || ball.y - 10 < 0) {
        ball.dy = -ball.dy; // Reverse vertical direction
      }

      // Ball collision with paddles
      const paddle1 = paddle1Ref.current;
      const paddle2 = paddle2Ref.current;

      if (
        (ball.x - 10 < 20 && ball.y > paddle1.y && ball.y < paddle1.y + 100) || // Left paddle collision
        (ball.x + 10 > canvas.width - 20 && ball.y > paddle2.y && ball.y < paddle2.y + 100) // Right paddle collision
      ) {
        ball.dx = -ball.dx; // Reverse horizontal direction
      }

      // Ball out of bounds (left or right)
      if (ball.x < 0 || ball.x > canvas.width) {
        onScore(ball.x < 0 ? 'right' : 'left');
        resetBall();
      }

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
      ctx.fill();

      // Draw paddles
      ctx.fillRect(10, paddle1.y, 10, 100); // Left paddle
      ctx.fillRect(canvas.width - 20, paddle2.y, 10, 100); // Right paddle

      animationFrameId = requestAnimationFrame(render);
    };

    const resetBall = () => {
      // Reset ball to the center with random initial directions
      const ball = ballRef.current;
      ball.x = 300;
      ball.y = 200;
      ball.dx = Math.random() > 0.5 ? 2 : -2;
      ball.dy = Math.random() > 0.5 ? 1 : -1;
    };

    const handleKeyDown = (e) => {
      const speed = 10;
      const paddle1 = paddle1Ref.current;
      const paddle2 = paddle2Ref.current;

      if (e.key === 'w') paddle1.y = Math.max(0, paddle1.y - speed); // Move left paddle up
      if (e.key === 's') paddle1.y = Math.min(canvas.height - 100, paddle1.y + speed); // Move left paddle down
      if (e.key === 'ArrowUp') paddle2.y = Math.max(0, paddle2.y - speed); // Move right paddle up
      if (e.key === 'ArrowDown') paddle2.y = Math.min(canvas.height - 100, paddle2.y + speed); // Move right paddle down
    };

    window.addEventListener('keydown', handleKeyDown);
    render();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onScore, gameSpeed]);

  return <canvas ref={canvasRef} width="600" height="400" className="border border-gray-300" />;
};

export default function App() {
  const [score, setScore] = useState({ left: 0, right: 0 });
  const [gameSpeed, setGameSpeed] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const updateScore = (side) => {
    setScore((prev) => ({ ...prev, [side]: prev[side] + 1 }));
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>2D Tennis Game</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between mb-4">
            <span>Player 1: {score.left}</span>
            <span>Player 2: {score.right}</span>
          </div>
          <GameArea onScore={updateScore} gameSpeed={gameSpeed} />
          <div className="mt-4 flex justify-between">
            <Button onClick={() => setIsSettingsOpen(!isSettingsOpen)}>Settings</Button>
            <Button onClick={() => setScore({ left: 0, right: 0 })}>Reset Game</Button>
          </div>
        </CardContent>
      </Card>
      {isSettingsOpen && (
        <Card>
          <CardContent>
            <div className="space-y-2">
              <label>Game Speed</label>
              <Slider value={[gameSpeed]} onValueChange={(value) => setGameSpeed(value[0])} max={10} step={0.5} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
