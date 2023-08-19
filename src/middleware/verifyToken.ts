import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../errors/CustomError";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Get request header
  const authHeader = req.headers["authorization"];

  // Check if the
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new CustomError(
      "Unauthorized: Authorization token required",
      401
    );
    console.error(error);
    res.status(error.statusCode).send({ message: error.message });
  }

  // Get token from request header
  const authToken = authHeader?.split(" ")[1];

  // Verify authorization token
  authToken &&
    process.env.ACCESS_TOKEN_SECRET &&
    jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      // If the provided token is not valid, send error as a response
      if (err) {
        const error = new CustomError(
          "Forbidden: Authorization token not valid or expired",
          403
        );
        console.error(error);
        res.status(error.statusCode).send({ message: error.message });
      }

      // If the provided token is valid, add user info to the request payload
      req.user = {
        username: (decoded as UserInterface).username,
        isAdmin: (decoded as UserInterface).isAdmin,
      };
      next();
    });
};

export default verifyToken;
