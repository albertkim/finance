exports.addStock = function(req, res){
	
	var ticker = req.body.ticker;
	var stock = {ticker: ticker};

	// Get current user from session
	var currentUser = req.session.currentUser;
	// Find user from database, modify
	var userModel = mongoose.model("users");
	userModel.findOne({_id: currentUser._id}, function(error, user){
		if(error){
			console.log("Error finding user");
		} else {
			// Add stock to user entry in db
			user.stocks.push(stock);

			user.save(function(error, user){
				console.log("Stock successfully added");
				// Update the currentUser model in session as well
				var newCurrentUser = req.session.currentUser;

				newCurrentUser.stocks.push(stock);
				req.session.currentUser = newCurrentUser;
				res.status(200);
				res.send();
			});
		}
	});
};

exports.deleteStock = function(req, res){

	var ticker = req.body.ticker;
	var stock = {ticker: ticker};

	// Get current user from session
	var currentUser = req.session.currentUser;
	// Find user from database, modify
	var userModel = mongoose.model("users");
	userModel.findOne({_id: currentUser._id}, function(error, user){
		if(error){
			console.log("Error finding user");
		} else {
			console.log(user);
			// Remove stock from user entry in db
			user.stocks = _.without(user.stocks, _.findWhere(user.stocks, {ticker: ticker}));

			user.save(function(error, user){
				console.log("Stock successfully added");
				// Update the currentUser model in session as well
				var newCurrentUser = req.session.currentUser;
				newCurrentUser.stocks = _.without(newCurrentUser.stocks, _.findWhere(newCurrentUser.stocks, {ticker: ticker}));

				req.session.currentUser = newCurrentUser;
				res.status(200);
				res.send();
			});
		}
	});

};