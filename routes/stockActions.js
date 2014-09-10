// Expected: {ticker: ticker}
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

// Expected: {ticker: "ticker"}
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

// Expected: {tickers: ["ticker1", "ticker2", "ticker3", ...]}
exports.reorderStocks = function(req, res){
	// Iterate through the given tickers, find the stock object, and place in a new list
	// Make use of handy underscore functions
	var tickers = req.body.tickers;
	console.log(tickers);

	var currentUser = req.session.currentUser;
	var userModel = mongoose.model("users");
	userModel.findOne({_id: currentUser._id}, function(error, user){
		if(error){

		} else {
			var reorderedStocks = [];
			for(var i=0; i<tickers.length; i++){
				var stock = _.findWhere(user.stocks, {ticker: tickers[i]});
				reorderedStocks.push(stock);
			}
			user.stocks = reorderedStocks;
			user.save(function(error, user){
				if(error){

				} else {
					// Also modify session object
					var newCurrentUser = req.session.currentUser;
					newCurrentUser.stocks = reorderedStocks;
					req.session.currentUser = newCurrentUser;
					res.status(200);
					res.send();
				}
			});
		}
	});	// userModel.findOne

};

// Proxy request to get yahoo finance news via ajax
exports.getNews = function(req, res){
	// Gets ticker through the request body
	var ticker = req.body.ticker;
	var feedMeta;
	var articles = [];
	console.log("Getting news for ticker: " + ticker);

	http.get("http://feeds.finance.yahoo.com/rss/2.0/headline?s=" + ticker + "&region=US&lang=en-US", function(response) {
		
	  response.pipe(new feedParser({}))
	    .on('error', function(error){
	      // TODO: Tell the user we just had a melt-down
	      console.error("error");
	      console.log(error);
	    })
	    .on('meta', function(meta){
	      // Store the metadata for later use
	      feedMeta = meta;
	    })
      .on('readable', function(){
        var stream = this, item;
        while (item = stream.read()){
          // Each 'readable' event will contain 1 article
          // Add the article to the list of episodes
          var article = {
	          'title': item.title,
	          'mediaUrl': item.link,
	          'description': item.description,
	          'publicationDate': item.pubDate,
          };
          articles.push(article);
        }
      })
      .on('end', function(){
        var result = {
          'feedName': feedMeta.title,
          'website': feedMeta.link,
          'articles': articles
        };

        // TODO: return 'result' to the user in some fashion
        res.send(result);
      });
	});

};