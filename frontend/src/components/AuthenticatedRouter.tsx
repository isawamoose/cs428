import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import Matches from "../pages/Matches";
import { useEffect } from "react";
import { LoginService } from "../services/LoginService";
import Navbar from "./Navbar";
import { Profile } from "@shared/Profile";
import ProfileSettings from "../pages/ProfileSettings";

interface Props {
  user: Profile | null;
  setUser: (user: Profile | null) => void;
}

const AuthRouter = (props: Props) => {
  const navigate = useNavigate();
  const loginService = new LoginService();

  async function getUser() {
    const user = await loginService.getProfile();
    if (!user) {
      localStorage.removeItem("user"); // fix bug when there is a user in local storage but no valid authtoken
      props.setUser(null); // fix bug when there is a user in local storage but no valid authtoken
      navigate("/");
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="authenticated">
      <Routes>
        <Route path="/matches" element={<Matches />} />
        <Route path="/" element={<Home user={props.user} />} />
      </Routes>
      <Navbar />
    </div>
  );
};

export default AuthRouter;
