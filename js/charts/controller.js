var classNameVisible = "section";
var classNameHide = "section-hide";

function toggleDescription() {
    if (d3.selectAll("#description").attr("class") == classNameVisible) {
        d3.selectAll("#description").attr("class", classNameHide);
        d3.selectAll("#nav-description").attr("class","nav-item inactive");
    } else {
        d3.selectAll("#description").attr("class", classNameVisible);
        d3.selectAll("#nav-description").attr("class","nav-item active");
    };
};

function toggleOverview() {
    if (d3.selectAll("#overview").attr("class") == classNameVisible) {
        d3.selectAll("#overview").attr("class", classNameHide);
        d3.selectAll("#nav-overview").attr("class","nav-item inactive");

    } else {
        d3.selectAll("#overview").attr("class", classNameVisible);
        d3.selectAll("#nav-overview").attr("class","nav-item active");
    };
}

function toggleSaleByProduct() {
    if (d3.selectAll("#sale-by-product").attr("class") == classNameVisible) {
        d3.selectAll("#sale-by-product").attr("class", classNameHide);
        d3.selectAll("#nav-sale-by-product").attr("class","nav-item inactive");
    } else {
        d3.selectAll("#sale-by-product").attr("class", classNameVisible);
        d3.selectAll("#nav-sale-by-product").attr("class","nav-item active");
    }
}

function toggleDetailAnalysis() {
    if (d3.selectAll("#detail-analysis").attr("class") == classNameVisible) {
        d3.selectAll("#detail-analysis").attr("class", classNameHide);
        d3.selectAll("#nav-detail-analysis").attr("class","nav-item inactive");
    } else {
        d3.selectAll("#detail-analysis").attr("class", classNameVisible);
        d3.selectAll("#nav-detail-analysis").attr("class","nav-item active");
    };
}

function userUpdate(userId) {
  d3.selectAll("#user").text(userId);
  if (userId=="CEO") {
    d3.selectAll("#user_icon").attr("class","icon-diamond");
    d3.selectAll("#nav-ceo-user").attr("class","nav-item active");
    d3.selectAll("#nav-product-manager-user").attr("class","nav-item inactive");
    d3.selectAll("#nav-sale-manager-user").attr("class","nav-item inactive");
    d3.selectAll("#overview").attr("class", classNameVisible);
    d3.selectAll("#sale-by-product").attr("class", classNameHide);
    d3.selectAll("#detail-analysis").attr("class", classNameHide);
    d3.selectAll("#nav-description").attr("class","nav-item active");
    d3.selectAll("#nav-overview").attr("class","nav-item active");
    d3.selectAll("#nav-sale-by-product").attr("class","nav-item inactive");
    d3.selectAll("#nav-detail-analysis").attr("class","nav-item inactive");

  } else if (userId=="Product Director") {
    d3.selectAll("#user_icon").attr("class","icon-puzzle");
    d3.selectAll("#nav-ceo-user").attr("class","nav-item inactive");
    d3.selectAll("#nav-product-manager-user").attr("class","nav-item active");
    d3.selectAll("#nav-sale-manager-user").attr("class","nav-item inactive");
    d3.selectAll("#overview").attr("class", classNameVisible);
    d3.selectAll("#sale-by-product").attr("class", classNameVisible);
    d3.selectAll("#detail-analysis").attr("class", classNameHide);
    d3.selectAll("#nav-description").attr("class","nav-item active");
    d3.selectAll("#nav-overview").attr("class","nav-item active");
    d3.selectAll("#nav-sale-by-product").attr("class","nav-item active");
    d3.selectAll("#nav-detail-analysis").attr("class","nav-item inactive");
  } else if (userId=="Sale Director") {
    d3.selectAll("#user_icon").attr("class","icon-briefcase");
    d3.selectAll("#nav-ceo-user").attr("class","nav-item inactive");
    d3.selectAll("#nav-product-manager-user").attr("class","nav-item inactive");
    d3.selectAll("#nav-sale-manager-user").attr("class","nav-item active");
    d3.selectAll("#overview").attr("class", classNameVisible);
    d3.selectAll("#sale-by-product").attr("class", classNameHide);
    d3.selectAll("#detail-analysis").attr("class", classNameVisible);
    d3.selectAll("#nav-description").attr("class","nav-item active");
    d3.selectAll("#nav-overview").attr("class","nav-item active");
    d3.selectAll("#nav-sale-by-product").attr("class","nav-item inactive");
    d3.selectAll("#nav-detail-analysis").attr("class","nav-item active");
  }
}

function toggleMenu() {
	var statusON = "page-sidebar navbar-collapse open";
	var statusOFF = "page-sidebar navbar-collapse collapse";
	var leftMenuStatus = d3.selectAll("#left-menu-control").attr("class") ;
	if (leftMenuStatus==statusON) {
		leftMenuStatus = statusOFF;
	} else {
		leftMenuStatus = statusON
	}
	d3.selectAll("#left-menu-control").attr("class",leftMenuStatus);
}
