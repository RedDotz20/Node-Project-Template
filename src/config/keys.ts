import 'dotenv/config';

export default {
  mongoURI: process.env.MONGODB_URI ?? '',
  secretOrKey: process.env.SECRET_KEY ?? '',
};
