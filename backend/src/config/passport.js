const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const prisma = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email from Google"), null);

        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { googleId: profile.id },
              { email },
            ],
          },
        });

        if (user) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              googleId: profile.id,
              avatar: user.avatar || profile.photos?.[0]?.value,
            },
          });
        } else {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email,
              name: profile.displayName,
              avatar: profile.photos?.[0]?.value,
              password: null,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
