import { Router } from "express";
import {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orders.controller";

const router = Router();

// GET all order
router.route("/").get(getAllOrders);

// GET order by id
router.route("/:id").get(getOrder);

// CREATE new order
router.route("/").post(createOrder);

// UPDATE order
router.route("/:id").put(updateOrder);

// DELETE order by id
router.route("/:id").delete(deleteOrder);

export default router;
