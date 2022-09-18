import { Router } from 'express';
import validationObjectId from '../errors/validation-object-id';
import { 
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
} from '../controllers/cards'


const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:id', validationObjectId, deleteCard);
router.put('/:id/likes', validationObjectId, likeCard);
router.delete('/:id/likes', validationObjectId, dislikeCard);

export default router;