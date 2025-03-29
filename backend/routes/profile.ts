import express from "express";
import { userService } from "../service";
import { Profile } from "@shared/Profile";
import { secureApiRouter } from "./secureApiRouter";
import { AUTH_COOKIE_NAME } from "../service";
const profileRouter = express.Router();
profileRouter.use(secureApiRouter);

// Get user profile
secureApiRouter.get("/", async (req, res) => {
    const email = req.email;
    if (!email) {
      res.status(401).send("Unauthorized");
      return;
    }
    const profile = await userService.getUserProfile(email);
    if (profile) {
      res.send(profile);
    } else {
      res.status(400).send("Failed to get profile");
    }
  });
  
  // Update user profile
  secureApiRouter.put("/", async (req, res) => {
    const email = req.email;
    if (!email) {
      res.status(401).send("Unauthorized");
      return;
    }
    const profileObj = req.body.profile;
    const updatedProfile = Profile.fromObject(profileObj);
  
    const success = await userService.updateUserProfile(email, updatedProfile);
    if (success) {
      res.send("Profile updated successfully");
    } else {
      res.status(400).send("Failed to update profile");
    }
  });
  
  // Delete user profile
  secureApiRouter.delete("/", async (req, res) => {
    const email = req.email;
    if (!email) {
      res.status(401).send("Unauthorized");
      return;
    }
    const success = await userService.deleteUserProfile(email);
    if (success) {
      res.clearCookie(AUTH_COOKIE_NAME);
      res.send("Profile deleted successfully");
    } else {
      res.status(400).send("Failed to delete profile");
    }
  });

  module.exports = profileRouter;