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


            return
        }
// return res.send({fromtoid,tofromid})

    } catch (error) {
        res.send({errormessge:error.message})
        
    }
}

exports.retrieveusermessages=async(req,res)=>{
    try {
        
        const chatid=req.params.chatid

        const tomessages=await messagesmodel.find({to_from:chatid})
        const frommessages=await messagesmodel.find({from_to:chatid})

        if(tomessages!==null ) return res.send(tomessages)


           
        
        if( frommessages!==null)  return res.send(frommessages)

        return res.send({messages:[]})

        


    } catch (error) {
        
    }
}