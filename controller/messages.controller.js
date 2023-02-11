const{messagesmodel,usermodel}=require('../models/main.models')


exports.directmessage=async(req,res)=>{
    try {
        const chatid= req.params.chatid
        const {userid,message,to,from}=req.body


        // let reversechatid=[]
        const chatidarray=chatid.split(':')
        const reversechatid=chatidarray[1]+":"+chatidarray[0]
        console.log(chatidarray,'\n',reversechatid);
//    if(from!==userid)return res.send('error with body ofmessage')
        const primarychatid= await messagesmodel.findOne({chatuid:chatid})
        const secondarychatid= await messagesmodel.findOne({chatuid:reversechatid})
       
        if(primarychatid ===null && secondarychatid===null) {
            const messagepayload={
                message,
                to,
                from,
                chatuid:chatid
            }

            const sentmessage=await messagesmodel.create({...messagepayload})

            return res.send({message:'message sent successfully',sentmessage})
        }

        if(primarychatid !=null){

            const messagepayload={
                message,
                to,
                from,
                chatuid:chatid
            }

            const sentmessage=await messagesmodel.create({...messagepayload})

            return res.send({message:'message sent successfully',sentmessage})

            
        }

        if(secondarychatid !=null){

            const messagepayload={
                message,
                to,
                from,
                chatuid:reversechatid
            }

            const sentmessage=await messagesmodel.create({...messagepayload})

            return res.send({message:'message sent successfully',sentmessage})


            
        }


    } catch (error) {
        res.send({errormessge:error.message})
        
    }
}

exports.retrieveusermessages=async(req,res)=>{
    try {
        
        const chatid=req.params.chatid
        const chatidarray=chatid.split(':')
        const reversechatid=chatidarray[1]+":"+chatidarray[0]
        const primaryidmessages=await messagesmodel.find({chatuid:chatid})
        const secondaryidmessages=await messagesmodel.find({chatuid:reversechatid})
        console.log('1:',chatid);
        console.log('2:',reversechatid);
        // console.log('messages secondary: ',secondaryidmessages);
        console.log('messages primarry: ',primaryidmessages);

        if(primaryidmessages.length>0 ) return res.send({message:'received from  chat id',primaryidmessages})


           
        
        if( secondaryidmessages.length>0)  return res.send({message:'received from reverse chat id',secondaryidmessages})

       if(primaryidmessages === null && secondaryidmessages===null)  throw new Error('missing chat')
       
    //    return res.send({info:'missing chat',messages:[]})

        


    } catch (error) {

        res.send({errormessge:error.message})
        
    }
}