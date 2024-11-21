import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Simulated D3.js chart component
const D3Chart = ({ data }) => {
  return (
    <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-semibold">D3.js Chart Placeholder</p>
        <p>Data: {JSON.stringify(data)}</p>
      </div>
    </div>
  );
};

// Simulated Chart.js component
const ChartJsChart = ({ data }) => {
  return (
    <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-semibold">Chart.js Chart Placeholder</p>
        <p>Data: {JSON.stringify(data)}</p>
      </div>
    </div>
  );
};

// Interactive animation component
const InteractiveAnimation = () => {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-32 bg-gray-100 relative overflow-hidden">
      <div
        className="w-8 h-8 bg-blue-500 rounded-full absolute top-1/2 transform -translate-y-1/2"
        style={{ left: `${position}%` }}
      ></div>
    </div>
  );
};

// Main article component
const App = () => {
  const [activeTab, setActiveTab] = useState("intro");

  const sampleData = [
    { x: 1, y: 10 },
    { x: 2, y: 15 },
    { x: 3, y: 8 },
    { x: 4, y: 12 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Understanding Complex Concepts through Data Visualization</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="intro">Introduction</TabsTrigger>
          <TabsTrigger value="d3">D3.js Example</TabsTrigger>
          <TabsTrigger value="chartjs">Chart.js Example</TabsTrigger>
          <TabsTrigger value="interactive">Interactive Example</TabsTrigger>
        </TabsList>

        <TabsContent value="intro">
          <Card>
            <CardHeader>
              <CardTitle>Introduction to Data Visualization</CardTitle>
              <CardDescription>Why visualization matters in understanding complex concepts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Data visualization is a powerful tool for simplifying complex information and making it more
                accessible. By representing data visually, we can quickly identify patterns, trends, and
                relationships that might be difficult to see in raw numbers or text.
              </p>
              <p>
                In this article, we'll explore different visualization techniques using popular JavaScript
                libraries and demonstrate how they can enhance comprehension of technical topics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="d3">
          <Card>
            <CardHeader>
              <CardTitle>D3.js Visualization</CardTitle>
              <CardDescription>Creating custom, interactive visualizations with D3.js</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                D3.js is a powerful library for creating custom, data-driven visualizations. It offers fine-grained
                control over the rendering process and supports a wide range of chart types.
              </p>
              <D3Chart data={sampleData} />
              <p className="mt-4">
                In this example, we've created a simple D3.js chart placeholder. In a real application, you would
                use D3.js methods to bind data to SVG elements and create interactive charts.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chartjs">
          <Card>
            <CardHeader>
              <CardTitle>Chart.js Visualization</CardTitle>
              <CardDescription>Creating responsive charts with Chart.js</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Chart.js is a simpler alternative to D3.js, offering a set of pre-built chart types that are easy
                to customize and responsive out of the box.
              </p>
              <ChartJsChart data={sampleData} />
              <p className="mt-4">
                This Chart.js placeholder demonstrates where you would typically render a chart. Chart.js provides
                a simple API for creating various chart types with minimal configuration.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactive">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Animation</CardTitle>
              <CardDescription>Enhancing understanding through interactivity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Interactive animations can help illustrate dynamic concepts and engage users more effectively than
                static visualizations.
              </p>
              <InteractiveAnimation />
              <p className="mt-4">
                This simple animation demonstrates how movement can be used to represent changing data or
                processes over time. Interactivity can be added to allow users to control the animation or explore
                data points.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Key Takeaways</h2>
        <ul className="list-disc pl-6">
          <li>Data visualization simplifies complex information and reveals patterns.</li>
          <li>Different libraries offer various approaches to creating visualizations.</li>
          <li>Interactivity enhances user engagement and understanding.</li>
          <li>Choosing the right visualization technique depends on the data and the story you want to tell.</li>
        </ul>
      </div>

      <div className="mt-8">
        <Button onClick={() => setActiveTab("intro")}>Start Over</Button>
      </div>
    </div>
  );
};

export default App;