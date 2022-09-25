import { celebrate, Joi } from 'celebrate';
import urlRegexp from '../utils/regexp';

export const validationUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().uri().pattern(urlRegexp),
    about: Joi.string().min(2).max(200),
  }),
});

export const validationAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().pattern(urlRegexp),
  }),
});
