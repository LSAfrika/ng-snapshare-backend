const {messagesmodel,usermessagesmodel, usermodel,postsmodel}=require('../models/main.models')
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
          const useronline=  await usermodel.findById(socket.handshake.query.uid)
          useronline.online=true
          await useronline.save()

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

usernotifications(socket)
disconnect(socket)



   



    });

    const disconnect=(socket)=>{
        socket.on('disconnect', async() => {

            console.log('current array value list');
            console.log(socket.id)
        const disconnectinguserindex=    onlineusers.map(user=>user.soketid).indexOf(socket.id)
        const disconectuser=onlineusers[disconnectinguserindex]
        const userdisconnect=await usermodel.findById(disconectuser.uid)

        userdisconnect.online=false
        userdisconnect.lastseen=Date.now()
        await userdisconnect.save()
        console.log('user who is diconrcting',disconectuser); 
        onlineusers.splice(disconnectinguserindex,1)
        // console.log('index of offline user',disconnectinguserindex);
        // onlineusers=newuserlist
            //  console.log('user disconnected',onlineusers);
          }); 
    }

 const usernotifications=(socket)=>{
    socket.on('emitnotification',async(Notificationpayload)=>{

       try {
        // console.log('post id',Notificationpayload);
        const snapshare= await postsmodel.findById({_id:Notificationpayload.postid}).select('user ')   .populate(
            {path:'comments',
             select:"-_id ownerid ",
             model:"COMMENTS" 
             // populate:[
             //    {path:'ownerid',
             //    model:"USER",
             //    select:"_id username imgurl"
             //    }
             //         ]
            }
            )

       if(snapshare!=null)   {
        //  console.log('post ',snapshare);
        // const postowner =snapshare.user.toString()
        const filteredcommenteruid=[...new Set(snapshare.comments.map(comm=>comm.ownerid.toString()))]
          console.log('fetched snapshare: ,',filteredcommenteruid);
      

        filteredcommenteruid.forEach(uid => {

          

            if(uid !== Notificationpayload.userid){
                console.log('emmiting to ',uid);
                console.log('emmiting from ',Notificationpayload.userid);
                commentnotifier={comment:'new comment'}

                let index=onlineusers.map(user=>user.uid).indexOf(uid)
                if(index !=-1){
                    let socketid= onlineusers[index].soketid
                    socket.to(socketid).emit('comment_notification',commentnotifier)
                }
            }
            
        });

    }
        
       } catch (error) {
        
       }
       

    })
 }


 const sendmessage=(socket)=>{
     
    socket.on('message-sent',async(messagepayload,response)=>{
       
        console.log('message payload',messagepayload.message);
      const trimmedmessage=  messagepayload.message.match(/&nbsp;/)
      console.log('trimmed message payload',trimmedmessage.length);

      if(trimmedmessage.length>0){
        const messagetosave=messagepayload.message.replace('&nbsp;','')
        console.log('message to save db',messagetosave);
        messagepayload.message=messagetosave
      }

        const isuseronline=onlineusers.map(user=> user.uid).includes(messagepayload.to)
    

         if(isuseronline ===false){
    const fromid=messagepayload.from+":"+messagepayload.to
    const toid=messagepayload.to+":"+messagepayload.from
    // console.log('chatid 1',fromid);
    // console.log('chatid 2',toid);

    offlinesocketmessage(fromid,toid,messagepayload,io,socket.id)


        }

         if(isuseronline===true){
            const recepient= onlineusers.filter(onlineuser=>onlineuser.uid===messagepayload.to)[0]
        
            // console.log('chat partner avtive message',messagepayload);

            const senderchatid=messagepayload.chatid
            const recepientchatid=messagepayload.to+":"+messagepayload.from

            const sender= await messagesmodel.findOne({chatid:senderchatid})
            const receiver= await messagesmodel.findOne({chatid:recepientchatid})


            if(sender==null && receiver==null){

                // console.log('initial message sent: ',messagepayload);
                await messagesmodel.create(messagepayload)
            

                        const senderchatlist= await usermessagesmodel.findById({_id:messagepayload.from}).populate({path:'userchats',populate:[{path:'chatingwith', model:"USER",
                        select:"_id username imgurl lastseen online unreadcounter"}]})
                        const receiverchatlist= await usermessagesmodel.findById({_id:messagepayload.to}).populate({path:'userchats',populate:[{path:'chatingwith', model:"USER",
                        select:"_id username imgurl lastseen online unreadcounter"}]})
                        // console.log('sender receiver chatlist',senderchatlist,receiverchatlist);
                        const now=Date.now()

                        if(senderchatlist !==null){

                            senderchatlist.userchats.push( {chatid:messagepayload.chatid,
                                lastmessage:messagepayload.message,
                                chatingwith:messagepayload.to,
                                timestamp:now,unreadcounter:0})

                            await senderchatlist.save()
                          


                        }

                        if(receiverchatlist !==null){

                                receiverchatlist.userchats.push(   
                                    {chatid:messagepayload.chatid,
                                    lastmessage:messagepayload.message,
                                    chatingwith:messagepayload.from,
                                    timestamp:now,
                                    unreadcounter:0
                                })


                                await receiverchatlist.save()   
                        // console.log('recepient id 1',recepient.soketid);
                        await receiverchatlist.populate({path:'userchats',populate:[{path:'chatingwith', model:"USER",
select:"_id username imgurl lastseen online"}]})

                         socket.to(recepient.soketid).emit('new-message-notification',receiverchatlist)
                         return   socket.to(recepient.soketid).emit('online-message',messagepayload)
            
                        }
       const senderlist=   await usermessagesmodel.create( 
        { _id:messagepayload.from,userchats:[{
            chatid:messagepayload.chatid,lastmessage:messagepayload.message,chatingwith:messagepayload.to,timestamp:now,unreadcounter:0
        }]
        }
        )
        
       const receiverlist=  await usermessagesmodel.create(
        {   _id:messagepayload.to,userchats:[{
            chatid:messagepayload.chatid,lastmessage:messagepayload.message,chatingwith:messagepayload.from,timestamp:now,unreadcounter:1}]
        
                                })
                                response({sent:true})
                        console.log('recepient id 2',recepient.soketid);
                        await receiverlist.populate({path:'userchats',populate:[{path:'chatingwith', model:"USER",
select:"_id username imgurl lastseen online"}]})
            socket.to(recepient.soketid).emit('new-message-notification',receiverlist)
            socket.to(recepient.soketid).emit('online-message',messagepayload)
            

            }

            if(sender !=null){
                await messagesmodel.create({...messagepayload,chatid:sender.chatid})
                const now=Date.now()
            

                const senderchatlist= await usermessagesmodel.findById({_id:messagepayload.from})
                .populate({path:'userchats',populate:[{path:'chatingwith', model:"USER",
                           select:"_id username imgurl lastseen online unreadcounter"}]})
                const receiverchatlist= await usermessagesmodel.findById({_id:messagepayload.to})
                .populate({path:'userchats',populate:[{path:'chatingwith', model:"USER",
                           select:"_id username imgurl lastseen online unreadcounter"}]})

                 console.log(senderchatlist,' senderchat list id 3');
                if(senderchatlist !==null){


                    const index=senderchatlist.userchats.map(msg=>msg.chatid).indexOf(sender.chatid)

                    console.log('index sender: ',index);
                    if(index!==-1){
                    senderchatlist.userchats.splice(index,1)

                    senderchatlist.userchats.push( {chatid:sender.chatid,
                        lastmessage:messagepayload.message,
                        chatingwith:messagepayload.to,
                        timestamp:now,
                    unreadcounter:0})

                        await senderchatlist.save()
        
                    }

                }

                if(receiverchatlist !==null){

                    const index=receiverchatlist.userchats.map(msg=>msg.chatid).indexOf(sender.chatid)
                    if(index!==-1){
                let counterupdate=receiverchatlist.userchats[index].unreadcounter
                console.log('saved counter notfication 3',counterupdate);

                    // console.log('index  receiver: ',index);
                    receiverchatlist.userchats.splice(index,1)
                        receiverchatlist.userchats.push(   
                            {chatid:sender.chatid,
                            lastmessage:messagepayload.message,
                            chatingwith:messagepayload.from,
                            timestamp:now,
                            unreadcounter:counterupdate+1
                        })

await receiverchatlist.save()
                    }
response({sent:true})
                        
// console.log(receiverchatlist,'recepient id 3 user list');
console.log('recepient id 3',recepient.soketid);


await receiverchatlist.populate({path:'userchats',populate:[{path:'chatingwith', model:"USER",
select:"_id username imgurl lastseen online"}]})


socket.to(recepient.soketid).emit('new-message-notification',receiverchatlist)
 return   socket.to(recepient.soketid).emit('online-message',messagepayload)
    
                }



            const receiverlsist=  await usermessagesmodel.create(
                        {   _id:messagepayload.to,
                            userchats:[
                                {chatid:sender.chatid,
                                lastmessage:messagepayload.message,
                                chatingwith:messagepayload.from,
                                timestamp:now,unreadcounter:1
                            }
                            ]

                        })
                        response({sent:true})
                        console.log('recepient id 4',recepient.soketid);

                        await receiverlist.populate({path:'userchats',populate:[{path:'chatingwith', model:"USER",
select:"_id username imgurl lastseen online"}]})
                       
                        socket.to(recepient.soketid).emit('new-message-notification',receiverlsist)
                        socket.to(recepient.soketid).emit('online-message',messagepayload)
            }

            if(receiver !=null){
                await messagesmodel.create({...messagepayload,chatid:receiver.chatid})
                const now=Date.now()
            

                const senderchatlist= await usermessagesmodel.findById({_id:messagepayload.from}).populate({path:'userchats',populate:[{path:'chatingwith', model:"USER",
        select:"_id username imgurl lastseen online unreadcounter"}]})
                const receiverchatlist= await usermessagesmodel.findById({_id:messagepayload.to}).populate({path:'userchats',populate:[{path:'chatingwith', model:"USER",
        select:"_id username imgurl lastseen online unreadcounter"}]})

          

                if(senderchatlist !==null){

                    const index=senderchatlist.userchats.map(msg=>msg.chatid).indexOf(receiver.chatid)

                    console.log('index of senderchatlist : ',index);
                    if(index!==-1){

                        senderchatlist.userchats.splice(index,1)
                        
                        senderchatlist.userchats.push( {chatid:receiver.chatid,
                            lastmessage:messagepayload.message,
                            chatingwith:messagepayload.to,
                            timestamp:now,unreadcounter:0
                        })
                            
                            await senderchatlist.save()
                        }
        


                }

                if(receiverchatlist !==null){

                    const index=receiverchatlist.userchats.map(msg=>msg.chatid).indexOf(receiver.chatid)

                    console.log('index of receiverchatlist : ',index);

                    if(index !==-1){
                let counterupdate=receiverchatlist.userchats[index].unreadcounter
                console.log('saved counter notfication 5',counterupdate);

                    receiverchatlist.userchats.splice(index,1)

                        receiverchatlist.userchats.push(   
                            {chatid:receiver.chatid,
                            lastmessage:messagepayload.message,
                            chatingwith:messagepayload.from,
                            timestamp:now,
                            unreadcounter:counterupdate+1
                        })

await receiverchatlist.save()
}

response({sent:true})


console.log(receiverchatlist,'recepient id 5 chat list');
console.log('recepient id 5',recepient);

await receiverchatlist.populate({path:'userchats',populate:[{path:'chatingwith', model:"USER",
select:"_id username imgurl lastseen online"}]})

socket.to(recepient.soketid).emit('new-message-notification',receiverchatlist)

 return   socket.to(recepient.soketid).emit('online-message',messagepayload)
    
                }

 const receiverlist= await usermessagesmodel.create( { _id:messagepayload.from,userchats:[{
    chatid:receiver.chatid,lastmessage:messagepayload.message,chatingwith:messagepayload.to,timestamp:now,unreadcounter:1}]})

                    response({sent:true})
                    console.log('recepient id 6',recepient.soketid);
                    await receiverlist.populate({path:'userchats',populate:[{path:'chatingwith', model:"USER",
                          select:"_id username imgurl lastseen online"}]})

                    socket.to(recepient.soketid).emit('new-message-notification',receiverlist)

                 socket.to(recepient.soketid).emit('online-message',messagepayload)
            }
        }

    })
 }





 

 
    // put other things that use io here
}   