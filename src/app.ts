import express, { json, Express, Request, Response } from "express";
import routes from "./routes";

const app: Express = express();

app.use(json());

app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Node/Express App on TypeScript</h1>");
});

export default app;
