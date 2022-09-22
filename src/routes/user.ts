import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getMyUser,
} from '../controllers/user';

import validationObjectId from '../errors/validation-object-id';

const router = Router();

router.get('/', getUsers);
router.get('/:id', validationObjectId, getUserById);
router.get('/me', getMyUser);
router.post('/me', updateUser);
router.post('/me/avatar', updateAvatar);

export default router;
