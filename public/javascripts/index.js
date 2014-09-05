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
				var stock = stocks[i];
				var ticker = stock.ticker;
				var chartElement = $(stockRowElements[i]).find(".chart");
				var summaryElement = $(stockRowElements[i]).find(".summary");

		    var url = "http://query.yahooapis.com/v1/public/yql?q=";
		    
		    var currentDate = new Date();
		    var currentDateString = currentDate.getFullYear() + "-" + ("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" + "0" + currentDate.getDay();
		    var date6MonthsAgo = new Date();;
		    var date6MonthsAgo = new Date(date6MonthsAgo.setMonth(currentDate.getMonth() - 6));
		    var date6MonthsAgoString = date6MonthsAgo.getFullYear() + "-" + ("0" + (date6MonthsAgo.getMonth() + 1)).slice(-2) + "-" + "0" + date6MonthsAgo.getDay();
		    
		    var query = 'select * from yahoo.finance.historicaldata where symbol = "' 
		            + ticker 
		            + '" and startDate = "' 
		            + date6MonthsAgoString
		            + '" and endDate = "' 
		            + currentDateString
		            + '"';
		    query = query + "&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";

		    $.ajax({
		      url: url + query,
		      dataType: "json",
		      success: function(data){
		      	drawChart(chartElement, data);
		      	drawSummary(summaryElement, data);
		      }
		    });
			})(i, stocks, stockRowElements);
			
		}

	};

	return {
		init: init
	};

})();



