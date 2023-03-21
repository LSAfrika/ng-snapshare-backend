const {messagesmodel,notficationsmodel,usermessagesmodel}=require('../models/main.models')


module.exports = (server)=> {



    let onlineusers=[]
    // console.log('socket file being reached:\n');
    const io = require("socket.io")(server,{cors:{origin:['http://localhost:4200']}});


    function newusermiddlware(socket,next){

        // console.log('handshake: \n',socket.handshake.query);
        if (socket.handshake.query && socket.handshake.query.uid){
        //   console.log('current uid', socket.handshake.query.uid);
            if (socket.handshake.query.uid===undefined ||socket.handshake.query.uid===''){
                console.log('missing uid');
                return next(new Error('Authentication error'));
            
            }

            const newuserlist=    onlineusers.filter(user=>user.uid!==socket.handshake.query.uid)
            onlineusers=newuserlist
            const onlineuser={soketid:socket.id,uid:socket.handshake.query.uid}
            onlineusers.push(onlineuser)
            // console.log(onlineusers);
            next();
          
        }
        else {

            console.log(socket);
          next(new Error('no unique user'));
        }    
      }



// use(newusermiddlware).
    io.use(newusermiddlware).on("connection", (socket) => {
    //    socket.emit("hello", "world");
    //    console.log("New Connection",socket.handshake.query);
// userconnect(socket)
sendmessage(socket)


disconnect(socket)



   



    });

    const disconnect=(socket)=>{
        socket.on('disconnect', () => {

            console.log('current array value list');
            console.log(socket.id)
        const disconnectinguserindex=    onlineusers.map(user=>user.soketid).indexOf(socket.id)
        onlineusers.splice(disconnectinguserindex,1)
        console.log('index of offline user',disconnectinguserindex);
        // onlineusers=newuserlist
             console.log('user disconnected',onlineusers);
          }); 
    }

 const userconnect=(socket)=>{
    socket.on('userconnect',(joineduser)=>{

        const newconnection={...joineduser,socketid:socket.id}

        onlineusers.push(newconnection)
        console.log('user has connected',onlineusers);
    })
 }


 const sendmessage=(socket)=>{
     
    socket.on('message-sent',async(messagepayload)=>{
        console.log('payload being received',messagepayload);
        const isuseronline=onlineusers.map(user=> user.uid).includes(messagepayload.to)
        console.log('online users',isuseronline);
        console.log(messagepayload)

 if(isuseronline ===false){
        const fromid=messagepayload.from+":"+messagepayload.to
        const toid=messagepayload.tp+":"+messagepayload.from
        const messagecheckone=await messagesmodel.findOne({chatuid:fromid})
        const messagechecktwo=await messagesmodel.findOne({chatuid:toid})

if(messagecheckone==null&&messagechecktwo==null){
    const messagetosend={
        message:messagepayload.message,
        to:messagepayload.to,
        from:messagepayload.from,
        chatuid:fromid
    }
    const sentmessage=await messagesmodel.create({...messagetosend})

     await usermessagesmodel.create({_id:messagetosend.from,userchats:[{chatid:messagetosend.chatuid,lastmessage:messagetosend.message}]})
     await usermessagesmodel.create( {_id:messagetosend.to,userchats:[{chatid:messagetosend.chatuid,lastmessage:messagetosend.message}]})
    console.log('new message thread',sentmessage);

}

if(messagecheckone !=null){

    const messagetosend={
        message:messagepayload.message,
        to:messagepayload.to,
        from:messagepayload.from,
        chatuid:messagecheckone.chatuid
    }

    const sentmessage=await messagesmodel.create({...messagetosend})
//todo ==========================================================================================================================

   const from= await usermessagesmodel.findById(messagetosend.from)
   const to= await usermessagesmodel.findById(messagetosend.to)

   console.log('from model',from);
   console.log('to model',to);
//todo ==========================================================================================================================

   const indexoffromchat=from.userchats.map(msg=>msg.chatid).indexOf(messagetosend.from)
   const indexoftochat=to.userchats.map(msg=>msg.chatid).indexOf(messagetosend.to)
   console.log('index of from chat to update: ',indexoffromchat);
   console.log('to usermessages: ',to.userchats);
   console.log('index of to chat to update: ',indexoftochat);
   console.log('from usermessages: ',from.userchats);

  
   
   
   //todo ==========================================================================================================================
   
   
   
   from.userchats.splice(indexoffromchat,1)
   to.userchats.splice(indexoftochat,1)

//    console.log('last message fromsent mssage ',sentmessage);
//    console.log('checkone: current message set from\n',from.userchats,'\n','current message set to \n',to.userchats);

   from.userchats.push({chatid:sentmessage.chatuid,lastmessage:sentmessage.message})
   to.userchats.push({chatid:sentmessage.chatuid,lastmessage:sentmessage.message})

//    console.log('checkone: updated message set from\n',from.userchats,'\n','updated message set to \n',to.userchats);

   //todo ==========================================================================================================================

await from.save()
await to.save()
    // await usermessagesmodel.create( {_id:messagetosend.to,userchats:[{chatid:messagetosend.chatuid,lastmessage:messagetosend.message}]})
    // console.log(' message thread 1',sentmessage);

    // return res.send({message:'message sent successfully',sentmessage})

    
}

if(messagechecktwo !=null){

    const messagetosend={
        message:messagepayload.message,
        to:messagepayload.to,
        from:messagepayload.from,
        chatuid:messagechecktwo.chatuid
    }

    const sentmessage=await messagesmodel.create({...messagetosend})
    console.log(' message thread 2',sentmessage);


    
//todo ==========================================================================================================================

   const from= await usermessagesmodel.findById(messagetosend.from)
   const to= await usermessagesmodel.findById(messagetosend.to)

//todo ==========================================================================================================================

   const indexoffromchat=from.userchats.map(msg=>msg.chatid).indexOf(messagetosend.from)
   const indexoftochat=to.userchats.map(msg=>msg.chatid).indexOf(messagetosend.to)
   console.log('index of from chat to update: ',indexoffromchat);
   console.log('index of to chat to update: ',indexoftochat);
  
   
   
   //todo ==========================================================================================================================
   
   
   
   from.userchats.splice(indexoffromchat,1)
   to.userchats.splice(indexoftochat,1)
   console.log('message checktow: current message set from\n',from.userchats,'\n','current message set to \n',to.userchats);
   from.userchats.push({chatid:sentmessage.chatuid,lastmessage:sentmessage.message})
   to.userchats.push({chatid:sentmessage.chatuid,lastmessage:sentmessage.message})

   //todo ==========================================================================================================================

await from.save()
await to.save()
    // return res.send({message:'message sent successfully',sentmessage})


    
}

        }

        if(isuseronline===true){
            const recepient= onlineusers.filter(onlineuser=>onlineuser.uid===messagepayload.to)[0]
            console.log('chat partner is active',recepient);

            io.to(recepient.socketid).emit('receive-message',messagepayload)
        }

    })
 }





 

 
    // put other things that use io here
}   