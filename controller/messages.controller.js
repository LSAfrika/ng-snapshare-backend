const{messagesmodel,usermessagesmodel}=require('../models/main.models')


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
        const primarychatid= await messagesmodel.findOne({chatid:fromchatid})
        const secondarychatid= await messagesmodel.findOne({chatid:tochatid})
       
        if(primarychatid ===null && secondarychatid===null) {
            const messagepayload={
                message,
                to,
                from,
                chatid:fromchatid
            }

            const sentmessage=await messagesmodel.create({...messagepayload})

            return res.send({message:'message sent successfully',sentmessage})
        }

        if(primarychatid !=null){

            const messagepayload={
                message,
                to,
                from,
                chatid:primarychatid.chatid
            }

            const sentmessage=await messagesmodel.create({...messagepayload})

            return res.send({message:'message sent successfully',sentmessage})

            
        }

        if(secondarychatid !=null){

            const messagepayload={
                message,
                to,
                from,
                chatid:secondarychatid.chatid
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
        

        const pagesize = 1;
        let pagination = req.query.pagination;
        const from =req.body.userid
        
// console.log('loged in user',from);
        const to=req.params.currentchat
        
        const fromchatid=from+":"+to
         console.log('from user',fromchatid);
        const tochatid=to+":"+from
         console.log('to user',tochatid);
       
        const frommessages=await messagesmodel.find({chatid:fromchatid})   .sort({createdAt:1})
        // .skip(pagination * pagesize)
        // .limit(pagesize) .select("message")
        const tomessages=await messagesmodel.find({chatid:tochatid})   .sort({createdAt:-1})
        // .skip(pagination * pagesize)
        // .limit(pagesize)
       

         if(frommessages.length>0 )console.log({message:'received from  chat id',chat:frommessages.reverse()})
        if(frommessages.length>0 ) {
            
            let filteredchat=[]
            frommessages.forEach(msg=>{

                if(msg.deletechat.includes(from)){
                  //  console.log(' array has user')


             console.log('index of filtered chat: ', frommessages.indexOf(msg)  );      
                //  frommessages[msg]=[]

                }else{
                    filteredchat.push(msg)
                    return   console.log(' array missing user')
                }
                

            }
                )




            return res.send({message:'received from  chat id',chat:filteredchat})
        
        }


           
        if(tomessages.length>0 ) console.log({message:'received to  chat id',chat:tomessages.reverse()})
        
        if( tomessages.length>0)  {
            
            let filteredchat=[]
            tomessages.forEach(msg=>{

                if(msg.deletechat.includes(from)){
                  //  console.log(' array has user')


             console.log('index of filtered chat: ', frommessages.indexOf(msg)  );      
                //  frommessages[msg]=[]

                }else{
                    filteredchat.push(msg)
                    return   console.log(' array missing user')
                }
                

            }
                )

            return res.send({message:'received to reverse chat id',chat:filteredchat})
        }

       if(tomessages.length === 0 && frommessages.length===0)  return res.send({message:'no messages found',chat:[]}) 
       
    //    return res.send({info:'missing chat',messages:[]}) 

        


    } catch (error) {

        res.send({errormessge:error.message})
        
    }
}

exports.retrieveuserchats=async(req,res)=>{
    try {
        
        const{userid}=req.body
        // const pagesize = 2;
        // let pagination = req.query.pagination;
        // const from =req.body.userid

        // const to=req.params.currentchat
        // const fromchatid=from+":"+to
        // const tochatid=to+":"+from
       
        const userchatsarray=await usermessagesmodel.findById({_id:userid}).populate({path:'userchats',populate:[{path:'chatingwith', model:"USER",
        select:"_id username imgurl lastseen online"}]})
    console.log('msg controller: userchats list',userchatsarray);
        return res.send(userchatsarray)



        const tomessages=await messagesmodel.find({chatid:tochatid})   .sort({createdAt:-1})
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


exports.deletechatthread=async(req,res)=>{
    try {
        const {userid}=req.body
        const threadid= req.params.userthreadid

        const ids=threadid.split(':')
        if(ids[0] ==userid ||ids[1]==userid){

         //   const userthread = await messagesmodel.find()
            const userthread = await messagesmodel.find({chatid:threadid})
            const userchatlist= await usermessagesmodel.findById(userid)

            
        // return    console.log('chat id data',userthread);

       const indexofchatid= userchatlist.userchats.map(chat=> chat.chatid).indexOf(threadid)
       userchatlist.userchats.splice(indexofchatid,1)
          await userchatlist.save()
       //return res.send({userchats:userchatlist.userchats,indexofchatid})
    
            const indexofchattoremove= userchatlist.userchats.map(elem=> elem.chatid).indexOf(threadid)
           // console.log('index for deletion',indexofchattoremove);
            userchatlist.userchats.splice(indexofchattoremove,1)
          userthread.forEach(async(thread)=>{
            if(thread.deletechat.includes(userid)){
             return    console.log('user has already delete chat')
                // thread.deletechat=[]
                // await thread.save()
                //  return
                
                }
            thread.deletechat.push(userid)
            await thread.save()
          })

         

       return res.send({message:'successfully deleted user thread'})
        }
        throw new Error('chat owner missmatch')


    } catch (error) {
        console.log('deletechat error',error.message);
        res.send({errormessge:error.message})
    }
}

exports.offlinesocketmessage= async(fromid,toid,messagepayload,io,onlineusers)=>{

    console.log('current online user sending message',onlineusers);
    const chatid_1=await messagesmodel.findOne({chatid:fromid})
    const chatid_2=await messagesmodel.findOne({chatid:toid})

    console.log('check one: ',chatid_1);
    console.log('check two: ',chatid_2);
if(chatid_1==null&&chatid_2==null){
const messagetosend={
    message:messagepayload.message,
    to:messagepayload.to,
    from:messagepayload.from,
    chatid:fromid
}
await messagesmodel.create({...messagetosend})

const senderhaschats= await usermessagesmodel.findById({_id:messagetosend.from})
const receiverhaschats= await usermessagesmodel.findById({_id:messagetosend.to})

if(senderhaschats==null)    await usermessagesmodel.create({_id:messagetosend.from,userchats:[{chatid:messagetosend.chatid,lastmessage:messagetosend.message,chatingwith:messagetosend.to,timestamp:Date.now()}]})
if(receiverhaschats==null)    await usermessagesmodel.create( {_id:messagetosend.to,userchats:[{chatid:messagetosend.chatid,lastmessage:messagetosend.message,chatingwith:messagetosend.from,timestamp:Date.now()}]})

if(senderhaschats!==null)  {

senderhaschats.userchats.push({chatid:messagetosend.chatid,lastmessage:messagetosend.message,chatingwith:messagetosend.to,timestamp:Date.now()})
await senderhaschats.save()
} 

if(receiverhaschats!==null)  {

    receiverhaschats.userchats.push({chatid:messagetosend.chatid,lastmessage:messagetosend.message,chatingwith:messagetosend.from,timestamp:Date.now()})
    await receiverhaschats.save()
     }

// console.log('new message thread',sentmessage);
io.to(onlineusers).emit('receive-offline-message',messagetosend)


}

if(chatid_1 !==null){

const messagetosend={
    message:messagepayload.message,
    to:messagepayload.to,
    from:messagepayload.from,
    chatid:chatid_1.chatid
}

//  const sentmessage=
 await messagesmodel.create({...messagetosend})
//todo ==========================================================================================================================

const from= await usermessagesmodel.findById(messagetosend.from)
let to= await usermessagesmodel.findById(messagetosend.to)


//todo ==========================================================================================================================
if(from==null){
from=  await usermessagesmodel.create( {_id:messagetosend.from,userchats:[{chatid:messagetosend.chatid,lastmessage:messagetosend.message,chatingwith:messagetosend.to,timestamp:Date.now()}]})

}
if(to==null){
to=  await usermessagesmodel.create( {_id:messagetosend.to,userchats:[{chatid:messagetosend.chatid,lastmessage:messagetosend.message,chatingwith:messagetosend.from,timestamp:Date.now()}]})

}



if(from!==null){
const indexoffromchat=from.userchats.map(msg=>msg.chatid)
.indexOf(messagetosend.chatid)

console.log('index of from chat to update: ',indexoffromchat);
// console.log('index of from chat to update: ',indexoffromchat);
console.log(' chatid to comare: ',messagetosend.chatid);

from.userchats.splice(indexoffromchat,1)
from.userchats.push({chatid:messagetosend.chatid,lastmessage:messagetosend.message,chatingwith:messagetosend.to,timestamp:Date.now()})
// console.log('sender updated  array: ',from);
await from.save()

// return
}
if(to!==null)  {
const indexoftochat=to.userchats.map(msg=>msg.chatid).indexOf(messagetosend.chatid)
// console.log('to usermessages: ',to.userchats);
console.log('index of to chat to update: ',indexoftochat);

to.userchats.splice(indexoftochat,1)
to.userchats.push({chatid:messagetosend.chatid,lastmessage:messagetosend.message,chatingwith:messagetosend.from,timestamp:Date.now()})

// console.log('recepient updated  array: ',to);
await to.save()



}

io.to(onlineusers).emit('receive-offline-message',messagetosend)



}

if(chatid_2 !=null){

const messagetosend={
    message:messagepayload.message,
    to:messagepayload.to,
    from:messagepayload.from,
    chatid:chatid_2.chatid
}

// console.log('reply message: ',messagetosend);

// return

const sentmessage=await messagesmodel.create({...messagetosend})
// console.log(' message thread 2',sentmessage);



//todo ==========================================================================================================================

let from= await usermessagesmodel.findById(messagetosend.from)
const to= await usermessagesmodel.findById(messagetosend.to)

if(from==null){
from=  await usermessagesmodel.create( {_id:messagetosend.from,
userchats:[{chatid:messagetosend.chatid,lastmessage:messagetosend.message,chatingwith:messagetosend.to,timestamp:Date.now()}]})

}

if(to==null){
    to=  await usermessagesmodel.create( {_id:messagetosend.to,
    userchats:[{chatid:messagetosend.chatid,lastmessage:messagetosend.message,chatingwith:messagetosend.from,timestamp:Date.now()}]})
    
    }
//todo ==========================================================================================================================

if(from!==null) { const indexoffromchat=from.userchats.map(msg=>msg.chatid).indexOf(messagetosend.chatid);
console.log('index of from chat to update: ',indexoffromchat);



from.userchats.splice(indexoffromchat,1)
from.userchats.push({chatid:messagetosend.chatid,lastmessage:messagetosend.message,chatingwith:messagetosend.to,timestamp:Date.now()})
await from.save()

}
if(to!==null) { 
const indexoftochat=to.userchats.map(msg=>msg.chatid).indexOf(messagetosend.chatid)
console.log('index of to chat to update: ',indexoftochat);

to.userchats.splice(indexoftochat,1)
to.userchats.push({chatid:messagetosend.chatid,lastmessage:messagetosend.message,chatingwith:messagetosend.from,timestamp:Date.now()})
await to.save()
}



//todo ==========================================================================================================================




//todo ==========================================================================================================================

// console.log('message checktow: current message set from\n',from.userchats,'\n','current message set to \n',to.userchats);
// return res.send({message:'message sent successfully',sentmessage})

io.to(onlineusers).emit('receive-offline-message',messagetosend)


}
}