// Start with the map page
window.location.replace(window.location.href.split("#")[0] + "#mappage");
var ol = new OpenLayers.Layer.OSM();
var selectedFeature = null;
var from_lonlat;
var to_lonlat;
// fix height of content
function fixContentHeight() {
    var footer = $("div[data-role='footer']:visible"),
            content = $("div[data-role='content']:visible:visible"),
            viewHeight = $(window).height(),
            contentHeight = viewHeight - footer.outerHeight();

    if ((content.outerHeight() + footer.outerHeight()) !== viewHeight) {
        contentHeight -= (content.outerHeight() - content.height() + 1);
        content.height(contentHeight);
    }

    if (window.map && window.map instanceof OpenLayers.Map) {
        map.updateSize();
    } else {
        // initialize map
        init(function(feature) {
            selectedFeature = feature;
            $.mobile.changePage("#popup", "pop");
        });
        initLayerList();
    }
}

// one-time initialisation of button handlers 

$("#plus").live('click', function() {
    map.zoomIn();
});

$("#minus").live('click', function() {
    map.zoomOut();
});

$("#locate").live('click', function() {
    var control = map.getControlsBy("id", "locate-control")[0];
    if (control.active) {
        control.getCurrentLocation();
    } else {
        control.activate();
    }
});

//fix the content height AFTER jQuery Mobile has rendered the map page
$('#mappage').live('pageshow', function() {
    fixContentHeight();
});

$(window).bind("orientationchange resize pageshow", fixContentHeight);



$('#popup').live('pageshow', function(event, ui) {
    var li = "";
    for (var attr in selectedFeature.attributes) {
        li += "<li><div style='width:25%;float:left'>" + attr + "</div><div style='width:75%;float:right'>"
                + selectedFeature.attributes[attr] + "</div></li>";
    }
    $("ul#details-list").empty().append(li).listview("refresh");
});

$('#searchpage').live('pageshow', function(event, ui) {
    $('#query').bind('change', function(e) {
        $('#search_results').empty();
        if ($('#query')[0].value === '') {
            return;
        }
        $.mobile.showPageLoadingMsg();

        // Prevent form send
        e.preventDefault();

        var searchUrl = 'http://ws.geonames.org/searchJSON?featureClass=P&maxRows=10';
        searchUrl += '&name_startsWith=' + $('#query')[0].value;
        $.getJSON(searchUrl, function(data) {
            $.each(data.geonames, function() {
                var place = this;
                $('<li>')
                        .hide()
                        .append($('<h2 />', {
                    text: place.name
                }))
                        .append($('<p />', {
                    html: '<b>' + place.countryName + '</b> ' + place.fcodeName
                }))
                        .appendTo('#search_results')
                        .click(function() {
                    $.mobile.changePage('#mappage');
                    var lonlat = new OpenLayers.LonLat(place.lng, place.lat);
                    map.setCenter(lonlat.transform(gg, sm), 10);
                })
                        .show();
            });
            $('#search_results').listview('refresh');
            $.mobile.hidePageLoadingMsg();
        });
    });
    // only listen to the first event triggered
    $('#searchpage').die('pageshow', arguments.callee);
});


$('#navigate').live('pageshow', function(event, ui) {




    $('#query_from').bind('change', function(e) {
        $('#search_results_from').empty();
        if ($('#query_from')[0].value === '') {
            return;
        }
        $.mobile.showPageLoadingMsg();

        // Prevent form send
        e.preventDefault();

        var searchUrl = 'http://ws.geonames.org/searchJSON?featureClass=P&maxRows=10';
        searchUrl += '&name_startsWith=' + $('#query_from')[0].value;
        $.getJSON(searchUrl, function(data) {
            $.each(data.geonames, function() {
                var from = this;
                $('<li>')
                        .hide()
                        .append($('<h2 />', {
                    text: from.name
                }))
                        .append($('<p />', {
                    html: '<b>' + from.countryName + '</b> ' + from.fcodeName
                }))
                        .appendTo('#search_results_from')
                        .click(function() {
                    $('#search_results_from').empty();
                    //$.mobile.changePage('#mappage');
                    from_lonlat = new OpenLayers.LonLat(from.lng, from.lat).transform(gg, sm);
                    //map.setCenter(from_lonlat.transform(gg, sm), 10);
                })
                        .show();
            });
            $('#search_results_from').listview('refresh');
            $.mobile.hidePageLoadingMsg();
        });
    });

    $('#query_to').bind('change', function(e) {
        $('#search_results_to').empty();
        if ($('#query_to')[0].value === '') {
            return;
        }
        $.mobile.showPageLoadingMsg();

        // Prevent form send
        e.preventDefault();

        var searchUrl = 'http://ws.geonames.org/searchJSON?featureClass=P&maxRows=10';
        searchUrl += '&name_startsWith=' + $('#query_to')[0].value;
        $.getJSON(searchUrl, function(data) {
            $.each(data.geonames, function() {
                var to = this;
                $('<li>')
                        .hide()
                        .append($('<h2 />', {
                    text: to.name
                }))
                        .append($('<p />', {
                    html: '<b>' + to.countryName + '</b> ' + to.fcodeName
                }))
                        .appendTo('#search_results_to')
                        .click(function() {
                    $('#search_results_to').empty();
                    to_lonlat = new OpenLayers.LonLat(to.lng, to.lat).transform(gg, sm);
                })
                        .show();
            });
            $('#search_results_to').listview('refresh');
            $.mobile.hidePageLoadingMsg();
        });
    });

});

$('#computeRoad').live('click', function() {

    var myStyles = new OpenLayers.StyleMap({
        externalGraphic: "img/reddot.png",
        graphicOpacity: 1.0,
        graphicWidth: 26,
        graphicHeight: 26,
        graphicYOffset: -26
    });
    // création des deux couches de saisie des points départ/arrivée
    startPointLayer = new OpenLayers.Layer.Vector("Start Point Layer", {
        styleMap: myStyles

    });
    startPointLayer.addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(from_lonlat.lon, from_lonlat.lat))]);

    endPointLayer = new OpenLayers.Layer.Vector("End Point Layer", {
        styleMap: myStyles
    });
    endPointLayer.addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(to_lonlat.lon, to_lonlat.lat))]);

    map.addLayers([startPointLayer, endPointLayer]);

    map.setCenter(from_lonlat, 10);
    // only listen to the first event triggered 

    itineraire();

//    for (i = 0; i < polylineDecodee.length; i++) {
//        //limites.extend(polylineDecodee[i]);
//        alert(polylineDecodee[i]);
//    }

});

function initLayerList() {
    $('#layerspage').page();
    $('<li>', {
        "data-role": "list-divider",
        text: "Base Layers"
    })
            .appendTo('#layerslist');
    var baseLayers = map.getLayersBy("isBaseLayer", true);
    $.each(baseLayers, function() {
        addLayerToList(this);
    });

    $('<li>', {
        "data-role": "list-divider",
        text: "Overlay Layers"
    })
            .appendTo('#layerslist');
    var overlayLayers = map.getLayersBy("isBaseLayer", false);
    $.each(overlayLayers, function() {
        addLayerToList(this);
    });
    $('#layerslist').listview('refresh');

    map.events.register("addlayer", this, function(e) {
        addLayerToList(e.layer);
    });
}

function addLayerToList(layer) {
    var item = $('<li>', {
        "data-icon": "check",
        "class": layer.visibility ? "checked" : ""
    })
            .append($('<a />', {
        text: layer.name
    })
            .click(function() {
        $.mobile.changePage('#mappage');
        if (layer.isBaseLayer) {
            layer.map.setBaseLayer(layer);
        } else {
            layer.setVisibility(!layer.getVisibility());
        }
    })
            )
            .appendTo('#layerslist');
    layer.events.on({
        'visibilitychanged': function() {
            $(item).toggleClass('checked');
        }
    });
}

function itineraire() {

    from_lonlat.transform(sm, gg);
    to_lonlat.transform(sm, gg);
    var polylineDecodee;
    /* $.ajax({
     // url: 'http://router.project-osrm.org/viaroute?z=14&output=json&checksum=1578810642&loc='+from_lonlat.lat+','+from_lonlat.lon+'&loc='+to_lonlat.lat+','+to_lonlat.lon+'&instructions=true',
     url: 'http://router.project-osrm.org/viaroute?z=14&output=json&checksum=1578810642&loc=46.521827,6.632702&loc=46.789801,6.606159&instructions=true',
     crossDomain: true,
     dataType: 'jsonp',
     //jsonpCallback: 'asd',
     cache: 'jsonp',
     //dataType: 'jsonp',
     //jsonp: 'jsonp',
     success: function callbacks(data) {
     
     var encodedPath = data.route_geometry;
     polylineDecodee = google.maps.geometry.encoding.decodePath(encodedPath);
     for (i = 0; i < polylineDecodee.length; i++) {
     alert(polylineDecodee[i]);
     }
     
     }
     });*/
    $.ajax({
        //url: 'http://router.project-osrm.org/viaroute?z=14&output=json&checksum=1578810642&loc=46.521827,6.632702&loc=46.789801,6.606159&instructions=true&jsonp=decodeData',
        url: 'http://router.project-osrm.org/viaroute?z=14&output=json&checksum=1578810642&loc=' + from_lonlat.lat + ',' + from_lonlat.lon + '&loc=' + to_lonlat.lat + ',' + to_lonlat.lon + '&instructions=true&jsonp=decodeData',
        dataType: "script",
        cache: 'jsonp'
    });


    return polylineDecodee;

}


function decodeData(data) {
    var encodedPath = data.route_geometry;
    polylineDecodee = google.maps.geometry.encoding.decodePath(encodedPath);

    var point;
    var pointList = [];
    var lng, lat;
    for (var i = 0; i < polylineDecodee.length - 1; i++) {
        lng = polylineDecodee.kb;
        lat = polylineDecodee.jb;
        point = new OpenLayers.Geometry.Point(lng, lat);
        pointList.push(point);
    }
    ligne = new OpenLayers.Geometry.LineString(pointList);
    ligne.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));

    defStyle = {strokeColor: "red", strokeOpacity: "1", strokeWidth: 3};

    var lgth = polylineDecodee.length;

    vector = new OpenLayers.Layer.Vector("Route", {
        style: defStyle
    });


//dessine
    for (var i = 0; i < polylineDecodee.length - 1; i++) {
        var start_point = new OpenLayers.Geometry.Point(polylineDecodee[i].kb, polylineDecodee[i].jb);
        var end_point = new OpenLayers.Geometry.Point(polylineDecodee[i + 1].kb, polylineDecodee[i + 1].jb);
        if (i + 1 <= lgth) {

            vector.addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([start_point, end_point]).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")))]);
            map.addLayers([ol, vector]);
        }
    }

}