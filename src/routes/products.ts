import { Router } from "express";
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller";

const router = Router();

// GET all products
router.route("/").get(getAllProducts);

// GET product by id
router.route("/:id").get(getProduct);

// CREATE new product
router.route("/").post(createProduct);

// UPDATE product
router.route("/:id").put(updateProduct);

// DELETE product by id
router.route("/:id").delete(deleteProduct);

export default router;
