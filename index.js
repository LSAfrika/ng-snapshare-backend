const express= require('express')
const app=express()
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

const LocalDBconnection = `mongodb://localhost:27017/snapshareBE`;


app.get('/',(req,res)=>{

    res.send('hello welcome to snapshare backend')

})


app.use('/photos',require('./routes/post.routes'))
app.use('/comments',require('./routes/comments.routes'))
app.use('/likes',require('./routes/likes.routes'))
app.use('/user',require('./routes/users.routes'))




mongoose
  .connect(LocalDBconnection, {
    useNewUrlParser: true,
    useunifiedtopology: true,
  })
  .then(() => {
    app.listen(4555,()=>{
        console.log('app is running');
    })
  })
  .catch((err) => console.log(err));



