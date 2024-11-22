import React, { useEffect, useRef, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// Reusable Chart Component
const ChartComponent = ({ type, data, options }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy any existing chart instance before creating a new one
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create a new chart instance
      chartInstance.current = new ChartJS(chartRef.current, {
        type,
        data,
        options,
      });
    }

    // Cleanup on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, options]);

  return <canvas ref={chartRef} />;
};

// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState("introduction"); // State for active tab

  // Tutorial content for each tab
  const tutorialContent = {
    introduction: (
      <div>
        <h3 className="text-xl font-semibold mb-2">Introduction to Data Visualization</h3>
        <p className="text-gray-700">
          Data visualization is essential for simplifying complex data. Using Chart.js, you can create interactive and visually
          appealing charts directly in your React applications.
        </p>
      </div>
    ),
    examples: (
      <div>
        <h3 className="text-xl font-semibold mb-4">Chart Examples</h3>

        {/* Example Bar Chart */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Bar Chart Example</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent
              type="bar"
              data={{
                labels: ["Article 1", "Article 2", "Article 3", "Article 4", "Article 5"],
                datasets: [
                  {
                    label: "Views",
                    data: [1500, 2300, 1800, 3000, 2100],
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                  },
                  {
                    label: "Comments",
                    data: [50, 80, 40, 100, 60],
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Article Engagement Metrics",
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Example Line Chart */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Line Chart Example</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent
              type="line"
              data={{
                labels: ["January", "February", "March", "April", "May", "June"],
                datasets: [
                  {
                    label: "Technology",
                    data: [65, 59, 80, 81, 56, 55],
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    tension: 0.4,
                  },
                  {
                    label: "Science",
                    data: [28, 48, 40, 19, 86, 27],
                    borderColor: "rgba(153, 102, 255, 1)",
                    backgroundColor: "rgba(153, 102, 255, 0.2)",
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Trends Over Time",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
    ),
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Data Visualization Tutorial: Chart.js in React</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="introduction">Introduction</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[60vh] mt-4">
          <TabsContent value={activeTab}>{tutorialContent[activeTab]}</TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
