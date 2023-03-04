const {notficationsmodel} =require('../models/main.models')




exports.getnotfications=async(req,res)=>{
    try {
        const {userid}=req.body
        // res.send(userid)
        const pagesize = 5;
        let pagination = req.query.pagination;
const notifications=await notficationsmodel.find({postowner:userid}).sort({createdAt:-1})
.skip(pagination * pagesize) .limit(pagesize)
.populate({path:'notificationowner',select:'imgurl username',model:'USER'})
.populate({path:'commentid',select:'comment',model:'COMMENTS'})

if(notifications.length==0) return res.send({message:'no notifications'})

res.send(notifications)
        
    } catch (error) {
        
    }
}