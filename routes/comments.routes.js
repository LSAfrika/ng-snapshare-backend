const express=require('express')
const router= express.Router()

const{postcomment,updatecomment,deletecomment}=require('../controller/comments.controller')
const{authentication}=require('../middleware/auth.middleware')

router.use(authentication)
router.post('/post/:postid',postcomment)
router.patch('/update/:postid',updatecomment)
router.delete('/delete/:postid',deletecomment)




module.exports=router