const express= require('express')
const app=express()
const socketserve = require("http").createServer(app);
const cors = require("cors");
const expressuploader=require('express-fileupload')
const cookieparser= require('cookie-parser')
const mongoose = require('mongoose')
// const fileuploader = require('express-fileupload')
app.use(expressuploader())
app.use(cookieparser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

mongoose.set('strictQuery', false);

const LocalDBconnection = `mongodb://0.0.0.0:27017/snapshareDB`;
const PORT =process.env.PORT||4555

app.get('/',(req,res)=>{

    res.send('hello welcome to snapshare backend')

})


app.use('/photos',require('./routes/post.routes'))
app.use('/comments',require('./routes/comments.routes'))
app.use('/likes',require('./routes/likes.routes'))
app.use('/user',require('./routes/users.routes'))
app.use('/comments',require('./routes/comments.routes'))





const entry=async()=>{

  try {
console.log('app entry point');
    await mongoose.connect(LocalDBconnection, { useNewUrlParser: true,useunifiedtopology: true})
    await socketserve.listen(PORT)
    console.log(`SERVER RUNNING ONN PORT ${PORT}`);
    require('./socketserver/socket.server')(socketserve)
    
  } catch (error) {
    console.log(error.message);
  }

}

entry()




