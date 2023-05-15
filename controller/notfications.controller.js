const {notficationsmodel} =require('../models/main.models')




exports.getnotfications=async(req,res)=>{
    try {
        const {userid}=req.body
        // res.send(userid)
        const pagesize = 10;
        let pagination = req.query.pagination;
    //    console.log(pagination)
const notifications=await notficationsmodel.find({$or:[{postowner:userid},{boradcastnotfication:userid}]}).sort({createdAt:-1})
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
        console.log('notification owner: ',userid);
        const postnotificationarray=await notficationsmodel.find({$or:[{postowner:userid},{boradcastnotfication:userid}]})
        if(postnotificationarray.length==0)return res.send({message:'no unread notifications'})
        const notificationcounter= postnotificationarray.filter(post=>post.viewed==false)
    //    return res.send({count:notificationcounter})
    console.log('notifications ');
        res.send({count:notificationcounter.length})
        
    } catch (error) {
        res.send({error})

        
    }
}