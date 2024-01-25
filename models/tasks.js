import mongoose from 'mongoose';

const taskSchema = mongoose.Schema({
    id:Number,
    user_id:Number,
    title:String,
    description:String,
    due_date:Date,
    priority:Number,
    status:String,
    created_at:Date,
    updated_at:Date,
    deleted_at:Date,
    deleted:Boolean
});

const taskModel = mongoose.model('Task', taskSchema);
export default taskModel;