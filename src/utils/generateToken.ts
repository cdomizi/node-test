import jwt from "jsonwebtoken";

const generateToken = (
  username: string,
  isAdmin: boolean,
  secret: string,
  duration: number
) => {
  return jwt.sign({ username, isAdmin }, secret, {
    expiresIn: duration,
  });
};

export default generateToken;
