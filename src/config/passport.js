import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import UserModel from "./database.js";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "Random string",
};

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        console.log("payload: ", jwt_payload)
      const user = await UserModel.findOne({ _id: jwt_payload.id });
      console.log("user: ", user)
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
