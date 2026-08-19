const express = require("express");
const db = require("../drizzle/connection");
const { products: productsTable } = require("../drizzle/schema");
const { eq } = require("drizzle-orm");

const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const products = await db.select().from(productsTable);
      res.json(products);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      await db.insert(productsTable).values({
        title: req.body.title,
        content: req.body.content,
        price: req.body.price,
        stock: req.body.stock,
        categoryId: req.body.categoryId,
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
      const product = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, req.params.id));
      res.json(product[0]);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .patch(async (req, res, next) => {
    try {
      const result = await db
        .update(productsTable)
        .set({
          title: req.body.title,
          content: req.body.content,
          price: req.body.price,
          stock: req.body.stock,
        })
        .where(eq(productsTable.id, req.params.id));
      res.status(200).send("OK");
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await db.delete(productsTable).where(eq(productsTable.id, req.params.id));
      res.status(200).send("OK");
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
