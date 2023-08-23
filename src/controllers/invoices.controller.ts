import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "../.prisma/client";
import PrismaErrorHandler from "../middleware/PrismaErrorHandler";
import CustomError from "../utils/CustomError";

const invoiceClient = new PrismaClient().invoice;

const getAllInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allInvoices = await invoiceClient.findMany({
      include: {
        order: true,
      },
    });
    res.status(200).send(allInvoices);
  } catch (err) {
    next(err);
  }
};

const getInvoiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceClient.findUnique({
      where: { id: parseInt(id) },
      include: {
        order: true,
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

// Get invoices from a provided date
const getInvoicesFromDate = async (date: Date) => {
  try {
    const invoices = await invoiceClient.findMany({
      where: {
        createdAt: {
          gte: date,
        },
      },
    });
    return invoices;
  } catch (err) {
    console.error(err);
  }
};

const updateInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { paid } = req.body;

  try {
    const invoice = await invoiceClient.update({
      where: { id: parseInt(id) },
      data: {
        paid,
      },
      include: {
        order: true,
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
        order: true,
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
  getInvoicesFromDate,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
