const express=require('express')
const router= express.Router()


const { getnotfications,unreadnotficationscount } = require('../controller/notfications.controller')
const{authentication}=require('../middleware/auth.middleware')

router.use(authentication)
router.get('/notifications',getnotfications)
router.get('/notificationscount',unreadnotficationscount)



module.exports=router