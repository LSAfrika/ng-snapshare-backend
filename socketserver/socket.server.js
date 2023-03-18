const {messagesmodel,notficationsmodel}=require('../models/main.models')


module.exports = (server)=> {



    let onlineusers=[]
    console.log('socket file being reached:\n');
    const io = require("socket.io")(server,{cors:{origin:['http://localhost:4200']}});
    io.on("connection", (socket) => {
       socket.emit("hello", "world");
       console.log("New Connection",socket.id);
userconnect(socket)
sendmessage(socket)


disconnect(socket)



   



    });

    const disconnect=(socket)=>{
        socket.on('disconnect', () => {

            console.log('current array value list');
            console.log(socket.id)
        const newuserlist=    onlineusers.filter(user=>user.socketid!==socket.id)
        onlineusers=newuserlist
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
    console.log(' message thread 1',sentmessage);

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