import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

export const HomeButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBackOneLevel = () => {
    const parts = location.pathname.split("/").filter(Boolean);

    // If already at root, don't navigate
    if (parts.length === 0) {
      return; // Do nothing
    }

    // Otherwise go back one level
    const newPath = "/" + parts.slice(0, -1).join("/");
    navigate(newPath || "/"); // fallback just in case
  };

  return (
    <button className="home-icon-button" onClick={goBackOneLevel}>
      <img src="/dumbbell.png" alt="Back to Home" />
    </button>
  );
};
