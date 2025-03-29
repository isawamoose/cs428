import express from "express";
export const secureApiRouter = express.Router();

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

module.exports = secureApiRouter;