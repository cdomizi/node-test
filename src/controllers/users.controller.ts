import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "../.prisma/client";
import PrismaErrorHandler from "../errors/PrismaErrorHandler";
import CustomError from "../errors/CustomError";
import bcrypt from "bcrypt";

const userClient = new PrismaClient().user;

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allUsers = await userClient.findMany();
    res.status(200).send(allUsers);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await userClient.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      const error = new CustomError(`User with id ${id} does not exist`, 404);
      console.error(error);
      res.status(error.statusCode).send({ message: error.message });
    } else res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, isAdmin = false } = req.body;
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userClient.create({
      data: {
        username: username,
        password: hashedPassword,
        isAdmin: isAdmin,
      },
    });

    res.status(201).send(user);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { username, password, isAdmin = false } = req.body;
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userClient.update({
      where: { id: parseInt(id) },
      data: {
        username: username,
        password: hashedPassword,
        isAdmin: isAdmin,
      },
    });

    res.status(200).send(user);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const user = await userClient.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).send(user);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
