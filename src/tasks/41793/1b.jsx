import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const GridBlock = ({ selected, onClick, x, y, size }) => {
  return (
    <div 
      className={`w-full h-full border border-gray-300 ${selected ? 'bg-blue-500' : 'bg-white'} transition-colors duration-200`}
      style={{ width: size, height: size }}
      onClick={() => onClick(x, y)}
    ></div>
  );
};

const GridSelection = ({ x = 16, y = 9 }) => {
  const [selected, setSelected] = useState({ x: null, y: null });
  const [blockSize, setBlockSize] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const size = Math.min(width / x, height / y);
      setBlockSize(size);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [x, y]);

  const toggleBlock = (blockX, blockY) => {
    if (selected.x === blockX && selected.y === blockY) {
      setSelected({ x: null, y: null });
    } else {
      setSelected({ x: blockX, y: blockY });
    }
  };

  const blocks = [];
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      blocks.push(
        <GridBlock 
          key={`${i}-${j}`}
          x={i} 
          y={j} 
          selected={i <= selected.x && j <= selected.y}
          onClick={toggleBlock}
          size={blockSize}
        />
      );
    }
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-1 p-4" style={{ gridTemplateRows: `repeat(${y}, 1fr)` }}>
      {blocks}
    </div>
  );
};

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Dynamic Grid Selection</h1>
      <div className="max-w-full sm:max-w-sm">
        <GridSelection />
      </div>
      <Button className="mt-4" onClick={() => window.location.reload()}>Reset Grid</Button>
    </div>
  );
}