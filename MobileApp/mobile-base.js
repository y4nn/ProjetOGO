// API key for http://openlayers.org. Please get your own at
// http://bingmapsportal.com/ and use that instead.
//var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

// initialize map when page ready
var map;
var sprintersLayer;
var gg = new OpenLayers.Projection("EPSG:4326");
var sm = new OpenLayers.Projection("EPSG:900913");
var init = function(onSelectFeatureFunction) {

    var vector = new OpenLayers.Layer.Vector("Vector Layer", {});
    sprintersLayer = new OpenLayers.Layer.Vector("Sprinters", {
        styleMap: new OpenLayers.StyleMap({
            externalGraphic: "img/radar_01.png",
            graphicOpacity: 1.0,
            graphicWidth: 16,
            graphicHeight: 26,
            graphicYOffset: -26
        })
    });
    var sprinters = getFeatures();
    sprintersLayer.addFeatures(sprinters);
    var selectControl = new OpenLayers.Control.SelectFeature(sprintersLayer, {
        autoActivate: true,
        onSelect: onSelectFeatureFunction});
    var geolocate = new OpenLayers.Control.Geolocate({
        id: 'locate-control',
        geolocationOptions: {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 7000
        }
    });
    // create map
    map = new OpenLayers.Map({
        div: "map",
        theme: null,
        projection: sm,
        numZoomLevels: 18,
        tileManager: new OpenLayers.TileManager(),
        controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            geolocate,
            selectControl
        ],
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize'
            }),
//            new OpenLayers.Layer.Bing({
//                key: apiKey,
//                type: "Road",
//                // custom metadata parameter to request the new map style - only useful
//                // before May 1st, 2011
//                metadataParams: {
//                    mapVersion: "v1"
//                },
//                name: "Bing Road",
//                transitionEffect: 'resize'
//            }),
//            new OpenLayers.Layer.Bing({
//                key: apiKey,
//                type: "Aerial",
//                name: "Bing Aerial",
//                transitionEffect: 'resize'
//            }),
//            new OpenLayers.Layer.Bing({
//                key: apiKey,
//                type: "AerialWithLabels",
//                name: "Bing Aerial + Labels",
//                transitionEffect: 'resize'
//            }),
            vector,
            sprintersLayer
        ],
        center: new OpenLayers.LonLat(0, 0),
        zoom: 1
    });
    var style = {
        fillOpacity: 0.1,
        fillColor: '#000',
        strokeColor: '#f00',
        strokeOpacity: 0.6
    };
    geolocate.events.register("locationupdated", this, function(e) {
        vector.removeAllFeatures();
        vector.addFeatures([
            new OpenLayers.Feature.Vector(
                    e.point,
                    {},
                    {
                        graphicName: 'cross',
                        strokeColor: '#f00',
                        strokeWidth: 2,
                        fillOpacity: 0,
                        pointRadius: 10
                    }
            ),
            new OpenLayers.Feature.Vector(
                    OpenLayers.Geometry.Polygon.createRegularPolygon(
                    new OpenLayers.Geometry.Point(e.point.x, e.point.y),
                    e.position.coords.accuracy / 2,
                    50,
                    0
                    ),
                    {},
                    style
                    )
        ]);
        map.zoomToExtent(vector.getDataExtent());
    });
    function getFeatures() {
        var point = new OpenLayers.LonLat(6.567035, 46.552213);
        var point2 = new OpenLayers.LonLat(6.636279, 46.757577);
        var point3 = new OpenLayers.LonLat(6.555769, 46.538554);

        var pointT = point.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
        var pointT2 = point2.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
        var pointT3 = point3.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));

        var features = {
            "type": "FeatureCollection",
            "features": [
                {"type": "Feature", "geometry": {"type": "Point", "coordinates": [pointT.lon, pointT.lat]},
                    "properties": {"Name": "Radar Fixe", "Country": "Switzerland", "City": "Crissier", "Trançon": "Echangeur Villars St Croix"}},
                {"type": "Feature", "geometry": {"type": "Point", "coordinates": [pointT2.lon, pointT2.lat]},
                    "properties": {"Name": "Radar Fixe", "Country": "Switzerland", "City": "Yverdon", "Trançon": "Echangeur Direction Lausanne"}},
                {"type": "Feature", "geometry": {"type": "Point", "coordinates": [pointT3.lon, pointT3.lat]},
                    "properties": {"Name": "Radar Fixe", "Country": "Switzerland", "City": "Crissier", "Trançon": "Echangeur Direction Genève"}},
            ]
        };
        var reader = new OpenLayers.Format.GeoJSON();
        return reader.read(features);
    }



};