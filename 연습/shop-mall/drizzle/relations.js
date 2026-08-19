const { relations } = require("drizzle-orm/relations");
const { categories, orderItems, orders, products } = require("./schema");

exports.categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

exports.productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
}));

exports.ordersRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderItems),
}));

exports.orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
