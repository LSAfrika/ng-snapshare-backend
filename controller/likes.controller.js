const {postsmodel,notficationsmodel} =require('../models/main.models')


exports.postlike=async(req,res)=>{
try {
    const postid=req.params.postid

const {userid}=req.body
const posttolike = await postsmodel.findById(postid)

if(posttolike === null)throw new Error('no document to like')

const maplikes=posttolike.likes.map(likeid=>  likeid.toString())

console.log(maplikes);

const userhaslikedpost=maplikes.find(mappedid=>mappedid===userid)
console.log('user in likes array: \n',userhaslikedpost);
if(userhaslikedpost===undefined){

posttolike.likes.push(userid)

    await posttolike.save()
const notificationpayload={
    post:posttolike._id,
    postowner:posttolike.user,
    notificationowner:userid,
    notificationtype:3

}

const notification = await notficationsmodel.create({...notificationpayload})

res.send({posttolike,notification})
}else if(userhaslikedpost===userid){
     const indexofuserlike=posttolike.likes.indexOf(userid)
    // console.log('function being hit: \n',indexofuserlike);
    // console.log('index of comment in array: \n',posttolike.likes.findIndex(userid));
     posttolike.likes.splice(indexofuserlike,1)

     await posttolike.save()
const removenotification= await notficationsmodel.findOneAndDelete({notificationowner:userid})


    res.send({message:'removed like and notification for like' ,posttolike,removenotification})
}

return
posttolike.likes.push(userid)
 
await posttolike.save()

// if(posttolike)
// console.log('ad to like: \n',posttolike);
res.send(posttolike)
    
} catch (error) {
    res.send({errormessage:error.message})
}
}



