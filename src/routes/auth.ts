import { Router } from "express";
import { login, logout, refresh } from "../controllers/auth.controller";

const router = Router();

// Log in user
router.route("/login").post(login);

// Refresh auth token
router.route("/refresh").post(refresh);

// Log out user
router.route("/logout").get(logout);

export default router;
