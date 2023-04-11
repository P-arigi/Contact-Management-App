const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")


//@Description Register a User
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async(req,res) => {
    const {username,email,password} = req.body;
    if(!username){
        res.status(400);
        throw new Error("Please enter username!")
    }
    if(!email){
        res.status(400);
        throw new Error("Please enter email address!")
    }
    if(!password){
        res.status(400);
        throw new Error("Please enter password!")
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered!")
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password,10);
    console.log("Hashed Password: ", hashedPassword)
    //create user
    const user = await User.create({
        username,
        email,
        password:hashedPassword
    });

    console.log(`User created ${user}`);
    if(user){
        res.status(201).json({_id: user.id, email: user.email});
    }
    else{
        res.status(400);
        throw new Error("User data is not valid")
    }
    res.json({message: "Register the user"})
 });

 //@Description Login User
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async(req,res) => {
    const {email,password} = req.body;
    if(!email || !password){ 
        res.status(400)
        throw new Error("All fields are mandatory")
    }
    const user = await User.findOne({email});
    //compare password with hashedPassword
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user:{
                username: user.username,
                email: user.email,
                id: user.id,
            },
        }, process.env.ACCESS_TOKEN_SECERET, {expiresIn: "1hr"})
        res.status(200).json({accessToken});
    }else{
        res.status(401)
        throw new Error("email or password is not valid")
    }
    
 });



 //@Description Current User Info
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async(req,res) => {
    res.json(req.user)
 });

 module.exports ={registerUser, loginUser, currentUser}