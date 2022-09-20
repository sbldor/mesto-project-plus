import path from 'path';
import express, { NextFunction, Response, Request } from 'express';
import mongoose from 'mongoose';
import router from './routes';
import { IUserRequest } from './types/types';
import errorsHandler from './middlewares/errors-handler';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req: IUserRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6327802fe286fde92f459649'
  };

  next();
}); 

app.use(router)
app.use(errorsHandler)

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
}) 
