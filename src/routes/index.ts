import { Router } from "express";
import users from "./users";
import customers from "./customers";
import products from "./products";
import orders from "./orders";
import invoices from "./invoices";

const router = Router();

// Users route
router.use("/users", users);

// Customers route
router.use("/customers", customers);

// Products route
router.use("/products", products);

// Orders route
router.use("/orders", orders);

// Invoices route
router.use("/invoices", invoices);

export default router;
