import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data for demonstration
const articleData = {
  title: "Understanding Data Visualization",
  content: "Data visualization is the graphical representation of information and data. By using visual elements like charts, graphs, and maps, data visualization tools provide an accessible way to see and understand trends, outliers, and patterns in data.",
  stats: [
    { label: "Engagement", value: 75 },
    { label: "Readability", value: 85 },
    { label: "Retention", value: 65 },
  ]
};

function ChartComponent({ stats }) {
  const [chartType, setChartType] = useState('bar');

  // This would typically involve importing Chart.js and setting up a canvas
  // For this example, we'll simulate the chart with divs
  const ChartBar = ({ value, label }) => (
    <div className="mb-2">
      <div className="text-xs mb-1">{label}</div>
      <div className="h-4 bg-blue-500 rounded" style={{ width: `${value}%` }}></div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Button onClick={() => setChartType('bar')} variant={chartType === 'bar' ? 'default' : 'secondary'}>Bar</Button>
        <Button onClick={() => setChartType('pie')} variant={chartType === 'pie' ? 'default' : 'secondary'}>Pie</Button>
      </div>
      {chartType === 'bar' && stats.map((stat, idx) => <ChartBar key={idx} {...stat} />)}
      {/* Pie chart would be implemented here with similar logic */}
    </div>
  );
}

function TutorialContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Visualization with Chart.js</CardTitle>
        <CardDescription>Enhance your articles with interactive charts.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{articleData.content}</p>
        <h3 className="mt-4 font-bold">Why Use Data Visualization?</h3>
        <ul className="list-disc pl-5">
          <li>Improves comprehension of complex data.</li>
          <li>Engages readers more effectively.</li>
          <li>Helps in spotting trends and patterns quickly.</li>
        </ul>
        <h3 className="mt-4 font-bold">How to Integrate Chart.js</h3>
        <ol className="list-decimal pl-5">
          <li>Install Chart.js via npm or use a CDN.</li>
          <li>Create a canvas element in your HTML.</li>
          <li>Initialize a chart on this canvas with JavaScript.</li>
        </ol>
      </CardContent>
      <CardFooter>
        <ChartComponent stats={articleData.stats} />
      </CardFooter>
    </Card>
  );
}

export default function App() {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Interactive Data Visualization Tutorial</h1>
      <TutorialContent />
    </div>
  );
}