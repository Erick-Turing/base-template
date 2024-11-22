import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { Loader } from "@/components/ui/loader"; // Error

const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your API key

function WeatherCard({ weatherData }) {
  // if (!weatherData) return <Loader className="h-4 w-4" />; // Error

  return (
    <Card className="w-full max-w-sm mx-auto sm:max-w-lg">
      <CardHeader>
        <CardTitle>{weatherData.name}</CardTitle>
        <CardDescription>{new Date(weatherData.dt * 1000).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="weather icon" />
          <p className="text-4xl">{Math.round(weatherData.main.temp)}°C</p>
        </div>
        <p>{weatherData.weather[0].description}</p>
      </CardContent>
      <CardFooter>
        <p>Humidity: {weatherData.main.humidity}%</p>
        <p>Wind: {weatherData.wind.speed} m/s</p>
      </CardFooter>
    </Card>
  );
}

function ForecastCard({ day }) {
  return (
    <Card className="mb-2 sm:mb-0 sm:mr-2 last:mr-0">
      <CardHeader>
        <CardTitle>{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="weather icon" />
        <p>{Math.round(day.temp.day)}°C</p>
      </CardContent>
    </Card>
  );
}

function WeatherApp() {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [weatherResponse, forecastResponse] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`),
          fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`)
        ]);

        if (!weatherResponse.ok || !forecastResponse.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();
        setWeather(weatherData);
        setForecast(forecastData.list.filter(item => item.dt_txt.includes('12:00:00')));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city]);

  const handleSearch = () => {
    if (city.trim()) {
      setError(null);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
        <Input 
          placeholder="Enter city name" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      {weather && !loading && (
        <div className="space-y-4">
          <WeatherCard weatherData={weather} />
          <div className="flex overflow-x-auto">
            {forecast && forecast.map((day, index) => <ForecastCard key={index} day={day} />)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <WeatherApp />
    </div>
  );
}