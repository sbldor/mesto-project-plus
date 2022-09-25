import { Request, Response, NextFunction } from 'express';
import Cards from '../models/cards';
import { IUserRequest } from '../types/types';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';

const { Types } = require('mongoose');

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Cards.find({})
    .populate('owner')
    .then((card) => res.status(200).send({ data: card }))
    .catch(next);
};

export const createCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  const card = {
    name: req.body.name,
    link: req.body.link,
    owner: req!.user?._id,
  };
  return Cards.create(card)
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные'));
      }
      return next(err);
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const cardId = req.params.id;
  const userId = (req as IUserRequest).user?._id;
  Cards.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет такой карточки');
      }
      if (card.owner.toString() === userId) {
        card.remove()
          .then(() => res.status(200).send({ message: 'Карточка удалена!' }))
          .catch(next);
      } else {
        next(new BadRequestError('Удаление не возможно, вы не автор карточки'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Нет такой карточки'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные'));
      }
      return next(err);
    });
};

export const likeCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  Cards.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { likes: Types.ObjectId(req?.user?._id) },
    },
    { new: true },
  )
    .orFail(new NotFoundError('Нет такой карточки'))
    .then((newCard) => res.status(201).send({ data: newCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Нет такой карточки'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные'));
      }
      return next(err);
    });
};

export const dislikeCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  if (req.user) {
    Cards.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: Types.ObjectId(req.user._id) },
      },
      { new: true },
    )
      .orFail(new NotFoundError('Нет такой карточки'))
      .then((newCard) => res.status(201).send({ data: newCard }))
      .catch((err) => {
        if (err.name === 'CastError') {
          return next(new NotFoundError('Нет такой карточки'));
        }
        if (err.name === 'ValidationError') {
          return next(new BadRequestError('Некорректные данные'));
        }
        return next(err);
      });
  }
};
