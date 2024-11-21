import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

function DataVisualization({ data }) {
  return (
    <div className="w-full h-40 bg-slate-200 rounded-lg flex items-center justify-center">
      <span className="text-4xl font-bold text-slate-600">{data.value}</span>
    </div>
  );
}

function SettingsPanel({ settings, updateSettings }) {
  return (
    <div className="p-4 space-y-4">
      <Input 
        label="Update Interval (ms)" 
        type="number" 
        value={settings.interval} 
        onChange={(e) => updateSettings('interval', parseInt(e.target.value))} 
      />
      <div>
        <label className="block mb-2">Color Scheme</label>
        <select 
          className="w-full p-2 border border-gray-300 rounded"
          value={settings.colorScheme}
          onChange={(e) => updateSettings('colorScheme', e.target.value)}
        >
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="red">Red</option>
        </select>
      </div>
      <Slider 
        label="Data Range"
        max={1000}
        value={[settings.dataRange.min, settings.dataRange.max]}
        onValueChange={(value) => updateSettings('dataRange', {min: value[0], max: value[1]})}
      />
      <Switch 
        checked={settings.autoUpdate} 
        onCheckedChange={(checked) => updateSettings('autoUpdate', checked)}
        label="Auto Update"
      />
    </div>
  );
}

export default function App() {
  const [data, setData] = useState({ value: 0 });
  const [settings, setSettings] = useState({
    interval: 1000,
    colorScheme: 'blue',
    dataRange: { min: 0, max: 100 },
    autoUpdate: true,
  });

  useEffect(() => {
    let timer;
    if (settings.autoUpdate) {
      timer = setInterval(() => {
        setData({
          value: Math.floor(Math.random() * (settings.dataRange.max - settings.dataRange.min + 1)) + settings.dataRange.min
        });
      }, settings.interval);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [settings]);

  const updateSettings = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col sm:flex-row w-full max-w-5xl mx-auto p-4 space-y-4 sm:space-y-0 sm:space-x-4">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Real-Time Data Widget</CardTitle>
          <CardDescription>Visualize and control dynamic data.</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <DataVisualization data={data} />
        </CardContent>
        <CardFooter>
          <Button onClick={() => setData({ value: Math.floor(Math.random() * (settings.dataRange.max - settings.dataRange.min + 1)) + settings.dataRange.min })}>
            Refresh Data
          </Button>
        </CardFooter>
      </Card>

      <Card className="w-full sm:w-1/3">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsPanel settings={settings} updateSettings={updateSettings} />
        </CardContent>
      </Card>
    </div>
  );
}