var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,foundCampground){
						if(err){
							req.flash("error","Campground not found!");
		res.redirect("back");
	}else{//DOES USER OWN THE CAMPGROUND
		if(foundCampground.author.id.equals(req.user._id)){
			next();
			//move onto the rest of the code
		}else{
			req.flash("error", "You don't have permission to do this");
			res.redirect("back")
		}
	}
						});
	}else{
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership =function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
						if(err){
		res.redirect("back");
	}else{//DOES USER OWN THE CAMPGROUND
		if(foundComment.author.id.equals(req.user._id)){
			next();
			//move onto the rest of the code
		}else{
			req.flash("error", "You don't have permission to do that ");
			res.redirect("back")
		}
	}
						});
	}else{
		req.flash("error","You need to be logged in");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to see this.");
	//accesses this on next request
	res.redirect("/login");
	//before you redirect
}




module.exports = middlewareObj;