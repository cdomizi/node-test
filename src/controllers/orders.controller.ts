import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import PrismaErrorHandler from "../errors/PrismaErrorHandler";
import CustomError from "../errors/CustomError";
import getInvoiceIdNumber from "../utils/invoiceIdNumber";

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
        invoice: true,
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
        invoice: true,
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
    // Loop through the products to get the IDs
    const IDs = products.map((product: number) => ({ id: product }));
    // Calculate invoice `idNumber` if `invoice` is true
    const idNumber = invoice ? await getInvoiceIdNumber() : null;

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
            create: { idNumber },
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
  // Calculate invoice `idNumber` if `invoice` is true
  const idNumber = invoice ? await getInvoiceIdNumber() : null;

  try {
    const IDs = products.map((product: number) => ({ id: product }));

    // Get products on order
    const orderData = await orderClient.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: true,
      },
    });
    // Filter removed products
    const oldProducts = await orderData?.products
      // Get product IDs
      ?.map((product) => product.id)
      // Select IDs not present in request payload
      ?.filter(
        (id) => !IDs.some((product: { id: number }) => product.id === id)
      )
      // Format correctly
      ?.map((id) => ({ id }));

    const order = await orderClient.update({
      where: { id: parseInt(id) },
      data: {
        customer: {
          connect: { id: customerId },
        },
        products: {
          connect: [...IDs],
          // Only disconnect products if removed on update
          ...(oldProducts?.length && { disconnect: oldProducts }),
        },
        // Only generate/connect an invoice if `invoice` is true
        ...(invoice && {
          invoice: {
            connectOrCreate: {
              create: { idNumber },
              where: {
                orderId: parseInt(id),
                idNumber,
              },
            },
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
