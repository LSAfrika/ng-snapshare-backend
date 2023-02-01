const express=require('express')
const router= express.Router()



router.get('/allpost')
router.get('/allpost/:category')
router.get('/post/:id')
router.get('/user')


//* post routes




module.exports=router