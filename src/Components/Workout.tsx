import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";

const fakeData = [
  {
    id: 1,
    name: "Arm Day",
    exercises: [
      { id: 101, name: "Curls" },
      { id: 102, name: "Tricep Pushdowns" },
      { id: 103, name: "EZ Bar Curls" },
    ],
  },
  {
    id: 2,
    name: "Leg Day",
    exercises: [
      { id: 201, name: "Squats" },
      { id: 202, name: "Lunges" },
      { id: 203, name: "Leg Press" },
    ],
  },
  {
    id: 3,
    name: "Push Day",
    exercises: [
      { id: 301, name: "Bench Press" },
      { id: 302, name: "Overhead Press" },
      { id: 303, name: "Incline Dumbbell Press" },
    ],
  },
  {
    id: 4,
    name: "Pull Day",
    exercises: [
      { id: 401, name: "Deadlifts" },
      { id: 402, name: "Barbell Rows" },
      { id: 403, name: "Face Pulls" },
    ],
  },
  {
    id: 5,
    name: "Full Body Blast",
    exercises: [
      { id: 501, name: "Burpees" },
      { id: 502, name: "Kettlebell Swings" },
      { id: 503, name: "Jump Squats" },
    ],
  },
];

export const Workout = () => {
  const { id } = useParams();
  const [workout, setWorkout] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    const selectedWorkout = fakeData.find((w) => w.id === parseInt(id!));
    setWorkout(selectedWorkout);
  }, [id]);

  if (!workout) {
    return <div>Loading...</div>;
  }

  return (
    <div className="workout-screen">
      <h1>{workout.name}</h1>
      <div className="date-picker-container">
        <label htmlFor="workout-date">Date</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => {
            if (date) {
              setSelectedDate(date);
            }
          }}
          className="date-picker"
        />
      </div>

      <div className="exercise-list">
        {workout.exercises.map((exercise: any) => (
          <div key={exercise.id} className="exercise-block">
            <button className="exercise-button log-button">
              {exercise.name}
            </button>

            <div className="set-table">
              <div className="set-row">
                <input type="number" placeholder="Sets" />
                <input type="number" placeholder="Reps" />
                <input type="number" placeholder="Weight" />
                <input type="number" placeholder="Rest (sec)" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
