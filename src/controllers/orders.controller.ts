import { Prisma, PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";

import { PrismaErrorHandler } from "@middleware/PrismaErrorHandler";
import { CustomError } from "@utils/CustomError";
import { getInvoiceIdNumber } from "@utils/invoiceIdNumber";
import { checkMissingFields } from "@utils/validateAuth";

const orderClient = new PrismaClient().order;

type Product = { id: number; quantity: number | null };

type OrderRequestBody = {
  customerId: number;
  products: Product[];
  invoice: string;
};

type OrderRequestHandler = RequestHandler<
  ParamsDictionary,
  unknown,
  OrderRequestBody
>;

const getAllOrders: RequestHandler = async (req, res, next) => {
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

const getOrder: RequestHandler = async (req, res, next) => {
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

const createOrder: OrderRequestHandler = async (req, res, next) => {
  const { customerId, products, invoice } = req.body;

  // If any required field is missing, return an error
  const missingFieldsError = checkMissingFields({ customerId, products });
  if (missingFieldsError) {
    console.error(missingFieldsError);
    return res
      .status(missingFieldsError.statusCode)
      .send({ message: missingFieldsError.message });
  }

  try {
    // Calculate invoice `idNumber` if `invoice` is true
    const idNumber = invoice ? await getInvoiceIdNumber() : null;

    const order = await orderClient.create({
      data: {
        // Connect the customer
        customer: {
          connect: { id: customerId },
        },
        // Loop through products, connect each by id & add respective quantities
        products: {
          create: products.map((product: Product) => ({
            product: { connect: { id: product.id } },
            quantity: product?.quantity || 1,
          })),
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

const updateOrder: OrderRequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { customerId, products, invoice } = req.body;
  // Calculate invoice `idNumber` if `invoice` is true
  const idNumber = invoice ? await getInvoiceIdNumber() : null;

  try {
    // Check if an invoice for the order
    const checkInvoice = async () => {
      const orderData = await orderClient.findFirst({
        where: { id: parseInt(id) },
        include: { invoice: true },
      });
      return !!orderData?.invoice;
    };

    const order = await orderClient.update({
      where: { id: parseInt(id) },
      data: {
        // Connect the customer
        customer: {
          connect: { id: customerId },
        },
        // Loop through products, update each by id & add respective quantities
        products: {
          deleteMany: { orderId: parseInt(id) },
          create: products.map((product: Product) => ({
            product: { connect: { id: product.id } },
            quantity: product?.quantity || 1,
          })),
        },
        invoice: {
          // Delete invoice on update if exists
          ...((await checkInvoice()) && { delete: true }),
          // Only generate/connect an invoice if `invoice` is true
          ...(invoice && {
            create: { idNumber },
          }),
        },
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

const deleteOrder: RequestHandler = async (req, res, next) => {
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

export { createOrder, deleteOrder, getAllOrders, getOrder, updateOrder };
