import app from "./app";
import http from "http";
import dotenv from "dotenv";

// Configure dotenv for importing environment variables
dotenv.config();

const port = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
