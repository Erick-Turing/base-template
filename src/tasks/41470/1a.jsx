import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip } from "@/components/ui/tooltip";
import { CheckCircleIcon, InformationCircleIcon } from "@radix-ui/react-icons";

const steps = [
  { id: 1, title: "Account Setup", description: "Create your account to get started." },
  { id: 2, title: "Explore Features", description: "Learn about the key features of our platform." },
  { id: 3, title: "Complete Profile", description: "Finish setting up your user profile." },
  { id: 4, title: "Confirmation", description: "Confirm your setup to enjoy full access." }
];

const OnboardingStep = ({ step, isActive, isCompleted, onNext }) => {
  return (
    <Card className="mb-4 last:mb-0">
      <CardHeader>
        <CardTitle>{step.title}</CardTitle>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isActive && <Button onClick={onNext}>Next Step</Button>}
        {isCompleted && <CheckCircleIcon className="text-green-500 ml-2" />}
      </CardContent>
      <CardFooter>
        {isActive && <Tooltip content="Click to proceed" className="ml-auto">
          <InformationCircleIcon className="text-blue-500 cursor-pointer" />
        </Tooltip>}
      </CardFooter>
    </Card>
  );
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome to Your Onboarding Journey</h1>
        <Progress value={progressPercentage} className="mb-6" />
        {steps.map((step, index) => (
          <OnboardingStep 
            key={step.id} 
            step={step} 
            isActive={index === currentStep}
            isCompleted={index < currentStep}
            onNext={handleNext}
          />
        ))}
        {currentStep === steps.length - 1 && (
          <div className="text-center mt-6">
            <h2 className="text-xl font-semibold">You're All Set!</h2>
            <p className="text-gray-600">Thank you for completing the onboarding process.</p>
            <Button className="mt-4">Explore Dashboard</Button>
          </div>
        )}
      </div>
    </div>
  );
}