const router= require('express').Router()
const {User,validate}=require('../models/User')
const bcrypt = require('bcrypt');

router.post('/signup',async(req,res)=>{
    try {
        const {error}=validate(req.body)
        if(error)return res.status(400).json({message: error.details[0].message})

        const user= await User.findOne({email:req.body.email})
        if(user)return res.status(409).json({message:"User with given email already exists"})

        const checkUsername=await User.findOne({username:req.body.username})
        if(checkUsername)return res.status(409).json({message:"Username already exists"})
        
        
        const salt=await bcrypt.genSalt(Number(process.env.SALT))
        const hashpassword= await bcrypt.hash(req.body.password,salt)

        const newUser=await new User({...req.body,password: hashpassword}).save()

        const token=newUser.generateAuthToken()

        res.status(200).json({message:"User created successfully",token, user:{_id:newUser._id,username:newUser.username,email:newUser.email}})


    } catch (error) {
         res.status(500).json({message:"Internal Server Error"})
         console.log(error)
    }
})

module.exports=router