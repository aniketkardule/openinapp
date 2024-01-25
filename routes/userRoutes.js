import express from 'express';
import { createUser, loginUser } from '../controller/userRouter.js';

const userRouter = express.Router();

userRouter.post('/createuser', createUser);
userRouter.post('/login', loginUser);

export default userRouter;