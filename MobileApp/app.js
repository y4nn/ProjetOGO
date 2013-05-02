/*
 var m;
 var tb;
 Ext.setup({
 viewport: {
 autoMaximize: true
 },
 onReady: function(){
 m = Ext.create('GeoAdminMobile.Map', {
 useDefaultTopBar: true,
 handedness: 'right',
 listeners: {
 maptap: function(){
 affichePoint();
 }
 // maphold: function(){
 //     alert('MAPHOLD!');
 // }
 }
 });
 
 
 tb = Ext.create('Ext.Toolbar', {
 cls: 'map-horizontal-tb gam-header-top-toolbar',
 layout: {
 pack: "right"
 },
 items: [
 {
 cls: getBtnCls('feedback'),
 handler: function() {
 Ext.Msg.alert('Notice', 'First button was tapped');
 }
 }
 ],
 docked: 'top'
 });
 
 var viewport = new Ext.Panel({
 dockedItems: [tb, m]
 });
 //Ext.Viewport.add(tb);
 //Ext.Viewport.add( m );
 //var parks = GeoAdmin.layers.buildLayerByName("ch.bafu.schutzgebiete-paerke_nationaler_bedeutung", {isBaseLayer: false});
 //var hydro = GeoAdmin.layers.buildLayerByName("ch.swisstopo.vec200-hydrography", {isBaseLayer: false});
 //m.getMap().addLayers([parks, hydro]);
 //m.getMap().addLayers([parks]);
 
 }
 });
 
 function affichePoint() {
 
 }
 
 */


// initialize map when page ready
var map;

// Get rid of address bar on iphone/ipod
var fixSize = function() {
    window.scrollTo(0, 0);
    document.body.style.height = '100%';
    if (!(/(iphone|ipod)/.test(navigator.userAgent.toLowerCase()))) {
        if (document.body.parentNode) {
            document.body.parentNode.style.height = '100%';
        }
    }
};
setTimeout(fixSize, 700);
setTimeout(fixSize, 1500);

var init = function() {
    // create map


    map = new OpenLayers.Map({
        div: "map",
        theme: null,
        controls: [],
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize'
            })
        ],
        center: new OpenLayers.LonLat(742000, 5861000),
        zoom: 3
    });


    map.addControl(new OpenLayers.Control.Attribution());
    map.addControl(new OpenLayers.Control.TouchNavigation({
        dragPanOptions: {
            enableKinetic: true
        }
    }));
    map.addControl(new OpenLayers.Control.Zoom());
    
};