var margin = {top: 5, right: 5, bottom: 50, left: 30},
    width = 80 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

var saleBulletChart = d3.bullet()
    .orient("bottom")
    .width(width)
    .height(height);

<!-- Data input -->
var dataExample = [
  {"title":"2012","subtitle":"","ranges":[150,225,300],"measures":[220,270],"markers":[250]},
  {"title":"2013","subtitle":"","ranges":[150,225,300],"measures":[220,230],"markers":[240]},
  {"title":"2014","subtitle":"","ranges":[150,225,300],"measures":[210,230],"markers":[260]},
  {"title":"2015","subtitle":"","ranges":[150,225,300],"measures":[200,210],"markers":[230]},
  {"title":"2016","subtitle":"","ranges":[150,225,300],"measures":[220,260],"markers":[290]},
];

var datacf       	= crossfilter(dataExample),
    titleDimension 	= datacf.dimension(function(d) {return d.title;}),
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
    updateProductChart(d.title);
  })
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .call(saleBulletChart);

var title = salesYearBulletChart.append("g")
  .style("text-anchor", "end")
  .attr("transform", "translate(" + width + "," + (height + 20) + ")");

title.append("text")
  .attr("class", "title")
  .text(function(d) { return d.title; })
  .on("click", function(d) {
	alert(d.title);
  });

title.append("text")
  .attr("class", "subtitle")
  .attr("dy", "1em")
  .text(function(d) { return d.subtitle; });
