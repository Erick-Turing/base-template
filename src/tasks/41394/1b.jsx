import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
// import { useSound } from 'use-sound';

const GameArea = ({ onScore }) => {
  const canvasRef = useRef(null);
  const [ball, setBall] = useState({ x: 300, y: 200, dx: 5, dy: 2 });
  const [paddle1, setPaddle1] = useState({ y: 150 });
  const [paddle2, setPaddle2] = useState({ y: 150 });
  // const [playHit] = useSound('/sounds/hit.mp3');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Ball movement
      setBall(prev => ({
        x: prev.x + prev.dx,
        y: prev.y + prev.dy,
        dx: prev.dx,
        dy: prev.dy
      }));

      // Ball collision with top or bottom
      if (ball.y + 10 > canvas.height || ball.y - 10 < 0) {
        setBall(prev => ({...prev, dy: -prev.dy}));
      }

      // Ball out of bounds
      if (ball.x < 0 || ball.x > canvas.width) {
        onScore(ball.x < 0 ? 'right' : 'left');
        resetBall();
      }

      // Paddle collision
      if (
        (ball.x - 10 < 20 && ball.y > paddle1.y && ball.y < paddle1.y + 100) ||
        (ball.x + 10 > canvas.width - 20 && ball.y > paddle2.y && ball.y < paddle2.y + 100)
      ) {
        // playHit();
        let relativeIntersectY = (ball.y - (ball.x < 20 ? paddle1.y : paddle2.y)) - 50;
        let normalizedRelativeIntersectionY = (relativeIntersectY / 50);
        let bounceAngle = normalizedRelativeIntersectionY * (5 * Math.PI / 12);
        let newDx = ball.x < 20 ? 5 * Math.cos(bounceAngle) : -5 * Math.cos(bounceAngle);
        let newDy = 5 * Math.sin(bounceAngle);
        setBall(prev => ({...prev, dx: newDx, dy: newDy}));
      }

      // Draw Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
      ctx.fill();

      // Draw Paddles
      ctx.fillRect(10, paddle1.y, 10, 100);
      ctx.fillRect(canvas.width - 20, paddle2.y, 10, 100);

      animationFrameId = requestAnimationFrame(render);
    };

    const resetBall = () => {
      setBall({ x: 300, y: 200, dx: 5, dy: 2 * (Math.random() > 0.5 ? 1 : -1) });
    };

    const handleKeyDown = (e) => {
      const speed = 10;
      if (e.key === 'w') setPaddle1(prev => ({ y: Math.max(0, prev.y - speed) }));
      if (e.key === 's') setPaddle1(prev => ({ y: Math.min(300 - 100, prev.y + speed) }));
      if (e.key === 'ArrowUp') setPaddle2(prev => ({ y: Math.max(0, prev.y - speed) }));
      if (e.key === 'ArrowDown') setPaddle2(prev => ({ y: Math.min(300 - 100, prev.y + speed) }));
    };

    window.addEventListener('keydown', handleKeyDown);
    render();
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [ball, paddle1, paddle2, onScore]);

  return <canvas ref={canvasRef} width="600" height="400" className="border border-gray-300" />;
};

export default function App() {
  const [score, setScore] = useState({ left: 0, right: 0 });
  const [gameSpeed, setGameSpeed] = useState(5);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const updateScore = (side) => {
    setScore(prev => ({...prev, [side]: prev[side] + 1}));
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
          <GameArea onScore={updateScore} />
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
              <Slider value={[gameSpeed]} onValueChange={setGameSpeed} max={10} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}