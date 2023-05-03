const {notficationsmodel} =require('../models/main.models')




exports.getnotfications=async(req,res)=>{
    try {
        const {userid}=req.body
        // res.send(userid)
        const pagesize = 5;
        let pagination = req.query.pagination;
    //    console.log(pagination)
const notifications=await notficationsmodel.find({postowner:userid}).sort({createdAt:-1})
.skip(pagination * pagesize) .limit(pagesize)
.populate({path:'notificationowner',select:'imgurl username',model:'USER'})
.populate({path:'commentid',select:'comment',model:'COMMENTS'})

// if(notifications.length==0) return res.send(notifications)

res.send(notifications)
        
    } catch (error) {
        
    }
}

exports.unreadnotficationscount=async(req,res)=>{
    try {
        // const postid=req.params.postid
        const {userid}=req.body
        const postnotificationarray=await notficationsmodel.find({postowner:userid})
        if(postnotificationarray==0)return res.send({message:'no unread notifications'})
        const notificationcounter= postnotificationarray.filter(post=>post.viewed==false)
    //    return res.send({count:notificationcounter})
        res.send({count:notificationcounter.length})
        
    } catch (error) {
        res.send({error})

        
    }
}