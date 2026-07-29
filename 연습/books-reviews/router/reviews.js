const express = require("express");
const db = require("../drizzle/connection");
const { reviews: reviewsTable } = require("../drizzle/schema");
const { eq } = require("drizzle-orm");

const router = express.Router();

router.route("/").post(async (req, res, next) => {
  try {
    await db.insert(reviewsTable).values({
      bookId: req.body.bookId,
      author: req.body.author,
      content: req.body.content,
    });
    res.status(201).send("OK");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router
  .route("/:id")
  .patch(async (req, res, next) => {
    try {
      const result = await db
        .update(reviewsTable)
        .set({
          author: req.body.author,
          content: req.body.content,
        })
        .where(eq(reviewsTable.id, req.params.id));
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await db.delete(reviewsTable).where(eq(reviewsTable.id, req.params.id));
      res.status(200).send("OK");
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
