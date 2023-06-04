import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import PrismaErrorHandler from "../errors/PrismaErrorHandler";
import CustomError from "../errors/CustomError";

const invoiceClient = new PrismaClient().invoice;

const getAllInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allInvoices = await invoiceClient.findMany({
      include: {
        customer: true,
        products: true,
      },
    });
    res.status(200).send(allInvoices);
  } catch (err) {
    next(err);
  }
};

const getInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceClient.findUnique({
      where: { id: parseInt(id) },
      include: {
        customer: true,
        products: true,
      },
    });

    if (!invoice) {
      const error = new CustomError(
        `Invoice with id ${id} does not exist.`,
        400
      );
      console.error(error);
      res.status(error.statusCode).send({ message: error.message });
    } else res.status(200).send(invoice);
  } catch (err) {
    next(err);
  }
};

const createInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { customerId, products } = req.body;
  try {
    const IDs = products.map((product: number) => ({ id: product }));
    console.log(IDs);
    const invoice = await invoiceClient.create({
      data: {
        customer: {
          connect: { id: customerId },
        },
        products: {
          connect: [...IDs],
        },
      },
      include: {
        customer: true,
        products: true,
      },
    });

    res.status(201).send(invoice);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

const updateInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { customerId, paid, products } = req.body;
  try {
    const IDs = products.map((product: number) => ({ id: product }));
    const invoice = await invoiceClient.update({
      where: { id: parseInt(id) },
      data: {
        customer: {
          connect: { id: customerId },
        },
        paid,
        products: {
          connect: [...IDs],
        },
      },
      include: {
        customer: true,
        products: true,
      },
    });

    res.status(200).send(invoice);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

const deleteInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const invoice = await invoiceClient.delete({
      where: { id: parseInt(id) },
      include: {
        customer: true,
        products: true,
      },
    });

    res.status(200).send(invoice);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

export {
  getAllInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
