import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { SessionRequest } from '../types/types';
import UnauthorizedError from '../errors/unauth-error';

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация.'));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return next(new UnauthorizedError('Проблемы с токеном'));
  }

  req.user = payload;

  return next();
};
