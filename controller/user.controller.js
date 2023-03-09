const {usermodel,postsmodel}=require('../models/main.models')

exports.signupuser=async(req,res)=>{

    try {
        const{token,refreshtoken}=req.body
        res.send({token,refreshtoken})
        
    } catch (error) {
        res.send({errormessage:error.message})
    }

}
exports.signinuser=async(req,res)=>{

    try {

        const{token,email,userid,refreshtoken}=req.body
        res.send({userid,email,token,refreshtoken})
        
    } catch (error) {
        console.log('sign in error: ',error);
        res.send({errormessage:error.message})
        
    }

}

exports.authprovidersignin=async(req,res)=>{

    try {

        const{token,email,userid}=req.body
        console.log(token,email,userid);
        res.send({userid,email,token})
        
    } catch (error) {
        res.send({errormessage:error.message})
        
    }

}
exports.updateuser=async(req,res)=>{

    try {
        res.send('update user hit')
    } catch (error) {
        res.send({errormessage:error.message})
        
    }

}

exports.getuser=async(req,res)=>{
    try {
        const userid=req.params.id
        // const userfollowingandfollowers= await usermodel.findById(userid)
        // const followingcount= userfollowingandfollowers.following.length
        // const followerscount= userfollowingandfollowers.followers.length

        // userfollowingandfollowers.followerscounter=followerscount
        // userfollowingandfollowers.followingcounter=followingcounter

        // await userfollowingandfollowers.save()
        const user= await usermodel.findById(userid)
        .select("_id username imgurl createdAt email followerscounter followingcounter ")

        if(user===null)throw new Error('no user ')

        // const userposts = await postsmodel.find({user:userid}).limit(1)

        // const returneduser={
        //     _id:user._id,
        //     email:user.email,
        //     imgurl:user.imgurl,
        //     createdAt:user.createdAt,
        //     followingcounter:followingcount,
        //     followerscounter:followerscount
        // }
         const postcount = await postsmodel.find({user:userid}).count()

        // if(userposts.length === 0) return res.send(user)

        res.send({user,postcount})
        
    } catch (error) {
        res.send({errormessage:error.message})
        
    }

}

exports.getalluser=async(req,res)=>{
    try {
        const allusers= await usermodel.find().select("_id username imgurl createdAt email followingcounter followerscounter")
        // console.log(allusers);
        // allusers.forEach(async(user) => {
        //     user.followerscounter=user.followers.length
        //     user.followingcounter=user.following.length
        //     await user.save()
            
        // });
        res.send(allusers)
    } catch (error) {
        res.send({errormessage:error.message})
        
    }

}

exports.deleteuser=async(req,res)=>{

    try {
        res.send('delete user hit')
        
    } catch (error) {
        res.send({errormessage:error.message})
        
    }

}


exports.getfollowers=async(req,res)=>{
    try {
        const userid=req.params.id
        // let userstoreturncounter=0
        let splicedfollowers=[]
        // let returnfollowers=[]
        const {pagination}=req.query
        console.log('query size',pagination);
        const returnsize=10
        const user= await usermodel.findById(userid)
        .select("followers ")
        if(user===null)throw new Error('no user ')
        // console.log(user);
        if(user.followers.length===0) return res.send({message:'user has no followers',splicedfollowers:user.followers})
        const splicer=pagination*returnsize
        console.log('splicer',splicer);
        
          splicedfollowers=user.followers.splice(splicer,returnsize)
       


        res.send({splicedfollowers})

        
    } catch (error) {
        res.send(error)
    }
}



exports.getfollowing=async(req,res)=>{
    try {
        const userid=req.params.id
        // let userstoreturncounter=0
        let splicedfollowing=[]
        // let returnfollowers=[]
        const {pagination}=req.query
        console.log('query size',pagination);
        const returnsize=10
        const user= await usermodel.findById(userid)
        .select("following ")
        if(user===null)throw new Error('no user ')
          console.log(user.following);
        if(user.following.length===0) return res.send({message:'user is not following any one',splicedfollowing:user.following})
        const splicer=pagination*returnsize
        console.log('splicer',splicer);
        
          splicedfollowing=user.following.splice(splicer,returnsize)
       console.log(splicedfollowing);


        res.send({splicedfollowing})

        
    } catch (error) {
        res.send(error)
    }
}