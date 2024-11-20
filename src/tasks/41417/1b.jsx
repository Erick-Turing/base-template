import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/card";

function StepCard({ title, description, children }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function StepsAccordion() {
  const steps = [
    { 
      id: "requirements", 
      title: "1. Define Requirements", 
      content: "Gather and document all functional and non-functional requirements. Use tools like Jira or Trello for tracking."
    },
    { 
      id: "tech-stack", 
      title: "2. Choose Tech Stack", 
      content: "Select technologies based on project needs. For example, React for UI, Node.js for backend, and PostgreSQL for database."
    },
    { 
      id: "architecture", 
      title: "3. Design Architecture", 
      content: "Create system architecture diagrams. Use microservices or monolithic based on scalability needs."
    },
    { 
      id: "implementation", 
      title: "4. Implementation", 
      content: "Develop using best practices like TDD, clean code, and design patterns. Use Git for version control."
    },
    { 
      id: "testing", 
      title: "5. Testing", 
      content: "Implement unit tests, integration tests, and end-to-end tests. Tools like Jest for unit tests and Cypress for E2E."
    },
    { 
      id: "ci-cd", 
      title: "6. Set Up CI/CD", 
      content: "Use Jenkins, GitHub Actions, or GitLab CI for continuous integration and deployment."
    },
    { 
      id: "deployment", 
      title: "7. Deployment", 
      content: "Deploy to platforms like AWS, Heroku, or Vercel. Ensure to use environment variables for configuration."
    },
  ];

  return (
    <Accordion type="single" collapsible>
      {steps.map(step => (
        <AccordionItem value={step.id} key={step.id}>
          <AccordionTrigger>{step.title}</AccordionTrigger>
          <AccordionContent>
            {step.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default function App() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Steps to Build a Modern App</h1>
      <StepsAccordion />
      <Button variant="outline" className="mt-6 w-full sm:w-auto">
        Explore More
      </Button>
    </div>
  );
}