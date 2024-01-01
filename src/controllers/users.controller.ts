import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { Prisma, PrismaClient } from "../.prisma/client";

import { PrismaErrorHandler } from "../middleware/PrismaErrorHandler";
import { CustomError } from "../utils/CustomError";
import { generateToken } from "../utils/generateToken";
import {
  checkMissingFields,
  checkPassword,
  decodeJWT,
} from "../utils/validateAuth";
import {
  JWTCookie,
  accessTokenMaxAge,
  refreshTokenMaxAge,
} from "./auth.controller";

const userClient = new PrismaClient().user;

type UserData = { id: number; password: string };

type UserRequestBody = { username: string; password: string; isAdmin: boolean };

type UserRequestHandler<TBody = UserRequestBody> = RequestHandler<
  ParamsDictionary,
  unknown,
  TBody
>;

const getAllUsers: RequestHandler = async (req, res, next) => {
  // Get user admin status
  const adminUser = req.user?.isAdmin;

  try {
    // Restrict method to admins only
    if (adminUser) {
      const allUsers = await userClient.findMany();
      res.status(200).send(allUsers);
    } else {
      // Set error message and statusCode based on request `user` property
      const error = req.user
        ? new CustomError("Forbidden: User is not an admin", 403)
        : new CustomError("Unauthorized: Authentication required", 401);
      console.error(error);
      res.status(error.statusCode).send({ message: error.message });
    }
  } catch (err) {
    next(err);
  }
};

const getUserByUsername: RequestHandler = async (req, res, next) => {
  const { username } = req.params;

  try {
    const user = await userClient.findUnique({
      where: { username: username },
    });

    if (!user) {
      const error = new CustomError(
        `User with username ${username} does not exist`,
        404,
      );
      console.error(error);
      res.status(error.statusCode).send({ message: error.message });
    } else {
      const { isAdmin } = user;

      // Restrict method to admins and the user itself
      if (isAdmin || username === user.username) {
        res.status(200).send(user);
      } else {
        const error = new CustomError("Forbidden: User is not an admin", 403);
        console.error(error);
        res.status(error.statusCode).send({ message: error.message });
      }
    }
  } catch (err) {
    next(err);
  }
};

const createUser: UserRequestHandler = async (req, res, next) => {
  const { username, password, isAdmin = false } = req.body;

  try {
    // If any required field is missing, return an error
    const missingFieldsError = checkMissingFields({ username, password });
    if (missingFieldsError) {
      console.error(missingFieldsError);
      return res
        .status(missingFieldsError.statusCode)
        .send({ message: missingFieldsError.message });
    }

    // Validate username to be 3+ characters long
    if (username?.length < 3) {
      const error = new CustomError(
        "Username must be at least 3 characters long",
        400,
      );
      console.error(error);
      return res.status(error.statusCode).send({ message: error.message });
    }

    // Validate password to be 6+ characters long
    if (password?.length < 6) {
      const error = new CustomError(
        "Password must be at least 6 characters long",
        400,
      );
      console.error(error);
      return res.status(error.statusCode).send({ message: error.message });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userClient.create({
      data: {
        username: username,
        password: hashedPassword,
        isAdmin: isAdmin,
      },
    });

    const accessToken =
      process.env.ACCESS_TOKEN_SECRET &&
      user?.username &&
      generateToken(
        user.username,
        user.isAdmin,
        process.env.ACCESS_TOKEN_SECRET,
        accessTokenMaxAge,
      );

    const refreshToken =
      process.env.REFRESH_TOKEN_SECRET &&
      user?.username &&
      generateToken(
        user.username,
        user.isAdmin,
        process.env.REFRESH_TOKEN_SECRET,
        refreshTokenMaxAge,
      );

    // Save refresh token in a cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // expires in 1 day, matches refreshToken
    });

    res.status(201).send({
      accessToken,
      id: user?.id,
      username: user?.username,
      isAdmin: user?.isAdmin,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

const updateUser: UserRequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const {
    username: newUsername = null,
    password = null,
    isAdmin = null,
  } = req.body;

  // Get request user username & admin status
  const adminUser = req.user?.isAdmin;
  const reqUsername = req.user?.username;

  // Get user username
  const userData = await userClient.findUnique({ where: { id: parseInt(id) } });
  const username = userData?.username;

  try {
    // Restrict method to admins and the user itself
    if (
      (adminUser || username === reqUsername) &&
      // Further restrict changing roles to admins only
      !(!adminUser && isAdmin)
    ) {
      // Hash password
      const hashedPassword = password && (await bcrypt.hash(password, 10));

      const user = await userClient.update({
        where: { id: parseInt(id) },
        data: {
          // Only update data provided in the request body
          username: newUsername || username,
          password: hashedPassword || userData?.password,
          isAdmin: isAdmin ?? userData?.isAdmin ?? false,
        },
      });
      res.status(200).send(user);
    } else {
      const error = new CustomError("Forbidden: User is not an admin", 403);
      console.error(error);
      res.status(error.statusCode).send({ message: error.message });
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

const deleteUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  // Get request user username & role
  const adminUser = req.user?.isAdmin;
  const reqUsername = req.user?.username;

  // Get user username
  const userData = await userClient.findUnique({ where: { id: parseInt(id) } });
  const username = userData?.username;

  try {
    // Restrict method to admins and the user itself
    if (adminUser || username === reqUsername) {
      const user = await userClient.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).send(user);
    } else {
      const error = new CustomError("Forbidden: User is not an admin", 403);
      console.error(error);
      return res.status(error.statusCode).send({ message: error.message });
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

const confirmPassword: UserRequestHandler<UserData> = async (
  req,
  res,
  next,
) => {
  const { id, password } = req.body;
  const cookies = req?.cookies as JWTCookie;
  const authToken = cookies?.jwt;

  // Get user data
  const userData = await userClient.findUnique({ where: { id: parseInt(id) } });

  try {
    // Identify the user via data encoded in JWT cookie
    const { username } = decodeJWT(authToken);

    // Restrict method to the user itself
    if (username === userData?.username) {
      // Check matching password
      const match =
        userData?.password &&
        (await checkPassword(password, userData?.password));
      // Send error if password is wrong
      if (!match) {
        const error = new CustomError(
          `Wrong password for user ${userData?.username}`,
          401,
        );
        console.error(error);
        res.status(error.statusCode).send({ message: error.message });
      }
      // If the password matches, send 200 response
      res.status(200).send("Password OK");
    } else {
      // If it is not the user themselves performing the action, throw 403 error
      const error = new CustomError("Forbidden", 403);
      console.error(error);
      res.status(error.statusCode).send({ message: error.message });
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

export {
  confirmPassword,
  createUser,
  deleteUser,
  getAllUsers,
  getUserByUsername,
  updateUser,
};
