import React, { useState, useEffect } from 'react';
import { format, isFuture, parseISO, compareAsc } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectItem, SelectContent} from "@/components/ui/select";

const durationOptions = Array.from({length: 8}, (_, i) => i + 1);

function Exam({ exam, onEdit, onDelete }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{exam.name}</CardTitle>
        <CardDescription>{exam.date} - {exam.duration} hours at {exam.location}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onEdit(exam)}><EditIcon /></Button>
        <Button variant="destructive" onClick={() => onDelete(exam.id)}><TrashIcon /></Button>
      </CardFooter>
    </Card>
  );
}

function TimelineItem({ exam }) {
  const now = new Date();
  const examDate = parseISO(exam.date);
  const isNear = Math.abs(now - examDate) < 1000 * 60 * 60 * 24 * 3; // within 3 days

  return (
    <div className={`flex ${isNear ? 'bg-yellow-100' : ''}`}>
      <div className="w-1/4 text-right pr-4">{format(examDate, 'MMM dd, yyyy HH:mm')}</div>
      <div className="w-3/4 border-l pl-4">
        <h3>{exam.name}</h3>
        <p>{exam.location}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [exams, setExams] = useState([]);
  const [form, setForm] = useState({ name: '', date: '', duration: '1', location: '' });
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState({ sort: 'date', search: '', month: '' });
  const [undoStack, setUndoStack] = useState([]);

  useEffect(() => {
    // Simulate loading from storage
    const storedExams = localStorage.getItem('exams');
    if (storedExams) setExams(JSON.parse(storedExams));
  }, []);

  useEffect(() => {
    localStorage.setItem('exams', JSON.stringify(exams));
  }, [exams]);

  const addExam = () => {
    if (!form.name || !form.date || !form.location || !form.duration) return;
    if (exams.some(e => e.name === form.name && e.date === form.date)) return;
    const newExam = { ...form, id: Date.now() };
    setExams([...exams, newExam]);
    setForm({ name: '', date: '', duration: '1', location: '' });
    setUndoStack([]);
  };

  const updateExam = () => {
    setExams(exams.map(e => e.id === editId ? { ...form, id: editId } : e));
    setEditId(null);
    setForm({ name: '', date: '', duration: '1', location: '' });
  };

  const deleteExam = (id) => {
    const examToDelete = exams.find(e => e.id === id);
    setUndoStack([...undoStack, examToDelete]);
    setExams(exams.filter(e => e.id !== id));
  };

  const undoDelete = () => {
    if (undoStack.length) {
      const lastDeleted = undoStack.pop();
      setExams([...exams, lastDeleted]);
    }
  };

  const filteredExams = exams.filter(exam => 
    (exam.name.toLowerCase().includes(filter.search.toLowerCase()) || 
     exam.location.toLowerCase().includes(filter.search.toLowerCase())) &&
    (!filter.month || format(parseISO(exam.date), 'yyyy-MM') === filter.month)
  ).sort((a, b) => {
    if (filter.sort === 'date') return compareAsc(parseISO(a.date), parseISO(b.date));
    if (filter.sort === 'name') return a.name.localeCompare(b.name);
  });

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Exams</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={e => { e.preventDefault(); editId ? updateExam() : addExam(); }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                placeholder="Exam Name" 
                required 
              />
              <Input 
                type="datetime-local" 
                value={form.date} 
                onChange={e => setForm({...form, date: e.target.value})} 
                required 
              />
              <Select value={form.duration} onChange={e => setForm({...form, duration: e})}>
                <SelectContent>
                  {durationOptions.map(d => <SelectItem key={d} value={d.toString()}>{d} hour{d > 1 ? 's' : ''}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input 
                value={form.location} 
                onChange={e => setForm({...form, location: e.target.value})} 
                placeholder="Location" 
                required 
              />
            </div>
            <Button className="mt-4" type="submit">{editId ? 'Update' : 'Add'} Exam</Button>
            {undoStack.length > 0 && <Button onClick={undoDelete} className="mt-2">Undo Delete</Button>}
          </form>
        </CardContent>
      </Card>

      <div className="mt-4">
        Sort by:
        <Select value={filter.sort} onChange={e => setFilter({...filter, sort: e})}>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
        <Input 
          className="mt-2" 
          placeholder="Search exams..." 
          value={filter.search} 
          onChange={e => setFilter({...filter, search: e.target.value})} 
        />
        <Input 
          type="month" 
          className="mt-2" 
          value={filter.month} 
          onChange={e => setFilter({...filter, month: e.target.value})} 
        />
      </div>

      <div className="mt-4">
        {filteredExams.map(exam => (
          <Exam 
            key={exam.id} 
            exam={exam} 
            onEdit={() => {setEditId(exam.id); setForm(exam);}}
            onDelete={deleteExam} 
          />
        ))}
      </div>

      <div className="mt-4">
        <h2 className="text-xl mb-2">Exam Timeline</h2>
        {filteredExams.map(exam => <TimelineItem key={exam.id} exam={exam} />)}
      </div>

      <Card className="mt-4">
        <CardContent>
          <p>Total Exams: {exams.length}</p>
          <p>Nearest Exam: {exams.filter(e => isFuture(parseISO(e.date))).sort((a, b) => parseISO(a.date) - parseISO(b.date))[0]?.name || 'None'}</p>
          <p>Unique Locations: {[...new Set(exams.map(e => e.location))].length}</p>
        </CardContent>
      </Card>
    </div>
  );
}