const express = require("express");
const morgan = require("morgan");
const indexRouter = require("./router/index");
const booksRouter = require("./router/books");
const reviewsRouter = require("./router/reviews");

const app = express();
app.set("port", process.env.PORT || 8080);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/books", booksRouter);
app.use("/reviews", reviewsRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(app.get("port"), () => {
  console.log(`${app.get("port")}번 포트에서 대기 중`);
});
