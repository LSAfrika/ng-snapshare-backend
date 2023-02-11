const {usermodel}=require('../models/main.models')

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

        const{token}=req.body
        res.send({token})
        
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
        res.send(singleuser)
        
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