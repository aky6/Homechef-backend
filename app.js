const express = require('express');
const socket = require("socket.io");
var db = require('./server/config/db');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
var multer = require('multer');
var upload = multer();

let router = express.Router();
router = require('./server/routes/index');
const cors = require('cors');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const app = express();
global.__basedir = __dirname;
//midlewares
app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(cookieparser());
app.use(cors());
app.use(upload.array());


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// console.log(router);



// DB Connection

// router.usercartrouter(app, db); 
router.authrouter(app, db);
router.deliveryrouter(app, db);
// router.orderrouter(app, db);
// router.paymentrouter(app, db);

// router.itemrouter(app, db);
// router.notesrouter(app, db);
// router.subcategoryrouter(app, db);



// app.get("/", (req, res) => {
// res.send("hello from node");
// });

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    // console.log(`Server is running on port ${port}`);
});
const io = require('socket.io')(server);
app.use(function (req, res, next) {
    req.io = io;
    next();
});