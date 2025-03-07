import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import { useEffect } from "react";
import { LoginService } from "../services/LoginService";
import Navbar from "./Navbar";
import { Profile } from "@shared/Profile";

interface Props {
  user: Profile | null;
}

const AuthRouter = (props: Props) => {
  const navigate = useNavigate();
  const loginService = new LoginService();

  async function getUser() {
    const user = await loginService.getProfile();
    if (!user) {
      navigate("/login");
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="authenticated">
      <Routes>
        <Route path="/" element={<Home user={props.user} />} />
      </Routes>
      <Navbar />
    </div>
  );
};

export default AuthRouter;
