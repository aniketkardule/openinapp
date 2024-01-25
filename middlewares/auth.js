import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const auth = async (req, res, next) => {
    try{
        const token = req.headers.token;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
            return res.status(403).json({ error: 'Forbidden: Invalid token' });
            }

            req.user_id = decoded.userId;
            next();
        });
   
        
    }catch (e){
        res.json(402).json({ message : e.message })
    }
}

export default auth;