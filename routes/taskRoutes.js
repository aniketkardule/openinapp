import express from 'express';
import { createTask, updateTask, getTasks, deleteTask } from '../controller/tasks.js';
import auth from '../middlewares/auth.js';
const taskRouter = express.Router();

taskRouter.post('/task', auth, createTask);
taskRouter.patch('/task', auth, updateTask);
taskRouter.get('/find', auth, getTasks);
taskRouter.delete('/task', auth, deleteTask);


export default taskRouter;