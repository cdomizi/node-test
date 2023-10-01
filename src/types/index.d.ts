export {};

declare global {
  type UserType = {
    username: string;
    isAdmin: boolean;
  };
  namespace Express {
    type Request = {
      user: UserType | null;
    };
  }
}
