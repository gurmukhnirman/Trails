var express     =  require("express");
var router      =  express.Router();
var User        =  require("../views/models/User.js");
var Blog        =  require("../views/models/blogs.js");


// INDEX ROUTE
router.get('/blogs',function( req, res){
    console.log("showing home page");
     Blog.find({},function(err,blogs){
        if(err)
        console.log('error');
        else
        res.render("Blogs/index",{blogs:blogs});
    });	
 });
 
 
 // NEW BLOG ROUTE
  
 router.get('/blogs/new',LoggedIn,function(req,res){
     res.render("Blogs/new");
 });
 
 router.post('/blogs',LoggedIn,function(req,res){
     req.body.blog.userId = req.user._id;
     console.log("came here");
      Blog.create(req.body.blog,function(err,post){
          if(err)
          res.redirect('/blogs/new');
          else{
             User.findById(req.user._id,function(err,person){
                   if(err) {
                       console.log("here error");
                       res.redirect('/blogs/new');
                   }
                   else{
                       person.posts.push(post);
                       person.save(function(err,newUser){
                           if(!err){
                               res.redirect("/blogs");
                           }
                       })
                   }
             });
          }
      });
 
 });
 
 // show route
 router.get('/blogs/:id',function(req,res){
     //let cardId = new ObjectId(req.params.id);
     Blog.findById(req.params.id).populate("comments").exec(function(err,data){
         if(err)
             console.log("bitch you are in wrong route");
         else
         {			
           User.findById(data.userId,function(err,user){
                 if(err) console.log("wrong id");
                 else{
                     res.render("Blogs/show",{data:data,user:user});
                 }
           });
           
         }
     });
 });
 //edit and update
 
 router.get("/blogs/:id/edit",(req,res)=>{
     Blog.findById(req.params.id,(err,data)=>{
         if(err) res.send("error");
         else{
             res.render("Blogs/edit",{data:data});
         }
     });
 });
 
 //update route
 
 router.put("/blogs/:id",(req,res)=>{
      Blog.findByIdAndUpdate(req.params.id, req.body.blog ,function (err, docs) {
           if (err){
              console.log(err)
           }
          else{
             //  console.log("Updated User : ", docs);
              res.redirect("/blogs/"+ req.params.id);
           }
 });
 });
 
 
 // delete route
 router.delete('/blogs/:id',function(req,res){
     Blog.findByIdAndRemove(req.params.id,function(err){
       if(err)
       res.send("ERROR");
       else
       res.redirect('/posts/'+ req.user._id);
     });
 });

 //=========================================//
 //get user
router.get("/user/:id",function(req,res){
	User.findById(req.params.id,(err,data)=>{
		if(err) res.send("no user with this id");
		else res.render("my_posts/user_profile",{data:data});
	})
})

//==================================//
// search a post
router.get('/anime',function(req,res){
	//  res.send(req.query.search);	 
	var thename = req.query.search;
	Blog.findOne( { "title" : { $regex : new RegExp(thename, "i") } },function(err,foundBlog){
			 if(err)
			 res.send("error");
			 else
			  res.render("Blogs/search",{data:foundBlog});
		 } );
// 	 Blog.findOne({title: req.query.search},function(err,foundBlog){
// 	 if(err)
// 	 res.send("error");
// 	 else
// 	  res.render("Blogs/search",{data:foundBlog});
//  });
});

function LoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }	
    res.redirect("/login");
 };

module.exports= router;