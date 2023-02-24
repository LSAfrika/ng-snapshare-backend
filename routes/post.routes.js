const express=require('express')
const router= express.Router()
const {postphoto,deletephoto,getallposts,getsinglepost,getcategoryposts,updatephotocomment}=require('../controller/post.controller')
const{authentication}=require('../middleware/auth.middleware')
const{createimagesfolder}=require('../utilities/foldercreation.util')
// todo    GETTING POST SECTION
router.get('/allposts',getallposts)
router.get('/allposts/category',getcategoryposts)
router.get('/singlepost/:id',getsinglepost)


//TODO POST OWNER ROUTES
router.post('/post',authentication,createimagesfolder,postphoto)
router.post('/post',authentication,postphoto)
router.delete('/delete/:photoid',authentication,deletephoto)
router.patch('/update/:photoid',authentication,updatephotocomment)



module.exports=router
