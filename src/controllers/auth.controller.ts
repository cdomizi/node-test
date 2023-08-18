import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../.prisma/client";
import CustomError from "../errors/CustomError";
import bcrypt from "bcrypt";

const userClient = new PrismaClient().user;

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Check missing credentials
  if (!username || !password) {
    const error = new CustomError("Please provide user name and password", 400);
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

  res.json(`User ${username} logged in`);
  // res.json({ accessToken })
};

const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("log out user");
    res.send();
  } catch (err) {
    console.error("logout error");
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

export { login, logout, refresh };
