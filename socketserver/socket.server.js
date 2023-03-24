const {messagesmodel,notficationsmodel,usermessagesmodel}=require('../models/main.models')
const{offlinesocketmessage}=require('../controller/messages.controller')


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
        // console.log('payload being received',messagepayload);
        const isuseronline=onlineusers.map(user=> user.uid).includes(messagepayload.to)
        // console.log('online users',isuseronline);
        // console.log(messagepayload)

 if(isuseronline ===false){
    const fromid=messagepayload.from+":"+messagepayload.to
    const toid=messagepayload.to+":"+messagepayload.from
    console.log('chatuid 1',fromid);
    console.log('chatuid 2',toid);

    offlinesocketmessage(fromid,toid,messagepayload)


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