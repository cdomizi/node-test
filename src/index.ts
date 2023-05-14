import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("<h1>Node/Express App on TypeScript</h1>");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
