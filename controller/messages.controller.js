const{messagesmodel,usermodel}=require('../models/main.models')


exports.directmessage=async(req,res)=>{
    try {
        // const chatid= req.params.chatid
        const {userid,message,to,from}=req.body
        if(userid!==from)return res.status(409).send({message:'can not send message to user conflicting credentials'})
// res.send({userid,message,to,from})

        // return
        // let reversechatid=[]
        const fromchatid=from+":"+to
        const tochatid=to+":"+from
        // console.log(fromchatid,'\n',tochatid);
//    if(from!==userid)return res.send('error with body ofmessage')
        const primarychatid= await messagesmodel.findOne({chatuid:fromchatid})
        const secondarychatid= await messagesmodel.findOne({chatuid:tochatid})
       
        if(primarychatid ===null && secondarychatid===null) {
            const messagepayload={
                message,
                to,
                from,
                chatuid:fromchatid
            }

            const sentmessage=await messagesmodel.create({...messagepayload})

            return res.send({message:'message sent successfully',sentmessage})
        }

        if(primarychatid !=null){

            const messagepayload={
                message,
                to,
                from,
                chatuid:primarychatid.chatuid
            }

            const sentmessage=await messagesmodel.create({...messagepayload})

            return res.send({message:'message sent successfully',sentmessage})

            
        }

        if(secondarychatid !=null){

            const messagepayload={
                message,
                to,
                from,
                chatuid:secondarychatid.chatuid
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
        

        const pagesize = 2;
        let pagination = req.query.pagination;
        const from =req.body.userid

        const to=req.params.currentchat
        const fromchatid=from+":"+to
        const tochatid=to+":"+from
       
        const frommessages=await messagesmodel.find({chatuid:fromchatid}).select("message")   .sort({createdAt:1})
        // .skip(pagination * pagesize)
        // .limit(pagesize)
        const tomessages=await messagesmodel.find({chatuid:tochatid})   .sort({createdAt:-1})
        .skip(pagination * pagesize)
        .limit(pagesize)
       

        // if(frommessages.length>0 ) return res.send({message:'received from  chat id',chat:frommessages.reverse()})
        if(frommessages.length>0 ) return res.send({message:'received from  chat id',chat:frommessages})


           
        
        if( tomessages.length>0)  return res.send({message:'received from reverse chat id',chat:tomessages.reverse()})

       if(tomessages.length === 0 && frommessages.length===0)  return res.send({message:'no messages found',chat:[]}) 
       
    //    return res.send({info:'missing chat',messages:[]}) 

        


    } catch (error) {

        res.send({errormessge:error.message})
        
    }
}