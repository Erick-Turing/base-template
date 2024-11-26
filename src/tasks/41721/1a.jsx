import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data for one month
const sampleData = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  date: new Date(2023, 4, i + 1).toISOString().split('T')[0],
  workoutType: ["Running", "Cycling", "Swimming", "Weightlifting"][Math.floor(Math.random() * 4)],
  caloriesBurnt: Math.floor(Math.random() * 500) + 100,
  startTime: `${Math.floor(Math.random() * 12) + 6}:00`,
  endTime: `${Math.floor(Math.random() * 12) + 6}:00`,
}));

export default function App() {
  const [workouts, setWorkouts] = useState(sampleData);
  const [newWorkout, setNewWorkout] = useState({
    date: "",
    workoutType: "",
    caloriesBurnt: "",
    startTime: "",
    endTime: "",
  });
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [filter, setFilter] = useState("This week");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Calculate metrics
  const currentDate = new Date();
  const currentWeekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
  const currentWeekEnd = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6));

  const thisWeekWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= currentWeekStart && workoutDate <= currentWeekEnd;
  });

  const stepsThisWeek = thisWeekWorkouts.length * 1000; // Assuming 1000 steps per workout
  const caloriesBurnedThisWeek = thisWeekWorkouts.reduce((sum, workout) => sum + workout.caloriesBurnt, 0);
  const goalProgress = (caloriesBurnedThisWeek / calorieGoal) * 100;

  // Handle input changes
  const handleInputChange = (e) => {
    setNewWorkout({ ...newWorkout, [e.target.name]: e.target.value });
  };

  // Add new workout
  const addWorkout = () => {
    if (new Date(newWorkout.date) > new Date()) {
      alert("Cannot add workout for future date");
      return;
    }
    setWorkouts([...workouts, { id: workouts.length + 1, ...newWorkout }]);
    setNewWorkout({ date: "", workoutType: "", caloriesBurnt: "", startTime: "", endTime: "" });
  };

  // Filter workouts
  const filterWorkouts = () => {
    const today = new Date();
    const filterDate = new Date();
    switch (filter) {
      case "This week":
        filterDate.setDate(today.getDate() - 7);
        break;
      case "Last week":
        filterDate.setDate(today.getDate() - 14);
        break;
      case "This month":
        filterDate.setMonth(today.getMonth() - 1);
        break;
      case "Last month":
        filterDate.setMonth(today.getMonth() - 2);
        break;
      case "Last 2 months":
        filterDate.setMonth(today.getMonth() - 3);
        break;
      case "Last 3 months":
        filterDate.setMonth(today.getMonth() - 4);
        break;
      default:
        return workouts;
    }
    return workouts.filter(workout => new Date(workout.date) >= filterDate);
  };

  // Sort workouts
  const sortWorkouts = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedWorkouts = [...filterWorkouts()].sort((a, b) => {
    if (sortColumn === "date") {
      return sortDirection === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
    } else if (sortColumn === "caloriesBurnt") {
      return sortDirection === "asc" ? a.caloriesBurnt - b.caloriesBurnt : b.caloriesBurnt - a.caloriesBurnt;
    } else if (sortColumn === "timeSpent") {
      const getTimeSpent = (workout) => {
        const [startHour, startMinute] = workout.startTime.split(':').map(Number);
        const [endHour, endMinute] = workout.endTime.split(':').map(Number);
        return (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
      };
      return sortDirection === "asc" ? getTimeSpent(a) - getTimeSpent(b) : getTimeSpent(b) - getTimeSpent(a);
    }
    return 0;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fitness Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Steps This Week</CardTitle>
          </CardHeader>
          <CardContent>{stepsThisWeek}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calories Burned This Week</CardTitle>
          </CardHeader>
          <CardContent>{caloriesBurnedThisWeek} kCal</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>{goalProgress.toFixed(2)}%</CardContent>
        </Card>
      </div>

      <div className="mb-4">
        <Input
          type="number"
          placeholder="Set calorie goal for the week"
          value={calorieGoal}
          onChange={(e) => setCalorieGoal(Number(e.target.value))}
          className="w-full md:w-1/3"
        />
      </div>

      <div className="mb-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="This week">This week</SelectItem>
            <SelectItem value="Last week">Last week</SelectItem>
            <SelectItem value="This month">This month</SelectItem>
            <SelectItem value="Last month">Last month</SelectItem>
            <SelectItem value="Last 2 months">Last 2 months</SelectItem>
            <SelectItem value="Last 3 months">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No.</TableHead>
            <TableHead onClick={() => sortWorkouts("date")} className="cursor-pointer">Date</TableHead>
            <TableHead>Workout Type</TableHead>
            <TableHead onClick={() => sortWorkouts("caloriesBurnt")} className="cursor-pointer">Calories Burnt (kCal)</TableHead>
            <TableHead onClick={() => sortWorkouts("timeSpent")} className="cursor-pointer">Time Spent</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedWorkouts.map((workout, index) => (
            <TableRow key={workout.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{workout.date}</TableCell>
              <TableCell>{workout.workoutType}</TableCell>
              <TableCell>{workout.caloriesBurnt}</TableCell>
              <TableCell>
                {(() => {
                  const [startHour, startMinute] = workout.startTime.split(':').map(Number);
                  const [endHour, endMinute] = workout.endTime.split(':').map(Number);
                  const diffMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
                  return `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m`;
                })()}
              </TableCell>
              <TableCell>{workout.startTime}</TableCell>
              <TableCell>{workout.endTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Input type="date" name="date" value={newWorkout.date} onChange={handleInputChange} placeholder="Date" />
        <Input type="text" name="workoutType" value={newWorkout.workoutType} onChange={handleInputChange} placeholder="Workout Type" />
        <Input type="number" name="caloriesBurnt" value={newWorkout.caloriesBurnt} onChange={handleInputChange} placeholder="Calories Burnt" />
        <Input type="time" name="startTime" value={newWorkout.startTime} onChange={handleInputChange} placeholder="Start Time" />
        <Input type="time" name="endTime" value={newWorkout.endTime} onChange={handleInputChange} placeholder="End Time" />
      </div>
      <Button onClick={addWorkout} className="mt-4">Add Workout</Button>
    </div>
  );
}