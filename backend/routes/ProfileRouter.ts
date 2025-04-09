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

profileRouter.post("/photo", express.raw({type: "image/*", limit: '5mb'}), async (req, res) => {
  const email = req.headers["x-user-email"] as string
  const contentType = req.headers["content-type"] as string
  if (!contentType || !email) {
    res.status(400).send("Request did not include appropriate headers");
    return;
  }

  const response = await fetch("https://kn31xc1q6k.execute-api.us-east-1.amazonaws.com/prod/photo", {
    method: "POST",
    headers: {
      "Content-Type": contentType,
      "X-User-Email": email
    },
    body: req.body
  })

  if (response.ok) {
    const photoURL = (await response.json()).url
    let p = await userService.getUserProfile(email)
    if (p) {
      p = new Profile(p.email, p.dogName, p.breed, p.description, p.ownerName, photoURL)
      const success = await userService.updateUserProfile(email, p)
      if (success) {
        res.status(200).send({url: photoURL})
      } else {
        res.status(500).send("Unable to update profile photo")
      }
    } else {
      res.status(500).send("Unable to update profile photo")
    }
  } else {
    res.status(500).send("Unable to store profile photo")
  }
})

export default profileRouter;
