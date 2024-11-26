import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function App() {
  const [exams, setExams] = useState([]);
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedExams = localStorage.getItem("exams");
    if (storedExams) {
      setExams(JSON.parse(storedExams));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("exams", JSON.stringify(exams));
  }, [exams]);

  const validateForm = () => {
    if (!examName.trim() || !examDate) {
      setError("Please fill in all fields.");
      return false;
    }
    if (exams.some((exam) => exam.name === examName && exam.date === examDate)) {
      setError("This exam already exists.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingIndex !== null) {
      const updatedExams = [...exams];
      updatedExams[editingIndex] = { name: examName, date: examDate };
      setExams(updatedExams);
      setEditingIndex(null);
    } else {
      setExams([...exams, { name: examName, date: examDate }]);
    }
    setExamName("");
    setExamDate("");
  };

  const handleEdit = (index) => {
    const exam = exams[index];
    setExamName(exam.name);
    setExamDate(exam.date);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    setExams(exams.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">College Exam Manager</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{editingIndex !== null ? "Edit Exam" : "Add New Exam"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="examName">Exam Name</Label>
              <Input
                id="examName"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="Enter exam name"
              />
            </div>
            <div>
              <Label htmlFor="examDate">Exam Date</Label>
              <Input
                id="examDate"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit">
              {editingIndex !== null ? "Update Exam" : "Add Exam"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Exam List</CardTitle>
        </CardHeader>
        <CardContent>
          {exams.length === 0 ? (
            <p>No exams registered yet.</p>
          ) : (
            <ul className="space-y-2">
              {exams.map((exam, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>
                    {exam.name} - {exam.date}
                  </span>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(index)}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exam Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {exams.length === 0 ? (
            <p>No exams to display on the timeline.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <ul className="space-y-4">
                {exams
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((exam, index) => (
                    <li key={index} className="relative pl-8">
                      <div className="absolute left-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                        {index + 1}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{exam.date}</span>
                        <span>{exam.name}</span>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}