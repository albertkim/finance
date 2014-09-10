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

// Login operations

usersSchema.statics.login = function(username, password, callback){
	this.findOne({username: username}, function(error, user){
		if(error){
			callback("User not found", undefined);
		} else {
			if(bcrypt.compareSync(password, user.password)){
				callback(false, user);
			} else{
				callback("Password is incorrect", undefined);
				callback("Password is incorrect", user);
			}
		}
	});
};

// Portfolio operations

usersSchema.statics.addPortfolio = function(username, name, callback){
	this.findOne({username: username}, function(error, user){
		if(error){
			callback("User not found", undefined);
		} else {
			// Update the user's portfolio field
			user.portfolios.push({
				name: name,
				stocks: []
			});
			user.save(function(error, user){
				if(error){
					console.log("Error saving user with updated portfolio");
				} else{
					// Session variable handling should be done by the caller
					console.log("Portfolio successfully added");
					callback(false, user);
				}
			});

		}
	});
};

usersSchema.statics.deletePortfolio = function(username, name, callback){
	this.findOne({username: username}, function(error, user){
		if(error){
			callback("User not found", undefined);
		} else {
			// Update the user's portfolio field
			user.portfolios = _.without(user.portfolios, _.findWhere(user.portfolios, {name: name}));
			user.save(function(error, user){
				if(error){
					console.log("Error saving user with updated portfolio");
				} else{
					// Session variable handling should be done by the caller
					console.log("Portfolio successfully added");
					callback(false, user);
				}
			});	// user.save
		}
	});
};

mongoose.model("users", usersSchema);