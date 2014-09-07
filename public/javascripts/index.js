var index = (function(){

	var stocks;
	var portfolios;
	var stockRowElements;
	var portfolioRowElements;

	var init = function(parameters){

		// Initialize stocks and portfolios
		if(parameters.stocks != undefined){
			stocks = parameters.stocks
		}
		if(parameters.portfolios != undefined){
			portfolios = parameters.portfolios;
		}

		stockRowElements = $(".stock-row");
		portfolioRowElements = $(".portfolio-row");

		// Add stock/portfolio handlers
		$("#stockSubmit").unbind();
		$("#stockSubmit").on("click", function(){
			var ticker = $("#tickerInput").val();
			
			var source = $("#stock-template").html();
			var template = Handlebars.compile(source);
			var context = {ticker: ticker}
			var html = template(context);
			$("#stocksList").prepend(html);

			stockRowElements = $(".stock-row");
			console.log($(stockRowElements[0]));
			drawChartFromTicker(ticker, $(stockRowElements[0]));
			
			
			stocks.push({ticker: ticker});
			$.ajax({
				url: "/addStock",
				type: "POST",
				data: {
					ticker: ticker
				},
				success: function(data){
					location.reload();
				}
			});
			
		});

		// Initialize Jquery-UI's sortable on each list
		$("#stocksList").sortable({
			appendTo: document.body,
			update: function(event, ui) {
				var newOrder = $("#stocksList").sortable('toArray');
				// Update the data representations
				stocks = _.map(newOrder, function(ticker){
					return {ticker: ticker}
				});
				// Update the ui element representations
				stockRowElements = $(".stock-row");
				// Update database via ajax
				
			}
		});

		// Make YQL request per stock row
		for(var i=0; i<stockRowElements.length; i++){
			(function(i, stocks, stockRowElements){
				var stockRowElement = $(stockRowElements[i]);
				var stock = stocks[i];
				var ticker = stock.ticker;
				drawChartFromTicker(ticker, stockRowElement);
				stockRowElement.find(".delete").on("click", function(){
					$.ajax({
						url: "/deleteStock",
						type: "POST",
						data: {
							ticker: ticker
						},
						success: function(data){
							location.reload();
						}
					});
				});
			})(i, stocks, stockRowElements);
		}

	};

	return {
		init: init
	};

})();



