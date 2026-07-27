const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { prototype } = require("events");
const nunjucks = require("nunjucks");
const indexRouter = require("./routes");
const userRouter = require("./routes/user");

try {
  fs.readdirSync("uploads");
} catch (error) {
  // uploads 폴더가 없으면 생성
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, exit) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const app = express();
app.set("port", process.env.PORT || 8080);
app.set("view engine", "html");

nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.use(morgan("dev"));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  }),
);

app.get("upload", (req, res) => {
  res.sendFile(path.join(__dirname, "multpart.html"));
});
app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file, req.body);
  res.send("ok");
});

app.use("/", indexRouter);
app.use("/user", userRouter);

app.use("/posts/{*name}", (req, res, next) => {
  res.status(200).send("어떤 라우터에 매칭될까요?");
});

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
