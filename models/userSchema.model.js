const mongoose = require("mongoose");
const {Schema} = mongoose;

const UserdetailSchema = new Schema({
    firstName:{
        require:false,
        type: String,
    },
    lastName:{
        require:false,
        type: String,
    },
    email:{
        require:true,
        type: String,
        unique:true
    },
    password:{
        require:true,
        type: String,
    },
    phoneNumber:{
        require:false,
        type: String,
    },
    dob:{
        require:false,
        type: String,
    },
    profilepic:{
        require:false,
        type: String,
    }
},{
    timestamps:true
});

const UserModel = mongoose.model('eAuctionUser',UserdetailSchema);
module.exports = UserModel;