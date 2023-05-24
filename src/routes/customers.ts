import { Router } from "express";
import {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customers.controller";

const router = Router();

// GET all customers
router.route("/").get(getAllCustomers);

// GET customer by id
router.route("/:id").get(getCustomer);

// CREATE new customer
router.route("/").post(createCustomer);

// UPDATE customer
router.route("/:id").put(updateCustomer);

// DELETE customer by id
router.route("/:id").delete(deleteCustomer);

export default router;
