import { RequestHandler } from "express";
import { Prisma, PrismaClient } from "../.prisma/client";

import { PrismaErrorHandler } from "../middleware/PrismaErrorHandler";
import { CustomError } from "../utils/CustomError";
import { checkMissingFields } from "../utils/validateAuth";

const customerClient = new PrismaClient().customer;

type Customer = {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
};

type CustomerParams = {
  id: string;
};

type CustomerRequestHandler = RequestHandler<CustomerParams, unknown, Customer>;

const getAllCustomers: RequestHandler = async (req, res, next) => {
  try {
    const allCustomers = await customerClient.findMany({
      include: { orders: true },
    });
    res.status(200).send(allCustomers);
  } catch (err) {
    next(err);
  }
};

const getCustomer: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await customerClient.findUnique({
      where: { id: parseInt(id) },
      include: { orders: true },
    });

    if (!customer) {
      const error = new CustomError(
        `Customer with id ${id} does not exist.`,
        404,
      );
      console.error(error);
      res.status(error.statusCode).send({ message: error.message });
    } else res.status(200).send(customer);
  } catch (err) {
    next(err);
  }
};

const createCustomer: CustomerRequestHandler = async (req, res, next) => {
  const { firstName, lastName, address, email } = req.body;
  try {
    // If any required field is missing, return an error
    const missingFieldsError = checkMissingFields({
      firstName,
      lastName,
      address,
      email,
    });
    if (missingFieldsError instanceof CustomError) {
      console.error(missingFieldsError);
      return res
        .status(missingFieldsError.statusCode)
        .send({ message: missingFieldsError.message });
    }
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

const updateCustomer: CustomerRequestHandler = async (req, res, next) => {
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

const deleteCustomer: RequestHandler = async (req, res, next) => {
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
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomer,
  updateCustomer,
};
