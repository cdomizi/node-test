import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/CustomError";

export const verifyToken: RequestHandler = (req, res, next) => {
  // Get request header
  const authHeader = req.headers.authorization;

  // Check if authorization header exists & is well formatted
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new CustomError(
      "Unauthorized: Authorization token required",
      401,
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
          403,
        );
        console.error(error);
        return res.status(error.statusCode).send({ message: error.message });
      }

      // If the provided token is valid, add user info to the request payload
      req.user = {
        username: (decoded as UserType).username,
        isAdmin: (decoded as UserType).isAdmin,
      };
      next();
    });
};
