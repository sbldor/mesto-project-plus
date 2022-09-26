import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getMyUser,
} from '../controllers/user';
import { validationUser, validationAvatar } from '../errors/validation-user';
import validationObjectId from '../errors/validation-object-id';

const router = Router();

router.get('/', getUsers);
router.get('/:id', validationObjectId, getUserById);
router.get('/me', getMyUser);
router.patch('/me', validationUser, updateUser);
router.patch('/me/avatar', validationAvatar, updateAvatar);

export default router;
