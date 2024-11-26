import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const clockModels = [
  { id: "pointer", name: "Pointer Clock" },
  { id: "digital", name: "Digital Clock" },
  { id: "binary", name: "Binary Clock" },
  { id: "word", name: "Word Clock" },
  { id: "roman", name: "Roman Numeral Clock" },
];

const PointerClock = ({ time }) => {
  const secondsDegrees = (time.getSeconds() / 60) * 360;
  const minutesDegrees = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const hoursDegrees = ((time.getHours() + time.getMinutes() / 60) / 12) * 360;

  return (
    <div className="relative w-64 h-64 rounded-full border-4 border-gray-300">
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-4 bg-gray-600"
            style={{ transform: `rotate(${i * 30}deg) translateY(-30px)` }}
          />
        ))}
      </div>
      <div
        className="absolute top-1/2 left-1/2 w-1 h-16 bg-black origin-bottom"
        style={{ transform: `translateX(-50%) rotate(${hoursDegrees}deg)` }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-0.5 h-24 bg-blue-500 origin-bottom"
        style={{ transform: `translateX(-50%) rotate(${minutesDegrees}deg)` }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-0.5 h-28 bg-red-500 origin-bottom"
        style={{ transform: `translateX(-50%) rotate(${secondsDegrees}deg)` }}
      />
    </div>
  );
};

const DigitalClock = ({ time }) => {
  return (
    <div className="text-4xl font-bold">
      {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </div>
  );
};

const BinaryClock = ({ time }) => {
  const toBinary = (num, pad) => num.toString(2).padStart(pad, "0");
  const hours = toBinary(time.getHours(), 6);
  const minutes = toBinary(time.getMinutes(), 6);
  const seconds = toBinary(time.getSeconds(), 6);

  return (
    <div className="grid grid-cols-6 gap-2">
      {[hours, minutes, seconds].map((unit, i) => (
        <div key={i} className="space-y-2">
          {unit.split("").map((bit, j) => (
            <div
              key={j}
              className={`w-4 h-4 rounded-full ${bit === "1" ? "bg-green-500" : "bg-gray-300"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const WordClock = ({ time }) => {
  const hours = [
    "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX",
    "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE"
  ];
  const minutes = [
    "O'CLOCK", "FIVE", "TEN", "QUARTER", "TWENTY",
    "TWENTY-FIVE", "HALF"
  ];

  const hour = time.getHours() % 12 || 12;
  const minute = Math.floor(time.getMinutes() / 5) * 5;

  let timeString = "";
  if (minute === 0) {
    timeString = `${hours[hour - 1]} ${minutes[0]}`;
  } else if (minute <= 30) {
    timeString = `${minutes[minute / 5]} PAST ${hours[hour - 1]}`;
  } else {
    timeString = `${minutes[6 - minute / 5]} TO ${hours[hour % 12]}`;
  }

  return <div className="text-2xl font-bold">{timeString}</div>;
};

const RomanNumeralClock = ({ time }) => {
  const toRoman = (num) => {
    const romanNumerals = [
      { value: 50, numeral: "L" },
      { value: 40, numeral: "XL" },
      { value: 10, numeral: "X" },
      { value: 9, numeral: "IX" },
      { value: 5, numeral: "V" },
      { value: 4, numeral: "IV" },
      { value: 1, numeral: "I" },
    ];

    return romanNumerals.reduce((result, { value, numeral }) => {
      while (num >= value) {
        result += numeral;
        num -= value;
      }
      return result;
    }, "");
  };

  const hours = toRoman(time.getHours());
  const minutes = toRoman(time.getMinutes());
  const seconds = toRoman(time.getSeconds());

  return (
    <div className="text-2xl font-bold space-y-2">
      <div>Hours: {hours}</div>
      <div>Minutes: {minutes}</div>
      <div>Seconds: {seconds}</div>
    </div>
  );
};

const Clock = ({ model, time }) => {
  switch (model) {
    case "pointer":
      return <PointerClock time={time} />;
    case "digital":
      return <DigitalClock time={time} />;
    case "binary":
      return <BinaryClock time={time} />;
    case "word":
      return <WordClock time={time} />;
    case "roman":
      return <RomanNumeralClock time={time} />;
    default:
      return null;
  }
};

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedModel, setSelectedModel] = useState("pointer");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Multi-Layout Clock</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a clock model" />
            </SelectTrigger>
            <SelectContent>
              {clockModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-center">
            <Clock model={selectedModel} time={currentTime} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}