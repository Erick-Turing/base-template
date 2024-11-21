import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

function Widget({ initialValue = 50, title = "Dynamic Widget" }) {
  const [value, setValue] = useState(initialValue);
  const [color, setColor] = useState('bg-blue-500');

  useEffect(() => {
    // Change color based on the slider value for visual feedback
    if (value < 30) setColor('bg-red-500');
    else if (value < 70) setColor('bg-yellow-500');
    else setColor('bg-green-500');
  }, [value]);

  return (
    <Card className="w-full sm:w-1/2 mx-auto mt-8">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-48">
          <div 
            className={cn("rounded-full w-32 h-32 flex items-center justify-center text-white text-2xl font-bold transition-all duration-300", color)} 
            style={{ transform: `scale(${1 + value / 100})` }}
          >
            {value}%
          </div>
        </div>
        <Slider 
          defaultValue={[value]} 
          max={100} 
          step={1}
          onValueChange={(val) => setValue(val[0])}
          className="mt-6"
        />
      </CardContent>
    </Card>
  );
}

function ColorSwitcher() {
  const [currentColor, setCurrentColor] = useState('blue');
  const colors = ['blue', 'red', 'green', 'yellow', 'purple'];

  return (
    <div className="mt-4 text-center">
      <div>Choose widget color:</div>
      <div className="flex justify-center mt-2">
        {colors.map(color => (
          <Button 
            key={color} 
            variant={currentColor === color ? 'default' : 'outline'}
            onClick={() => setCurrentColor(color)}
            className={`mx-1 ${color === currentColor ? `bg-${color}-500 text-white` : ''}`}
          >
            {color}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-2xl text-center font-bold mb-4">Interactive Widget App</h1>
      <Widget title="System Load" />
      <Widget initialValue={75} title="Battery Level" />
      <ColorSwitcher />
    </div>
  );
}