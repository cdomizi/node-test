import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

// Configure dotenv for importing environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Node/Express App on TypeScript</h1>");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
