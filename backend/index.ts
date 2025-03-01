import express from "express";
import bodyParser from "body-parser";
import { UserService } from "./service/userService";
import { Database } from "./database/Database";
import { Profile } from "./shared/Profile";

const app = express();
const db = new Database();
const userService = new UserService(db);

app.use(bodyParser.json());

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const name = req.body.name;
  const breed = req.body.breed;
  const description = req.body.description;
  const contact = req.body.contact;
  const ownerName = req.body.ownerName;
  const imageLink = req.body.imageLink;

  const password = req.body.password;

  const newProfile = new Profile(
    username,
    name,
    breed,
    description,
    contact,
    ownerName,
    imageLink
  );

  const success = await userService.register(newProfile, password);

  if (success) {
    res.send("User registered successfully");
  } else {
    res.status(400).send("Username already exists");
  }
});

app.put("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const success = await userService.login(username, password);
  if (success) {
    res.send("Login successful");
  } else {
    res.status(401).send("Invalid username or password");
  }
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
