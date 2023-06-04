import { Router } from "express";
import {
  getAllInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoices.controller";

const router = Router();

// GET all invoices
router.route("/").get(getAllInvoices);

// GET invoice by id
router.route("/:id").get(getInvoice);

// CREATE new invoice
router.route("/").post(createInvoice);

// UPDATE invoice
router.route("/:id").put(updateInvoice);

// DELETE invoice by id
router.route("/:id").delete(deleteInvoice);

export default router;
