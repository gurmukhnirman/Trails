var mongoose=require("mongoose");

const blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
  overall_rating:Number,
    created: {type: Date, default :Date.now},
    comments:  [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Comment"
      },      
],
userId: String
});
   module.exports= mongoose.model("Blog",blogSchema);