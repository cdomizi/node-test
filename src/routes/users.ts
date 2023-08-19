import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller";
import verifyToken from "../middleware/verifyToken";

const router = Router();

// CREATE new user
router.route("/").post(createUser);

// Protect users routes
router.use(verifyToken);

// GET all users
router.route("/").get(getAllUsers);

// GET user by id
router.route("/:id").get(getUserById);

// UPDATE user
router.route("/:id").put(updateUser);

// DELETE user by id
router.route("/:id").delete(deleteUser);

export default router;
