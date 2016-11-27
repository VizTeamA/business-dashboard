/****************************************** GLOBAL VARS *****************************************
* Global Variable Declarations
* Avoid using Global Vars as much as we can ok.
*************************************************************************************************/
/*     Markers      */
var groupname = "marker-select";
var inputSaleTrans = 'data/tables/SALE_TRANS.csv';
var isServiceIncld = true;
var yearSaleBulletChart = d3.bullet();
var productSaleRowChart = dc.rowChart("#sales-product-chart", groupname);
var monthlyPerformanceChart = dc.barChart('#monthly-performance-chart', groupname);
var hotelQuadBubbleChart = dc.bubbleChart('#quadratic-bubble-chart', groupname);
var productDataTable = dc.dataTable('#table-data', groupname);
var yearDim;
var xfHotelData;

var productCol = 'Product';
var saleCol = 'Sales';
var yearCol = 'Year';
var monthCol = 'Month';
var sectorCol = 'Sector';
var saleCodeCol = 'Sale_Code';
var itemCodeCol = 'Item_number';
var itemTypeCol = 'Item_Type';
var propertyCol = 'Property';

numberFormat = d3.format('.2f');
yearFormat = d3.time.format("%Y");

/****************************************** MAIN ************************************************
* Main ()
* As a controller to call other function() to load UI, add charts and Interaction
*************************************************************************************************/

//Create UI
createUI()

//Switch to SQL if needed
// var sql = 'select salesperson as Sale_Code, Item_number, product_group as Product, yr as Year, mth as Month, Item_Type, revenue as Sales,Sector,  Property from dashboard_sales_cached';
// d3.json("data.php?sql="+sql, function(data) {

d3.csv(inputSaleTrans, function(data) {
    // Since its a csv file we need to format the data a bit.
    var dateFormat = d3.time.format('%Y%b%d');
    data.forEach(function(d) {
        dumbDate = 01;
        d.dateFull = dateFormat.parse(d.Year + d.Month + dumbDate);
        d.monthFmt = d3.time.month(d.dateFull); // pre-calculate month for better performance
        d.yearFmt = d3.time.year(d.dateFull); // pre-calculate year for better performance
        d.Sales = numberFormat(Math.round(d[saleCol]));
        d.propertyNameFmt = d[propertyCol];
        d.Item_number = d.Item_number;
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

    hotelDim = xfProductSaleData.dimension(function(d) {
        return d.propertyNameFmt;
    });

    itemDim = xfProductSaleData.dimension(function(d) {
        return d.Item_number;
    });

    itemTypeDim = xfProductSaleData.dimension(function(d) {
        return d[itemTypeCol]
    })

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

    saleCodeDim = xfProductSaleData.dimension(function(d) {
        return d[saleCodeCol]
    });

    productSalesByMonth = monthFmtDim.group().reduceSum(function(d) {
        return Math.round(d[saleCol]);
    });
    productSalesByYear = yearFmtDim.group().reduceSum(function(d) {
        //return d[saleCol]
        return numberFormat(Math.round(d[saleCol]));
    });

    productSalesByHotel = hotelDim.group().reduce(function(p, v) {
        p.Sales += + v["Sales"];
        p.Growth += + v["Growth"];
        return p;
    }, function(p, v) {
        p.Sales -= + v["Sales"];
        //if (p.Sales < 0.001) p.Sales = 0; // do some clean up
        p.Growth -= + v["Growth"];
        return p;
    }, function() {
        return {Sales: 0, Growth: 0}
    });

    productSalesBySaleCode = saleCodeDim.group().reduceSum(function(d) {
        return Math.round((d[saleCol]));
    });

    loadExistingHotel();
    // Draw all charts
    drawProductBarChart(xfProductSaleData);
    drawYearSaleBulletChart();
    drawProspectHotelTable();
    drawMonthlyPerformanceBarChart(xfProductSaleData);
    drawHotelQuadBubbleChart(xfProductSaleData);
    drawTableData();
    drawSparkLines();
    drawSaleTargetBulletChartHospitality();
    drawSaleTargetBulletChartResidential();
    userUpdate('CEO'); // Load CEO view at the begging
    toggleMarketSectorView();

});

//Select All radio buttons that used for Market Sector Selection
d3.selectAll("market-sector").on("click", function() {
    bulletChartSvg.datum(randomize).transition().duration(1000).call(yearSaleBulletChart);
});

/****************************************** CHARTS *****************************************
* Draw charts
*
*******************************************************************************************/


function drawProductBarChart(xfProductSaleData) {
    productSaleRowChart.dimension(productDim).group(salesByProductGroup).width(300).height(400).elasticX(true)
    //.controlsUseVisibility(true)
        .xAxis().ticks(3);
    productSaleRowChart.colors("#0078a8");
    productSaleRowChart.render();
    productSaleRowChart.on("filtered",function(){
      drawSparkLines();
    })
    function AddXAxis(chartToUpdate, displayText, offsetY) {
        chartToUpdate.svg().append("text").attr("class", "x-axis-label").attr("text-anchor", "middle").attr("x", chartToUpdate.width() - 25).attr("y", chartToUpdate.height() + offsetY).text(displayText).style("font-size", "10px");
    }
    AddXAxis(productSaleRowChart, "Sale ($)", -5);
}

function updateChartByYear(year) {
    low = +year;
    high = +year + 1;
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
    drawSparkLines();
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
    yearDim.filter(null);
    monthDim.filter(null);
    productDim.filter(null);
    sectorDim.filter(null);
    hotelDim.filter(null);
    itemDim.filter(null);
    itemTypeDim.filter(null);
    yearFmtDim.filter(null);
    monthFmtDim.filter(null);
    dateMonthYearFmtDim.filter(null);
    saleCodeDim.filter(null);
    drawSparkLines();
    dc.filterAll(groupname);
    dc.redrawAll(groupname);

}

function filterItemType() {
  if(isServiceIncld) {
    isServiceIncld = false;
    d3.selectAll("a#item-type-toggle").text("(Service excld.)");
    itemTypeDim.filter("Material");
  } else {
    isServiceIncld = true;
    d3.selectAll("a#item-type-toggle").text("(Service incld.)")
    itemTypeDim.filter(null);
  }
  dc.redrawAll(groupname);
  drawSparkLines();
}

function drawYearSaleBulletChart() {
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
        });

    data = titleDimension.bottom(Infinity);
    lastYear = titleDimension.top(1)[0].Year;

    bulletChartSvg = d3.select("#sales-year-chart").selectAll("svg").data(data).enter().append("svg").attr("class", "bullet").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).on("click", function(d) {
        updateChartByYear(d.Year);
        updateNumbers(d.Year);
        drawSparkLines();
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

}

function drawTableData() {
    groupedDimension = itemDim.group().reduce(function(p, v) {
        //if (v.Item_Type == 'Service') { return null;}
        if (v.Item_Type == 'Service') {
            p.product = '_SERVICE_';
        } else {
            p.product = v.Product;
        }
        p.sales += + v.Sales;
        return p;
    }, function(p, v) {
        if (v.Item_Type == 'Service') {
            p.product = '_SERVICE_';
        } else {
            p.product = v.Product;
        }
        p.sales -= + v.Sales;
        return p;

    }, function() {
        return {product: "", sales: 0}
    });
    rank = function(p) {
        return ""
    };
    productDataTable.width(800).height(480).dimension(groupedDimension).group(rank).columns([
        {
            label: "Product",
            format: function(p) {
                return p.value.product
            }
        }, {
            label: "Item #",
            format: function(p) {
                return p.key
            }
        }, {
            label: "Image",
            format: function(p) {
                itemId = p.key;
                if (itemId == "") {
                    itemId="default";
                };
                url = "img\\item\\" + itemId + ".jpg";
                imgStr = "<img "+ " class = \"" + "thumbnail" +  "\" src=\"" + url + "\" width=40px; height=40px;>";
                return imgStr
            }
        }, {
            label: "Revenue",
            format: function(p) {
                return formatBigNum(p.value.sales)
            }
        }

    ]).sortBy(function(p) {
        return +p.value.sales
    }).order(d3.descending).size(Infinity);
    productDataTable.showGroups(false);
    productDataTable.render();
}


function drawSparkLines() {
    //Sorting Sale Code by total Sales
    saleCodeArr = productSalesBySaleCode.orderNatural().top(Infinity);
    visibleLengthMax = 10;
    visibleLength = Math.min(saleCodeArr.length, visibleLengthMax);

    var data=[];
    for (i = 0; i < visibleLength; i++) {
        rank = i+1;
        saleCode = saleCodeArr[i].key;
        saleTotal = +saleCodeArr[i].value;
        saleTotalFmt = formatBigNum(Math.round(saleTotal));
        var saleCodeChartId = "sale-code-sparkline" + saleCode;
        data.push({'Rank':rank, 'Saleperson': 'id_'+saleCode,'Revenue':saleTotalFmt,'Performance':'<div id='+saleCodeChartId+'></div>'})

    }

    var salemanTable =  tabulate(data, ["Rank","Saleperson", "Revenue","Performance"], "#sale-code-spark-line-chart");

    for (i = 0; i < visibleLength; i++) {
      rank = i+1;
      saleCode = saleCodeArr[i].key;
      saleTotal = +saleCodeArr[i].value;
      saleTotalFmt = formatBigNum(Math.round(saleTotal));
      var saleCodeChartId = "sale-code-sparkline" + saleCode;

      saleCodeDim.filterAll();
      saleCodeDim.filter(saleCode);
      var lineChart = dc.lineChart("#" + saleCodeChartId, saleCode);
      lineChart.width(100).height(20).margins({left: 0, top: 0, right: 0, bottom: 0}).x(d3.time.scale().domain([minDate, maxDate])).elasticY(false).brushOn(false).dimension(yearFmtDim).group(productSalesByYear).title(function(d) {
          return "Year:" + yearFormat(d.key) + "\nSales: $" + formatBigNum(d.value);
      });
      dc.renderAll(saleCode);
      lineChart.selectAll("g.axis").attr("display", "none");
      saleCodeDim.filterAll();
    }

}

function drawProspectHotelTable() {
  var prospectHotelDbFile = "data/tables/PROSPECT_HOTELS.csv";
  // var prosHotelData ;

  //Switch to SQL if needed
  //sql = 'select hotel_name as Hotel, stars as Stars, rooms as Rooms, website as Website, telephone as Telephone, general_manager as Manager from dashboard_hotels_cached';
  //d3.json("data.php?sql="+sql, function(data) {
  d3.csv(prospectHotelDbFile, function (data) {
    data.forEach(function(d) {
      d.Website = "<a href= '"+d.Website+"'>URL</a>";
      d.Title = (d.Hotel).toUpperCase();
    });
  xfHotelData = crossfilter(data);
    tabulate(data, ["Hotel","Stars", "Rooms","Website","Telephone","Manager"], "#prospect-hotel-table");
  })

}

function updateBulletChart(yearList) {
    //Reset css
    d3.selectAll(".measure-active.s0").attr("class", "measure s0");
    d3.selectAll(".measure-active.s1").attr("class", "measure s1");
    if (yearList != null) {
        for (i = 0; i < yearList.length; i++) {
            selectYear = yearList[i];
            objName_0 = "rect#dimension_y" + selectYear + ".measure.s0";
            objName_1 = "rect#dimension_y" + selectYear + ".measure.s1";
            //console.log("selectYear=" +selectYear);
            d3.selectAll(objName_0).attr("class", "measure-active s0");
            d3.selectAll(objName_1).attr("class", "measure-active s1");
        }
    }

}

function drawSaleTargetBulletChartResidential() {
  // Target market share:
  // all : 60% total of total
  var pTitle, pRangeMax, pMeasureActual, pMeasureExpect, pMarker, targetMarketShare;
  var chartData = [];
  var data = [];
  var datacf;
  var titleDimension;


  //Total hotel
  targetMarketShare = 0.6;
  pTitle = "Private Condo";
  pRangeMax = 3420;
  pMeasureActual = 2950;
  pMeasureExpect = Math.round(pRangeMax * targetMarketShare);
  data = getBulletData(pTitle, pRangeMax, pMeasureActual, pMeasureExpect);
  chartData.push(data);

  var targetBulletChartResidential = d3.bullet();
  drawTargetBulletChart(targetBulletChartResidential, chartData, "#sales-target-residential-chart");
}

function drawSaleTargetBulletChartHospitality() {
    // Target market share:
    // 5 star: 75% total of 5 stars
    // 4 star: 50% total of 4 stars
    // all : 60% total of total
    var pTitle, pRangeMax, pMeasureActual, pMeasureExpect, pMarker, targetMarketShare;
    var chartData = [];
    var data = [];
    var datacf;
    var titleDimension;


    //Total hotel
    targetMarketShare = 0.6;
    pTitle = "Hotel Market";
    pRangeMax = 1420;
    pMeasureActual = 1250;
    pMeasureExpect = Math.round(pRangeMax * targetMarketShare);
    data = getBulletData(pTitle, pRangeMax, pMeasureActual, pMeasureExpect);
    chartData.push(data);


    //4 Star hotel
    targetMarketShare = 0.5;
    pTitle = "4-Star Hotel";
    pRangeMax = 771;
    pMeasureActual = 500;
    pMeasureExpect = Math.round(pRangeMax * targetMarketShare);
    data = getBulletData(pTitle, pRangeMax, pMeasureActual, pMeasureExpect);
    chartData.push(data);

    //5 Star hotel
    targetMarketShare = 0.75;
    pTitle = "5-Star Hotel";
    pRangeMax = 420;
    pMeasureActual = 250;
    pMeasureExpect = Math.round(pRangeMax * targetMarketShare);
    data = getBulletData(pTitle, pRangeMax, pMeasureActual, pMeasureExpect);
    chartData.push(data);

    var targetBulletChart2 = d3.bullet();
    drawTargetBulletChart(targetBulletChart2, chartData, "#sales-target-hospitality-chart");

}

//function updateRange

/**
* Update on Brushing
*/
var beg = 0;
var end = 0;
function updateOnBrush(low, high) {
    if (beg == "") {
        beg = low;
        end = high;
    } else if (low == beg && high == end) {
        return;
    } else {
        //updateBulletChart
        var yearList = [];
        l = +low;
        h = +high;
        for (i = l - 1; i++; i <= h) {
            if (i > h) {
                break
            };
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
    monthlyPerformanceChart.centerBar(true).x(d3.time.scale().domain([minDate, maxDate])).elasticY(true).elasticX(true).xUnits(d3.time.months);
    monthlyPerformanceChart.yAxis().tickFormat(function(s) {
        return s / 1000 + "k$";
    }).ticks(3);
    monthlyPerformanceChart.colors(['#0078a8']);
    monthlyPerformanceChart.on("filtered", function() {
        updateBulletChart(null);
        drawSparkLines();
        if (yearDim.top(Infinity).length != 0) {
            var highYear = +yearDim.top(1)[0].Year;
            var lowYear = +yearDim.bottom(1)[0].Year;
            var highMonth = dateMonthYearFmtDim.top(1)[0].Month;
            var lowMonth = dateMonthYearFmtDim.bottom(1)[0].Month;
            //console.log(lowMonth + "/" +lowYear +" --> " + highMonth+"/" +highYear);
            updateOnBrush(lowYear, highYear);
            updateBrushRange(lowMonth + "/" + lowYear, highMonth + "/" + highYear);
        }

    });
    monthlyPerformanceChart.render();
}

function updateBrushRange(low, high) {
    // console.log("brush:" + low + "-->" + high)
    if (low != null) {
        d3.selectAll("#monthly-performance-chart-selected-range").text("Range: [" + low + " - " + high + "]");
    } else {
        d3.selectAll("#monthly-performance-chart-selected-range").text("");
    }

}

function drawHotelQuadBubbleChart(xfProductSaleData) {
    hotelQuadBubbleChart.width(600).height(500).margins({top: 10, right: 50, bottom: 30, left: 60})
    .dimension(hotelDim)
    .group(productSalesByHotel)
    .colors(['#0078a8'])
    .keyAccessor(function(p) {
        return p.value.Sales;
    }).valueAccessor(function(p) {
        return p.value.Growth;
    }).radiusValueAccessor(function(p) {
        return p.value.Sales;
    }).x(d3.scale.linear().domain([0, 4000000])).r(d3.scale.linear().domain([0, 10000000]))
    .minRadiusWithLabel(15).elasticY(true).yAxisPadding(50)
    .elasticX(true).xAxisPadding(200000).maxBubbleRelativeSize(0.15)
    .renderHorizontalGridLines(true).renderVerticalGridLines(true)
    .renderLabel(true).renderTitle(true)
    .title(function(p) {
        return p.key + "\n" + "Sales: " + numberFormat(p.value.Sales / 1000000) + "M\n" + "Growth: " + numberFormat(p.value.Growth) +"%";
    });
    hotelQuadBubbleChart.yAxis().tickFormat(function(s) {
        return s + " %";
    });
    hotelQuadBubbleChart.xAxis().tickFormat(function(s) {
        return numberFormat(s / 1000000) + "M";
    });
    hotelQuadBubbleChart.on("filtered", function() {
      drawSparkLines();
      drawAccountInfo();
    });
    hotelQuadBubbleChart.label(function(d) {
      var hotelStgFull = d.key;
      var hotelStrgShort = hotelStgFull.substr(0, 10) + "...";
      return hotelStrgShort;
    });
    hotelQuadBubbleChart.render();

}

function loadExistingHotel() {
  existingHotelFile = "data/tables/EXISTING_HOTELS.csv";

  //Switch to SQL if needed
  //sql = 'select hotel_name as Hotel, stars as Stars, rooms as Rooms, website as Website, telephone as Telephone, general_manager as Manager from dashboard_hotels_existing_cached';
  //d3.json("data.php?sql="+sql, function(data) {
  d3.csv(existingHotelFile, function (data) {
    data.forEach(function(d) {
      d.Title = (d.Hotel).toUpperCase();
    })
    xfExistingHotelData = crossfilter(data);
  }) ;

}

function drawAccountInfo() {

  var selectedHotelTitle =  (hotelDim.top(1)[0].Hotel).toUpperCase();
    var hotelTitleDim = xfExistingHotelData.dimension(function(d) {
      return d.Title;
    })
    hotelTitleDim.filter(null);
  hotelTitleDim.filter(selectedHotelTitle);

  var hotelTitle = hotelTitleDim.top(1)[0].Title;
  var hotelStars = hotelTitleDim.top(1)[0].Stars;
  var hotelRooms = hotelTitleDim.top(1)[0].Rooms;
  var hotelWebsite = hotelTitleDim.top(1)[0].Website;
  var hotelTelephone = hotelTitleDim.top(1)[0].Telephone;
  var hotelManager = hotelTitleDim.top(1)[0].Manager;

  hotelTitleDim.filter(null);

  d3.selectAll("#account-information.chart-container div.title").text("Hotel: " + hotelTitle);
  d3.selectAll("#account-information.chart-container div.star").text("Star: " +hotelStars);
  d3.selectAll("#account-information.chart-container div.rooms").text("Room count: " +hotelRooms);
  d3.selectAll("#account-information.chart-container div.address").text("Website: " + hotelWebsite);
  d3.selectAll("#account-information.chart-container div.website").text("Tel: " + hotelTelephone);
  d3.selectAll("#account-information.chart-container div.website").text("General Manager: " + hotelManager);
}

/****************************************** Utilities **********************************
* UTILITIES SECTION: reuseable utility libraries
*
****************************************************************************************/

function tabulate(data, columns, containerId) {
    d3.selectAll(containerId + " table").remove();
    var table = d3.select(containerId).append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) {
              return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {
                  column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: inherit")
            .html(function(d) {
              return d.value; });

    return table;
}

function drawTargetBulletChart(targetBulletChart, data, containerObjectName) {
    var margin = {
            top: 5,
            right: 5,
            bottom: 40,
            left: 40
        },
        width = 80 - margin.left - margin.right,
        height = 180 - margin.top - margin.bottom;
    targetBulletChart.orient("bottom").width(width).height(height);
    bulletChartSvg = d3.select(containerObjectName).selectAll("svg").data(data).enter().append("svg").attr("class", "bullet").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").call(targetBulletChart);
    var title = bulletChartSvg.append("g").style("text-anchor", "end").attr("transform", "translate(" + width + "," + (height + 20) + ")");
    title.append("text").attr("class", "title").text(function(d) {
        return d.title
    });

}

function getBulletData(pTitle, pRangeMax, pMeasureActual, pMeasureExpect) {
    var title,
        range_min,
        range_mid,
        range_max,
        measure_actual,
        measure_expect,
        marker;

    title = pTitle;
    range_min = Math.round(pRangeMax * 60 / 100);
    range_mid = Math.round(pRangeMax * 75 / 100);
    range_max = Math.round(pRangeMax * 100 / 100);
    measure_actual = +pMeasureActual;
    measure_expect = +pMeasureExpect;
    marker = +pMeasureExpect;

    var dataObj = new Object();
    dataObj["title"] = title;
    dataObj["ranges"] = [range_min, range_mid, range_max];
    dataObj["measures"] = [measure_actual, measure_expect];
    dataObj["markers"] = [marker];
    return dataObj;

}

function formatBigNum(number) {
    if (number < 999) {
        return numberFormat(number);
    } else if (number < 999999) {
        return numberFormat(number / 1000) + "K";
    } else {
        return numberFormat(number / 1000000)+ "M";
    }
}
/****************************************** UI *****************************************
* UI SECTION: Options, Class update, Drop list, ratio button, ect...
*
****************************************************************************************/
// toggle between 2 views: Hospitality or Residential. Default: Hospitality
function toggleMarketSectorView() {
    var isHospitality = d3.select('input[name=' +
    'onoffswitch' +
    ']').node().checked;
    var containerHospitality = d3.selectAll("#hospitality-filter-market-sector");
    var bulletChartHospitality = d3.selectAll("#sales-target-hospitality-chart");
    var containerResidential = d3.selectAll("#residential-filter-market-sector");
    var bulletChartResidential = d3.selectAll("#sales-target-residential-chart");
    if (isHospitality) {
        containerHospitality.attr("class", "content-pannel-visible");
        containerResidential.attr("class", "content-pannel-hidden");
        bulletChartHospitality.style("display","");
        bulletChartResidential.style("display","none");
        d3.selectAll("#residential-detail-analysis").style("display","none");
        d3.selectAll("#hotel-detail-analysis-table").style("display","");
        d3.selectAll("#hotel-detail-analysis-bubble").style("display","");
        sectorDim.filter("Hospitality");
        dc.redrawAll(groupname);
    } else {
        containerHospitality.attr("class", "content-pannel-hidden");
        containerResidential.attr("class", "content-pannel-visible");
        bulletChartHospitality.style("display","none");
        bulletChartResidential.style("display","");
        d3.selectAll("#residential-detail-analysis").style("display","");
        d3.selectAll("#hotel-detail-analysis-table").style("display","none");
        d3.selectAll("#hotel-detail-analysis-bubble").style("display","none");
        sectorDim.filter("Residential");
        dc.redrawAll(groupname);
        //console.log("visibile containerResidential");
    }
    drawSparkLines();


}

//function to load UI
function createUI() {
    // Add reset Button
    d3.selectAll("#button-control button#reset-chart").on("click", function() {
        yearDim.filter(null);
        //dc.renderAll(groupname);
        //reset the color of selected sale performance
        d3.selectAll(".measure-active.s0").attr("class", "measure s0");
        d3.selectAll(".measure-active.s1").attr("class", "measure s1");
    });

    // Options for Market Sector
    d3.selectAll('input[name="onoffswitch"]').on("click", function() {toggleMarketSectorView();});
    d3.selectAll('.chart-title').append("i").attr("class","icon-question");
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
