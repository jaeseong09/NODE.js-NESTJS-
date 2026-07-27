const express = require("express");
const router = express.Router();

// GET / 라우터
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router
  .route("/main")
  .get((req, res) => {
    console.log("실행됩니다");
    res.send("Hello, Express");
  })
  .post((req, res) => {
    res.send("POST /main");
  });

module.exports = router;
