const {postsmodel} =require('../models/main.models')
const fs = require('fs');
const { response } = require('express');


exports.getallposts=async(req,res)=>{

    try {
        const pagesize = 10;
        let pagination = req.query.pagination;
           
        const posts=await postsmodel.find()
         .sort({createdAt:-1})
          .skip(pagination * pagesize)
          .limit(pagesize)
         .populate("user","username imgurl  createdAt followerscounter followingcounter");

        //  console.logposts.createdAt);
         res.send({posts})
        //  res.send({dates:allposts.createdAt})
        
    } catch (error) {
        res.send({errormessage:error.message})
        
    }

}

exports.getsinglepost=async(req,res)=>{
  
    try {

        
        const id=req.params.id
        const singlepost=await postsmodel.findById({_id:id})
        .populate({path:"user",select:"imgurl _id username followerscounter followingcounter",model:"USER" })
         .populate(
        {path:'comments',
         select:"comment ownerid _id updatedAt createdAt",
         model:"COMMENTS" ,
         populate:[
            {path:'ownerid',
            model:"USER",
            select:"_id username imgurl"
            }
                 ]
        }
        )  .populate(
            {path:'likes',
             select:"imgurl _id username",
             model:"USER" ,
         
            }
            )
        
            if(singlepost ===null)throw new Error('missing document')
     res.send({singlepost})
    } catch (error) {
        res.send({errormessage:error.message})
    }

}

exports.getcategoryposts=async(req,res)=>{

    try {
        const pagesize = 10;
        let pagination = req.query.pagination;
    const searchcategory=req.query.category
    console.log(searchcategory);
    const posts=await postsmodel.find({category:searchcategory})
    .sort({createdAt:-1})
     .skip(pagination * pagesize)
     .limit(pagesize)
   .populate("user","username imgurl  createdAt");
     console.log('categories result:\n',posts);
   if(posts.length===0) return res.send({message:`no posts from ${searchcategory} category`,posts})
    // responsemessage='no posts from '+searchcategory+' category';
//    return res.send({message:responsemessage})


    
    res.send({posts})
    } catch (error) {
        res.send({errormessage:error.message})
    }

}

exports.getuserposts=async(req,res)=>{

    try {
        const pagesize = 5;
        let pagination = req.query.pagination;
    const postowner=req.query.user
    console.log(pagination,postowner);
    const posts=await postsmodel.find({user:postowner})
    .sort({createdAt:-1})
     .skip(pagination * pagesize)
     .limit(pagesize)
   .populate("user","username imgurl  createdAt");
    //  console.log('categories result:\n',posts);
//    if(posts.length===0) return res.send({message:`no posts from ${postowner} category`,posts})
    // responsemessage='no posts from '+searchcategory+' category';
//    return res.send({message:responsemessage})


    
    res.send({posts})
    } catch (error) {
        res.send({errormessage:error.message})
    }

}



exports.postphoto=async(req,res)=>{

    try {
   
const folder=req.body._id

    if(req.files){
        // res.send('post photo route hit')
        const allfiles =req.files.photo
          console.log(allfiles.length);

         let length=0;

         let filespatharraytosave=[]
         if(allfiles.length === undefined) {
            let trimmedfilename=allfiles.name.replace(/ /g,'')
            let filename= Date.now()+trimmedfilename
            let uploadPath = `public/uploads/${folder}/` +filename;
            let viewpath='http://localhost:4555/'+`uploads/${folder}/${filename}`
            filespatharraytosave.push(viewpath)

            allfiles.mv(uploadPath, function(err) {
                if (err) {
                  return res.status(500).send(err);
                }
            
                     console.log('saved files: ',filespatharraytosave);
                    //  res.send('File successfully uploaded ' );
                    
                    
                    
                        
                    });

        console.log('single file save: \n',filespatharraytosave);

            const postpayload={
                imgurl:filespatharraytosave,
                user:req.body.userid,
                category:req.body.category,
                caption:req.body.caption,
                comments:[],
                likes:[],
                _id:folder
            }

            const post = await postsmodel.create({...postpayload})

         return   res.send({post,message:'post created successfully'})

         }
   
        allfiles.forEach(async(file) => {
            let filename= Date.now()+file.name
            let uploadPath = `public/uploads/${folder}/` +filename;
            let viewpath='http://localhost:4555/'+`uploads/${folder}/${filename}`
            
            filespatharraytosave.push(viewpath)
//  await file.mv(uploadPath, function(err) {
//     if (err)  return res.status(500).send(err);
//     length++
//     console.log('number of files moved: ',length);

   
// });


      await file.mv(uploadPath);
       length++
// console.log('result from awaiting file movement: \n',fileresult);
         if(length=== allfiles.length){

        console.log('multiple file save: \n',filespatharraytosave);
            const postpayload={
                imgurl:filespatharraytosave,
                user:req.body.userid,
                category:req.body.category,
                caption:req.body.caption,
                comments:[],
                likes:[],
                _id:folder

            }
    
            const post = await postsmodel.create({...postpayload})
    
           return res.send({post,message:'post created successfully'})
    
    
    
            
            
             }

        //    return res.send('skipping if check')
    })

     



}else{
    res.send({message:"post must include photos"})
}


} catch (error) {

    res.send({errormessage:error.message})
        
}
}

exports.deletephoto=async(req,res)=>{
    try {
        const id=req.params.photoid
        const{userid}=req.body
        const posttodelete=await postsmodel.findById({_id:id})
    
        if(posttodelete===null)throw new Error('missing document')
       
    
            console.log('post to delete:\n',posttodelete);
            console.log('post owner:\n',posttodelete.user);
            console.log('auth user:\n',userid);
    
          const  postonwerid = posttodelete.user.toString()
          console.log('',postonwerid);
          
    if(postonwerid !== userid)  throw new Error('unauthorized deletion atempt')
    
    
            fs.rmSync(`./public/uploads/${posttodelete._id}`, { recursive: true });
            
            await posttodelete.delete()

            res.send({message:'post deleted'})
    
    
        
        
    } catch (error) {
    
        res.send({errormessage:error.message})
        
    }

}


exports.updatephotocomment=async(req,res)=>{
    // res.send('update photo route hit: '+req.params.photoid)

try {
    const id=req.params.photoid
    const{userid,commentupdate}=req.body
    const posttoupdate=await postsmodel.findById({_id:id})

    if(posttoupdate===null)throw new Error('missing document')
  

        console.log('post to update:\n',posttoupdate);
        console.log('auth user:\n',userid);
        console.log('post owner:\n',posttoupdate.user);

      const  postonwerid = posttoupdate.user.toString()
      
      if(postonwerid !== userid)  throw new Error('unauthoirized attempt to edit post')


        posttoupdate.caption=commentupdate
        await posttoupdate.save()
        res.send({message:'post updated',posttoupdate})


    
    
} catch (error) {

    res.send({errormessage:error.message})
    
}

}

