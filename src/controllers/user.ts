import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found-error';
import { IUserRequest } from '../types/types';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const user = {
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  };
  return User.create(user)
    .then((newUser) => res.send(newUser))
    .catch(() => {
      next(new BadRequestError('Некорректные данные'));
    });
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.id)
    .orFail(() => new NotFoundError('Нет такого пользователя'))
    .then((user) => res.send({ data: user }))
    .catch(() => {
      return next(new NotFoundError('Нет такого пользователя'));
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate((req as IUserRequest).user?._id, req.body, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new NotFoundError('Нет такого пользователя'))
    .then((user) => res.send(user))
    .catch(() => {
      return next(new BadRequestError('Некорректные данные'));
    });
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate((req as IUserRequest).user?._id, { avatar: req.body.avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch(() => {
      return next(new BadRequestError('Некорректные данные'));
    });
};