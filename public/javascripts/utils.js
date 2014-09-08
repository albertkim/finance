var drawChartFromTicker = function(ticker, row){

	var chartElement = row.find(".chart");
	var summaryElement = row.find(".summary");
	var newsElement = row.find(".news");

  // var url = "http://query.yahooapis.com/v1/public/yql?q=";
  
  var currentDate = new Date();
  var currentDateString = currentDate.getFullYear() + "-" + ("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" + "0" + currentDate.getDate();
  var previousDate = new Date();;
  var previousDate = new Date(previousDate.setMonth(currentDate.getMonth() - 3));
  var previousDateString = previousDate.getFullYear() + "-" + ("0" + (previousDate.getMonth() + 1)).slice(-2) + "-" + "0" + previousDate.getDate();
  
  /*
  // Previous query from yahoo finance
  var query = 'select * from yahoo.finance.historicaldata where symbol = "' 
          + ticker 
          + '" and startDate = "' 
          + date6MonthsAgoString
          + '" and endDate = "' 
          + currentDateString
          + '"';
  query = query + "&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
  */

  var url = "http://www.quandl.com/api/v1/datasets/WIKI/" + ticker + ".json";
  var params = "?&trim_start=" + previousDateString + "&trim_end=" + currentDateString;
  var auth = "&auth_token=sok7xuv8xDR_9LooZmaZ";

  $.ajax({
    url: url + params + auth,
    dataType: "json",
    success: function(data){
    	drawChartWithData(chartElement, data);
    	drawSummary(summaryElement, data);
    	drawNews(newsElement, ticker);
    }
  });
};

/* Quandl API notes:
	The 'data' property of the returned data contains the price data for each day
	Each datapoint is an array (it should be an object, but such is life), with each index holding a piece of price data as follows:
	0: Date string
	1: Open price
	2: High price
	3: Low price
	4: Close price
*/

var drawChartWithData = function(selector, data){

	$.extend(Chart.defaults.global, {
		scaleShowGridLines : false,
		animation : false
	});
	
	// Resize the canvas
	var parentWidth = selector.parent().width()/1.5;
	parentWidthString = parentWidth.toString() + "px";
	selector.attr("width", parentWidthString);

  // Parse data to work with charts
  var results = data.data;
  // Data gets returned in reverse for some reason
  results = results.reverse();
  
  var prevMonth = 0;
  dateList = _.map(results, function(item, key, list){
    var splitDate = item[0].toString().split("-");
    if((prevMonth !== splitDate[1]) && key !== 0){
      prevMonth = splitDate[1];
      var dateString = item[0];
      var dateStringParts = dateString.split("-");
      var monthString = dateStringParts[1];
      return monthString;
    } else {
      prevMonth = splitDate[1];
      return "";
    }
  });
  parsedList = _.map(results, function(item){
    return item[4];
  });
  
  // Set up canvas
  Chart.defaults.global.showTooltips = false;
  var ctx = selector.get(0).getContext("2d");
  var myNewChart = new Chart(ctx);
  var data = {
    labels: dateList,
    datasets: [{
        fillColor: "rgba(151,187,205,0.2)",
        pointStrokeColor: "#fff",
        data: parsedList
    }]
  };
  var options = null;
  var myLineChart = new Chart(ctx).Line(data, options);

};

var drawSummary = function(selector, data){

	// Get most recent datapoint
	var recentData = data.data[data.data.length-1];

	var closePrice = recentData[4];
	var changePrice = Number(recentData[4]) - Number(recentData[1]);
	changePrice = changePrice.toFixed(2);

	selector.append("<strong style='font-size: 200%'>" + closePrice + "</strong>");
	selector.append($("<br>"));
	if(changePrice == 0){
		selector.append("<strong style='font-size: 200%; color: black'>" + changePrice + "</strong>");
	}	else if(changePrice < 0){
		selector.append("<strong style='font-size: 200%; color: #CC0000'>" + changePrice + "</strong>");
	} else{
		selector.append("<strong style='font-size: 200%; color: #00CC00'>" + changePrice + "</strong>");
	}

};

var drawNews = function(selector, ticker){
	// Get news from the Yahoo Finance news API
	$.ajax({
		url: "/getNews",
		type: "POST",
		dataType: 'json',
		data: {
			ticker: ticker
		},
		success: function(data){
			console.log(data);
		}
	});
};