import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Chart from "chart.js/auto";

const WordList = ({ words, sortOrder, onSortChange }) => (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        Word List
        <Select value={sortOrder} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="descending">Descending</SelectItem>
            <SelectItem value="ascending">Ascending</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
            <SelectItem value="reverseAlphabetical">Reverse Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {words.map(([word, count]) => (
          <li key={word} className="flex justify-between">
            <span>{word}</span>
            <span>{count}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const ChartComponent = ({ words }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = document.getElementById("wordChart");

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const filteredWords = words.filter(([_, count]) => count >= 2);

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: filteredWords.map(([word]) => word),
        datasets: [
          {
            label: "Word Occurrences",
            data: filteredWords.map(([_, count]) => count),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });

    // Limpar ao desmontar
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [words]);

  return <canvas id="wordChart" />;
};

export default function App() {
  const [text, setText] = useState("");
  const [ignoredWords, setIgnoredWords] = useState("");
  const [processedWords, setProcessedWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("descending");

  const processText = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const ignored = new Set(
      ignoredWords.split(/[,\s]+/).filter((word) => word.trim() !== "")
    );
    const words = text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.trim() !== "" && !ignored.has(word));

    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    const sortedWords = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProcessedWords(sortedWords);
    setIsLoading(false);
  };

  const sortWords = (order) => {
    let sorted;
    switch (order) {
      case "ascending":
        sorted = [...processedWords].sort((a, b) => a[1] - b[1]);
        break;
      case "alphabetical":
        sorted = [...processedWords].sort((a, b) => a[0].localeCompare(b[0]));
        break;
      case "reverseAlphabetical":
        sorted = [...processedWords].sort((a, b) => b[0].localeCompare(a[0]));
        break;
      default:
        sorted = [...processedWords].sort((a, b) => b[1] - a[1]);
    }
    setProcessedWords(sorted);
  };

  useEffect(() => {
    sortWords(sortOrder);
  }, [sortOrder]);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Text Processor</h1>
      <div className="space-y-4">
        <Textarea
          placeholder="Enter your text here"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
          className="w-full h-40"
        />
        <Input
          placeholder="Enter words to ignore (comma or space separated)"
          value={ignoredWords}
          onChange={(e) => setIgnoredWords(e.target.value)}
          disabled={isLoading}
        />
        <Button onClick={processText} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            "Process Text"
          )}
        </Button>
      </div>
      {processedWords.length > 0 && (
        <>
          <WordList
            words={processedWords}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Word Frequency Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartComponent words={processedWords} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}