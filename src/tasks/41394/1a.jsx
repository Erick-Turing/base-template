import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_RADIUS = 5;

const GameCanvas = ({ gameState, setGameState }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawPaddle = (x, y) => {
      ctx.fillStyle = "white";
      ctx.fillRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
    };

    const drawBall = (x, y) => {
      ctx.beginPath();
      ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();
    };

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawPaddle(gameState.paddle1.x, gameState.paddle1.y);
      drawPaddle(gameState.paddle2.x, gameState.paddle2.y);
      drawBall(gameState.ball.x, gameState.ball.y);
    };

    draw();
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border border-gray-300"
    />
  );
};

const ScoreBoard = ({ score }) => (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle>Score</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Player 1: {score.player1}</p>
      <p>Player 2: {score.player2}</p>
    </CardContent>
  </Card>
);

const Settings = ({ settings, setSettings }) => (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle>Game Settings</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <Label htmlFor="paddleSize">Paddle Size</Label>
          <Slider
            id="paddleSize"
            min={40}
            max={120}
            step={10}
            value={[settings.paddleSize]}
            onValueChange={(value) => setSettings({ ...settings, paddleSize: value[0] })}
          />
        </div>
        <div>
          <Label htmlFor="gameSpeed">Game Speed</Label>
          <Slider
            id="gameSpeed"
            min={1}
            max={5}
            step={0.5}
            value={[settings.gameSpeed]}
            onValueChange={(value) => setSettings({ ...settings, gameSpeed: value[0] })}
          />
        </div>
        <div>
          <Label htmlFor="winningScore">Winning Score</Label>
          <Input
            id="winningScore"
            type="number"
            value={settings.winningScore}
            onChange={(e) => setSettings({ ...settings, winningScore: parseInt(e.target.value) })}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="singlePlayer"
            checked={settings.singlePlayer}
            onCheckedChange={(checked) => setSettings({ ...settings, singlePlayer: checked })}
          />
          <Label htmlFor="singlePlayer">Single Player Mode</Label>
        </div>
      </div>
    </CardContent>
  </Card>
);

const LeaderBoard = ({ leaderboard }) => (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle>Leaderboard</CardTitle>
    </CardHeader>
    <CardContent>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            {entry.name}: {entry.score}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default function App() {
  const [gameState, setGameState] = useState({
    paddle1: { x: 10, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
    paddle2: { x: CANVAS_WIDTH - 20, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
    ball: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: 2, dy: 2 },
    score: { player1: 0, player2: 0 }
  });

  const [settings, setSettings] = useState({
    paddleSize: PADDLE_HEIGHT,
    gameSpeed: 1,
    winningScore: 5,
    singlePlayer: false
  });

  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const { key } = e;
      const moveDistance = 10;

      setGameState((prevState) => {
        const newState = { ...prevState };

        if (key === "w" && newState.paddle1.y > 0) {
          newState.paddle1.y -= moveDistance;
        } else if (key === "s" && newState.paddle1.y < CANVAS_HEIGHT - PADDLE_HEIGHT) {
          newState.paddle1.y += moveDistance;
        }

        if (!settings.singlePlayer) {
          if (key === "ArrowUp" && newState.paddle2.y > 0) {
            newState.paddle2.y -= moveDistance;
          } else if (key === "ArrowDown" && newState.paddle2.y < CANVAS_HEIGHT - PADDLE_HEIGHT) {
            newState.paddle2.y += moveDistance;
          }
        }

        return newState;
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [settings.singlePlayer]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setGameState((prevState) => {
        const newState = { ...prevState };
        newState.ball.x += newState.ball.dx * settings.gameSpeed;
        newState.ball.y += newState.ball.dy * settings.gameSpeed;

        // Ball collision with top and bottom walls
        if (newState.ball.y <= BALL_RADIUS || newState.ball.y >= CANVAS_HEIGHT - BALL_RADIUS) {
          newState.ball.dy *= -1;
        }

        // Ball collision with paddles
        if (
          (newState.ball.x <= newState.paddle1.x + PADDLE_WIDTH &&
            newState.ball.y >= newState.paddle1.y &&
            newState.ball.y <= newState.paddle1.y + settings.paddleSize) ||
          (newState.ball.x >= newState.paddle2.x - BALL_RADIUS &&
            newState.ball.y >= newState.paddle2.y &&
            newState.ball.y <= newState.paddle2.y + settings.paddleSize)
        ) {
          newState.ball.dx *= -1.1; // Increase speed slightly
        }

        // Scoring
        if (newState.ball.x <= 0) {
          newState.score.player2++;
          newState.ball = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: 2, dy: 2 };
        } else if (newState.ball.x >= CANVAS_WIDTH) {
          newState.score.player1++;
          newState.ball = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: -2, dy: 2 };
        }

        // AI opponent
        if (settings.singlePlayer) {
          const paddleCenter = newState.paddle2.y + settings.paddleSize / 2;
          const ballCenter = newState.ball.y;
          if (paddleCenter < ballCenter - 10) {
            newState.paddle2.y += 5;
          } else if (paddleCenter > ballCenter + 10) {
            newState.paddle2.y -= 5;
          }
        }

        return newState;
      });
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [settings]);

  const resetGame = () => {
    setGameState({
      paddle1: { x: 10, y: CANVAS_HEIGHT / 2 - settings.paddleSize / 2 },
      paddle2: { x: CANVAS_WIDTH - 20, y: CANVAS_HEIGHT / 2 - settings.paddleSize / 2 },
      ball: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: 2, dy: 2 },
      score: { player1: 0, player2: 0 }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">React Tennis Game</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <GameCanvas gameState={gameState} setGameState={setGameState} />
          <ScoreBoard score={gameState.score} />
          <Button onClick={resetGame} className="mt-4">
            Reset Game
          </Button>
        </div>
        <div>
          <Settings settings={settings} setSettings={setSettings} />
          <LeaderBoard leaderboard={leaderboard} />
        </div>
      </div>
    </div>
  );
}