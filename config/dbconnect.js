
import mongoose from 'mongoose';

const connectDb = async () => {
    try{
        const conn = await mongoose.connect(process.env.URI);
        console.log('Connection to datatabse successful');
        
    }catch (e) {
        console.log({message: 'Connection to database unsuccessful', error: e.message});
    }
} 

export default connectDb;