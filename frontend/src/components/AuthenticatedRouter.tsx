import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import Matches from "../pages/Matches";
import { useEffect } from "react";
import { UserService } from "../services/UserService";
import Navbar from "./Navbar";
import { Profile } from "@shared/Profile";
import ProfileSettings from "../pages/ProfileSettings";
import EditProfile from "../pages/EditProfile";
import Terms from "../pages/Terms";
import ProfileView from "../pages/ProfileView";

interface Props {
  user: Profile | null;
  setUser: (user: Profile | null) => void;
}

const AuthRouter = (props: Props) => {
  const navigate = useNavigate();
  const userService = new UserService();

  async function getUser() {
    const user = await userService.getProfile();
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
        <Route path="/user/:email?" element={<ProfileView />} />
        <Route path="/" element={<Home user={props.user} />} />
        <Route
          path="/settings"
          element={<ProfileSettings user={props.user} />}
        />
        <Route
          path="/settings/edit-profile"
          element={<EditProfile user={props.user!} setUser={props.setUser} />}
        />
        <Route path="/terms" element={<Terms />} />
      </Routes>
      <Navbar />
    </div>
  );
};

export default AuthRouter;
