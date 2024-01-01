import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomer,
  updateCustomer,
} from "@controllers/customers.controller";
import { Router } from "express";

export const customersRouter = Router();

// GET all customers
customersRouter.route("/").get(getAllCustomers);

// GET customer by id
customersRouter.route("/:id").get(getCustomer);

// CREATE new customer
customersRouter.route("/").post(createCustomer);

// UPDATE customer
customersRouter.route("/:id").put(updateCustomer);

// DELETE customer by id
customersRouter.route("/:id").delete(deleteCustomer);
