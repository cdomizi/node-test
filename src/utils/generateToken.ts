import jwt from "jsonwebtoken";

const generateToken = (
  username: string,
  isAdmin: boolean,
  secret: string,
  duration: string | number = "1d"
) => {
  return jwt.sign({ username, isAdmin }, secret, {
    expiresIn: duration,
  });
};

export default generateToken;
