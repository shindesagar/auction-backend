const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const UserModel = require('../models/userSchema.model');
const bcryptPassword = require("../utils/bcryptPassword");

//Constant
const constants = require('../constants/constant.json');

const UserRegistraion = async (req,res)=>{
    try {
        const {email,password,firstName,lastName} = req.body;
        const validArray = [email,password];

        //Checks if fields are empty
        if(validArray.includes('')){
            return res.status(constants.statusCode.BAD_REQUEST).json({
                message: "Missing input value",
                data:{}
            })
        }
        const hashedPassword = await bcryptPassword(password)
        const insertData = await UserModel.create({email,password:hashedPassword,firstName,lastName});

        res.status(constants.statusCode.SUCCESS).json({
            message: ' Registered user successfully',
            data:insertData
        })
    } catch (error) {
        res.status(constants.statusCode.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            data:{}
        })
    }
}

const loginForm = async (req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email,!password){
            return res.status(constants.statusCode.BAD_REQUEST).json({
                message:'Please enter all your credentials',
                data:{}
            })
        }
        const ifUser = await UserModel.findOne({email:email});
        if(!ifUser){
            return res.status(constants.statusCode.BAD_REQUEST).json({
                message: `User with this ${email} is not found !`
            })
        }
        const ismatchedPassword = await bcrypt.compare(password,ifUser.password);
        if(ismatchedPassword){
            const token = jwt.sign({
                data:ifUser._id
            },process.env.JWT_SECRETKEY, { expiresIn: '1h' })
            return res.status(constants.statusCode.SUCCESS).json({
                message: 'User is logged in',
                email,
                token
            })
        }
        res.json({
            message: `User is not able to login due to the wrong password`
        })
    } catch (error) {
        res.status(constants.statusCode.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            data:{}
        })
    }
}
const userUpdate = async (req,res)=>{
    try {
        const {id} = req.params;
    
        const {firstName, lastName,email,phoneNumber,dob,profilepic} = req.body;
        console.log(profilepic);
        if(!id || id == ''){
            return res.status(constants.statusCode.BAD_REQUEST).json({
                message: constants.statusMessage.BAD_REQUEST,
                data:{}
            })
        }
        const userUpdate = await UserModel.findByIdAndUpdate(id,{$set:{
            firstName:firstName,lastName:lastName,email:email,phoneNumber:phoneNumber,dob:dob,profilepic:profilepic
        }})
        res.status(constants.statusCode.SUCCESS).json({
            message:"User Updated Successfully",
            data:userUpdate
        }) 
    } catch (error) {
        res.status(constants.statusCode.INTERNAL_SERVER_ERROR).json({
            message: constants.statusMessage.INTERNAL_SERVER_ERROR,
            data:{}
        })
    }
}
const getUserList = async(req,res) =>{
    let filter;
    try {
        filter = req.query.filter ? JSON.parse(req.query.filter) : {}
        const userList = await UserModel.find(filter).lean();
        res.status(constants.statusCode.SUCCESS).json({
            message:"Fetch all users successfully",
            data:userList
        })
    } catch (error) {
        return res.status(constants.statusCode.BAD_REQUEST).json({
            message:'Bad Request',
            data:{}
        })
    }
}
module.exports={
    UserRegistraion,
    loginForm,
    userUpdate,
    getUserList
}