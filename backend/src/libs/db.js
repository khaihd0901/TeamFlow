import mongoose from 'mongoose';

export const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connect DB success")
    }catch(err){
        console.log("something went wrong went connect to DB")
        process.exit(1);
    }
}