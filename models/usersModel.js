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

mongoose.model("users", usersSchema);