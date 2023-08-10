import { Router } from "express";
import { getAllUsers } from "../controllers/users.controller";

const router = Router();

// GET all users
router.route("/").get(getAllUsers);

export default router;
