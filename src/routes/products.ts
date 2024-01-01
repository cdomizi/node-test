import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "@controllers/products.controller";
import { Router } from "express";

export const productsRouter = Router();

// GET all products
productsRouter.route("/").get(getAllProducts);

// GET product by id
productsRouter.route("/:id").get(getProduct);

// CREATE new product
productsRouter.route("/").post(createProduct);

// UPDATE product
productsRouter.route("/:id").put(updateProduct);

// DELETE product by id
productsRouter.route("/:id").delete(deleteProduct);
