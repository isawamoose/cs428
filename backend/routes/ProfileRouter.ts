import express from "express";
import { db } from "../database/Database";
import { Profile } from "../../shared/Profile";
import { UserService } from "../service/userService";

const userService = new UserService(db); // Get user profile

const profileRouter = express.Router();

profileRouter.get("/profile", async (req, res) => {
  const email = req.email;
  if (!email) {
    res.status(401).send("Unauthorized");
    return;
  }
  const profile: Profile | null = await userService.getUserProfile(email);
  if (profile) {
    res.send(profile);
  } else {
    res.status(400).send("Failed to get profile");
  }
});

// Update user profile
profileRouter.put("/profile", async (req, res) => {
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

export default profileRouter;
