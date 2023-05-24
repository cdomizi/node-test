import { Request, Response } from "express";
import query from "../db";

const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const { rows } = await query("SELECT * FROM customers");
    res.send(rows);
  } catch (error) {
    console.error(error);
  }
};

const getCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { rows } = await query("SELECT * FROM customers WHERE id = $1", [id]);
    res.send(rows[0]);
  } catch (error) {
    console.error(error);
  }
};

const createCustomer = async (req: Request, res: Response) => {
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
};

const updateCustomer = async (req: Request, res: Response) => {
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
};

const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { rows } = await query("DELETE FROM customers WHERE id = $1", [id]);
    res.send(rows[0]);
  } catch (error) {
    console.error(error);
  }
};

export {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
