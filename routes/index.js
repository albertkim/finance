router.get('/', function(req, res) {

	if(req.session.currentUser != undefined){

		var userModel = mongoose.model("users");
		var currentUser = req.session.currentUser;
		userModel.findOne({_id: currentUser._id}, function(error, user){
			if(error){
				console.log("Error finding current user");
				console.log(error);
			} else {
				var portfolios = user.portfolios;
				var stocks = user.stocks;
			  res.render('index', {
			  	stocks: stocks,
			  	portfolios: portfolios,
			  	currentUser: req.session.currentUser });
			}
		});

	} else {

		var portfolios = [
			{
				name: "Tech",
				stocks: [
					{ticker: "FB"},
					{ticker: "GOOG"},
					{ticker: "TSLA"},
					{ticker: "TWTR"},
					{ticker: "MSFT"},
					{ticker: "APPL"}
				]
			}
		];
		var stocks = [
			{ticker: "GOOG"},
			{ticker: "FB"},
			{ticker: "TWTR"},
			{ticker: "TSLA"},
			{ticker: "MSFT"}
		];
	  res.render('index', {
	  	stocks: stocks,
	  	portfolios: portfolios,
	  	currentUser: req.session.currentUser });

	}	// else

});

module.exports = router;