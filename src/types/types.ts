import { Request } from 'express';
import { ObjectId } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

export interface IUser {
  name: string,
  about: string,
  avatar?: string,
  email: string,
  password: string,
}

export interface ICard {
  name: string,
  link: string,
  owner: ObjectId,
  likes: ObjectId,
  createdAt: Date,
}

export interface IUserRequest extends Request {
  user?: {
    _id: string
  }
}

export interface SessionRequest extends Request {
  user: string | JwtPayload;
}
