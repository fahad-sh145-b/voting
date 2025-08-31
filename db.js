const mongoose = require('mongoose');

require('dotenv').config();



//define the mongodb connection url

// const mongoURL = 'mongodb://127.0.0.1:27017/academy'
// const mongoURL ='mongodb+srv://king:fahad12345@cluster0.t1jwt77.mongodb.net/'
// const mongoURL = process.env.MONGODB_URL;
const mongoURL = process.env.MONGODB_URL_LOCAL;



//set up mongodb connection

mongoose.connect(mongoURL,{
//   useNewUrlParser: true,
//   useUnifiedTopology:true
})


//get the default connection
//mongoose maintains a default connection object representing the mongodb connection
const db = mongoose.connection;

//define  event listeners for database connection

db.on('connected' ,()=>{
    console.log('connnected to the mongodb server');
})

db.on('error' ,(err)=>{
    console.error('mongodb connection server',err);
})

db.on('disconnected' ,()=>{
    console.log('mongodb disconnected');

})

module.exports =db;

