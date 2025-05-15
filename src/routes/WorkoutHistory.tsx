import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ConfirmationModal from "../Components/ConfirmationModal";

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
  const [exerciseNames, setExerciseNames] = useState<string[]>([]);
  const [uniqueNames, setUniqueNames] = useState<string[]>([]);
  const [modalAction, setModalAction] = useState<"edit" | "delete" | null>(
    null
  );

  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [editReps, setEditReps] = useState<number>(0);
  const [editWeight, setEditWeight] = useState<number>(0);
  const [editRest, setEditRest] = useState<number>(0);

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
        if (exerciseNames.length > 0) {
          exerciseNames.forEach((name) => params.append("name", name));
        }

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
  }, [startDate, endDate, exerciseNames]);

  const onDelete = (id: number) => {
    setSelectedWorkoutId(id);
    setModalAction("delete");
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

  const onEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    setEditReps(workout.reps);
    setEditWeight(workout.weight);
    setEditRest(workout.rest);
  };

  const onEditConfirm = () => {
    setModalAction("edit");
    setShowModal(true);
  };

  const confirmEdit = async () => {
    if (!editingWorkout) return;

    try {
      const response = await fetch("http://localhost:3000/edit_sets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingWorkout.id,
          reps: editReps,
          weight: editWeight,
          rest: editRest,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update workout");
      }

      const updatedWorkout = {
        ...editingWorkout,
        reps: editReps,
        weight: editWeight,
        rest: editRest,
      };

      setWorkouts((prev) =>
        prev.map((w) => (w.id === editingWorkout.id ? updatedWorkout : w))
      );

      setEditingWorkout(null);
      setShowModal(false);
      setModalAction(null);
    } catch (error) {
      console.error("Error updating workout:", error);
    }
  };

  const cancelEdit = () => {
    setEditingWorkout(null);
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
          <br />
          <div className="exercise-filter">
            <label>Exercise Name</label>
            <div className="checkbox-list">
              {uniqueNames.map((name) => (
                <label key={name} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={exerciseNames.includes(name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setExerciseNames((prev) => [...prev, name]);
                      } else {
                        setExerciseNames((prev) =>
                          prev.filter((n) => n !== name)
                        );
                      }
                    }}
                  />
                  {name}
                </label>
              ))}
            </div>
          </div>
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
              {editingWorkout?.id === workout.id ? (
                <>
                  <h2>{workout.name}</h2>
                  <p>
                    <strong>Weight:</strong>
                    <input
                      type="number"
                      value={editWeight}
                      onChange={(e) => setEditWeight(Number(e.target.value))}
                    />
                  </p>
                  <p>
                    <strong>Reps:</strong>
                    <input
                      type="number"
                      value={editReps}
                      onChange={(e) => setEditReps(Number(e.target.value))}
                    />
                  </p>
                  <p>
                    <strong>Rest:</strong>
                    <input
                      type="number"
                      value={editRest}
                      onChange={(e) => setEditRest(Number(e.target.value))}
                    />
                  </p>
                  <button
                    onClick={onEditConfirm}
                    className="home-button save-button"
                  >
                    Save
                  </button>

                  <button
                    onClick={cancelEdit}
                    className="home-button delete-button"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
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
                    onClick={() => onEdit(workout)}
                    className="home-button edit-button"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(workout.id)}
                    className="home-button delete-button"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
      </div>

      {showModal && (
        <ConfirmationModal
          message={
            modalAction === "delete"
              ? "Are you sure you want to delete this exercise?"
              : "Are you sure you want to save these changes?"
          }
          onConfirm={modalAction === "delete" ? confirmDelete : confirmEdit}
          onCancel={() => {
            setShowModal(false);
            setModalAction(null);
          }}
        />
      )}
    </div>
  );
};
