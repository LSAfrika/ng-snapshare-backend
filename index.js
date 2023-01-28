const express= require('express')
const app=express()
const cors = require("cors");
const expressuploader=require('express-fileupload')
const cookieparser= require('cookie-parser')
app.use(expressuploader())
app.use(cookieparser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.get('/',(req,res)=>{

    res.send('hello welcome to snapshare backend')

})

app.listen(4555,()=>{
    console.log('app is running');
})