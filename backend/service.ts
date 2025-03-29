import express from "express";
import bodyParser from "body-parser";
import { UserService } from "./service/userService";
import cookieParser from "cookie-parser";
import { Database } from "./database/Database";

declare global {
  namespace Express {
    interface Request {
      email?: string;
    }
  }
}

const app = express();
const db = new Database();
export const userService = new UserService(db);

export const AUTH_COOKIE_NAME = "token";
app.use(cookieParser());
app.use(bodyParser.json());

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

const profileRouter = require("./routes/profile");
apiRouter.use(`/profile`, profileRouter);
const authRouter = require("./routes/auth");
apiRouter.use(`/`, authRouter);

// Return default message if the path is unknown
app.use((_req, res) => {
  res.send("Welcome to Puppr! You are attempting to reach an unknown path.");
});

export { app };