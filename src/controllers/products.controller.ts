import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "../.prisma/client";
import PrismaErrorHandler from "../errors/PrismaErrorHandler";
import CustomError from "../errors/CustomError";

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
    stock,
    description,
    thumbnail,
    images,
  } = req.body;
  try {
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
