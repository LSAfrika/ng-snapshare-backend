const express=require('express')
const router= express.Router()
const {postphoto,deletephoto,getallphotos,getsinglephoto,getcategoryphotos}=require('../controller/post.controller')


router.get('/allposts',getallphotos)
router.get('/allposts/:category',getcategoryphotos)
router.get('/post/:id',getsinglephoto)

router.post('/post',postphoto)
router.delete('/post/:photoid',deletephoto)

module.exports=router