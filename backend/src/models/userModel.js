const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    username:{
        type:String, 
        unique:[true,"Name already exists"],   
        required:true
    },
    email:{         
        type:String,
        required:true,
        unique:[true,"Email already exists"]
    },
    password:{
        type:String,
        required:true
    }
})  

module.exports=mongoose.model('User',userSchema)

