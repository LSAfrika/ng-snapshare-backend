const mongoose =require ('mongoose')

// * post model
exports.postsmodel = mongoose.model(
    "POST",
    new mongoose.Schema(
      {
        user: { type: String, required: true },
        imgurl: { type: String, required: true },
        
        likes: [],
        comments:[],
        enum:["nature","technology","health","wildlife"]
        
      },
      { timestamps: true }
    )
  );// {ownerid:{type:mongoose.Schema.Types.ObjectId,required:true},comment:{type:String,requiredtrue}}

// * likes model

  exports.likesmodel = mongoose.model(
    "LIKES",
    new mongoose.Schema(
      {
       kes: [{type: mongoose.Schema.Types.ObjectId}],
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
        imgurl: { type: String },
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