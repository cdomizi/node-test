import { Router } from "express";
import customers from "./customers";
import products from "./products";
import invoices from "./invoices";

const router = Router();

// Customers route
router.use("/customers", customers);

// Products route
router.use("/products", products);

// Invoices route
router.use("/invoices", invoices);

export default router;
