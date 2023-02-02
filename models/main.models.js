const mongoose =require ('mongoose')

// * post model
exports.postsmodel = mongoose.model(
    "POST",
    new mongoose.Schema(
      {
        user: { type: mongoose.Schema.Types.ObjectId, required: true ,ref:"USER"},
        imgurl: [],
        caption:{type:String},
        likes: [],
        comments:[],
        category:{type:String ,enum:["nature","technology","health","wildlife","all"]}
        
      },
      { timestamps: true }
    )
  );// {ownerid:{type:mongoose.Schema.Types.ObjectId,required:true},comment:{type:String,requiredtrue}}

// * likes model

  exports.likesmodel = mongoose.model(
    "LIKES",
    new mongoose.Schema(
      {
       likes: [{type: mongoose.Schema.Types.ObjectId}],
      },
      { timestamps: true }
    )
  );

// * user model
  exports.usermodel = mongoose.model(
    "USER",
    new mongoose.Schema(
      {
        username: { type: String, required: true },
        imgurl: { type: String,required:true,default:'http://localhost:4555/defaultpic/profile.png'},
        hash:{ type: String, required: true },
        email: { type: String, required: true },
      },
      { timestamps: true }
    )
  );


  // * comments model
  exports.commentsmodel = mongoose.model(
    "COMMENTS",
    new mongoose.Schema(
      {
        comment: { type: String, required: true },
        ownerid:{type:mongoose.Schema.Types.ObjectId,required:true},
      
      },
      { timestamps: true }
    )
  );