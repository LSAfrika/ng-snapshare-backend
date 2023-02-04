const {postsmodel,commentsmodel} =require('../models/main.models')
const { post } = require('../routes/comments.routes')




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
    res.send('update comment route hit')

}