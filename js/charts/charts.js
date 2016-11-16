
/*     Markers      */
var groupname = "marker-select2";
var inputFile1 = 'data/hotelsg.csv';
var inputFile2 = 'data/hotelsg-sales.csv';
var inputFileDemo = "demo1.tsv";
var inputSaleTrans = 'data/tables/SALES_TRANS.csv';
var productChart = dc.rowChart("#chart-top .product", groupname);
var saleBulletChart = d3.bullet();

//Create UI
createUI()


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

//Select All radio buttons that used for Market Sector Selection
//var radios = document.forms["market-sector"].elements["marketSector"];
d3.selectAll("market-sector").on("click", function() {
	bulletChartSvg.datum(randomize).transition().duration(1000).call(saleBulletChart);
}); 
/*
for(radio in radios) {
	alert("hallo");
    radio.onclick = function() {
        alert("hallo");
        //toggleOptionPannel();
    }
}
*/
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
		.on("click",function(d) {console.log("Pressed");  })
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

	//var saleBulletChart = d3.bullet()
	saleBulletChart
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

	  bulletChartSvg = d3.select("#chart-top .sales-year-chart").selectAll("svg")
		.data(data)
	  .enter().append("svg")
		.attr("class", "bullet")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.on("click", function(d) {
			updateProductChart(d.Year);
			updateNumbers(d.Year);
		})
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.call(saleBulletChart);

	  var title = bulletChartSvg.append("g")
		.style("text-anchor", "end")
		.attr("transform", "translate(" + width + "," + (height + 20) + ")");

	  title.append("text")
		.attr("class", "title")
		.text(function(d) { return d.Year; })
		.on("click", function(d) {
		alert(d.title);
		});

	  d3.selectAll("button").on("click", function() {
		bulletChartSvg.datum(randomize).transition().duration(1000).call(saleBulletChart);
	  });

	});
}

function randomize(d) {
  if (!d.randomizer) d.randomizer = randomizer(d);
  d.ranges = d.ranges.map(d.randomizer);
  d.markers = d.markers.map(d.randomizer);
  d.measures = d.measures.map(d.randomizer);
  return d;
}

function randomizer(d) {
  var k = d3.max(d.ranges) * .2;
  return function(d) {
    return Math.max(0, d + k * (Math.random() - .5));
  };
}


 function updateNumbers(d) {
   var o = d3.selectAll("#opportunity .value");
   var c = d3.selectAll("#coverage .value");
   var s = d3.selectAll("#status-graph .value");

   o.text(d*5-5230);
   c.text(d/50 + "%");
   s.text("pies("+d+")");
 }

// activeObjectName is "hospitality" or else (residential)
 function toggleOptionPannel() {
   //var containerObjectName = "filter-market-sector";
   var selectedObjectName = d3.select('input[name="marketSector"]:checked').node().value;
   var containerHospitality = d3.selectAll("#hospitality-filter-market-sector");
   var containerResidential = d3.selectAll("#residential-filter-market-sector");
   if (activeObjectName="hospitality") {
     containerHospitality.style("visibility",visibility);
     containerResidential.style("visibility",hidden);
   } else {
     containerHospitality.style("visibility",hidden);
     containerResidential.style("visibility",visibility);
   }

 }

 
 //function to load UI 
 function createUI() {
 var shapeData = ["Hospitality", "Residential"], 
  selectedId = 0;  // Choose the rectangle as default

// Create the shape selectors
var form = d3.select("#market-sector").append("form");		
var labelEnter = form.selectAll("label")
    .data(shapeData)
    .enter().append("label");
labelEnter.append("input")
    .attr({
        type: "radio",
        class: "shape",
        name: "mode",
        value: function(d, i) {return i;}
    })
    .property("checked", function(d, i) { 
        return (i===selectedId); 
    })
	;
labelEnter.append("label").text(function(d) {return d;});
labelEnter.append("br");
					
	;
}