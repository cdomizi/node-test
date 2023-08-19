import app from "./app";
import http from "http";
import "dotenv/config";

const port = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV}...`);
});
