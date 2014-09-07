router.get('/', function(req, res) {
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
});

module.exports = router;