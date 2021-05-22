var express     =  require("express");
var router      =  express.Router();
var User        =  require("../views/models/User.js");
var passport    =  require("passport");


//register the user
router.get("/register",function(req,res){
	res.render("Blogs/register");
});

router.post("/register",function(req,res){
	var newUser = new User({username:req.body.username,email:req.body.email,mobileNumber: req.body.mob_no});
	// console.log(newUser);
	// console.log(req.body.password);
     User.register(newUser,req.body.password,function(err,user){
		 if(err)
		 {
			  console.log(err);
			  return res.render("Blogs/register");
		 }
		      passport.authenticate("local")(req,res,function(){
			  res.redirect("/blogs");			 
		 });
	 });
});

// login a user
router.get("/login",function(req,res){
	res.render("Blogs/login");
});

router.post("/login",passport.authenticate("local",
    {
	  successRedirect:"/blogs", 
	  failureRedirect:"/login"}),
	  function(req,res){
	//res.send("entered the login route");
	});
	
// Logout route
router.get("/logout",function(req,res){
	 req.logOut();
	 res.redirect("/blogs");
});

//==================================

function LoggedIn(req,res,next){
   if(req.isAuthenticated()){
	   return next();
   }	
   res.redirect("/login");
};

module.exports = router