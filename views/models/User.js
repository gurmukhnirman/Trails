var mongoose              = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username:String,
    password: String,
    email: String,
    mobileNumber : String,
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Blog"
        }
    ],
    hobby: String,
    profession:String,
    address: String,
    avatar:String,
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);