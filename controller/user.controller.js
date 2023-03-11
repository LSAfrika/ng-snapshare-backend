const {usermodel,postsmodel}=require('../models/main.models')
const jwt = require('jsonwebtoken')
require('dotenv').config()
 
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
     const {userid,username}=req.body

     console.log('user id',userid);
     console.log('username',username)
    //  console.log('files',req.files.profilepic.mimetype)  

     const updateuser= await usermodel.findById(userid)
     
     //  return
     if(updateuser==null) return res.status(404).send({message:'no user found'})
     
     if(req.files){
        let allfiles=req.files.profilepic
        extension=req.files.profilepic.mimetype.split('/')[1]
        // if(allfiles.length === undefined) {
            // let trimmedfilename=allfiles.name.replace(/ /g,'')
            let filename= userid+'.'+extension

            console.log(filename);
            let uploadPath = `public/profilepic/` +filename;
            let viewpath='http://localhost:4555/'+`profilepic/${filename}`
            // filespatharraytosave.push(viewpath)

            allfiles.mv(uploadPath, function(err) {
                if (err) {
                  return res.status(500).send(err);
                }
            
                     console.log('updated profile: ',viewpath);
                    //  res.send('File successfully uploaded ' );
                    
                    
                    
                        
                    });

        // console.log('single file save: \n',filespatharraytosave);
        updateuser.imgurl=viewpath
        if(username !=undefined && username!='')updateuser.username=username
        console.log(updateuser.username);           
            
await updateuser.save()
        
const payload={
    _id:updateuser._id,
    email:updateuser.email,
    imgurl:updateuser.imgurl,
    username:updateuser.username,
    followerscounter:updateuser.followerscounter,
    followingcounter:updateuser.followingcounter
}
        
const token = jwt.sign(payload,process.env.SIGNING_TOKEN,{
    expiresIn:'60m'
})
// console.log('REFRESH: ',process.env.REFRESH_TOKEN);

const refreshtoken=jwt.sign({  _id:payload._id},process.env.REFRESH_TOKEN,{
    expiresIn:'3d'
})


        return    res.send({
            token,
            refreshtoken,
            message:'user updated successfully'})

         
        }

        if(username !=undefined && username!='')updateuser.username=username
        console.log(updateuser.username);           
            
await updateuser.save()
        
const payload={
    _id:updateuser._id,
    email:updateuser.email,
    imgurl:updateuser.imgurl,
    username:updateuser.username,
    followerscounter:updateuser.followerscounter,
    followingcounter:updateuser.followingcounter
}
        
const token = jwt.sign(payload,process.env.SIGNING_TOKEN,{
    expiresIn:'60m'
})
// console.log('REFRESH: ',process.env.REFRESH_TOKEN);

const refreshtoken=jwt.sign({  _id:payload._id},process.env.REFRESH_TOKEN,{
    expiresIn:'3d'
})


            res.send({
            token,
            refreshtoken,
            message:'user updated successfully'})


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
        // .select("_id username imgurl createdAt email followerscounter followingcounter ")
console.log(user);
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

exports.checkiffollowinguser=async(req,res)=>{
    try {
        const userfollowing=req.params.id
        const {userid}=req.body
        console.log('current loggedin user',userid);
        console.log('user to follow',userfollowing);
        
        const user= await usermodel.findById(userid)
        const userfollow= await usermodel.findById(userfollowing)

        
        // console.log(user);
        if(user===null)throw new Error('no user ')
        if(user.following.includes(userfollowing))return res.send({user:userfollow,following:true})
        res.send({user:userfollow,following:false})

    
       
        
    } catch (error) {
        res.send({errormessage:error.message})
        
    }

}


exports.followuser=async(req,res)=>{
    try {
        const {userid,usertofollow}=req.body
// console.log('ids',userid,usertofollow);
const usertofollowupdate= await usermodel.findById(usertofollow)
const userupdatefollowing= await usermodel.findById(userid)
if(userid==usertofollow)return res.send({user:userupdatefollowing,message:'can not follow self'})

        // const formateduserid= `new ObjectId("${userid}")`
        // console.log('formatted id',formateduserid);
        if(usertofollowupdate.followers.includes(userid)){
            // console.log('if blockhas been hit');
            const userindex=usertofollowupdate.followers.indexOf(userid)
            const followingindex=userupdatefollowing.following.indexOf(usertofollow)
// console.log('indexes',userindex,followingindex  )

            usertofollowupdate.followers.splice(userindex,1)
            usertofollowupdate.followerscounter--
            await usertofollowupdate.save()

            userupdatefollowing.following.splice(followingindex,1)
            userupdatefollowing.followingcounter--
await userupdatefollowing.save()

res.send({user:usertofollowupdate,following:false})


        }else{

            // console.log('else blockhas been hit');

            usertofollowupdate.followers.push(userid)
            usertofollowupdate.followerscounter++
            userupdatefollowing.following.push(usertofollow)
            userupdatefollowing.followingcounter++
            await usertofollowupdate.save()
            await userupdatefollowing.save()

            res.send({user:usertofollowupdate,following:true})
        }


    } catch (error) {

        console.log(error.message);
        res.send(error)
        
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