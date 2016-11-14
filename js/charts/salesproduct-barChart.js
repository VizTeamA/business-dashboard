var inputSaleTrans = 'data/tables/SALES_TRANS.csv';

//var xfs;
//var yearDim;
function updateData(data) {
  var groupname = "marker-select";
  yearDim.filterAll();
  yearDim.filter(data);
  dc.renderAll(groupname);
};

//Draw Bar Chart Product Sales
d3.csv(inputSaleTrans, function(data) {
  var groupname = "marker-select";
  var productChart = dc.rowChart("#chart-top .sales-product-chart", groupname);
  xfs = crossfilter(data);
  yearDim = xfs.dimension(function(d) { return d["Year"]; });
  drawProductBarChart(xfs,productChart);
});


function drawProductBarChart(xfData,productChart) {
  var groupname = "marker-select";
  var productCol = 'Product_Grp';
  var saleCol = 'Sales';
  var yearCol = 'Year';

  var products = xfData.dimension(function(d) {return d[productCol]});
  var productSales = products.group().reduceSum( function(d) {return d[saleCol]});

 // var productChart = dc.rowChart("#chart-top .sales-product-chart", groupname);
  productChart
    .dimension(products)
    .group(productSales)
    .width(500)
    .xAxis().ticks(5);

  dc.renderAll(groupname);

  function AddXAxisTitle(chartToUpdate, displayText, offsetY) {
    chartToUpdate.svg()
                .append("text")
                .attr("class", "x-axis-label")
                .attr("text-anchor", "middle")
                .attr("x", chartToUpdate.width()-25)
                .attr("y", chartToUpdate.height()+offsetY)
                .text(displayText)
                .style("font-size","10px");
  }
  AddXAxis(AddXAxisTitle, "Sale ($)", -5);
}
