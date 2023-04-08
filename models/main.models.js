const mongoose =require ('mongoose')

// * post model
exports.postsmodel = mongoose.model(
    "POST",
    new mongoose.Schema(
      {
        user: { type: mongoose.Schema.Types.ObjectId, required: true ,ref:"USER"},
        imgurl: [{type:String,required:true}],
        caption:{type:String},
        likes: [{type:mongoose.Schema.Types.ObjectId,ref:'USER'}],
        comments:[{type:mongoose.Schema.Types.ObjectId,ref:'COMMENTS'}],
        category:{type:String ,enum:["nature","technology","foods","wildlife","landscapes","sports"]}
        
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
        following:[{type:mongoose.Schema.Types.ObjectId,ref:'users'}],
        followers:[{type:mongoose.Schema.Types.ObjectId,ref:'users'}],
        followingcounter:{type:Number,default:0,required:true},
        followerscounter:{type:Number,default:0,required:true},
        username: { type: String, required: true },
        firebaseuid: { type: String},
        imgurl: { type: String,required:true,default:'http://localhost:4555/defaultpic/profile.png'},
        hash:{ type: String, required: true },
        email: { type: String, required: true },
        online:{type:Boolean,required:true,default:false},
        lastseen:{type:Number,required:true,default:Date.now()}
      },
      { timestamps: true }
    )
  );


  // * comments model
  exports.commentsmodel = mongoose.model(
    "COMMENTS",
    new mongoose.Schema(
      {
        post:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'post'},
        
        comment: { type: String, required: true },
        ownerid:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'user'},
      
      },
      { timestamps: true }
    )
  );

    // * comments model
    exports.notficationsmodel = mongoose.model(
      "NOTIFICATIONS",
      new mongoose.Schema(
        {
          commentid:{type:mongoose.Schema.Types.ObjectId,ref:'comments'},
          post: { type: mongoose.Schema.Types.ObjectId, required: true,ref:'POST' },
          postowner:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'USER'},
         notificationowner:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'USER'},
          notificationtype:{type:Number,required:true,enum:[1,2,3]},
          viewed:{type:Boolean,required:true,default:false}
        },
        { timestamps: true }
      )
    );

     // * comments model
     exports.messagesmodel = mongoose.model(
      "MESSAGES",
      new mongoose.Schema(
        {
          message: { type: String, required: true},
         chatid:{type:String,required:true},
        //  from_to:{type:String,required:true},
          from:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'USER'},
          to:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'USER'},
          viewed:{type:Boolean,required:true,default:false},
          // edited:{type:Boolean,required:true,default:false},

        },
        { timestamps: true }
      )
    );

    exports.usermessagesmodel=mongoose.model(
      'USERMESSAGES',
    new mongoose.Schema({
      _id:{type:mongoose.Schema.Types.ObjectId,required:true},
      userchats:[{
        chatid:{type:String,required:true},
        chatingwith:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"USER"},
        lastmessage:{type:String,required:true},
        timestamp:{type:Number,required:true,default:Date.now()}
      }]

    }))