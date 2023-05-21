import { Router } from "express";
import query from "../db";

const router = Router();

// GET all customers
router.route("/").get(async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM customers");
    res.send(rows);
  } catch (error) {
    console.error(error);
  }
});

// GET customer by id
router.route("/:id").get(async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await query("SELECT * FROM customers WHERE id = $1", [id]);
    res.send(rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// CREATE new customer
router.route("/").post(async (req, res) => {
  const { firstName, lastName, address, email } = req.body;
  try {
    const { rows } = await query(
      "INSERT INTO customers (firstName, lastName, address, email) VALUES ($1, $2, $3, $4) RETURNING *",
      [firstName, lastName, address, email]
    );
    res.send(rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// UPDATE new customer
router.route("/:id").put(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, address, email } = req.body;
  try {
    const { rows } = await query(
      "UPDATE customers SET firstName = $2, lastName = $3, address = $4, email = $5 WHERE id = $1",
      [id, firstName, lastName, address, email]
    );
    res.send(rows[0]);
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    console.error(error);
  }
});

// DELETE customer by id
router.route("/:id").delete(async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await query("DELETE FROM customers WHERE id = $1", [id]);
    res.send(rows[0]);
  } catch (error) {
    console.error(error);
  }
});

export default router;
