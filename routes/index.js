/* GET home page. */
router.get('/', function(req, res) {
	var stocks = [
		{ticker: "GOOG"},
		{ticker: "FB"},
		{ticker: "TWTR"},
		{ticker: "TSLA"}
	];
  res.render('index', {
  	stocks: stocks,
  	currentUser: undefined });
});

module.exports = router;