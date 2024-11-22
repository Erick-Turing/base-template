import React, { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const planets = [
  {
    name: "Mercury",
    size: 0.383,
    distance: 0.39,
    orbitalPeriod: 88,
    color: "bg-gray-400",
    atmosphere: "Thin, composed mainly of oxygen, sodium, hydrogen, helium and potassium",
    moons: 0,
    facts: "Mercury is the smallest planet in our solar system and the closest to the Sun."
  },
  {
    name: "Venus",
    size: 0.949,
    distance: 0.72,
    orbitalPeriod: 225,
    color: "bg-yellow-200",
    atmosphere: "Thick, composed mainly of carbon dioxide and nitrogen",
    moons: 0,
    facts: "Venus is the hottest planet in our solar system, even though Mercury is closer to the Sun."
  },
  {
    name: "Earth",
    size: 1,
    distance: 1,
    orbitalPeriod: 365,
    color: "bg-blue-500",
    atmosphere: "Nitrogen, oxygen, argon, and other gases",
    moons: 1,
    facts: "Earth is the only planet known to support life and has liquid water on its surface."
  },
  {
    name: "Mars",
    size: 0.532,
    distance: 1.52,
    orbitalPeriod: 687,
    color: "bg-red-500",
    atmosphere: "Thin, composed mainly of carbon dioxide, nitrogen, and argon",
    moons: 2,
    facts: "Mars is known as the Red Planet due to its reddish appearance."
  },
  {
    name: "Jupiter",
    size: 11.21,
    distance: 5.20,
    orbitalPeriod: 4333,
    color: "bg-orange-300",
    atmosphere: "Hydrogen, helium, methane, and ammonia",
    moons: 79,
    facts: "Jupiter is the largest planet in our solar system and has a Great Red Spot, a giant storm."
  },
  {
    name: "Saturn",
    size: 9.45,
    distance: 9.54,
    orbitalPeriod: 10759,
    color: "bg-yellow-600",
    atmosphere: "Hydrogen, helium, and traces of other elements",
    moons: 82,
    facts: "Saturn is known for its prominent ring system, composed mainly of ice particles and rock debris."
  },
  {
    name: "Uranus",
    size: 4.01,
    distance: 19.19,
    orbitalPeriod: 30687,
    color: "bg-blue-300",
    atmosphere: "Hydrogen, helium, and methane",
    moons: 27,
    facts: "Uranus rotates on its side, causing extreme seasonal variations."
  },
  {
    name: "Neptune",
    size: 3.88,
    distance: 30.07,
    orbitalPeriod: 60190,
    color: "bg-blue-700",
    atmosphere: "Hydrogen, helium, and methane",
    moons: 14,
    facts: "Neptune has the strongest winds in the solar system, reaching speeds of 2,100 km/h."
  }
];

function Planet({ planet, onClick, orbitRadius, angle }) {
  const size = `${planet.size * 5 + 5}px`;
  const left = `calc(50% + ${orbitRadius * Math.cos(angle)}px - ${size} / 2)`;
  const top = `calc(50% + ${orbitRadius * Math.sin(angle)}px - ${size} / 2)`;

  return (
    <div
      className={`absolute rounded-full ${planet.color} cursor-pointer`}
      style={{ width: size, height: size, left, top }}
      onClick={() => onClick(planet)}
    />
  );
}

function PlanetInfo({ planet }) {
  if (!planet) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{planet.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Size: {planet.size} Earth radii</p>
        <p>Distance from Sun: {planet.distance} AU</p>
        <p>Orbital Period: {planet.orbitalPeriod} Earth days</p>
        <p>Atmosphere: {planet.atmosphere}</p>
        <p>Number of Moons: {planet.moons}</p>
        <p>Interesting Fact: {planet.facts}</p>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [angles, setAngles] = useState(planets.map(() => 0));
  const animationRef = useRef();

  useEffect(() => {
    const animate = () => {
      setAngles((prevAngles) =>
        prevAngles.map((angle, index) => {
          const orbitalPeriod = planets[index].orbitalPeriod;
          return (angle + (speed * 2 * Math.PI) / (orbitalPeriod * 60)) % (2 * Math.PI);
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [speed]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Solar System Visualization</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-900 rounded-lg overflow-hidden">
          <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-yellow-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          {planets.map((planet, index) => (
            <Planet
              key={planet.name}
              planet={planet}
              onClick={setSelectedPlanet}
              orbitRadius={(index + 1) * 25}
              angle={angles[index]}
            />
          ))}
        </div>
        <div>
          <Accordion type="single" collapsible>
            {planets.map((planet) => (
              <AccordionItem key={planet.name} value={planet.name}>
                <AccordionTrigger>{planet.name}</AccordionTrigger>
                <AccordionContent>
                  <p>Size: {planet.size} Earth radii</p>
                  <p>Distance from Sun: {planet.distance} AU</p>
                  <p>Orbital Period: {planet.orbitalPeriod} Earth days</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      <div className="mt-4">
        <label className="block mb-2">Orbit Speed:</label>
        <Slider
          min={0.1}
          max={10}
          step={0.1}
          value={[speed]}
          onValueChange={([value]) => setSpeed(value)}
        />
      </div>
      <PlanetInfo planet={selectedPlanet} />
    </div>
  );
}