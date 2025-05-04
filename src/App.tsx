import { Routes, Route } from "react-router-dom";
import { CreateWorkout } from "./routes/CreateWorkout";
import { HomeScreen } from "./routes/HomeScreen";
import { LogWorkout } from "./routes/LogWorkout";
import { HomeButton } from "./Components/HomeButton";
import { Workout } from "./Components/Workout";
import { WorkoutHistory } from "./routes/WorkoutHistory";

function App() {
  return (
    <div>
      <HomeButton />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/CreateWorkout/" element={<CreateWorkout />} />
        <Route path="/LogWorkout/" element={<LogWorkout />} />
        <Route path="/LogWorkout/:id" element={<Workout />} />
        <Route path="/WorkoutHistory/" element={<WorkoutHistory />} />
      </Routes>
    </div>
  );
}

export default App;
