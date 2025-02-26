import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Start from "./pages/Start";
import Register from "./pages/Register";
import Login from "./pages/Login";

import "./App.css";
import UserInfoProvider from "./components/UserInfoProvider";

function App() {
  return (
    <UserInfoProvider>
      <Router>
        <Routes>
          {/* Always show Start page first */}
          <Route path="/" element={<Start />} />

          {/* These pages are always accessible */}
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Redirect to Start if any unknown route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </UserInfoProvider>
  );
}

export default App;
