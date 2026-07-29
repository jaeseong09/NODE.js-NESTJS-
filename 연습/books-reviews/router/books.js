const express = require("express");
const db = require("../drizzle/connection");
const {
  books: booksTable,
  reviews: reviewsTable,
} = require("../drizzle/schema");
const { eq } = require("drizzle-orm");

const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const books = await db.select().from(booksTable);
      res.json(books);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      await db.insert(booksTable).values({
        title: req.body.title,
        explanation: req.body.explanation,
        author: req.body.author,
      });
      res.status(201).send("OK");
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const book = await db
        .select()
        .from(booksTable)
        .where(eq(booksTable.id, req.params.id));
      res.json(book[0]);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .patch(async (req, res, next) => {
    try {
      const result = await db
        .update(booksTable)
        .set({
          title: req.body.title,
          explanation: req.body.explanation,
          author: req.body.author,
        })
        .where(eq(booksTable.id, req.params.id));
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await db.delete(booksTable).where(eq(booksTable.id, req.params.id));
      res.status(200).send("OK");
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.route("/:id/reviews").get(async (req, res, next) => {
  try {
    const result = await db.query.reviews.findMany({
      with: {
        book: {
          columns: {
            title: true,
            author: true,
          },
        },
      },
      where: eq(reviewsTable.bookId, req.params.id),
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
