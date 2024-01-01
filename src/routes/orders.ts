import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
  updateOrder,
} from "@controllers/orders.controller";
import { Router } from "express";

export const ordersRouter = Router();

// GET all order
ordersRouter.route("/").get(getAllOrders);

// GET order by id
ordersRouter.route("/:id").get(getOrder);

// CREATE new order
ordersRouter.route("/").post(createOrder);

// UPDATE order
ordersRouter.route("/:id").put(updateOrder);

// DELETE order by id
ordersRouter.route("/:id").delete(deleteOrder);
