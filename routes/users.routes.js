const express=require('express')
const router= express.Router()
const {deleteuser,getuser,postuser,updateuser}=require('../controller/user.controller')

// router.get('/user',getuser)
router.get('/:id',getuser)
router.post('/post',postuser)
router.patch('/update/:id',updateuser)
router.delete('/delete/:id',deleteuser)

module.exports=router