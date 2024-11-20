import React, { useState } from 'react';

const ArticleStructureVisualizer = () => {
  const article = {
    title: "Understanding React Hooks",
    sections: [
      {
        id: "intro",
        title: "Introduction",
        content: "React Hooks were introduced in React 16.8...",
        subsections: []
      },
      {
        id: "basics",
        title: "Basic Hooks",
        content: "Let's explore the most commonly used hooks.",
        subsections: [
          {
            id: "useState",
            title: "useState",
            content: "useState is used for managing local state in functional components.",
            subsections: []
          },
          {
            id: "useEffect",
            title: "useEffect",
            content: "useEffect is used for side effects in functional components.",
            subsections: []
          }
        ]
      },
      {
        id: "advanced",
        title: "Advanced Hooks",
        content: "Now let's look at some more advanced hooks.",
        subsections: [
          {
            id: "useContext",
            title: "useContext",
            content: "useContext is used for consuming context in functional components.",
            subsections: []
          },
          {
            id: "useReducer",
            title: "useReducer",
            content: "useReducer is an alternative to useState for complex state logic.",
            subsections: []
          }
        ]
      },
      {
        id: "conclusion",
        title: "Conclusion",
        content: "React Hooks provide a powerful way to use state and other React features...",
        subsections: []
      }
    ]
  };
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const renderSection = (section, depth = 0) => {
    const isExpanded = expandedSections[section.id];
    const hasSubsections = section.subsections && section.subsections.length > 0;

    return (
      <div key={section.id} className={`ml-${depth * 4}`}>
        <div
          className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => toggleSection(section.id)}
        >
          {hasSubsections && (
            <span className="mr-2">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          <span className="font-semibold">{section.title}</span>
        </div>
        {isExpanded && section.content && (
          <p className="text-sm text-gray-600 ml-6 mt-1 mb-2">{section.content}</p>
        )}
        {isExpanded && hasSubsections && (
          <div className="ml-6 mt-2">
            {section.subsections.map(subsection => renderSection(subsection, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
      {article.sections.map(section => renderSection(section))}
    </div>
  );
};

export default ArticleStructureVisualizer;