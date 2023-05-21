import { Router } from "express";
import query from "../db";

const router = Router();

router.route("/").get(async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM customers");
    res.send(rows);
  } catch (error) {
    console.error(error);
  }
});

export default router;
