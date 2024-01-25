import Task from '../models/tasks.js';
import User from '../models/user.js';
import twilio from 'twilio';
const client = twilio("AC0a5d38121bca34bb2392627cb1b68dea", process.env.TWILIO_AUTH_TOKEN)

const updatePriority =  async (req, res) => {
    try{
        const tasks = await Task.find({ deleted: false});
        for(let element of tasks){
            const dueDate = new Date(element.due_date);
            const dateToday = new Date();

            const dateDifference = Math.round( (dueDate - dateToday) / (1000 * 3600 * 24) );

            await updateUser(element.user_id, dateDifference);
            
            
        }
        res.status(200).json({ message: 'Priorirty updtaed'});
    }catch (e){
        res.status(200).json({ message: e.message});
    }
}

const updateUser = async (userid, days) =>  {
    try{
        var user = await User.findOne({ id: userid });

        if(days < 1){
            user.priority = 0;
        }else if(days >= 1 && days <= 2){
            user.priority = 1
        }else if(days >= 3 && days <= 4){
            user.priority = 2
        }else if(days >= 5){
            user.priority = 3;
        }

        const saveUser = await user.save();
        console.log('Priority updated');
        //res.status(200).json({ message: 'Priority updated'});
    }catch (e){
        console.log(e.message);
    }
}

const twilioCall = async (req, res) => {
    try{
         

        const users = await User.find({}).sort({priority: 1});
        for(let user of users){
            const recipientPhoneNumber = user.phone_number;
            console.log(user);
            const twiml = `
            <Response>
                <Dial action="/handleDialOutcome">
                <Number>${recipientPhoneNumber}</Number>
                </Dial>
            </Response>
            `;

            client.calls.create({
                twiml: twiml,
                to: recipientPhoneNumber,
                from: "+15162462624",
            })
            .then(call => console.log(call.sid));

            if(!(call.satus == 'no-answer')){
                break
            }
        }

        
    }catch (e){
        res.status(500).json({ message: e.message});
    }
}

export { updatePriority, twilioCall }