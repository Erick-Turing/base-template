import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_KEY = "f9d2a8ea-a8bf-11ef-8d8d-0242ac130003-f9d2a98a-a8bf-11ef-8d8d-0242ac130003"; // Replace with your OpenWeatherMap key
const API_URL = "https://api.stormglass.io/v2/weather/point";

const fetchWeatherData = async (lat, lng) => {
  const response = await fetch(
    `${API_URL}?lat=${lat}&lng=${lng}&params=airTemperature,cloudCover,humidity,windSpeed&source=sg`,
    {
      headers: {
        Authorization: API_KEY,
      },
    }
  );

  const data = await response.json();

  // Current data (first hour of API return)
  const current = {
    temp: Math.round(data.hours[0].airTemperature.sg), // Current temperature
    humidity: data.hours[0].humidity.sg,
    windSpeed: Math.round(data.hours[0].windSpeed.sg),
    cloudCover: data.hours[0].cloudCover.sg, // Cloud cover
  };

  // Simple forecast (next 7 days)
  const forecast = data.hours
    .filter((_, index) => index % 24 === 0) // Every 24 hours
    .slice(0, 7) // 7 days
    .map((hour) => ({
      day: new Date(hour.time).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      temp: Math.round(hour.airTemperature.sg),
      cloudCover: hour.cloudCover.sg,
    }));

  return { current, forecast };
};

const CurrentWeather = ({ data }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Current Weather</CardTitle>
    </CardHeader>
    <CardContent className="flex items-center justify-between">
      <div>
        <p className="text-3xl font-bold">{data.temp}°C</p>
        <p>Cloud Cover: {data.cloudCover}%</p>
      </div>
      <div>
        <p>Humidity: {data.humidity}%</p>
        <p>Wind: {data.windSpeed} km/h</p>
      </div>
    </CardContent>
  </Card>
);

const ForecastDay = ({ day, temp, cloudCover }) => (
  <Card className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/7 p-2">
    <CardContent className="flex flex-col items-center">
      <p className="font-bold">{day}</p>
      <p className="text-3xl font-bold">{temp}°C</p>
      <p>Clouds: {cloudCover}%</p>
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
      // Coordinates for London (add more cities as needed)
      const coordinates = {
        London: { lat: 51.5074, lng: -0.1278 },
        // Add other cities here if needed.
      };

      const { lat, lng } = coordinates[city] || coordinates["London"];
      const data = await fetchWeatherData(lat, lng);
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
