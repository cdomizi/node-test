/* eslint-disable @typescript-eslint/consistent-type-definitions */
export {};

declare global {
  type UserType = {
    username: string;
    isAdmin: boolean;
  };
  namespace Express {
    interface Request {
      user: UserType | null;
    }
  }
}
