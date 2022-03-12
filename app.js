var express                =require("express");
var app                    =express(); 
var bodyParser             =require("body-parser");
var mongoose               =require("mongoose");
var passport               =require("passport");
var LocalStrategy          =require("passport-local").Strategy;
var methodOverride         =require("method-override");
var Blog                   =require("./views/models/blogs.js");
var Comment                =require("./views/models/comment.js");
var User                   =require("./views/models/User.js");
var seedDB                 =require("./seed.js");
var passportLocalStrategy  =require("passport-local-mongoose");
var env                    =require('dotenv');
const  Server              =require("socket.io");

// routes
var blogRoutes     = require("./routes/blogs.js");
var commentRoutes  = require("./routes/comments.js");
var authRoutes     = require("./routes/auth");
var indexRoutes    = require("./routes/index")


mongoose.connect(`mongodb+srv://gurmukh:nirmangursahib@cluster0.4fjef.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,{
	useNewUrlParser:true,
	useCreateIndex:true,
	useUnifiedTopology: true
}).then(()=>{
	console.log("Connected to DB!");
}).catch(err => {
	 console.log('ERROR:',err.message);
});

mongoose.set('useFindAndModify', false);
app.set("view engine","ejs");
app.use(express.static( __dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));



// seedDB();

// auth config
app.use(require("express-session")({
	secret: "Once again i would say i'm the best",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//=========================================================//

 app.use(function(req, res, next){
 res.locals.currentUser =req.user;
 next();
});
app.use(function(req, res, next){
	res.locals.keys = process.env;
	next();
   });
app.use(indexRoutes);
app.use(authRoutes);
app.use(blogRoutes);
app.use(commentRoutes);


let port= process.env.PORT || 1234;
app.listen(port,() => {
	console.log("server listening on port 1234");
});


