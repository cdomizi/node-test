import { Router } from "express";
import customers from "./customers";
import products from "./products";

const router = Router();

// Customers route
router.use("/customers", customers);

// Products route
router.use("/products", products);

export default router;
