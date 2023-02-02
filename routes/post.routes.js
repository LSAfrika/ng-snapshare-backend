const express=require('express')
const router= express.Router()
const {postphoto,deletephoto,getallposts,getsinglepost,getcategoryposts}=require('../controller/post.controller')
const{authentication}=require('../middleware/auth.middleware')


router.get('/allposts',getallposts)
router.get('/allposts/:category',getcategoryposts)
router.get('/post/:id',getsinglepost)

router.post('/post',authentication,postphoto)
router.delete('/post/:photoid',deletephoto)

module.exports=router
