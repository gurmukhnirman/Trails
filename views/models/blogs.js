var mongoose=require("mongoose");

const blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
  overall_rating:Number,
  address: String,
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
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