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
});

const productSchema = new Schema({
    title: {
        required: true,
        type: String,
    },
    description: {
        required: false,
        type: String,
    },
    images: {
        type: Array,
        required: false,
    },
    slug: {
        required: true,
        type: String,
    },
    rating: {
        type: Number,
        required: false,
    },
    startingBid: {
        required: true,
        type: Number,
    },
    auctionDuration: {
        required: true,
        type: String,
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'eAuctionUser',
        required: true
    },
    bids: {
        type: [BidUserSchema],
        required: false
    }
});

const productModel = mongoose.model('auctionProduct', productSchema);
module.exports = productModel;
