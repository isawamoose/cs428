import express from "express";
import bodyParser from "body-parser";
import { UserService } from "./service/userService";
import cookieParser from "cookie-parser";
import { Database } from "./database/Database";
import { Profile } from "../shared/Profile";

declare global {
  namespace Express {
    interface Request {
      username?: string;
    }
  }
}

const app = express();
const db = new Database();
const userService = new UserService(db);

const AUTH_COOKIE_NAME = "token";
app.use(cookieParser());
app.use(bodyParser.json());

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post("/register", async (req, res) => {
  const password = req.body.password;
  const profileObj = req.body.profile;
  const newProfile = Profile.fromObject(profileObj);

  const success = await userService.register(newProfile, password);

  if (success) {
    res.send("User registered successfully");
  } else {
    res.status(400).send("Username already exists");
  }
});

apiRouter.put("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const token = await userService.login(username, password);
  if (token) {
    res.cookie(AUTH_COOKIE_NAME, token, { secure: true, sameSite: "none" });
    res.send("Logged in successfully");
  } else {
    res.status(401).send("Invalid username or password");
  }
});

const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

// If netid matches the token, or user is admin, proceed
secureApiRouter.use(async (req, res, next) => {
  const authToken = req.cookies[AUTH_COOKIE_NAME];
  if (!authToken) {
    res.status(401).send({ msg: "Unauthorized" });
    return;
  }
  try {
    const userNameFromToken = await userService.getUsernameFromToken(authToken);
    if (!userNameFromToken) {
      res.status(401).send({ msg: "Unauthorized" });
      return;
    }
    req.username = userNameFromToken;
    next();
  } catch (e) {
    res.status(401).send({ msg: "Unauthorized" });
  }
});

// Get user profile
secureApiRouter.get("/profile", async (req, res) => {
  const username = req.username;
  if (!username) {
    res.status(401).send("Unauthorized");
    return;
  }
  const profile = await userService.getUserProfile(username);
  if (profile) {
    res.send({
      username: profile.username,
      name: profile.name,
      breed: profile.breed,
      description: profile.description,
      contact: profile.contact,
      ownerName: profile.ownerName,
      imageLink: profile.imageLink,
    });
  }
});

// Update user profile
secureApiRouter.put("/profile", async (req, res) => {
  const username = req.username;
  if (!username) {
    res.status(401).send("Unauthorized");
    return;
  }
  const name = req.body.name;
  const breed = req.body.breed;
  const description = req.body.description;
  const contact = req.body.contact;
  const ownerName = req.body.ownerName;
  const imageLink = req.body.imageLink;

  const updatedProfile = new Profile(
    username,
    name,
    breed,
    description,
    contact,
    ownerName,
    imageLink
  );

  const success = await userService.updateUserProfile(updatedProfile);
  if (success) {
    res.send("Profile updated successfully");
  } else {
    res.status(400).send("Failed to update profile");
  }
});

// Logout
secureApiRouter.delete("/logout", async (req, res) => {
  const username = req.username;
  if (!username) {
    res.status(400).send("Invalid token");
    return;
  }
  await userService.logout(username);
  res.clearCookie(AUTH_COOKIE_NAME);
  res.send("Logged out successfully");
});

// Return default message if the path is unknown
app.use((_req, res) => {
  res.send("Welcome to Puppr! You are attempting to reach an unknown path.");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
