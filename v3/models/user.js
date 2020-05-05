var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
	username:String,
	password:String
});

UserSchema.plugin(passportLocalMongoose);
//adds a few methods to the user schema that we can use

module.exports = mongoose.model("User",UserSchema);