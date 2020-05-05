var express = require ("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");
//index.js is a special name that is middlewares main file so u dont need to add it as a path
router.get("/", function (req, res){
//Get all campgrounds from database
	Campground.find({}, function (err, allcampgrounds){
		if (err){
console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds:allcampgrounds,currentUser:req.user});
		}
	});

	
});

router.post("/",middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id:req.user._id,
		username:req.user.username
	}
	var newCampground = {name:name,price:price,image:image, description :description, author:author}
	//Get all campgrounds from DB
	
	Campground.create(newCampground, function (err, newlyCreated){
		if(err){
			console.log(err);
		}else {
			res.redirect("/campgrounds");
		}
	});
	//default is to redirect as a get request
});//use postman to test if the post route is working as it shows what stuff is returned when you send a post request




router.get("/new",middleware.isLoggedIn, function (req, res){
	res.render("campgrounds/new");
});

router.get("/:id", function (req, res){
//find campgrounds by id then populates comments on campground
	Campground.findById(req.params.id).populate("comments").exec( function(err,foundCampground){
		//request.params is id 
			 if(err){
				console.log(err);
				 	console.log("loooooooooooooooooool");
				 }else{
					 console.log(foundCampground);
					 res.render("campgrounds/show", {campground:foundCampground});
				 }
					   });
	//find the campground with provided ID
	//render show template with that campground
	
});
//EDIT CAMPGROUNDS 
//*********************************8

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	//is user logged in
	Campground.findById(req.params.id,function(err,foundCampground){
		res.render("campgrounds/edit",{campground:foundCampground});
	});
	
});



//UPDATE CAMPGROUND ROUTES
//**************************************8

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	//find and update the correct campground
	//the brackets around name link and description in edit group the three things together like an object
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if (err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
			
		}
	});
	
});


//DESTORY
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
			
		}else{
			res.redirect("/campgrounds");
		}
	})
});





module.exports = router;