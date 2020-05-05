var mongoose = require ("mongoose");
var commentSchema = mongoose.Schema({
	text:String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
			//ref refers to the model that we are going ot refer to with this object id
		},
		username:String
	}
});
module.exports =mongoose.model("Comment",commentSchema);
							   
							   //comment is name of model
							   //next param is schemarm