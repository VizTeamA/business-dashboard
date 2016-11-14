! function() {
    function a(a, b) {
        "use strict";
        var c = {
            version: "2.1.0-dev",
            constants: {
                CHART_CLASS: "dc-chart",
                DEBUG_GROUP_CLASS: "debug",
                STACK_CLASS: "stack",
                DESELECTED_CLASS: "deselected",
                SELECTED_CLASS: "selected",
                NODE_INDEX_NAME: "__index__",
                GROUP_INDEX_NAME: "__group_index__",
                DEFAULT_CHART_GROUP: "__default_chart_group__",
                EVENT_DELAY: 40,
                NEGLIGIBLE_NUMBER: 1e-10
            },
            _renderlet: null
        };
        c.chartRegistry = function() {
            function a(a) {
                return a || (a = c.constants.DEFAULT_CHART_GROUP), b[a] || (b[a] = []), a
            }
            var b = {};
            return {
                has: function(a) {
                    for (var c in b)
                        if (b[c].indexOf(a) >= 0) return !0;
                    return !1
                },
                register: function(c, d) {
                    d = a(d), b[d].push(c)
                },
                deregister: function(c, d) {
                    d = a(d);
                    for (var e = 0; e < b[d].length; e++)
                        if (b[d][e].anchorName() === c.anchorName()) {
                            b[d].splice(e, 1);
                            break
                        }
                },
                clear: function(a) {
                    a ? delete b[a] : b = {}
                },
                list: function(c) {
                    return c = a(c), b[c]
                }
            }
        }(), c.registerChart = function(a, b) {
            c.chartRegistry.register(a, b)
        }, c.deregisterChart = function(a, b) {
            c.chartRegistry.deregister(a, b)
        }, c.hasChart = function(a) {
            return c.chartRegistry.has(a)
        }, c.deregisterAllCharts = function(a) {
            c.chartRegistry.clear(a)
        }, c.filterAll = function(a) {
            for (var b = c.chartRegistry.list(a), d = 0; d < b.length; ++d) b[d].filterAll()
        }, c.refocusAll = function(a) {
            for (var b = c.chartRegistry.list(a), d = 0; d < b.length; ++d) b[d].focus && b[d].focus()
        }, c.renderAll = function(a) {
            for (var b = c.chartRegistry.list(a), d = 0; d < b.length; ++d) b[d].render();
            null !== c._renderlet && c._renderlet(a)
        }, c.redrawAll = function(a) {
            for (var b = c.chartRegistry.list(a), d = 0; d < b.length; ++d) b[d].redraw();
            null !== c._renderlet && c._renderlet(a)
        }, c.disableTransitions = !1, c.transition = function(a, b, d) {
            if (0 >= b || void 0 === b || c.disableTransitions) return a;
            var e = a.transition().duration(b);
            return "function" == typeof d && d(e), e
        }, c.units = {}, c.units.integers = function(a, b) {
            return Math.abs(b - a)
        }, c.units.ordinal = function(a, b, c) {
            return c
        }, c.units.fp = {}, c.units.fp.precision = function(a) {
            var b = function(a, d) {
                var e = Math.abs((d - a) / b.resolution);
                return c.utils.isNegligible(e - Math.floor(e)) ? Math.floor(e) : Math.ceil(e)
            };
            return b.resolution = a, b
        }, c.round = {}, c.round.floor = function(a) {
            return Math.floor(a)
        }, c.round.ceil = function(a) {
            return Math.ceil(a)
        }, c.round.round = function(a) {
            return Math.round(a)
        }, c.override = function(a, b, c) {
            var d = a[b];
            a["_" + b] = d, a[b] = c
        }, c.renderlet = function(a) {
            return arguments.length ? (c._renderlet = a, c) : c._renderlet
        }, c.instanceOfChart = function(a) {
            return a instanceof Object && a.__dcFlag__ && !0
        }, c.errors = {}, c.errors.Exception = function(a) {
            var b = a || "Unexpected internal error";
            this.message = b, this.toString = function() {
                return b
            }
        }, c.errors.InvalidStateException = function() {
            c.errors.Exception.apply(this, arguments)
        }, c.dateFormat = a.time.format("%m/%d/%Y"), c.printers = {}, c.printers.filters = function(a) {
            for (var b = "", d = 0; d < a.length; ++d) d > 0 && (b += ", "), b += c.printers.filter(a[d]);
            return b
        }, c.printers.filter = function(a) {
            var b = "";
            return "undefined" != typeof a && null !== a && (a instanceof Array ? a.length >= 2 ? b = "[" + c.utils.printSingleValue(a[0]) + " -> " + c.utils.printSingleValue(a[1]) + "]" : a.length >= 1 && (b = c.utils.printSingleValue(a[0])) : b = c.utils.printSingleValue(a)), b
        }, c.pluck = function(a, b) {
            return b ? function(c, d) {
                return b.call(c, c[a], d)
            } : function(b) {
                return b[a]
            }
        }, c.utils = {}, c.utils.printSingleValue = function(a) {
            var b = "" + a;
            return a instanceof Date ? b = c.dateFormat(a) : "string" == typeof a ? b = a : c.utils.isFloat(a) ? b = c.utils.printSingleValue.fformat(a) : c.utils.isInteger(a) && (b = Math.round(a)), b
        }, c.utils.printSingleValue.fformat = a.format(".2f"), c.utils.add = function(a, b) {
            if ("string" == typeof b && (b = b.replace("%", "")), a instanceof Date) {
                "string" == typeof b && (b = +b);
                var c = new Date;
                return c.setTime(a.getTime()), c.setDate(a.getDate() + b), c
            }
            if ("string" == typeof b) {
                var d = +b / 100;
                return a > 0 ? a * (1 + d) : a * (1 - d)
            }
            return a + b
        }, c.utils.subtract = function(a, b) {
            if ("string" == typeof b && (b = b.replace("%", "")), a instanceof Date) {
                "string" == typeof b && (b = +b);
                var c = new Date;
                return c.setTime(a.getTime()), c.setDate(a.getDate() - b), c
            }
            if ("string" == typeof b) {
                var d = +b / 100;
                return 0 > a ? a * (1 + d) : a * (1 - d)
            }
            return a - b
        }, c.utils.isNumber = function(a) {
            return a === +a
        }, c.utils.isFloat = function(a) {
            return a === +a && a !== (0 | a)
        }, c.utils.isInteger = function(a) {
            return a === +a && a === (0 | a)
        }, c.utils.isNegligible = function(a) {
            return !c.utils.isNumber(a) || a < c.constants.NEGLIGIBLE_NUMBER && a > -c.constants.NEGLIGIBLE_NUMBER
        }, c.utils.clamp = function(a, b, c) {
            return b > a ? b : a > c ? c : a
        };
        var d = 0;
        return c.utils.uniqueId = function() {
                return ++d
            }, c.utils.nameToId = function(a) {
                return a.toLowerCase().replace(/[\s]/g, "_").replace(/[\.']/g, "")
            }, c.utils.appendOrSelect = function(a, b, c) {
                c = c || b;
                var d = a.select(b);
                return d.empty() && (d = a.append(c)), d
            }, c.utils.safeNumber = function(a) {
                return c.utils.isNumber(+a) ? +a : 0
            }, c.logger = {}, c.logger.enableDebugLog = !1, c.logger.warn = function(a) {
                return console && (console.warn ? console.warn(a) : console.log && console.log(a)), c.logger
            }, c.logger.debug = function(a) {
                return c.logger.enableDebugLog && console && (console.debug ? console.debug(a) : console.log && console.log(a)), c.logger
            }, c.logger.deprecate = function(a, b) {
                function d() {
                    return e || (c.logger.warn(b), e = !0), a.apply(this, arguments)
                }
                var e = !1;
                return d
            }, c.events = {
                current: null
            }, c.events.trigger = function(a, b) {
                return b ? (c.events.current = a, void setTimeout(function() {
                    a === c.events.current && a()
                }, b)) : void a()
            }, c.filters = {}, c.filters.RangedFilter = function(a, b) {
                var c = new Array(a, b);
                return c.isFiltered = function(a) {
                    return a >= this[0] && a < this[1]
                }, c
            }, c.filters.TwoDimensionalFilter = function(a) {
                if (null === a) return null;
                var b = a;
                return b.isFiltered = function(a) {
                    return a.length && a.length === b.length && a[0] === b[0] && a[1] === b[1]
                }, b
            }, c.filters.RangedTwoDimensionalFilter = function(a) {
                if (null === a) return null;
                var b, c = a;
                return b = c[0] instanceof Array ? [
                    [Math.min(a[0][0], a[1][0]), Math.min(a[0][1], a[1][1])],
                    [Math.max(a[0][0], a[1][0]), Math.max(a[0][1], a[1][1])]
                ] : [
                    [a[0], -1 / 0],
                    [a[1], 1 / 0]
                ], c.isFiltered = function(a) {
                    var c, d;
                    if (a instanceof Array) {
                        if (2 !== a.length) return !1;
                        c = a[0], d = a[1]
                    } else c = a, d = b[0][1];
                    return c >= b[0][0] && c < b[1][0] && d >= b[0][1] && d < b[1][1]
                }, c
            }, c.baseMixin = function(d) {
                function e() {
                    return l = d.root().append("svg").attr("width", d.width()).attr("height", d.height())
                }

                function f(a) {
                    if (!d[a] || !d[a]()) throw new c.errors.InvalidStateException("Mandatory attribute chart." + a + " is missing on chart[#" + d.anchorName() + "]")
                }

                function g() {
                    if (d.dimension() && d.dimension().filter) {
                        var a = H(d.dimension(), G);
                        G = a ? a : G
                    }
                }
                d.__dcFlag__ = c.utils.uniqueId();
                var h, i, j, k, l, m, n, o = 200,
                    p = function(a) {
                        var b = a && a.getBoundingClientRect && a.getBoundingClientRect().width;
                        return b && b > o ? b : o
                    },
                    q = p,
                    r = 200,
                    s = function(a) {
                        var b = a && a.getBoundingClientRect && a.getBoundingClientRect().height;
                        return b && b > r ? b : r
                    },
                    t = s,
                    u = c.pluck("key"),
                    v = c.pluck("value"),
                    w = c.pluck("key"),
                    x = c.pluck("key"),
                    y = !1,
                    z = function(a) {
                        return d.keyAccessor()(a) + ": " + d.valueAccessor()(a)
                    },
                    A = !0,
                    B = 750,
                    C = c.printers.filters,
                    D = ["dimension", "group"],
                    E = c.constants.DEFAULT_CHART_GROUP,
                    F = a.dispatch("preRender", "postRender", "preRedraw", "postRedraw", "filtered", "zoomed", "renderlet"),
                    G = [],
                    H = function(a, b) {
                        return a.filter(null), 0 === b.length ? a.filter(null) : a.filterFunction(function(a) {
                            for (var c = 0; c < b.length; c++) {
                                var d = b[c];
                                if (d.isFiltered && d.isFiltered(a)) return !0;
                                if (a >= d && d >= a) return !0
                            }
                            return !1
                        }), b
                    },
                    I = function(a) {
                        return a.all()
                    };
                d.width = function(b) {
                    return arguments.length ? (q = a.functor(b || p), d) : q(k.node())
                }, d.height = function(b) {
                    return arguments.length ? (t = a.functor(b || s), d) : t(k.node())
                }, d.minWidth = function(a) {
                    return arguments.length ? (o = a, d) : o
                }, d.minHeight = function(a) {
                    return arguments.length ? (r = a, d) : r
                }, d.dimension = function(a) {
                    return arguments.length ? (h = a, d.expireCache(), d) : h
                }, d.data = function(b) {
                    return arguments.length ? (I = a.functor(b), d.expireCache(), d) : I.call(d, i)
                }, d.group = function(a, b) {
                    return arguments.length ? (i = a, d._groupName = b, d.expireCache(), d) : i
                }, d.ordering = function(a) {
                    return arguments.length ? (x = a, m = b.quicksort.by(x), d.expireCache(), d) : x
                }, d._computeOrderedGroups = function(a) {
                    var c = a.slice(0);
                    return c.length <= 1 ? c : (m || (m = b.quicksort.by(x)), m(c, 0, c.length))
                }, d.filterAll = function() {
                    return d.filter(null)
                }, d.select = function(a) {
                    return k.select(a)
                }, d.selectAll = function(a) {
                    return k ? k.selectAll(a) : null
                }, d.anchor = function(b, e) {
                    return arguments.length ? (c.instanceOfChart(b) ? (j = b.anchor(), k = b.root()) : (j = b, k = a.select(j), k.classed(c.constants.CHART_CLASS, !0), c.registerChart(d, e)), E = e, d) : j
                }, d.anchorName = function() {
                    var a = d.anchor();
                    return a && a.id ? a.id : a && a.replace ? a.replace("#", "") : "dc-chart" + d.chartID()
                }, d.root = function(a) {
                    return arguments.length ? (k = a, d) : k
                }, d.svg = function(a) {
                    return arguments.length ? (l = a, d) : l
                }, d.resetSvg = function() {
                    return d.select("svg").remove(), e()
                }, d.filterPrinter = function(a) {
                    return arguments.length ? (C = a, d) : C
                }, d.turnOnControls = function() {
                    return k && (d.selectAll(".reset").style("display", null), d.selectAll(".filter").text(C(d.filters())).style("display", null)), d
                }, d.turnOffControls = function() {
                    return k && (d.selectAll(".reset").style("display", "none"), d.selectAll(".filter").style("display", "none").text(d.filter())), d
                }, d.transitionDuration = function(a) {
                    return arguments.length ? (B = a, d) : B
                }, d._mandatoryAttributes = function(a) {
                    return arguments.length ? (D = a, d) : D
                }, d.render = function() {
                    F.preRender(d), D && D.forEach(f);
                    var a = d._doRender();
                    return n && n.render(), d._activateRenderlets("postRender"), a
                }, d._activateRenderlets = function(a) {
                    d.transitionDuration() > 0 && l ? l.transition().duration(d.transitionDuration()).each("end", function() {
                        F.renderlet(d), a && F[a](d)
                    }) : (F.renderlet(d), a && F[a](d))
                }, d.redraw = function() {
                    F.preRedraw(d);
                    var a = d._doRedraw();
                    return n && n.render(), d._activateRenderlets("postRedraw"), a
                }, d.redrawGroup = function() {
                    c.redrawAll(d.chartGroup())
                }, d.renderGroup = function() {
                    c.renderAll(d.chartGroup())
                }, d._invokeFilteredListener = function(a) {
                    void 0 !== a && F.filtered(d, a)
                }, d._invokeZoomedListener = function() {
                    F.zoomed(d)
                };
                var J = function(a, b) {
                    return null === b || "undefined" == typeof b ? a.length > 0 : a.some(function(a) {
                        return a >= b && b >= a
                    })
                };
                d.hasFilterHandler = function(a) {
                    return arguments.length ? (J = a, d) : J
                }, d.hasFilter = function(a) {
                    return J(G, a)
                };
                var K = function(a, b) {
                    for (var c = 0; c < a.length; c++)
                        if (a[c] <= b && a[c] >= b) {
                            a.splice(c, 1);
                            break
                        }
                    return a
                };
                d.removeFilterHandler = function(a) {
                    return arguments.length ? (K = a, d) : K
                };
                var L = function(a, b) {
                    return a.push(b), a
                };
                d.addFilterHandler = function(a) {
                    return arguments.length ? (L = a, d) : L
                };
                var M = function() {
                    return []
                };
                return d.resetFilterHandler = function(a) {
                    return arguments.length ? (M = a, d) : M
                }, d.replaceFilter = function(a) {
                    G = [], d.filter(a)
                }, d.filter = function(a) {
                    return arguments.length ? (a instanceof Array && a[0] instanceof Array && !a.isFiltered ? a[0].forEach(function(a) {
                        d.hasFilter(a) ? K(G, a) : L(G, a)
                    }) : null === a ? G = M(G) : d.hasFilter(a) ? K(G, a) : L(G, a), g(), d._invokeFilteredListener(a), null !== k && d.hasFilter() ? d.turnOnControls() : d.turnOffControls(), d) : G.length > 0 ? G[0] : null
                }, d.filters = function() {
                    return G
                }, d.highlightSelected = function(b) {
                    a.select(b).classed(c.constants.SELECTED_CLASS, !0), a.select(b).classed(c.constants.DESELECTED_CLASS, !1)
                }, d.fadeDeselected = function(b) {
                    a.select(b).classed(c.constants.SELECTED_CLASS, !1), a.select(b).classed(c.constants.DESELECTED_CLASS, !0)
                }, d.resetHighlight = function(b) {
                    a.select(b).classed(c.constants.SELECTED_CLASS, !1), a.select(b).classed(c.constants.DESELECTED_CLASS, !1)
                }, d.onClick = function(a) {
                    var b = d.keyAccessor()(a);
                    c.events.trigger(function() {
                        d.filter(b), d.redrawGroup()
                    })
                }, d.filterHandler = function(a) {
                    return arguments.length ? (H = a, d) : H
                }, d._doRender = function() {
                    return d
                }, d._doRedraw = function() {
                    return d
                }, d.legendables = function() {
                    return []
                }, d.legendHighlight = function() {}, d.legendReset = function() {}, d.legendToggle = function() {}, d.isLegendableHidden = function() {
                    return !1
                }, d.keyAccessor = function(a) {
                    return arguments.length ? (u = a, d) : u
                }, d.valueAccessor = function(a) {
                    return arguments.length ? (v = a, d) : v
                }, d.label = function(a) {
                    return arguments.length ? (w = a, y = !0, d) : w
                }, d.renderLabel = function(a) {
                    return arguments.length ? (y = a, d) : y
                }, d.title = function(a) {
                    return arguments.length ? (z = a, d) : z
                }, d.renderTitle = function(a) {
                    return arguments.length ? (A = a, d) : A
                }, d.renderlet = c.logger.deprecate(function(a) {
                    return d.on("renderlet." + c.utils.uniqueId(), a), d
                }, 'chart.renderlet has been deprecated.  Please use chart.on("renderlet.<renderletKey>", renderletFunction)'), d.chartGroup = function(a) {
                    return arguments.length ? (E = a, d) : E
                }, d.expireCache = function() {
                    return d
                }, d.legend = function(a) {
                    return arguments.length ? (n = a, n.parent(d), d) : n
                }, d.chartID = function() {
                    return d.__dcFlag__
                }, d.options = function(a) {
                    for (var b in a) "function" == typeof d[b] ? d[b].call(d, a[b]) : c.logger.debug("Not a valid option setter name: " + b);
                    return d
                }, d.on = function(a, b) {
                    return F.on(a, b), d
                }, d
            }, c.marginMixin = function(a) {
                var b = {
                    top: 10,
                    right: 50,
                    bottom: 30,
                    left: 30
                };
                return a.margins = function(c) {
                    return arguments.length ? (b = c, a) : b
                }, a.effectiveWidth = function() {
                    return a.width() - a.margins().left - a.margins().right
                }, a.effectiveHeight = function() {
                    return a.height() - a.margins().top - a.margins().bottom
                }, a
            }, c.colorMixin = function(b) {
                var c = a.scale.category20c(),
                    d = !0,
                    e = function(a) {
                        return b.keyAccessor()(a)
                    };
                return b.colors = function(d) {
                    return arguments.length ? (c = d instanceof Array ? a.scale.quantize().range(d) : a.functor(d), b) : c
                }, b.ordinalColors = function(c) {
                    return b.colors(a.scale.ordinal().range(c))
                }, b.linearColors = function(c) {
                    return b.colors(a.scale.linear().range(c).interpolate(a.interpolateHcl))
                }, b.colorAccessor = function(a) {
                    return arguments.length ? (e = a, d = !1, b) : e
                }, b.defaultColorAccessor = function() {
                    return d
                }, b.colorDomain = function(a) {
                    return arguments.length ? (c.domain(a), b) : c.domain()
                }, b.calculateColorDomain = function() {
                    var d = [a.min(b.data(), b.colorAccessor()), a.max(b.data(), b.colorAccessor())];
                    return c.domain(d), b
                }, b.getColor = function(a, b) {
                    return c(e.call(this, a, b))
                }, b.colorCalculator = function(a) {
                    return arguments.length ? (b.getColor = a, b) : b.getColor
                }, b
            }, c.coordinateGridMixin = function(b) {
                function d() {
                    U = !0, W && (b.x().domain(l(b.x().domain(), y)), F && b.x().domain(l(b.x().domain(), F.x().domain())));
                    var a = b.x().domain(),
                        d = c.filters.RangedFilter(a[0], a[1]);
                    b.replaceFilter(d), b.rescale(), b.redraw(), F && !m(b.filter(), F.filter()) && c.events.trigger(function() {
                        F.replaceFilter(d), F.redraw()
                    }), b._invokeZoomedListener(), c.events.trigger(function() {
                        b.redrawGroup()
                    }, c.constants.EVENT_DELAY), U = !m(a, y)
                }

                function e(a) {
                    b.isOrdinal() ? (b.elasticX() || 0 === x.domain().length) && x.domain(b._ordinalXDomain()) : b.elasticX() && x.domain([b.xAxisMin(), b.xAxisMax()]);
                    var c = x.domain();
                    (!A || c.some(function(a, b) {
                        return a !== A[b]
                    })) && b.rescale(), A = c, b.isOrdinal() ? x.rangeBands([0, b.xAxisLength()], bb, b._useOuterPadding() ? ab : 0) : x.range([0, b.xAxisLength()]), H = H.scale(b.x()), f(a)
                }

                function f(a) {
                    var d = a.selectAll("g." + q);
                    if (T) {
                        d.empty() && (d = a.insert("g", ":first-child").attr("class", o + " " + q).attr("transform", "translate(" + b.margins().left + "," + b.margins().top + ")"));
                        var e = H.tickValues() ? H.tickValues() : "function" == typeof x.ticks ? x.ticks(H.ticks()[0]) : x.domain(),
                            f = d.selectAll("line").data(e),
                            g = f.enter().append("line").attr("x1", function(a) {
                                return x(a)
                            }).attr("y1", b._xAxisY() - b.margins().top).attr("x2", function(a) {
                                return x(a)
                            }).attr("y2", 0).attr("opacity", 0);
                        c.transition(g, b.transitionDuration()).attr("opacity", 1), c.transition(f, b.transitionDuration()).attr("x1", function(a) {
                            return x(a)
                        }).attr("y1", b._xAxisY() - b.margins().top).attr("x2", function(a) {
                            return x(a)
                        }).attr("y2", 0), f.exit().remove()
                    } else d.selectAll("line").remove()
                }

                function g() {
                    return b._xAxisY() - b.margins().top
                }

                function h() {
                    return b.anchorName().replace(/[ .#]/g, "-") + "-clip"
                }

                function i() {
                    var a = c.utils.appendOrSelect(u, "defs"),
                        d = h(),
                        e = c.utils.appendOrSelect(a, "#" + d, "clipPath").attr("id", d),
                        f = 2 * _;
                    c.utils.appendOrSelect(e, "rect").attr("width", b.xAxisLength() + f).attr("height", b.yAxisHeight() + f).attr("transform", "translate(-" + _ + ", -" + _ + ")")
                }

                function j(a) {
                    b.isOrdinal() && (R = !1), e(b.g()), b._prepareYAxis(b.g()), b.plotData(), (b.elasticX() || U || a) && b.renderXAxis(b.g()), (b.elasticY() || a) && b.renderYAxis(b.g()), a ? b.renderBrush(b.g()) : b.redrawBrush(b.g())
                }

                function k() {
                    $ ? b._enableMouseZoom() : Z && b._disableMouseZoom()
                }

                function l(b, c) {
                    var d = [];
                    return d[0] = a.max([b[0], c[0]]), d[1] = a.min([b[1], c[1]]), d
                }

                function m(a, b) {
                    return a || b ? a && b ? 0 === a.length && 0 === b.length ? !0 : a[0].valueOf() === b[0].valueOf() && a[1].valueOf() === b[1].valueOf() ? !0 : !1 : !1 : !0
                }

                function n(a) {
                    return a instanceof Array && a.length > 1
                }
                var o = "grid-line",
                    p = "horizontal",
                    q = "vertical",
                    r = "y-axis-label",
                    s = "x-axis-label",
                    t = 12;
                b = c.colorMixin(c.marginMixin(c.baseMixin(b))), b.colors(a.scale.category10()), b._mandatoryAttributes().push("x");
                var u, v, w, x, y, z, A, B, C, D, E, F, G, H = a.svg.axis().orient("bottom"),
                    I = c.units.integers,
                    J = 0,
                    K = !1,
                    L = 0,
                    M = a.svg.axis().orient("left"),
                    N = 0,
                    O = !1,
                    P = 0,
                    Q = a.svg.brush(),
                    R = !0,
                    S = !1,
                    T = !1,
                    U = !1,
                    V = [1, 1 / 0],
                    W = !0,
                    X = a.behavior.zoom().on("zoom", d),
                    Y = a.behavior.zoom().on("zoom", null),
                    Z = !1,
                    $ = !1,
                    _ = 0,
                    ab = .5,
                    bb = 0,
                    cb = !1;
                return b.rescale = function() {
                    E = void 0
                }, b.rangeChart = function(a) {
                    return arguments.length ? (F = a, F.focusChart(b), b) : F
                }, b.zoomScale = function(a) {
                    return arguments.length ? (V = a, b) : V
                }, b.zoomOutRestrict = function(a) {
                    return arguments.length ? (V[0] = a ? 1 : 0, W = a, b) : W
                }, b._generateG = function(a) {
                    return u = void 0 === a ? b.svg() : a, v = u.append("g"), w = v.append("g").attr("class", "chart-body").attr("transform", "translate(" + b.margins().left + ", " + b.margins().top + ")").attr("clip-path", "url(#" + h() + ")"), v
                }, b.g = function(a) {
                    return arguments.length ? (v = a, b) : v
                }, b.mouseZoomable = function(a) {
                    return arguments.length ? ($ = a, b) : $
                }, b.chartBodyG = function(a) {
                    return arguments.length ? (w = a, b) : w
                }, b.x = function(a) {
                    return arguments.length ? (x = a, y = x.domain(), b) : x
                }, b.xOriginalDomain = function() {
                    return y
                }, b.xUnits = function(a) {
                    return arguments.length ? (I = a, b) : I
                }, b.xAxis = function(a) {
                    return arguments.length ? (H = a, b) : H
                }, b.elasticX = function(a) {
                    return arguments.length ? (K = a, b) : K
                }, b.xAxisPadding = function(a) {
                    return arguments.length ? (J = a, b) : J
                }, b.xUnitCount = function() {
                    if (void 0 === E) {
                        var a = b.xUnits()(b.x().domain()[0], b.x().domain()[1], b.x().domain());
                        E = a instanceof Array ? a.length : a
                    }
                    return E
                }, b.useRightYAxis = function(a) {
                    return arguments.length ? (cb = a, b) : cb
                }, b.isOrdinal = function() {
                    return b.xUnits() === c.units.ordinal
                }, b._useOuterPadding = function() {
                    return !0
                }, b._ordinalXDomain = function() {
                    var a = b._computeOrderedGroups(b.data());
                    return a.map(b.keyAccessor())
                }, b.renderXAxis = function(a) {
                    var d = a.selectAll("g.x");
                    d.empty() && (d = a.append("g").attr("class", "axis x").attr("transform", "translate(" + b.margins().left + "," + b._xAxisY() + ")"));
                    var e = a.selectAll("text." + s);
                    e.empty() && b.xAxisLabel() && (e = a.append("text").attr("transform", "translate(" + (b.margins().left + b.xAxisLength() / 2) + "," + (b.height() - L) + ")").attr("class", s).attr("text-anchor", "middle").text(b.xAxisLabel())), b.xAxisLabel() && e.text() !== b.xAxisLabel() && e.text(b.xAxisLabel()), c.transition(d, b.transitionDuration()).call(H)
                }, b._xAxisY = function() {
                    return b.height() - b.margins().bottom
                }, b.xAxisLength = function() {
                    return b.effectiveWidth()
                }, b.xAxisLabel = function(a, c) {
                    return arguments.length ? (z = a, b.margins().bottom -= L, L = void 0 === c ? t : c, b.margins().bottom += L, b) : z
                }, b._prepareYAxis = function(c) {
                    if (void 0 === B || b.elasticY()) {
                        B = a.scale.linear();
                        var d = b.yAxisMin() || 0,
                            e = b.yAxisMax() || 0;
                        B.domain([d, e]).rangeRound([b.yAxisHeight(), 0])
                    }
                    B.range([b.yAxisHeight(), 0]), M = M.scale(B), cb && M.orient("right"), b._renderHorizontalGridLinesForAxis(c, B, M)
                }, b.renderYAxisLabel = function(a, c, d, e) {
                    e = e || P;
                    var f = b.g().selectAll("text." + r + "." + a + "-label");
                    if (f.empty() && c) {
                        var g = b.margins().top + b.yAxisHeight() / 2;
                        f = b.g().append("text").attr("transform", "translate(" + e + "," + g + "),rotate(" + d + ")").attr("class", r + " " + a + "-label").attr("text-anchor", "middle").text(c)
                    }
                    c && f.text() !== c && f.text(c)
                }, b.renderYAxisAt = function(a, d, e) {
                    var f = b.g().selectAll("g." + a);
                    f.empty() && (f = b.g().append("g").attr("class", "axis " + a).attr("transform", "translate(" + e + "," + b.margins().top + ")")), c.transition(f, b.transitionDuration()).call(d)
                }, b.renderYAxis = function() {
                    var a = cb ? b.width() - b.margins().right : b._yAxisX();
                    b.renderYAxisAt("y", M, a);
                    var c = cb ? b.width() - P : P,
                        d = cb ? 90 : -90;
                    b.renderYAxisLabel("y", b.yAxisLabel(), d, c)
                }, b._renderHorizontalGridLinesForAxis = function(a, d, e) {
                    var f = a.selectAll("g." + p);
                    if (S) {
                        var g = e.tickValues() ? e.tickValues() : d.ticks(e.ticks()[0]);
                        f.empty() && (f = a.insert("g", ":first-child").attr("class", o + " " + p).attr("transform", "translate(" + b.margins().left + "," + b.margins().top + ")"));
                        var h = f.selectAll("line").data(g),
                            i = h.enter().append("line").attr("x1", 1).attr("y1", function(a) {
                                return d(a)
                            }).attr("x2", b.xAxisLength()).attr("y2", function(a) {
                                return d(a)
                            }).attr("opacity", 0);
                        c.transition(i, b.transitionDuration()).attr("opacity", 1), c.transition(h, b.transitionDuration()).attr("x1", 1).attr("y1", function(a) {
                            return d(a)
                        }).attr("x2", b.xAxisLength()).attr("y2", function(a) {
                            return d(a)
                        }), h.exit().remove()
                    } else f.selectAll("line").remove()
                }, b._yAxisX = function() {
                    return b.useRightYAxis() ? b.width() - b.margins().right : b.margins().left
                }, b.yAxisLabel = function(a, c) {
                    return arguments.length ? (C = a, b.margins().left -= P, P = void 0 === c ? t : c, b.margins().left += P, b) : C
                }, b.y = function(a) {
                    return arguments.length ? (B = a, b) : B
                }, b.yAxis = function(a) {
                    return arguments.length ? (M = a, b) : M
                }, b.elasticY = function(a) {
                    return arguments.length ? (O = a, b) : O
                }, b.renderHorizontalGridLines = function(a) {
                    return arguments.length ? (S = a, b) : S
                }, b.renderVerticalGridLines = function(a) {
                    return arguments.length ? (T = a, b) : T
                }, b.xAxisMin = function() {
                    var d = a.min(b.data(), function(a) {
                        return b.keyAccessor()(a)
                    });
                    return c.utils.subtract(d, J)
                }, b.xAxisMax = function() {
                    var d = a.max(b.data(), function(a) {
                        return b.keyAccessor()(a)
                    });
                    return c.utils.add(d, J)
                }, b.yAxisMin = function() {
                    var d = a.min(b.data(), function(a) {
                        return b.valueAccessor()(a)
                    });
                    return c.utils.subtract(d, N)
                }, b.yAxisMax = function() {
                    var d = a.max(b.data(), function(a) {
                        return b.valueAccessor()(a)
                    });
                    return c.utils.add(d, N)
                }, b.yAxisPadding = function(a) {
                    return arguments.length ? (N = a, b) : N
                }, b.yAxisHeight = function() {
                    return b.effectiveHeight()
                }, b.round = function(a) {
                    return arguments.length ? (D = a, b) : D
                }, b._rangeBandPadding = function(a) {
                    return arguments.length ? (bb = a, b) : bb
                }, b._outerRangeBandPadding = function(a) {
                    return arguments.length ? (ab = a, b) : ab
                }, c.override(b, "filter", function(a) {
                    return arguments.length ? (b._filter(a), a ? b.brush().extent(a) : b.brush().clear(), b) : b._filter()
                }), b.brush = function(a) {
                    return arguments.length ? (Q = a, b) : Q
                }, b.renderBrush = function(a) {
                    if (R) {
                        Q.on("brush", b._brushing), Q.on("brushstart", b._disableMouseZoom), Q.on("brushend", k);
                        var c = a.append("g").attr("class", "brush").attr("transform", "translate(" + b.margins().left + "," + b.margins().top + ")").call(Q.x(b.x()));
                        b.setBrushY(c), b.setHandlePaths(c), b.hasFilter() && b.redrawBrush(a)
                    }
                }, b.setHandlePaths = function(a) {
                    a.selectAll(".resize").append("path").attr("d", b.resizeHandlePath)
                }, b.setBrushY = function(a) {
                    a.selectAll("rect").attr("height", g())
                }, b.extendBrush = function() {
                    var a = Q.extent();
                    return b.round() && (a[0] = a.map(b.round())[0], a[1] = a.map(b.round())[1], v.select(".brush").call(Q.extent(a))), a
                }, b.brushIsEmpty = function(a) {
                    return Q.empty() || !a || a[1] <= a[0]
                }, b._brushing = function() {
                    var a = b.extendBrush();
                    if (b.redrawBrush(v), b.brushIsEmpty(a)) c.events.trigger(function() {
                        b.filter(null), b.redrawGroup()
                    }, c.constants.EVENT_DELAY);
                    else {
                        var d = c.filters.RangedFilter(a[0], a[1]);
                        c.events.trigger(function() {
                            b.replaceFilter(d), b.redrawGroup()
                        }, c.constants.EVENT_DELAY)
                    }
                }, b.redrawBrush = function(a) {
                    if (R) {
                        b.filter() && b.brush().empty() && b.brush().extent(b.filter());
                        var c = a.select("g.brush");
                        c.call(b.brush().x(b.x())), b.setBrushY(c)
                    }
                    b.fadeDeselectedArea()
                }, b.fadeDeselectedArea = function() {}, b.resizeHandlePath = function(a) {
                    var b = +("e" === a),
                        c = b ? 1 : -1,
                        d = g() / 3;
                    return "M" + .5 * c + "," + d + "A6,6 0 0 " + b + " " + 6.5 * c + "," + (d + 6) + "V" + (2 * d - 6) + "A6,6 0 0 " + b + " " + .5 * c + "," + 2 * d + "ZM" + 2.5 * c + "," + (d + 8) + "V" + (2 * d - 8) + "M" + 4.5 * c + "," + (d + 8) + "V" + (2 * d - 8)
                }, b.clipPadding = function(a) {
                    return arguments.length ? (_ = a, b) : _
                }, b._preprocessData = function() {}, b._doRender = function() {
                    return b.resetSvg(), b._preprocessData(), b._generateG(), i(), j(!0), k(), b
                }, b._doRedraw = function() {
                    return b._preprocessData(), j(!1), i(), b
                }, b._enableMouseZoom = function() {
                    Z = !0, X.x(b.x()).scaleExtent(V).size([b.width(), b.height()]).duration(b.transitionDuration()), b.root().call(X)
                }, b._disableMouseZoom = function() {
                    b.root().call(Y)
                }, b.focus = function(a) {
                    b.x().domain(n(a) ? a : y), X.x(b.x()), d()
                }, b.refocused = function() {
                    return U
                }, b.focusChart = function(a) {
                    return arguments.length ? (G = a, b.on("filtered", function(a) {
                        a.filter() ? m(a.filter(), G.filter()) || c.events.trigger(function() {
                            G.focus(a.filter())
                        }) : c.events.trigger(function() {
                            G.x().domain(G.xOriginalDomain())
                        })
                    }), b) : G
                }, b.brushOn = function(a) {
                    return arguments.length ? (R = a, b) : R
                }, b
            }, c.stackMixin = function(b) {
                function d(a, c) {
                    var d = a.accessor || b.valueAccessor();
                    return a.name = String(a.name || c), a.values = a.group.all().map(function(c, e) {
                        return {
                            x: b.keyAccessor()(c, e),
                            y: a.hidden ? null : d(c, e),
                            data: c,
                            layer: a.name,
                            hidden: a.hidden
                        }
                    }), a.values = a.values.filter(e()), a.values
                }

                function e() {
                    if (!b.x()) return a.functor(!0);
                    var c = b.x().domain();
                    return b.isOrdinal() ? function() {
                        return !0
                    } : b.elasticX() ? function() {
                        return !0
                    } : function(a) {
                        return a.x >= c[0] && a.x <= c[c.length - 1]
                    }
                }

                function f(a) {
                    var b = j.map(c.pluck("name")).indexOf(a);
                    return j[b]
                }

                function g() {
                    var a = b.data().map(function(a) {
                        return a.values
                    });
                    return Array.prototype.concat.apply([], a)
                }

                function h(a) {
                    return !a.hidden
                }
                var i = a.layout.stack().values(d),
                    j = [],
                    k = {},
                    l = !1;
                return b.stack = function(a, c, d) {
                    if (!arguments.length) return j;
                    arguments.length <= 2 && (d = c);
                    var e = {
                        group: a
                    };
                    return "string" == typeof c && (e.name = c), "function" == typeof d && (e.accessor = d), j.push(e), b
                }, c.override(b, "group", function(a, c, d) {
                    return arguments.length ? (j = [], k = {}, b.stack(a, c), d && b.valueAccessor(d), b._group(a, c)) : b._group()
                }), b.hidableStacks = function(a) {
                    return arguments.length ? (l = a, b) : l
                }, b.hideStack = function(a) {
                    var c = f(a);
                    return c && (c.hidden = !0), b
                }, b.showStack = function(a) {
                    var c = f(a);
                    return c && (c.hidden = !1), b
                }, b.getValueAccessorByIndex = function(a) {
                    return j[a].accessor || b.valueAccessor()
                }, b.yAxisMin = function() {
                    var d = a.min(g(), function(a) {
                        return a.y + a.y0 < a.y0 ? a.y + a.y0 : a.y0
                    });
                    return c.utils.subtract(d, b.yAxisPadding())
                }, b.yAxisMax = function() {
                    var d = a.max(g(), function(a) {
                        return a.y + a.y0
                    });
                    return c.utils.add(d, b.yAxisPadding())
                }, b.xAxisMin = function() {
                    var d = a.min(g(), c.pluck("x"));
                    return c.utils.subtract(d, b.xAxisPadding())
                }, b.xAxisMax = function() {
                    var d = a.max(g(), c.pluck("x"));
                    return c.utils.add(d, b.xAxisPadding())
                }, c.override(b, "title", function(a, c) {
                    return a ? "function" == typeof a ? b._title(a) : a === b._groupName && "function" == typeof c ? b._title(c) : "function" != typeof c ? k[a] || b._title() : (k[a] = c, b) : b._title()
                }), b.stackLayout = function(a) {
                    return arguments.length ? (i = a, b) : i
                }, b.data(function() {
                    var a = j.filter(h);
                    return a.length ? b.stackLayout()(a) : []
                }), b._ordinalXDomain = function() {
                    var a = g().map(c.pluck("data")),
                        d = b._computeOrderedGroups(a);
                    return d.map(b.keyAccessor())
                }, b.colorAccessor(function(a) {
                    var b = this.layer || this.name || a.name || a.layer;
                    return b
                }), b.legendables = function() {
                    return j.map(function(a, c) {
                        return {
                            chart: b,
                            name: a.name,
                            hidden: a.hidden || !1,
                            color: b.getColor.call(a, a.values, c)
                        }
                    })
                }, b.isLegendableHidden = function(a) {
                    var b = f(a.name);
                    return b ? b.hidden : !1
                }, b.legendToggle = function(a) {
                    l && (b.isLegendableHidden(a) ? b.showStack(a.name) : b.hideStack(a.name), b.renderGroup())
                }, b
            }, c.capMixin = function(b) {
                var d = 1 / 0,
                    e = "Others",
                    f = function(c) {
                        var d = a.sum(c, b.valueAccessor()),
                            f = b.group().all(),
                            g = a.sum(f, b.valueAccessor()),
                            h = c.map(b.keyAccessor()),
                            i = f.map(b.keyAccessor()),
                            j = a.set(h),
                            k = i.filter(function(a) {
                                return !j.has(a)
                            });
                        return g > d ? c.concat([{
                            others: k,
                            key: e,
                            value: g - d
                        }]) : c
                    };
                return b.cappedKeyAccessor = function(a, c) {
                    return a.others ? a.key : b.keyAccessor()(a, c)
                }, b.cappedValueAccessor = function(a, c) {
                    return a.others ? a.value : b.valueAccessor()(a, c)
                }, b.data(function(a) {
                    if (1 / 0 === d) return b._computeOrderedGroups(a.all());
                    var c = a.top(d);
                    return c = b._computeOrderedGroups(c), f ? f(c) : c
                }), b.cap = function(a) {
                    return arguments.length ? (d = a, b) : d
                }, b.othersLabel = function(a) {
                    return arguments.length ? (e = a, b) : e
                }, b.othersGrouper = function(a) {
                    return arguments.length ? (f = a, b) : f
                }, c.override(b, "onClick", function(a) {
                    a.others && b.filter([a.others]), b._onClick(a)
                }), b
            }, c.bubbleMixin = function(b) {
                var d = .3,
                    e = 10;
                b.BUBBLE_NODE_CLASS = "node", b.BUBBLE_CLASS = "bubble", b.MIN_RADIUS = 10, b = c.colorMixin(b), b.renderLabel(!0), b.data(function(a) {
                    return a.top(1 / 0)
                });
                var f = a.scale.linear().domain([0, 100]),
                    g = function(a) {
                        return a.r
                    };
                b.r = function(a) {
                    return arguments.length ? (f = a, b) : f
                }, b.radiusValueAccessor = function(a) {
                    return arguments.length ? (g = a, b) : g
                }, b.rMin = function() {
                    var c = a.min(b.data(), function(a) {
                        return b.radiusValueAccessor()(a)
                    });
                    return c
                }, b.rMax = function() {
                    var c = a.max(b.data(), function(a) {
                        return b.radiusValueAccessor()(a)
                    });
                    return c
                }, b.bubbleR = function(a) {
                    var c = b.radiusValueAccessor()(a),
                        d = b.r()(c);
                    return (isNaN(d) || 0 >= c) && (d = 0), d
                };
                var h = function(a) {
                        return b.label()(a)
                    },
                    i = function(a) {
                        return b.bubbleR(a) > e ? 1 : 0
                    };
                b._doRenderLabel = function(a) {
                    if (b.renderLabel()) {
                        var d = a.select("text");
                        d.empty() && (d = a.append("text").attr("text-anchor", "middle").attr("dy", ".3em").on("click", b.onClick)), d.attr("opacity", 0).text(h), c.transition(d, b.transitionDuration()).attr("opacity", i)
                    }
                }, b.doUpdateLabels = function(a) {
                    if (b.renderLabel()) {
                        var d = a.selectAll("text").text(h);
                        c.transition(d, b.transitionDuration()).attr("opacity", i)
                    }
                };
                var j = function(a) {
                    return b.title()(a)
                };
                return b._doRenderTitles = function(a) {
                    if (b.renderTitle()) {
                        var c = a.select("title");
                        c.empty() && a.append("title").text(j)
                    }
                }, b.doUpdateTitles = function(a) {
                    b.renderTitle() && a.selectAll("title").text(j)
                }, b.minRadiusWithLabel = function(a) {
                    return arguments.length ? (e = a, b) : e
                }, b.maxBubbleRelativeSize = function(a) {
                    return arguments.length ? (d = a, b) : d
                }, b.fadeDeselectedArea = function() {
                    b.selectAll("g." + b.BUBBLE_NODE_CLASS).each(b.hasFilter() ? function(a) {
                        b.isSelectedNode(a) ? b.highlightSelected(this) : b.fadeDeselected(this)
                    } : function() {
                        b.resetHighlight(this)
                    })
                }, b.isSelectedNode = function(a) {
                    return b.hasFilter(a.key)
                }, b.onClick = function(a) {
                    var d = a.key;
                    c.events.trigger(function() {
                        b.filter(d), b.redrawGroup()
                    })
                }, b
            }, c.pieChart = function(b, d) {
                function e() {
                    D = D ? D : a.min([O.width(), O.height()]) / 2;
                    var b, c = r(),
                        d = t();
                    if (a.sum(O.data(), O.valueAccessor()) ? (b = d(O.data()), E.classed(K, !1)) : (b = d([{
                            key: L,
                            value: 1,
                            others: [L]
                        }]), E.classed(K, !0)), E) {
                        var e = E.selectAll("g." + J).data(b);
                        f(e, c, b), l(b, c), p(e), q()
                    }
                }

                function f(a, b, c) {
                    var d = g(a);
                    h(d, b), i(d), k(c, b)
                }

                function g(a) {
                    var b = a.enter().append("g").attr("class", function(a, b) {
                        return J + " _" + b
                    });
                    return b
                }

                function h(a, b) {
                    var d = a.append("path").attr("fill", y).on("click", z).attr("d", function(a, c) {
                        return A(a, c, b)
                    });
                    c.transition(d, O.transitionDuration(), function(a) {
                        a.attrTween("d", w)
                    })
                }

                function i(a) {
                    O.renderTitle() && a.append("title").text(function(a) {
                        return O.title()(a.data)
                    })
                }

                function j(a, b) {
                    c.transition(a, O.transitionDuration()).attr("transform", function(a) {
                        return B(a, b)
                    }).attr("text-anchor", "middle").text(function(a) {
                        var b = a.data;
                        return !v(b) && !u(a) || s(a) ? O.label()(a.data) : ""
                    })
                }

                function k(a, b) {
                    if (O.renderLabel()) {
                        var c = E.selectAll("text." + J).data(a);
                        c.exit().remove();
                        var d = c.enter().append("text").attr("class", function(a, b) {
                            var c = J + " _" + b;
                            return H && (c += " external"), c
                        }).on("click", z);
                        j(d, b)
                    }
                }

                function l(a, b) {
                    m(a, b), n(a, b), o(a)
                }

                function m(a, b) {
                    var d = E.selectAll("g." + J).data(a).select("path").attr("d", function(a, c) {
                        return A(a, c, b)
                    });
                    c.transition(d, O.transitionDuration(), function(a) {
                        a.attrTween("d", w)
                    }).attr("fill", y)
                }

                function n(a, b) {
                    if (O.renderLabel()) {
                        var c = E.selectAll("text." + J).data(a);
                        j(c, b)
                    }
                }

                function o(a) {
                    O.renderTitle() && E.selectAll("g." + J).data(a).select("title").text(function(a) {
                        return O.title()(a.data)
                    })
                }

                function p(a) {
                    a.exit().remove()
                }

                function q() {
                    O.selectAll("g." + J).each(O.hasFilter() ? function(a) {
                        s(a) ? O.highlightSelected(this) : O.fadeDeselected(this)
                    } : function() {
                        O.resetHighlight(this)
                    })
                }

                function r() {
                    return a.svg.arc().outerRadius(D).innerRadius(M)
                }

                function s(a) {
                    return O.hasFilter(O.cappedKeyAccessor(a.data))
                }

                function t() {
                    return a.layout.pie().sort(null).value(O.cappedValueAccessor)
                }

                function u(a) {
                    var b = a.endAngle - a.startAngle;
                    return isNaN(b) || N > b
                }

                function v(a) {
                    return 0 === O.cappedValueAccessor(a)
                }

                function w(b) {
                    b.innerRadius = M;
                    var c = this._current;
                    x(c) && (c = {
                        startAngle: 0,
                        endAngle: 0
                    });
                    var d = a.interpolate(c, b);
                    return this._current = d(0),
                        function(a) {
                            return A(d(a), 0, r())
                        }
                }

                function x(a) {
                    return !a || isNaN(a.startAngle) || isNaN(a.endAngle)
                }

                function y(a, b) {
                    return O.getColor(a.data, b)
                }

                function z(a, b) {
                    E.attr("class") !== K && O.onClick(a.data, b)
                }

                function A(a, b, c) {
                    var d = c(a, b);
                    return d.indexOf("NaN") >= 0 && (d = "M0,0"), d
                }

                function B(b, c) {
                    var d;
                    return d = H ? a.svg.arc().outerRadius(D + H).innerRadius(D + H).centroid(b) : c.centroid(b), isNaN(d[0]) || isNaN(d[1]) ? "translate(0,0)" : "translate(" + d + ")"
                }

                function C(b, c) {
                    O.selectAll("g.pie-slice").each(function(d) {
                        b.name === d.data.key && a.select(this).classed("highlight", c)
                    })
                }
                var D, E, F, G, H, I = .5,
                    J = "pie-slice",
                    K = "empty-chart",
                    L = "empty",
                    M = 0,
                    N = I,
                    O = c.capMixin(c.colorMixin(c.baseMixin({})));
                return O.colorAccessor(O.cappedKeyAccessor), O.title(function(a) {
                    return O.cappedKeyAccessor(a) + ": " + O.cappedValueAccessor(a)
                }), O.slicesCap = O.cap, O.label(O.cappedKeyAccessor), O.renderLabel(!0), O.transitionDuration(350), O._doRender = function() {
                    return O.resetSvg(), E = O.svg().append("g").attr("transform", "translate(" + O.cx() + "," + O.cy() + ")"), e(), O
                }, O.innerRadius = function(a) {
                    return arguments.length ? (M = a, O) : M
                }, O.radius = function(a) {
                    return arguments.length ? (D = a, O) : D
                }, O.cx = function(a) {
                    return arguments.length ? (F = a, O) : F || O.width() / 2
                }, O.cy = function(a) {
                    return arguments.length ? (G = a, O) : G || O.height() / 2
                }, O._doRedraw = function() {
                    return e(), O
                }, O.minAngleForLabel = function(a) {
                    return arguments.length ? (N = a, O) : N
                }, O.emptyTitle = function(a) {
                    return 0 === arguments.length ? L : (L = a, O)
                }, O.externalLabels = function(a) {
                    return 0 === arguments.length ? H : (H = a ? a : void 0, O)
                }, O.legendables = function() {
                    return O.data().map(function(a, b) {
                        var c = {
                            name: a.key,
                            data: a.value,
                            others: a.others,
                            chart: O
                        };
                        return c.color = O.getColor(a, b), c
                    })
                }, O.legendHighlight = function(a) {
                    C(a, !0)
                }, O.legendReset = function(a) {
                    C(a, !1)
                }, O.legendToggle = function(a) {
                    O.onClick({
                        key: a.name,
                        others: a.others
                    })
                }, O.anchor(b, d)
            }, c.barChart = function(b, d) {
                function e(a) {
                    return c.utils.safeNumber(Math.abs(l.y()(a.y + a.y0) - l.y()(a.y0)))
                }

                function f(a, b, d) {
                    var f = a.selectAll("rect.bar").data(d.values, c.pluck("x")),
                        g = f.enter().append("rect").attr("class", "bar").attr("fill", c.pluck("data", l.getColor)).attr("y", l.yAxisHeight()).attr("height", 0);
                    l.renderTitle() && g.append("title").text(c.pluck("data", l.title(d.name))), l.isOrdinal() && f.on("click", l.onClick), c.transition(f, l.transitionDuration()).attr("x", function(a) {
                        var b = l.x()(a.x);
                        return n && (b -= i / 2), l.isOrdinal() && void 0 !== m && (b += m / 2), c.utils.safeNumber(b)
                    }).attr("y", function(a) {
                        var b = l.y()(a.y + a.y0);
                        return a.y < 0 && (b -= e(a)), c.utils.safeNumber(b)
                    }).attr("width", i).attr("height", function(a) {
                        return e(a)
                    }).attr("fill", c.pluck("data", l.getColor)).select("title").text(c.pluck("data", l.title(d.name))), c.transition(f.exit(), l.transitionDuration()).attr("height", 0).remove()
                }

                function g() {
                    if (void 0 === i) {
                        var a = l.xUnitCount();
                        i = Math.floor(l.isOrdinal() && void 0 === m ? l.x().rangeBand() : m ? (l.xAxisLength() - (a - 1) * m) / a : l.xAxisLength() / (1 + l.barPadding()) / a), (1 / 0 === i || isNaN(i) || j > i) && (i = j)
                    }
                }

                function h(b, c) {
                    return function() {
                        var d = a.select(this),
                            e = d.attr("fill") === b;
                        return c ? !e : e
                    }
                }
                var i, j = 1,
                    k = 2,
                    l = c.stackMixin(c.coordinateGridMixin({})),
                    m = k,
                    n = !1,
                    o = !1;
                return c.override(l, "rescale", function() {
                    l._rescale(), i = void 0
                }), c.override(l, "render", function() {
                    l.round() && n && !o && c.logger.warn("By default, brush rounding is disabled if bars are centered. See dc.js bar chart API documentation for details."), l._render()
                }), l.plotData = function() {
                    var b = l.chartBodyG().selectAll("g.stack").data(l.data());
                    g(), b.enter().append("g").attr("class", function(a, b) {
                        return "stack _" + b
                    }), b.each(function(b, c) {
                        var d = a.select(this);
                        f(d, c, b)
                    })
                }, l.fadeDeselectedArea = function() {
                    var a = l.chartBodyG().selectAll("rect.bar"),
                        b = l.brush().extent();
                    if (l.isOrdinal()) l.hasFilter() ? (a.classed(c.constants.SELECTED_CLASS, function(a) {
                        return l.hasFilter(a.x)
                    }), a.classed(c.constants.DESELECTED_CLASS, function(a) {
                        return !l.hasFilter(a.x)
                    })) : (a.classed(c.constants.SELECTED_CLASS, !1), a.classed(c.constants.DESELECTED_CLASS, !1));
                    else if (l.brushIsEmpty(b)) a.classed(c.constants.DESELECTED_CLASS, !1);
                    else {
                        var d = b[0],
                            e = b[1];
                        a.classed(c.constants.DESELECTED_CLASS, function(a) {
                            return a.x < d || a.x >= e
                        })
                    }
                }, l.centerBar = function(a) {
                    return arguments.length ? (n = a, l) : n
                }, c.override(l, "onClick", function(a) {
                    l._onClick(a.data)
                }), l.barPadding = function(a) {
                    return arguments.length ? (l._rangeBandPadding(a), m = void 0, l) : l._rangeBandPadding()
                }, l._useOuterPadding = function() {
                    return void 0 === m
                }, l.outerPadding = l._outerRangeBandPadding, l.gap = function(a) {
                    return arguments.length ? (m = a, l) : m
                }, l.extendBrush = function() {
                    var a = l.brush().extent();
                    return !l.round() || n && !o || (a[0] = a.map(l.round())[0], a[1] = a.map(l.round())[1], l.chartBodyG().select(".brush").call(l.brush().extent(a))), a
                }, l.alwaysUseRounding = function(a) {
                    return arguments.length ? (o = a, l) : o
                }, l.legendHighlight = function(a) {
                    l.isLegendableHidden(a) || l.g().selectAll("rect.bar").classed("highlight", h(a.color)).classed("fadeout", h(a.color, !0))
                }, l.legendReset = function() {
                    l.g().selectAll("rect.bar").classed("highlight", !1).classed("fadeout", !1)
                }, c.override(l, "xAxisMax", function() {
                    var a = this._xAxisMax();
                    if ("resolution" in l.xUnits()) {
                        var b = l.xUnits().resolution;
                        a += b
                    }
                    return a
                }), l.anchor(b, d)
            }, c.lineChart = function(b, d) {
                function e(a, b) {
                    return z.getColor.call(a, a.values, b)
                }

                function f(b, d) {
                    var f = a.svg.line().x(function(a) {
                        return z.x()(a.x)
                    }).y(function(a) {
                        return z.y()(a.y + a.y0)
                    }).interpolate(F).tension(G);
                    r && f.defined(r);
                    var g = b.append("path").attr("class", "line").attr("stroke", e);
                    s && g.attr("stroke-dasharray", s), c.transition(d.select("path.line"), z.transitionDuration()).attr("stroke", e).attr("d", function(a) {
                        return h(f(a.values))
                    })
                }

                function g(b, d) {
                    if (A) {
                        var f = a.svg.area().x(function(a) {
                            return z.x()(a.x)
                        }).y(function(a) {
                            return z.y()(a.y + a.y0)
                        }).y0(function(a) {
                            return z.y()(a.y0)
                        }).interpolate(F).tension(G);
                        r && f.defined(r), b.append("path").attr("class", "area").attr("fill", e).attr("d", function(a) {
                            return h(f(a.values))
                        }), c.transition(d.select("path.area"), z.transitionDuration()).attr("fill", e).attr("d", function(a) {
                            return h(f(a.values))
                        })
                    }
                }

                function h(a) {
                    return !a || a.indexOf("NaN") >= 0 ? "M0,0" : a
                }

                function i(b, d) {
                    if (!z.brushOn() && z.xyTipsOn()) {
                        var e = u + "-list",
                            f = b.select("g." + e);
                        f.empty() && (f = b.append("g").attr("class", e)), d.each(function(b, d) {
                            var e = b.values;
                            r && (e = e.filter(r));
                            var g = f.select("g." + u + "._" + d);
                            g.empty() && (g = f.append("g").attr("class", u + " _" + d)), j(g);
                            var h = g.selectAll("circle." + v).data(e, c.pluck("x"));
                            h.enter().append("circle").attr("class", v).attr("r", m()).style("fill-opacity", D).style("stroke-opacity", E).on("mousemove", function() {
                                var b = a.select(this);
                                k(b), l(b, g)
                            }).on("mouseout", function() {
                                var b = a.select(this);
                                n(b), o(g)
                            }), h.attr("cx", function(a) {
                                return c.utils.safeNumber(z.x()(a.x))
                            }).attr("cy", function(a) {
                                return c.utils.safeNumber(z.y()(a.y + a.y0))
                            }).attr("fill", z.getColor).call(p, b), h.exit().remove()
                        })
                    }
                }

                function j(a) {
                    var b = a.select("path." + w).empty() ? a.append("path").attr("class", w) : a.select("path." + w);
                    b.style("display", "none").attr("stroke-dasharray", "5,5");
                    var c = a.select("path." + x).empty() ? a.append("path").attr("class", x) : a.select("path." + x);
                    c.style("display", "none").attr("stroke-dasharray", "5,5")
                }

                function k(a) {
                    return a.style("fill-opacity", .8), a.style("stroke-opacity", .8), a.attr("r", B), a
                }

                function l(a, b) {
                    var c = a.attr("cx"),
                        d = a.attr("cy"),
                        e = z._yAxisX() - z.margins().left,
                        f = "M" + e + " " + d + "L" + c + " " + d,
                        g = "M" + c + " " + z.yAxisHeight() + "L" + c + " " + d;
                    b.select("path." + w).style("display", "").attr("d", f), b.select("path." + x).style("display", "").attr("d", g)
                }

                function m() {
                    return C || B
                }

                function n(a) {
                    a.style("fill-opacity", D).style("stroke-opacity", E).attr("r", m())
                }

                function o(a) {
                    a.select("path." + w).style("display", "none"), a.select("path." + x).style("display", "none")
                }

                function p(a, b) {
                    z.renderTitle() && (a.selectAll("title").remove(), a.append("title").text(c.pluck("data", z.title(b.name))))
                }

                function q(b, c, d) {
                    return function() {
                        var e = a.select(this),
                            f = e.attr("stroke") === b && e.attr("stroke-dasharray") === (c instanceof Array ? c.join(",") : null) || e.attr("fill") === b;
                        return d ? !f : f
                    }
                }
                var r, s, t = 5,
                    u = "dc-tooltip",
                    v = "dot",
                    w = "yRef",
                    x = "xRef",
                    y = 1e-6,
                    z = c.stackMixin(c.coordinateGridMixin({})),
                    A = !1,
                    B = t,
                    C = null,
                    D = y,
                    E = y,
                    F = "linear",
                    G = .7,
                    H = !0;
                return z.transitionDuration(500), z._rangeBandPadding(1), z.plotData = function() {
                    var a = z.chartBodyG(),
                        b = a.selectAll("g.stack-list");
                    b.empty() && (b = a.append("g").attr("class", "stack-list"));
                    var c = b.selectAll("g.stack").data(z.data()),
                        d = c.enter().append("g").attr("class", function(a, b) {
                            return "stack _" + b
                        });
                    f(d, c), g(d, c), i(a, c)
                }, z.interpolate = function(a) {
                    return arguments.length ? (F = a, z) : F
                }, z.tension = function(a) {
                    return arguments.length ? (G = a, z) : G
                }, z.defined = function(a) {
                    return arguments.length ? (r = a, z) : r
                }, z.dashStyle = function(a) {
                    return arguments.length ? (s = a, z) : s
                }, z.renderArea = function(a) {
                    return arguments.length ? (A = a, z) : A
                }, z.xyTipsOn = function(a) {
                    return arguments.length ? (H = a, z) : H
                }, z.dotRadius = function(a) {
                    return arguments.length ? (B = a, z) : B
                }, z.renderDataPoints = function(a) {
                    return arguments.length ? (a ? (D = a.fillOpacity || .8, E = a.strokeOpacity || .8, C = a.radius || 2) : (D = y, E = y, C = null), z) : {
                        fillOpacity: D,
                        strokeOpacity: E,
                        radius: C
                    }
                }, z.legendHighlight = function(a) {
                    z.isLegendableHidden(a) || z.g().selectAll("path.line, path.area").classed("highlight", q(a.color, a.dashstyle)).classed("fadeout", q(a.color, a.dashstyle, !0))
                }, z.legendReset = function() {
                    z.g().selectAll("path.line, path.area").classed("highlight", !1).classed("fadeout", !1)
                }, c.override(z, "legendables", function() {
                    var a = z._legendables();
                    return s ? a.map(function(a) {
                        return a.dashstyle = s, a
                    }) : a
                }), z.anchor(b, d)
            }, c.dataCount = function(b, d) {
                var e = a.format(",d"),
                    f = c.baseMixin({}),
                    g = {
                        some: "",
                        all: ""
                    };
                return f.html = function(a) {
                    return arguments.length ? (a.all && (g.all = a.all), a.some && (g.some = a.some), f) : g
                }, f.formatNumber = function(a) {
                    return arguments.length ? (e = a, f) : e
                }, f._doRender = function() {
                    var a = f.dimension().size(),
                        b = f.group().value(),
                        c = e(a),
                        d = e(b);
                    return a === b && "" !== g.all ? f.root().html(g.all.replace("%total-count", c).replace("%filter-count", d)) : "" !== g.some ? f.root().html(g.some.replace("%total-count", c).replace("%filter-count", d)) : (f.selectAll(".total-count").text(c), f.selectAll(".filter-count").text(d)), f
                }, f._doRedraw = function() {
                    return f._doRender()
                }, f.anchor(b, d)
            }, c.dataTable = function(b, d) {
                function e() {
                    var a = !0;
                    if (o.forEach(function(b) {
                            a &= "function" == typeof b
                        }), !a) {
                        m.selectAll("th").remove();
                        var b = m.root().selectAll("th").data(o),
                            c = b.enter().append("th");
                        c.attr("class", l).html(function(a) {
                            return m._doColumnHeaderFormat(a)
                        })
                    }
                    var d = m.root().selectAll("tbody").data(f(), function(a) {
                            return m.keyAccessor()(a)
                        }),
                        e = d.enter().append("tbody");
                    return e.append("tr").attr("class", k).append("td").attr("class", h).attr("colspan", o.length).html(function(a) {
                        return m.keyAccessor()(a)
                    }), d.exit().remove(), e
                }

                function f() {
                    var b;
                    return b = q === a.ascending ? m.dimension().bottom(n) : m.dimension().top(n), a.nest().key(m.group()).sortKeys(q).entries(b.sort(function(a, b) {
                        return q(p(a), p(b))
                    }))
                }

                function g(a) {
                    var b = a.order().selectAll("tr." + i).data(function(a) {
                            return a.values
                        }),
                        c = b.enter().append("tr").attr("class", i);
                    return o.forEach(function(a, b) {
                        c.append("td").attr("class", j + " _" + b).html(function(b) {
                            return m._doColumnValueFormat(a, b)
                        })
                    }), b.exit().remove(), b
                }
                var h = "dc-table-label",
                    i = "dc-table-row",
                    j = "dc-table-column",
                    k = "dc-table-group",
                    l = "dc-table-head",
                    m = c.baseMixin({}),
                    n = 25,
                    o = [],
                    p = function(a) {
                        return a
                    },
                    q = a.ascending;
                return m._doRender = function() {
                    return m.selectAll("tbody").remove(), g(e()), m
                }, m._doColumnValueFormat = function(a, b) {
                    return "function" == typeof a ? a(b) : "string" == typeof a ? b[a] : a.format(b)
                }, m._doColumnHeaderFormat = function(a) {
                    return "function" == typeof a ? m._doColumnHeaderFnToString(a) : "string" == typeof a ? m._doColumnHeaderCapitalize(a) : String(a.label)
                }, m._doColumnHeaderCapitalize = function(a) {
                    return a.charAt(0).toUpperCase() + a.slice(1)
                }, m._doColumnHeaderFnToString = function(a) {
                    var b = String(a),
                        c = b.indexOf("return ");
                    if (c >= 0) {
                        var d = b.lastIndexOf(";");
                        if (d >= 0) {
                            b = b.substring(c + 7, d);
                            var e = b.indexOf("numberFormat");
                            e >= 0 && (b = b.replace("numberFormat", ""))
                        }
                    }
                    return b
                }, m._doRedraw = function() {
                    return m._doRender()
                }, m.size = function(a) {
                    return arguments.length ? (n = a, m) : n
                }, m.columns = function(a) {
                    return arguments.length ? (o = a, m) : o
                }, m.sortBy = function(a) {
                    return arguments.length ? (p = a, m) : p
                }, m.order = function(a) {
                    return arguments.length ? (q = a, m) : q
                }, m.anchor(b, d)
            }, c.dataGrid = function(b, d) {
                function e() {
                    var a = l.root().selectAll("div." + k).data(f(), function(a) {
                            return l.keyAccessor()(a)
                        }),
                        b = a.enter().append("div").attr("class", k);
                    return q && b.html(function(a) {
                        return q(a)
                    }), a.exit().remove(), b
                }

                function f() {
                    var b = l.dimension().top(m);
                    return a.nest().key(l.group()).sortKeys(p).entries(b.sort(function(a, b) {
                        return p(o(a), o(b))
                    }))
                }

                function g(a) {
                    var b = a.order().selectAll("div." + i).data(function(a) {
                        return a.values
                    });
                    return b.enter().append("div").attr("class", i).html(function(a) {
                        return n(a)
                    }), b.exit().remove(), b
                }
                var h = "dc-grid-label",
                    i = "dc-grid-item",
                    j = "dc-grid-group",
                    k = "dc-grid-top",
                    l = c.baseMixin({}),
                    m = 999,
                    n = function(a) {
                        return "you need to provide an html() handling param:  " + JSON.stringify(a)
                    },
                    o = function(a) {
                        return a
                    },
                    p = a.ascending,
                    q = function(a) {
                        return "<div class='" + j + "'><h1 class='" + h + "'>" + l.keyAccessor()(a) + "</h1></div>"
                    };
                return l._doRender = function() {
                    return l.selectAll("div." + k).remove(), g(e()), l
                }, l._doRedraw = function() {
                    return l._doRender()
                }, l.size = function(a) {
                    return arguments.length ? (m = a, l) : m
                }, l.html = function(a) {
                    return arguments.length ? (n = a, l) : n
                }, l.htmlGroup = function(a) {
                    return arguments.length ? (q = a, l) : q
                }, l.sortBy = function(a) {
                    return arguments.length ? (o = a, l) : o
                }, l.order = function(a) {
                    return arguments.length ? (p = a, l) : p
                }, l.anchor(b, d)
            }, c.bubbleChart = function(a, b) {
                function d(a) {
                    var b = a.enter().append("g");
                    b.attr("class", i.BUBBLE_NODE_CLASS).attr("transform", k).append("circle").attr("class", function(a, b) {
                        return i.BUBBLE_CLASS + " _" + b
                    }).on("click", i.onClick).attr("fill", i.getColor).attr("r", 0), c.transition(a, i.transitionDuration()).selectAll("circle." + i.BUBBLE_CLASS).attr("r", function(a) {
                        return i.bubbleR(a)
                    }).attr("opacity", function(a) {
                        return i.bubbleR(a) > 0 ? 1 : 0
                    }), i._doRenderLabel(b), i._doRenderTitles(b)
                }

                function e(a) {
                    c.transition(a, i.transitionDuration()).attr("transform", k).selectAll("circle." + i.BUBBLE_CLASS).attr("fill", i.getColor).attr("r", function(a) {
                        return i.bubbleR(a)
                    }).attr("opacity", function(a) {
                        return i.bubbleR(a) > 0 ? 1 : 0
                    }), i.doUpdateLabels(a), i.doUpdateTitles(a)
                }

                function f(a) {
                    a.exit().remove()
                }

                function g(a) {
                    var b = i.x()(i.keyAccessor()(a));
                    return isNaN(b) && (b = 0), b
                }

                function h(a) {
                    var b = i.y()(i.valueAccessor()(a));
                    return isNaN(b) && (b = 0), b
                }
                var i = c.bubbleMixin(c.coordinateGridMixin({})),
                    j = !1;
                i.transitionDuration(750);
                var k = function(a) {
                    return "translate(" + g(a) + "," + h(a) + ")"
                };
                return i.elasticRadius = function(a) {
                    return arguments.length ? (j = a, i) : j
                }, i.plotData = function() {
                    j && i.r().domain([i.rMin(), i.rMax()]), i.r().range([i.MIN_RADIUS, i.xAxisLength() * i.maxBubbleRelativeSize()]);
                    var a = i.chartBodyG().selectAll("g." + i.BUBBLE_NODE_CLASS).data(i.data(), function(a) {
                        return a.key
                    });
                    d(a), e(a), f(a), i.fadeDeselectedArea()
                }, i.renderBrush = function() {}, i.redrawBrush = function() {
                    i.fadeDeselectedArea()
                }, i.anchor(a, b)
            }, c.compositeChart = function(b, d) {
                function e() {
                    (void 0 === u.rightY() || u.elasticY()) && (u.rightY(a.scale.linear()), u.rightY().domain([l(), o()]).rangeRound([u.yAxisHeight(), 0])), u.rightY().range([u.yAxisHeight(), 0]), u.rightYAxis(u.rightYAxis().scale(u.rightY())), u.rightYAxis().orient("right")
                }

                function f() {
                    (void 0 === u.y() || u.elasticY()) && (u.y(a.scale.linear()), u.y().domain([k(), n()]).rangeRound([u.yAxisHeight(), 0])), u.y().range([u.yAxisHeight(), 0]), u.yAxis(u.yAxis().scale(u.y())), u.yAxis().orient("left")
                }

                function g(a, b) {
                    a._generateG(u.g()), a.g().attr("class", s + " _" + b)
                }

                function h() {
                    return v.filter(function(a) {
                        return !a.useRightYAxis()
                    })
                }

                function i() {
                    return v.filter(function(a) {
                        return a.useRightYAxis()
                    })
                }

                function j(a) {
                    return a.map(function(a) {
                        return a.yAxisMin()
                    })
                }

                function k() {
                    return a.min(j(h()))
                }

                function l() {
                    return a.min(j(i()))
                }

                function m(a) {
                    return a.map(function(a) {
                        return a.yAxisMax()
                    })
                }

                function n() {
                    return c.utils.add(a.max(m(h())), u.yAxisPadding())
                }

                function o() {
                    return c.utils.add(a.max(m(i())), u.yAxisPadding())
                }

                function p() {
                    return v.map(function(a) {
                        return a.xAxisMin()
                    })
                }

                function q() {
                    return v.map(function(a) {
                        return a.xAxisMax()
                    })
                }
                var r, s = "sub",
                    t = 12,
                    u = c.coordinateGridMixin({}),
                    v = [],
                    w = {},
                    x = !1,
                    y = !0,
                    z = a.svg.axis(),
                    A = 0,
                    B = t,
                    C = !1;
                return u._mandatoryAttributes([]), u.transitionDuration(500), c.override(u, "_generateG", function() {
                    for (var a = this.__generateG(), b = 0; b < v.length; ++b) {
                        var c = v[b];
                        g(c, b), c.dimension() || c.dimension(u.dimension()), c.group() || c.group(u.group()), c.chartGroup(u.chartGroup()), c.svg(u.svg()), c.xUnits(u.xUnits()), c.transitionDuration(u.transitionDuration()), c.brushOn(u.brushOn()), c.renderTitle(u.renderTitle())
                    }
                    return a
                }), u._brushing = function() {
                    for (var a = u.extendBrush(), b = u.brushIsEmpty(a), c = 0; c < v.length; ++c) v[c].filter(null), b || v[c].filter(a)
                }, u._prepareYAxis = function() {
                    0 !== h().length && f(), 0 !== i().length && e(), h().length > 0 && !C ? u._renderHorizontalGridLinesForAxis(u.g(), u.y(), u.yAxis()) : i().length > 0 && u._renderHorizontalGridLinesForAxis(u.g(), r, z)
                }, u.renderYAxis = function() {
                    0 !== h().length && (u.renderYAxisAt("y", u.yAxis(), u.margins().left), u.renderYAxisLabel("y", u.yAxisLabel(), -90)), 0 !== i().length && (u.renderYAxisAt("yr", u.rightYAxis(), u.width() - u.margins().right), u.renderYAxisLabel("yr", u.rightYAxisLabel(), 90, u.width() - B))
                }, u.plotData = function() {
                    for (var a = 0; a < v.length; ++a) {
                        var b = v[a];
                        b.g() || g(b, a), x && b.colors(u.colors()), b.x(u.x()), b.xAxis(u.xAxis()), b.useRightYAxis() ? (b.y(u.rightY()), b.yAxis(u.rightYAxis())) : (b.y(u.y()), b.yAxis(u.yAxis())), b.plotData(), b._activateRenderlets()
                    }
                }, u.useRightAxisGridLines = function(a) {
                    return arguments ? (C = a, u) : C
                }, u.childOptions = function(a) {
                    return arguments.length ? (w = a, v.forEach(function(a) {
                        a.options(w)
                    }), u) : w
                }, u.fadeDeselectedArea = function() {
                    for (var a = 0; a < v.length; ++a) {
                        var b = v[a];
                        b.brush(u.brush()), b.fadeDeselectedArea()
                    }
                }, u.rightYAxisLabel = function(a, b) {
                    return arguments.length ? (A = a, u.margins().right -= B, B = void 0 === b ? t : b, u.margins().right += B, u) : A
                }, u.compose = function(a) {
                    return v = a, v.forEach(function(a) {
                        a.height(u.height()), a.width(u.width()), a.margins(u.margins()), y && a.title(u.title()), a.options(w)
                    }), u
                }, u.children = function() {
                    return v
                }, u.shareColors = function(a) {
                    return arguments.length ? (x = a, u) : x
                }, u.shareTitle = function(a) {
                    return arguments.length ? (y = a, u) : y
                }, u.rightY = function(a) {
                    return arguments.length ? (r = a, u) : r
                }, delete u.yAxisMin, delete u.yAxisMax, c.override(u, "xAxisMin", function() {
                    return c.utils.subtract(a.min(p()), u.xAxisPadding())
                }), c.override(u, "xAxisMax", function() {
                    return c.utils.add(a.max(q()), u.xAxisPadding())
                }), u.legendables = function() {
                    return v.reduce(function(a, b) {
                        return x && b.colors(u.colors()), a.push.apply(a, b.legendables()), a
                    }, [])
                }, u.legendHighlight = function(a) {
                    for (var b = 0; b < v.length; ++b) {
                        var c = v[b];
                        c.legendHighlight(a)
                    }
                }, u.legendReset = function(a) {
                    for (var b = 0; b < v.length; ++b) {
                        var c = v[b];
                        c.legendReset(a)
                    }
                }, u.legendToggle = function() {
                    console.log("composite should not be getting legendToggle itself")
                }, u.rightYAxis = function(a) {
                    return arguments.length ? (z = a, u) : z
                }, u.anchor(b, d)
            }, c.seriesChart = function(b, d) {
                function e(b, c) {
                    return a.ascending(i.keyAccessor()(b), i.keyAccessor()(c))
                }

                function f(a) {
                    j[a].g() && j[a].g().remove(), delete j[a]
                }

                function g() {
                    Object.keys(j).map(f), j = {}
                }
                var h, i = c.compositeChart(b, d),
                    j = {},
                    k = c.lineChart,
                    l = a.ascending,
                    m = e;
                return i._mandatoryAttributes().push("seriesAccessor", "chart"), i.shareColors(!0), i._preprocessData = function() {
                    var b, c = [],
                        e = a.nest().key(h);
                    l && e.sortKeys(l), m && e.sortValues(m);
                    var g = e.entries(i.data()),
                        n = g.map(function(e, f) {
                            var g = j[e.key] || k.call(i, i, d, e.key, f);
                            return j[e.key] || (b = !0), j[e.key] = g, c.push(e.key), g.dimension(i.dimension()).group({
                                all: a.functor(e.values)
                            }, e.key).keyAccessor(i.keyAccessor()).valueAccessor(i.valueAccessor()).brushOn(i.brushOn())
                        });
                    Object.keys(j).filter(function(a) {
                        return -1 === c.indexOf(a)
                    }).forEach(function(a) {
                        f(a), b = !0
                    }), i._compose(n), b && i.legend() && i.legend().render()
                }, i.chart = function(a) {
                    return arguments.length ? (k = a, g(), i) : k
                }, i.seriesAccessor = function(a) {
                    return arguments.length ? (h = a, g(), i) : h
                }, i.seriesSort = function(a) {
                    return arguments.length ? (l = a, g(), i) : l
                }, i.valueSort = function(a) {
                    return arguments.length ? (m = a, g(), i) : m
                }, i._compose = i.compose, delete i.compose, i
            }, c.geoChoroplethChart = function(b, d) {
                function e(a) {
                    var b = f();
                    if (g(a)) {
                        var c = h(a);
                        n(c, a, b), o(c, a, b)
                    }
                }

                function f() {
                    for (var a = {}, b = p.data(), c = 0; c < b.length; ++c) a[p.keyAccessor()(b[c])] = p.valueAccessor()(b[c]);
                    return a
                }

                function g(a) {
                    return m(a).keyAccessor
                }

                function h(a) {
                    var b = p.svg().selectAll(i(a)).classed("selected", function(b) {
                        return j(a, b)
                    }).classed("deselected", function(b) {
                        return k(a, b)
                    }).attr("class", function(b) {
                        var d = m(a).name,
                            e = c.utils.nameToId(m(a).keyAccessor(b)),
                            f = d + " " + e;
                        return j(a, b) && (f += " selected"), k(a, b) && (f += " deselected"), f
                    });
                    return b
                }

                function i(a) {
                    return "g.layer" + a + " g." + m(a).name
                }

                function j(a, b) {
                    return p.hasFilter() && p.hasFilter(l(a, b))
                }

                function k(a, b) {
                    return p.hasFilter() && !p.hasFilter(l(a, b))
                }

                function l(a, b) {
                    return m(a).keyAccessor(b)
                }

                function m(a) {
                    return s[a]
                }

                function n(b, d, e) {
                    var f = b.select("path").attr("fill", function() {
                        var b = a.select(this).attr("fill");
                        return b ? b : "none"
                    }).on("click", function(a) {
                        return p.onClick(a, d)
                    });
                    c.transition(f, p.transitionDuration()).attr("fill", function(a, b) {
                        return p.getColor(e[m(d).keyAccessor(a)], b)
                    })
                }

                function o(a, b, c) {
                    p.renderTitle() && a.selectAll("title").text(function(a) {
                        var d = l(b, a),
                            e = c[d];
                        return p.title()({
                            key: d,
                            value: e
                        })
                    })
                }
                var p = c.colorMixin(c.baseMixin({}));
                p.colorAccessor(function(a) {
                    return a || 0
                });
                var q, r = a.geo.path(),
                    s = [];
                return p._doRender = function() {
                    p.resetSvg();
                    for (var a = 0; a < s.length; ++a) {
                        var b = p.svg().append("g").attr("class", "layer" + a),
                            c = b.selectAll("g." + m(a).name).data(m(a).data).enter().append("g").attr("class", m(a).name);
                        c.append("path").attr("fill", "white").attr("d", r), c.append("title"), e(a)
                    }
                    q = !1
                }, p.onClick = function(a, b) {
                    var d = m(b).keyAccessor(a);
                    c.events.trigger(function() {
                        p.filter(d), p.redrawGroup()
                    })
                }, p._doRedraw = function() {
                    for (var a = 0; a < s.length; ++a) e(a), q && p.svg().selectAll("g." + m(a).name + " path").attr("d", r);
                    q = !1
                }, p.overlayGeoJson = function(a, b, c) {
                    for (var d = 0; d < s.length; ++d)
                        if (s[d].name === b) return s[d].data = a, s[d].keyAccessor = c, p;
                    return s.push({
                        name: b,
                        data: a,
                        keyAccessor: c
                    }), p
                }, p.projection = function(a) {
                    return r.projection(a), q = !0, p
                }, p.geoJsons = function() {
                    return s
                }, p.geoPath = function() {
                    return r
                }, p.removeGeoJson = function(a) {
                    for (var b = [], c = 0; c < s.length; ++c) {
                        var d = s[c];
                        d.name !== a && b.push(d)
                    }
                    return s = b, p
                }, p.anchor(b, d)
            }, c.bubbleOverlay = function(b, d) {
                function e() {
                    return j = n.select("g." + k), j.empty() && (j = n.svg().append("g").attr("class", k)), j
                }

                function f() {
                    var a = g();
                    o.forEach(function(b) {
                        var d = h(b, a),
                            e = d.select("circle." + m);
                        e.empty() && (e = d.append("circle").attr("class", m).attr("r", 0).attr("fill", n.getColor).on("click", n.onClick)), c.transition(e, n.transitionDuration()).attr("r", function(a) {
                            return n.bubbleR(a)
                        }), n._doRenderLabel(d), n._doRenderTitles(d)
                    })
                }

                function g() {
                    var a = {};
                    return n.data().forEach(function(b) {
                        a[n.keyAccessor()(b)] = b
                    }), a
                }

                function h(a, b) {
                    var d = l + " " + c.utils.nameToId(a.name),
                        e = j.select("g." + c.utils.nameToId(a.name));
                    return e.empty() && (e = j.append("g").attr("class", d).attr("transform", "translate(" + a.x + "," + a.y + ")")), e.datum(b[a.name]), e
                }

                function i() {
                    var a = g();
                    o.forEach(function(b) {
                        var d = h(b, a),
                            e = d.select("circle." + m);
                        c.transition(e, n.transitionDuration()).attr("r", function(a) {
                            return n.bubbleR(a)
                        }).attr("fill", n.getColor), n.doUpdateLabels(d), n.doUpdateTitles(d)
                    })
                }
                var j, k = "bubble-overlay",
                    l = "node",
                    m = "bubble",
                    n = c.bubbleMixin(c.baseMixin({})),
                    o = [];
                return n.transitionDuration(750), n.radiusValueAccessor(function(a) {
                    return a.value
                }), n.point = function(a, b, c) {
                    return o.push({
                        name: a,
                        x: b,
                        y: c
                    }), n
                }, n._doRender = function() {
                    return j = e(), n.r().range([n.MIN_RADIUS, n.width() * n.maxBubbleRelativeSize()]), f(), n.fadeDeselectedArea(), n
                }, n._doRedraw = function() {
                    return i(), n.fadeDeselectedArea(), n
                }, n.debug = function(b) {
                    if (b) {
                        var d = n.select("g." + c.constants.DEBUG_GROUP_CLASS);
                        d.empty() && (d = n.svg().append("g").attr("class", c.constants.DEBUG_GROUP_CLASS));
                        var e = d.append("text").attr("x", 10).attr("y", 20);
                        d.append("rect").attr("width", n.width()).attr("height", n.height()).on("mousemove", function() {
                            var b = a.mouse(d.node()),
                                c = b[0] + ", " + b[1];
                            e.text(c)
                        })
                    } else n.selectAll(".debug").remove();
                    return n
                }, n.anchor(b, d), n
            }, c.rowChart = function(b, d) {
                function e() {
                    if (!t || u) {
                        var b = a.extent(v, G.cappedValueAccessor);
                        b[0] > 0 && (b[0] = 0), t = a.scale.linear().domain(b).range([0, G.effectiveWidth()])
                    }
                    H.scale(t)
                }

                function f() {
                    var a = s.select("g.axis");
                    e(), a.empty() && (a = s.append("g").attr("class", "axis").attr("transform", "translate(0, " + G.effectiveHeight() + ")")), c.transition(a, G.transitionDuration()).call(H)
                }

                function g() {
                    s.selectAll("g.tick").select("line.grid-line").remove(), s.selectAll("g.tick").append("line").attr("class", "grid-line").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", function() {
                        return -G.effectiveHeight()
                    })
                }

                function h() {
                    v = G.data(), f(), g();
                    var a = s.selectAll("g." + D).data(v);
                    i(a), j(a), l(a)
                }

                function i(a) {
                    var b = a.enter().append("g").attr("class", function(a, b) {
                        return D + " _" + b
                    });
                    b.append("rect").attr("width", 0), n(b), o(a)
                }

                function j(a) {
                    a.exit().remove()
                }

                function k() {
                    var a = t(0);
                    return a === -1 / 0 || a !== a ? t(1) : a
                }

                function l(a) {
                    var b, d = v.length;
                    b = C ? C : (G.effectiveHeight() - (d + 1) * B) / d, y || (x = b / 2);
                    var e = a.attr("transform", function(a, c) {
                        return "translate(0," + ((c + 1) * B + c * b) + ")"
                    }).select("rect").attr("height", b).attr("fill", G.getColor).on("click", p).classed("deselected", function(a) {
                        return G.hasFilter() ? !r(a) : !1
                    }).classed("selected", function(a) {
                        return G.hasFilter() ? r(a) : !1
                    });
                    c.transition(e, G.transitionDuration()).attr("width", function(a) {
                        return Math.abs(k() - t(G.valueAccessor()(a)))
                    }).attr("transform", q), m(a), o(a)
                }

                function m(a) {
                    G.renderTitle() && (a.selectAll("title").remove(), a.append("title").text(G.title()))
                }

                function n(a) {
                    G.renderLabel() && a.append("text").on("click", p), G.renderTitleLabel() && a.append("text").attr("class", E).on("click", p)
                }

                function o(a) {
                    if (G.renderLabel()) {
                        var b = a.select("text").attr("x", w).attr("y", x).attr("dy", z).on("click", p).attr("class", function(a, b) {
                            return D + " _" + b
                        }).text(function(a) {
                            return G.label()(a)
                        });
                        c.transition(b, G.transitionDuration()).attr("transform", q)
                    }
                    if (G.renderTitleLabel()) {
                        var d = a.select("." + E).attr("x", G.effectiveWidth() - A).attr("y", x).attr("text-anchor", "end").on("click", p).attr("class", function(a, b) {
                            return E + " _" + b
                        }).text(function(a) {
                            return G.title()(a)
                        });
                        c.transition(d, G.transitionDuration()).attr("transform", q)
                    }
                }

                function p(a) {
                    G.onClick(a)
                }

                function q(a) {
                    var b = t(G.cappedValueAccessor(a)),
                        c = k(),
                        d = b > c ? c : b;
                    return "translate(" + d + ",0)"
                }

                function r(a) {
                    return G.hasFilter(G.cappedKeyAccessor(a))
                }
                var s, t, u, v, w = 10,
                    x = 15,
                    y = !1,
                    z = "0.35em",
                    A = 2,
                    B = 5,
                    C = !1,
                    D = "row",
                    E = "titlerow",
                    F = !1,
                    G = c.capMixin(c.marginMixin(c.colorMixin(c.baseMixin({})))),
                    H = a.svg.axis().orient("bottom");
                return G.rowsCap = G.cap, G._doRender = function() {
                    return G.resetSvg(), s = G.svg().append("g").attr("transform", "translate(" + G.margins().left + "," + G.margins().top + ")"), h(), G
                }, G.title(function(a) {
                    return G.cappedKeyAccessor(a) + ": " + G.cappedValueAccessor(a)
                }), G.label(G.cappedKeyAccessor), G.x = function(a) {
                    return arguments.length ? (t = a, G) : t
                }, G.renderTitleLabel = function(a) {
                    return arguments.length ? (F = a, G) : F
                }, G._doRedraw = function() {
                    return h(), G
                }, G.xAxis = function() {
                    return H
                }, G.fixedBarHeight = function(a) {
                    return arguments.length ? (C = a, G) : C
                }, G.gap = function(a) {
                    return arguments.length ? (B = a, G) : B
                }, G.elasticX = function(a) {
                    return arguments.length ? (u = a, G) : u
                }, G.labelOffsetX = function(a) {
                    return arguments.length ? (w = a, G) : w
                }, G.labelOffsetY = function(a) {
                    return arguments.length ? (x = a, y = !0, G) : x
                }, G.titleLabelOffsetX = function(a) {
                    return arguments.length ? (A = a, G) : A
                }, G.anchor(b, d)
            }, c.legend = function() {
                function a() {
                    return j + i
                }
                var b, d, e = 2,
                    f = {},
                    g = 0,
                    h = 0,
                    i = 12,
                    j = 5,
                    k = !1,
                    l = 560,
                    m = 70,
                    n = !1;
                return f.parent = function(a) {
                    return arguments.length ? (b = a, f) : b
                }, f.render = function() {
                    b.svg().select("g.dc-legend").remove(), d = b.svg().append("g").attr("class", "dc-legend").attr("transform", "translate(" + g + "," + h + ")");
                    var f = b.legendables(),
                        o = d.selectAll("g.dc-legend-item").data(f).enter().append("g").attr("class", "dc-legend-item").on("mouseover", function(a) {
                            b.legendHighlight(a)
                        }).on("mouseout", function(a) {
                            b.legendReset(a)
                        }).on("click", function(a) {
                            a.chart.legendToggle(a)
                        });
                    d.selectAll("g.dc-legend-item").classed("fadeout", function(a) {
                        return a.chart.isLegendableHidden(a)
                    }), f.some(c.pluck("dashstyle")) ? o.append("line").attr("x1", 0).attr("y1", i / 2).attr("x2", i).attr("y2", i / 2).attr("stroke-width", 2).attr("stroke-dasharray", c.pluck("dashstyle")).attr("stroke", c.pluck("color")) : o.append("rect").attr("width", i).attr("height", i).attr("fill", function(a) {
                        return a ? a.color : "blue"
                    }), o.append("text").text(c.pluck("name")).attr("x", i + e).attr("y", function() {
                        return i / 2 + (this.clientHeight ? this.clientHeight : 13) / 2 - 2
                    });
                    var p = 0,
                        q = 0;
                    o.attr("transform", function(b, c) {
                        if (k) {
                            var d = "translate(" + p + "," + q * a() + ")",
                                e = n === !0 ? this.getBBox().width + j : m;
                            return p + e >= l ? (++q, p = 0) : p += e, d
                        }
                        return "translate(0," + c * a() + ")"
                    })
                }, f.x = function(a) {
                    return arguments.length ? (g = a, f) : g
                }, f.y = function(a) {
                    return arguments.length ? (h = a, f) : h
                }, f.gap = function(a) {
                    return arguments.length ? (j = a, f) : j
                }, f.itemHeight = function(a) {
                    return arguments.length ? (i = a, f) : i
                }, f.horizontal = function(a) {
                    return arguments.length ? (k = a, f) : k
                }, f.legendWidth = function(a) {
                    return arguments.length ? (l = a, f) : l
                }, f.itemWidth = function(a) {
                    return arguments.length ? (m = a, f) : m
                }, f.autoItemWidth = function(a) {
                    return arguments.length ? (n = a, f) : n
                }, f
            }, c.scatterPlot = function(b, d) {
                function e(b, d) {
                    var e = g.selectAll(".chart-body path.symbol").filter(function() {
                            return b(a.select(this))
                        }),
                        f = h.size();
                    h.size(Math.pow(d, 2)), c.transition(e, g.transitionDuration()).attr("d", h), h.size(f)
                }

                function f(a) {
                    var b = g.selectAll(".chart-body path.symbol").each(function(b) {
                        this.filtered = a && a.isFiltered(b.key)
                    });
                    c.transition(b, g.transitionDuration()).attr("d", h)
                }
                var g = c.coordinateGridMixin({}),
                    h = a.svg.symbol(),
                    i = function(a) {
                        return a.value
                    },
                    j = g.keyAccessor();
                g.keyAccessor(function(a) {
                    return j(a)[0]
                }), g.valueAccessor(function(a) {
                    return j(a)[1]
                }), g.colorAccessor(function() {
                    return g._groupName
                });
                var k = function(a) {
                        return "translate(" + g.x()(g.keyAccessor()(a)) + "," + g.y()(g.valueAccessor()(a)) + ")"
                    },
                    l = 3,
                    m = 5,
                    n = 0;
                return h.size(function(a) {
                    return i(a) ? this.filtered ? Math.pow(m, 2) : Math.pow(l, 2) : n
                }), c.override(g, "_filter", function(a) {
                    return arguments.length ? g.__filter(c.filters.RangedTwoDimensionalFilter(a)) : g.__filter()
                }), g.plotData = function() {
                    var a = g.chartBodyG().selectAll("path.symbol").data(g.data());
                    a.enter().append("path").attr("class", "symbol").attr("opacity", 0).attr("fill", g.getColor).attr("transform", k), c.transition(a, g.transitionDuration()).attr("opacity", function(a) {
                        return i(a) ? 1 : 0
                    }).attr("fill", g.getColor).attr("transform", k).attr("d", h), c.transition(a.exit(), g.transitionDuration()).attr("opacity", 0).remove()
                }, g.existenceAccessor = function(a) {
                    return arguments.length ? (i = a, this) : i
                }, g.symbol = function(a) {
                    return arguments.length ? (h.type(a), g) : h.type()
                }, g.symbolSize = function(a) {
                    return arguments.length ? (l = a, g) : l
                }, g.highlightedSize = function(a) {
                    return arguments.length ? (m = a, g) : m
                }, g.hiddenSize = function(a) {
                    return arguments.length ? (n = a, g) : n
                }, g.legendables = function() {
                    return [{
                        chart: g,
                        name: g._groupName,
                        color: g.getColor()
                    }]
                }, g.legendHighlight = function(b) {
                    e(function(a) {
                        return a.attr("fill") === b.color
                    }, m), g.selectAll(".chart-body path.symbol").filter(function() {
                        return a.select(this).attr("fill") !== b.color
                    }).classed("fadeout", !0)
                }, g.legendReset = function(b) {
                    e(function(a) {
                        return a.attr("fill") === b.color
                    }, l), g.selectAll(".chart-body path.symbol").filter(function() {
                        return a.select(this).attr("fill") !== b.color
                    }).classed("fadeout", !1)
                }, g.setHandlePaths = function() {}, g.extendBrush = function() {
                    var a = g.brush().extent();
                    return g.round() && (a[0] = a[0].map(g.round()), a[1] = a[1].map(g.round()), g.g().select(".brush").call(g.brush().extent(a))), a
                }, g.brushIsEmpty = function(a) {
                    return g.brush().empty() || !a || a[0][0] >= a[1][0] || a[0][1] >= a[1][1]
                }, g._brushing = function() {
                    var a = g.extendBrush();
                    if (g.redrawBrush(g.g()), g.brushIsEmpty(a)) c.events.trigger(function() {
                        g.filter(null), g.redrawGroup()
                    }), f(!1);
                    else {
                        var b = c.filters.RangedTwoDimensionalFilter(a);
                        c.events.trigger(function() {
                            g.filter(null), g.filter(b), g.redrawGroup()
                        }, c.constants.EVENT_DELAY), f(b)
                    }
                }, g.setBrushY = function(a) {
                    a.call(g.brush().y(g.y()))
                }, g.anchor(b, d)
            }, c.numberDisplay = function(b, d) {
                var e = "number-display",
                    f = a.format(".2s"),
                    g = c.baseMixin({}),
                    h = {
                        one: "",
                        some: "",
                        none: ""
                    };
                return g._mandatoryAttributes(["group"]), g.html = function(a) {
                    return arguments.length ? (a.none ? h.none = a.none : a.one ? h.none = a.one : a.some && (h.none = a.some), a.one ? h.one = a.one : a.some && (h.one = a.some), a.some ? h.some = a.some : a.one && (h.some = a.one), g) : h
                }, g.value = function() {
                    return g.data()
                }, g.data(function(a) {
                    var b = a.value ? a.value() : a.top(1)[0];
                    return g.valueAccessor()(b)
                }), g.transitionDuration(250), g._doRender = function() {
                    var b = g.value(),
                        c = g.selectAll("." + e);
                    c.empty() && (c = c.data([0]).enter().append("span").attr("class", e)), c.transition().duration(g.transitionDuration()).ease("quad-out-in").tween("text", function() {
                        var c = a.interpolateNumber(this.lastValue || 0, b);
                        return this.lastValue = b,
                            function(a) {
                                var d = null,
                                    e = g.formatNumber()(c(a));
                                0 === b && "" !== h.none ? d = h.none : 1 === b && "" !== h.one ? d = h.one : "" !== h.some && (d = h.some), this.innerHTML = d ? d.replace("%number", e) : e
                            }
                    })
                }, g._doRedraw = function() {
                    return g._doRender()
                }, g.formatNumber = function(a) {
                    return arguments.length ? (f = a, g) : f
                }, g.anchor(b, d)
            }, c.heatMap = function(b, d) {
                function e(a, b) {
                    var d = p.selectAll(".box-group").filter(function(c) {
                            return c.key[a] === b
                        }),
                        e = d.filter(function(a) {
                            return !p.hasFilter(a.key)
                        });
                    c.events.trigger(function() {
                        e.empty() ? d.each(function(a) {
                            p.filter(a.key)
                        }) : e.each(function(a) {
                            p.filter(a.key)
                        }), p.redrawGroup()
                    })
                }
                var f, g, h, i = 6.75,
                    j = a.ascending,
                    k = a.ascending,
                    l = a.scale.ordinal(),
                    m = a.scale.ordinal(),
                    n = i,
                    o = i,
                    p = c.colorMixin(c.marginMixin(c.baseMixin({})));
                p._mandatoryAttributes(["group"]), p.title(p.colorAccessor());
                var q = function(a) {
                        return a
                    },
                    r = function(a) {
                        return a
                    };
                p.colsLabel = function(a) {
                    return arguments.length ? (q = a, p) : q
                }, p.rowsLabel = function(a) {
                    return arguments.length ? (r = a, p) : r
                };
                var s = function(a) {
                        e(0, a)
                    },
                    t = function(a) {
                        e(1, a)
                    },
                    u = function(a) {
                        var b = a.key;
                        c.events.trigger(function() {
                            p.filter(b), p.redrawGroup()
                        })
                    };
                return c.override(p, "filter", function(a) {
                    return arguments.length ? p._filter(c.filters.TwoDimensionalFilter(a)) : p._filter()
                }), p.rows = function(a) {
                    return arguments.length ? (h = a, p) : h
                }, p.rowOrdering = function(a) {
                    return arguments.length ? (k = a, p) : k
                }, p.cols = function(a) {
                    return arguments.length ? (g = a, p) : g
                }, p.colOrdering = function(a) {
                    return arguments.length ? (j = a, p) : j
                }, p._doRender = function() {
                    return p.resetSvg(), f = p.svg().append("g").attr("class", "heatmap").attr("transform", "translate(" + p.margins().left + "," + p.margins().top + ")"), p._doRedraw()
                }, p._doRedraw = function() {
                    var a = p.data(),
                        b = p.rows() || a.map(p.valueAccessor()),
                        d = p.cols() || a.map(p.keyAccessor());
                    k && (b = b.sort(k)), j && (d = d.sort(j)), b = m.domain(b), d = l.domain(d);
                    var e = b.domain().length,
                        g = d.domain().length,
                        h = Math.floor(p.effectiveWidth() / g),
                        i = Math.floor(p.effectiveHeight() / e);
                    d.rangeRoundBands([0, p.effectiveWidth()]), b.rangeRoundBands([p.effectiveHeight(), 0]);
                    var q = f.selectAll("g.box-group").data(p.data(), function(a, b) {
                            return p.keyAccessor()(a, b) + "\x00" + p.valueAccessor()(a, b)
                        }),
                        r = q.enter().append("g").attr("class", "box-group");
                    r.append("rect").attr("class", "heat-box").attr("fill", "white").on("click", p.boxOnClick()), p.renderTitle() && (r.append("title"), q.selectAll("title").text(p.title())), c.transition(q.selectAll("rect"), p.transitionDuration()).attr("x", function(a, b) {
                        return d(p.keyAccessor()(a, b))
                    }).attr("y", function(a, c) {
                        return b(p.valueAccessor()(a, c))
                    }).attr("rx", n).attr("ry", o).attr("fill", p.getColor).attr("width", h).attr("height", i), q.exit().remove();
                    var s = f.selectAll("g.cols");
                    s.empty() && (s = f.append("g").attr("class", "cols axis"));
                    var t = s.selectAll("text").data(d.domain());
                    t.enter().append("text").attr("x", function(a) {
                        return d(a) + h / 2
                    }).style("text-anchor", "middle").attr("y", p.effectiveHeight()).attr("dy", 12).on("click", p.xAxisOnClick()).text(p.colsLabel()), c.transition(t, p.transitionDuration()).text(p.colsLabel()).attr("x", function(a) {
                        return d(a) + h / 2
                    }), t.exit().remove();
                    var u = f.selectAll("g.rows");
                    u.empty() && (u = f.append("g").attr("class", "rows axis"));
                    var v = u.selectAll("text").data(b.domain());
                    return v.enter().append("text").attr("dy", 6).style("text-anchor", "end").attr("x", 0).attr("dx", -2).on("click", p.yAxisOnClick()).text(p.rowsLabel()), c.transition(v, p.transitionDuration()).text(p.rowsLabel()).attr("y", function(a) {
                        return b(a) + i / 2
                    }), v.exit().remove(), p.selectAll("g.box-group").each(p.hasFilter() ? function(a) {
                        p.isSelectedNode(a) ? p.highlightSelected(this) : p.fadeDeselected(this)
                    } : function() {
                        p.resetHighlight(this)
                    }), p
                }, p.boxOnClick = function(a) {
                    return arguments.length ? (u = a, p) : u
                }, p.xAxisOnClick = function(a) {
                    return arguments.length ? (s = a, p) : s
                }, p.yAxisOnClick = function(a) {
                    return arguments.length ? (t = a, p) : t
                }, p.xBorderRadius = function(a) {
                    return arguments.length ? (n = a, p) : n
                }, p.yBorderRadius = function(a) {
                    return arguments.length ? (o = a, p) : o
                }, p.isSelectedNode = function(a) {
                    return p.hasFilter(a.key)
                }, p.anchor(b, d)
            },
            function() {
                function b(a) {
                    return [0, a.length - 1]
                }

                function c(b) {
                    return [a.quantile(b, .25), a.quantile(b, .5), a.quantile(b, .75)]
                }
                a.box = function() {
                    function d(b) {
                        b.each(function(b, c) {
                            b = b.map(i).sort(a.ascending);
                            var d = a.select(this),
                                m = b.length,
                                n = b[0],
                                o = b[m - 1],
                                p = b.quartiles = k(b),
                                q = j && j.call(this, b, c),
                                r = q && q.map(function(a) {
                                    return b[a]
                                }),
                                s = q ? a.range(0, q[0]).concat(a.range(q[1] + 1, m)) : a.range(m),
                                t = a.scale.linear().domain(h && h.call(this, b, c) || [n, o]).range([f, 0]),
                                u = this.__chart__ || a.scale.linear().domain([0, 1 / 0]).range(t.range());
                            this.__chart__ = t;
                            var v = d.selectAll("line.center").data(r ? [r] : []);
                            v.enter().insert("line", "rect").attr("class", "center").attr("x1", e / 2).attr("y1", function(a) {
                                return u(a[0])
                            }).attr("x2", e / 2).attr("y2", function(a) {
                                return u(a[1])
                            }).style("opacity", 1e-6).transition().duration(g).style("opacity", 1).attr("y1", function(a) {
                                return t(a[0])
                            }).attr("y2", function(a) {
                                return t(a[1])
                            }), v.transition().duration(g).style("opacity", 1).attr("y1", function(a) {
                                return t(a[0])
                            }).attr("y2", function(a) {
                                return t(a[1])
                            }), v.exit().transition().duration(g).style("opacity", 1e-6).attr("y1", function(a) {
                                return t(a[0])
                            }).attr("y2", function(a) {
                                return t(a[1])
                            }).remove();
                            var w = d.selectAll("rect.box").data([p]);
                            w.enter().append("rect").attr("class", "box").attr("x", 0).attr("y", function(a) {
                                return u(a[2])
                            }).attr("width", e).attr("height", function(a) {
                                return u(a[0]) - u(a[2])
                            }).transition().duration(g).attr("y", function(a) {
                                return t(a[2])
                            }).attr("height", function(a) {
                                return t(a[0]) - t(a[2])
                            }), w.transition().duration(g).attr("y", function(a) {
                                return t(a[2])
                            }).attr("height", function(a) {
                                return t(a[0]) - t(a[2])
                            });
                            var x = d.selectAll("line.median").data([p[1]]);
                            x.enter().append("line").attr("class", "median").attr("x1", 0).attr("y1", u).attr("x2", e).attr("y2", u).transition().duration(g).attr("y1", t).attr("y2", t), x.transition().duration(g).attr("y1", t).attr("y2", t);
                            var y = d.selectAll("line.whisker").data(r || []);
                            y.enter().insert("line", "circle, text").attr("class", "whisker").attr("x1", 0).attr("y1", u).attr("x2", e).attr("y2", u).style("opacity", 1e-6).transition().duration(g).attr("y1", t).attr("y2", t).style("opacity", 1), y.transition().duration(g).attr("y1", t).attr("y2", t).style("opacity", 1), y.exit().transition().duration(g).attr("y1", t).attr("y2", t).style("opacity", 1e-6).remove();
                            var z = d.selectAll("circle.outlier").data(s, Number);
                            z.enter().insert("circle", "text").attr("class", "outlier").attr("r", 5).attr("cx", e / 2).attr("cy", function(a) {
                                return u(b[a])
                            }).style("opacity", 1e-6).transition().duration(g).attr("cy", function(a) {
                                return t(b[a])
                            }).style("opacity", 1), z.transition().duration(g).attr("cy", function(a) {
                                return t(b[a])
                            }).style("opacity", 1), z.exit().transition().duration(g).attr("cy", function(a) {
                                return t(b[a])
                            }).style("opacity", 1e-6).remove();
                            var A = l || t.tickFormat(8),
                                B = d.selectAll("text.box").data(p);
                            B.enter().append("text").attr("class", "box").attr("dy", ".3em").attr("dx", function(a, b) {
                                return 1 & b ? 6 : -6
                            }).attr("x", function(a, b) {
                                return 1 & b ? e : 0
                            }).attr("y", u).attr("text-anchor", function(a, b) {
                                return 1 & b ? "start" : "end"
                            }).text(A).transition().duration(g).attr("y", t), B.transition().duration(g).text(A).attr("y", t);
                            var C = d.selectAll("text.whisker").data(r || []);
                            C.enter().append("text").attr("class", "whisker").attr("dy", ".3em").attr("dx", 6).attr("x", e).attr("y", u).text(A).style("opacity", 1e-6).transition().duration(g).attr("y", t).style("opacity", 1), C.transition().duration(g).text(A).attr("y", t).style("opacity", 1), C.exit().transition().duration(g).attr("y", t).style("opacity", 1e-6).remove()
                        }), a.timer.flush()
                    }
                    var e = 1,
                        f = 1,
                        g = 0,
                        h = null,
                        i = Number,
                        j = b,
                        k = c,
                        l = null;
                    return d.width = function(a) {
                        return arguments.length ? (e = a, d) : e
                    }, d.height = function(a) {
                        return arguments.length ? (f = a, d) : f
                    }, d.tickFormat = function(a) {
                        return arguments.length ? (l = a, d) : l
                    }, d.duration = function(a) {
                        return arguments.length ? (g = a, d) : g
                    }, d.domain = function(b) {
                        return arguments.length ? (h = null === b ? b : a.functor(b), d) : h
                    }, d.value = function(a) {
                        return arguments.length ? (i = a, d) : i
                    }, d.whiskers = function(a) {
                        return arguments.length ? (j = a, d) : j
                    }, d.quartiles = function(a) {
                        return arguments.length ? (k = a, d) : k
                    }, d
                }
            }(), c.boxPlot = function(b, d) {
                function e(a) {
                    return function(b) {
                        for (var c = b.quartiles[0], d = b.quartiles[2], e = (d - c) * a, f = -1, g = b.length; b[++f] < c - e;);
                        for (; b[--g] > d + e;);
                        return [f, g]
                    }
                }

                function f(a) {
                    var b = a.enter().append("g");
                    b.attr("class", "box").attr("transform", p).call(m).on("click", function(a) {
                        i.filter(a.key), i.redrawGroup()
                    })
                }

                function g(b) {
                    c.transition(b, i.transitionDuration()).attr("transform", p).call(m).each(function() {
                        a.select(this).select("rect.box").attr("fill", i.getColor)
                    })
                }

                function h(a) {
                    a.exit().remove().call(m)
                }
                var i = c.coordinateGridMixin({}),
                    j = 1.5,
                    k = e,
                    l = k(j),
                    m = a.box(),
                    n = null,
                    o = function(a, b) {
                        return i.isOrdinal() ? i.x().rangeBand() : a / (1 + i.boxPadding()) / b
                    };
                i.yAxisPadding(12), i.x(a.scale.ordinal()), i.xUnits(c.units.ordinal), i.data(function(a) {
                    return a.all().map(function(a) {
                        return a.map = function(b) {
                            return b.call(a, a)
                        }, a
                    }).filter(function(a) {
                        var b = i.valueAccessor()(a);
                        return 0 !== b.length
                    })
                }), i.boxPadding = i._rangeBandPadding, i.boxPadding(.8), i.outerPadding = i._outerRangeBandPadding, i.outerPadding(.5), i.boxWidth = function(b) {
                    return arguments.length ? (o = a.functor(b), i) : o
                };
                var p = function(a, b) {
                    var c = i.x()(i.keyAccessor()(a, b));
                    return "translate(" + c + ", 0)"
                };
                return i._preprocessData = function() {
                    i.elasticX() && i.x().domain([])
                }, i.plotData = function() {
                    var a = o(i.effectiveWidth(), i.xUnitCount());
                    m.whiskers(l).width(a).height(i.effectiveHeight()).value(i.valueAccessor()).domain(i.y().domain()).duration(i.transitionDuration()).tickFormat(n);
                    var b = i.chartBodyG().selectAll("g.box").data(i.data(), function(a) {
                        return a.key
                    });
                    f(b), g(b), h(b), i.fadeDeselectedArea()
                }, i.fadeDeselectedArea = function() {
                    i.g().selectAll("g.box").each(i.hasFilter() ? function(a) {
                        i.isSelectedNode(a) ? i.highlightSelected(this) : i.fadeDeselected(this)
                    } : function() {
                        i.resetHighlight(this)
                    })
                }, i.isSelectedNode = function(a) {
                    return i.hasFilter(a.key)
                }, i.yAxisMin = function() {
                    var b = a.min(i.data(), function(b) {
                        return a.min(i.valueAccessor()(b))
                    });
                    return c.utils.subtract(b, i.yAxisPadding())
                }, i.yAxisMax = function() {
                    var b = a.max(i.data(), function(b) {
                        return a.max(i.valueAccessor()(b))
                    });
                    return c.utils.add(b, i.yAxisPadding())
                }, i.tickFormat = function(a) {
                    return arguments.length ? (n = a, i) : n
                }, i.anchor(b, d)
            },
            function() {
                function b(a) {
                    return a.ranges
                }

                function c(a) {
                    return a.markers
                }

                function d(a) {
                    return a.measures
                }

                function e(a) {
                    var b = a(0);
                    return function(c) {
                        return Math.abs(a(c) - b)
                    }
                }
                a.bullet = function() {
                    function f(b) {
                        b.each(function(b, c) {
                            var d, f, g = j.call(this, b, c).slice().sort(a.descending),
                                p = k.call(this, b, c).slice().sort(a.descending),
                                q = l.call(this, b, c).slice().sort(a.descending),
                                r = a.select(this),
                                s = r.select("g.wrap");
                            s.empty() && (s = r.append("g").attr("class", "wrap")), i ? (d = n, f = m, s.attr("transform", "rotate(90)translate(0," + -m + ")")) : (d = m, f = n, s.attr("transform", "translate(0)"));
                            var t = a.scale.linear().domain([0, Math.max(g[0], p[0], q[0])]).range(h ? [d, 0] : [0, d]),
                                u = this.__chart__ || a.scale.linear().domain([0, 1 / 0]).range(t.range());
                            this.__chart__ = t;
                            var v = e(u),
                                w = e(t),
                                x = s.selectAll("rect.range").data(g);
                            x.enter().append("rect").attr("class", function(a, b) {
                                return "range s" + b
                            }).attr("width", v).attr("height", f).attr("x", h ? u : 0), a.transition(x).attr("x", h ? t : 0).attr("width", w).attr("height", f);
                            var y = s.selectAll("rect.measure").data(q);
                            y.enter().append("rect").attr("class", function(a, b) {
                                return "measure s" + b
                            }).attr("width", v).attr("height", f / 3).attr("x", h ? u : 0).attr("y", f / 3), a.transition(y).attr("width", w).attr("height", f / 3).attr("x", h ? t : 0).attr("y", f / 3);
                            var z = s.selectAll("line.marker").data(p);
                            z.enter().append("line").attr("class", "marker").attr("x1", u).attr("x2", u).attr("y1", f / 6).attr("y2", 5 * f / 6), a.transition(z).attr("x1", t).attr("x2", t).attr("y1", f / 6).attr("y2", 5 * f / 6);
                            var A = r.selectAll("g.axis").data([0]);
                            A.enter().append("g").attr("class", "axis"), i || A.attr("transform", "translate(0," + n + ")"), A.call(o.scale(t))
                        }), a.timer.flush()
                    }
                    var g = "left",
                        h = !1,
                        i = !1,
                        j = b,
                        k = c,
                        l = d,
                        m = 380,
                        n = 30,
                        o = a.svg.axis();
                    return f.orient = function(a) {
                        return arguments.length ? (g = a + "", h = "right" == g || "bottom" == g, o.orient((i = "top" == g || "bottom" == g) ? "left" : "bottom"), f) : g
                    }, f.ranges = function(a) {
                        return arguments.length ? (j = a, f) : j
                    }, f.markers = function(a) {
                        return arguments.length ? (k = a, f) : k
                    }, f.measures = function(a) {
                        return arguments.length ? (l = a, f) : l
                    }, f.width = function(a) {
                        return arguments.length ? (m = +a, f) : m
                    }, f.height = function(a) {
                        return arguments.length ? (n = +a, f) : n
                    }, a.rebind(f, o, "tickFormat")
                }
            }(), c.bulletChart = function(b, d) {
                function e() {
                    return arguments.length ? "left" == j || "right" == j ? [-6, i / 2] : "bottom" == j || "top" == j ? [h, i + 20] : [-6, i / 2] : k
                }
                var f = c.marginMixin(c.baseMixin({})),
                    g = {
                        top: 5,
                        right: 40,
                        bottom: 20,
                        left: 120
                    },
                    h = 960 - g.left - g.right,
                    i = 50 - g.top - g.bottom,
                    j = "left",
                    k = e(j);
                return f._doRender = function() {
                    var b = a.bullet().width(h).height(i).orient(j),
                        c = f.root().selectAll("svg").data(f.data()).enter().append("svg").attr("class", "bullet").attr("width", h + g.left + g.right).attr("height", i + g.top + g.bottom).append("g").attr("transform", "translate(" + g.left + "," + g.top + ")").call(b),
                        d = c.append("g").style("text-anchor", "end").attr("transform", "translate(" + k[0] + "," + k[1] + ")");
                    return d.append("text").attr("class", "title").text(function(a) {
                        return a.title
                    }), d.append("text").attr("class", "subtitle").attr("dy", "1em").text(function(a) {
                        return a.subtitle
                    }), f
                }, f._doRedraw = function() {
                    return _doRender(), f
                }, f.bulletWidth = function(a) {
                    return arguments.length ? (h = +a, f) : h
                }, f.bulletHeight = function(a) {
                    return arguments.length ? (i = +a, f) : i
                }, f.bulletMargin = function(a) {
                    return arguments.length ? (g = a, f) : g
                }, f.orient = function(a) {
                    return arguments.length ? (j = a, k = e(j), f) : j
                }, f.anchor(b, d)
            }, c.abstractBubbleChart = c.bubbleMixin, c.baseChart = c.baseMixin, c.capped = c.capMixin, c.colorChart = c.colorMixin, c.coordinateGridChart = c.coordinateGridMixin, c.marginable = c.marginMixin, c.stackableChart = c.stackMixin, c.d3 = a, c.crossfilter = b, c
    }
    if ("function" == typeof define && define.amd) define(["d3", "crossfilter"], a);
    else if ("object" == typeof module && module.exports) {
        var b = require("d3"),
            c = require("crossfilter");
        "function" != typeof c && (c = c.crossfilter), module.exports = a(b, c)
    } else this.dc = a(d3, crossfilter)
}();
//# sourceMappingURL=dc.min.js.map
