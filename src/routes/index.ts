import { Router } from "express";
import { authRouter } from "./auth";
import { customersRouter } from "./customers";
import { invoicesRouter } from "./invoices";
import { ordersRouter } from "./orders";
import { productsRouter } from "./products";
import { usersRouter } from "./users";

export const routes = Router();

// Auth route
routes.use("/", authRouter);

// Users route
routes.use("/users", usersRouter);

// Customers route
routes.use("/customers", customersRouter);

// Products route
routes.use("/products", productsRouter);

// Orders route
routes.use("/orders", ordersRouter);

// Invoices route
routes.use("/invoices", invoicesRouter);
