const express = require('express');
const mongoose = require("mongoose");
const upload = require("./middlewares/multer.middleware");
const path = require('path');
const http = require('http'); // Import http module for creating server
const socketIO = require('socket.io');
const cors = require('cors'); 
const Product = require('./models/productSchema.model');
const constants = require('./constants/constant.json');
require('dotenv').config();
const stripe = require("stripe");
// mongoose.connect(`${process.env.MONGO_URL}/payment-gateway`);
const app = express();
app.use(express.json());


const server = http.createServer(app); // Create HTTP server
const io = socketIO(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:['GET','POST']
    }
}); // Attach Socket.IO to the server
app.use(cors(
    {
        origin:"http://localhost:3000",
        handlePrefilghtRequest:(req,res) =>{
        res.WriteHead(200,{
            "Access-Control-Allow-Origin":"*",
            "Access-Control-Allow-Method":"GET,POST",
            "Access-Control-Allow-Headers":"My Custom Header",
            "Access-Control-Allow-Credentials":true,
        })
        }
    }
))
// const redirectToHttps = (req,res,next) =>{
//     if(req.headers['x-forwarded-proto'] !== 'https'){
        
//         return res.redirect(['https://', req.get('Host'), req.url].join(''));
//     }
//     next();
// }
//// line no 38Redirect to HTTPs
// app.use(redirectToHttps);
app.use((req,res,next) =>{
    res.setHeader('Referrer-Policy', 'origin'); //share url in same origin not allow other origin eg. share url eAuction to whatsapp not allow
    res.removeHeader('X-Powered-By'); //X-Powered-By reveals which server you used
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    next();
})
const port = process.env.PORT || 7000;

// Error handling middleware for Express
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
        console.log(error.message);
    }
}
connectToDB();

// Serve static files (images) from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Use the upload middleware wherever you need to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(constants.statusCode.BAD_REQUEST).send('No file uploaded.');
    }
    res.status(constants.statusCode.SUCCESS).json({
        message: 'File uploaded successfully',
        data: file
    })
});

// Routes
app.use('/user-ms', require("./routes/user.route"));
app.use('/product-ms', require("./routes/product.route"));
app.use('/api', require("./routes/payment.route"));
// Socket.IO event handling
io.on('connection', (socket) => {
    console.log('User connected');
    
    // Handle placeBid event
    socket.on('placeBid', async (bidDetails) => {
        try {
            // Push bid details into the 'bids' array of the corresponding product
            const updatedProduct = await Product.findByIdAndUpdate(
                bidDetails.productId,
                { $push: { bids: bidDetails } },
                { new: true, useFindAndModify: false }
            );
            
            // Emit the updated product details to all connected clients
            io.emit('placeBidDetails', updatedProduct);
        } catch (error) {
            console.error('Error placing bid:', error);
        }
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
