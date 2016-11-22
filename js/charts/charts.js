/****************************************** GLOBAL VARS *****************************************
* Global Variable Declarations
* Avoid using Global Vars as much as we can ok.
*************************************************************************************************/
/*     Markers      */
var groupname = "marker-select2";
var inputFile2 = 'data/tables/hotelsg-sales.csv';
var inputSaleTrans = 'data/tables/SALES_TRANS_v2.0.csv';
var yearSaleBulletChart = d3.bullet();
var productSaleChart = dc.rowChart("#sales-product-chart", groupname);
var monthlyPerformanceChart = dc.barChart('#monthly-performance-chart', groupname);
var hotelQuadBubbleChart = dc.bubbleChart('#quadratic-bubble-chart', groupname);
// var saleSizeFilterBarChart = dc.barChart('#sale-size-filter-bar-chart', groupname);
//var mapChart = dc.leafletMarkerChart("#chart-map .map", groupname);

var yearDim;

var productCol = 'Product';
var saleCol = 'Sales';
var yearCol = 'Year';
var monthCol = 'Month';
var sectorCol = 'Sector';
var saleCodeCol = 'Sale_Code';
var propertyCol = 'Property';


numberFormat = d3.format('.2f');

/****************************************** MAIN ************************************************
* Main ()
* As a controller to call other function() to load UI, add charts and Interaction
*************************************************************************************************/

//Create UI
createUI()

d3.csv(inputSaleTrans, function(data) {
    // Since its a csv file we need to format the data a bit.
    var dateFormat = d3.time.format('%Y%b%d');
    data.forEach(function(d) {
        dumbDate = 01;
        d.dateFull = dateFormat.parse(d.Year + d.Month + dumbDate);
        d.monthFmt = d3.time.month(d.dateFull); // pre-calculate month for better performance
        d.yearFmt = d3.time.year(d.dateFull); // pre-calculate year for better performance
        d.Sales = numberFormat(d[saleCol]);
        d.propertyNameFmt = d[propertyCol];
    });
    xfProductSaleData = crossfilter(data);
    // Set up dinmensions and groups that commonly used
    yearDim = xfProductSaleData.dimension(function(d) {
        return d[yearCol]
    });
    monthDim = xfProductSaleData.dimension(function(d) {
        return d[monthCol]
    });
    productDim = xfProductSaleData.dimension(function(d) {
        return d[productCol]
    });
    sectorDim = xfProductSaleData.dimension(function(d) {
        return d[sectorCol]
    });

    hotelDim = xfProductSaleData.dimension(function (d) {
        return d.propertyNameFmt;
    });

    salesByProductGroup = productDim.group().reduceSum(function(d) {
      //  return d[saleCol]
        return Math.round(d[saleCol]);
    });

    yearFmtDim = xfProductSaleData.dimension(function(d) {
        return d.yearFmt
    });
    monthFmtDim = xfProductSaleData.dimension(function(d) {
        return d.monthFmt
    });
    dateMonthYearFmtDim = xfProductSaleData.dimension(function(d) {
        return d.dateFull
    });
    productSalesByMonth = monthFmtDim.group().reduceSum(function(d) {
        return Math.round(d[saleCol]);
    });
    productSalesByYear = yearFmtDim.group().reduceSum(function(d) {
        //return d[saleCol]
        return numberFormat(d[saleCol]);
    });

    salesByHotel = hotelDim.group().reduce(
            function (p, v) {
                p.Sales += +v["Sales"];
                p.Growth += +v["Growth"];
                return p;
            },
            function (p, v) {
                p.Sales -= +v["Sales"];
                //if (p.Sales < 0.001) p.Sales = 0; // do some clean up
                p.Growth -= +v["Growth"];
                return p;
            },
            function () {
                return {Sales: 0, Growth: 0}
            }
    );


    // Draw all charts
    drawProductBarChart(xfProductSaleData);
    drawYearSaleBulletChart(xfProductSaleData);
    drawMonthlyPerformanceBarChart(xfProductSaleData);
    drawHotelQuadBubbleChart(xfProductSaleData);
    // drawsaleSizeFilterBarChart(xfProductSaleData);
    /*
    d3.csv(inputFile2, function(data) {
        drawMapChart(data);
    });
    */
});

//Select All radio buttons that used for Market Sector Selection
d3.selectAll("market-sector").on("click", function() {
    bulletChartSvg.datum(randomize).transition().duration(1000).call(yearSaleBulletChart);
});

/****************************************** CHARTS *****************************************
* Draw charts
*
*******************************************************************************************/

function drawMapChart(data) {
    var xf = crossfilter(data);
    var groupname = "marker-select";
    var facilities = xf.dimension(function(d) {
        return d.geo;
    });
    var facilitiesGroup = facilities.group().reduceCount();
    mapChart.dimension(facilities).group(facilitiesGroup).width(800).height(1400).center([1.35, 103.8198]).zoom(12).cluster(true);
    mapChart.render();
}

function drawProductBarChart(xfProductSaleData) {
    productSaleChart.dimension(productDim).group(salesByProductGroup).on("click", function(d) {
        console.log("Pressed");
    }).width(300).height(220).elasticX(true)
    //.controlsUseVisibility(true)
        .xAxis().ticks(3);
    productSaleChart.colors(['#0078a8']);
    productSaleChart.render();

    function AddXAxis(chartToUpdate, displayText, offsetY) {
        chartToUpdate.svg().append("text").attr("class", "x-axis-label").attr("text-anchor", "middle").attr("x", chartToUpdate.width() - 25).attr("y", chartToUpdate.height() + offsetY).text(displayText).style("font-size", "10px");
    }
    AddXAxis(productSaleChart, "Sale ($)", -5);
}

function updateChartByYear(year) {
    low = +year;
    high = + year + 1;
    yearDim.filter(null);
    yearDim.filterRange([low, high]);
    dc.redrawAll(groupname);
}

/*
* Reset in different dimension
*/
function resetYear() {
    //Reset css
    d3.selectAll(".measure-active.s0").attr("class", "measure s0");
    d3.selectAll(".measure-active.s1").attr("class", "measure s1");
    //Reset data
    yearDim.filter(null);

    //Reset charts
    dc.redrawAll(groupname);
}

function resetHotel() {
    //Reset css
    d3.selectAll(".measure-active.s0").attr("class", "measure s0");
    d3.selectAll(".measure-active.s1").attr("class", "measure s1");
    //Reset data
    hotelDim.filterAll(groupname);
    //Reset charts
    hotelQuadBubbleChart.redraw(groupname);
    dc.redrawAll(groupname);
}

function resetAll() {
    //Reset css
    d3.selectAll(".measure-active.s0").attr("class", "measure s0");
    d3.selectAll(".measure-active.s1").attr("class", "measure s1");
    //Reset all dimension filters
    yearDim.filter(null);
    dc.filterAll(groupname);
    dc.redrawAll(groupname);
}

function drawYearSaleBulletChart(datacf) {
    var margin = {
            top: 5,
            right: 5,
            bottom: 40,
            left: 40
        },
        width = 80 - margin.left - margin.right,
        height = 180 - margin.top - margin.bottom;

    //var yearSaleBulletChart = d3.bullet()
    yearSaleBulletChart.orient("bottom").width(width).height(height);

    var targetDataJson_old = [
        {
            "Year": "2011",
            "ranges": [
                10000000, 12500000, 15000000
            ],
            "measures": [
                11000000, 15000000
            ],
            "markers": [15000000]
        }, {
            "Year": "2012",
            "ranges": [
                16000000, 18000000, 20000000
            ],
            "measures": [
                18500000, 18500000
            ],
            "markers": [16500000]
        }, {
            "Year": "2013",
            "ranges": [
                16000000, 18000000, 20000000
            ],
            "measures": [
                19150000, 19150000
            ],
            "markers": [18150000]
        }, {
            "Year": "2014",
            "ranges": [
                16000000, 18000000, 20000000
            ],
            "measures": [
                16965000, 19965000
            ],
            "markers": [19965000]
        }, {
            "Year": "2015",
            "ranges": [
                18000000, 21000000, 28000000
            ],
            "measures": [
                25961502, 25961502
            ],
            "markers": [21961502]
        }, {
            "Year": "2016",
            "ranges": [
                20000000, 24000000, 28000000
            ],
            "measures": [
                20157650, 24157650
            ],
            "markers": [24157650]
        }
    ];
    var targetDataJson = [
        {
            "Year": "2011",
            "ranges": [
                10.000000, 12.500000, 30.000000
            ],
            "measures": [
                11.000000, 15.000000
            ],
            "markers": [15.000000]
        }, {
            "Year": "2012",
            "ranges": [
                16.000000, 18.000000, 30.000000
            ],
            "measures": [
                18.500000, 18.500000
            ],
            "markers": [16.500000]
        }, {
            "Year": "2013",
            "ranges": [
                16.000000, 18.000000, 30.000000
            ],
            "measures": [
                19.150000, 19.150000
            ],
            "markers": [18.150000]
        }, {
            "Year": "2014",
            "ranges": [
                16.000000, 18.000000, 30.000000
            ],
            "measures": [
                16.965000, 19.965000
            ],
            "markers": [19.965000]
        }, {
            "Year": "2015",
            "ranges": [
                18.000000, 21.000000, 30.000000
            ],
            "measures": [
                25.961502, 25.961502
            ],
            "markers": [21.961502]
        }, {
            "Year": "2016",
            "ranges": [
                20.000000, 24.000000, 30.000000
            ],
            "measures": [
                20.157650, 24.157650
            ],
            "markers": [24.157650]
        }
    ];

    var datacf = crossfilter(targetDataJson),
        titleDimension = datacf.dimension(function(d) {
            return d.Year;
        }),
        statusGroup = {
            all: function() {
                return dataExample;
            }
        };

    data = titleDimension.bottom(Infinity);
    lastYear = titleDimension.top(1)[0].Year;

    bulletChartSvg = d3.select("#sales-year-chart").selectAll("svg").data(data).enter().append("svg").attr("class", "bullet").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).on("click", function(d) {
        updateChartByYear(d.Year);
        updateNumbers(d.Year);
    }).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").call(yearSaleBulletChart);

    var title = bulletChartSvg.append("g").style("text-anchor", "end").attr("transform", "translate(" + width + "," + (height + 20) + ")");

    title.append("text").attr("class", "title").text(function(d) {
        var retYear;
        if (d.Year == lastYear) {
            retYear = d.Year + " (YTD)";
        } else {
            retYear = d.Year;
        }
        return retYear
    }).on("click", function(d) {
        //alert(d.Year);
    });

    d3.selectAll("#button-control button#rand-bullet-chart").on("click", function() {
        bulletChartSvg.datum(randomize).transition().duration(1000).call(yearSaleBulletChart);
    });
}


function updateBulletChart(yearList) {
    //Reset css
    d3.selectAll(".measure-active.s0").attr("class", "measure s0");
    d3.selectAll(".measure-active.s1").attr("class", "measure s1");
    if (yearList != null) {
      for(i = 0; i < yearList.length; i++){
            selectYear = yearList[i];
            objName_0 = "rect#dimension_y" + selectYear+".measure.s0";
            objName_1 = "rect#dimension_y" + selectYear+".measure.s1";
            //console.log("selectYear=" +selectYear);
            d3.selectAll(objName_0).attr("class","measure-active s0");
            d3.selectAll(objName_1).attr("class","measure-active s1");
      }
    }

}
//function updateRange

/**
* Update on Brushing
*/
var beg=0;
var end=0;
function updateOnBrush(low, high) {
  if (beg=="") {
    beg = low;
    end = high;
  } else if (low == beg && high == end ) {
    return;
  } else {
    //updateBulletChart
     var yearList = [];
     l = +low;
     h = +high;
     for (i=l-1; i++; i<=h) {
       if (i>h) {break};
       yearList.push(i);
     }
     updateBulletChart(yearList);
  }
}

function updateNumbers(d) {
    var o = d3.selectAll("#opportunity .value");
    var c = d3.selectAll("#coverage .value");
    //var s = d3.selectAll("#status-graph .value");

    o.text(d * 5 - 5230);
    c.text(d / 50 + "%");
    //s.text("pies("+d+")");
}

function drawMonthlyPerformanceBarChart(xfProductSaleData) {
    var strmDateAccessor = function(d) {
        return d.dateFull;
    };
    strmDateExtent = [];
    strmDateExtent = d3.extent(productDim.top(Infinity), strmDateAccessor);
    minDate = strmDateExtent[0];
    maxDate = strmDateExtent[1];

    monthlyPerformanceChart.height(150).width(550).margins({top: 0, right: 50, bottom: 60, left: 60}).dimension(monthFmtDim).group(productSalesByMonth)
    monthlyPerformanceChart.centerBar(true)
        .x(d3.time.scale().domain([minDate, maxDate])).elasticY(true).elasticX(true).xUnits(d3.time.months);
    monthlyPerformanceChart.yAxis().tickFormat(function (s) {
        return s/1000 + "k$";
    }).ticks(3);
    monthlyPerformanceChart.colors(['#0078a8']);
    monthlyPerformanceChart.on("filtered", function(){
      updateBulletChart(null);
      if (yearDim.top(Infinity).length!=0) {
        var highYear = +yearDim.top(1)[0].Year;
        var lowYear = +yearDim.bottom(1)[0].Year;
        var highMonth = dateMonthYearFmtDim.top(1)[0].Month;
        var lowMonth = dateMonthYearFmtDim.bottom(1)[0].Month;
        //console.log(lowMonth + "/" +lowYear +" --> " + highMonth+"/" +highYear);
        updateOnBrush(lowYear, highYear);
        updateBrushRange(lowMonth + "/" +lowYear, highMonth+"/" +highYear);
      }

    });
    monthlyPerformanceChart.render();
}

function updateBrushRange(low, high) {
  // console.log("brush:" + low + "-->" + high)
  if (low!=null) {
      d3.selectAll("#monthly-performance-chart-selected-range").text("Range: ["+low+" - " +high +"]");
  } else {
     d3.selectAll("#monthly-performance-chart-selected-range").text("");
  }

}

function drawHotelQuadBubbleChart(xfProductSaleData) {
      hotelQuadBubbleChart.width(990)
              .height(500)
              .margins({top: 10, right: 50, bottom: 30, left: 60})
              .dimension(hotelDim)
              .group(salesByHotel)
              //.colors(d3.scale.category10())
              .colors(['#0078a8'])
              .keyAccessor(function (p) {
                  return p.value.Sales;
              })
              .valueAccessor(function (p) {
                  return p.value.Growth;
              })
              .radiusValueAccessor(function (p) {
                  return p.value.Sales;
              })
              .x(d3.scale.linear().domain([0, 4000000]))
              .r(d3.scale.linear().domain([0, 10000000]))
              .minRadiusWithLabel(15)
              .elasticY(true)
              .yAxisPadding(1000)
              .elasticX(true)
              .xAxisPadding(100000)
              .maxBubbleRelativeSize(0.15)
              .renderHorizontalGridLines(true)
              .renderVerticalGridLines(true)
              .renderLabel(true)
              .renderTitle(true)
              .title(function (p) {
                  return p.key
                          + "\n"
                          + "Sales: " + numberFormat(p.value.Sales/1000000) + "M\n"
                          + "Growth: " + numberFormat(p.value.Growth);
              });
      hotelQuadBubbleChart.yAxis().tickFormat(function (s) {
          return s + " %";
      });
      hotelQuadBubbleChart.xAxis().tickFormat(function (s) {
          return numberFormat(s/1000000) + "M";
      });
      hotelQuadBubbleChart.render();

}
//
// function drawsaleSizeFilterBarChart(xfProductSaleData) {
//   saleSizeFilterBarChart.dimension(hotelDim).group(salesByHotel).width(300).height(220).elasticX(true);
//   saleSizeFilterBarChart.x(d3.scaleOrdinal());
//   saleSizeFilterBarChart.render();
// }

/****************************************** UI *****************************************
* UI SECTION: Options, Class update, Drop list, ratio button, ect...
*
****************************************************************************************/
// activeObjectName is "hospitality" or else (residential)
function toggleOptionPannel() {
    //var containerObjectName = "filter-market-sector";
    var selectedObjectName = d3.select('input[name=' +
    'marketSector' +
    ']:checked').node().value;
    var containerHospitality = d3.selectAll("#hospitality-filter-market-sector");
    var containerResidential = d3.selectAll("#residential-filter-market-sector");
    if (selectedObjectName == "Hospitality") {
        containerHospitality.attr("class", "content-pannel-visible");
        containerResidential.attr("class", "content-pannel-hidden");
        sectorDim.filter("Hospitality");
        dc.redrawAll(groupname);
        //console.log("visibile containerHospitality");
    } else {
        containerHospitality.attr("class", "content-pannel-hidden");
        containerResidential.attr("class", "content-pannel-visible");
        sectorDim.filter("Residential");
        dc.redrawAll(groupname);
        //console.log("visibile containerResidential");
    }

}

//function to load UI
function createUI() {
  /*
    // Add section
    var headerNames = ["#overview-header", "#detail-analysis-header", "#sales-by-product-header"];
    var toggleSections = ["#overview", "#detail-analysis", "#sales-by-product"];
    var classNameVisible = "section";
    var classNameHide = "section-hide";
    d3.selectAll("#overview-header").append("text").text(" [show] ").on("click", function() {
        d3.selectAll("#overview").attr("class", "section");
        //console.log("+" + toggleSection + ">>" + "section");
    });
    d3.selectAll("#overview-header").append("text").text(" [hide] ").on("click", function() {
        d3.selectAll("#overview").attr("class", "section-hide");
        //console.log("-" + toggleSection + ">>" + "section-hide");
    });

    d3.selectAll("#detail-analysis-header").append("text").text(" [show] ").on("click", function() {
        d3.selectAll("#detail-analysis").attr("class", "section");
        //console.log("+" + "#detail-analysis" + ">>" + "section");
    });
    d3.selectAll("#detail-analysis-header").append("text").text(" [hide] ").on("click", function() {
        d3.selectAll("#detail-analysis").attr("class", "section-hide");
        //console.log("-" + toggleSection + ">>" + "section-hide");
    });

    d3.selectAll("#sale-by-product-header").append("text").text(" [show] ").on("click", function() {
        d3.selectAll("#sale-by-product").attr("class", "section");
        //console.log("+" + toggleSection + ">>" + "section");
    });
    d3.selectAll("#sale-by-product-header").append("text").text(" [hide] ").on("click", function() {
        d3.selectAll("#sale-by-product").attr("class", "section-hide");
        //console.log("-" + toggleSection + ">>" + "section-hide");
    });
*/
    // Add reset Button
    d3.selectAll("#button-control button#reset-chart").on("click", function() {
        yearDim.filter(null);
        //dc.renderAll(groupname);
        //reset the color of selected sale performance
        d3.selectAll(".measure-active.s0").attr("class", "measure s0");
        d3.selectAll(".measure-active.s1").attr("class", "measure s1");
    });

    // Options for Market Sector
    var shapeData = [
            "Hospitality", "Residential"
        ],
        selectedId = "Hospitality"; // Choose the rectangle as default

    // Create the shape selectors
    var formMarketSector = d3.select("#market-sector").append("form");
    var labelEnter = formMarketSector.selectAll("label").data(shapeData).enter().append("label");
    labelEnter.append("input").attr({
        type: "radio",
        class: "shape",
        name: "marketSector",
        value: function(d, i) {
            return d;
        }
    }).property("checked", function(d) {
        return (d === selectedId);
    }).on("click", function(d) {
        //console.log("hey click"+ d);
        toggleOptionPannel();
    });
    labelEnter.append("label").text(function(d) {
        return d;
    });
    labelEnter.append("br");
    //toggleOptionPannel();

    var listRollingPeriod = ["Quarter", "Year", "2 Years"];
    var dropDownRollingPeriod = d3.select("#rolling-period-filter").append("select").attr("name", "country-list");
    var optionsRollingPeriod = dropDownRollingPeriod.selectAll("option").data(listRollingPeriod).enter().append("option");
    optionsRollingPeriod.text(function(d) {
        return d;
    }).attr("value", function(d) {
        return d;
    });
    dropDownRollingPeriod.on("change", dropDownRollingPeriodChanged);
    /************************
    * Functions support UI
    *************************/
    //Option for rolling period
    function dropDownRollingPeriodChanged() {
        var selectedValue = d3.event.target.value;
        console.log("dropDownRollingPeriodChanged" +
            "option selected = " + selectedValue);
    }
}
