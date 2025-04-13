import { Routes, Route } from 'react-router-dom';
import { CreateWorkout } from './routes/CreateWorkout';
import { HomeScreen } from './routes/HomeScreen';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/CreateWorkout/" element={<CreateWorkout />} />
    </Routes>
  );
}

export default App;
