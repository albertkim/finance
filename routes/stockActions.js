router.post("/addStocks", function(req, res){
	console.log(req.body);
	var body = JSON.parse(req.body);
	console.log(req.body.stocks);
	var portfolios = req.body.portfolios;
	var stocks = req.body.stocks;

  res.render('index', {
  	stocks: stocks,
  	portfolios: portfolios,
  	currentUser: undefined });
});

module.exports = router;