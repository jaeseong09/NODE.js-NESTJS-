const express = require("express");
const db = require("../drizzle/connection");
const { books: booksTable } = require("../drizzle/schema");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const books = await db.select().from(booksTable);
    res.json(books);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
