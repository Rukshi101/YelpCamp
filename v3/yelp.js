var express = require ("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");
 var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var User = require("./models/user");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
var methodOverride = require("method-override");
// seedDB();
mongoose.connect("mongodb://localhost/yelp_campv3");
//creates a yelp camp database inside monogodb if non existent
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
//PASSPORT CONFIGURATION

app.use(require("express-session")({
	secret:"Once again Rusty wins!",
	resave: false,
	saveUninitialized: false
}));
		
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.success =req.flash("success");
	res.locals.error =req.flash("error");
	next();
});

//SCHEMA setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image:String,
	description: String
	
});

//db.database.drop() erases all objects in database



// Campground.create(
// {
// 	name:"salmon Creek",
// 	image:"https://images.newrepublic.com/278d84712623b02f531a89c0f59e93a04e30904e.jpeg?w=1200&q=65&dpi=2.625&fm=pjpg&fit=crop&crop=faces&h=800",
// description: "LOL"
// }, function(err, campground){
// 	if(err){
// 		console.log(err);
// 	}else {
// 		console.log("NEWLY CREATED CAMPGROUND");
// 		console.log(campground)
// 	}
// });
//CREATES A CAMPGROUND

	var campgrounds = [
		//array of camprgrounds stored as objects
		{name :"Salmon Creek", image:"https://images.newrepublic.com/278d84712623b02f531a89c0f59e93a04e30904e.jpeg?w=1200&q=65&dpi=2.625&fm=pjpg&fit=crop&crop=faces&h=800" },
		{name :"Dog Creek", image:"https://images.newrepublic.com/278d84712623b02f531a89c0f59e93a04e30904e.jpeg?w=1200&q=65&dpi=2.625&fm=pjpg&fit=crop&crop=faces&h=800" },
		{name :"Lebron Creek", image:"https://images.newrepublic.com/278d84712623b02f531a89c0f59e93a04e30904e.jpeg?w=1200&q=65&dpi=2.625&fm=pjpg&fit=crop&crop=faces&h=800" }
	];
	
//outside so that i have acess to it within all routes

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
//this appends this /campgrounds to every campground route
app.use("/campgrounds/:id/comments",commentRoutes);
//YOU CAN DO THE SAME TO COMMENTS BUT I DIDNT


//PUT THIS FUNCTION WHEREVER YOU WANT THE USER TO BE SIGNED IN BEFORE LOOKING AT IT
app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
});