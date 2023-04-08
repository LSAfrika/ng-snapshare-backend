const {messagesmodel,notficationsmodel,usermessagesmodel, usermodel}=require('../models/main.models')
const{offlinesocketmessage}=require('../controller/messages.controller')


module.exports = (server)=> {



    let onlineusers=[]
    // console.log('socket file being reached:\n');
    const io = require("socket.io")(server,{cors:{origin:['http://localhost:4200']}});


    async function newusermiddlware(socket,next){

        // console.log('handshake: \n',socket.handshake.query);
        if (socket.handshake.query && socket.handshake.query.uid){
        //   console.log('current uid', socket.handshake.query.uid);
            if (socket.handshake.query.uid===undefined ||socket.handshake.query.uid===''){
                console.log('missing uid');
                return next(new Error('Authentication error'));
            
            }
            await usermodel.findByIdAndUpdate(socket.handshake.query.uid,{online:true})

            const newuserlist=    onlineusers.filter(user=>user.uid!==socket.handshake.query.uid)
            onlineusers=newuserlist
            const onlineuser={soketid:socket.id,uid:socket.handshake.query.uid}
            onlineusers.push(onlineuser)
            console.log(onlineusers);
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
        socket.on('disconnect', async() => {

            console.log('current array value list');
            console.log(socket.id)
        const disconnectinguserindex=    onlineusers.map(user=>user.soketid).indexOf(socket.id)
        const disconectuser=onlineusers[disconnectinguserindex]
        await usermodel.findByIdAndUpdate(disconectuser.uid,{online:false,lastseen:Date.now()})
        console.log('user who is diconrcting',disconectuser);
        onlineusers.splice(disconnectinguserindex,1)
        // console.log('index of offline user',disconnectinguserindex);
        // onlineusers=newuserlist
            //  console.log('user disconnected',onlineusers);
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
     
    socket.on('message-sent',async(messagepayload,response)=>{
        // console.log('payload being received',messagepayload);
        const isuseronline=onlineusers.map(user=> user.uid).includes(messagepayload.to)
        // console.log('online users',isuseronline);
        // console.log(messagepayload)

 if(isuseronline ===false){
    const fromid=messagepayload.from+":"+messagepayload.to
    const toid=messagepayload.to+":"+messagepayload.from
    // console.log('chatid 1',fromid);
    // console.log('chatid 2',toid);

    offlinesocketmessage(fromid,toid,messagepayload,io,socket.id)


        }

        if(isuseronline===true){
            const recepient= onlineusers.filter(onlineuser=>onlineuser.uid===messagepayload.to)[0]
            // console.log('chat partner is active',recepient);
            // console.log('chat partner is active sid',recepient.socketid);
            // console.log('chat partner is active uid',recepient.uid);
            console.log('chat partner avtive message',messagepayload);
// to(recepient.socketid).
            const senderchatid=messagepayload.chatid
            const recepientchatid=messagepayload.to+":"+messagepayload.from

            const sender= await messagesmodel.findOne({chatid:senderchatid})
            const receiver= await messagesmodel.findOne({chatid:recepientchatid})


            if(sender==null && receiver==null){

                console.log('initial message sent: ',messagepayload);
                await messagesmodel.create(messagepayload)
            

                        const senderchatlist= await usermessagesmodel.findById({_id:messagepayload.from})
                        const receiverchatlist= await usermessagesmodel.findById({_id:messagepayload.to})
                        console.log('sender receiver chatlist',senderchatlist,receiverchatlist);
                        const now=Date.now()

                        if(senderchatlist !==null){

                            senderchatlist.userchats.push( {chatid:messagepayload.chatid,
                                lastmessage:messagepayload.message,
                                chatingwith:messagepayload.to,
                                timestamp:now})

                               const updatechatlist= await senderchatlist.save()
                            // console.log('senderchat list',updatechatlist);
                            // response({sent:true})


                        }

                        if(receiverchatlist !==null){

                                receiverchatlist.userchats.push(   
                                    {chatid:messagepayload.chatid,
                                    lastmessage:messagepayload.message,
                                    chatingwith:messagepayload.from,
                                    timestamp:now
                                })


                                const updatechatlist= await receiverchatlist.save()
                                // console.log('receiver chat list',updatechatlist);

                                response({sent:true})
         return   socket.to(recepient.soketid).emit('online-message',messagepayload)
            
                        }
          await usermessagesmodel.create( { _id:messagepayload.from,userchats:[{
            chatid:messagepayload.chatid,lastmessage:messagepayload.message,chatingwith:messagepayload.to,timestamp:now}]})
        
                            await usermessagesmodel.create(
                                {   _id:messagepayload.to,
                                    userchats:[
                                        {chatid:messagepayload.chatid,
                                        lastmessage:messagepayload.message,
                                        chatingwith:messagepayload.from,
                                        timestamp:now
                                    }
                                    ]
        
                                })
                                response({sent:true})

            socket.to(recepient.soketid).emit('online-message',messagepayload)
            

            }

            if(sender !=null){
                await messagesmodel.create({...messagepayload,chatid:sender.chatid})
                const now=Date.now()
            

                const senderchatlist= await usermessagesmodel.findById({_id:messagepayload.from})
                const receiverchatlist= await usermessagesmodel.findById({_id:messagepayload.to})

                console.log('sender not null senderchat list',senderchatlist._id);
                console.log('sender not null receiverchat list',receiverchatlist._id);
                if(senderchatlist !==null){


                    const index=senderchatlist.userchats.map(msg=>msg.chatid).indexOf(sender.chatid)

                    console.log('index sender: ',index);

                    senderchatlist.userchats.splice(index,1)

                    senderchatlist.userchats.push( {chatid:sender.chatid,
                        lastmessage:messagepayload.message,
                        chatingwith:messagepayload.to,
                        timestamp:now})

                        await senderchatlist.save()
        


                }

                if(receiverchatlist !==null){

                    const index=receiverchatlist.userchats.map(msg=>msg.chatid).indexOf(sender.chatid)

                    console.log('index  receiver: ',index);

                    receiverchatlist.userchats.splice(index,1)
                        receiverchatlist.userchats.push(   
                            {chatid:sender.chatid,
                            lastmessage:messagepayload.message,
                            chatingwith:messagepayload.from,
                            timestamp:now
                        })

await receiverchatlist.save()
response({sent:true})

 return   socket.to(recepient.soketid).emit('online-message',messagepayload)
    
                }

//   await usermessagesmodel.create( { _id:messagepayload.from,userchats:[{
//     chatid:messagepayload.chatid,lastmessage:messagepayload.message,chatingwith:messagepayload.to,timestamp:Date.now()}]})

                    await usermessagesmodel.create(
                        {   _id:messagepayload.to,
                            userchats:[
                                {chatid:sender.chatid,
                                lastmessage:messagepayload.message,
                                chatingwith:messagepayload.from,
                                timestamp:now
                            }
                            ]

                        })
                        response({sent:true})

    socket.to(recepient.soketid).emit('online-message',messagepayload)
            }

            if(receiver !=null){
                await messagesmodel.create({...messagepayload,chatid:receiver.chatid})
                const now=Date.now()
            

                const senderchatlist= await usermessagesmodel.findById({_id:messagepayload.from})
                const receiverchatlist= await usermessagesmodel.findById({_id:messagepayload.to})

                console.log('receiver not null senderchat list',senderchatlist._id);
                console.log('receiver not null receiverchat list',receiverchatlist._id);
          

                if(senderchatlist !==null){

                    const index=senderchatlist.userchats.map(msg=>msg.chatid).indexOf(receiver.chatid)

                    console.log('index of senderchatlist : ',index);

                    senderchatlist.userchats.splice(index,1)

                    senderchatlist.userchats.push( {chatid:receiver.chatid,
                        lastmessage:messagepayload.message,
                        chatingwith:messagepayload.to,
                        timestamp:now})

                        await senderchatlist.save()
        


                }

                if(receiverchatlist !==null){

                    const index=receiverchatlist.userchats.map(msg=>msg.chatid).indexOf(receiver.chatid)

                    console.log('index of receiverchatlist : ',index);

                    receiverchatlist.userchats.splice(index,1)

                        receiverchatlist.userchats.push(   
                            {chatid:receiver.chatid,
                            lastmessage:messagepayload.message,
                            chatingwith:messagepayload.from,
                            timestamp:now
                        })

await receiverchatlist.save()
response({sent:true})

 return   socket.to(recepient.soketid).emit('online-message',messagepayload)
    
                }

  await usermessagesmodel.create( { _id:messagepayload.from,userchats:[{
    chatid:receiver.chatid,lastmessage:messagepayload.message,chatingwith:messagepayload.to,timestamp:now}]})

                    // await usermessagesmodel.create(
                    //     {   _id:messagepayload.to,
                    //         userchats:[
                    //             {chatid:messagepayload.chatid,
                    //             lastmessage:messagepayload.message,
                    //             chatingwith:messagepayload.from,
                    //             timestamp:Date.now()
                    //         }
                    //         ]

                    //     })
                    response({sent:true})

    socket.to(recepient.soketid).emit('online-message',messagepayload)
            }
        }

    })
 }





 

 
    // put other things that use io here
}   