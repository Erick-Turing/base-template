import React from 'react';

// Mock article structure
const article = {
  title: "Understanding Modern JavaScript",
  sections: [
    {
      title: "Introduction",
      content: "Brief overview of JavaScript evolution."
    },
    {
      title: "Core Concepts",
      subsections: [
        { title: "Variables and Scopes", content: "var, let, const" },
        { title: "Functions", content: "Arrow functions, closures" },
        { title: "Objects and Prototypes", content: "Inheritance in JS" }
      ]
    },
    {
      title: "Advanced Topics",
      subsections: [
        { title: "Asynchronous JavaScript", content: "Promises, async/await" },
        { title: "Modules", content: "ES6 Modules" }
      ]
    },
    {
      title: "Conclusion",
      content: "Summing up modern JavaScript practices."
    }
  ]
};

const ArticleStructure = () => {
  const renderSection = (section, isSubsection = false) => (
    <div className={`mb-4 ${isSubsection ? 'ml-6' : ''}`}>
      <h3 className={`text-lg font-semibold ${isSubsection ? 'text-blue-600' : 'text-purple-700'}`}>
        {section.title}
      </h3>
      {section.content && <p className="text-gray-600">{section.content}</p>}
      {section.subsections && section.subsections.map((sub, idx) => (
        <div key={idx}>
          {renderSection(sub, true)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-indigo-800">{article.title}</h1>
      <div className="space-y-4">
        {article.sections.map((section, index) => (
          <div key={index}>
            {renderSection(section)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleStructure;