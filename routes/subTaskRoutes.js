import express from 'express';
import auth from '../middlewares/auth.js';
import { createSubTask, updateSubTask, getSubTasks, deleteSubTask } from '../controller/subTasks.js';

const subTaskRouter = express.Router();

subTaskRouter.post('/subtask', auth, createSubTask);
subTaskRouter.patch('/subtask', auth, updateSubTask);
subTaskRouter.get('/', auth, getSubTasks);
subTaskRouter.delete('/subtask', auth, deleteSubTask);

export default subTaskRouter;