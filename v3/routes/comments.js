var express = require ("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");
router.get("/new",middleware.isLoggedIn,function(req,res){
	//find campground by id
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			
		}else{
			res.render("comments/new",{campground:campground});
		}
	})
	
})

router.post("/",middleware.isLoggedIn,function(req,res){
	//lookup campground using ID
	Campground.findById(req.params.id,function(err,campground){
						if(err){
							req.flash("error","Campground not found!");
		console.log(err);
							res.redirect("/campgrounds");
	}else{
		Comment.create(req.body.comment,function (err,comment){
			if(err){
				console.log(err);
			}else{
				
			
		//add username and id to comments
		comment.author.id = req.user._id;
		comment.author.username = req.user.username;
			//comment.author,.id because of the way the comment model is setup
		//save commment
		comment.save();
		
		campground.comments.push(comment);
		campground.save();
				req.flash("success","Successfully added comment");
		res.redirect("/campgrounds/"+ campground._id);
			}
	})
	}
	
	})
	//create new comments
	//connect new comment to campground//redirect campground to show page.
})

//COMMENTS EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
		res.redirect("back");
	}else{
	res.render("comments/edit",{campground_id:req.params.id, comment:foundComment});
}
});
});


//COMMENT UPDATE THAT MUST COMPLEMEENT THE EDIT ROUTE
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			res.redirect("back")
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
})

router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
			
		}else{
			req.flash("success", "Comment Deleted!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

//middleware




module.exports = router;