var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var usersSchema = new Schema({
	username: String,
	password: String,
	// Type can be: sfree, paid
	accountType: { type: String, default: "free" },
	dateCreated: { type: Date, default: Date.now },
	description: String,
	portfolios: [{
		name: String,
		stocks: [{
			ticker: String
		}]
	}],
	stocks: [{
		ticker: String
	}]
});

usersSchema.statics.login = function(username, password, callback){
	this.findOne({username: username}, function(error, user){
		if(error){
			callback("User not found", undefined);
		} else{
			console.log(user);
			if(bcrypt.compareSync(password, user.password)){
				callback(false, user);
			} else{
				callback("Password is incorrect", undefined);
			}
		}
	});
};

mongoose.model("users", usersSchema);