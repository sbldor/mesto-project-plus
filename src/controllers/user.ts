import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import { IUserRequest } from '../types/types';
import ConflictError from '../errors/conflict-error';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        data: {
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Такой email уже зарегистрирован'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные'));
      }
      return next(err);
    });
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'super-strong-secret',
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    })
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.id)
    .orFail(() => new NotFoundError('Нет такого пользователя'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Нет такого пользователя'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные'));
      }
      return next(err);
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate((req as IUserRequest).user?._id, req.body, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new NotFoundError('Нет такого пользователя'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Нет такого пользователя'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные'));
      }
      return next(err);
    });
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate((req as IUserRequest).user?._id, { avatar: req.body.avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Нет такого пользователя'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные'));
      }
      return next(err);
    });
};

export const getMyUser = (req: IUserRequest, res: Response, next: NextFunction) => {
  User.findById(req.user?._id)
    .orFail(() => new NotFoundError('Нет такого пользователя'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные'));
      }
      return next(err);
    });
};
