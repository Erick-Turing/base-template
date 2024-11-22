import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

// Sample media data (replace with your actual data)
const mediaData = [
  { type: "image", src: "https://picsum.photos/800/400?random=1", alt: "Random Image 1" },
  { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4", alt: "Sample Video" },
  { type: "image", src: "https://picsum.photos/800/400?random=2", alt: "Random Image 2" },
  { type: "image", src: "https://picsum.photos/800/400?random=3", alt: "Random Image 3" },
];

const MediaCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaData.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + mediaData.length) % mediaData.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaData.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden">
      <CardContent className="p-0 relative">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {mediaData.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-64 object-cover sm:h-80"
                  loading="lazy"
                />
              ) : (
                <video
                  src={item.src}
                  className="w-full h-64 object-cover sm:h-80"
                  controls
                  preload="none"
                />
              )}
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {mediaData.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </CardContent>
      <div className="flex justify-between items-center p-4">
        <Button variant="outline" size="icon" onClick={handlePrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={togglePlayPause}>
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button variant="outline" size="icon" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

const ThumbnailGallery = ({ mediaData, currentIndex, setCurrentIndex }) => {
  return (
    <div className="flex overflow-x-auto space-x-2 p-4">
      {mediaData.map((item, index) => (
        <button
          key={index}
          onClick={() => setCurrentIndex(index)}
          className={`flex-shrink-0 w-16 h-16 focus:outline-none ${
            index === currentIndex ? "ring-2 ring-blue-500" : ""
          }`}
        >
          {item.type === "image" ? (
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <video
              src={item.src}
              className="w-full h-full object-cover"
              preload="metadata"
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Interactive Media Carousel</h1>
      <MediaCarousel />
      <ThumbnailGallery
        mediaData={mediaData}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
}
