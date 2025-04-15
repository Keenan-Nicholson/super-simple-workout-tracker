import { useNavigate } from "react-router-dom";
import "../App.css";

export const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="home-screen">
      <h1 className="title">Super Simple Workout Tracker</h1>
      <div className="button-container">
        <button
          className="home-button create-button"
          onClick={() => navigate("/CreateWorkout/")}
        >
          Create Workout
        </button>
        <button
          className="home-button log-button"
          onClick={() => navigate("/LogWorkout/")}
        >
          Log Workout
        </button>
      </div>
    </div>
  );
};
