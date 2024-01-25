import User from '../models/user.js';
import jwt from 'jsonwebtoken';

function generateToken(res, userId){
   
        const token = jwt.sign({userId},process.env.JWT_SECRET,{
            expiresIn:"30d"
        });

        return token; 

    
}

const createUser =  async (req, res) => {
    try{
        const { id, phone_number, priority, password } = req.body
        const user = await User.findOne({ id });

        if(user){
            res.status(409).json({ message: 'Id already exists'});
        }else{
            if(!isNaN(id) && !isNaN(phone_number) && !isNaN(priority) && password){
                var token = generateToken(res, id);
                const newUser = await User.create({
                    id,
                    phone_number,
                    priority,
                    password
                })
                res.status(200).json({
                    id,
                    phone_number,
                    priority,
                    token
                });
            }else{
                res.status(500).json({ message: 'No all requested keys provided or Invalid data types !'});
            }
        }

    }catch (e){
        res.status(500).json({message: e.message});
    }
}

const loginUser = async (req, res) => {
    try{
        const { id, password } = req.body;
        const user = await User.findOne({ id });
        console.log(user);
        if(user && (await user.matchPassword(password))){
            const token = generateToken(res, id);
            res.status(200).json({
                id: user.id,
                phone_number: user.phone_number,
                priority: user.priority,
                token: token
            })
        }else{
            if(!user){
                res.status(404).json({ message: 'User Not Found !'});
            }else{
                res.status(404).json({ message: 'Invalid Password!'});
            }
        }
    }catch (e){

    }
}

export { createUser, loginUser };