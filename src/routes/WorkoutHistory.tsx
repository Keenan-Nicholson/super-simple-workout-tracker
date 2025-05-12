import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ConfirmationModal from "../Components/ConfirmationModal"; // Adjust the path

interface Workout {
  id: number;
  name: string;
  reps: number;
  rest: number;
  weight: number;
  date: string;
}

export const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [exerciseName, setExerciseName] = useState<string>("");
  const [uniqueNames, setUniqueNames] = useState<string[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const res = await fetch("http://localhost:3000/logged_sets");
        const data: Workout[] = await res.json();
        const names = Array.from(new Set(data.map((w) => w.name))).sort();
        setUniqueNames(names);
      } catch (err) {
        console.error("Failed to load exercise names", err);
      }
    };
    fetchNames();
  }, []);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const params = new URLSearchParams();
        if (startDate)
          params.append("startDate", startDate.toISOString().split("T")[0]);
        if (endDate)
          params.append("endDate", endDate.toISOString().split("T")[0]);
        if (exerciseName) params.append("name", exerciseName);

        const response = await fetch(
          `http://localhost:3000/logged_sets?${params.toString()}`
        );
        if (!response.ok) throw new Error("Failed to fetch workouts");
        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
  }, [startDate, endDate, exerciseName]);

  const onDelete = (id: number) => {
    setSelectedWorkoutId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (selectedWorkoutId === null) return;
    try {
      const response = await fetch("http://localhost:3000/delete_sets", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "workout-id": selectedWorkoutId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete workout");
      }

      setWorkouts((prev) => prev.filter((w) => w.id !== selectedWorkoutId));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  return (
    <div className="workout-screen">
      <h1 className="title">Workout History</h1>

      <div className="date-picker-container">
        <div className="date-picker-history">
          <label>Start Date</label>
          <br />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
            placeholderText="Start Date"
          />
        </div>
        <div className="date-picker-history">
          <label>End Date</label>
          <br />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
            placeholderText="End Date"
          />
        </div>
        <div className="date-picker-dropdown">
          <label>Exercise Name</label>
          <br />
          <select
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            className="date-picker"
          >
            <option value="">All</option>
            {uniqueNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="workout-grid">
        {workouts
          .slice()
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((workout) => (
            <div key={workout.id} className="workout-card">
              <h2>{workout.name}</h2>
              <p>
                <strong>Weight:</strong> {workout.weight} kg
              </p>
              <p>
                <strong>Reps:</strong> {workout.reps}
              </p>
              <p>
                <strong>Rest:</strong> {workout.rest}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(workout.date).toLocaleDateString()}
              </p>
              <button
                type="button"
                onClick={() => onDelete(workout.id)}
                className="home-button delete-button"
              >
                Delete Exercise
              </button>
            </div>
          ))}
      </div>

      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this exercise?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};
