import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getMyUser,
} from '../controllers/user';
import { validationUser, validationAvatar } from '../errors/validation-user';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/me', getMyUser);
router.post('/me', validationUser, updateUser);
router.post('/me/avatar', validationAvatar, updateAvatar);

export default router;
