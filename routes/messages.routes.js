const express=require('express')
const router= express.Router()
const{authentication}=require('../middleware/auth.middleware')
const{directmessage,retrieveusermessages,retrieveuserchats}=require('../controller/messages.controller')


router.use(authentication)
router.get('/getallmessages')
router.get('/getusermessage/:currentchat',retrieveusermessages)
router.get('/getuserchats/',retrieveuserchats)



router.post('/',directmessage)
router.delete('/deletemessage/:userchat')


//* post routes




module.exports=router