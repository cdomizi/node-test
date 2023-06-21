import { Router } from "express";
import {
  getAllInvoices,
  getInvoiceById,
  getInvoiceByOrderId,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoices.controller";

const router = Router();

// GET all invoices
router.route("/").get(getAllInvoices);

// GET invoice by id
router.route("/:id").get(getInvoiceById);

// GET invoice by orderId
router.route("/order/:orderId").get(getInvoiceByOrderId);

// UPDATE invoice
router.route("/:id").put(updateInvoice);

// DELETE invoice by id
router.route("/:id").delete(deleteInvoice);

export default router;
