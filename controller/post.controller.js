const {postsmodel} =require('../models/main.models')



exports.getallposts=async(req,res)=>{

    try {
        const pagesize = 2;
        let pagination = req.query.pagination;
           
        const allposts=await postsmodel.find().skip(pagination * pagesize)
        .limit(pagesize)
        .populate("user","username imgurl  createdAt");
         res.send({allposts})
        
    } catch (error) {
        res.send({errormessage:error.message})
        
    }

}

exports.getsinglepost=async(req,res)=>{
  
    try {

        const id=req.params.id
        const singlepost=await postsmodel.findById({_id:id});
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
   
    if(req.files){
        // res.send('post photo route hit')
        const allfiles =req.files.photo
          console.log(allfiles.length);

         let length=0;

         let filespatharraytosave=[]
         if(allfiles.length === undefined) {
            
            let filename= Date.now()+allfiles.name
            let uploadPath = 'public/uploads/' +filename;
            let viewpath='http://localhost:4555/'+`uploads/${filename}`
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
                caption:req.body.caption
            }

            const post = await postsmodel.create({...postpayload})

            res.send({post,message:'post created successfully'})

         }
   
        allfiles.forEach(async(file) => {
            let filename= Date.now()+file.name
            let uploadPath = 'public/uploads/' +filename;
            let viewpath='http://localhost:4555/'+`uploads/${filename}`
            
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
                caption:req.body.caption

            }
    
            const post = await postsmodel.create({...postpayload})
    
           return res.send({post,message:'post created successfully'})
    
    
    
            
            
             }

        //    return res.send('skipping if check')
    })

     



}


} catch (error) {
        
}
}

exports.deletephoto=async(req,res)=>{
    res.send('delete photo route hit: '+req.params.photoid)

}

