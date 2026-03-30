const User = require("../models/userModel");
const BlackListed=require("../models/BlackListed")
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");       

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {

    if(!username || !email || !password){
        return res.status(400).json({message:"All fields are required"})
    }

    const existUser = await User.findOne({$or:[{email:email},{username:username}]});

    if (existUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const Hashed=await Bcrypt.hash(password,10);

    const newUser=await User.create({
        username,
        email,
        password:Hashed
    })
    // await newUser.save();

    const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:"1d"})
    res.cookie("token", token, { httpOnly: true });

    return res.status(201).json({ message: "User registered successfully", user: newUser });

  } catch (error) {

    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.login=async(req,res)=>{
    const {email,password}=req.body;
    try {

        const user=await User.findOne({email:email})
        if(!user){
            return res.status(400).json({message:"Invalid email or password"})
        }

        const isMatch=await Bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid email or password"})
        }  
        
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})
        res.cookie("token", token, { httpOnly: true });

        return res.status(200).json({message:"Login successful",token,user})
        
    } catch (error) {
            console.error("Error during login:", error);
            return res.status(500).json({ message: "Server error" });
        
    }
}


exports.logout=async(req,res)=>{
    const token=req.cookies.token;  
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }   

    if(token){
        await BlackListed.create({token})
        res.clearCookie("token");
        return res.status(200).json({message:"Logout successful"})
    }
}


exports.getUser=async(req,res)=>{
    const userId=req.user.id;
    try {
        const user=await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json({message:"User found", user})
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Server error" });
    }
}