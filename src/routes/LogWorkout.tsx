import { useNavigate } from "react-router-dom";
import "../App.css";
import { useEffect, useState } from "react";

type WorkoutPlan = {
  id: number;
  name: string;
};

export const LogWorkout = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("http://localhost:3000/workouts");
        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }
        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <div className="home-screen">
      <div className="button-container">
        {workouts.map((workout) => (
          <button
            key={workout.id}
            className="home-button log-button"
            onClick={() => navigate(`/LogWorkout/${workout.id}`)}
          >
            {workout.name}
          </button>
        ))}
      </div>
    </div>
  );
};
