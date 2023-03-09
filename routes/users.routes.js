const express=require('express')
const router= express.Router()
const {deleteuser,getuser,signupuser,signinuser,updateuser,getalluser, getfollowers,getfollowing,followuser}=require('../controller/user.controller')
const{signup,signin,authproviderssignin, refreshtoken, authentication}=require('../middleware/auth.middleware')

// router.get('/user',getuser)
router.get('/singleuser/:id',getuser)
router.get('/followers/:id',getfollowers)
router.get('/following/:id',getfollowing)
router.get('/allusers',getalluser)
router.post('/follow/',authentication,followuser)

router.post('/signin',signin,signinuser)
router.post('/refresh',refreshtoken)
router.post('/authprovidersignin',authproviderssignin,signinuser)
router.post('/signup',signup,signupuser)
router.patch('/update/:id',updateuser)
router.delete('/delete/:id',deleteuser)

module.exports=router