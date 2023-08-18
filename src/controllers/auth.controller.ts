import { Request, Response, NextFunction } from "express";

const login = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("log in user");
    res.send();
  } catch (err) {
    console.error("login error");
    next(err);
  }
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
