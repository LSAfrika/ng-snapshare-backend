const express=require('express')
const router= express.Router()
const{authentication}=require('../middleware/auth.middleware')
const{directmessage}=require('../controller/messages.controller')


router.use(authentication)
router.get('/getallmessages')
router.get('/getusermessage/:userchat')



router.post('/:userchatid',directmessage)
router.delete('/deletemessage/:userchat')


//* post routes




module.exports=router