import { useNavigate } from "react-router-dom";
import "../App.css";

export const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <button className="home-icon-button" onClick={() => navigate("/")}>
      <img src="/dumbbell.png" alt="Back to Home" />
    </button>
  );
};
