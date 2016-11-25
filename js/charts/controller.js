var classNameVisible = "section";
var classNameHide = "section-hide";

function toggleDescription() {
    if (d3.selectAll("#description").attr("class") == classNameVisible) {
        d3.selectAll("#description").attr("class", classNameHide);
    } else {
        d3.selectAll("#description").attr("class", classNameVisible);
    };
};

function toggleOverview() {
    if (d3.selectAll("#overview").attr("class") == classNameVisible) {
        d3.selectAll("#overview").attr("class", classNameHide);
    } else {
        d3.selectAll("#overview").attr("class", classNameVisible);
    };
}

function toggleSaleByProduct() {
    if (d3.selectAll("#sale-by-product").attr("class") == classNameVisible) {
        d3.selectAll("#sale-by-product").attr("class", classNameHide);
    } else {
        d3.selectAll("#sale-by-product").attr("class", classNameVisible);
    }
}

function toggleDetailAnalysis() {
    if (d3.selectAll("#detail-analysis").attr("class") == classNameVisible) {
        d3.selectAll("#detail-analysis").attr("class", classNameHide);
    } else {
        d3.selectAll("#detail-analysis").attr("class", classNameVisible);
    };
}

function userUpdate(userId) {
  d3.selectAll("#user").text(userId);
  if (userId=="CEO") {
    d3.selectAll("#user_icon").attr("class","icon-diamond");
  } else if (userId=="Product Director") {
    d3.selectAll("#user_icon").attr("class","icon-puzzle");
  } else if (userId=="Sale Director") {
    d3.selectAll("#user_icon").attr("class","icon-briefcase");
  }
}
