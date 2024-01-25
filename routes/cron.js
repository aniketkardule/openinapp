import express from 'express';

import { updatePriority, twilioCall } from '../controller/cron.js';

const cronRouter = express.Router();

cronRouter.get('/update', updatePriority);
cronRouter.post('/twilio', twilioCall);


export default cronRouter;


