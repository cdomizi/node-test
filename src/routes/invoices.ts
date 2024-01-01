import {
  deleteInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
} from "@controllers/invoices.controller";
import { verifyToken } from "@middleware/verifyToken";
import { Router } from "express";

export const invoicesRouter = Router();

// GET all invoices
invoicesRouter.route("/").get(getAllInvoices);

// GET invoice by id
invoicesRouter.route("/:id").get(getInvoiceById);

// Protect invoices UPDATE and DELETE routes
invoicesRouter.use(verifyToken);

// UPDATE invoice
invoicesRouter.route("/:id").put(updateInvoice);

// DELETE invoice by id
invoicesRouter.route("/:id").delete(deleteInvoice);
