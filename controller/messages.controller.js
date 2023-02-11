const{messagesmodel,usermodel}=require('../models/main.models')


exports.directmessage=async(req,res)=>{
    try {
        const chatid= req.params.chatid
        const {userid,message,to,from}=req.body
   if(from!==userid)return res.send('error with body ofmessage')
        const fromtoid= await messagesmodel.findOne({from_to:chatid})
        const tofromid= await messagesmodel.findOne({to_from:chatid})

// return res.send({fromtoid,tofromid})

        if(tofromid===null && fromtoid===null){
            console.log('no chats found \n usersending message: ',userid,'\n chat id: ',chatid)
            // const from=userid
            const from_to=from+':'+to
       
            
        


            // let  reverseuserchatarray=[]
            // let userchatarray=chatid.split(':')
            // reverseuserchatarray[0]= userchatarray[1]
            // reverseuserchatarray[1]= userchatarray[0]

            const to_from=to+":"+from


            const messagepayload= {
                message,
                to,
                from,
                from_to,
                to_from
            }

            const messagedelivered = await messagesmodel.create({...messagepayload})

            return res.send({message:'message sent',messagedelivered})
        }

        if(tofromid !==null){
        //   return res.send({message:`to from message id is \n ${tofromid.to_from}`}) 

        // const from=userid
        const from_to=from+":"+to
   
        
    


        // let  reverseuserchatarray=[]
        // let userchatarray=chatid.split(':')
        // reverseuserchatarray[0]= userchatarray[1]
        // reverseuserchatarray[1]= userchatarray[0]

        const to_from=to+":"+from

        // console.log('message property: ',message);

       const messagepayload= {
        message,
        to,
        from,
        from_to,
        to_from
    }

    const messagedelivered = await messagesmodel.create({...messagepayload})

    return res.send({message:'message sent',messagedelivered})

        }

        if(fromtoid !==null){
            // return res.send({message:`from to message id is \n ${fromtoid.from_to}`})

            
           const from=userid
           const to_from=chatid
      
           
       


           let  reverseuserchatarray=[]
           let userchatarray=chatid.split(':')
           reverseuserchatarray[0]= userchatarray[1]
           reverseuserchatarray[1]= userchatarray[0]

           const from_to=reverseuserchatarray[0]+':'+reverseuserchatarray[1]

           console.log('message property: ',message);

          const messagepayload= {
           message,
           to,
           from,
           from_to,
           to_from
       }

       const messagedelivered = await messagesmodel.create({...messagepayload})

       return res.send({message:'message sent',messagedelivered})
         }
    } catch (error) {
        res.send({errormessge:error.message})
        
    }
}