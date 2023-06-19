import { Router } from "express";
import customers from "./customers";
import products from "./products";
import orders from "./orders";
import invoices from "./invoices";

const router = Router();

// Customers route
router.use("/customers", customers);

// Products route
router.use("/products", products);

// Orders route
router.use("/orders", orders);

// Invoices route
router.use("/invoices", invoices);

export default router;
