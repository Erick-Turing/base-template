import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const steps = [
  {
    title: "Welcome",
    description: "Let's get you started with your new account!",
    content: "Welcome to our platform! We're excited to have you on board.",
  },
  {
    title: "Account Setup",
    description: "Set up your basic account information",
    content: "Please enter your name, email, and choose a strong password.",
  },
  {
    title: "Feature Tutorial",
    description: "Learn about our key features",
    content: "Discover how to use our main features to boost your productivity.",
  },
  {
    title: "Completion",
    description: "You're all set!",
    content: "Congratulations! Your account is now fully set up.",
  },
];

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center space-x-2 mb-4">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full ${
            index < currentStep ? "bg-blue-500" : "bg-gray-300"
          } transition-all duration-300 ease-in-out`}
        ></div>
      ))}
    </div>
  );
};

const StepContent = ({ step, onNext, isLastStep }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{step.title}</CardTitle>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{step.content}</p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onNext}>{isLastStep ? "Finish" : "Next"}</Button>
      </CardFooter>
    </Card>
  );
};

const OnboardingWidget = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress((currentStep / (steps.length - 1)) * 100);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Account Onboarding</h1>
      <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
      <Progress value={progress} className="mb-6" />
      <StepContent
        step={steps[currentStep]}
        onNext={handleNext}
        isLastStep={currentStep === steps.length - 1}
      />
    </div>
  );
};

const Tip = ({ children, content }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help underline decoration-dotted">{children}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-4xl p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to Our Platform</h1>
        <p className="text-center mb-6">
          Let's get you started with our easy{" "}
          <Tip content="A step-by-step guide to set up your account and learn key features">
            onboarding process
          </Tip>
          .
        </p>
        <OnboardingWidget />
      </div>
    </div>
  );
}