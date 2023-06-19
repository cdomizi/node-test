import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import PrismaErrorHandler from "../errors/PrismaErrorHandler";
import CustomError from "../errors/CustomError";
import getInvoiceIdNumber from "../utils/getInvoiceIdNumber";

const orderClient = new PrismaClient().order;

const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allOrders = await orderClient.findMany({
      include: {
        customer: true,
        products: true,
      },
    });
    res.status(200).send(allOrders);
  } catch (err) {
    next(err);
  }
};

const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const order = await orderClient.findUnique({
      where: { id: parseInt(id) },
      include: {
        customer: true,
        products: true,
      },
    });

    if (!order) {
      const error = new CustomError(`Order with id ${id} does not exist.`, 400);
      console.error(error);
      res.status(error.statusCode).send({ message: error.message });
    } else res.status(200).send(order);
  } catch (err) {
    next(err);
  }
};

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { customerId, products, invoice } = req.body;

  try {
    // Only create invoice number if `invoice` is true
    let invoiceId;
    if (invoice) {
      const { idNumber, idNum, idDate } = getInvoiceIdNumber(
        req.app.locals.idNum,
        req.app.locals.idDate
      );
      invoiceId = idNumber;
      // Update global variables
      req.app.locals.idNum = idNum;
      req.app.locals.idDate = idDate;
    }

    const IDs = products.map((product: number) => ({ id: product }));
    const order = await orderClient.create({
      data: {
        customer: {
          connect: { id: customerId },
        },
        products: {
          connect: [...IDs],
        },
        // Only generate an invoice if `invoice` is true
        ...(invoice && {
          invoice: {
            create: { idNumber: invoiceId },
          },
        }),
      },
      include: {
        customer: true,
        products: true,
        invoice: !!invoice,
      },
    });

    res.status(201).send(order);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { customerId, products, invoice } = req.body;

  try {
    // Only create invoice number if `invoice` is true
    let invoiceId;
    if (invoice) {
      const { idNumber, idNum, idDate } = getInvoiceIdNumber(
        req.app.locals.idNum,
        req.app.locals.idDate
      );
      invoiceId = idNumber;
      // Update global variables
      req.app.locals.idNum = idNum;
      req.app.locals.idDate = idDate;
    }

    const IDs = products.map((product: number) => ({ id: product }));
    const order = await orderClient.update({
      where: { id: parseInt(id) },
      data: {
        customer: {
          connect: { id: customerId },
        },
        products: {
          connect: [...IDs],
        },
        // Only generate an invoice if `invoice` is true
        ...(invoice && {
          invoice: {
            create: { idNumber: invoiceId },
          },
        }),
      },
      include: {
        customer: true,
        products: true,
        invoice: !!invoice,
      },
    });

    res.status(201).send(order);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const order = await orderClient.delete({
      where: { id: parseInt(id) },
      include: {
        customer: true,
        products: true,
        invoice: true,
      },
    });

    res.status(200).send(order);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

export { getAllOrders, getOrder, createOrder, updateOrder, deleteOrder };
