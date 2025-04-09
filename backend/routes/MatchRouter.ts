import express from "express";
import { MatchService } from "../service/matchService";
import { db } from "../database/Database";
import { Profile } from "../../shared/Profile";

const matchRouter = express.Router();
const matchService = new MatchService(db);

// Get unvoted profiles
matchRouter.get("/unvoted", async (req, res) => {
  const email = req.email;
  if (!email) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const unvotedProfiles: Profile[] = await matchService.getUnvotedProfiles(
      email
    );
    res.status(200).send(unvotedProfiles);
  } catch (error) {
    res.status(500).send("Server error while fetching unvoted profiles");
  }
});

// Get matches
matchRouter.get("/matches", async (req, res) => {
  const email = req.email;
  if (!email) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const matches: Profile[] = await matchService.getMatches(email);
    res.status(200).send(matches);
  } catch (error) {
    res.status(500).send("Server error while fetching matches");
  }
});

// Add a like
matchRouter.post("/like", async (req, res) => {
  const { likeeEmail } = req.body;
  const likerEmail = req.email;
  if (!likerEmail) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (!likeeEmail) {
    res.status(400).send("Missing likee");
    return;
  }
  try {
    const isMatch: boolean = await matchService.like(likerEmail, likeeEmail);
    res.status(200).send({ isMatch });
  } catch (error) {
    res.status(500).send("Server error while trying to add like");
  }
});

// Add a dislike
matchRouter.post("/dislike", async (req, res) => {
  const { dislikeeEmail } = req.body;
  const dislikerEmail = req.email;
  if (!dislikerEmail) {
    res.status(401).send("Unauthorized");
    return;
  }
  if (!dislikeeEmail) {
    res.status(400).send("Missing likee");
    return;
  }
  try {
    await matchService.dislike(dislikerEmail, dislikeeEmail);
    res.status(200).send("Disliked successfully");
  } catch (error) {
    res.status(500).send("Server error while trying to add dislike");
  }
});

export default matchRouter;
