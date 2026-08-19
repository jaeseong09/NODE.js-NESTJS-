import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  schema: "./drizzle/schema.js",
  out: "./drizzle",
  dbCredentials: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "nodebird",
  },
});
