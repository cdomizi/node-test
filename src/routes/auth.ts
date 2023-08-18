import { Router } from "express";
import { login, logout, refresh } from "../controllers/auth.controller";

const router = Router();

// Log in user
router.route("/login").post(login);

// Log out user
router.route("/logout").post(logout);

// Refresh auth token
router.route("/refresh").post(refresh);

export default router;
