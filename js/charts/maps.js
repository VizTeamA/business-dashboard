
/*     Markers      */
var inputFile1 = 'data/hotelsg.csv';
var inputFile2 = 'data/hotelsg-sales.csv';
var inputFile3 = "demo1.tsv";
d3.csv(inputFile2, function(data) {
  drawMarkerSelect(data);
});

function drawMarkerSelect(data) {
  var xf = crossfilter(data);
  var groupname = "marker-select";
	var facilities = xf.dimension(function(d) { return d.geo; });
	var facilitiesGroup = facilities.group().reduceCount();

  dc.leafletMarkerChart("#chart-map .map",groupname)
      .dimension(facilities)
      .group(facilitiesGroup)
      .width(800)
	    .height(1400)
      .center([1.35,103.8198])
      .zoom(12)
      .cluster(true);  

	var types = xf.dimension(function(d) { return d.type; });
	var typesGroup = types.group().reduceCount();

  dc.pieChart("#chart-detail .pie",groupname)
      .dimension(types)
      .group(typesGroup)
      .width(200)
	    .height(200)
	    .renderLabel(true)
	    .renderTitle(true)
      .ordering(function (p) {
        return -p.value;
      });

	  
	var products = xf.dimension(function(d) {return d["Product"]});
	var productSales = products.group().reduceSum( function(d) {return d["Sales"]});
	var productChart = dc.rowChart("#chart-top .product", groupname);
	productChart
		.dimension(products)
		.group(productSales)
		.width(500)
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


