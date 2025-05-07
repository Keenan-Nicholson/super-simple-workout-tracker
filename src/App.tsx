import { Routes, Route } from "react-router-dom";
import { CreateWorkout } from "./routes/CreateWorkout";
import { HomeScreen } from "./routes/HomeScreen";
import { LogWorkout } from "./routes/LogWorkout";
import { HomeButton } from "./Components/HomeButton";
import { Workout } from "./Components/WorkoutComponent";
import { WorkoutHistory } from "./routes/WorkoutHistory";
import { WorkoutHistoryComponent } from "./Components/WorkoutHistoryComponent";

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
        <Route
          path="/WorkoutHistory/:id"
          element={<WorkoutHistoryComponent />}
        />
      </Routes>
    </div>
  );
}

export default App;
