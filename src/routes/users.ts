import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller";

const router = Router();

// GET all users
router.route("/").get(getAllUsers);

// GET user by id
router.route("/:id").get(getUserById);

// CREATE new user
router.route("/").post(createUser);

// UPDATE user
router.route("/:id").put(updateUser);

// DELETE user by id
router.route("/:id").delete(deleteUser);

export default router;
