import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
const app = express();
const port = process.env.PORT || 3000;
dotenv.config();
app.use(bodyParser.json());


import connectDb from './config/dbconnect.js';
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';
import subTaskRouter from './routes/subTaskRoutes.js';
import cronRouter from './routes/cron.js';

connectDb();

app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/subtasks', subTaskRouter);
app.use('/api/cron', cronRouter);


app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})