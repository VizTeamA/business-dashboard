var inputSaleTrans = 'data/tables/SALES_TRANS.csv';
var groupname = "marker-select";
var xf;
var yearDim;
function updateData(data) {
  console.log("data selected: "+data);
  yearDim.filterAll();
  yearDim.filter(data);
  dc.renderAll(groupname);
};

//Draw Bar Chart Product Sales
d3.csv(inputSaleTrans, function(data) {
  xf = crossfilter(data);
  yearDim = xf.dimension(function(d) { return d["Year"]; });
  drawProductBarChart(xf);
});
