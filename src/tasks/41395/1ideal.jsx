import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from 'date-fns';

const ExamForm = ({ onSubmit, onCancel, initialData = { name: '', date: '' } }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {
      name: formData.name ? '' : 'Exam name is required.',
      date: formData.date ? '' : 'Date is required.',
    };
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === '');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData.id ? 'Edit Exam' : 'Add New Exam'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="examName">Exam Name</Label>
            <Input
              id="examName"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <Label htmlFor="examDate">Date</Label>
            <Input
              type="date"
              id="examDate"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className={errors.date ? 'border-red-500' : ''}
            />
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
          </div>
          <Button type="submit">{initialData.id ? 'Update' : 'Add'}</Button>
          <Button type="button" variant="secondary" onClick={onCancel} className="ml-2">Cancel</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const ExamTimeline = ({ exams }) => (
  <div className="mt-8">
    <h2 className="text-lg font-semibold mb-4">Exam Timeline</h2>
    <div className="relative">
      <div className="border-l-2 border-dashed border-gray-300 absolute h-full left-24"></div>
      {exams.map(exam => (
        <div key={exam.id} className="flex mb-4">
          <div className="w-24 text-right pr-4 text-sm">
            {format(new Date(exam.date), 'MMM d, yyyy')}
          </div>
          <div className="pl-4 flex-1">{exam.name}</div>
        </div>
      ))}
    </div>
  </div>
);

const App = () => {
  const [exams, setExams] = useState([]);
  const [editingExam, setEditingExam] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedExams = JSON.parse(localStorage.getItem('exams') || '[]');
    setExams(savedExams);
  }, []);

  useEffect(() => {
    localStorage.setItem('exams', JSON.stringify(exams));
  }, [exams]);

  const handleExamAction = (exam, isEdit = false) => {
    if (isEdit) {
      setExams(exams.map(e => (e.id === exam.id ? exam : e)));
    } else {
      if (!exams.some(e => e.name === exam.name && e.date === exam.date)) {
        setExams([...exams, { ...exam, id: Date.now() }]);
      } else {
        setError('This exam already exists.');
      }
    }
    setEditingExam(null);
  };

  const deleteExam = id => {
    setExams(exams.filter(exam => exam.id !== id));
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">College Exam Manager</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          {editingExam ? (
            <ExamForm onSubmit={exam => handleExamAction(exam, true)} onCancel={() => setEditingExam(null)} initialData={editingExam} />
          ) : (
            <ExamForm onSubmit={handleExamAction} onCancel={() => setEditingExam(null)} />
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Exams List</h2>
            {exams.map(exam => (
              <Card key={exam.id} className="mb-2">
                <CardContent>
                  <p>{exam.name} - {format(new Date(exam.date), 'MMM d, yyyy')}</p>
                  <Button onClick={() => setEditingExam(exam)}>Edit</Button>
                  <Button onClick={() => deleteExam(exam.id)} className="ml-2" variant="destructive">Delete</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <ExamTimeline exams={exams} />
      </div>
    </div>
  );
};

export default App;
