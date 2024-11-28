import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function WordCounter() {
  const [text, setText] = useState('');
  const [ignoreWords, setIgnoreWords] = useState('');
  const [wordCount, setWordCount] = useState({});
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState('desc');
  const [chartData, setChartData] = useState(null);

  const processText = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Delay start

    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const ignoreList = ignoreWords.toLowerCase().replace(/, /g, ',').split(/[ ,]+/);
    let counts = words.reduce((acc, word) => {
      if (!ignoreList.includes(word)) {
        acc[word] = (acc[word] || 0) + 1;
      }
      return acc;
    }, {});

    // Filter words with less than 2 occurrences for charting
    const chartCounts = Object.fromEntries(
      Object.entries(counts).filter(([_, count]) => count >= 2)
    );

    setWordCount(counts);
    setChartData({
      labels: Object.keys(chartCounts),
      datasets: [{
        data: Object.values(chartCounts),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ]
      }]
    });

    await new Promise(resolve => setTimeout(resolve, 1000)); // Delay end
    setLoading(false);
  };

  const sortWords = (type) => {
    const sortedKeys = Object.keys(wordCount).sort((a, b) => {
      switch(type) {
        case 'desc': return wordCount[b] - wordCount[a];
        case 'asc': return wordCount[a] - wordCount[b];
        case 'alpha': return a.localeCompare(b);
        case 'reverse-alpha': return b.localeCompare(a);
        default: return 0;
      }
    });
    const sortedWordCount = Object.fromEntries(
      sortedKeys.map(key => [key, wordCount[key]])
    );
    setWordCount(sortedWordCount);
    setSortType(type);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Text Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Enter text here..." 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            disabled={loading}
            className="mb-4 h-40"
          />
          <Input 
            placeholder="Words to ignore (comma or space separated)" 
            value={ignoreWords} 
            onChange={(e) => setIgnoreWords(e.target.value)} 
            disabled={loading}
          />
          <Button onClick={processText} disabled={loading} className="mt-4">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Analyze Text"}
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center">Processing...</div>
      ) : (
        <>
          <div className="flex justify-center space-x-2">
            <Button onClick={() => sortWords('desc')}>Sort Desc</Button>
            <Button onClick={() => sortWords('asc')}>Sort Asc</Button>
            <Button onClick={() => sortWords('alpha')}>Sort A-Z</Button>
            <Button onClick={() => sortWords('reverse-alpha')}>Sort Z-A</Button>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {Object.entries(wordCount).map(([word, count]) => (
              <li key={word}>{word}: {count}</li>
            ))}
          </ul>
          {chartData && <Pie data={chartData} />}
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start sm:py-12">
      <WordCounter />
    </div>
  );
}