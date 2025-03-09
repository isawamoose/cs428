import { LuHouse, LuBone, LuUser } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="app-navbar">
      <LuBone onClick={() => navigate("/app/matches")} />
      <LuHouse onClick={() => navigate("/app")} />
      <LuUser onClick={() => navigate("/app/settings")} />
    </nav>
  );
};

export default Navbar;
