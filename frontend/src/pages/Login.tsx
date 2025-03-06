import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { UserInfoContext } from "../components/UserInfoProvider";
// import { useContext } from "react";
import paws from "../assets/paws.png";

import "./Login.css";
import { LoginService } from "../services/LoginService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // const { updateUserInfo } = useContext(UserInfoContext);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const service = new LoginService();
      // const [userProfile, authToken] = await service.login(email, password);
      await service.login(email, password);
      //console.log("User Info:", userProfile.shortProfile); // testing login service

      //store profile/user information globally to be acessed in other pages if desired (NEED TO CLEAR LATER IN LOGOUT)
      // updateUserInfo(userProfile, userProfile, authToken);

      navigate("/app");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      alert("Login failed. Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      <div className="content">
        <h1>Who Let the Dogs In?</h1>
        <h2>Sign In</h2>
        <h2 className="tagline">Access to your account</h2>

        <div className="login-features">
          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            <button
              className="login-submit reg_button"
              type="button"
              onClick={handleLogin}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
      <div className="background-images">
        <img src={paws} alt="Image description" className="paws" />
      </div>
      <button
        className="secondary-option"
        onClick={() => navigate("/register")}
      >
        New? <span className="join-now-text">Join Now</span>
      </button>
    </div>
  );
};

export default Login;
