import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "../.prisma/client";
import PrismaErrorHandler from "../middleware/errors/PrismaErrorHandler";
import CustomError from "../middleware/errors/CustomError";

const customerClient = new PrismaClient().customer;

const getAllCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allCustomers = await customerClient.findMany({
      include: { orders: true },
    });
    res.status(200).send(allCustomers);
  } catch (err) {
    next(err);
  }
};

const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const customer = await customerClient.findUnique({
      where: { id: parseInt(id) },
      include: { orders: true },
    });

    if (!customer) {
      const error = new CustomError(
        `Customer with id ${id} does not exist.`,
        404
      );
      console.error(error);
      res.status(error.statusCode).send({ message: error.message });
    } else res.status(200).send(customer);
  } catch (err) {
    next(err);
  }
};

const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, address, email } = req.body;
  try {
    const customer = await customerClient.create({
      data: {
        firstName,
        lastName,
        address,
        email,
      },
    });

    res.status(201).send(customer);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

const updateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { firstName, lastName, address, email } = req.body;
  try {
    const customer = await customerClient.update({
      where: { id: parseInt(id) },
      data: {
        firstName,
        lastName,
        address,
        email,
      },
    });

    res.status(200).send(customer);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

const deleteCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const customer = await customerClient.delete({
      where: { id: parseInt(id) },
      include: { orders: true },
    });

    res.status(200).send(customer);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

export {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
