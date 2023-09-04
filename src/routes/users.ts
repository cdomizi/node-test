import { Router } from "express";
import verifyToken from "../middleware/verifyToken";
import {
  getAllUsers,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  confirmPassword,
} from "../controllers/users.controller";

const router = Router();

// CREATE new user
router.route("/").post(createUser);

// Protect users routes
router.use(verifyToken);

// GET all users
router.route("/").get(getAllUsers);

// GET user by username
router.route("/:username").get(getUserByUsername);

// UPDATE user
router.route("/:id").put(updateUser);

// DELETE user by id
router.route("/:id").delete(deleteUser);

// Password confirmation
router.route("/:id/password").post(confirmPassword);

export default router;
