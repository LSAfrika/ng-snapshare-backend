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
        res.send('get user hit')
        
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