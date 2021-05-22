var express     =  require("express");
var router      =  express.Router();
var User        =  require("../views/models/User.js");
var Blog        =  require("../views/models/blogs.js");
var Comment     =  require("../views/models/comment.js");


//form for comments
router.get('/blogs/:id/comments/new',LoggedIn,function(req,res){
	//console.log(req.params.id);
     Blog.findById(req.params.id,function(err,blogs){
		if(err)
		console.log("comment form can't be shown");
		else
		{
			res.render("Comments/new",{newcom:blogs});
		}
	 });
});

// posting a comment
router.post('/blogs/:id/comments',LoggedIn,function(req,res){
	console.log("inside comment route");
  Blog.findById(req.params.id,function(err,post){
	if(err)
	{
	 console.log("not able to find post in post route");
    // console.log(req.params.id);
	}
	else
      {
		  Comment.create(req.body.com,function(err,newcomment){
			 if(err)
			 console.log("comment not created successfully");
			 else
			 {
				 post.comments.push(newcomment);
				 post.save(function(err,doc){
					 if(err)
					 console.log("post with comment not saved");
					 else{
						 //res.redirect("/blogs/"+ req.params.id);
						 res.redirect('/blogs/'+req.params.id);
					 }
				 });
			 }
		  });
	  }
});
});

router.get("/posts/:id",function(req,res){
    // res.send("you got to the user");
	User.findById(req.params.id).populate("posts").exec(function(err,data){
		if(err){
			console.log("not able to expand posts");
			res.send("error");
		}    	
		else
		{			
		  console.log(data);
		  res.render("my_posts/my_posts",{data:data});
		}
	});
});

function LoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }	
    res.redirect("/login");
 };

module.exports = router;