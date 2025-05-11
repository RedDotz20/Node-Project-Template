import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';
// import mongoose from 'mongoose';
// import authRoutes from './routes/auth.routes';
// import keys from './config/keys';
// import middleware from './middleware';

export const app: Application = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cookie parser middleware
app.use(cookieParser());

// Define MongoDB connection options
// const mongooseOptions: mongoose.ConnectOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// } as mongoose.ConnectOptions;

// mongoose
//   .connect(keys.mongoURI, mongooseOptions)
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./middleware/auth.middleware');

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

// app.use('/api/auth', authRoutes);

// app.use(middleware.notFound);
// app.use(middleware.errorHandler);
