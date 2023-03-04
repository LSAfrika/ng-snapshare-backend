const {postsmodel,commentsmodel,notficationsmodel} =require('../models/main.models')





exports.postcomment=async(req,res)=>{

    try {
        
        const postid=req.params.postid
        const {userid ,comment}=req.body
        // res.send('post comment route hit'+postid)
        console.log(comment,userid);

        const post = await postsmodel.findById(postid)
        if(post===null)throw new Error('missing comment document')

        if(comment === undefined) throw new Error('please add a comment ')


        // const post=await postsmodel.findById()

            const createcomment=await commentsmodel.create({post:post._id,comment,ownerid:userid})

            if(createcomment){
                post.comments.push(createcomment)
                await post.save()

             

                if(createcomment.ownerid.toString()==post.user) return res.send({message:'comment posted succesfully',post})
                
                const notificationpayload={
                    commentid:createcomment._id,
                    post:post._id,
                    postowner:post.user,
                    notificationowner:userid,
                    notificationtype:1
                
                }
                
                const notification = await notficationsmodel.create({...notificationpayload})

                res.send({message:'comment posted succesfully',post,notification})
            }
    
        
        //return res.send({post})

    } catch (error) {

        res.send({errormessage:error.message})
        
    }

}

exports.updatecomment=async(req,res)=>{
    try {
        // res.send('update comment route hit')
        const commentid=req.params.commentid
            const {userid ,comment}=req.body
            // res.send('post comment route hit'+postid)
            console.log(comment,userid);
    
            const editusercomment = await commentsmodel.findById(commentid)
            if (editusercomment === null) throw new Error('no doc in database')
            // console.log('comments returned:\n ',editusercomment);
    
            if(editusercomment.ownerid.toString() !== userid) throw new Error('unauthorized attempt to edit comment')
    
    
            
            
            
            
            editusercomment.comment=comment
            await editusercomment.save()
    
            const updatenotification = await notficationsmodel.findOne({commentid:editusercomment._id})
            updatenotification.notificationtype=2
           await updatenotification.save()
            // const updatenotification =await notficationsmodel.findOneAndUpdate({notificationtype:2})
    
    
    
    
            res.send({message:'updated both comment and notification' ,editusercomment,updatenotification})
    
            }
     catch (error) {
        res.send({errormessage:error.message})
     }
    }


exports.deletecomment=async(req,res)=>{
try {
    const commentid=req.params.commentid
    const {userid }=req.body
    // res.send('post comment route hit'+postid)
    console.log(userid);

    const deleteusercomment = await commentsmodel.findById(commentid)
    if (deleteusercomment === null) throw new Error('no doc in database')
    // console.log('comments returned:\n ',deleteusercomment);

    if(deleteusercomment.ownerid.toString() !== userid) throw new Error('unauthorized attempt to delete comment')

    await deleteusercomment.delete()

 const deltenotification = await notficationsmodel.findOne({commentid:deleteusercomment._id})
        
       await deltenotification.delete()
    res.send({message:'comment deleted successfully'})
} catch (error) {
    res.send({errormessage:error.message})
    
}

}


