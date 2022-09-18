import { Router } from 'express';
import { 
  getUsers,
  createUser,
  getUserById,
  updateUser,
  updateAvatar
} from '../controllers/user';

import validationObjectId from '../errors/validation-object-id';

const router = Router();

router.get('/', getUsers);
router.get('/:id', validationObjectId, getUserById);
router.post('/', createUser);
router.post('/me', updateUser);
router.post('/me/avatar', updateAvatar);

export default router;