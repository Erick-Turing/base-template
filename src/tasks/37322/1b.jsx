import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const planets = [
  { name: 'Mercury', size: 4880, distance: 57.9, orbit: 88, moons: 0, atmosphere: 'Thin, mostly helium', fact: 'Mercury is the smallest planet in our solar system.' },
  { name: 'Venus', size: 12104, distance: 108.2, orbit: 224.7, moons: 0, atmosphere: 'Thick, toxic atmosphere mostly carbon dioxide', fact: 'Venus rotates in the opposite direction to most planets.' },
  { name: 'Earth', size: 12742, distance: 149.6, orbit: 365.25, moons: 1, atmosphere: '78% nitrogen, 21% oxygen', fact: 'Earth is the only known planet with life.' },
  { name: 'Mars', size: 6779, distance: 227.9, orbit: 687, moons: 2, atmosphere: 'Thin, mostly carbon dioxide', fact: 'Mars has the largest volcano in the solar system, Olympus Mons.' },
  { name: 'Jupiter', size: 139822, distance: 778.5, orbit: 4331, moons: 79, atmosphere: 'Mostly hydrogen and helium', fact: 'Jupiter has a Great Red Spot, a storm that has been ongoing for at least 300 years.' },
  { name: 'Saturn', size: 116460, distance: 1433.5, orbit: 10747, moons: 82, atmosphere: 'Hydrogen and helium', fact: 'Famous for its ring system, which is made of ice and rock.' },
  { name: 'Uranus', size: 50724, distance: 2872.5, orbit: 30589, moons: 27, atmosphere: 'Hydrogen, helium, methane', fact: 'Uranus rotates on its side, possibly due to a collision.' },
  { name: 'Neptune', size: 49244, distance: 4495.1, orbit: 59800, moons: 14, atmosphere: 'Hydrogen, helium, methane', fact: 'Neptune has the strongest winds in the solar system.' },
];

function SolarSystem() {
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => (t + speed) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [speed]);

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Solar System Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-64 sm:h-96">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg" />
            </div>
            {planets.map((planet, index) => (
              <div 
                key={planet.name}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `rotate(${time * (360 / planet.orbit)}deg)`,
                  transformOrigin: 'center'
                }}
              >
                <div 
                  className="w-2 h-2 sm:w-4 sm:h-4 bg-blue-500 rounded-full" 
                  style={{ 
                    left: `${planet.distance / 10}px`, 
                    width: `${planet.size / 5000}rem`, 
                    height: `${planet.size / 5000}rem`
                  }}
                  onClick={() => setSelectedPlanet(planet)}
                />
              </div>
            ))}
          </div>
          <Slider defaultValue={[1]} max={10} step={1} onValueChange={setSpeed} className="mt-4" />
        </CardContent>
      </Card>

      <Accordion type="single" collapsible>
        {planets.map(planet => (
          <AccordionItem value={planet.name} key={planet.name}>
            <AccordionTrigger>{planet.name}</AccordionTrigger>
            <AccordionContent>
              <p>Size: {planet.size} km</p>
              <p>Distance from Sun: {planet.distance} million km</p>
              <p>Orbital Period: {planet.orbit} Earth days</p>
              <p>Moons: {planet.moons}</p>
              <p>Atmosphere: {planet.atmosphere}</p>
              <p>Fun Fact: {planet.fact}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {selectedPlanet && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedPlanet.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{selectedPlanet.fact}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setSelectedPlanet(null)}>Close</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <SolarSystem />
    </div>
  );
}