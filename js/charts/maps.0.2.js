
/*     Markers      */

//Input files - global vars load in Charts.js
//var inputFile1 = 'data/hotelsg.csv';
//var inputFileDemo = "demo1.tsv";
//var groupname = "marker-select2";
//var inputFile2 = 'data/tables/hotelsg-sales.csv';
//var inputSaleTrans = 'data/tables/SALES_TRANS.csv';
//var productChart = dc.rowChart("#chart-top .product", groupname);

d3.csv(inputFile2, function(data) {
  drawMapChart(data);
});


d3.csv(inputSaleTrans, function(data) {
  xfProductSaleData = crossfilter(data);
  drawProductBarChart(xfProductSaleData, productChart);
});



function drawMapChart(data) {
	var xf = crossfilter(data);
	var groupname = "marker-select";
	var facilities = xf.dimension(function(d) { return d.geo; });
	var facilitiesGroup = facilities.group().reduceCount();
	var mapChart =  dc.leafletMarkerChart("#chart-map .map",groupname)
		  .dimension(facilities)
		  .group(facilitiesGroup)
		  .width(800)
			.height(1400)
		  .center([1.35,103.8198])
		  .zoom(12)
		  .cluster(true);
	dc.renderAll(groupname);
}

function drawProductBarChart(xfProductSaleData, productChart) {
	var groupname = "marker-select2";
	var productCol = 'Product_Grp';
	var saleCol = 'Sales';
	var yearCol = 'Year';

	var products = xfProductSaleData.dimension(function(d) {return d[productCol]});
	var productSales = products.group().reduceSum( function(d) {return d[saleCol]});


	productChart
		.dimension(products)
		.group(productSales)
		.width(500)
    .elasticX(true)
		.xAxis().ticks(5);
	dc.renderAll(groupname);

	function AddXAxis(chartToUpdate, displayText, offsetY) {
	chartToUpdate.svg()
				.append("text")
				.attr("class", "x-axis-label")
				.attr("text-anchor", "middle")
				.attr("x", chartToUpdate.width()-25)
				.attr("y", chartToUpdate.height()+offsetY)
				.text(displayText)
				.style("font-size","10px");
	}
	AddXAxis(productChart, "Sale ($)", -5);
}

function updateProductChart(year) {
  var yearDim = xfProductSaleData.dimension(function(d) {return d["Year"]});
  yearDim.filter(year);
  drawProductBarChart(xfProductSaleData, productChart);
  yearDim.filterAll();
}
