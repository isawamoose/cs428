import express from "express";
import { userService } from "../service";
import { secureApiRouter } from "./secureApiRouter";
import { Profile } from "@shared/Profile";
import { AUTH_COOKIE_NAME } from "../service";
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
      res.cookie(AUTH_COOKIE_NAME, token).send("Logged in successfully");
    } else {
      res.status(401).send("Invalid email or password");
    }
  });

  authRouter.use(secureApiRouter);

  // Logout
secureApiRouter.delete("/logout", async (req, res) => {
    const email = req.email;
    if (!email) {
      res.status(400).send("Invalid token");
      return;
    }
    await userService.logout(email);
    res.clearCookie(AUTH_COOKIE_NAME);
    res.send("Logged out successfully");
  });

  module.exports = authRouter;