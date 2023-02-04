const {postsmodel,commentsmodel} =require('../models/main.models')





exports.postcomment=async(req,res)=>{

    try {
        
        const postid=req.params.postid
        const {userid ,comment}=req.body
        // res.send('post comment route hit'+postid)
        console.log(comment,userid);

        const post = await postsmodel.findById(postid)

        if(post) {

            const createcomment=await commentsmodel.create({comment,ownerid:userid})

            if(createcomment){
                post.comments.push(createcomment)
                await post.save()

                res.send({message:'comment posted succesfully',post})
            }
        }
        
        //return res.send({post})

    } catch (error) {

        res.send({errormessage:error.message})
        
    }

}

exports.deletecomment=async(req,res)=>{
    res.send('delete comment route hit')

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
        res.send(editusercomment)

        }
 catch (error) {
    res.send({errormessage:error.message})
 }
}
