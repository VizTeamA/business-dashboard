
	function numberWithCommas(x) {
				return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

    var isIE = BrowserDetect.browser == 'Explorer';
    var chartWidth = 600;
    var chartHeight = 400;
    var xscale = d3.scale.linear().range([0, chartWidth]);
    var yscale = d3.scale.linear().range([0, chartHeight]);
    var color = d3.scale.category20();
    var headerHeight = 15;
    var headerColor = "#555555";
    var transitionDuration = 500;
    var root;
    var node;

    var treemap = d3.layout.treemap()
        .round(false)
        .size([chartWidth, chartHeight])
        .sticky(true)
        .value(function(d) {
            //return d.data.$area;
			         return d.size;
        });

    var chart = d3.select("#treemap-chart")
        .append("svg:svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .append("svg:g");

	 //Switch to SQL if needed
	 //var sql = 'select * from dashboard_treemap_cached';
	 //d3.json("datanew.php?sql=" + sql, function(data) {
	 d3.csv("./data/dashboard_treemap_cached.csv", function(data) {

		//set the size (revenue) as number
        _.each(data, function(element, index, list){
            element.size = +element.size;
        });

		//Handle mousemove and mouseout
		function showToolTip(name, design, dyeing_method, construction, backing, product_type, wood_species, colour, fire_rating, usages, composition) {
			var xPosition = d3.event.pageX + 5;
			var yPosition = d3.event.pageY + 5;

			//Construct the item info for available fields only
			var designHtml = design == "" ? '' : "<b>Design:</b> "+design+"<br/>";
			var dyeingHtml = dyeing_method == "" ? '' : "<b>Dyeing Method:</b> "+dyeing_method+"<br/>";
			var constructionHtml = construction == '' ? "" : "<b>Construction:</b> "+construction+"<br/>";
			var backingHtml = backing == "" ? '' : "<b>Backing:</b> "+backing+"<br/>";
			var product_typeHtml = product_type == '' ? "" : "<b>Product Type:</b> "+product_type+"<br/>";
			var wood_speciesHtml = wood_species == '' ? "" : "<b>Wood Species:</b> "+wood_species+"<br/>";
			var colourHtml = colour == "" ? '' : "<b>Colour:</b> "+colour+"<br/>";
			var fire_ratingHtml = fire_rating == '' ? "" : "<b>Fire Rating:</b> "+fire_rating+"<br/>";
			var usagesHtml = usages == "" ? '' : "<b>Usages:</b> "+usages+"<br/>";
			var compositionHtml = composition == '' ? "" : "<b>Composition:</b> "+composition;
			var htmlinfo = designHtml.concat(dyeingHtml,constructionHtml,backingHtml,product_typeHtml,wood_speciesHtml,colourHtml,fire_ratingHtml,usagesHtml,compositionHtml);

			  d3.select("#treemap-tooltip")
				.style("left", xPosition + "px")
				.style("top", yPosition + "px");
			  d3.select("#treemap-tooltip #item-heading")
				.text("Item Number: #"+name);
			  d3.select("#treemap-tooltip #itemimage img").remove();
			  d3.select("#treemap-tooltip #itemimage")
				.append("img").attr("src", "./img/item/" + name +".jpg")
			  d3.select("#treemap-tooltip #iteminfo")
				.html(htmlinfo);
			  d3.select("#treemap-tooltip").classed("hidden", false);
		};

		var mouseout = function() {
		  d3.select("#treemap-tooltip").classed("hidden", true);
		};


        //*************************************************
        //THE FUNCTION
		//Source: http://www.delimited.io/blog/2013/11/2/creating-nested-json-for-d3
		//Need underscore.js
        //*************************************************
        function genJSON(csvData, groups) {

          var genGroups = function(data) {
            return _.map(data, function(element, index) {
              return { name : index, children : element };
            });
          };

          var nest = function(node, curIndex) {
            if (curIndex === 0) {
              node.children = genGroups(_.groupBy(csvData, groups[0]));
              _.each(node.children, function (child) {
                nest(child, curIndex + 1);
              });
            }
            else {
              if (curIndex < groups.length) {
                node.children = genGroups(
                  _.groupBy(node.children, groups[curIndex])
                );
                _.each(node.children, function (child) {
                  nest(child, curIndex + 1);
                });
              }
            }
            return node;
          };
          return nest({}, 0);
        };

        //use this only if working with csv data
		var preppedData = genJSON(data, ['collection']);

        node = root = preppedData;
        var nodes = treemap.nodes(root);

        var children = nodes.filter(function(d) {
            return !d.children;
        });
        var parents = nodes.filter(function(d) {
            return d.children;
        });

        // create parent cells
        var parentCells = chart.selectAll("g.cell.parent")
            .data(parents, function(d) {
                return "p-" + d.name;
            });
        var parentEnterTransition = parentCells.enter()
            .append("g")
            .attr("class", "cell parent")
            .on("click", function(d) {
                zoom(d);
            });
        parentEnterTransition.append("rect")
            .attr("width", function(d) {
                return Math.max(0.01, d.dx);
            })
            .attr("height", headerHeight)
            .style("fill", headerColor);
        parentEnterTransition.append('foreignObject')
            .attr("class", "foreignObject")
            .append("xhtml:body")
            .attr("class", "labelbody")
            .append("div")
            .attr("class", "label");
        // update transition
        var parentUpdateTransition = parentCells.transition().duration(transitionDuration);
        parentUpdateTransition.select(".cell")
            .attr("transform", function(d) {
                return "translate(" + d.dx + "," + d.y + ")";
            });
        parentUpdateTransition.select("rect")
            .attr("width", function(d) {
                return Math.max(0.01, d.dx);
            })
            .attr("height", headerHeight)
            .style("fill", headerColor);
        parentUpdateTransition.select(".foreignObject")
            .attr("width", function(d) {
                return Math.max(0.01, d.dx);
            })
            .attr("height", headerHeight)
            .select(".labelbody .label")
            .text(function(d) {
                return d.name;
            });
        // remove transition
        parentCells.exit()
            .remove();

        // create children cells
        var childrenCells = chart.selectAll("g.cell.child")
            .data(children, function(d) {
                return "c-" + d.name;
            });
        // enter transition
        var childEnterTransition = childrenCells.enter()
            .append("g")
            .attr("class", "cell child")
            .on("click", function(d) {
                zoom(node === d.parent ? root : d.parent);
            })
			.on("mousemove", function(d) {
				showToolTip(d.name, d.design, d.dyeing_method, d.construction, d.backing, d.product_type, d.wood_species, d.colour,d.fire_rating, d.usages, d.composition);
			})
			.on("mouseout", mouseout);
        childEnterTransition.append("rect")
            .classed("background", true)
            .style("fill", function(d) {
                return color(d.parent.name);
            });
        childEnterTransition.append('foreignObject')
            .attr("class", "foreignObject")
            .attr("width", function(d) {
                return Math.max(0.01, d.dx);
            })
            .attr("height", function(d) {
                return Math.max(0.01, d.dy);
            })
            .append("xhtml:body")
            .attr("class", "labelbody")
            .append("div")
            .attr("class", "label")
            .text(function(d) {
                return d.name;
            });

        if (isIE) {
            childEnterTransition.selectAll(".foreignObject .labelbody .label")
                .style("display", "none");
        } else {
            childEnterTransition.selectAll(".foreignObject")
                .style("display", "none");
        }

        // update transition
        var childUpdateTransition = childrenCells.transition().duration(transitionDuration);
        childUpdateTransition.select(".cell")
            .attr("transform", function(d) {
                return "translate(" + d.x  + "," + d.y + ")";
            });
        childUpdateTransition.select("rect")
            .attr("width", function(d) {
                return Math.max(0.01, d.dx);
            })
            .attr("height", function(d) {
                return d.dy;
            })
            .style("fill", function(d) {
                return color(d.parent.name);
            });
        childUpdateTransition.select(".foreignObject")
            .attr("width", function(d) {
                return Math.max(0.01, d.dx);
            })
            .attr("height", function(d) {
                return Math.max(0.01, d.dy);
            })
            .select(".labelbody .label")
            .text(function(d) {
                return d.name;
            });
        // exit transition
        childrenCells.exit()
            .remove();

        d3.select("select").on("change", function() {
            console.log("select zoom(node)");
            treemap.value(this.value == "size" ? size : count)
                .nodes(root);
            zoom(node);
        });

        zoom(node);
    });


    function size(d) {
        return d.data.$area;
    }


    function count(d) {
        return 1;
    }


    //and another one
    function textHeight(d) {
        var ky = chartHeight / d.dy;
        yscale.domain([d.y, d.y + d.dy]);
        return (ky * d.dy) / headerHeight;
    }


    function getRGBComponents (color) {
        var r = color.substring(1, 3);
        var g = color.substring(3, 5);
        var b = color.substring(5, 7);
        return {
            R: parseInt(r, 16),
            G: parseInt(g, 16),
            B: parseInt(b, 16)
        };
    }


    function idealTextColor (bgColor) {
        var nThreshold = 105;
        var components = getRGBComponents(bgColor);
        var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
        return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
    }


    function zoom(d) {
        this.treemap
            .padding([headerHeight/(chartHeight/d.dy), 0, 0, 0])
            .nodes(d);

        // moving the next two lines above treemap layout messes up padding of zoom result
        var kx = chartWidth  / d.dx;
        var ky = chartHeight / d.dy;
        var level = d;

        xscale.domain([d.x, d.x + d.dx]);
        yscale.domain([d.y, d.y + d.dy]);

        if (node != level) {
            if (isIE) {
                chart.selectAll(".cell.child .foreignObject .labelbody .label")
                    .style("display", "none");
            } else {
                chart.selectAll(".cell.child .foreignObject")
                    .style("display", "none");
            }
        }

        var zoomTransition = chart.selectAll("g.cell").transition().duration(transitionDuration)
            .attr("transform", function(d) {
                return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")";
            })
            .each("end", function(d, i) {
                if (!i && (level !== self.root)) {
                    chart.selectAll(".cell.child")
                        .filter(function(d) {
                            return d.parent === self.node; // only get the children for selected group
                        })
                        .select(".foreignObject .labelbody .label")
                        .style("color", function(d) {
                            return idealTextColor(color(d.parent.name));
                        });

                    if (isIE) {
                        chart.selectAll(".cell.child")
                            .filter(function(d) {
                                return d.parent === self.node; // only get the children for selected group
                            })
                            .select(".foreignObject .labelbody .label")
                            .style("display", "")
                    } else {
                        chart.selectAll(".cell.child")
                            .filter(function(d) {
                                return d.parent === self.node; // only get the children for selected group
                            })
                            .select(".foreignObject")
                            .style("display", "")
                    }
                }
            });

        zoomTransition.select(".foreignObject")
            .attr("width", function(d) {
                return Math.max(0.01, kx * d.dx);
            })
            .attr("height", function(d) {
                return d.children ? headerHeight: Math.max(0.01, ky * d.dy);
            })
            .select(".labelbody .label")
            .text(function(d) {
				if(d.size==null)
				{
					return d.name;
				}
				else
				{
					return "# " + d.name + "\n$" + numberWithCommas(d.size.toFixed(2));
				};
            });

        // update the width/height of the rects
        zoomTransition.select("rect")
            .attr("width", function(d) {
                return Math.max(0.01, kx * d.dx);
            })
            .attr("height", function(d) {
                return d.children ? headerHeight : Math.max(0.01, ky * d.dy);
            })
            .style("fill", function(d) {
                return d.children ? headerColor : color(d.parent.name);
            });

        node = d;

        if (d3.event) {
            d3.event.stopPropagation();
        }
    }
