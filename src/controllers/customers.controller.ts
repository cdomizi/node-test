import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import PrismaErrorHandler from "../errors/PrismaErrorHandler";
import CustomError from "../errors/CustomError";

const customersClient = new PrismaClient().customer;

const getAllCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allCustomers = await customersClient.findMany();
    res.status(200).send(allCustomers);
  } catch (err) {
    next(err);
  }
};

const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const customer = await customersClient.findUnique({
      where: { id: parseInt(id) },
    });

    if (!customer) {
      const error = new CustomError(
        `Customer with id ${id} does not exist.`,
        400
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
  const { firstName, lastName, address, email, invoices } = req.body;
  try {
    const customer = await customersClient.create({
      data: {
        firstName,
        lastName,
        address,
        email,
        invoices: invoices,
      },
    });

    res.status(201).send(customer);
  } catch (err) {
    next(err);
  }
};

const updateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { firstName, lastname: lastName, address, email } = req.body;
  try {
    const customer = await customersClient.update({
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
    const customer = await customersClient.delete({
      where: { id: parseInt(id) },
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
