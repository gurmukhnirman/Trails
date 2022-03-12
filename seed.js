var mongoose=require("mongoose");
var Blog=require("./views/models/blogs.js");
var Comment=require("./views/models/comment.js");
const User = require("./views/models/User.js");

// NOW IT WONT WORK AS WE HAVE A NEW FIELD THAT IS USER WHICH HAS SUBMITTED IT

function seedDB()
{
    Blog.remove({},function(err){
      if(err)
       console.log(err);
       else
       {   Comment.remove({},function(err){
             if(err)
             console.log("not able to remove comments");
             else
          {
             console.log("removed comments");
             console.log("blogs are removed");  
           }
       
     });
    }
    });

    User.remove({},function(err){
      if(err)  console.log(err);
      else console.log("removed all users");
    });

}
module.exports=seedDB;
   