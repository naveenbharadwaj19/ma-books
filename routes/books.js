import fs from "fs";
import _ from "lodash";
import { Router } from "express";
import { resJson } from "../models/res_json.js";
import { createBook, deleteBook } from "../schemas/book_schema.js";

export const route = Router();

const rawBooksData = fs.readFileSync("books.json");
const booksData = JSON.parse(rawBooksData);

route.get("/", (req, res) => {
  res.status(200).send(booksData);
});

route.get("/search/:title", (req, res) => {
  let title = req.params.title;

  if (title.includes(" "))
    return res.status(400).json({
      status: res.statusCode,
      message: "Cannot have spaces.- allowed",
    });

  title = title.replace(/-/g, " ");

  const book = booksData.find((e) => title === e.title);

  if (typeof book === "undefined")
    return res
      .status(404)
      .json({ status: res.statusCode, message: "Book does not exists" });

  res.status(200).json({
    status: res.statusCode,
    message: book,
  });
});

route.get("/search", (req, res) => {
  let language = req.query.language;

  if (typeof language === "undefined")
    return resJson(res, 406, "language is required");
  language = language.replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
  var books = [];
  var pages = 5;

  if (typeof req.query.pages !== "undefined") {
    pages = req.query.pages;
  }

  booksData.forEach((book) => {
    if (book.language === language) {
      if (books.length !== pages) books.push(book);
    }
  });

  if (books.length === 0) return resJson(res, 200, "book does not exist");

  resJson(res, 200, {
    books_found: books.length,
    books: books,
  });
});

route.post("/", (req, res) => {
  var validate = createBook.validate(req.body);
  if (validate.error) return resJson(res, 404, validate.error.message);

  booksData.push(validate.value);
  fs.writeFileSync("books.json", JSON.stringify(booksData));

  resJson(res, 200, validate.value);
});

route.delete("/", (req, res) => {
  var validate = deleteBook.validate(req.body);
  if (validate.error) return resJson(res, 404, validate.error.message);

  var index = _.findIndex(booksData, function(book) {
    return book.title === validate.value.title;
  });

  if (index === -1) return resJson(res, 404, "book not found");

  _.pullAt(booksData, index);
  fs.writeFileSync("books.json", JSON.stringify(booksData));

  resJson(res, 200, `Deleted ${req.body.title}`);
});
