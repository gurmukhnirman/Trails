var mongoose=require("mongoose");
var Blog=require("./views/models/blogs.js");
var Comment=require("./views/models/comment.js");
const User = require("./views/models/User.js");

// NOW IT WONT WORK AS WE HAVE A NEW FIELD THAT IS USER WHICH HAS SUBMITTED IT

// var data=[
//     {
//         title:'MOB PSYCHO',
//         image:"https://images.alphacoders.com/998/998446.jpg",
//         body :"BEAUTIFUL FLOWER",
//         user : guri
//     },
//     {
//         title:'NARUTO',
//         image:"https://images3.alphacoders.com/270/thumb-1920-270187.jpg",
//         body :"BEAUTIFUL FLOWER",
//         user : guri
//     },
//     {
//         title:'Test3',
//         image:"https://images3.alphacoders.com/270/thumb-1920-270187.jpg",
//         body :"BEAUTIFUL FLOWER",
//         user : guri
//     },
//     {
//         title:'Test4',
//         image:"https://images.unsplash.com/photo-1588260692965-2c90db1b8c0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1448&q=80",
//         body :"BEAUTIFUL FLOWER",
//         user : guri
//     }
// ];
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
             console.log("campground is removed");  
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
   