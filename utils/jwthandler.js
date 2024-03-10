const jwt = require('jsonwebtoken');
//Constant
const constants = require('../constants/constant.json');
async function jwtHandler(req,res,next){
    const token = req.header("Authorization");
    if(!token){
        return res.status(constants.statusCode.NOT_AUTHOURIZED).json({
            message: 'Unautorized: no token provided'
        })
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY);
        req.userId = decoded.data;
        next();
    } catch (error) {
        return res.status(constants.statusCode.NOT_FOUND).json({
            message:"Something went wrong with tokens"
        })
    }
}
module.exports=jwtHandler;
