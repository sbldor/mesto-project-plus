import { celebrate, Joi } from 'celebrate';
import urlRegexp from '../utils/regexp';

const validationCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().uri().pattern(urlRegexp),
  }),
});

export default validationCard;
