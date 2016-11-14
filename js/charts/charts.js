
/*     Markers      */
var groupname = "marker-select2";
var inputFile1 = 'data/hotelsg.csv';
var inputFile2 = 'data/hotelsg-sales.csv';
var inputFileDemo = "demo1.tsv";
var inputSaleTrans = 'data/tables/SALES_TRANS.csv';
var productChart = dc.rowChart("#chart-top .product", groupname);

<!-- Data input -->
var targetDataJson = [
  {"Year":"2012","ranges":[150,225,300],"measures":[220,270],"markers":[250]},
  {"Year":"2013","ranges":[150,225,300],"measures":[220,230],"markers":[240]},
  {"Year":"2014","ranges":[150,225,300],"measures":[210,230],"markers":[260]},
  {"Year":"2015","ranges":[150,225,300],"measures":[200,210],"markers":[230]},
  {"Year":"2016","ranges":[150,225,300],"measures":[220,260],"markers":[290]},
];

d3.csv(inputSaleTrans, function(data) {
  xfProductSaleData = crossfilter(data);
  drawProductBarChart(xfProductSaleData);
  drawSaleBulletChart(xfProductSaleData);

  d3.csv(inputFile2, function(data) {
    drawMapChart(data);
  });

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


function drawProductBarChart(xfProductSaleData) {
	var productCol = 'Product_Grp';
	var saleCol = 'Sales';
	var yearCol = 'Year';

	 products = xfProductSaleData.dimension(function(d) {return d[productCol]});
	 productSales = products.group().reduceSum( function(d) {return d[saleCol]});
   yearDim = xfProductSaleData.dimension(function(d) {return d["Year"]});

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
  yearDim.filter(null);
  yearDim.filter(year);
  dc.renderAll(groupname);
}

function drawSaleBulletChart (datacf) {
  var margin = {top: 5, right: 5, bottom: 50, left: 30},
      width = 80 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom;

  var saleBulletChart = d3.bullet()
      .orient("bottom")
      .width(width)
      .height(height);


d3.csv("./data/tables/TARGET.csv", function(data) {
  var targetDataJson = [
    {"Year":"2012","ranges":[150,225,300],"measures":[220,270],"markers":[250]},
    {"Year":"2013","ranges":[150,225,300],"measures":[220,230],"markers":[240]},
    {"Year":"2014","ranges":[150,225,300],"measures":[210,230],"markers":[260]},
    {"Year":"2015","ranges":[150,225,300],"measures":[200,210],"markers":[230]},
    {"Year":"2016","ranges":[150,225,300],"measures":[220,260],"markers":[290]},
  ];

  var datacf       	= crossfilter(targetDataJson),
      titleDimension 	= datacf.dimension(function(d) {return d.Year;}),
      statusGroup    	= {
        all: function(){
          return dataExample;
      }};

  data = titleDimension.top(Infinity);

  var salesYearBulletChart = d3.select("#chart-top .sales-year-chart").selectAll("svg")
    .data(data)
  .enter().append("svg")
    .attr("class", "bullet")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .on("click", function(d) {
      updateProductChart(d.Year);
    })
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(saleBulletChart);

  var title = salesYearBulletChart.append("g")
    .style("text-anchor", "end")
    .attr("transform", "translate(" + width + "," + (height + 20) + ")");

  title.append("text")
    .attr("class", "title")
    .text(function(d) { return d.Year; })
    .on("click", function(d) {
  	alert(d.title);
    });
});

}
