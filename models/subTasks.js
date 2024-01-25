import mongoose from 'mongoose';

const subTaskSchema = mongoose.Schema({
    id:Number,
    task_id:Number,
    status:Number,
    created_at:Date,
    updated_at:Date,
    deleted_at:Date,
    deleted:Boolean
});

const subTaskModel = mongoose.model('Subtask', subTaskSchema);
export default subTaskModel;