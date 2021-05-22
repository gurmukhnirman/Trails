var express     =  require("express");
var router      =  express.Router();

// HOME ROUTE
router.get('/',function(req, res){
	res.render("Blogs/landing");
});

module.exports = router;