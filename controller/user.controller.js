const {usermodel}=require('../models/main.models')

exports.postuser=async(req,res)=>{

    try {
        res.send('post user hit')
        
    } catch (error) {
        
    }

}

exports.updateuser=async(req,res)=>{

    try {
        res.send('update user hit')
    } catch (error) {
        
    }

}

exports.getuser=async(req,res)=>{
    try {
        res.send('get user hit')
        
    } catch (error) {
        
    }

}

exports.deleteuser=async(req,res)=>{

    try {
        res.send('delete user hit')
        
    } catch (error) {
        
    }

}