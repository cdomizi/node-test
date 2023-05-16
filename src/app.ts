import express, { Express, Request, Response } from "express";

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Node/Express App on TypeScript</h1>");
});

export default app;
