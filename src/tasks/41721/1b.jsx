import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription  } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectContent } from "@/components/ui/select";

import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

const initialData = Array.from({ length: 30 }, (_, i) => {
  const date = subDays(new Date(), i);
  return {
    id: i + 1,
    date: format(date, 'yyyy-MM-dd'),
    workoutType: ['Running', 'Cycling', 'Yoga', 'Weightlifting'][i % 4],
    caloriesBurnt: Math.floor(Math.random() * (500 - 200 + 1)) + 200,
    startTime: '08:00',
    endTime: '09:00',
  };
});

export default function App() {
  const [workouts, setWorkouts] = useState(initialData);
  const [newWorkout, setNewWorkout] = useState({ date: '', workoutType: '', caloriesBurnt: '', startTime: '', endTime: '' });
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [filter, setFilter] = useState('thisWeek');

  const addWorkout = () => {
    if (new Date(newWorkout.date) > new Date()) {
      alert("Cannot add workout for a future date.");
      return;
    }
    setWorkouts(prev => [...prev, { ...newWorkout, id: prev.length + 1 }]);
    setNewWorkout({ date: '', workoutType: '', caloriesBurnt: '', startTime: '', endTime: '' });
  };

  const filteredWorkouts = useMemo(() => {
    const now = new Date();
    let startDate, endDate;
    
    switch(filter) {
      case 'thisWeek': 
        startDate = startOfWeek(now); 
        endDate = endOfWeek(now); 
        break;
      case 'lastWeek':
        startDate = startOfWeek(subDays(now, 7)); 
        endDate = endOfWeek(subDays(now, 7)); 
        break;
      case 'thisMonth':
        startDate = startOfMonth(now); 
        endDate = endOfMonth(now); 
        break;
      case 'lastMonth':
        startDate = startOfMonth(subDays(now, 30)); 
        endDate = endOfMonth(subDays(now, 30)); 
        break;
      case 'last2Months':
        startDate = startOfMonth(subDays(now, 60)); 
        endDate = endOfMonth(now); 
        break;
      case 'last3Months':
        startDate = startOfMonth(subDays(now, 90)); 
        endDate = endOfMonth(now); 
        break;
      default:
        startDate = now; endDate = now;
    }

    return workouts.filter(w => {
      const workoutDate = new Date(w.date);
      return workoutDate >= startDate && workoutDate <= endDate;
    });
  }, [workouts, filter]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const sortedWorkouts = useMemo(() => {
    if (!sortConfig.key) return filteredWorkouts;
    
    return [...filteredWorkouts].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  }, [filteredWorkouts, sortConfig]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const metrics = {
    stepsThisWeek: 7000, // Placeholder value
    caloriesThisWeek: sortedWorkouts.reduce((sum, w) => sum + w.caloriesBurnt, 0),
    goalProgress: Math.min((sortedWorkouts.reduce((sum, w) => sum + w.caloriesBurnt, 0) / calorieGoal) * 100, 100),
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Fitness Tracker</CardTitle>
          <CardDescription>Track your daily fitness goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>Steps walked this week: {metrics.stepsThisWeek}</div>
            <div>Calories burned this week: {metrics.caloriesThisWeek} kCal</div>
            <div>Goal progress: {metrics.goalProgress.toFixed(2)}%</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <Input 
              type="number" 
              value={calorieGoal} 
              onChange={e => setCalorieGoal(Number(e.target.value))} 
              placeholder="Set Weekly Calorie Goal"
            />
            <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <SelectContent>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="lastWeek">Last Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="last2Months">Last 2 Months</SelectItem>
                <SelectItem value="last3Months">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {['date', 'workoutType', 'caloriesBurnt', 'startTime', 'endTime'].map(field => (
              <Input 
                key={field}
                type={field === 'date' ? 'date' : (field === 'caloriesBurnt' ? 'number' : 'text')}
                value={newWorkout[field]}
                onChange={e => setNewWorkout({...newWorkout, [field]: e.target.value})}
                placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
              />
            ))}
          </div>
          <Button onClick={addWorkout} className="mt-4">Add Workout</Button>
        </CardContent>
      </Card>

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            {['SNo.', 'Date', 'Workout type', 'Calories burnt', 'Time spent', 'Start time', 'End time'].map((header) => (
              <TableHead key={header} onClick={() => requestSort(header.toLowerCase().includes('date') ? 'date' : header.toLowerCase().includes('calories') ? 'caloriesBurnt' : 'timeSpent')}>
                {header}
                {sortConfig.key === (header.toLowerCase().includes('date') ? 'date' : header.toLowerCase().includes('calories') ? 'caloriesBurnt' : 'timeSpent') ? 
                  (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓') : ''}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedWorkouts.map((workout, index) => {
            const timeSpent = `${Math.abs(new Date(`1970-01-01T${workout.endTime}:00`) - new Date(`1970-01-01T${workout.startTime}:00`)) / 36e5} hours`;
            return (
              <TableRow key={workout.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{workout.date}</TableCell>
                <TableCell>{workout.workoutType}</TableCell>
                <TableCell>{workout.caloriesBurnt} kCal</TableCell>
                <TableCell>{timeSpent}</TableCell>
                <TableCell>{workout.startTime}</TableCell>
                <TableCell>{workout.endTime}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}