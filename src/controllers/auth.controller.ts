import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "../.prisma/client";
import CustomError from "../errors/CustomError";
import generateToken from "../utils/generateToken";

const userClient = new PrismaClient().user;

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  // Check missing credentials
  if (!username || !password) {
    const error = new CustomError("Please provide username and password", 400);
    console.error(error);
    res.status(error.statusCode).send({ message: error.message });
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
      sameSite: "strict",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // expires in 1 day, matches refreshToken
    });

    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

const refresh = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("refresh auth token");
    res.send();
  } catch (err) {
    console.error("token refresh error");
    next(err);
  }
};

const logout = (req: Request, res: Response) => {
  const cookies = req.cookies;

  // Send empty response if cookie is not available
  if (!cookies?.jwt) {
    res.sendStatus(200);
    return;
  }

  // Clear the cookie if available
  res.clearCookie("jwt", {
    // Pass the same options provided on create, else clear will fail
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.sendStatus(200).send("JWT cookie cleared");
  return;
};

export { login, logout, refresh };
