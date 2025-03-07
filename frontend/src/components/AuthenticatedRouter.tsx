import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import { useEffect, useState } from "react";
import { LoginService } from "../services/LoginService";
import Navbar from "./Navbar";
import { Profile } from "@shared/Profile";

interface Props {
  user: Profile | null;
  setUser: (user: Profile | null) => void;
}

const AuthRouter = (props: Props) => {
  const [loginService] = useState(new LoginService());
  const navigate = useNavigate();

  async function getCurrentUser() {
    const profile = await loginService.getProfile();
    if (profile) {
      props.setUser(profile);
    } else {
      navigate("/");
    }
  }

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <div className="authenticated">
      <Routes>
        <Route
          path="/"
          element={<Home user={props.user} setUser={props.setUser} />}
        />
      </Routes>
      <Navbar />
    </div>
  );
};

export default AuthRouter;
