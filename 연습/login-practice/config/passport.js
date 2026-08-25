const passport = require("passport");
const localStrategy = require("passport-local");
const bcrypt = require("bcrypt");

module.exports = (users) => {
  // Passport Local Strategy
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: false,
      },
      async (email, password, done) => {
        try {
          const user = users.find((u) => u.email === email);
          if (!user) {
            return done(null, false, { message: "가입되지 않은 회원입니다" });
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "비밀번호가 틀렸습니다" });
          }
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  // Serialize/Deserialize
  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser((email, done) => {
    const user = users.find((u) => u.email === email);
    done(null, user);
  });
};
