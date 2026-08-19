const {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  primaryKey,
  int,
  varchar,
  index,
  foreignKey,
  datetime,
} = require("drizzle-orm/mysql-core");
const { sql } = require("drizzle-orm");

exports.categories = mysqlTable(
  "categories",
  {
    id: int().autoincrement().notNull(),
    title: varchar({ length: 10 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: "categories_id" })],
);

exports.orderItems = mysqlTable(
  "order_items",
  {
    id: int().autoincrement().notNull(),
    orderId: int("order_id")
      .notNull()
      .references(() => orders.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    productId: int("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    quantity: int().notNull(),
  },
  (table) => [
    index("order_id_idx").on(table.orderId),
    index("product_id_idx").on(table.productId),
    primaryKey({ columns: [table.id], name: "order_items_id" }),
  ],
);

exports.orders = mysqlTable(
  "orders",
  {
    id: int().autoincrement().notNull(),
    orderedAt: datetime("ordered_at", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: "orders_id" })],
);

exports.products = mysqlTable(
  "products",
  {
    id: int().autoincrement().notNull(),
    title: varchar({ length: 50 }).notNull(),
    content: varchar({ length: 100 }).notNull(),
    price: int().notNull(),
    stock: int().notNull(),
    categoryId: int("category_id")
      .notNull()
      .references(() => categories.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    index("category_id_idx").on(table.categoryId),
    primaryKey({ columns: [table.id], name: "products_id" }),
  ],
);
