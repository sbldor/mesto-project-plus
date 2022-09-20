import { Request, Response, NextFunction } from 'express';

const errorsHandler = (err: { statusCode?: number, message: string }, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};

export default errorsHandler;