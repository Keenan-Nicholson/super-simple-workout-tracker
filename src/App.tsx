import { Routes, Route } from "react-router-dom";
import { CreateWorkout } from "./routes/CreateWorkout";
import { HomeScreen } from "./routes/HomeScreen";
import { LogWorkout } from "./routes/LogWorkout";
import { HomeButton } from "./Components/HomeButton";

function App() {
  return (
    <div>
      <HomeButton />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/CreateWorkout/" element={<CreateWorkout />} />
        <Route path="/LogWorkout/" element={<LogWorkout />} />
      </Routes>
    </div>
  );
}

export default App;
