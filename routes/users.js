import express from 'express';
import { registerUser, loginUser, getAllUsers, deleteUser, fetchUserDetails, updateUserData, updateUserPassword, followUser, unfollowUser, blockUser, unblockUser } from '../controllers/usersController.js';
import { authMiddleware } from '../middlewares/index.js';

const router = express.Router()


router.route('/')
    .get(authMiddleware, getAllUsers)
    .post(registerUser)

router.put('/password', authMiddleware, updateUserPassword)
router.put('/follow', authMiddleware, followUser)
router.put('/unfollow', authMiddleware, unfollowUser)
router.post('/login', loginUser)

router.delete('/delete/:id', authMiddleware, deleteUser)
router.put('/block-user/:id', authMiddleware, blockUser)
router.put('/unblock-user/:id', authMiddleware, unblockUser)
router.put('/:id', authMiddleware, updateUserData)
router.get('/:id', authMiddleware, fetchUserDetails)

export default router