const mongoose= require('mongoose');
const dotenv=require('dotenv')
dotenv.config()

const connectDb=async()=>{

    // console.log(process.env.MONGODB_URI);
    try {
        await mongoose.connect(process.env.MONGODB_URI2);
        console.log("DATABASE IS CONNECTED")
        
    } catch (error) {
        console.log("ERROR IN DB",error)
    }
}

module.exports=connectDb;