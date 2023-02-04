const express=require('express')
const router= express.Router()
const {postphoto,deletephoto,getallposts,getsinglepost,getcategoryposts,updatephotocomment}=require('../controller/post.controller')
const{authentication}=require('../middleware/auth.middleware')


router.get('/allposts',getallposts)
router.get('/allposts/:category',getcategoryposts)
router.get('/singlepost/:id',getsinglepost)

router.post('/post',authentication,postphoto)
router.delete('/delete/:photoid',authentication,deletephoto)
router.patch('/update/:photoid',authentication,updatephotocomment)

module.exports=router
