import React from "react";
import { Check, X } from "lucide-react";

// Importing Shadcn components
import { Card } from "@/components/ui/card";

const StepIcon = ({ completed }) => {
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
      {completed ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-5 h-5 text-red-500" />
      )}
    </div>
  );
};

const StepLabel = ({ label }) => {
  return <div className="text-sm font-medium mb-2">{label}</div>;
};

const StepConnector = ({ orientation }) => {
  return (
    <div
      className={`bg-gray-300 ${
        orientation === "vertical"
          ? "w-0.5 h-full mx-auto"
          : "h-0.5 w-full my-auto"
      }`}
    />
  );
};

const Step = ({ label, completed, isLast, orientation }) => {
  return (
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
};

const Stepper = ({ currentStep, steps }) => {
  const [orientation, setOrientation] = React.useState("horizontal");

  React.useEffect(() => {
    const handleResize = () => {
      setOrientation(window.innerWidth < 640 ? "vertical" : "horizontal");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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