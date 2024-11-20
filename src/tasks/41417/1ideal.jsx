import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const steps = [
  {
    title: "Define Requirements",
    description: "Clearly outline the app's purpose and features.",
    example: "E.g., Create a task management app with user authentication, task creation, and real-time updates.",
    details: [
      "Identify target audience",
      "List core features",
      "Define user stories",
      "Establish project timeline and budget"
    ]
  },
  {
    title: "Choose Tech Stack",
    description: "Select appropriate technologies for your project.",
    example: "E.g., React for frontend, Node.js for backend, MongoDB for database, and AWS for hosting.",
    details: [
      "Consider scalability requirements",
      "Evaluate team expertise",
      "Research popular and well-supported technologies",
      "Assess licensing and cost implications"
    ]
  },
  {
    title: "Design Architecture",
    description: "Plan the overall structure and components of your app.",
    example: "E.g., Microservices architecture with separate services for auth, tasks, and notifications.",
    details: [
      "Create system diagrams",
      "Define data models",
      "Plan API endpoints",
      "Consider security measures"
    ]
  },
  {
    title: "Implement with Best Practices",
    description: "Develop the app following industry standards and patterns.",
    example: "E.g., Use React hooks for state management, implement proper error handling, and follow SOLID principles.",
    details: [
      "Set up version control (e.g., Git)",
      "Follow coding standards and style guides",
      "Implement proper error handling and logging",
      "Use design patterns appropriate for your architecture"
    ]
  },
  {
    title: "Testing",
    description: "Ensure app quality through comprehensive testing.",
    example: "E.g., Write unit tests for React components using Jest and React Testing Library.",
    details: [
      "Implement unit tests",
      "Perform integration testing",
      "Conduct end-to-end testing",
      "Consider automated UI testing"
    ]
  },
  {
    title: "Set up CI/CD",
    description: "Automate build, test, and deployment processes.",
    example: "E.g., Use GitHub Actions to run tests and deploy to AWS on each push to main branch.",
    details: [
      "Choose a CI/CD tool (e.g., Jenkins, GitLab CI, GitHub Actions)",
      "Set up automated testing in the pipeline",
      "Configure deployment stages (dev, staging, production)",
      "Implement rollback mechanisms"
    ]
  },
  {
    title: "Deploy",
    description: "Launch your app to production environment.",
    example: "E.g., Deploy React app to AWS S3 and CloudFront, and backend to ECS.",
    details: [
      "Set up production environment",
      "Configure domain and SSL certificates",
      "Implement monitoring and logging",
      "Plan for scalability and load balancing"
    ]
  }
];

function StepCard({ step, isActive, onClick }) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-300 ${
        isActive ? "border-blue-500 shadow-lg" : "hover:shadow-md"
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">{step.title}</CardTitle>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>
      {isActive && (
        <CardContent>
          <p className="text-sm text-gray-600 mb-2">{step.example}</p>
          <Accordion type="single" collapsible>
            <AccordionItem value="details">
              <AccordionTrigger>View Details</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5">
                  {step.details.map((detail, index) => (
                    <li key={index} className="text-sm">{detail}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      )}
    </Card>
  );
}

export default function App() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Building a Modern App: Key Steps
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step, index) => (
          <StepCard
            key={index}
            step={step}
            isActive={activeStep === index}
            onClick={() => setActiveStep(index)}
          />
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Button
          onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : prev))}
          disabled={activeStep === 0}
          className="mr-2"
        >
          Previous
        </Button>
        <Button
          onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))}
          disabled={activeStep === steps.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}