import { useNavigate } from "react-router-dom";
import "../App.css";
import { useEffect, useState } from "react";

// // A) Fetch all workout plans
// const workoutPlans = async () => {
//   try {
//     const response = await fetch("api/workout-plans/", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.error("Error fetching workout plans:", error);
//   }
// };

type WorkoutPlan = {
  id: number;
  name: string;
};

const fakeData = [
  { id: 1, name: "Arm Day" },
  { id: 2, name: "Leg Day" },
  { id: 3, name: "Push Day" },
  { id: 4, name: "Pull Day" },
  { id: 5, name: "Full Body Blast" },
];

export const LogWorkout = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);

  useEffect(() => {
    setWorkouts(fakeData);
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
