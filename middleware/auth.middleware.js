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
            _id:createuser._id,
            imgurl:createuser.imgurl
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

        console.log('sigin user \n',user);

        if(user === null) throw new Error('no user found')


        if(user){
            // console.log('user in db: \n',user)
            const passwordhash=user.hash
            const passwordvalidation=await argon2.verify(passwordhash, password)

            if(passwordvalidation === false) throw new Error('credentials missmatch')
            console.log('password verification: ',passwordvalidation);


            const payload={
                email:email,
                imgurl:user.imgurl,
                username:user.username,
                _id:user._id
            }
            const token = jwt.sign(payload,process.env.SIGNING_TOKEN,{
                expiresIn:'60m'
            })
    
    
            // res.send({token})
            req.body.token=token
    next();

        }
        throw new Error()

    } catch (error) {

        res.send({errormessage:error.message})
        
    }
}


exports.authentication=async(req,res,next)=>{
    let decodedtoken;
    try {

        const reqtoken = req.headers.authorization;
        const token = reqtoken.split(" ")[1];
         decodedtoken =await jwt.decode(token);
        const verified = await jwt.verify(token, process.env.SIGNING_TOKEN);

        // console.log(('VERIFIED TOKEN:',verified));
        req.body.userid=verified._id

        next()
        
    } catch (error) {

//         if (error.message === "jwt expired") {
// console.log('token expired needs refreshing');
//             const {email,_id,username}=decodedtoken

//             const token=await jwt.sign({email,_id,username},process.env.SIGNING_TOKEN,{expiresIn:'10m'})
//             req.body.userid=_id
//             console.log('new token: ',token);
//             req.body.token= token
//             next()
//         }else{
//             res.send({errormessage:error.message})

//         }

res.send({errormessage:error.message})
        
    }
}


const testemail=(email)=> {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }