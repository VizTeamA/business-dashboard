var existingMarkersLayer = new L.LayerGroup();
var newMarkersLayer = new L.LayerGroup();
var geojsonLayer = new L.LayerGroup();

var geojson;
var sql;

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

//sql = 'select * from dashboard_markers_cached';
//d3.json('datanew.php?sql='+sql, function (markersdata) {
d3.csv('data/tables/dashboard_markers_cached.csv', function (markersdata) {

  var HomeIcon = L.Icon.extend({
    options: {
      iconSize:[20,20]
    }
  });

  var existingIcon = new HomeIcon({iconUrl: 'img/home_existing.gif'}),
  newIcon = new HomeIcon({iconUrl: 'img/home_new.gif'});

  L.icon = function (options) {
    return new L.Icon(options);
  };

  for (x=0;x<markersdata.length;x++){
    var marker;
    if (markersdata[x].existing == 'Y') {
      marker = new L.marker([markersdata[x].latitude,markersdata[x].longitude], {icon: existingIcon})
                  .bindPopup("<u><b>Existing</b></u><br/><b>Project Name:</b>" + markersdata[x].project_name +
                        "<br/><b>Street Name:</b> " + markersdata[x].street_name +
                        "<br/><b>Developer Name:</b>" + markersdata[x].developer )
                  .addTo(existingMarkersLayer);
    }
    else {
      marker = new L.marker([markersdata[x].latitude,markersdata[x].longitude], {icon: newIcon})
                  .bindPopup("<u><b>New</b></u><br/><b>Project Name:</b>" + markersdata[x].project_name +
                        "<br/><b>Street Name:</b> " + markersdata[x].street_name +
                        "<br/><b>Developer Name:</b>" + markersdata[x].developer )
                  .addTo(newMarkersLayer);
    };

  };

});

d3.json('data/tables/singapore.geojson', function(geodata) {


    //sql = 'select * from dashboard_planning_area_cached';
    //d3.json('datanew.php?sql='+sql, function (geosupportdata) {
    d3.csv('data/tables/dashboard_planning_area.csv', function (geosupportdata) {

      geosupportdata.forEach(function(d) {
        d.avg_price_psm = +d.avg_price_psm;
      });

      function getPrice(d) {

        var indexFound = 0;

        for (i=0; i< geosupportdata.length;i++){
          if (geosupportdata[i].planning_area == d)
            indexFound = i;
        };

        var price = geosupportdata[indexFound].avg_price_psm;
        return price;

      };

      function getColor(d) {
        return d > 20000 ? '#3182bd' :
             d > 10000  ? '#9ecae1' :
             d > 0 ? '#deebf7' :
                  '#FFFFFF';
      };

      function getQualitativeRangeDesc(d){
        return d > 20000 ? 'High' :
             d > 10000  ? 'Medium' :
             d > 0 ? 'Low' :
                  'No Resale Transactions';
      }

      function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
        }

        var delay=1000; //1 second
        setTimeout(function() {
          layer.openPopup();
        }, delay);


      };

      function resetHighlight(e) {
        geojson.resetStyle(e.target);
        //layer.closePopup();
      };

      function zoomToFeature(e) {
        mymap.fitBounds(e.target.getBounds());
      };

      function onEachFeature(feature, layer) {
        var popupContent = "<font size='3' color='black'><b>Planning Area:  	</b>" +
          feature.properties.Name + "<br/> <b>Average Price PSM: $</b> " + numberWithCommas(Math.round(getPrice(feature.properties.Name))) +"</font>";
          // feature.properties.Name + "<br/> <b>Average Price PSM: </b>" + getQualitativeRangeDesc(getPrice(feature.properties.Name)) +"</font>";

        /*if (feature.properties && feature.properties.popupContent) {
          popupContent += feature.properties.popupContent;
        }*/

        layer.bindPopup(popupContent);

        //layer.on('mouseover', function() { layer.openPopup(); });
        //layer.on('mouseout', function() { layer.closePopup(); });

        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
        });
      };

      geojson = L.geoJson(geodata,
        {
          style: function(feature){
            return {
                weight: 1,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7,
                fillColor: getColor(getPrice(feature.properties.Name))
            };
          },
          onEachFeature : onEachFeature
        }).addTo(geojsonLayer);

      //Add legend
      // var legend = L.control({position: 'bottomright'});

      // legend.onAdd = function (map) {

        // var div = L.DomUtil.create('div', 'info legend'),
        //   grades = [0,10000,20000],
        //   labels = [],
        //   from, to;

        // for (var i = 0; i < grades.length; i++) {
          // from = grades[i];
          // to = grades[i + 1];
          //
          // labels.push(
          //   '<i style="background:' + getColor(from + 1) + '"></i> ' +
          //   from + (to ? '&ndash;' + to : '+'));
        // }

        // div.innerHTML = labels.join('<br>');
        // return div;
      // };

      // legend.addTo(mymap);

    });
});

//CYJ's access key
var mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=sk.eyJ1IjoiZHIzNG1jNHN0M3IiLCJhIjoiY2l2b25wZjVwMDAwaTJ0cG1rdG5jNXk5dSJ9.dP9x-tjmxhzu7RDwqmLcqQ';

var mapboxAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>,' +
    'Planning Area © <a href="http://www.data.gov.sg">Data.gov.sg</a>';

var grayscale = L.tileLayer(mapboxUrl, {id: 'mapbox.light', attribution: mapboxAttribution}),
  streets   = L.tileLayer(mapboxUrl, {id: 'mapbox.streets', attribution: mapboxAttribution});

var mymap = L.map('residental-geo-chart', {
  center: [1.35,103.8198],
  zoom: 11,
  layers: [grayscale, geojsonLayer] //set the default layers to show
});

var baseMaps = {
  "Plain Map": grayscale,
  "With Street Names": streets
};

var overlayMaps = {
  "Average Price PSM":geojsonLayer,
  "Customer": existingMarkersLayer,
  "Prospect": newMarkersLayer
};

L.control.layers(baseMaps, overlayMaps, { collapsed: false} ).addTo(mymap);	//set by default to show the layers available to toggle
