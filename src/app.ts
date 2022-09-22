import express from 'express';
import mongoose from 'mongoose';
import { celebrate, Joi } from 'celebrate';
import router from './routes';
import errorsHandler from './middlewares/errors-handler';
import { createUser, loginUser } from './controllers/user';
import urlRegexp from './utils/regexp';
import auth from './middlewares/auth';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), loginUser);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri().pattern(urlRegexp),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), createUser);
// @ts-ignore
app.use(auth);

app.use(router);
app.use(errorsHandler);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
