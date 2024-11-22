import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Simulating Chart.js import (not actually available in this environment)
const Chart = ({ type, data, options }) => (
  <div className="bg-gray-200 p-4 rounded-md">
    [Chart.js {type} chart would render here with provided data and options]
  </div>
);

const TutorialSection = ({ title, content }) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-700">{content}</p>
  </div>
);

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
    <code>{code}</code>
  </pre>
);

const ChartExample = ({ type, data, options }) => (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle>{type} Chart Example</CardTitle>
    </CardHeader>
    <CardContent>
      <Chart type={type} data={data} options={options} />
    </CardContent>
  </Card>
);

export default function App() {
  const [activeTab, setActiveTab] = useState("introduction");

  const tutorialContent = {
    introduction: (
      <>
        <TutorialSection
          title="Introduction to Data Visualization in Articles"
          content="Data visualization is a powerful tool for enhancing the understanding of complex information in articles or written content. By representing data visually, we can make patterns, trends, and relationships more apparent and easier to grasp."
        />
        <TutorialSection
          title="Why Use Chart.js?"
          content="Chart.js is a popular JavaScript library for creating responsive and interactive charts. It's easy to use, customizable, and works well with modern web frameworks like React."
        />
      </>
    ),
    setup: (
      <>
        <TutorialSection
          title="Setting Up Chart.js in a React Project"
          content="To get started with Chart.js in a React project, first install the necessary packages:"
        />
        <CodeBlock code="npm install chart.js react-chartjs-2" />
        <TutorialSection
          title="Basic Chart.js Integration"
          content="Here's a basic example of how to create a line chart using Chart.js in a React component:"
        />
        <CodeBlock
          code={`
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Monthly Sales',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return <Line data={data} />;
};
`}
        />
      </>
    ),
    techniques: (
      <>
        <TutorialSection
          title="Data Visualization Techniques"
          content="Here are some effective techniques for using data visualization in articles:"
        />
        <ul className="list-disc pl-6 mb-4">
          <li>Use appropriate chart types for your data</li>
          <li>Keep visualizations simple and focused</li>
          <li>Use color effectively to highlight important information</li>
          <li>Provide context and explanations for your visualizations</li>
          <li>Make your charts interactive when possible</li>
        </ul>
        <TutorialSection
          title="Choosing the Right Chart Type"
          content="Different types of data are best represented by different chart types. Here are some common chart types and when to use them:"
        />
        <ul className="list-disc pl-6 mb-4">
          <li>Line charts: For showing trends over time</li>
          <li>Bar charts: For comparing quantities across categories</li>
          <li>Pie charts: For showing composition or proportions</li>
          <li>Scatter plots: For showing relationships between two variables</li>
        </ul>
      </>
    ),
    examples: (
      <>
        <TutorialSection
          title="Example: Visualizing Article Engagement"
          content="Let's create a bar chart to visualize engagement metrics for different articles on a blog."
        />
        <ChartExample
          type="Bar"
          data={{
            labels: ["Article 1", "Article 2", "Article 3", "Article 4", "Article 5"],
            datasets: [
              {
                label: "Views",
                data: [1500, 2300, 1800, 3000, 2100],
              },
              {
                label: "Comments",
                data: [50, 80, 40, 100, 60],
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
        <TutorialSection
          title="Example: Trending Topics Over Time"
          content="Here's a line chart showing the popularity of different topics in articles over time."
        />
        <ChartExample
          type="Line"
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "Technology",
                data: [65, 59, 80, 81, 56, 55],
              },
              {
                label: "Science",
                data: [28, 48, 40, 19, 86, 27],
              },
              {
                label: "Politics",
                data: [45, 25, 16, 36, 67, 18],
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
                text: "Topic Trends",
              },
            },
          }}
        />
      </>
    ),
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">
        Data Visualization Tutorial: Enhancing Articles with Chart.js
      </h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="introduction">Intro</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="techniques">Techniques</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[60vh] mt-4">
          <TabsContent value={activeTab}>{tutorialContent[activeTab]}</TabsContent>
        </ScrollArea>
      </Tabs>
      <div className="mt-6 flex justify-between">
        <Button
          onClick={() => {
            const tabs = Object.keys(tutorialContent);
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex > 0) {
              setActiveTab(tabs[currentIndex - 1]);
            }
          }}
          disabled={activeTab === "introduction"}
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            const tabs = Object.keys(tutorialContent);
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex < tabs.length - 1) {
              setActiveTab(tabs[currentIndex + 1]);
            }
          }}
          disabled={activeTab === "examples"}
        >
          Next
        </Button>
      </div>
    </div>
  );
}