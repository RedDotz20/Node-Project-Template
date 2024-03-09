import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import keys from '../config/keys';
import User from '../models/user.model';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey,
};

passport.use(
  new Strategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);

      if (user) {
        return done(null, user);
      }

      return done(null, false);
    } catch (error) {
      console.error(error);
      return done(error, false);
    }
  }),
);

export const authenticate = passport.authenticate('jwt', { session: false });
