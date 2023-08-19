export {};

declare global {
  interface UserInterface {
    username: string;
    isAdmin: boolean;
  }
  namespace Express {
    interface Request {
      user: UserInterface | null;
    }
  }
}
