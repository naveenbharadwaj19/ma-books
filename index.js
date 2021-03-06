import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { errorMiddleWare } from "./middlewares/error.js";
import { route as booksRoute } from "./routes/books.js";
import { queryParser } from "express-query-parser";
import { resJson } from "./models/res_json.js";
import helmet from "helmet";

const app = express();

dotenv.config();

app.use(helmet());
app.use(express.json());
app.use(
  queryParser({
    parseBoolean: true,
    parseNull: true,
    parseNumber: true,
    parseUndefined: true,
  }),
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// * routes
app.get("/", (req, res) => {
  resJson(res, 200, "Welcome to Ma-Books");
});
app.use("/api/books", booksRoute);

// * error middlewares
app.use(errorMiddleWare);
app.use("*", (req, res) => {
  res.status(404).send("Resource not found");
});

var PORT = process.env.PORT || 5000;
app.listen(PORT, () => `Running on the port:${PORT}`);
