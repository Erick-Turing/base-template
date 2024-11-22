import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock API function (replace with actual API call)
const fetchWeatherData = async (city) => {
  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Mock data
  return {
    current: {
      temp: 22,
      condition: "Sunny",
      humidity: 60,
      windSpeed: 10,
    },
    forecast: [
      { day: "Mon", temp: 24, condition: "Sunny" },
      { day: "Tue", temp: 22, condition: "Partly Cloudy" },
      { day: "Wed", temp: 20, condition: "Cloudy" },
      { day: "Thu", temp: 19, condition: "Rainy" },
      { day: "Fri", temp: 21, condition: "Partly Cloudy" },
      { day: "Sat", temp: 23, condition: "Sunny" },
      { day: "Sun", temp: 25, condition: "Sunny" },
    ],
  };
};

const WeatherIcon = ({ condition }) => {
  const iconMap = {
    Sunny: "☀️",
    "Partly Cloudy": "⛅",
    Cloudy: "☁️",
    Rainy: "🌧️",
  };

  return <span className="text-4xl">{iconMap[condition] || "❓"}</span>;
};

const CurrentWeather = ({ data }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Current Weather</CardTitle>
    </CardHeader>
    <CardContent className="flex items-center justify-between">
      <div>
        <p className="text-3xl font-bold">{data.temp}°C</p>
        <p>{data.condition}</p>
      </div>
      <WeatherIcon condition={data.condition} />
      <div>
        <p>Humidity: {data.humidity}%</p>
        <p>Wind: {data.windSpeed} km/h</p>
      </div>
    </CardContent>
  </Card>
);

const ForecastDay = ({ day, temp, condition }) => (
  <Card className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/7 p-2">
    <CardContent className="flex flex-col items-center">
      <p className="font-bold">{day}</p>
      <WeatherIcon condition={condition} />
      <p>{temp}°C</p>
    </CardContent>
  </Card>
);

const Forecast = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>7-Day Forecast</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-wrap justify-between">
      {data.map((day, index) => (
        <ForecastDay key={index} {...day} />
      ))}
    </CardContent>
  </Card>
);

const WeatherWidget = () => {
  const [city, setCity] = useState("London");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(city);
      setWeatherData(data);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex mb-4">
        <Input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="mr-2"
        />
        <Button onClick={fetchWeather} disabled={loading}>
          {loading ? "Loading..." : "Get Weather"}
        </Button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {weatherData && (
        <>
          <CurrentWeather data={weatherData.current} />
          <Forecast data={weatherData.forecast} />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Weather Widget</h1>
      <WeatherWidget />
    </div>
  );
}