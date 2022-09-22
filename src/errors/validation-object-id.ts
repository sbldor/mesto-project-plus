import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import NotFoundError from './not-found-error';

const validationObjectId = (req: Request, res: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new NotFoundError('Неправильный идентификатор');
  }
  next();
};

export default validationObjectId;
