import Subtask from '../models/subTasks.js';
import Task from '../models/tasks.js';
const createSubTask = async (req, res) => {
    try{
        const { task_id } = req.body;
        

        const lastDocument = await Subtask.findOne({}).sort({_id : -1});
        let id;
        if(lastDocument){
            id = lastDocument.id + 1;
        }else{
            id = 1;
        }

        const newSubtask = await Subtask.create({
            id,
            task_id,
            status: 0,
            created_at: new Date(),
            deleted: false
        })
        
        if(newSubtask){
            res.status(201).json(newSubtask);
        }
        
    }catch (e){
        res.status(500).json({ message: e.message});
    }
}

const updateSubTask = async (req, res) => {
    try{
        const { id, status } = req.body;

        if(id && (status == 0 || status == 1)){
            const subTask = await Subtask.findOne({ id });
            subTask.status = parseInt(status);

            const saveSubTask = await subTask.save();

            await updateTask(subTask.task_id);

            if(saveSubTask){
                res.status(200).json(saveSubTask);
            }
        }else{
            res.status(500).json({ message: 'Please provide Status with values 1 or 0 and id in body!'});
        }
    }catch (e){
        res.status(500).json({ message: e.message});
    }
}

const getSubTasks = async (req, res) => {
    try{
        const { task_id } = req.query;

        var subTasks = [];
        if(task_id){
            subTasks = await Subtask.find({ task_id, deleted: false });
        }else{
            subTasks = await Subtask.find({});
        }
        res.send(subTasks);
    }catch (e){
        res.status(500).json({ message: e.message});
    }
}

const deleteSubTask = async (req, res) => {
    try{
        const id = parseInt(req.query.id);
        if(id){
            const subTask = await Subtask.findOne({ id });
            if(subTask){
                subTask.deleted_at = new Date();
                subTask.deleted = true;

                const saveSubTask = await subTask.save();

                if(saveSubTask){
                    res.status(200).json({ message: 'Task Deleted!'})
                }
            }else{
                res.status(404).json({ message: 'Subtask does not exists!'});
            }
            
        }else{
            res.status(400).json({ message: 'Please provide Id to delete task !'});
        }
    }catch (e){
        res.status(500).json({ message: e.message});
    }
}

const updateTask = async (taskid) =>{
    try{
        const subTasks = await Subtask.find({task_id: taskid});
        var completeCount = 0 ;
        subTasks.forEach(element => {
            if(element.status == 1){
                completeCount += 1;
            }
        });

        var task = await Task.findOne({ id: taskid});
        
        if(completeCount == subTasks.length){
            task.status = 'DONE';
        }else if(completeCount >= 1){
            task.status = 'IN_PROGRESS';
        }else if(completeCount == 0){
            task.status = 'TODO';
        }

        const saveTask = await task.save();

        if(saveTask){
            console.log('Task status updated !');
        }
    }catch(e){
        console.log(e.message);
    }
}

export { createSubTask, updateSubTask, getSubTasks, deleteSubTask };