import { useNavigate } from "react-router-dom";
import "./Start.css";
import dog_collar from "../assets/dc.png";
import paw from "../assets/wp.png";

const Start = () => {
  const navigate = useNavigate();

  const handleStart = (action: string) => {
    if (action === "login") {
      navigate("/login"); // Navigate to login page
    } else if (action === "register") {
      navigate("/register"); // Navigate to register page
    }
  };

  return (
    <div className="container start-page">
      <div className="background-images">
        <img src={paw} alt="Image description" className="pawTop" />
        <img src={paw} alt="Image description" className="pawBottom" />
      </div>

      <div className="app-title">
        <h1>Puppr</h1>
        <h2>The Place for Pups</h2>
      </div>

      <div className="image-container-collar">
        <img src={dog_collar} alt="Image description" className="image" />
      </div>

      <div className="button-container">
        <button
          type="button"
          className="reg_button"
          onClick={() => handleStart("register")}
        >
          Create An Account
        </button>
        <button
          type="button"
          className="login_button"
          onClick={() => handleStart("login")}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Start;
