/****************************************** GLOBAL VARS *****************************************
* Global Variable Declarations
* Avoid using Global Vars as much as we can ok.
*************************************************************************************************/
/*     Markers      */
var groupname = "marker-select2";
var inputFile2 = 'data/tables/hotelsg-sales.csv';
var inputSaleTrans = 'data/tables/SALES_TRANS_v1.0.csv';
var productChart = dc.rowChart("#sales-product-chart", groupname);
var saleBulletChart = d3.bullet();


var yearDim;

/****************************************** GLOBAL VARS *****************************************
* Main ()
* As a controller to call other function() to load UI, add charts and Interaction
*************************************************************************************************/

//Create UI
createUI()


d3.csv(inputSaleTrans, function(data) {
	// Since its a csv file we need to format the data a bit.
    var dateFormat = d3.time.format('%Y%b%d');
    //var numberFormat = d3.format('.2f');
    data.forEach(function (d) {
		dumbDate = 01;
        d.dateFull = dateFormat.parse(d.Year+ d.Month +dumbDate);
        d.monthFmt = d3.time.month(d.dateFull); // pre-calculate month for better performance
        d.yearFmt = d3.time.year(d.dateFull); // pre-calculate year for better performance
        //d.close = +d.close; // coerce to number
       // d.open = +d.open;
    });
  xfProductSaleData = crossfilter(data);

  drawProductBarChart(xfProductSaleData);
  drawSaleBulletChart(xfProductSaleData);
  drawYearPerformanceBarChart(xfProductSaleData);
  d3.csv(inputFile2, function(data) {
    drawMapChart(data);
  });
});

//Select All radio buttons that used for Market Sector Selection
//var radios = document.forms["market-sector"].elements["marketSector"];
d3.selectAll("market-sector").on("click", function() {
	bulletChartSvg.datum(randomize).transition().duration(1000).call(saleBulletChart);
});

drawEarningByYearPieChart();
drawGainLossPieChart();

/****************************************** CHARTS *****************************************
* Draw charts
*
*******************************************************************************************/

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
	yearDim = xfProductSaleData.dimension(function(d) {return d[yearCol]});

	productChart
		.dimension(products)
		.group(productSales)
		.on("click",function(d) {console.log("Pressed");  })
		.width(300)
    .height(220)
		.elasticX(true)
		//.controlsUseVisibility(true)
		.xAxis().ticks(3)
		;
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
	  height = 180 - margin.top - margin.bottom;

	//var saleBulletChart = d3.bullet()
	saleBulletChart
	  .orient("bottom")
	  .width(width)
	  .height(height);


    var targetDataJson = [
		{"Year":"2016","ranges":[150,225,300],"measures":[220,270],"markers":[250]},
		{"Year":"2015","ranges":[150,225,300],"measures":[220,230],"markers":[240]},
		{"Year":"2014","ranges":[150,225,300],"measures":[210,230],"markers":[260]},
		{"Year":"2013","ranges":[150,225,300],"measures":[200,210],"markers":[230]},
		{"Year":"2012","ranges":[150,225,300],"measures":[220,260],"markers":[290]},
	  ];

	  var datacf       	= crossfilter(targetDataJson),
		  titleDimension 	= datacf.dimension(function(d) {return d.Year;}),
		  statusGroup    	= {
			all: function(){
			  return dataExample;
		  }};

	  data = titleDimension.bottom(Infinity);

	  bulletChartSvg = d3.select("#sales-year-chart").selectAll("svg")
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

	  d3.selectAll("#button-control button#rand-bullet-chart").on("click", function() {
		bulletChartSvg.datum(randomize).transition().duration(1000).call(saleBulletChart);
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
   //var s = d3.selectAll("#status-graph .value");

   o.text(d*5-5230);
   c.text(d/50 + "%");
   //s.text("pies("+d+")");
}

function drawEarningByYearPieChart() {
	var gainLossFile = "data/tables/GAIN_LOSS.csv";
	var chart = dc.pieChart("#earning-by-year-chart");
	d3.csv(gainLossFile, function(error, experiments) {
	  var ndx           = crossfilter(experiments);
	  var typeDimension  = ndx.dimension(function(d) {return d.Type ;})
	  var yearDimension  = ndx.dimension(function(d) {return d.Year ;})
	  var amountSumGroup = yearDimension
							.group()
							.reduceSum(function(d) {
								if (d.Type =="gain") {
									return d.Amount;
								} else if (d.Type =="loss") {
									return -d.Amount;
								} else {
									return 0;
								}
								});
	  chart
		  .width(100)
		  .height(100)
		  //.slicesCap(4)
		  .innerRadius(10)
		  .dimension(yearDimension)
		  .group(amountSumGroup)
		  .legend(dc.legend());
	   chart.on('pretransition', function(chart) {
		  chart.selectAll('.dc-legend-item text')
			  .text('')
			.append('tspan')
			  .text(function(d) { return d.name; })
			.append('tspan')
			  .attr('x', 100)
			  .attr('text-anchor', 'end')
			  .text(function(d) { return d.data; });
	  });
	  chart.render();
	});
}

function drawGainLossPieChart() {
	var gainLossFile = "data/tables/GAIN_LOSS.csv";
	var chart = dc.pieChart("#gain-loss-chart");
	d3.csv(gainLossFile, function(error, experiments) {
	  var ndx           = crossfilter(experiments);
	  var typeDimension  = ndx.dimension(function(d) {return d.Type ;})
	  var amountSumGroup = typeDimension
							.group()
							.reduceSum(function(d) { return d.Amount});
	  chart
		  .width(100)
		  .height(100)
		  .slicesCap(2)
		  .innerRadius(0)
		  .dimension(typeDimension)
		  .group(amountSumGroup)
		  .legend(dc.legend());
	   chart.on('pretransition', function(chart) {
		  chart.selectAll('.dc-legend-item text')
			  .text('')
			.append('tspan')
			  .text(function(d) { return d.name; })
			.append('tspan')
			  .attr('x', 100)
			  .attr('text-anchor', 'end')
			  .text(function(d) { return d.data; });
	  });
	  chart.render();
	});
}

function drawYearPerformanceBarChart(xfProductSaleData) {

	var productCol = 'Product_Grp';
	var saleCol = 'Sales';
	var yearCol = 'Year';
	var monthCol = 'Month';

	products = xfProductSaleData.dimension(function(d) {return d[productCol]});
	yearFmtDim = xfProductSaleData.dimension(function(d) {return d.yearFmt});
	monthFmtDim = xfProductSaleData.dimension(function(d) {return d.monthFmt});
	dateMonthYearFmtDim = xfProductSaleData.dimension(function(d) {return d.dateFull});
	productSalesByMonth = monthFmtDim.group().reduceSum( function(d) {return d[saleCol]});
	productSalesByYear = yearFmtDim.group().reduceSum( function(d) {return d[saleCol]});

	var chart = dc.barChart('#year-performance-chart',groupname);

	var strmDateAccessor = function (d){return d.dateFull;};
	strmDateExtent = [];
	strmDateExtent = d3.extent(products.top(Infinity), strmDateAccessor);
	minDate = strmDateExtent[0];
	maxDate = strmDateExtent[1];

	chart
		 .height(250)
		 .width(700)
        .margins({top: 0, right: 50, bottom: 60, left: 60})
        .dimension(monthFmtDim)
        .group(productSalesByMonth)
        .centerBar(true)
        .gap(1)
        //.x(d3.time.scale().domain([new Date(2015, 0, 1), new Date(2016, 12, 31)]))
        .x(d3.time.scale().domain([minDate,maxDate]))
		.elasticY(true)
		.elasticX(true)
        .round(d3.time.month.round)
        .xUnits(d3.time.months);
	 chart.renderlet(function (chart) {
	   // rotate x-axis labels
	   chart.selectAll('g.x text')
		 .attr('transform', 'translate(-10,20) rotate(270)');
		 });
	dc.renderAll(groupname);
}

/****************************************** UI *****************************************
* UI SECTION: Options, Class update, Drop list, ratio button, ect...
*
****************************************************************************************/
// activeObjectName is "hospitality" or else (residential)
 function toggleOptionPannel() {
   //var containerObjectName = "filter-market-sector";
   var selectedObjectName = d3.select('input[name='+'marketSector'+']:checked').node().value;
   var containerHospitality = d3.selectAll("#hospitality-filter-market-sector");
   var containerResidential = d3.selectAll("#residential-filter-market-sector");
   if (selectedObjectName=="Hospitality") {
     containerHospitality.attr("class","content-pannel-visible");
     containerResidential.attr("class","content-pannel-hidden");
     //console.log("visibile containerHospitality");
   } else {
     containerHospitality.attr("class","content-pannel-hidden");
     containerResidential.attr("class","content-pannel-visible");
     //console.log("visibile containerResidential");
   }

 }


 //function to load UI
 function createUI() {
  // Add section
  var headerNames = [ "#overview-header", "#detail-analysis-header",  "#sales-by-product-header"];
  var toggleSections = [ "div#overview",      "#detail-analysis",         "#sales-by-product"];
  var classNameVisible = "section";
  var classNameHide = "section-hide";

  for (i=0; i<headerNames.length; i++ ) {
    headerName = headerNames[i];
    toggleSection = toggleSections[i];
    console.log(headerName + "***" +  toggleSection);

    d3.selectAll(headerName)
      .append("b")
      .text(" [+] ")
      .on("click", function() {
          d3.selectAll(toggleSection).attr("class",classNameVisible);
          console.log("+" + toggleSection + ">>" + classNameVisible);
      });
    d3.selectAll(headerName)
      .append("b")
      .text(" [-] ")
      .on("click", function() {
          d3.selectAll(toggleSection).attr("class",classNameHide);
          console.log("-" + toggleSection + ">>" + classNameHide);
      });
    // Add reset Button
    d3.selectAll("#button-control button#reset-chart").on("click", function() {
      yearDim.filter(null);
      dc.renderAll(groupname);
    });
  }





	// Options for Market Sector
	var shapeData = ["Hospitality", "Residential"],
	  selectedId = "Hospitality";  // Choose the rectangle as default

	// Create the shape selectors
	var formMarketSector = d3.select("#market-sector").append("form");
	var labelEnter = formMarketSector.selectAll("label")
		.data(shapeData)
		.enter().append("label");
	labelEnter.append("input")
		.attr({
			type: "radio",
			class: "shape",
			name: "marketSector",
			value: function(d, i) {return d;}
		})
		.property("checked", function(d) {
			return (d===selectedId);
		})
		.on("click",function(d){
		  //console.log("hey click"+ d);
		  toggleOptionPannel();
		})
		;
	labelEnter.append("label").text(function(d) {return d;});
	labelEnter.append("br");
	toggleOptionPannel();

	var listRollingPeriod = ["Quarter","Year","2 Years"];
	var dropDownRollingPeriod = d3.select("#rolling-period-filter").append("select")
						.attr("name", "country-list");
	var optionsRollingPeriod = dropDownRollingPeriod.selectAll("option")
			   .data(listRollingPeriod)
			 .enter()
			   .append("option");
	optionsRollingPeriod.text(function (d) {
								return d; })
		   .attr("value", function (d) { return d; });
	dropDownRollingPeriod.on("change",dropDownRollingPeriodChanged);

	//Option for rolling period
	function dropDownRollingPeriodChanged() {
		var selectedValue = d3.event.target.value;
		console.log("dropDownRollingPeriodChanged" + "option selected = " + selectedValue);
	}
}
