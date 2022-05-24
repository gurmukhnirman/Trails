var express     =  require("express");
var router      =  express.Router();
var User        =  require("../views/models/User.js");
var Blog        =  require("../views/models/blogs.js");
var axios       =  require("axios").default;
var locus       =  require('locus')


// INDEX ROUTE
router.get('/blogs',function( req, res){

    console.log("showing home page");
    console.log(process.env.position_stack_api);
     Blog.find({location_type: "tourist_site"},function(err,blogs){
        if(err)
        console.log('error');
        else{
            blogs.sort((a,b) => (a.overall_rating > b.overall_rating) ? -1: 1)
            res.render("Blogs/index",{blogs:blogs});
        }
        
    });	
 });
 
 
 // NEW BLOG ROUTE
  
 router.get('/blogs/new',LoggedIn,function(req,res){
     res.render("Blogs/new");
 });
 
 router.post('/blogs',LoggedIn,function(req,res){
     req.body.blog.userId = req.user._id;
     console.log("posting a blog");
    //  console.log(req.body.blog);
    let address = req.body.blog.location;
   console.log(address);
   let key = process.env.position_stack_api;;
    // now we will get the lat,long from address

    const params = {
        access_key: key,
        query: address
      }
    
      axios.get('http://api.positionstack.com/v1/forward', {params})
      .catch(error => {
        
        // console.log(error.response.status, error.response.statusText);
        if(!error){
            res.send("error");
        } 
        else {
            res.send(error.response);
        }
      })
      .then(response => {
        // console.log(response.data);
          req.body.blog.address = req.body.blog.location; 
          req.body.blog.location = {
              type : "Point",
              coordinates: [response.data.data[0].longitude,response.data.data[0].latitude],
          }


          console.log(req.body.blog);
          Blog.create(req.body.blog,function(err,post){
          if(err){
            res.send(err);
            // res.redirect('/blogs/new');
          }
          
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
      })
     
    
   
    //   Blog.create(req.body.blog,function(err,post){
    //       if(err)
    //       res.redirect('/blogs/new');
    //       else{
            
    //          User.findById(req.user._id,function(err,person){
    //                if(err) {
    //                    console.log("here error");
    //                    res.redirect('/blogs/new');
    //                }
    //                else{
    //                    person.posts.push(post);
    //                    person.save(function(err,newUser){
    //                        if(!err){
    //                            res.redirect("/blogs");
    //                        }
    //                    })
    //                }
    //          });
    //       }
    //   });
 
 });
 
 // show route
 router.get('/blogs/:id',LoggedIn,function(req,res){
     //let cardId = new ObjectId(req.params.id);
     Blog.findById(req.params.id).populate("comments").exec(function(err,data){
         if(err)
             console.log("bitch you are in wrong route");
         else
         {			
           User.findById(data.userId,function(err,user){
                 if(err) console.log("wrong id");
                 else{
                     res.render("Blogs/show2",{data:data,user:user});
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
              res.redirect("/blogs/");
           }
 });
 });
 
 
 // delete route
 router.delete('/blogs/:id',function(req,res){
    //  res.send("reached here");
     Blog.remove({"_id" : req.params.id},function(err,data){
       if(err)
       res.send("ERROR");
       else{
        // res.redirect('/posts/'+ req.user._id);
        res.redirect("/blogs");
       }
       
     });
 });

 // get a location 
 router.post("/find_places",(req,res) =>{
     Blog.find({$text : {$search: req.body.place}},(err,data) =>{
         if(err){
             res.send("no relevant data in the database")
         }
         else{
             data.sort((a,b) => (a.overall_rating > b.overall_rating) ? -1: 1)
             res.render("my_posts/my_posts",{blogs: data, purpose: "Interesting spots"})
         }
     })
 })

// show all the posts
router.get("/my_posts",(req,res) =>{
      User.findById(req.user._id).populate("posts").exec((err,data) =>{
         if(err){
             console.log("wrong user");
         }
         else{
             res.render("my_posts/my_posts",{blogs: data.posts, purpose:"showing posts"});
           
         }
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

router.get('/user/:id/edit', (req,res) =>{
    let user_id = req.params.id;
    User.findById(user_id,(err,user) =>{
          if(err) {
              console.log("not able to find user");
          }
          else{
              res.render('Blogs/edit_user',{user: user})
          }
    })
})

router.put('/user/:id',(req,res) =>{
    let user_id = req.params.id;
    var newUser = {username:req.body.username,email:req.body.email,mobileNumber: req.body.mob_no,proffession: req.body.proffession, hobby: req.body.hobby,address: req.body.address,avatar: req.body.avatar};
    User.findByIdAndUpdate(user_id,newUser,(err,user) =>{
        if(err){
            res.send(err);
        }
        else{
            res.render("my_posts/user_profile",{data: user})
        }
    })

})

//==================================//
// search a post
router.get('/anime',function(req,res){
	//  res.send(req.query.search);	 
	var thename = req.query.search;
    console.log(thename);
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



//==================================================================
let location_list;
router.post('/search_loc',(req,res) =>{


   let key = process.env.position_stack_api;
   let address = req.body.location;
    // now we will get the lat,long from address

    const params = {
        access_key: key,
        query: address
    }

    axios.get('http://api.positionstack.com/v1/forward', {params})
    .catch(error => {
        console.log(error.response);
    })
    .then(response =>{
          if(response && response.data && response.data.data && response.data.data.length > 0){
            let lat = response.data.data[0].latitude;
            let long = response.data.data[0].longitude;
            // eval(locus);
            console.log(lat,long);
            
            Blog.find({ location:{ $near:{ $geometry:{ type:"Point", coordinates:[long,lat] },$maxDistance: 50000 }}},(err,data) => {
                if(err) console.log(err);
                else{
                    if(data.length == 0) res.send("no data");
                    else{
                        location_list = data;
                        res.render("Blogs/locations",{blogs: data});
                    }
                }
             })
          }
          else{
              res.send("server not able to find great places near the places you searched for")
          }
    })
})

router.post("/get_a_specific_loc",(req,res) =>{
    // res.send("came to specific loc");
    console.log(req.body.loc_type)
    let datalist  = {restaurants : [], hotels : [], tourist_places :[]  };
    location_list.forEach((blog) =>{
        if(blog.location_type == 'tourist_site') datalist['tourist_places'].push(blog);
        if(blog.location_type == 'restaurant') datalist['restaurants'].push(blog);
        if(blog.location_type == 'hotels') datalist['hotels'].push(blog);
   
    })

    let  loc_type = req.body.loc_type;
    res.render("Blogs/specific_loc",{blogs: datalist[loc_type], purpose: `great ${loc_type} near you`});
})

router.get("/book_hotels",(req,res) =>{
    let datalist  = {restaurants : [], hotels : [], tourist_places :[]  };
    location_list.forEach((blog) =>{
        if(blog.location_type == 'tourist_site') datalist['tourist_places'].push(blog);
        if(blog.location_type == 'restaurant') datalist['restaurants'].push(blog);
        if(blog.location_type == 'hotels') datalist['hotels'].push(blog);
   
    })
    res.render("Blogs/specific_loc",{posts : datalist[hotels]})
})

router.get("/book_restaurants",(req,res) =>{
    let datalist  = {restaurants : [], hotels : [], tourist_places :[]  };
    location_list.forEach((blog) =>{
        if(blog.location_type == 'tourist_site') datalist['tourist_places'].push(blog);
        if(blog.location_type == 'restaurant') datalist['restaurants'].push(blog);
        if(blog.location_type == 'hotels') datalist['hotels'].push(blog);
   
    })
    res.render("Blogs/specific_loc",{posts : datalist[restaurants]})
})

router.get("/best_tickets",(req,res) =>{
    let datalist  = {restaurants : [], hotels : [], tourist_places :[]  };
    location_list.forEach((blog) =>{
        if(blog.location_type == 'tourist_site') datalist['tourist_places'].push(blog);
        if(blog.location_type == 'restaurant') datalist['restaurants'].push(blog);
        if(blog.location_type == 'hotels') datalist['hotels'].push(blog);
   
    })
    res.render("Blogs/specific_loc",{posts : datalist[tourist_sites]})
})



function LoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }	
    res.redirect("/login");
 };

module.exports= router;