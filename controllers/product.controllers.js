const productModel = require('../models/productSchema.model');

//Constant
const constants = require('../constants/constant.json');

const CreateProduct = async(req,res) =>{
    // console.log(req.body);
    try {
        const {title,description,images,startingBid,auctionDuration,seller,slug} = req.body;
        const vallidArray = [title,description,startingBid,auctionDuration,seller];
        // console.log(title,description,images,startingBid,auctionDuration,seller,slug);
        if(vallidArray.includes('')){
            return res.status(constants.statusCode.BAD_REQUEST).json({
                message: "Missing input value",
                data:{}
            })
        }
        const insertProduct = await productModel.create({
            title,description,images,startingBid,auctionDuration,seller,slug
        })
        res.status(constants.statusCode.SUCCESS).json({
            message:"Product Added Successfully",
            data:insertProduct
        })
    } catch (error) {
       res.status(constants.statusCode.INTERNAL_SERVER_ERROR).json({
            message: constants.statusMessage.INTERNAL_SERVER_ERROR,
            data:{}
        })
    }
}
const getProductList = async(req,res) =>{
    let filter
    try {
        filter = req.query.filter ? JSON.parse(req.query.filter) : {}
    } catch (error) {
        return res.status(constants.statusCode.BAD_REQUEST).json({
            message:'Bad Request'
        })
    }
    let data
    try {
       data  = await productModel.find(filter).lean();
       const newDate = new Date()
       const date1 = new Date(newDate);
       const date2 = new Date(data.auctionDuration);
       if(date1 > date2){
        return res.status(constants.statusCode.BAD_REQUEST).json({
            message:'The auction period has already ended'
        })
       }
    } catch (error) {
        return res.status(constants.statusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Something went wrong',
        });
    }
    if (data.length >= 1) {
        return res.status(constants.statusCode.SUCCESS).json({ count: data.length, data });
    } else {
        return res.status(constants.statusCode.NOT_FOUND).json({
            message: 'No Data Found',
        });
    }
}
module.exports = {
    getProductList,
    CreateProduct,
}