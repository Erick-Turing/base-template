import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const StockTicker = ({ symbol, price, change }) => (
  <div className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
    <span className="font-bold">{symbol}</span>
    <span>${price.toFixed(2)}</span>
    <Badge variant={change >= 0 ? "success" : "destructive"}>
      {change >= 0 ? "+" : ""}{change.toFixed(2)}%
    </Badge>
  </div>
);

const StockList = ({ stocks }) => (
  <div className="space-y-2">
    {stocks.map((stock) => (
      <StockTicker key={stock.symbol} {...stock} />
    ))}
  </div>
);

const Chart = ({ data }) => (
  <div className="h-40 flex items-end space-x-1">
    {data.map((value, index) => (
      <div
        key={index}
        className="bg-blue-500 w-4"
        style={{ height: `${value}%` }}
      ></div>
    ))}
  </div>
);

const ControlPanel = ({ updateInterval, setUpdateInterval, isRunning, setIsRunning }) => (
  <div className="space-y-4">
    <div className="flex items-center space-x-2">
      <span>Update Interval: {updateInterval}s</span>
      <Slider
        min={1}
        max={10}
        step={1}
        value={[updateInterval]}
        onValueChange={(value) => setUpdateInterval(value[0])}
      />
    </div>
    <div className="flex items-center space-x-2">
      <span>Auto-update:</span>
      <Switch checked={isRunning} onCheckedChange={setIsRunning} />
    </div>
  </div>
);

const generateRandomStocks = () => {
  const symbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "FB"];
  return symbols.map((symbol) => ({
    symbol,
    price: Math.random() * 1000 + 100,
    change: (Math.random() - 0.5) * 10,
  }));
};

const generateChartData = () => {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
};

export default function App() {
  const [stocks, setStocks] = useState(generateRandomStocks());
  const [chartData, setChartData] = useState(generateChartData());
  const [updateInterval, setUpdateInterval] = useState(5);
  const [isRunning, setIsRunning] = useState(true);

  const updateData = useCallback(() => {
    setStocks(generateRandomStocks());
    setChartData(generateChartData());
  }, []);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(updateData, updateInterval * 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, updateInterval, updateData]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Market Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <StockList stocks={stocks} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <ControlPanel
              updateInterval={updateInterval}
              setUpdateInterval={setUpdateInterval}
              isRunning={isRunning}
              setIsRunning={setIsRunning}
            />
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={updateData}>Update Now</Button>
        </div>
      </div>
    </div>
  );
}