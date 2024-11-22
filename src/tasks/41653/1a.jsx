import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MediaCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform ease-out duration-500" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, idx) => (
            <div key={idx} className="w-full flex-shrink-0">
              {item.type === 'image' ? 
                <img src={item.src} alt={item.alt} className="w-full h-64 object-cover sm:h-96" /> :
                <video src={item.src} controls className="w-full h-64 object-cover sm:h-96"></video>
              }
            </div>
          ))}
        </div>
      </div>
      <Button onClick={goToPrev} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white">
        &lt;
      </Button>
      <Button onClick={goToNext} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white">
        &gt;
      </Button>
      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {items.map((_, idx) => (
            <div 
              key={idx} 
              className={`transition-all w-3 h-3 bg-white rounded-full ${currentIndex === idx ? "p-2" : "opacity-50"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const mediaItems = [
    { type: 'image', src: '/path/to/image1.jpg', alt: 'Image 1' },
    { type: 'video', src: '/path/to/video1.mp4' },
    { type: 'image', src: '/path/to/image2.jpg', alt: 'Image 2' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Interactive Media Carousel</CardTitle>
        </CardHeader>
        <CardContent>
          <MediaCarousel items={mediaItems} />
        </CardContent>
      </Card>
    </div>
  );
}