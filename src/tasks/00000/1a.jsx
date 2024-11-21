import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const [paddle1Y, setPaddle1Y] = useState(50);
  const [paddle2Y] = useState(50);
  const [ball, setBall] = useState({x: 300, y: 200, vx: 5, vy: 2});
  const [score, setScore] = useState({left: 0, right: 0});
  const [gameRunning, setGameRunning] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleKeyDown = (e) => {
      if (e.key === 'w') setPaddle1Y(y => Math.max(0, y - 10));
      if (e.key === 's') setPaddle1Y(y => Math.min(340, y + 10));
      if (e.key === 'ArrowUp') setPaddle2Y(y => Math.max(0, y - 10));
      if (e.key === 'ArrowDown') setPaddle2Y(y => Math.min(340, y + 10));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw paddles
      ctx.fillStyle = 'white';
      ctx.fillRect(10, paddle1Y, 10, 60);
      ctx.fillRect(580, paddle2Y, 10, 60);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Ball movement and collision
      let newX = ball.x + ball.vx;
      let newY = ball.y + ball.vy;

      if (newY <= 10 || newY >= 390) ball.vy = -ball.vy;
      if ((newX <= 20 && newY > paddle1Y && newY < paddle1Y + 60) || 
          (newX >= 570 && newY > paddle2Y && newY < paddle2Y + 60)) {
        ball.vx = -ball.vx;
      }

      if (newX < 0) {
        setScore(s => ({...s, right: s.right + 1}));
        newX = 300; newY = 200;
      } else if (newX > 600) {
        setScore(s => ({...s, left: s.left + 1}));
        newX = 300; newY = 200;
      }

      setBall({x: newX, y: newY, vx: ball.vx, vy: ball.vy});

      if (gameRunning) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    if (gameRunning) {
      document.addEventListener('keydown', handleKeyDown);
      animationFrameId = requestAnimationFrame(draw);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameRunning, paddle1Y, paddle2Y, ball]);

  return (
    <Card>
      <CardContent>
        <canvas ref={canvasRef} width="600" height="400" style={{background: 'black'}} />
        <div>
          <p>Score - Left: {score.left} | Right: {score.right}</p>
          <Button onClick={() => setGameRunning(!gameRunning)}>
            {gameRunning ? 'Pause' : 'Start'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCanvas;