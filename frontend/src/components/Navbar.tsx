import { LuHouse, LuBone, LuUser } from "react-icons/lu";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // dont show navbar on editprofile page'
  if (
    pathname === "/app/settings/edit-profile" ||
    pathname.includes("matches/conversation/")
  ) {
    return null;
  }

  return (
    <nav className="app-navbar">
      <LuBone
        color={pathname.includes("/app/matches") ? "white" : "#81D3FF"}
        onClick={() => navigate("/app/matches")}
      />
      <LuHouse
        color={pathname === "/app" ? "white" : "#81D3FF"}
        onClick={() => navigate("/app")}
      />
      <LuUser
        color={pathname.includes("/app/settings") ? "white" : "#81D3FF"}
        onClick={() => navigate("/app/settings")}
      />
    </nav>
  );
};

export default Navbar;
