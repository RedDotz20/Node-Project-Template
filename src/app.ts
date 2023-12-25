import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import middleware from './middleware';

export const app: Application = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//? Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(middleware.notFound);
app.use(middleware.errorHandler);
