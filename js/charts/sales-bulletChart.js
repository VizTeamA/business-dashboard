var saleBulletChart = dc.bulletChart("#chart-top .sales-chart");

var dataExample = [
  {"title":"2012","subtitle":"","ranges":[150,225,300],"measures":[220,270],"markers":[250]},
  {"title":"2013","subtitle":"","ranges":[150,225,300],"measures":[220,230],"markers":[240]},
  {"title":"2014","subtitle":"","ranges":[150,225,300],"measures":[210,230],"markers":[260]},
  {"title":"2015","subtitle":"","ranges":[150,225,300],"measures":[200,210],"markers":[230]},
  {"title":"2016","subtitle":"","ranges":[150,225,300],"measures":[220,260],"markers":[290]},
];

var ndx        = crossfilter(dataExample),
    titleDimension = ndx.dimension(function(d) {return d.title;}),
    statusGroup    = {
      all: function(){
        return dataExample;
    }};


// dims from Jason Davies's bl.ock, http://bl.ocks.org/jasondavies/5452290
var chartWidth = 80;
var chartHeight = 250;
var chartMargin = 30;
saleBulletChart
  .width(chartWidth)
  .height(chartHeight)
  .bulletMargin({top: 5, right: 5, bottom: 50, left: chartMargin})
  .bulletWidth(chartWidth - 2*chartMargin)
  .bulletHeight(chartHeight - 5 - 50)
  .orient("bottom")
  .dimension(titleDimension)
  .group(statusGroup);

  saleBulletChart.render();
  saleBulletChart.selectAll("g").on('click', function(d) {
    updateData(d.title);
  });
