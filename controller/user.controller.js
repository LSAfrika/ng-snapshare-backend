const {usermodel,postsmodel}=require('../models/main.models')

exports.signupuser=async(req,res)=>{

    try {
        const{token}=req.body
        res.send({token})
        
    } catch (error) {
        res.send({errormessage:error.message})
    }

}
exports.signinuser=async(req,res)=>{

    try {

        const{token,email,userid,refreshtoken}=req.body
        res.send({userid,email,token,refreshtoken})
        
    } catch (error) {
        res.send({errormessage:error.message})
        
    }

}

exports.authprovidersignin=async(req,res)=>{

    try {

        const{token,email,userid}=req.body
        console.log(token,email,userid);
        res.send({userid,email,token})
        
    } catch (error) {
        res.send({errormessage:error.message})
        
    }

}
exports.updateuser=async(req,res)=>{

    try {
        res.send('update user hit')
    } catch (error) {
        res.send({errormessage:error.message})
        
    }

}

exports.getuser=async(req,res)=>{
    try {
        const userid=req.params.id
        const singleuser= await usermodel.findById(userid).select("_id username imgurl createdAt email")
        if(singleuser===null)throw new Error('no user ')

        const userposts = await postsmodel.find({user:userid}).limit(5)

        if(userposts.length === 0) return res.send(singleuser)

        res.send({singleuser,userposts})
        
    } catch (error) {
        res.send({errormessage:error.message})
        
    }

}

exports.getalluser=async(req,res)=>{
    try {
        const allusers= await usermodel.find().select("_id username imgurl createdAt email")
        
        res.send(allusers)
    } catch (error) {
        res.send({errormessage:error.message})
        
    }

}

exports.deleteuser=async(req,res)=>{

    try {
        res.send('delete user hit')
        
    } catch (error) {
        res.send({errormessage:error.message})
        
    }

}