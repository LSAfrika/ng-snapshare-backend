const express=require('express')
const router= express.Router()
const{authentication}=require('../middleware/auth.middleware')
const{directmessage,retrieveusermessages}=require('../controller/messages.controller')


router.use(authentication)
router.get('/getallmessages')
router.get('/getusermessage/:currentchat',retrieveusermessages)



router.post('/',directmessage)
router.delete('/deletemessage/:userchat')


//* post routes




module.exports=router