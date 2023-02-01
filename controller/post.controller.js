const {postsmodel} =require('../models/main.models')



exports.getallphotos=async(req,res)=>{

    try {
        const allposts=await postsmodel.find()
        console.log(allposts);
        res.send('all photo route hit')
    } catch (error) {
        
    }

}

exports.getsinglephoto=async(req,res)=>{
    res.send('single photo route hit')

}

exports.getcategoryphotos=async(req,res)=>{

    const category=req.params.category
    res.send('category photo route hit: '+category)

}











exports.postphoto=async(req,res)=>{

    try {
   
    if(req.files){
        // res.send('post photo route hit')
        const allfiles =req.files.photo
        // console.log(allfiles);
        let length=0;
        allfiles.forEach(file => {
            
            let uploadPath = 'public/uploads/' + Date.now()+file.name;
            

  file.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    length++

    if(length=== allfiles.length) res.send('File successfully uploaded ' );
            
        });
    })

     



}


} catch (error) {
        
}
}

exports.deletephoto=async(req,res)=>{
    res.send('delete photo route hit: '+req.params.photoid)

}

