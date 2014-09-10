exports.addPortfolio = function(req, res){
	var name = req.body.name;
	// Get username from current session
	var username = req.session.currentUser.username;
	var userModel = mongoose.model("users");
	if(username != undefined){
		userModel.addPortfolio(username, name, function(error, user){
			if(error){
				res.status(500);
				res.send(error);
			} else{
				console.log(user);

				// Reset currentUser session variable
				// Remove password from user object
				var currentUser = user;
				currentUser.password = "Can't touch this";
				req.session.currentUser = currentUser;

				res.status(200);
				res.send();
			}
		});
	} else{
		res.status(500);
		res.send("Please login or register to add portfolios");
	}
};

exports.deletePortfolio = function(req, res){
	var name = req.body.name;
	// Get username from current session
	var username = req.session.currentUser.username;
	var userModel = mongoose.model("users");
	if(username != undefined){
		userModel.deletePortfolio(username, name, function(error, user){
			if(error){
				res.status(500);
				res.send(error);
			} else{
				console.log(user);

				// Reset currentUser session variable
				// Remove password from user object
				var currentUser = user;
				currentUser.password = "Can't touch this";
				req.session.currentUser = currentUser;

				res.status(200);
				res.send();
			}
		});
	} else{
		res.status(500);
		res.send("Please login or register to add portfolios");
	}
};