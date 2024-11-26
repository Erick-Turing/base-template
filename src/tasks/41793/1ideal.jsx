import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const GridBlock = ({ isSelected, onClick }) => (
  <div
    className={`w-full h-full border border-gray-300 cursor-pointer transition-colors duration-200 ${
      isSelected ? "bg-blue-500" : "bg-white"
    }`}
    onClick={onClick}
  />
);

const GridSelection = ({ x, y }) => {
  const [selectedX, setSelectedX] = useState(0);
  const [selectedY, setSelectedY] = useState(0);

  const handleBlockClick = (clickedX, clickedY) => {
    if (clickedX === selectedX && clickedY === selectedY) {
      setSelectedX(0);
      setSelectedY(0);
    } else {
      setSelectedX(clickedX);
      setSelectedY(clickedY);
    }
  };

  return (
    <div
      className="grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${x}, 1fr)`,
        gridTemplateRows: `repeat(${y}, 1fr)`,
        aspectRatio: `${x} / ${y}`,
      }}
    >
      {Array.from({ length: y }).map((_, rowIndex) =>
        Array.from({ length: x }).map((_, colIndex) => (
          <GridBlock
            key={`${rowIndex}-${colIndex}`}
            isSelected={colIndex < selectedX && rowIndex < selectedY}
            onClick={() => handleBlockClick(colIndex + 1, rowIndex + 1)}
          />
        ))
      )}
    </div>
  );
};

export default function App() {
  const [dimensions, setDimensions] = useState({ x: 8, y: 5 });

  const handleXChange = (value) => {
    setDimensions((prev) => ({ ...prev, x: value[0] }));
  };

  const handleYChange = (value) => {
    setDimensions((prev) => ({ ...prev, y: value[0] }));
  };

  useEffect(() => {
    const handleResize = () => {
      setDimensions((prev) => ({ ...prev }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Grid Selection Component</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="x-slider"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                X Dimension: {dimensions.x}
              </label>
              <Slider
                id="x-slider"
                min={1}
                max={16}
                step={1}
                value={[dimensions.x]}
                onValueChange={handleXChange}
              />
            </div>
            <div>
              <label
                htmlFor="y-slider"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Y Dimension: {dimensions.y}
              </label>
              <Slider
                id="y-slider"
                min={1}
                max={9}
                step={1}
                value={[dimensions.y]}
                onValueChange={handleYChange}
              />
            </div>
          </div>
          <div
            className="relative w-full mx-auto"
            style={{
              maxWidth: "100%",
              aspectRatio: "16 / 9",
              overflow: "hidden",
            }}
          >
            <GridSelection x={dimensions.x} y={dimensions.y} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
