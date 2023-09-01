import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { PrismaClient } from "../.prisma/client";

import CustomError from "../utils/CustomError";
import checkMissingFields from "../utils/checkMissingFields";
import generateToken from "../utils/generateToken";

const userClient = new PrismaClient().user;

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  // Check missing credentials
  const missingFieldsError = checkMissingFields({ username, password });
  if (missingFieldsError) {
    console.error(missingFieldsError);
    return res
      .status(missingFieldsError.statusCode)
      .send({ message: missingFieldsError.message });
  }

  // Check existing user
  const user = await userClient.findUnique({
    where: { username: username },
  });
  if (!user) {
    const error = new CustomError(`User ${username} does not exist`, 404);
    console.error(error);
    res.status(error.statusCode).send({ message: error.message });
  }

  // Check matching password
  const checkPassword =
    user?.password && (await bcrypt.compare(password, user.password));
  if (checkPassword == false) {
    const error = new CustomError(`Wrong password for user ${username}`, 401);
    console.error(error);
    res.status(error.statusCode).send({ message: error.message });
  }

  try {
    // On valid credentials, generate access token
    const accessToken =
      process.env.ACCESS_TOKEN_SECRET &&
      user?.username &&
      generateToken(
        user.username,
        user.isAdmin,
        process.env.ACCESS_TOKEN_SECRET,
        "15s"
      );
    // generateToken(user.username, user.isAdmin, process.env.ACCESS_TOKEN_SECRET, "10m");

    // On valid credentials, generate refresh token
    const refreshToken =
      process.env.REFRESH_TOKEN_SECRET &&
      user?.username &&
      generateToken(
        user.username,
        user.isAdmin,
        process.env.REFRESH_TOKEN_SECRET,
        "30s"
      );
    // generateToken(user.username, user.isAdmin, process.env.REFRESH_TOKEN_SECRET, "1d");

    // On valid credentials, save refresh token in a cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 30 * 1000,
      // maxAge: 24 * 60 * 60 * 1000, // expires in 1 day, matches refreshToken
    });

    res.json({ accessToken, isAdmin: user?.isAdmin || false });
  } catch (err) {
    next(err);
  }
};

const refresh = (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies;

    // If JWT cookie is not available, send a `401` response
    if (!cookies?.jwt) {
      const error = new CustomError("Unauthorized: Token required", 401);
      console.error(error);
      return res.status(error.statusCode).send({ message: error.message });
    }

    const refreshToken = cookies.jwt;

    process.env.REFRESH_TOKEN_SECRET &&
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        {},
        async (err, decoded) => {
          // If the provided token is not valid, send error as a response
          if (err) {
            const error = new CustomError(
              "Forbidden: Authorization token not valid or expired",
              403
            );
            console.error(error);
            return res
              .status(error.statusCode)
              .send({ message: error.message });
          }

          // Check existing user
          const user = await userClient.findUnique({
            where: { username: (decoded as UserInterface).username },
          });

          // Send 404 response on user not found
          if (!user) {
            const error = new CustomError(
              `Unauthorized: User ${
                (decoded as UserInterface).username || ""
              } not found`,
              404
            );
            console.error(error);
            return res
              .status(error.statusCode)
              .send({ message: error.message });
          }

          // If the user exists, generate a new access token
          const accessToken =
            process.env.ACCESS_TOKEN_SECRET &&
            user?.username &&
            generateToken(
              user.username,
              user.isAdmin,
              process.env.ACCESS_TOKEN_SECRET,
              "15s"
            );
          // generateToken(user.username, user.isAdmin, process.env.ACCESS_TOKEN_SECRET, "10m");

          res.json({ accessToken });
        }
      );
  } catch (err) {
    next(err);
  }
};

const logout = (req: Request, res: Response) => {
  const cookies = req.cookies;

  // Send empty response if cookie is not available
  if (!cookies?.jwt) return res.sendStatus(204);

  // Clear the cookie if available
  res.clearCookie("jwt", {
    // Pass same options provided on create except maxAge, else clear will fail
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.status(200).send("JWT cookie cleared");
};

export { login, logout, refresh };
