import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ExamForm = ({ onSubmit, initialData }) => {
  const [exam, setExam] = useState(initialData || { name: "", date: "", duration: "", location: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(exam);
    setExam({ name: "", date: "", duration: "", location: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Exam Name</Label>
        <Input
          id="name"
          value={exam.name}
          onChange={(e) => setExam({ ...exam, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="datetime-local"
          value={exam.date}
          onChange={(e) => setExam({ ...exam, date: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="duration">Duration (hours)</Label>
        <Input
          id="duration"
          type="number"
          min="1"
          max="8"
          value={exam.duration}
          onChange={(e) => setExam({ ...exam, duration: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={exam.location}
          onChange={(e) => setExam({ ...exam, location: e.target.value })}
          required
        />
      </div>
      <Button type="submit">{initialData ? "Update" : "Add"} Exam</Button>
    </form>
  );
};

const ExamList = ({ exams, onEdit, onDelete }) => (
  <ul className="space-y-2">
    {exams.map((exam) => (
      <li key={exam.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
        <span>{exam.name} - {new Date(exam.date).toLocaleString()}</span>
        <div>
          <Button onClick={() => onEdit(exam)} className="mr-2">Edit</Button>
          <Button onClick={() => onDelete(exam.id)} variant="destructive">Delete</Button>
        </div>
      </li>
    ))}
  </ul>
);

const Timeline = ({ exams }) => {
  const now = new Date();
  return (
    <div className="space-y-4">
      {exams.map((exam) => {
        const examDate = new Date(exam.date);
        const daysUntil = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24));
        let bgColor = "bg-green-100";
        if (daysUntil < 0) bgColor = "bg-gray-100";
        else if (daysUntil < 7) bgColor = "bg-red-100";
        else if (daysUntil < 30) bgColor = "bg-yellow-100";

        return (
          <div key={exam.id} className={`flex ${bgColor} p-2 rounded`}>
            <div className="w-1/3">{examDate.toLocaleString()}</div>
            <div className="w-2/3">
              <strong>{exam.name}</strong>
              <br />
              Duration: {exam.duration} hours, Location: {exam.location}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Summary = ({ exams }) => {
  const totalExams = exams.length;
  const nearestExam = exams.reduce((nearest, exam) => 
    new Date(exam.date) < new Date(nearest.date) ? exam : nearest
  );
  const uniqueLocations = new Set(exams.map(exam => exam.location)).size;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total Exams: {totalExams}</p>
        <p>Nearest Exam: {nearestExam.name} on {new Date(nearestExam.date).toLocaleDateString()}</p>
        <p>Unique Locations: {uniqueLocations}</p>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [exams, setExams] = useState([]);
  const [editingExam, setEditingExam] = useState(null);
  const [deletedExam, setDeletedExam] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [filterMonth, setFilterMonth] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedExams = JSON.parse(localStorage.getItem("exams") || "[]");
    setExams(storedExams);
  }, []);

  useEffect(() => {
    localStorage.setItem("exams", JSON.stringify(exams));
  }, [exams]);

  const addExam = (newExam) => {
    if (exams.some(exam => exam.name === newExam.name && exam.date === newExam.date)) {
      alert("An exam with this name and date already exists!");
      return;
    }
    setExams([...exams, { ...newExam, id: Date.now() }]);
  };

  const updateExam = (updatedExam) => {
    setExams(exams.map(exam => exam.id === updatedExam.id ? updatedExam : exam));
    setEditingExam(null);
  };

  const deleteExam = (id) => {
    const examToDelete = exams.find(exam => exam.id === id);
    setDeletedExam(examToDelete);
    setExams(exams.filter(exam => exam.id !== id));
  };

  const undoDelete = () => {
    if (deletedExam) {
      setExams([...exams, deletedExam]);
      setDeletedExam(null);
    }
  };

  const sortedAndFilteredExams = exams
    .filter(exam => {
      const examDate = new Date(exam.date);
      return (
        (!filterMonth || (examDate.getMonth() + 1 === parseInt(filterMonth))) &&
        (exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         exam.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(a.date) - new Date(b.date);
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">College Exam Manager</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editingExam ? "Edit Exam" : "Add New Exam"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ExamForm
            onSubmit={editingExam ? updateExam : addExam}
            initialData={editingExam}
          />
        </CardContent>
      </Card>

      <div className="mb-4 flex flex-wrap gap-2">
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
        </Select>
        <Select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </Select>
        <Input
          type="text"
          placeholder="Search exams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Exam List</CardTitle>
        </CardHeader>
        <CardContent>
          <ExamList
            exams={sortedAndFilteredExams}
            onEdit={setEditingExam}
            onDelete={deleteExam}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Exam Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Timeline exams={sortedAndFilteredExams} />
        </CardContent>
      </Card>

      <Summary exams={exams} />

      {deletedExam && (
        <Alert className="mt-4">
          <AlertTitle>Exam Deleted</AlertTitle>
          <AlertDescription>
            You have deleted an exam. 
            <Button onClick={undoDelete} variant="link" className="p-0 h-auto font-normal">
              Undo
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}