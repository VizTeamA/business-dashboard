var classNameVisible = "section";
var classNameHide = "section-hide";

if (d3.selectAll("#overview").attr("class") == classNameVisible) {
    d3.selectAll("#overview").attr("class", classNameHide);
} else {
    d3.selectAll("#overview").attr("class", classNameVisible);
};

if (d3.selectAll("#detail-analysis").attr("class") == classNameVisible) {
    d3.selectAll("#detail-analysis").attr("class", classNameHide);
} else {
    d3.selectAll("#detail-analysis").attr("class", classNameVisible);
};
if (d3.selectAll("#sale-by-product").attr("class") == classNameVisible) {
    d3.selectAll("#sale-by-product").attr("class", classNameHide);
} else {
    d3.selectAll("#sale-by-product").attr("class", classNameVisible);
}
