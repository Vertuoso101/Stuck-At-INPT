const express = require('express');
const mongoose = require('mongoose');
const cors =  require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressJwt = require('express-jwt');
const userRoute = require('./routes/user');
const postRoute =  require('./routes/post');
//middlewares
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


//connect to database, btw i used my database 'admin' so you must use your own database to run the code succefully
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/admin', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log("MongoDB Conected")
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
connectDB();

//using routes

app.use('/', userRoute);
app.use('/', postRoute);



//running the node server
app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`server started at port 3000`);
    }
})



