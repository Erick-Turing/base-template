import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Chart from 'chart.js/auto';

// Utility function to generate random data for demonstration
function generateRandomData(labels, min, max) {
  return {
    labels,
    datasets: [{
      label: 'Sample Data',
      data: labels.map(() => Math.random() * (max - min) + min),
      backgroundColor: 'rgba(75,192,192,0.2)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 1,
    }]
  };
}

// Chart component
function DataChart({ type, data }) {
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    if (chartRef.current) {
      new Chart(chartRef.current, {
        type: type,
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: { display: type !== 'pie' },
          },
        },
      });
    }
  }, [type, data]);

  return <canvas ref={chartRef} />;
}

// Main App component
export default function App() {
  const [activeTab, setActiveTab] = useState('line');
  const dataTypes = ['line', 'bar', 'pie'];
  const sampleLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
  const chartData = generateRandomData(sampleLabels, 10, 100);

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Understanding Data Through Visualization</CardTitle>
          <CardDescription>Explore how different charts can help in understanding data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="line" className="w-full">
            <TabsList>
              {dataTypes.map(type => (
                <TabsTrigger key={type} value={type} onClick={() => setActiveTab(type)}>
                  {type.charAt(0).toUpperCase() + type.slice(1)} Chart
                </TabsTrigger>
              ))}
            </TabsList>
            {dataTypes.map(type => (
              <TabsContent key={type} value={type}>
                <DataChart type={type} data={chartData} />
                <p className="mt-4 text-sm">
                  {`The ${type} chart is excellent for ${type === 'line' ? 'showing trends over time' : type === 'bar' ? 'comparing categories' : 'displaying parts of a whole'}.`}
                </p>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Regenerate Data</Button>
        </CardFooter>
      </Card>
    </div>
  );
}