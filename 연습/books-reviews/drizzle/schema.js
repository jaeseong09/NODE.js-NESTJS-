const {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  primaryKey,
  int,
  varchar,
  datetime,
  index,
  foreignKey,
} = require("drizzle-orm/mysql-core");
const { sql } = require("drizzle-orm");

exports.books = mysqlTable(
  "books",
  {
    id: int().autoincrement().notNull(),
    title: varchar({ length: 50 }).notNull(),
    explanation: varchar({ length: 100 }).notNull(),
    author: varchar({ length: 10 }).notNull(),
    createdAt: datetime("created_at", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: "books_id" })],
);

exports.reviews = mysqlTable(
  "reviews",
  {
    id: int().autoincrement().notNull(),
    bookId: int("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade", onUpdate: "cascade" }),
    author: varchar({ length: 10 }).notNull(),
    content: varchar({ length: 100 }).notNull(),
    createdAt: datetime("created_at", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [
    index("book_id_idx").on(table.bookId),
    primaryKey({ columns: [table.id], name: "reviews_id" }),
  ],
);
