const {postsmodel} =require('../models/main.models')



exports.getallposts=async(req,res)=>{

    try {
        const pagesize = 2;
        let pagination = req.query.pagination;
           
        const allposts=await postsmodel.find()
        // .skip(pagination * pagesize)
        // .limit(pagesize)
         .populate("user","username imgurl  createdAt");
         res.send({allposts})
        
    } catch (error) {
        res.send({errormessage:error.message})
        
    }

}

exports.getsinglepost=async(req,res)=>{
  
    try {

        const id=req.params.id
        const singlepost=await postsmodel.findById({_id:id})
        .populate({path:"user",select:"imgurl _id username",model:"USER" })
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

    const category=req.params.category
    res.send('category photo route hit: '+category)

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
            
            let filename= Date.now()+allfiles.name
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
                _id:folder

            }
    
            const post = await postsmodel.create({...postpayload})
    
           return res.send({post,message:'post created successfully'})
    
    
    
            
            
             }

        //    return res.send('skipping if check')
    })

     



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

