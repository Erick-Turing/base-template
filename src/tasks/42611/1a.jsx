import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

const Step = ({ label, currentStep, stepIndex }) => {
  const isCompleted = stepIndex < currentStep;
  const isActive = stepIndex === currentStep;

  return (
    <div className="flex flex-col items-center text-center">
      <div className={cn(
        "mb-2 text-sm font-medium",
        isActive ? "text-primary" : "text-muted-foreground"
      )}>
        {label}
      </div>
      <div className="mb-4">
        {isCompleted ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />}
      </div>
      {stepIndex < currentStep - 1 && (
        <div className="h-4 w-0.5 bg-muted-foreground"></div>
      )}
    </div>
  );
};

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
      {steps.map((label, index) => (
        <React.Fragment key={label}>
          <Step label={label} currentStep={currentStep} stepIndex={index} />
          {index < steps.length - 1 && (
            <div className="hidden sm:block w-16 h-0.5 bg-muted-foreground"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default function App() {
  const steps = ["Order Placed", "Processing", "Shipped", "Delivered", "Reviewed"];
  const currentStep = 3; // Example current step

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Order Progress</h1>
        <Stepper steps={steps} currentStep={currentStep} />
      </div>
    </div>
  );
}