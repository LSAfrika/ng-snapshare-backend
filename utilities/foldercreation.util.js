const fs = require("fs");
const mongoose = require("mongoose");

exports.createimagesfolder = async (req, res, next) => {
  try {
    const mongooseid =  mongoose.Types.ObjectId();
    const {caption }=req.body 
// console.log('caption is: ',caption);
// console.log('files to upload: ',req.files);

if (req.files === undefined) return res.send({message:'please add a photos'})
if (caption === undefined) return res.send({message:'please add a caption'})

    req.body._id = mongooseid;
    const idstring=mongooseid.toString()
    console.log("mongoose id: ", idstring);
    req.body._id=idstring

    if(fs.existsSync(`public/uploads/${req.body._id}`)){
      console.log('folder exists');
      path = `uploads/${mongooseid}`;
      req.body.imgpath = path;
      return next()
    }

    await fs.mkdir(`public/uploads/${mongooseid}`, (err) => {
      if (err) {
        console.log(err.message);
      } else {
      path = `/${mongooseid}`;
      // path = `/${mongooseid}`;
        req.body.postfolder = path;
        // console.log(req.body);
        next();
        //  res.status(201).json({ message: "new folder created", idcreated: Adid, adcreated: createdad });
      }
    });
  } catch (error) {
    res.send({ err: error.message });
  }
};

exports.userphotomiddleware = async (req,res,next)=>{
  try {

    const {ownerid}=req.body

    if(fs.existsSync(`public/userphoto/${ownerid}`)){
      console.log('folder exists');
      path = `/${ownerid}`;
      req.body.imgpath = path;
      return next()
    }

    await fs.mkdir(`public/userphoto/${ownerid}`, (err) => {
      if (err) {
        console.log('dir creation error userphot: ',err.message);
      } else {
        path = `/${ownerid}`;
        req.body.imgpath = path;
        // console.log(req.body);
        next();
        //  res.status(201).json({ message: "new folder created", idcreated: Adid, adcreated: createdad });
      }
    });
    
  } catch (error) {
    
  }
}