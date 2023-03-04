const express=require('express')
const router= express.Router()


const { getnotfications } = require('../controller/notfications.controller')
const{authentication}=require('../middleware/auth.middleware')

router.use(authentication)
router.get('/notifications',getnotfications)



module.exports=router