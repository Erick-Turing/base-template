import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialExamState = { name: "", date: "", duration: "", location: "" };

export default function App() {
  const [exams, setExams] = useState([]);
  const [form, setForm] = useState(initialExamState);
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState("date");
  const [search, setSearch] = useState("");
  const [undoStack, setUndoStack] = useState([]);

  const addExam = () => {
    if (
      !form.name ||
      !form.date ||
      !form.duration ||
      !form.location ||
      exams.some((e) => e.name === form.name)
    ) {
      alert("Invalid exam data or duplicate exam name.");
      return;
    }
    if (form.duration < 1 || form.duration > 8) {
      alert("Duration must be between 1 and 8 hours.");
      return;
    }
    const newExam = { ...form, id: Date.now() };
    setExams((prev) => [...prev, newExam]);
    setForm(initialExamState);
  };

  const deleteExam = (id) => {
    const toDelete = exams.find((e) => e.id === id);
    setUndoStack([...undoStack, toDelete]);
    setExams((prev) => prev.filter((exam) => exam.id !== id));
  };

  const undoDelete = () => {
    const lastDeleted = undoStack.pop();
    if (lastDeleted) {
      setExams((prev) => [...prev, lastDeleted]);
      setUndoStack([...undoStack]);
    }
  };

  const sortedFilteredExams = useMemo(() => {
    return exams
      .filter((exam) => {
        const date = new Date(exam.date);
        return (
          (!filter || date.toISOString().includes(filter)) &&
          exam.name.toLowerCase().includes(search.toLowerCase())
        );
      })
      .sort((a, b) => {
        if (sortOption === "date") {
          return new Date(a.date) - new Date(b.date);
        }
        return a.name.localeCompare(b.name);
      });
  }, [exams, filter, search, sortOption]);

  const metrics = useMemo(() => {
    const total = exams.length;
    const nearestExam = exams.length
      ? exams.reduce((a, b) =>
          new Date(a.date) < new Date(b.date) ? a : b
        )
      : null;
    const uniqueLocations = new Set(exams.map((exam) => exam.location)).size;
    return { total, nearestExam, uniqueLocations };
  }, [exams]);

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage Exams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Exam Name"
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="date"
              className="input"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <input
              type="number"
              placeholder="Duration (hours)"
              className="input"
              value={form.duration}
              onChange={(e) =>
                setForm({ ...form, duration: parseInt(e.target.value, 10) })
              }
            />
            <input
              type="text"
              placeholder="Location"
              className="input"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <button className="btn mt-4" onClick={addExam}>
            Add Exam
          </button>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search by name"
          className="input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
        </select>
        <input
          type="month"
          className="input"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam List</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedFilteredExams.map((exam) => (
            <div
              key={exam.id}
              className="flex justify-between items-center mb-2 p-2 border rounded"
            >
              <div>
                <p>{exam.name}</p>
                <p className="text-sm text-gray-500">
                  {exam.date} • {exam.duration}h • {exam.location}
                </p>
              </div>
              <button
                className="btn"
                onClick={() => deleteExam(exam.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedFilteredExams.map((exam) => (
            <div key={exam.id} className="flex space-x-4 mb-4">
              <div className="text-sm font-bold text-gray-600">
                {new Date(exam.date).toLocaleDateString()}
              </div>
              <div>
                <p>{exam.name}</p>
                <p className="text-sm text-gray-500">
                  {exam.duration}h • {exam.location}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Exams: {metrics.total}</p>
          <p>
            Nearest Exam:{" "}
            {metrics.nearestExam
              ? `${metrics.nearestExam.name} on ${metrics.nearestExam.date}`
              : "None"}
          </p>
          <p>Unique Locations: {metrics.uniqueLocations}</p>
        </CardContent>
      </Card>

      {undoStack.length > 0 && (
        <button className="btn mt-4" onClick={undoDelete}>
          Undo Last Delete
        </button>
      )}
    </div>
  );
}
