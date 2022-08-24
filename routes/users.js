import express from 'express';
import { registerUser, loginUser, getAllUsers, deleteUser, fetchUserDetails } from '../controllers/usersController.js';

const router = express.Router()


router.route('/api/users')
    .get(getAllUsers)
    .post(registerUser)

router.get('/api/users/:id', fetchUserDetails)
router.delete('/api/users/delete/:id', deleteUser)
router.post('/api/users/login', loginUser)


export default router