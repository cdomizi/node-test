import { Router } from "express";
import {
  confirmPassword,
  createUser,
  deleteUser,
  getAllUsers,
  getUserByUsername,
  updateUser,
} from "../controllers/users.controller";
import { verifyToken } from "../middleware/verifyToken";

export const usersRouter = Router();

// CREATE new user
usersRouter.route("/").post(createUser);

// Protect users routes
usersRouter.use(verifyToken);

// GET all users
usersRouter.route("/").get(getAllUsers);

// GET user by username
usersRouter.route("/:username").get(getUserByUsername);

// UPDATE user
usersRouter.route("/:id").put(updateUser);

// DELETE user by id
usersRouter.route("/:id").delete(deleteUser);

// Password confirmation
usersRouter.route("/:id/password").post(confirmPassword);
