import mongoose from 'mongoose';
import { ICard } from '../types/types';
import urlRegexp from '../utils/regexp';

const cardsSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 20,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => urlRegexp.test(v),
      message: 'Некорректная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: [{ type: mongoose.Schema.Types.ObjectId }],
      ref: 'user',
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model<ICard>('cards', cardsSchema);
