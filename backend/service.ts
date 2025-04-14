import express from "express";
import bodyParser from "body-parser";
import { UserService } from "./service/userService";
import cookieParser from "cookie-parser";
import { db } from "./database/Database";
import matchRouter from "./routes/MatchRouter";
import authRouter from "./routes/AuthRouter";
import profileRouter from "./routes/ProfileRouter";
import messageRouter from "./routes/MesssageRouter";

declare global {
  namespace Express {
    interface Request {
      email?: string;
    }
  }
}

const app = express();
const userService = new UserService(db);

const AUTH_COOKIE_NAME = "token";
app.use(cookieParser());
app.use(bodyParser.json());

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.use(authRouter);

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
    const emailFromToken = await userService.getUsernameFromToken(authToken);
    if (!emailFromToken) {
      res.status(401).send({ msg: "Unauthorized" });
      return;
    }
    req.email = emailFromToken;
    next();
  } catch (e) {
    res.status(401).send({ msg: "Unauthorized" });
  }
});

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

// Profile routes
secureApiRouter.use(profileRouter);

// Match routes
secureApiRouter.use(matchRouter);

// Message routes
secureApiRouter.use(messageRouter);

// Return default message if the path is unknown
app.use((_req, res) => {
  res.send("Welcome to Puppr! You are attempting to reach an unknown path.");
});

export { app };
