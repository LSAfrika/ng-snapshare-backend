const jwt = require('jsonwebtoken')
const argon2 = require('argon2');
const {usermodel}=require('../models/main.models')
require('dotenv').config()
exports.signup=async(req,res,next)=>{
    try {
        const {email,password,confirmpassword,username}=req.body

        if(password !== confirmpassword) return res.status(409).send('password mismatch')

        // console.log('email test',testemail(email))/
        const validemail = testemail(email)
        
        if(validemail === false) return res.status(409).send('please enter valid email')

        const user=await usermodel.find({email:email})
        // console.log('user length: \n', user.length);
        if(user.length>0) return res.status(409).send('user already exists please sign in')

        const hash=await argon2.hash(password)
        const createuser = await usermodel.create({email,hash,username})

        const payload={
            email:email,
            username:username,
            _id:createuser._id
        }
        const token = jwt.sign(payload,process.env.SIGNING_TOKEN,{
            expiresIn:'10m'
        })


        // res.send({token})
        req.body.token=token
next();

    } catch (error) {

        res.send({errormessage:error.message})
        
    }
}

exports.signin=async(req,res,next)=>{
    try {
        
        const {email,password}=req.body
        const validemail = testemail(email)
        
        if(validemail === false) return res.status(409).send('please enter valid email')
        const user = await usermodel.findOne({email})

        if(user){
            // console.log('user in db: \n',user)
            const passwordhash=user.hash
            const passwordvalidation=await argon2.verify(passwordhash, password)

            if(passwordvalidation === false) throw new Error('credentials missmatch')
            console.log('password verification: ',passwordvalidation);


            const payload={
                email:email,
                username:user.username,
                _id:user._id
            }
            const token = jwt.sign(payload,process.env.SIGNING_TOKEN,{
                expiresIn:'10m'
            })
    
    
            // res.send({token})
            req.body.token=token
    next();

        }

    } catch (error) {

        res.send({errormessage:error.message})
        
    }
}


exports.authentication=async(req,res,next)=>{
    try {
        
    } catch (error) {
        
    }
}


const testemail=(email)=> {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }