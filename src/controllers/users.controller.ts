import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const userClient = new PrismaClient().user;

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allUsers = await userClient.findMany();
    res.status(200).send(allUsers);
  } catch (err) {
    next(err);
  }
};

export { getAllUsers };
