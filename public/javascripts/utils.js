var drawChart = function(selector, data){

	$.extend(Chart.defaults.global, {
		scaleShowGridLines : false,
		animation : false
	});
	
	// Resize the canvas
	var parentWidth = selector.parent().width()/1.5;
	parentWidthString = parentWidth.toString() + "px";
	selector.attr("width", parentWidthString);

  // Parse data to work with charts
  var results = data.query.results.quote;
  // Data gets returned in reverse for some reason
  results = results.reverse();
  
  var prevMonth = 0;
  dateList = _.map(results, function(item, key, list){
    var splitDate = item.Date.toString().split("-");
    if((prevMonth !== splitDate[1]) && key !== 0){
      prevMonth = splitDate[1];
      var dateString = item.Date;
      var dateStringParts = dateString.split("-");
      var monthString = dateStringParts[1];
      return monthString;
    } else {
      prevMonth = splitDate[1];
      return "";
    }
  });
  parsedList = _.map(results, function(item){
    return item.Close;
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
	var recentData = data.query.results.quote[data.query.results.quote.length-1];

	var closePrice = recentData.Adj_Close;
	var changePrice = Number(recentData.Adj_Close) - Number(recentData.Open);
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