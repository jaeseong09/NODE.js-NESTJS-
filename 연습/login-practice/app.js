const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./config/passport");
const authController = require("./controllers/auth");

const users = [];

passportConfig(users);
authController(users, passport);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("secret-key"));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "secret-key",
    cookie: { httpOnly: true },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.json({
    message: "홈페이지",
    user: req.user, // ← 로그인되면 여기에 유저 정보가 자동으로 들어옴
    isLoggedIn: req.isAuthenticated(), // ← 로그인 상태 boolean
  });
});

app.post("/register", auth.register);
app.post("/login", auth.login);
app.get("/logout", auth.logout);

app.listen(3000, () => {
  console.log("3000번 포트에서 대기중 ");
});
