import Task from '../models/tasks.js';


const createTask = async (req, res) => {
    try{
        const { title, description, due_date } = req.body;
        const lastDocument = await Task.findOne({deleted: false}).sort({_id : -1});

        let id;
        if(lastDocument){
            id = lastDocument.id + 1;
        }else{
            id = 1;
        }

        if(title && description && due_date){

            const dueDate = new Date(due_date);
            const dateToday = new Date();
            const timeDifference = dueDate - dateToday;
            const newTask = await Task.create({
                id,
                user_id: req.user_id,
                title,
                description,
                due_date,
                priority: Math.round(timeDifference / (1000 * 3600 * 24)),
                created_at: new Date(),
                deleted: false
            })
            if(newTask){
                res.status(200).json(newTask);
            }
        }else{
            res.status(500).json({message: 'Please provide all keys title, description, due_date'});
        }
        
    }catch (e){
        res.status(500).json({ message: e.message});
    }
}

const updateTask = async (req, res) => {
    try{
        const { id, due_date, status } = req.body;

        if(id){
            const task = await Task.findOne({ id:id , user_id: req.user_id });
            if(task){
                task.due_date = due_date || task.due_date;
                task.status = status || task.status;

                const updatedTask = await task.save();
                res.send(updatedTask);
            }else{
                res.status(404).json({ message: `Task not found with id ${id}`});
            }
            
        }else{
            res.status(404).json({ message: `Id not found to the task !`});
        }
    }catch (e){
        res.status(500).json({ message: e.message});
    }
}

const getTasks = async (req, res) => {
    try{
        const { priority, due_date, from, pageCount } = req.query;
        const skip = (parseInt(from) - 1) * parseInt(pageCount);
        if((priority || due_date) && (from && pageCount)){
            if(!isNaN(from) && !isNaN(pageCount)){
                var tasks = [];
                if(priority && due_date){
                    tasks = await Task.find({priority, due_date, deleted: false}).skip(skip).limit(parseInt(pageCount));
                }else if(priority && !due_date){
                    tasks = await Task.find({priority, deleted : false }).skip(skip).limit(parseInt(pageCount));
                }else if(!priority && due_date){
                    tasks = await Task.find({ due_date, deleted : false}).skip(skip).limit(parseInt(pageCount)).toArray();
                }
                res.send(tasks);
            }else{
                res.json(500).json({ message: ''})
            }
            
        }else{
            res.status(500).json({ message: 'Provide all keys priority or due_date and from, pageCount'})
        }
    }catch (e){
        res.status(500).json({ message: e.message});
    }
}

const deleteTask = async (req, res) => {
    try{
        const id = parseInt(req.query.id);
        if(id){
            const task = await Task.findOne({ id });

            if(task){
                task.deleted_at = new Date();
                task.deleted = true;

                const saveTask = await task.save();

                if(saveTask){
                    res.status(200).json({ message: 'Task deleted!'});
                }
            }else{
                res.status(404).json({ message: 'Task does not exists !'});
            }
            

        }else{
            res.status(404).json({ message: 'Id not provided to delete task !'});
        }
    }catch (e){
        res.status(500).json({ message: e.message});
    }
}

export { createTask, updateTask, getTasks, deleteTask }