import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "../.prisma/client";
import PrismaErrorHandler from "../middleware/PrismaErrorHandler";
import CustomError from "../utils/CustomError";
import { checkMissingFields } from "../utils/validateAuth";

const productClient = new PrismaClient().product;

const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allProducts = await productClient.findMany({
      include: { orders: true },
    });
    res.status(200).send(allProducts);
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await productClient.findUnique({
      where: { id: parseInt(id) },
      include: { orders: true },
    });

    if (!product) {
      const error = new CustomError(
        `Product with id ${id} does not exist.`,
        400
      );
      console.error(error);
      res.status(error.statusCode).send({ message: error.message });
    } else res.status(200).send(product);
  } catch (err) {
    next(err);
  }
};

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    title,
    brand,
    category,
    price,
    discountPercentage,
    rating,
    stock = 0,
    description,
    thumbnail,
    images = [],
  } = req.body;
  try {
    // If any required field is missing, return an error
    const missingFieldsError = checkMissingFields({ title, price });
    if (missingFieldsError) {
      console.error(missingFieldsError);
      return res
        .status(missingFieldsError.statusCode)
        .send({ message: missingFieldsError.message });
    }
    const product = await productClient.create({
      data: {
        title,
        brand,
        category,
        price,
        discountPercentage,
        rating,
        stock: parseInt(stock),
        description,
        thumbnail,
        images,
      },
    });

    res.status(201).send(product);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const {
    title,
    brand,
    category,
    price,
    discountPercentage,
    rating,
    stock,
    description,
    thumbnail,
    images,
  } = req.body;
  try {
    const product = await productClient.update({
      where: { id: parseInt(id) },
      data: {
        title,
        brand,
        category,
        price,
        discountPercentage,
        rating,
        stock: parseInt(stock),
        description,
        thumbnail,
        images,
      },
    });

    res.status(200).send(product);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const product = await productClient.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).send(product);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      PrismaErrorHandler(err, req, res, next);
    } else next(err);
  }
};

export {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
