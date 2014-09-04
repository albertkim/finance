var index = (function(){

	var stocks;
	var stockRowElements;

	var init = function(parameters){
		console.log(parameters);
		if(parameters.stocks != undefined){
			stocks = parameters.stocks
			renderStocks();
		}

		stockRowElements = $("stock-row");

		// Make YQL request per stock row
		for(var i=0; i<stockRowElements.length; i++){
			
		}

	};


	return {
		init: init
	};

})();