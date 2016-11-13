
function drawProductBarChart(xfData) {
  var productCol = 'Product_Grp';
  var saleCol = 'Sales';
  var yearCol = 'Year';

  var products = xfData.dimension(function(d) {return d[productCol]});
  var productSales = products.group().reduceSum( function(d) {return d[saleCol]});

  var productChart = dc.rowChart("#chart-top .sales-product-chart", groupname);
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
