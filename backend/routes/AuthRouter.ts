import express from "express";
import { db } from "../database/Database";
import { Profile } from "../../shared/Profile";
import { UserService } from "../service/userService";

const userService = new UserService(db);

const AUTH_COOKIE_NAME = "token";
const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const password = req.body.password;
  const profileObj = req.body.profile;
  const newProfile = Profile.fromObject(profileObj);

  const success = await userService.register(newProfile, password);

  if (success) {
    const token = await userService.login(newProfile.email, password);
    if (token) {
      res.cookie(AUTH_COOKIE_NAME, token, { secure: true, sameSite: "none" });
      res.send("User registered successfully");
    } else {
      res
        .status(400)
        .send("Registered successfully but failed to log in registered user");
    }
  } else {
    res.status(400).send("Username already exists");
  }
});

authRouter.put("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const token = await userService.login(email, password);
  if (token) {
    res.cookie(AUTH_COOKIE_NAME, token, { secure: true, sameSite: "none" });
    res.send("Logged in successfully");
  } else {
    res.status(401).send("Invalid email or password");
  }
});

export default authRouter;
