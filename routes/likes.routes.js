const express=require('express')
const router= express.Router()

const{postlike}=require('../controller/likes.controller')
const{authentication}=require('../middleware/auth.middleware')

router.use(authentication)
router.post('/post/:postid',postlike)



module.exports=router