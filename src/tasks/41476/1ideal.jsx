import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const generateRandomData = () => {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 100));
};

const Chart = ({ data, showLines }) => {
  const max = Math.max(...data) || 1;

  return (
    <div className="relative h-64 w-full grid grid-cols-12 gap-2 border-t border-gray-200">
      {data.map((value, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className="w-full bg-blue-500 rounded-t transition-all duration-300"
            style={{
              height: `${(value / max) * 100}%`,
            }}
          ></div>
          <span className="text-xs mt-1">{index + 1}</span>
        </div>
      ))}
      {showLines &&
        Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute left-0 w-full h-px bg-gray-300"
            style={{
              bottom: `${(i + 1) * 20}%`,
            }}
          ></div>
        ))}
    </div>
  );
};

const DataTable = ({ data }) => (
  <div className="mt-4 overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th className="px-2 py-1">Month</th>
          <th className="px-2 py-1">Value</th>
        </tr>
      </thead>
      <tbody>
        {data.map((value, index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
            <td className="px-2 py-1">{index + 1}</td>
            <td className="px-2 py-1">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Settings = ({ updateInterval, setUpdateInterval, showLines, setShowLines }) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="update-interval">Update Interval (seconds)</Label>
      <Slider
        id="update-interval"
        min={1}
        max={10}
        step={1}
        value={[updateInterval]}
        onValueChange={(value) => setUpdateInterval(value[0])}
      />
      <span className="text-sm">{updateInterval} seconds</span>
    </div>
    <div className="flex items-center space-x-2">
      <Switch
        id="show-lines"
        checked={showLines}
        onCheckedChange={setShowLines}
      />
      <Label htmlFor="show-lines">Show Grid Lines</Label>
    </div>
  </div>
);

export default function App() {
  const [data, setData] = useState(generateRandomData());
  const [updateInterval, setUpdateInterval] = useState(5);
  const [showLines, setShowLines] = useState(true);
  const [isUpdating, setIsUpdating] = useState(true);

  useEffect(() => {
    let intervalId;
    if (isUpdating) {
      intervalId = setInterval(() => {
        setData(generateRandomData());
      }, updateInterval * 1000);
    }
    return () => clearInterval(intervalId);
  }, [updateInterval, isUpdating]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Real-Time Data Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart data={data} showLines={showLines} />
          <div className="mt-4 flex justify-between items-center">
            <Button
              onClick={() => setIsUpdating(!isUpdating)}
              variant={isUpdating ? "destructive" : "default"}
            >
              {isUpdating ? "Stop Updates" : "Start Updates"}
            </Button>
            <Button onClick={() => setData(generateRandomData())}>
              Generate New Data
            </Button>
          </div>
          <DataTable data={data} />
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <Settings
              updateInterval={updateInterval}
              setUpdateInterval={setUpdateInterval}
              showLines={showLines}
              setShowLines={setShowLines}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}