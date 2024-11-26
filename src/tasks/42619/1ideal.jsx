import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [clockType, setClockType] = useState("analog");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const ClockFace = ({ type }) => {
    const hours = time.getHours() % 12 || 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    switch (type) {
      case "analog":
        return (
          <div className="relative w-48 h-48 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center">
            {/* Center of the clock */}
            <div className="absolute w-2 h-2 bg-gray-800 rounded-full z-10"></div>

            {/* Numbers on the clock */}
            {[...Array(12)].map((_, i) => {
              const angle = (i + 1) * 30; // Degrees for each number
              const x = Math.sin((angle * Math.PI) / 180) * 80; // Calculate X position
              const y = -Math.cos((angle * Math.PI) / 180) * 80; // Calculate Y position
              return (
                <div
                  key={i}
                  className="absolute text-gray-800 text-sm font-bold"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  {i + 1}
                </div>
              );
            })}

            {/* Hour hand */}
            <div
              className="absolute bg-gray-800"
              style={{
                width: "4px",
                height: "30%",
                top: "50%",
                left: "50%",
                transform: `rotate(${hours * 30 + minutes / 2}deg) translate(0%, -100%)`,
                transformOrigin: "50% 0%",
              }}
            ></div>

            {/* Minute hand */}
            <div
              className="absolute bg-gray-600"
              style={{
                width: "3px",
                height: "40%",
                top: "50%",
                left: "50%",
                transform: `rotate(${minutes * 6}deg) translate(0%, -100%)`,
                transformOrigin: "50% 0%",
              }}
            ></div>

            {/* Second hand */}
            <div
              className="absolute bg-red-500"
              style={{
                width: "2px",
                height: "45%",
                top: "50%",
                left: "50%",
                transform: `rotate(${seconds * 6}deg) translate(0%, -100%)`,
                transformOrigin: "50% 0%",
              }}
            ></div>
          </div>
        );

      case "digital":
        return (
          <div className="text-4xl font-mono text-center">
            {time.toLocaleTimeString()}
          </div>
        );

      case "binary":
        const binaryTime = `${hours
          .toString(2)
          .padStart(4, "0")}:${minutes
          .toString(2)
          .padStart(6, "0")}:${seconds.toString(2).padStart(6, "0")}`;
        return (
          <div className="grid grid-cols-4 gap-2 text-center">
            {binaryTime.split("").map((bit, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 flex items-center justify-center ${
                  bit === "1"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {bit}
              </div>
            ))}
          </div>
        );

      case "word":
        return (
          <div className="text-lg text-center">
            {time
              .toLocaleTimeString("en", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
              .replace(/:/, " ")}
          </div>
        );

      case "roman":
        const roman = (num) => {
          const romanNumerals = [
            "I",
            "II",
            "III",
            "IV",
            "V",
            "VI",
            "VII",
            "VIII",
            "IX",
            "X",
            "XI",
            "XII",
          ];
          return romanNumerals[num - 1] || num;
        };
        return (
          <div className="text-3xl font-serif text-center">
            {roman(hours)}:{roman(minutes - (minutes % 5))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Configurable Clock</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Select onValueChange={setClockType}>
            <SelectTrigger className="mb-4 w-48">
              <SelectValue placeholder="Select Clock Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="analog">Analog</SelectItem>
              <SelectItem value="digital">Digital</SelectItem>
              <SelectItem value="binary">Binary</SelectItem>
              <SelectItem value="word">Word</SelectItem>
              <SelectItem value="roman">Roman Numerals</SelectItem>
            </SelectContent>
          </Select>
          <ClockFace type={clockType} />
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  return <Clock />;
}
