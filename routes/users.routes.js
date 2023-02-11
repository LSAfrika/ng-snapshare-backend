const express=require('express')
const router= express.Router()
const {deleteuser,getuser,signupuser,signinuser,updateuser,getalluser}=require('../controller/user.controller')
const{signup,signin}=require('../middleware/auth.middleware')

// router.get('/user',getuser)
router.get('/singleuser/:id',getuser)
router.get('/allusers',getalluser)
router.post('/signin',signin,signinuser)
router.post('/signup',signup,signupuser)
router.patch('/update/:id',updateuser)
router.delete('/delete/:id',deleteuser)

module.exports=router