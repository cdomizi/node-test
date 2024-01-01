import jwt from "jsonwebtoken";

export const generateToken = (
  username: string,
  isAdmin: boolean,
  secret: string,
  duration: number,
) => {
  return jwt.sign({ username, isAdmin }, secret, {
    expiresIn: duration,
  });
};
