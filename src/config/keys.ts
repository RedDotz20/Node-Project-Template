import 'dotenv/config';

export default {
  mongoURI: process.env.MONGODB_URI ?? '',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? '',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? '',
};
