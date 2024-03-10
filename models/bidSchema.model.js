const mongoose = require('mongoose');
const { Schema } = mongoose;

const BidUserSchema = new Schema({
    productId: {
        required: true,
        type: Schema.Types.ObjectId, // assuming productId refers to the auctionProduct's ObjectId
        ref: 'auctionProduct' // referencing the auctionProduct model
    },
    username: {
        required: true,
        type: String,
    },
    userId: {
        required: true,
        type: Schema.Types.ObjectId, // assuming userId refers to the ObjectId of the user
        ref: 'eAuctionUser' // referencing the eAuctionUser model
    },
    amount: {
        required: true,
        type: Number,
    },
},{
    timestamps:true,
    versionKey:false
});

const BidModel = mongoose.model('eAuctionUser',BidUserSchema);
module.exports = BidModel;