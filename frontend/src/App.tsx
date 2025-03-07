import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Start from "./pages/Start";
import Register from "./pages/Register";
import Login from "./pages/Login";

import "./App.css";
import AuthRouter from "./components/AuthenticatedRouter";
import { useEffect, useState } from "react";
import { Profile } from "@shared/Profile";

function App() {
  const [user, setUser] = useState<Profile | null>(
    localStorage.getItem("user")
      ? Profile.fromObject(JSON.parse(localStorage.getItem("user")!))
      : null
  );

  useEffect(() => {
    if (user) {
      console.log("User logged in:", user.email);
    } else {
      console.log("User logged out.");
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        {/* Always show Start page first */}
        <Route path="/" element={<Start />} />

        {/* These pages are always accessible */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Defer to authenticated router */}
        <Route
          path="/app/*"
          element={<AuthRouter user={user} setUser={setUser} />}
        />

        {/* Redirect to Start if any unknown route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
