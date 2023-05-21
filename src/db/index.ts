import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  database: process.env.DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const query = (text: string, params: string[] = []) => {
  return pool.query(text, params);
};

export default query;
