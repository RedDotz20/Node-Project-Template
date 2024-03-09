import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
// import middleware from './middleware';
import passport from 'passport';
import authRoutes from './routes/auth.routes';
import keys from './config/keys';

export const app: Application = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define MongoDB connection options
const mongooseOptions: mongoose.ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions;

mongoose
  .connect(keys.mongoURI, mongooseOptions)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./middleware/auth.middleware');

// Routes
app.get('/', (req: Request, res: Response) => res.send('Hello World!'));
app.use('/api/auth', authRoutes);

// app.use(middleware.notFound);
// app.use(middleware.errorHandler);
