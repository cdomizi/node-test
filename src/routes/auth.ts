import { login, logout, refresh } from "@controllers/auth.controller";
import { Router } from "express";

export const authRouter = Router();

// Log in user
authRouter.route("/login").post(login);

// Refresh auth token
authRouter.route("/refresh").get(refresh);

// Log out user
authRouter.route("/logout").get(logout);
