exports.login = function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	var userModel = mongoose.model("users");
	userModel.login(username, password, function(error, user){
		if(error){
			console.log(error);
		} else{
			// Put currentUser object in session
			req.session.currentUser = user;
			console.log("User login successful");
			res.redirect("/");
		}
	});
};

exports.logout = function(req, res){
	req.session = null;
	console.log("Logged out");
	res.redirect("/");
};

exports.showAllUsers = function(req, res){
	var userModel = mongoose.model("users");
	userModel.find(function(error, users){
		res.send(users);
	});
};