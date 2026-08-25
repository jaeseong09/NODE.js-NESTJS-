const bcrypt = require("bcrypt");

module.exports = (users, passport) => {
  return {
    register: async (req, res) => {
      try {
        const found = users.find((u) => u.email === req.body.email);
        if (found) {
          res.status(400).send("이미 존재하는 회원입니다");
        } else {
          const hash = await bcrypt.hash(req.body.password, 12);
          users.push({
            email: req.body.email,
            password: hash,
          });
          res.status(200).redirect("/login");
        }
      } catch (error) {
        console.error("에러 발생:", error);
        res.status(500).send("서버 에러");
      }
    },

    login: (req, res, next) => {
      passport.authenticate("local", (authError, user, info) => {
        // 부분1: authError가 있으면 → next(authError)
        if (authError) {
          console.error(authError);
          return next(authError);
        }
        // 부분2: user가 없으면 → res.send() 실패 메시지
        if (!user) {
          return res.send(info.message);
        }
        // 부분3: user가 있으면 → req.login() 호출
        return req.login(user, (loginError) => {
          if (loginError) return next(loginError);
          return res.redirect("/");
        });
      })(req, res, next);
    },

    logout: (req, res, next) => {
      req.logout((error) => {
        if (error) {
          return next(error);
        } else {
          return res.redirect("/");
        }
      });
    },
  };
};
