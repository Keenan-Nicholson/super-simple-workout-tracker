import { useEffect, useState } from "react";

export const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState<any[]>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("http://localhost:3000/logged_sets");
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
          <button key={workout.id} className="home-button log-button">
            {workout.name}
          </button>
        ))}
      </div>
    </div>
  );
};
