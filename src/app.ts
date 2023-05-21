import express, { json } from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("<h1>Node/Express App on TypeScript</h1>");
});

export default app;
