import React, { useEffect, useState, useCallback, memo } from "react";
import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";

// Step icon with dynamic styles for completion
const StepIcon = memo(({ completed }) => (
  <div
    className={`flex items-center justify-center w-8 h-8 rounded-full ${
      completed ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
    }`}
    aria-hidden="true"
  >
    {completed ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
  </div>
));

// Step label
const StepLabel = memo(({ label }) => (
  <div className="text-sm font-medium mb-2 text-center">{label}</div>
));

// Connector line between steps
const StepConnector = memo(({ orientation }) => (
  <div
    className={`bg-gray-300 ${
      orientation === "vertical" ? "w-0.5 h-full mx-auto" : "h-0.5 w-full my-auto"
    }`}
    aria-hidden="true"
  />
));

// Individual step
const Step = ({ label, completed, isLast, orientation }) => (
  <div
    className={`flex ${
      orientation === "vertical" ? "flex-col items-center" : "flex-row items-start"
    }`}
  >
    <div className="flex flex-col items-center">
      <StepLabel label={label} />
      <StepIcon completed={completed} />
    </div>
    {!isLast && (
      <div
        className={`flex-grow ${
          orientation === "vertical" ? "h-8" : "w-16 mx-2"
        }`}
      >
        <StepConnector orientation={orientation} />
      </div>
    )}
  </div>
);

// Main Stepper component
const Stepper = ({ currentStep, steps }) => {
  const [orientation, setOrientation] = useState("horizontal");

  // Determine orientation based on window size
  const handleResize = useCallback(() => {
    setOrientation(window.innerWidth < 640 ? "vertical" : "horizontal");
  }, []);

  useEffect(() => {
    handleResize();
    const resizeListener = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, [handleResize]);

  return (
    <Card className="p-6">
      <div
        className={`flex ${
          orientation === "vertical" ? "flex-col space-y-4" : "flex-row space-x-4"
        }`}
      >
        {steps.map((step, index) => (
          <Step
            key={index}
            label={step}
            completed={index < currentStep}
            isLast={index === steps.length - 1}
            orientation={orientation}
          />
        ))}
      </div>
    </Card>
  );
};

// Main application
export default function App() {
  const steps = [
    "Step 1: Plan",
    "Step 2: Design",
    "Step 3: Develop",
    "Step 4: Test",
    "Step 5: Deploy",
  ];
  const currentStep = 3;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Stepper currentStep={currentStep} steps={steps} />
      </div>
    </div>
  );
}
