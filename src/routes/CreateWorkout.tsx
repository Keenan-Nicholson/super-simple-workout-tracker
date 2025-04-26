import { useState } from "react";
import "../App.css";

interface Exercise {
  id: number;
  name: string;
}

export const CreateWorkout = () => {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseInput, setExerciseInput] = useState("");

  const handleAddExercise = () => {
    if (exerciseInput.trim() === "") return;
    setExercises([...exercises, { id: Date.now(), name: exerciseInput }]);
    setExerciseInput("");
  };

  const handleRemoveExercise = (id: number) => {
    setExercises(exercises.filter((e) => e.id !== id));
  };

  const handleSave = async () => {
    const data = {
      workoutName,
      exercises: exercises.map((e) => e.name),
    };

    console.log(data);

    const response = await fetch("http://localhost:3000/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.error("Failed to save workout");
      return;
    }
    const result = await response.json();
    console.log("Workout saved:", result);
  };

  return (
    <div className="home-screen">
      <h1 className="title">Create Workout</h1>

      <input
        type="text"
        placeholder="Workout Name"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
        className="input-field"
      />

      <div className="exercise-entry">
        <input
          type="text"
          placeholder="Exercise Name"
          value={exerciseInput}
          onChange={(e) => setExerciseInput(e.target.value)}
          className="input-field"
        />
        <button className="add-btn" onClick={handleAddExercise}>
          Add
        </button>
      </div>

      <ul className="exercise-list">
        {exercises.map((ex) => (
          <li key={ex.id}>
            {ex.name}
            <button
              className="remove-btn"
              onClick={() => handleRemoveExercise(ex.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <button className="save-btn" onClick={handleSave}>
        Save Workout
      </button>
    </div>
  );
};
