const { relations } = require("drizzle-orm/relations");
const { books, reviews } = require("./schema");

exports.reviewsRelations = relations(reviews, ({ one }) => ({
  book: one(books, {
    fields: [reviews.bookId],
    references: [books.id],
  }),
}));

exports.booksRelations = relations(books, ({ many }) => ({
  reviews: many(reviews),
}));
