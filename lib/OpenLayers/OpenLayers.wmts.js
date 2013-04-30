/* Librairie Openlayers pour WMTS IGN, Swisstopo ...

Published under the Clear BSD license.
See http://svn.openlayers.org/trunk/openlayers/license.txt for the full text of the license

Contains portions of:

-- OpenLayers.js -- OpenLayers Map Viewer Library Release 2.12 -- http://openlayers.org/
Copyright 2005-2012 OpenLayers Contributors. All rights reserved. See authors.txt for full list.
http://svn.openlayers.org/trunk/openlayers/license.txt

-- Prototype.js: -- Prototype JavaScript framework, version 1.4.0
(c) 2005 Sam Stephenson <sam@conio.net> http://prototype.conio.net/
Prototype is freely distributable under the terms of an MIT-style license.

-- XMLHttpRequest.js -- <http://code.google.com/p/xmlhttprequest/>
Copyright 2007 Sergey Ilinsky (http://www.ilinsky.com)
Licensed under the Apache License, Version 2.0 (the "License") http://www.apache.org/licenses/LICENSE-2.0

-- proj4js.js -- Javascript reprojection library. 
Authors: Mike Adair madairATdmsolutions.ca, Richard Greenwood richATgreenwoodmap.com, Didier Richard didier.richardATign.fr, Stephen Irons
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html 
Note: This program is an almost direct port of the C library Proj4.

Redistribution and use in source and binary forms, with or without modification, 
are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.

 2. Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation and/or
other materials provided with the distribution.

THESE SOFTWARES ARE PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
POSSIBILITY OF SUCH DAMAGE.*/
var OpenLayers = {
    singleFile: true
};
(function () {
    if (navigator.userAgent.search(/bot|crawl|mediapartners/i) != -1) return;
    var singleFile = (typeof OpenLayers == "object" && OpenLayers.singleFile);
    var scriptName = (!singleFile) ? "lib/OpenLayers.js" : "OpenLayers.js";
    var jsFiles = window.OpenLayers;
    window.OpenLayers = {
        _getScriptLocation: (function () {
            var r = new RegExp("(^|(.*?\\/))(" + scriptName + ")(\\?|$)"),
                s = document.getElementsByTagName('script'),
                src, m, l = "";
            for (var i = 0, len = s.length; i < len; i++) {
                src = s[i].getAttribute('src');
                if (src) {
                    m = src.match(r);
                    if (m) {
                        l = m[1];
                        break;
                    }
                }
            }
            return (function () {
                return l;
            });
        })(),
        ImgPath: 'js/OpenLayers/img/'
    };
})();
OpenLayers.VERSION_NUMBER = "Release 2.12";
OpenLayers.Class = function () {
    var len = arguments.length;
    var P = arguments[0];
    var F = arguments[len - 1];
    var C = typeof F.initialize == "function" ? F.initialize : function () {
            P.prototype.initialize.apply(this, arguments);
        };
    if (len > 1) {
        var newArgs = [C, P].concat(Array.prototype.slice.call(arguments).slice(1, len - 1), F);
        OpenLayers.inherit.apply(null, newArgs);
    } else {
        C.prototype = F;
    }
    return C;
};
OpenLayers.inherit = function (C, P) {
    var F = function () {};
    F.prototype = P.prototype;
    C.prototype = new F;
    var i, l, o;
    for (i = 2, l = arguments.length; i < l; i++) {
        o = arguments[i];
        if (typeof o === "function") {
            o = o.prototype;
        }
        OpenLayers.Util.extend(C.prototype, o);
    }
};
OpenLayers.Util = OpenLayers.Util || {};
OpenLayers.Util.extend = function (destination, source) {
    destination = destination || {};
    if (source) {
        for (var property in source) {
            var value = source[property];
            if (value !== undefined) {
                destination[property] = value;
            }
        }
        var sourceIsEvt = typeof window.Event == "function" && source instanceof window.Event;
        if (!sourceIsEvt && source.hasOwnProperty && source.hasOwnProperty("toString")) {
            destination.toString = source.toString;
        }
    }
    return destination;
};
OpenLayers.Util = OpenLayers.Util || {};
OpenLayers.Util.getElement = function () {
    var elements = [];
    for (var i = 0, len = arguments.length; i < len; i++) {
        var element = arguments[i];
        if (typeof element == 'string') {
            element = document.getElementById(element);
        }
        if (arguments.length == 1) {
            return element;
        }
        elements.push(element);
    }
    return elements;
};
OpenLayers.Util.isElement = function (o) {
    return !!(o && o.nodeType === 1);
};
OpenLayers.Util.isArray = function (a) {
    return (Object.prototype.toString.call(a) === '[object Array]');
};
if (typeof window.$ === "undefined") {
    window.$ = OpenLayers.Util.getElement;
}
OpenLayers.Util.removeItem = function (array, item) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] == item) {
            array.splice(i, 1);
        }
    }
    return array;
};
OpenLayers.Util.indexOf = function (array, obj) {
    if (typeof array.indexOf == "function") {
        return array.indexOf(obj);
    } else {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] == obj) {
                return i;
            }
        }
        return -1;
    }
};
OpenLayers.Util.modifyDOMElement = function (element, id, px, sz, position, border, overflow, opacity) {
    if (id) {
        element.id = id;
    }
    if (px) {
        element.style.left = px.x + "px";
        element.style.top = px.y + "px";
    }
    if (sz) {
        element.style.width = sz.w + "px";
        element.style.height = sz.h + "px";
    }
    if (position) {
        element.style.position = position;
    }
    if (border) {
        element.style.border = border;
    }
    if (overflow) {
        element.style.overflow = overflow;
    }
    if (parseFloat(opacity) >= 0.0 && parseFloat(opacity) < 1.0) {
        element.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
        element.style.opacity = opacity;
    } else if (parseFloat(opacity) == 1.0) {
        element.style.filter = '';
        element.style.opacity = '';
    }
};
OpenLayers.Util.createDiv = function (id, px, sz, imgURL, position, border, overflow, opacity) {
    var dom = document.createElement('div');
    if (imgURL) {
        dom.style.backgroundImage = 'url(' + imgURL + ')';
    }
    if (!id) {
        id = OpenLayers.Util.createUniqueID("OpenLayersDiv");
    }
    if (!position) {
        position = "absolute";
    }
    OpenLayers.Util.modifyDOMElement(dom, id, px, sz, position, border, overflow, opacity);
    return dom;
};
OpenLayers.Util.createImage = function (id, px, sz, imgURL, position, border, opacity, delayDisplay) {
    var image = document.createElement("img");
    if (!id) {
        id = OpenLayers.Util.createUniqueID("OpenLayersDiv");
    }
    if (!position) {
        position = "relative";
    }
    OpenLayers.Util.modifyDOMElement(image, id, px, sz, position, border, null, opacity);
    if (delayDisplay) {
        image.style.display = "none";

        function display() {
            image.style.display = "";
            OpenLayers.Event.stopObservingElement(image);
        }
        OpenLayers.Event.observe(image, "load", display);
        OpenLayers.Event.observe(image, "error", display);
    }
    image.style.alt = id;
    image.galleryImg = "no";
    if (imgURL) {
        image.src = imgURL;
    }
    return image;
};
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 0;
OpenLayers.Util.alphaHackNeeded = null;
OpenLayers.Util.alphaHack = function () {
    if (OpenLayers.Util.alphaHackNeeded == null) {
        var arVersion = navigator.appVersion.split("MSIE");
        var version = parseFloat(arVersion[1]);
        var filter = false;
        try {
            filter = !! (document.body.filters);
        } catch (e) {}
        OpenLayers.Util.alphaHackNeeded = (filter && (version >= 5.5) && (version < 7));
    }
    return OpenLayers.Util.alphaHackNeeded;
};
OpenLayers.Util.modifyAlphaImageDiv = function (div, id, px, sz, imgURL, position, border, sizing, opacity) {
    OpenLayers.Util.modifyDOMElement(div, id, px, sz, position, null, null, opacity);
    var img = div.childNodes[0];
    if (imgURL) {
        img.src = imgURL;
    }
    OpenLayers.Util.modifyDOMElement(img, div.id + "_innerImage", null, sz, "relative", border);
    if (OpenLayers.Util.alphaHack()) {
        if (div.style.display != "none") {
            div.style.display = "inline-block";
        }
        if (sizing == null) {
            sizing = "scale";
        }
        div.style.filter = "progid:DXImageTransform.Microsoft" + ".AlphaImageLoader(src='" + img.src + "', " + "sizingMethod='" + sizing + "')";
        if (parseFloat(div.style.opacity) >= 0.0 && parseFloat(div.style.opacity) < 1.0) {
            div.style.filter += " alpha(opacity=" + div.style.opacity * 100 + ")";
        }
        img.style.filter = "alpha(opacity=0)";
    }
};
OpenLayers.Util.createAlphaImageDiv = function (id, px, sz, imgURL, position, border, sizing, opacity, delayDisplay) {
    var div = OpenLayers.Util.createDiv();
    var img = OpenLayers.Util.createImage(null, null, null, null, null, null, null, delayDisplay);
    img.className = "olAlphaImg";
    div.appendChild(img);
    OpenLayers.Util.modifyAlphaImageDiv(div, id, px, sz, imgURL, position, border, sizing, opacity);
    return div;
};
OpenLayers.Util.upperCaseObject = function (object) {
    var uObject = {};
    for (var key in object) {
        uObject[key.toUpperCase()] = object[key];
    }
    return uObject;
};
OpenLayers.Util.applyDefaults = function (to, from) {
    to = to || {};
    var fromIsEvt = typeof window.Event == "function" && from instanceof window.Event;
    for (var key in from) {
        if (to[key] === undefined || (!fromIsEvt && from.hasOwnProperty && from.hasOwnProperty(key) && !to.hasOwnProperty(key))) {
            to[key] = from[key];
        }
    }
    if (!fromIsEvt && from && from.hasOwnProperty && from.hasOwnProperty('toString') && !to.hasOwnProperty('toString')) {
        to.toString = from.toString;
    }
    return to;
};
OpenLayers.Util.getParameterString = function (params) {
    var paramsArray = [];
    for (var key in params) {
        var value = params[key];
        if ((value != null) && (typeof value != 'function')) {
            var encodedValue;
            if (typeof value == 'object' && value.constructor == Array) {
                var encodedItemArray = [];
                var item;
                for (var itemIndex = 0, len = value.length; itemIndex < len; itemIndex++) {
                    item = value[itemIndex];
                    encodedItemArray.push(encodeURIComponent((item === null || item === undefined) ? "" : item));
                }
                encodedValue = encodedItemArray.join(",");
            } else {
                encodedValue = encodeURIComponent(value);
            }
            paramsArray.push(encodeURIComponent(key) + "=" + encodedValue);
        }
    }
    return paramsArray.join("&");
};
OpenLayers.Util.urlAppend = function (url, paramStr) {
    var newUrl = url;
    if (paramStr) {
        var parts = (url + " ").split(/[?&]/);
        newUrl += (parts.pop() === " " ? paramStr : parts.length ? "&" + paramStr : "?" + paramStr);
    }
    return newUrl;
};
OpenLayers.Util.getImagesLocation = function () {
    return OpenLayers.ImgPath || (OpenLayers._getScriptLocation() + "img/");
};
OpenLayers.Util.getImageLocation = function (image) {
    return OpenLayers.Util.getImagesLocation() + image;
};
OpenLayers.Util.Try = function () {
    var returnValue = null;
    for (var i = 0, len = arguments.length; i < len; i++) {
        var lambda = arguments[i];
        try {
            returnValue = lambda();
            break;
        } catch (e) {}
    }
    return returnValue;
};
OpenLayers.Util.getXmlNodeValue = function (node) {
    var val = null;
    OpenLayers.Util.Try(function () {
        val = node.text;
        if (!val) {
            val = node.textContent;
        }
        if (!val) {
            val = node.firstChild.nodeValue;
        }
    }, function () {
        val = node.textContent;
    });
    return val;
};
OpenLayers.Util.mouseLeft = function (evt, div) {
    var target = (evt.relatedTarget) ? evt.relatedTarget : evt.toElement;
    while (target != div && target != null) {
        target = target.parentNode;
    }
    return (target != div);
};
OpenLayers.Util.DEFAULT_PRECISION = 14;
OpenLayers.Util.toFloat = function (number, precision) {
    if (precision == null) {
        precision = OpenLayers.Util.DEFAULT_PRECISION;
    }
    if (typeof number !== "number") {
        number = parseFloat(number);
    }
    return precision === 0 ? number : parseFloat(number.toPrecision(precision));
};
OpenLayers.Util.rad = function (x) {
    return x * Math.PI / 180;
};
OpenLayers.Util.deg = function (x) {
    return x * 180 / Math.PI;
};
OpenLayers.Util.VincentyConstants = {
    a: 6378137,
    b: 6356752.3142,
    f: 1 / 298.257223563
};
OpenLayers.Util.distVincenty = function (p1, p2) {
    var ct = OpenLayers.Util.VincentyConstants;
    var a = ct.a,
        b = ct.b,
        f = ct.f;
    var L = OpenLayers.Util.rad(p2.lon - p1.lon);
    var U1 = Math.atan((1 - f) * Math.tan(OpenLayers.Util.rad(p1.lat)));
    var U2 = Math.atan((1 - f) * Math.tan(OpenLayers.Util.rad(p2.lat)));
    var sinU1 = Math.sin(U1),
        cosU1 = Math.cos(U1);
    var sinU2 = Math.sin(U2),
        cosU2 = Math.cos(U2);
    var lambda = L,
        lambdaP = 2 * Math.PI;
    var iterLimit = 20;
    while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0) {
        var sinLambda = Math.sin(lambda),
            cosLambda = Math.cos(lambda);
        var sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) +
            (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
        if (sinSigma == 0) {
            return 0;
        }
        var cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
        var sigma = Math.atan2(sinSigma, cosSigma);
        var alpha = Math.asin(cosU1 * cosU2 * sinLambda / sinSigma);
        var cosSqAlpha = Math.cos(alpha) * Math.cos(alpha);
        var cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
        var C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
        lambdaP = lambda;
        lambda = L + (1 - C) * f * Math.sin(alpha) * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    }
    if (iterLimit == 0) {
        return NaN;
    }
    var uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
        B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
    var s = b * A * (sigma - deltaSigma);
    var d = s.toFixed(3) / 1000;
    return d;
};
OpenLayers.Util.destinationVincenty = function (lonlat, brng, dist) {
    var u = OpenLayers.Util;
    var ct = u.VincentyConstants;
    var a = ct.a,
        b = ct.b,
        f = ct.f;
    var lon1 = lonlat.lon;
    var lat1 = lonlat.lat;
    var s = dist;
    var alpha1 = u.rad(brng);
    var sinAlpha1 = Math.sin(alpha1);
    var cosAlpha1 = Math.cos(alpha1);
    var tanU1 = (1 - f) * Math.tan(u.rad(lat1));
    var cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)),
        sinU1 = tanU1 * cosU1;
    var sigma1 = Math.atan2(tanU1, cosAlpha1);
    var sinAlpha = cosU1 * sinAlpha1;
    var cosSqAlpha = 1 - sinAlpha * sinAlpha;
    var uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    var sigma = s / (b * A),
        sigmaP = 2 * Math.PI;
    while (Math.abs(sigma - sigmaP) > 1e-12) {
        var cos2SigmaM = Math.cos(2 * sigma1 + sigma);
        var sinSigma = Math.sin(sigma);
        var cosSigma = Math.cos(sigma);
        var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
            B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
        sigmaP = sigma;
        sigma = s / (b * A) + deltaSigma;
    }
    var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
    var lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1, (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp));
    var lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1);
    var C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
    var L = lambda - (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    var revAz = Math.atan2(sinAlpha, -tmp);
    return new OpenLayers.LonLat(lon1 + u.deg(L), u.deg(lat2));
};
OpenLayers.Util.getParameters = function (url) {
    url = (url === null || url === undefined) ? window.location.href : url;
    var paramsString = "";
    if (OpenLayers.String.contains(url, '?')) {
        var start = url.indexOf('?') + 1;
        var end = OpenLayers.String.contains(url, "#") ? url.indexOf('#') : url.length;
        paramsString = url.substring(start, end);
    }
    var parameters = {};
    var pairs = paramsString.split(/[&;]/);
    for (var i = 0, len = pairs.length; i < len; ++i) {
        var keyValue = pairs[i].split('=');
        if (keyValue[0]) {
            var key = keyValue[0];
            try {
                key = decodeURIComponent(key);
            } catch (err) {
                key = unescape(key);
            }
            var value = (keyValue[1] || '').replace(/\+/g, " ");
            try {
                value = decodeURIComponent(value);
            } catch (err) {
                value = unescape(value);
            }
            value = value.split(",");
            if (value.length == 1) {
                value = value[0];
            }
            parameters[key] = value;
        }
    }
    return parameters;
};
OpenLayers.Util.lastSeqID = 0;
OpenLayers.Util.createUniqueID = function (prefix) {
    if (prefix == null) {
        prefix = "id_";
    }
    OpenLayers.Util.lastSeqID += 1;
    return prefix + OpenLayers.Util.lastSeqID;
};
OpenLayers.INCHES_PER_UNIT = {
    'inches': 1.0,
    'ft': 12.0,
    'mi': 63360.0,
    'm': 39.3701,
    'km': 39370.1,
    'dd': 4374754,
    'yd': 36
};
OpenLayers.INCHES_PER_UNIT["in"] = OpenLayers.INCHES_PER_UNIT.inches;
OpenLayers.INCHES_PER_UNIT["degrees"] = OpenLayers.INCHES_PER_UNIT.dd;
OpenLayers.INCHES_PER_UNIT["nmi"] = 1852 * OpenLayers.INCHES_PER_UNIT.m;
OpenLayers.METERS_PER_INCH = 0.02540005080010160020;
OpenLayers.Util.extend(OpenLayers.INCHES_PER_UNIT, {
    "Inch": OpenLayers.INCHES_PER_UNIT.inches,
    "Meter": 1.0 / OpenLayers.METERS_PER_INCH,
    "Foot": 0.30480060960121920243 / OpenLayers.METERS_PER_INCH,
    "IFoot": 0.30480000000000000000 / OpenLayers.METERS_PER_INCH,
    "ClarkeFoot": 0.3047972651151 / OpenLayers.METERS_PER_INCH,
    "SearsFoot": 0.30479947153867624624 / OpenLayers.METERS_PER_INCH,
    "GoldCoastFoot": 0.30479971018150881758 / OpenLayers.METERS_PER_INCH,
    "IInch": 0.02540000000000000000 / OpenLayers.METERS_PER_INCH,
    "MicroInch": 0.00002540000000000000 / OpenLayers.METERS_PER_INCH,
    "Mil": 0.00000002540000000000 / OpenLayers.METERS_PER_INCH,
    "Centimeter": 0.01000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Kilometer": 1000.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Yard": 0.91440182880365760731 / OpenLayers.METERS_PER_INCH,
    "SearsYard": 0.914398414616029 / OpenLayers.METERS_PER_INCH,
    "IndianYard": 0.91439853074444079983 / OpenLayers.METERS_PER_INCH,
    "IndianYd37": 0.91439523 / OpenLayers.METERS_PER_INCH,
    "IndianYd62": 0.9143988 / OpenLayers.METERS_PER_INCH,
    "IndianYd75": 0.9143985 / OpenLayers.METERS_PER_INCH,
    "IndianFoot": 0.30479951 / OpenLayers.METERS_PER_INCH,
    "IndianFt37": 0.30479841 / OpenLayers.METERS_PER_INCH,
    "IndianFt62": 0.3047996 / OpenLayers.METERS_PER_INCH,
    "IndianFt75": 0.3047995 / OpenLayers.METERS_PER_INCH,
    "Mile": 1609.34721869443738887477 / OpenLayers.METERS_PER_INCH,
    "IYard": 0.91440000000000000000 / OpenLayers.METERS_PER_INCH,
    "IMile": 1609.34400000000000000000 / OpenLayers.METERS_PER_INCH,
    "NautM": 1852.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Lat-66": 110943.316488932731 / OpenLayers.METERS_PER_INCH,
    "Lat-83": 110946.25736872234125 / OpenLayers.METERS_PER_INCH,
    "Decimeter": 0.10000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Millimeter": 0.00100000000000000000 / OpenLayers.METERS_PER_INCH,
    "Dekameter": 10.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Decameter": 10.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "Hectometer": 100.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "GermanMeter": 1.0000135965 / OpenLayers.METERS_PER_INCH,
    "CaGrid": 0.999738 / OpenLayers.METERS_PER_INCH,
    "ClarkeChain": 20.1166194976 / OpenLayers.METERS_PER_INCH,
    "GunterChain": 20.11684023368047 / OpenLayers.METERS_PER_INCH,
    "BenoitChain": 20.116782494375872 / OpenLayers.METERS_PER_INCH,
    "SearsChain": 20.11676512155 / OpenLayers.METERS_PER_INCH,
    "ClarkeLink": 0.201166194976 / OpenLayers.METERS_PER_INCH,
    "GunterLink": 0.2011684023368047 / OpenLayers.METERS_PER_INCH,
    "BenoitLink": 0.20116782494375872 / OpenLayers.METERS_PER_INCH,
    "SearsLink": 0.2011676512155 / OpenLayers.METERS_PER_INCH,
    "Rod": 5.02921005842012 / OpenLayers.METERS_PER_INCH,
    "IntnlChain": 20.1168 / OpenLayers.METERS_PER_INCH,
    "IntnlLink": 0.201168 / OpenLayers.METERS_PER_INCH,
    "Perch": 5.02921005842012 / OpenLayers.METERS_PER_INCH,
    "Pole": 5.02921005842012 / OpenLayers.METERS_PER_INCH,
    "Furlong": 201.1684023368046 / OpenLayers.METERS_PER_INCH,
    "Rood": 3.778266898 / OpenLayers.METERS_PER_INCH,
    "CapeFoot": 0.3047972615 / OpenLayers.METERS_PER_INCH,
    "Brealey": 375.00000000000000000000 / OpenLayers.METERS_PER_INCH,
    "ModAmFt": 0.304812252984505969011938 / OpenLayers.METERS_PER_INCH,
    "Fathom": 1.8288 / OpenLayers.METERS_PER_INCH,
    "NautM-UK": 1853.184 / OpenLayers.METERS_PER_INCH,
    "50kilometers": 50000.0 / OpenLayers.METERS_PER_INCH,
    "150kilometers": 150000.0 / OpenLayers.METERS_PER_INCH
});
OpenLayers.Util.extend(OpenLayers.INCHES_PER_UNIT, {
    "mm": OpenLayers.INCHES_PER_UNIT["Meter"] / 1000.0,
    "cm": OpenLayers.INCHES_PER_UNIT["Meter"] / 100.0,
    "dm": OpenLayers.INCHES_PER_UNIT["Meter"] * 100.0,
    "km": OpenLayers.INCHES_PER_UNIT["Meter"] * 1000.0,
    "kmi": OpenLayers.INCHES_PER_UNIT["nmi"],
    "fath": OpenLayers.INCHES_PER_UNIT["Fathom"],
    "ch": OpenLayers.INCHES_PER_UNIT["IntnlChain"],
    "link": OpenLayers.INCHES_PER_UNIT["IntnlLink"],
    "us-in": OpenLayers.INCHES_PER_UNIT["inches"],
    "us-ft": OpenLayers.INCHES_PER_UNIT["Foot"],
    "us-yd": OpenLayers.INCHES_PER_UNIT["Yard"],
    "us-ch": OpenLayers.INCHES_PER_UNIT["GunterChain"],
    "us-mi": OpenLayers.INCHES_PER_UNIT["Mile"],
    "ind-yd": OpenLayers.INCHES_PER_UNIT["IndianYd37"],
    "ind-ft": OpenLayers.INCHES_PER_UNIT["IndianFt37"],
    "ind-ch": 20.11669506 / OpenLayers.METERS_PER_INCH
});
OpenLayers.DOTS_PER_INCH = 72;
OpenLayers.Util.normalizeScale = function (scale) {
    var normScale = (scale > 1.0) ? (1.0 / scale) : scale;
    return normScale;
};
OpenLayers.Util.getResolutionFromScale = function (scale, units) {
    var resolution;
    if (scale) {
        if (units == null) {
            units = "degrees";
        }
        var normScale = OpenLayers.Util.normalizeScale(scale);
        resolution = 1 / (normScale * OpenLayers.INCHES_PER_UNIT[units] * OpenLayers.DOTS_PER_INCH);
    }
    return resolution;
};
OpenLayers.Util.getScaleFromResolution = function (resolution, units) {
    if (units == null) {
        units = "degrees";
    }
    var scale = resolution * OpenLayers.INCHES_PER_UNIT[units] * OpenLayers.DOTS_PER_INCH;
    return scale;
};
OpenLayers.Util.pagePosition = function (forElement) {
    var pos = [0, 0];
    var viewportElement = OpenLayers.Util.getViewportElement();
    if (!forElement || forElement == window || forElement == viewportElement) {
        return pos;
    }
    var BUGGY_GECKO_BOX_OBJECT = OpenLayers.IS_GECKO && document.getBoxObjectFor && OpenLayers.Element.getStyle(forElement, 'position') == 'absolute' && (forElement.style.top == '' || forElement.style.left == '');
    var parent = null;
    var box;
    if (forElement.getBoundingClientRect) {
        box = forElement.getBoundingClientRect();
        var scrollTop = viewportElement.scrollTop;
        var scrollLeft = viewportElement.scrollLeft;
        pos[0] = box.left + scrollLeft;
        pos[1] = box.top + scrollTop;
    } else if (document.getBoxObjectFor && !BUGGY_GECKO_BOX_OBJECT) {
        box = document.getBoxObjectFor(forElement);
        var vpBox = document.getBoxObjectFor(viewportElement);
        pos[0] = box.screenX - vpBox.screenX;
        pos[1] = box.screenY - vpBox.screenY;
    } else {
        pos[0] = forElement.offsetLeft;
        pos[1] = forElement.offsetTop;
        parent = forElement.offsetParent;
        if (parent != forElement) {
            while (parent) {
                pos[0] += parent.offsetLeft;
                pos[1] += parent.offsetTop;
                parent = parent.offsetParent;
            }
        }
        var browser = OpenLayers.BROWSER_NAME;
        if (browser == "opera" || (browser == "safari" && OpenLayers.Element.getStyle(forElement, 'position') == 'absolute')) {
            pos[1] -= document.body.offsetTop;
        }
        parent = forElement.offsetParent;
        while (parent && parent != document.body) {
            pos[0] -= parent.scrollLeft;
            if (browser != "opera" || parent.tagName != 'TR') {
                pos[1] -= parent.scrollTop;
            }
            parent = parent.offsetParent;
        }
    }
    return pos;
};
OpenLayers.Util.getViewportElement = function () {
    var viewportElement = arguments.callee.viewportElement;
    if (viewportElement == undefined) {
        viewportElement = (OpenLayers.BROWSER_NAME == "msie" && document.compatMode != 'CSS1Compat') ? document.body : document.documentElement;
        arguments.callee.viewportElement = viewportElement;
    }
    return viewportElement;
};
OpenLayers.Util.isEquivalentUrl = function (url1, url2, options) {
    options = options || {};
    OpenLayers.Util.applyDefaults(options, {
        ignoreCase: true,
        ignorePort80: true,
        ignoreHash: true
    });
    var urlObj1 = OpenLayers.Util.createUrlObject(url1, options);
    var urlObj2 = OpenLayers.Util.createUrlObject(url2, options);
    for (var key in urlObj1) {
        if (key !== "args") {
            if (urlObj1[key] != urlObj2[key]) {
                return false;
            }
        }
    }
    for (var key in urlObj1.args) {
        if (urlObj1.args[key] != urlObj2.args[key]) {
            return false;
        }
        delete urlObj2.args[key];
    }
    for (var key in urlObj2.args) {
        return false;
    }
    return true;
};
OpenLayers.Util.createUrlObject = function (url, options) {
    options = options || {};
    if (!(/^\w+:\/\//).test(url)) {
        var loc = window.location;
        var port = loc.port ? ":" + loc.port : "";
        var fullUrl = loc.protocol + "//" + loc.host.split(":").shift() + port;
        if (url.indexOf("/") === 0) {
            url = fullUrl + url;
        } else {
            var parts = loc.pathname.split("/");
            parts.pop();
            url = fullUrl + parts.join("/") + "/" + url;
        }
    }
    if (options.ignoreCase) {
        url = url.toLowerCase();
    }
    var a = document.createElement('a');
    a.href = url;
    var urlObject = {};
    urlObject.host = a.host.split(":").shift();
    urlObject.protocol = a.protocol;
    if (options.ignorePort80) {
        urlObject.port = (a.port == "80" || a.port == "0") ? "" : a.port;
    } else {
        urlObject.port = (a.port == "" || a.port == "0") ? "80" : a.port;
    }
    urlObject.hash = (options.ignoreHash || a.hash === "#") ? "" : a.hash;
    var queryString = a.search;
    if (!queryString) {
        var qMark = url.indexOf("?");
        queryString = (qMark != -1) ? url.substr(qMark) : "";
    }
    urlObject.args = OpenLayers.Util.getParameters(queryString);
    urlObject.pathname = (a.pathname.charAt(0) == "/") ? a.pathname : "/" + a.pathname;
    return urlObject;
};
OpenLayers.Util.removeTail = function (url) {
    var head = null;
    var qMark = url.indexOf("?");
    var hashMark = url.indexOf("#");
    if (qMark == -1) {
        head = (hashMark != -1) ? url.substr(0, hashMark) : url;
    } else {
        head = (hashMark != -1) ? url.substr(0, Math.min(qMark, hashMark)) : url.substr(0, qMark);
    }
    return head;
};
OpenLayers.IS_GECKO = (function () {
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("webkit") == -1 && ua.indexOf("gecko") != -1;
})();
OpenLayers.CANVAS_SUPPORTED = (function () {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
})();
OpenLayers.BROWSER_NAME = (function () {
    var name = "";
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("opera") != -1) {
        name = "opera";
    } else if (ua.indexOf("msie") != -1) {
        name = "msie";
    } else if (ua.indexOf("safari") != -1) {
        name = "safari";
    } else if (ua.indexOf("mozilla") != -1) {
        if (ua.indexOf("firefox") != -1) {
            name = "firefox";
        } else {
            name = "mozilla";
        }
    }
    return name;
})();
OpenLayers.Util.getBrowserName = function () {
    return OpenLayers.BROWSER_NAME;
};
OpenLayers.Util.getRenderedDimensions = function (contentHTML, size, options) {
    var w, h;
    var container = document.createElement("div");
    container.style.visibility = "hidden";
    var containerElement = (options && options.containerElement) ? options.containerElement : document.body;
    var parentHasPositionAbsolute = false;
    var superContainer = null;
    var parent = containerElement;
    while (parent && parent.tagName.toLowerCase() != "body") {
        var parentPosition = OpenLayers.Element.getStyle(parent, "position");
        if (parentPosition == "absolute") {
            parentHasPositionAbsolute = true;
            break;
        } else if (parentPosition && parentPosition != "static") {
            break;
        }
        parent = parent.parentNode;
    }
    if (parentHasPositionAbsolute && (containerElement.clientHeight === 0 || containerElement.clientWidth === 0)) {
        superContainer = document.createElement("div");
        superContainer.style.visibility = "hidden";
        superContainer.style.position = "absolute";
        superContainer.style.overflow = "visible";
        superContainer.style.width = document.body.clientWidth + "px";
        superContainer.style.height = document.body.clientHeight + "px";
        superContainer.appendChild(container);
    }
    container.style.position = "absolute";
    if (size) {
        if (size.w) {
            w = size.w;
            container.style.width = w + "px";
        } else if (size.h) {
            h = size.h;
            container.style.height = h + "px";
        }
    }
    if (options && options.displayClass) {
        container.className = options.displayClass;
    }
    var content = document.createElement("div");
    content.innerHTML = contentHTML;
    content.style.overflow = "visible";
    if (content.childNodes) {
        for (var i = 0, l = content.childNodes.length; i < l; i++) {
            if (!content.childNodes[i].style) continue;
            content.childNodes[i].style.overflow = "visible";
        }
    }
    container.appendChild(content);
    if (superContainer) {
        containerElement.appendChild(superContainer);
    } else {
        containerElement.appendChild(container);
    }
    if (!w) {
        w = parseInt(content.scrollWidth);
        container.style.width = w + "px";
    }
    if (!h) {
        h = parseInt(content.scrollHeight);
    }
    container.removeChild(content);
    if (superContainer) {
        superContainer.removeChild(container);
        containerElement.removeChild(superContainer);
    } else {
        containerElement.removeChild(container);
    }
    return new OpenLayers.Size(w, h);
};
OpenLayers.Util.getScrollbarWidth = function () {
    var scrollbarWidth = OpenLayers.Util._scrollbarWidth;
    if (scrollbarWidth == null) {
        var scr = null;
        var inn = null;
        var wNoScroll = 0;
        var wScroll = 0;
        scr = document.createElement('div');
        scr.style.position = 'absolute';
        scr.style.top = '-1000px';
        scr.style.left = '-1000px';
        scr.style.width = '100px';
        scr.style.height = '50px';
        scr.style.overflow = 'hidden';
        inn = document.createElement('div');
        inn.style.width = '100%';
        inn.style.height = '200px';
        scr.appendChild(inn);
        document.body.appendChild(scr);
        wNoScroll = inn.offsetWidth;
        scr.style.overflow = 'scroll';
        wScroll = inn.offsetWidth;
        document.body.removeChild(document.body.lastChild);
        OpenLayers.Util._scrollbarWidth = (wNoScroll - wScroll);
        scrollbarWidth = OpenLayers.Util._scrollbarWidth;
    }
    return scrollbarWidth;
};
OpenLayers.Util.getFormattedLonLat = function (coordinate, axis, dmsOption) {
    if (!dmsOption) {
        dmsOption = 'dms';
    }
    coordinate = (coordinate + 540) % 360 - 180;
    var abscoordinate = Math.abs(coordinate);
    var coordinatedegrees = Math.floor(abscoordinate);
    var coordinateminutes = (abscoordinate - coordinatedegrees) / (1 / 60);
    var tempcoordinateminutes = coordinateminutes;
    coordinateminutes = Math.floor(coordinateminutes);
    var coordinateseconds = (tempcoordinateminutes - coordinateminutes) / (1 / 60);
    coordinateseconds = Math.round(coordinateseconds * 10);
    coordinateseconds /= 10;
    if (coordinateseconds >= 60) {
        coordinateseconds -= 60;
        coordinateminutes += 1;
        if (coordinateminutes >= 60) {
            coordinateminutes -= 60;
            coordinatedegrees += 1;
        }
    }
    if (coordinatedegrees < 10) {
        coordinatedegrees = "0" + coordinatedegrees;
    }
    var str = coordinatedegrees + "\u00B0";
    if (dmsOption.indexOf('dm') >= 0) {
        if (coordinateminutes < 10) {
            coordinateminutes = "0" + coordinateminutes;
        }
        str += coordinateminutes + "'";
        if (dmsOption.indexOf('dms') >= 0) {
            if (coordinateseconds < 10) {
                coordinateseconds = "0" + coordinateseconds;
            }
            str += coordinateseconds + '"';
        }
    }
    if (axis == "lon") {
        str += coordinate < 0 ? OpenLayers.i18n("W") : OpenLayers.i18n("E");
    } else {
        str += coordinate < 0 ? OpenLayers.i18n("S") : OpenLayers.i18n("N");
    }
    return str;
};
OpenLayers.Animation = (function (window) {
    var isNative = !! (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame);
    var requestFrame = (function () {
        var request = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
                window.setTimeout(callback, 16);
            };
        return function (callback, element) {
            request.apply(window, [callback, element]);
        };
    })();
    var counter = 0;
    var loops = {};

    function start(callback, duration, element) {
        duration = duration > 0 ? duration : Number.POSITIVE_INFINITY;
        var id = ++counter;
        var start = +new Date;
        loops[id] = function () {
            if (loops[id] && +new Date - start <= duration) {
                callback();
                if (loops[id]) {
                    requestFrame(loops[id], element);
                }
            } else {
                delete loops[id];
            }
        };
        requestFrame(loops[id], element);
        return id;
    }

    function stop(id) {
        delete loops[id];
    }
    return {
        isNative: isNative,
        requestFrame: requestFrame,
        start: start,
        stop: stop
    };
})(window);
OpenLayers.String = {
    startsWith: function (str, sub) {
        return (str.indexOf(sub) == 0);
    },
    contains: function (str, sub) {
        return (str.indexOf(sub) != -1);
    },
    trim: function (str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },
    camelize: function (str) {
        var oStringList = str.split('-');
        var camelizedString = oStringList[0];
        for (var i = 1, len = oStringList.length; i < len; i++) {
            var s = oStringList[i];
            camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
        }
        return camelizedString;
    },
    format: function (template, context, args) {
        if (!context) {
            context = window;
        }
        var replacer = function (str, match) {
            var replacement;
            var subs = match.split(/\.+/);
            for (var i = 0; i < subs.length; i++) {
                if (i == 0) {
                    replacement = context;
                }
                replacement = replacement[subs[i]];
            }
            if (typeof replacement == "function") {
                replacement = args ? replacement.apply(null, args) : replacement();
            }
            if (typeof replacement == 'undefined') {
                return 'undefined';
            } else {
                return replacement;
            }
        };
        return template.replace(OpenLayers.String.tokenRegEx, replacer);
    },
    tokenRegEx: /\$\{([\w.]+?)\}/g,
    numberRegEx: /^([+-]?)(?=\d|\.\d)\d*(\.\d*)?([Ee]([+-]?\d+))?$/,
    isNumeric: function (value) {
        return OpenLayers.String.numberRegEx.test(value);
    },
    numericIf: function (value) {
        return OpenLayers.String.isNumeric(value) ? parseFloat(value) : value;
    }
};
OpenLayers.Number = {
    decimalSeparator: ".",
    thousandsSeparator: ",",
    limitSigDigs: function (num, sig) {
        var fig = 0;
        if (sig > 0) {
            fig = parseFloat(num.toPrecision(sig));
        }
        return fig;
    },
    format: function (num, dec, tsep, dsep) {
        dec = (typeof dec != "undefined") ? dec : 0;
        tsep = (typeof tsep != "undefined") ? tsep : OpenLayers.Number.thousandsSeparator;
        dsep = (typeof dsep != "undefined") ? dsep : OpenLayers.Number.decimalSeparator;
        if (dec != null) {
            num = parseFloat(num.toFixed(dec));
        }
        var parts = num.toString().split(".");
        if (parts.length == 1 && dec == null) {
            dec = 0;
        }
        var integer = parts[0];
        if (tsep) {
            var thousands = /(-?[0-9]+)([0-9]{3})/;
            while (thousands.test(integer)) {
                integer = integer.replace(thousands, "$1" + tsep + "$2");
            }
        }
        var str;
        if (dec == 0) {
            str = integer;
        } else {
            var rem = parts.length > 1 ? parts[1] : "0";
            if (dec != null) {
                rem = rem + new Array(dec - rem.length + 1).join("0");
            }
            str = integer + dsep + rem;
        }
        return str;
    }
};
OpenLayers.Function = {
    bind: function (func, object) {
        var args = Array.prototype.slice.apply(arguments, [2]);
        return function () {
            var newArgs = args.concat(Array.prototype.slice.apply(arguments, [0]));
            return func.apply(object, newArgs);
        };
    },
    bindAsEventListener: function (func, object) {
        return function (event) {
            return func.call(object, event || window.event);
        };
    },
    False: function () {
        return false;
    },
    True: function () {
        return true;
    },
    Void: function () {}
};
OpenLayers.Array = {
    filter: function (array, callback, caller) {
        var selected = [];
        if (Array.prototype.filter) {
            selected = array.filter(callback, caller);
        } else {
            var len = array.length;
            if (typeof callback != "function") {
                throw new TypeError();
            }
            for (var i = 0; i < len; i++) {
                if (i in array) {
                    var val = array[i];
                    if (callback.call(caller, val, i, array)) {
                        selected.push(val);
                    }
                }
            }
        }
        return selected;
    }
};
OpenLayers.Bounds = OpenLayers.Class({
    left: null,
    bottom: null,
    right: null,
    top: null,
    centerLonLat: null,
    initialize: function (left, bottom, right, top) {
        if (OpenLayers.Util.isArray(left)) {
            top = left[3];
            right = left[2];
            bottom = left[1];
            left = left[0];
        }
        if (left != null) {
            this.left = OpenLayers.Util.toFloat(left);
        }
        if (bottom != null) {
            this.bottom = OpenLayers.Util.toFloat(bottom);
        }
        if (right != null) {
            this.right = OpenLayers.Util.toFloat(right);
        }
        if (top != null) {
            this.top = OpenLayers.Util.toFloat(top);
        }
    },
    clone: function () {
        return new OpenLayers.Bounds(this.left, this.bottom, this.right, this.top);
    },
    equals: function (bounds) {
        var equals = false;
        if (bounds != null) {
            equals = ((this.left == bounds.left) && (this.right == bounds.right) && (this.top == bounds.top) && (this.bottom == bounds.bottom));
        }
        return equals;
    },
    toString: function () {
        return [this.left, this.bottom, this.right, this.top].join(",");
    },
    toArray: function (reverseAxisOrder) {
        if (reverseAxisOrder === true) {
            return [this.bottom, this.left, this.top, this.right];
        } else {
            return [this.left, this.bottom, this.right, this.top];
        }
    },
    toBBOX: function (decimal, reverseAxisOrder) {
        if (decimal == null) {
            decimal = 6;
        }
        var mult = Math.pow(10, decimal);
        var xmin = Math.round(this.left * mult) / mult;
        var ymin = Math.round(this.bottom * mult) / mult;
        var xmax = Math.round(this.right * mult) / mult;
        var ymax = Math.round(this.top * mult) / mult;
        if (reverseAxisOrder === true) {
            return ymin + "," + xmin + "," + ymax + "," + xmax;
        } else {
            return xmin + "," + ymin + "," + xmax + "," + ymax;
        }
    },
    toGeometry: function () {
        return new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing([new OpenLayers.Geometry.Point(this.left, this.bottom), new OpenLayers.Geometry.Point(this.right, this.bottom), new OpenLayers.Geometry.Point(this.right, this.top), new OpenLayers.Geometry.Point(this.left, this.top)])]);
    },
    getWidth: function () {
        return (this.right - this.left);
    },
    getHeight: function () {
        return (this.top - this.bottom);
    },
    getSize: function () {
        return new OpenLayers.Size(this.getWidth(), this.getHeight());
    },
    getCenterPixel: function () {
        return new OpenLayers.Pixel((this.left + this.right) / 2, (this.bottom + this.top) / 2);
    },
    getCenterLonLat: function () {
        if (!this.centerLonLat) {
            this.centerLonLat = new OpenLayers.LonLat((this.left + this.right) / 2, (this.bottom + this.top) / 2);
        }
        return this.centerLonLat;
    },
    scale: function (ratio, origin) {
        if (origin == null) {
            origin = this.getCenterLonLat();
        }
        var origx, origy;
        if (origin.CLASS_NAME == "OpenLayers.LonLat") {
            origx = origin.lon;
            origy = origin.lat;
        } else {
            origx = origin.x;
            origy = origin.y;
        }
        var left = (this.left - origx) * ratio + origx;
        var bottom = (this.bottom - origy) * ratio + origy;
        var right = (this.right - origx) * ratio + origx;
        var top = (this.top - origy) * ratio + origy;
        return new OpenLayers.Bounds(left, bottom, right, top);
    },
    add: function (x, y) {
        if ((x == null) || (y == null)) {
            throw new TypeError('Bounds.add cannot receive null values');
        }
        return new OpenLayers.Bounds(this.left + x, this.bottom + y, this.right + x, this.top + y);
    },
    extend: function (object) {
        var bounds = null;
        if (object) {
            switch (object.CLASS_NAME) {
            case "OpenLayers.LonLat":
                bounds = new OpenLayers.Bounds(object.lon, object.lat, object.lon, object.lat);
                break;
            case "OpenLayers.Geometry.Point":
                bounds = new OpenLayers.Bounds(object.x, object.y, object.x, object.y);
                break;
            case "OpenLayers.Bounds":
                bounds = object;
                break;
            }
            if (bounds) {
                this.centerLonLat = null;
                if ((this.left == null) || (bounds.left < this.left)) {
                    this.left = bounds.left;
                }
                if ((this.bottom == null) || (bounds.bottom < this.bottom)) {
                    this.bottom = bounds.bottom;
                }
                if ((this.right == null) || (bounds.right > this.right)) {
                    this.right = bounds.right;
                }
                if ((this.top == null) || (bounds.top > this.top)) {
                    this.top = bounds.top;
                }
            }
        }
    },
    containsLonLat: function (ll, options) {
        if (typeof options === "boolean") {
            options = {
                inclusive: options
            };
        }
        options = options || {};
        var contains = this.contains(ll.lon, ll.lat, options.inclusive),
            worldBounds = options.worldBounds;
        if (worldBounds && !contains) {
            var worldWidth = worldBounds.getWidth();
            var worldCenterX = (worldBounds.left + worldBounds.right) / 2;
            var worldsAway = Math.round((ll.lon - worldCenterX) / worldWidth);
            contains = this.containsLonLat({
                lon: ll.lon - worldsAway * worldWidth,
                lat: ll.lat
            }, {
                inclusive: options.inclusive
            });
        }
        return contains;
    },
    containsPixel: function (px, inclusive) {
        return this.contains(px.x, px.y, inclusive);
    },
    contains: function (x, y, inclusive) {
        if (inclusive == null) {
            inclusive = true;
        }
        if (x == null || y == null) {
            return false;
        }
        x = OpenLayers.Util.toFloat(x);
        y = OpenLayers.Util.toFloat(y);
        var contains = false;
        if (inclusive) {
            contains = ((x >= this.left) && (x <= this.right) && (y >= this.bottom) && (y <= this.top));
        } else {
            contains = ((x > this.left) && (x < this.right) && (y > this.bottom) && (y < this.top));
        }
        return contains;
    },
    intersectsBounds: function (bounds, options) {
        if (typeof options === "boolean") {
            options = {
                inclusive: options
            };
        }
        options = options || {};
        if (options.worldBounds) {
            var self = this.wrapDateLine(options.worldBounds);
            bounds = bounds.wrapDateLine(options.worldBounds);
        } else {
            self = this;
        }
        if (options.inclusive == null) {
            options.inclusive = true;
        }
        var intersects = false;
        var mightTouch = (self.left == bounds.right || self.right == bounds.left || self.top == bounds.bottom || self.bottom == bounds.top);
        if (options.inclusive || !mightTouch) {
            var inBottom = (((bounds.bottom >= self.bottom) && (bounds.bottom <= self.top)) || ((self.bottom >= bounds.bottom) && (self.bottom <= bounds.top)));
            var inTop = (((bounds.top >= self.bottom) && (bounds.top <= self.top)) || ((self.top > bounds.bottom) && (self.top < bounds.top)));
            var inLeft = (((bounds.left >= self.left) && (bounds.left <= self.right)) || ((self.left >= bounds.left) && (self.left <= bounds.right)));
            var inRight = (((bounds.right >= self.left) && (bounds.right <= self.right)) || ((self.right >= bounds.left) && (self.right <= bounds.right)));
            intersects = ((inBottom || inTop) && (inLeft || inRight));
        }
        if (options.worldBounds && !intersects) {
            var world = options.worldBounds;
            var width = world.getWidth();
            var selfCrosses = !world.containsBounds(self);
            var boundsCrosses = !world.containsBounds(bounds);
            if (selfCrosses && !boundsCrosses) {
                bounds = bounds.add(-width, 0);
                intersects = self.intersectsBounds(bounds, {
                    inclusive: options.inclusive
                });
            } else if (boundsCrosses && !selfCrosses) {
                self = self.add(-width, 0);
                intersects = bounds.intersectsBounds(self, {
                    inclusive: options.inclusive
                });
            }
        }
        return intersects;
    },
    containsBounds: function (bounds, partial, inclusive) {
        if (partial == null) {
            partial = false;
        }
        if (inclusive == null) {
            inclusive = true;
        }
        var bottomLeft = this.contains(bounds.left, bounds.bottom, inclusive);
        var bottomRight = this.contains(bounds.right, bounds.bottom, inclusive);
        var topLeft = this.contains(bounds.left, bounds.top, inclusive);
        var topRight = this.contains(bounds.right, bounds.top, inclusive);
        return (partial) ? (bottomLeft || bottomRight || topLeft || topRight) : (bottomLeft && bottomRight && topLeft && topRight);
    },
    determineQuadrant: function (lonlat) {
        var quadrant = "";
        var center = this.getCenterLonLat();
        quadrant += (lonlat.lat < center.lat) ? "b" : "t";
        quadrant += (lonlat.lon < center.lon) ? "l" : "r";
        return quadrant;
    },
    transform: function (source, dest) {
        this.centerLonLat = null;
        var ll = OpenLayers.Projection.transform({
            'x': this.left,
            'y': this.bottom
        }, source, dest);
        var lr = OpenLayers.Projection.transform({
            'x': this.right,
            'y': this.bottom
        }, source, dest);
        var ul = OpenLayers.Projection.transform({
            'x': this.left,
            'y': this.top
        }, source, dest);
        var ur = OpenLayers.Projection.transform({
            'x': this.right,
            'y': this.top
        }, source, dest);
        this.left = Math.min(ll.x, ul.x);
        this.bottom = Math.min(ll.y, lr.y);
        this.right = Math.max(lr.x, ur.x);
        this.top = Math.max(ul.y, ur.y);
        return this;
    },
    wrapDateLine: function (maxExtent, options) {
        options = options || {};
        var leftTolerance = options.leftTolerance || 0;
        var rightTolerance = options.rightTolerance || 0;
        var newBounds = this.clone();
        if (maxExtent) {
            var width = maxExtent.getWidth();
            while (newBounds.left < maxExtent.left && newBounds.right - rightTolerance <= maxExtent.left) {
                newBounds = newBounds.add(width, 0);
            }
            while (newBounds.left + leftTolerance >= maxExtent.right && newBounds.right > maxExtent.right) {
                newBounds = newBounds.add(-width, 0);
            }
            var newLeft = newBounds.left + leftTolerance;
            if (newLeft < maxExtent.right && newLeft > maxExtent.left && newBounds.right - rightTolerance > maxExtent.right) {
                newBounds = newBounds.add(-width, 0);
            }
        }
        return newBounds;
    },
    CLASS_NAME: "OpenLayers.Bounds"
});
OpenLayers.Bounds.fromString = function (str, reverseAxisOrder) {
    var bounds = str.split(",");
    return OpenLayers.Bounds.fromArray(bounds, reverseAxisOrder);
};
OpenLayers.Bounds.fromArray = function (bbox, reverseAxisOrder) {
    return reverseAxisOrder === true ? new OpenLayers.Bounds(bbox[1], bbox[0], bbox[3], bbox[2]) : new OpenLayers.Bounds(bbox[0], bbox[1], bbox[2], bbox[3]);
};
OpenLayers.Bounds.fromSize = function (size) {
    return new OpenLayers.Bounds(0, size.h, size.w, 0);
};
OpenLayers.Bounds.oppositeQuadrant = function (quadrant) {
    var opp = "";
    opp += (quadrant.charAt(0) == 't') ? 'b' : 't';
    opp += (quadrant.charAt(1) == 'l') ? 'r' : 'l';
    return opp;
};
OpenLayers.Element = {
    visible: function (element) {
        return OpenLayers.Util.getElement(element).style.display != 'none';
    },
    toggle: function () {
        for (var i = 0, len = arguments.length; i < len; i++) {
            var element = OpenLayers.Util.getElement(arguments[i]);
            var display = OpenLayers.Element.visible(element) ? 'none' : '';
            element.style.display = display;
        }
    },
    remove: function (element) {
        element = OpenLayers.Util.getElement(element);
        element.parentNode.removeChild(element);
    },
    getHeight: function (element) {
        element = OpenLayers.Util.getElement(element);
        return element.offsetHeight;
    },
    hasClass: function (element, name) {
        var names = element.className;
        return ( !! names && new RegExp("(^|\\s)" + name + "(\\s|$)").test(names));
    },
    addClass: function (element, name) {
        if (!OpenLayers.Element.hasClass(element, name)) {
            element.className += (element.className ? " " : "") + name;
        }
        return element;
    },
    removeClass: function (element, name) {
        var names = element.className;
        if (names) {
            element.className = OpenLayers.String.trim(names.replace(new RegExp("(^|\\s+)" + name + "(\\s+|$)"), " "));
        }
        return element;
    },
    toggleClass: function (element, name) {
        if (OpenLayers.Element.hasClass(element, name)) {
            OpenLayers.Element.removeClass(element, name);
        } else {
            OpenLayers.Element.addClass(element, name);
        }
        return element;
    },
    getStyle: function (element, style) {
        element = OpenLayers.Util.getElement(element);
        var value = null;
        if (element && element.style) {
            value = element.style[OpenLayers.String.camelize(style)];
            if (!value) {
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    var css = document.defaultView.getComputedStyle(element, null);
                    value = css ? css.getPropertyValue(style) : null;
                } else if (element.currentStyle) {
                    value = element.currentStyle[OpenLayers.String.camelize(style)];
                }
            }
            var positions = ['left', 'top', 'right', 'bottom'];
            if (window.opera && (OpenLayers.Util.indexOf(positions, style) != -1) && (OpenLayers.Element.getStyle(element, 'position') == 'static')) {
                value = 'auto';
            }
        }
        return value == 'auto' ? null : value;
    }
};
OpenLayers.LonLat = OpenLayers.Class({
    lon: 0.0,
    lat: 0.0,
    initialize: function (lon, lat) {
        if (OpenLayers.Util.isArray(lon)) {
            lat = lon[1];
            lon = lon[0];
        }
        this.lon = OpenLayers.Util.toFloat(lon);
        this.lat = OpenLayers.Util.toFloat(lat);
    },
    toString: function () {
        return ("lon=" + this.lon + ",lat=" + this.lat);
    },
    toShortString: function () {
        return (this.lon + ", " + this.lat);
    },
    clone: function () {
        return new OpenLayers.LonLat(this.lon, this.lat);
    },
    add: function (lon, lat) {
        if ((lon == null) || (lat == null)) {
            throw new TypeError('LonLat.add cannot receive null values');
        }
        return new OpenLayers.LonLat(this.lon + OpenLayers.Util.toFloat(lon), this.lat + OpenLayers.Util.toFloat(lat));
    },
    equals: function (ll) {
        var equals = false;
        if (ll != null) {
            equals = ((this.lon == ll.lon && this.lat == ll.lat) || (isNaN(this.lon) && isNaN(this.lat) && isNaN(ll.lon) && isNaN(ll.lat)));
        }
        return equals;
    },
    transform: function (source, dest) {
        var point = OpenLayers.Projection.transform({
            'x': this.lon,
            'y': this.lat
        }, source, dest);
        this.lon = point.x;
        this.lat = point.y;
        return this;
    },
    wrapDateLine: function (maxExtent) {
        var newLonLat = this.clone();
        if (maxExtent) {
            while (newLonLat.lon < maxExtent.left) {
                newLonLat.lon += maxExtent.getWidth();
            }
            while (newLonLat.lon > maxExtent.right) {
                newLonLat.lon -= maxExtent.getWidth();
            }
        }
        return newLonLat;
    },
    CLASS_NAME: "OpenLayers.LonLat"
});
OpenLayers.LonLat.fromString = function (str) {
    var pair = str.split(",");
    return new OpenLayers.LonLat(pair[0], pair[1]);
};
OpenLayers.LonLat.fromArray = function (arr) {
    var gotArr = OpenLayers.Util.isArray(arr),
        lon = gotArr && arr[0],
        lat = gotArr && arr[1];
    return new OpenLayers.LonLat(lon, lat);
};
OpenLayers.Pixel = OpenLayers.Class({
    x: 0.0,
    y: 0.0,
    initialize: function (x, y) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    },
    toString: function () {
        return ("x=" + this.x + ",y=" + this.y);
    },
    clone: function () {
        return new OpenLayers.Pixel(this.x, this.y);
    },
    equals: function (px) {
        var equals = false;
        if (px != null) {
            equals = ((this.x == px.x && this.y == px.y) || (isNaN(this.x) && isNaN(this.y) && isNaN(px.x) && isNaN(px.y)));
        }
        return equals;
    },
    distanceTo: function (px) {
        return Math.sqrt(Math.pow(this.x - px.x, 2) +
            Math.pow(this.y - px.y, 2));
    },
    add: function (x, y) {
        if ((x == null) || (y == null)) {
            throw new TypeError('Pixel.add cannot receive null values');
        }
        return new OpenLayers.Pixel(this.x + x, this.y + y);
    },
    offset: function (px) {
        var newPx = this.clone();
        if (px) {
            newPx = this.add(px.x, px.y);
        }
        return newPx;
    },
    CLASS_NAME: "OpenLayers.Pixel"
});
OpenLayers.Size = OpenLayers.Class({
    w: 0.0,
    h: 0.0,
    initialize: function (w, h) {
        this.w = parseFloat(w);
        this.h = parseFloat(h);
    },
    toString: function () {
        return ("w=" + this.w + ",h=" + this.h);
    },
    clone: function () {
        return new OpenLayers.Size(this.w, this.h);
    },
    equals: function (sz) {
        var equals = false;
        if (sz != null) {
            equals = ((this.w == sz.w && this.h == sz.h) || (isNaN(this.w) && isNaN(this.h) && isNaN(sz.w) && isNaN(sz.h)));
        }
        return equals;
    },
    CLASS_NAME: "OpenLayers.Size"
});
OpenLayers.Console = {
    log: function () {},
    debug: function () {},
    info: function () {},
    warn: function () {},
    error: function () {},
    userError: function (error) {
        alert(error);
    },
    assert: function () {},
    dir: function () {},
    dirxml: function () {},
    trace: function () {},
    group: function () {},
    groupEnd: function () {},
    time: function () {},
    timeEnd: function () {},
    profile: function () {},
    profileEnd: function () {},
    count: function () {},
    CLASS_NAME: "OpenLayers.Console"
};
(function () {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0, len = scripts.length; i < len; ++i) {
        if (scripts[i].src.indexOf("firebug.js") != -1) {
            if (console) {
                OpenLayers.Util.extend(OpenLayers.Console, console);
                break;
            }
        }
    }
})();
OpenLayers.Tween = OpenLayers.Class({
    easing: null,
    begin: null,
    finish: null,
    duration: null,
    callbacks: null,
    time: null,
    animationId: null,
    playing: false,
    initialize: function (easing) {
        this.easing = (easing) ? easing : OpenLayers.Easing.Expo.easeOut;
    },
    start: function (begin, finish, duration, options) {
        this.playing = true;
        this.begin = begin;
        this.finish = finish;
        this.duration = duration;
        this.callbacks = options.callbacks;
        this.time = 0;
        OpenLayers.Animation.stop(this.animationId);
        this.animationId = null;
        if (this.callbacks && this.callbacks.start) {
            this.callbacks.start.call(this, this.begin);
        }
        this.animationId = OpenLayers.Animation.start(OpenLayers.Function.bind(this.play, this));
    },
    stop: function () {
        if (!this.playing) {
            return;
        }
        if (this.callbacks && this.callbacks.done) {
            this.callbacks.done.call(this, this.finish);
        }
        OpenLayers.Animation.stop(this.animationId);
        this.animationId = null;
        this.playing = false;
    },
    play: function () {
        var value = {};
        for (var i in this.begin) {
            var b = this.begin[i];
            var f = this.finish[i];
            if (b == null || f == null || isNaN(b) || isNaN(f)) {
                throw new TypeError('invalid value for Tween');
            }
            var c = f - b;
            value[i] = this.easing.apply(this, [this.time, b, c, this.duration]);
        }
        this.time++;
        if (this.callbacks && this.callbacks.eachStep) {
            this.callbacks.eachStep.call(this, value);
        }
        if (this.time > this.duration) {
            this.stop();
        }
    },
    CLASS_NAME: "OpenLayers.Tween"
});
OpenLayers.Easing = {
    CLASS_NAME: "OpenLayers.Easing"
};
OpenLayers.Easing.Linear = {
    easeIn: function (t, b, c, d) {
        return c * t / d + b;
    },
    easeOut: function (t, b, c, d) {
        return c * t / d + b;
    },
    easeInOut: function (t, b, c, d) {
        return c * t / d + b;
    },
    CLASS_NAME: "OpenLayers.Easing.Linear"
};
OpenLayers.Easing.Expo = {
    easeIn: function (t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOut: function (t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOut: function (t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    CLASS_NAME: "OpenLayers.Easing.Expo"
};
OpenLayers.Easing.Quad = {
    easeIn: function (t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeOut: function (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    CLASS_NAME: "OpenLayers.Easing.Quad"
};
OpenLayers.Event = {
    observers: false,
    KEY_SPACE: 32,
    KEY_BACKSPACE: 8,
    KEY_TAB: 9,
    KEY_RETURN: 13,
    KEY_ESC: 27,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_DELETE: 46,
    element: function (event) {
        return event.target || event.srcElement;
    },
    isSingleTouch: function (event) {
        return event.touches && event.touches.length == 1;
    },
    isMultiTouch: function (event) {
        return event.touches && event.touches.length > 1;
    },
    isLeftClick: function (event) {
        return (((event.which) && (event.which == 1)) || ((event.button) && (event.button == 1)));
    },
    isRightClick: function (event) {
        return (((event.which) && (event.which == 3)) || ((event.button) && (event.button == 2)));
    },
    stop: function (event, allowDefault) {
        if (!allowDefault) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    findElement: function (event, tagName) {
        var element = OpenLayers.Event.element(event);
        while (element.parentNode && (!element.tagName || (element.tagName.toUpperCase() != tagName.toUpperCase()))) {
            element = element.parentNode;
        }
        return element;
    },
    observe: function (elementParam, name, observer, useCapture) {
        var element = OpenLayers.Util.getElement(elementParam);
        useCapture = useCapture || false;
        if (name == 'keypress' && (navigator.appVersion.match(/Konqueror|Safari|KHTML/) || element.attachEvent)) {
            name = 'keydown';
        }
        if (!this.observers) {
            this.observers = {};
        }
        if (!element._eventCacheID) {
            var idPrefix = "eventCacheID_";
            if (element.id) {
                idPrefix = element.id + "_" + idPrefix;
            }
            element._eventCacheID = OpenLayers.Util.createUniqueID(idPrefix);
        }
        var cacheID = element._eventCacheID;
        if (!this.observers[cacheID]) {
            this.observers[cacheID] = [];
        }
        this.observers[cacheID].push({
            'element': element,
            'name': name,
            'observer': observer,
            'useCapture': useCapture
        });
        if (element.addEventListener) {
            element.addEventListener(name, observer, useCapture);
        } else if (element.attachEvent) {
            element.attachEvent('on' + name, observer);
        }
    },
    stopObservingElement: function (elementParam) {
        var element = OpenLayers.Util.getElement(elementParam);
        var cacheID = element._eventCacheID;
        this._removeElementObservers(OpenLayers.Event.observers[cacheID]);
    },
    _removeElementObservers: function (elementObservers) {
        if (elementObservers) {
            for (var i = elementObservers.length - 1; i >= 0; i--) {
                var entry = elementObservers[i];
                var args = new Array(entry.element, entry.name, entry.observer, entry.useCapture);
                var removed = OpenLayers.Event.stopObserving.apply(this, args);
            }
        }
    },
    stopObserving: function (elementParam, name, observer, useCapture) {
        useCapture = useCapture || false;
        var element = OpenLayers.Util.getElement(elementParam);
        var cacheID = element._eventCacheID;
        if (name == 'keypress') {
            if (navigator.appVersion.match(/Konqueror|Safari|KHTML/) || element.detachEvent) {
                name = 'keydown';
            }
        }
        var foundEntry = false;
        var elementObservers = OpenLayers.Event.observers[cacheID];
        if (elementObservers) {
            var i = 0;
            while (!foundEntry && i < elementObservers.length) {
                var cacheEntry = elementObservers[i];
                if ((cacheEntry.name == name) && (cacheEntry.observer == observer) && (cacheEntry.useCapture == useCapture)) {
                    elementObservers.splice(i, 1);
                    if (elementObservers.length == 0) {
                        delete OpenLayers.Event.observers[cacheID];
                    }
                    foundEntry = true;
                    break;
                }
                i++;
            }
        }
        if (foundEntry) {
            if (element.removeEventListener) {
                element.removeEventListener(name, observer, useCapture);
            } else if (element && element.detachEvent) {
                element.detachEvent('on' + name, observer);
            }
        }
        return foundEntry;
    },
    unloadCache: function () {
        if (OpenLayers.Event && OpenLayers.Event.observers) {
            for (var cacheID in OpenLayers.Event.observers) {
                var elementObservers = OpenLayers.Event.observers[cacheID];
                OpenLayers.Event._removeElementObservers.apply(this, [elementObservers]);
            }
            OpenLayers.Event.observers = false;
        }
    },
    CLASS_NAME: "OpenLayers.Event"
};
OpenLayers.Event.observe(window, 'unload', OpenLayers.Event.unloadCache, false);
OpenLayers.Events = OpenLayers.Class({
    BROWSER_EVENTS: ["mouseover", "mouseout", "mousedown", "mouseup", "mousemove", "click", "dblclick", "rightclick", "dblrightclick", "resize", "focus", "blur", "touchstart", "touchmove", "touchend", "keydown"],
    listeners: null,
    object: null,
    element: null,
    eventHandler: null,
    fallThrough: null,
    includeXY: false,
    extensions: null,
    extensionCount: null,
    clearMouseListener: null,
    initialize: function (object, element, eventTypes, fallThrough, options) {
        OpenLayers.Util.extend(this, options);
        this.object = object;
        this.fallThrough = fallThrough;
        this.listeners = {};
        this.extensions = {};
        this.extensionCount = {};
        if (element != null) {
            this.attachToElement(element);
        }
    },
    destroy: function () {
        for (var e in this.extensions) {
            if (typeof this.extensions[e] !== "boolean") {
                this.extensions[e].destroy();
            }
        }
        this.extensions = null;
        if (this.element) {
            OpenLayers.Event.stopObservingElement(this.element);
            if (this.element.hasScrollEvent) {
                OpenLayers.Event.stopObserving(window, "scroll", this.clearMouseListener);
            }
        }
        this.element = null;
        this.listeners = null;
        this.object = null;
        this.fallThrough = null;
        this.eventHandler = null;
    },
    addEventType: function (eventName) {},
    attachToElement: function (element) {
        if (this.element) {
            OpenLayers.Event.stopObservingElement(this.element);
        } else {
            this.eventHandler = OpenLayers.Function.bindAsEventListener(this.handleBrowserEvent, this);
            this.clearMouseListener = OpenLayers.Function.bind(this.clearMouseCache, this);
        }
        this.element = element;
        for (var i = 0, len = this.BROWSER_EVENTS.length; i < len; i++) {
            OpenLayers.Event.observe(element, this.BROWSER_EVENTS[i], this.eventHandler);
        }
        OpenLayers.Event.observe(element, "dragstart", OpenLayers.Event.stop);
    },
    on: function (object) {
        for (var type in object) {
            if (type != "scope" && object.hasOwnProperty(type)) {
                this.register(type, object.scope, object[type]);
            }
        }
    },
    register: function (type, obj, func, priority) {
        if (type in OpenLayers.Events && !this.extensions[type]) {
            this.extensions[type] = new OpenLayers.Events[type](this);
        }
        if (func != null) {
            if (obj == null) {
                obj = this.object;
            }
            var listeners = this.listeners[type];
            if (!listeners) {
                listeners = [];
                this.listeners[type] = listeners;
                this.extensionCount[type] = 0;
            }
            var listener = {
                obj: obj,
                func: func
            };
            if (priority) {
                listeners.splice(this.extensionCount[type], 0, listener);
                if (typeof priority === "object" && priority.extension) {
                    this.extensionCount[type]++;
                }
            } else {
                listeners.push(listener);
            }
        }
    },
    registerPriority: function (type, obj, func) {
        this.register(type, obj, func, true);
    },
    un: function (object) {
        for (var type in object) {
            if (type != "scope" && object.hasOwnProperty(type)) {
                this.unregister(type, object.scope, object[type]);
            }
        }
    },
    unregister: function (type, obj, func) {
        if (obj == null) {
            obj = this.object;
        }
        var listeners = this.listeners[type];
        if (listeners != null) {
            for (var i = 0, len = listeners.length; i < len; i++) {
                if (listeners[i].obj == obj && listeners[i].func == func) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    },
    remove: function (type) {
        if (this.listeners[type] != null) {
            this.listeners[type] = [];
        }
    },
    triggerEvent: function (type, evt) {
        var listeners = this.listeners[type];
        if (!listeners || listeners.length == 0) {
            return undefined;
        }
        if (evt == null) {
            evt = {};
        }
        evt.object = this.object;
        evt.element = this.element;
        if (!evt.type) {
            evt.type = type;
        }
        listeners = listeners.slice();
        var continueChain;
        for (var i = 0, len = listeners.length; i < len; i++) {
            var callback = listeners[i];
            continueChain = callback.func.apply(callback.obj, [evt]);
            if ((continueChain != undefined) && (continueChain == false)) {
                break;
            }
        }
        if (!this.fallThrough) {
            OpenLayers.Event.stop(evt, true);
        }
        return continueChain;
    },
    handleBrowserEvent: function (evt) {
        var type = evt.type,
            listeners = this.listeners[type];
        if (!listeners || listeners.length == 0) {
            return;
        }
        var touches = evt.touches;
        if (touches && touches[0]) {
            var x = 0;
            var y = 0;
            var num = touches.length;
            var touch;
            for (var i = 0; i < num; ++i) {
                touch = touches[i];
                x += touch.clientX;
                y += touch.clientY;
            }
            evt.clientX = x / num;
            evt.clientY = y / num;
        }
        if (this.includeXY) {
            evt.xy = this.getMousePosition(evt);
        }
        this.triggerEvent(type, evt);
    },
    clearMouseCache: function () {
        this.element.scrolls = null;
        this.element.lefttop = null;
        var body = document.body;
        if (body && !((body.scrollTop != 0 || body.scrollLeft != 0) && navigator.userAgent.match(/iPhone/i))) {
            this.element.offsets = null;
        }
    },
    getMousePosition: function (evt) {
        if (!this.includeXY) {
            this.clearMouseCache();
        } else if (!this.element.hasScrollEvent) {
            OpenLayers.Event.observe(window, "scroll", this.clearMouseListener);
            this.element.hasScrollEvent = true;
        }
        if (!this.element.scrolls) {
            var viewportElement = OpenLayers.Util.getViewportElement();
            this.element.scrolls = [viewportElement.scrollLeft, viewportElement.scrollTop];
        }
        if (!this.element.lefttop) {
            this.element.lefttop = [(document.documentElement.clientLeft || 0), (document.documentElement.clientTop || 0)];
        }
        if (!this.element.offsets) {
            this.element.offsets = OpenLayers.Util.pagePosition(this.element);
        }
        return new OpenLayers.Pixel((evt.clientX + this.element.scrolls[0]) - this.element.offsets[0] - this.element.lefttop[0], (evt.clientY + this.element.scrolls[1]) - this.element.offsets[1] - this.element.lefttop[1]);
    },
    CLASS_NAME: "OpenLayers.Events"
});
OpenLayers.Events.buttonclick = OpenLayers.Class({
    target: null,
    events: ['mousedown', 'mouseup', 'click', 'dblclick', 'touchstart', 'touchmove', 'touchend', 'keydown'],
    startRegEx: /^mousedown|touchstart$/,
    cancelRegEx: /^touchmove$/,
    completeRegEx: /^mouseup|touchend$/,
    initialize: function (target) {
        this.target = target;
        for (var i = this.events.length - 1; i >= 0; --i) {
            this.target.register(this.events[i], this, this.buttonClick, {
                extension: true
            });
        }
    },
    destroy: function () {
        for (var i = this.events.length - 1; i >= 0; --i) {
            this.target.unregister(this.events[i], this, this.buttonClick);
        }
        delete this.target;
    },
    getPressedButton: function (element) {
        var depth = 3,
            button;
        do {
            if (OpenLayers.Element.hasClass(element, "olButton")) {
                button = element;
                break;
            }
            element = element.parentNode;
        } while (--depth > 0 && element);
        return button;
    },
    buttonClick: function (evt) {
        var propagate = true,
            element = OpenLayers.Event.element(evt);
        if (element && (OpenLayers.Event.isLeftClick(evt) || !~evt.type.indexOf("mouse"))) {
            var button = this.getPressedButton(element);
            if (button) {
                if (evt.type === "keydown") {
                    switch (evt.keyCode) {
                    case OpenLayers.Event.KEY_RETURN:
                    case OpenLayers.Event.KEY_SPACE:
                        this.target.triggerEvent("buttonclick", {
                            buttonElement: button
                        });
                        OpenLayers.Event.stop(evt);
                        propagate = false;
                        break;
                    }
                } else if (this.startEvt) {
                    if (this.completeRegEx.test(evt.type)) {
                        var pos = OpenLayers.Util.pagePosition(button);
                        this.target.triggerEvent("buttonclick", {
                            buttonElement: button,
                            buttonXY: {
                                x: this.startEvt.clientX - pos[0],
                                y: this.startEvt.clientY - pos[1]
                            }
                        });
                    }
                    if (this.cancelRegEx.test(evt.type)) {
                        delete this.startEvt;
                    }
                    OpenLayers.Event.stop(evt);
                    propagate = false;
                }
                if (this.startRegEx.test(evt.type)) {
                    this.startEvt = evt;
                    OpenLayers.Event.stop(evt);
                    propagate = false;
                }
            } else {
                delete this.startEvt;
            }
        }
        return propagate;
    }
});
OpenLayers.ProxyHost = "";
OpenLayers.Request = {
    DEFAULT_CONFIG: {
        method: "GET",
        url: window.location.href,
        async: true,
        user: undefined,
        password: undefined,
        params: null,
        proxy: OpenLayers.ProxyHost,
        headers: {},
        data: null,
        callback: function () {},
        success: null,
        failure: null,
        scope: null
    },
    URL_SPLIT_REGEX: /([^:]*:)\/\/([^:]*:?[^@]*@)?([^:\/\?]*):?([^\/\?]*)/,
    events: new OpenLayers.Events(this),
    makeSameOrigin: function (url, proxy) {
        var sameOrigin = url.indexOf("http") !== 0;
        var urlParts = !sameOrigin && url.match(this.URL_SPLIT_REGEX);
        if (urlParts) {
            var location = window.location;
            sameOrigin = urlParts[1] == location.protocol && urlParts[3] == location.hostname;
            var uPort = urlParts[4],
                lPort = location.port;
            if (uPort != 80 && uPort != "" || lPort != "80" && lPort != "") {
                sameOrigin = sameOrigin && uPort == lPort;
            }
        }
        if (!sameOrigin) {
            if (proxy) {
                if (typeof proxy == "function") {
                    url = proxy(url);
                } else {
                    url = proxy + encodeURIComponent(url);
                }
            } else {
                OpenLayers.Console.warn(OpenLayers.i18n("proxyNeeded"), {
                    url: url
                });
            }
        }
        return url;
    },
    issue: function (config) {
        var defaultConfig = OpenLayers.Util.extend(this.DEFAULT_CONFIG, {
            proxy: OpenLayers.ProxyHost
        });
        config = OpenLayers.Util.applyDefaults(config, defaultConfig);
        var customRequestedWithHeader = false,
            headerKey;
        for (headerKey in config.headers) {
            if (config.headers.hasOwnProperty(headerKey)) {
                if (headerKey.toLowerCase() === 'x-requested-with') {
                    customRequestedWithHeader = true;
                }
            }
        }
        if (customRequestedWithHeader === false) {
            config.headers['X-Requested-With'] = 'XMLHttpRequest';
        }
        var request = new OpenLayers.Request.XMLHttpRequest();
        var url = OpenLayers.Util.urlAppend(config.url, OpenLayers.Util.getParameterString(config.params || {}));
        url = OpenLayers.Request.makeSameOrigin(url, config.proxy);
        request.open(config.method, url, config.async, config.user, config.password);
        for (var header in config.headers) {
            request.setRequestHeader(header, config.headers[header]);
        }
        var events = this.events;
        var self = this;
        request.onreadystatechange = function () {
            if (request.readyState == OpenLayers.Request.XMLHttpRequest.DONE) {
                var proceed = events.triggerEvent("complete", {
                    request: request,
                    config: config,
                    requestUrl: url
                });
                if (proceed !== false) {
                    self.runCallbacks({
                        request: request,
                        config: config,
                        requestUrl: url
                    });
                }
            }
        };
        if (config.async === false) {
            request.send(config.data);
        } else {
            window.setTimeout(function () {
                if (request.readyState !== 0) {
                    request.send(config.data);
                }
            }, 0);
        }
        return request;
    },
    runCallbacks: function (options) {
        var request = options.request;
        var config = options.config;
        var complete = (config.scope) ? OpenLayers.Function.bind(config.callback, config.scope) : config.callback;
        var success;
        if (config.success) {
            success = (config.scope) ? OpenLayers.Function.bind(config.success, config.scope) : config.success;
        }
        var failure;
        if (config.failure) {
            failure = (config.scope) ? OpenLayers.Function.bind(config.failure, config.scope) : config.failure;
        }
        if (OpenLayers.Util.createUrlObject(config.url).protocol == "file:" && request.responseText) {
            request.status = 200;
        }
        complete(request);
        if (!request.status || (request.status >= 200 && request.status < 300)) {
            this.events.triggerEvent("success", options);
            if (success) {
                success(request);
            }
        }
        if (request.status && (request.status < 200 || request.status >= 300)) {
            this.events.triggerEvent("failure", options);
            if (failure) {
                failure(request);
            }
        }
    },
    GET: function (config) {
        config = OpenLayers.Util.extend(config, {
            method: "GET"
        });
        return OpenLayers.Request.issue(config);
    },
    POST: function (config) {
        config = OpenLayers.Util.extend(config, {
            method: "POST"
        });
        config.headers = config.headers ? config.headers : {};
        if (!("CONTENT-TYPE" in OpenLayers.Util.upperCaseObject(config.headers))) {
            config.headers["Content-Type"] = "application/xml";
        }
        return OpenLayers.Request.issue(config);
    },
    PUT: function (config) {
        config = OpenLayers.Util.extend(config, {
            method: "PUT"
        });
        config.headers = config.headers ? config.headers : {};
        if (!("CONTENT-TYPE" in OpenLayers.Util.upperCaseObject(config.headers))) {
            config.headers["Content-Type"] = "application/xml";
        }
        return OpenLayers.Request.issue(config);
    },
    DELETE: function (config) {
        config = OpenLayers.Util.extend(config, {
            method: "DELETE"
        });
        return OpenLayers.Request.issue(config);
    },
    HEAD: function (config) {
        config = OpenLayers.Util.extend(config, {
            method: "HEAD"
        });
        return OpenLayers.Request.issue(config);
    },
    OPTIONS: function (config) {
        config = OpenLayers.Util.extend(config, {
            method: "OPTIONS"
        });
        return OpenLayers.Request.issue(config);
    }
};
(function () {
    var oXMLHttpRequest = window.XMLHttpRequest;
    var bGecko = !! window.controllers,
        bIE = window.document.all && !window.opera,
        bIE7 = bIE && window.navigator.userAgent.match(/MSIE 7.0/);

    function fXMLHttpRequest() {
        this._object = oXMLHttpRequest && !bIE7 ? new oXMLHttpRequest : new window.ActiveXObject("Microsoft.XMLHTTP");
        this._listeners = [];
    };

    function cXMLHttpRequest() {
        return new fXMLHttpRequest;
    };
    cXMLHttpRequest.prototype = fXMLHttpRequest.prototype;
    if (bGecko && oXMLHttpRequest.wrapped)
        cXMLHttpRequest.wrapped = oXMLHttpRequest.wrapped;
    cXMLHttpRequest.UNSENT = 0;
    cXMLHttpRequest.OPENED = 1;
    cXMLHttpRequest.HEADERS_RECEIVED = 2;
    cXMLHttpRequest.LOADING = 3;
    cXMLHttpRequest.DONE = 4;
    cXMLHttpRequest.prototype.readyState = cXMLHttpRequest.UNSENT;
    cXMLHttpRequest.prototype.responseText = '';
    cXMLHttpRequest.prototype.responseXML = null;
    cXMLHttpRequest.prototype.status = 0;
    cXMLHttpRequest.prototype.statusText = '';
    cXMLHttpRequest.prototype.priority = "NORMAL";
    cXMLHttpRequest.prototype.onreadystatechange = null;
    cXMLHttpRequest.onreadystatechange = null;
    cXMLHttpRequest.onopen = null;
    cXMLHttpRequest.onsend = null;
    cXMLHttpRequest.onabort = null;
    cXMLHttpRequest.prototype.open = function (sMethod, sUrl, bAsync, sUser, sPassword) {
        delete this._headers;
        if (arguments.length < 3)
            bAsync = true;
        this._async = bAsync;
        var oRequest = this,
            nState = this.readyState,
            fOnUnload;
        if (bIE && bAsync) {
            fOnUnload = function () {
                if (nState != cXMLHttpRequest.DONE) {
                    fCleanTransport(oRequest);
                    oRequest.abort();
                }
            };
            window.attachEvent("onunload", fOnUnload);
        }
        if (cXMLHttpRequest.onopen)
            cXMLHttpRequest.onopen.apply(this, arguments);
        if (arguments.length > 4)
            this._object.open(sMethod, sUrl, bAsync, sUser, sPassword);
        else
        if (arguments.length > 3)
            this._object.open(sMethod, sUrl, bAsync, sUser);
        else
            this._object.open(sMethod, sUrl, bAsync);
        this.readyState = cXMLHttpRequest.OPENED;
        fReadyStateChange(this);
        this._object.onreadystatechange = function () {
            if (bGecko && !bAsync)
                return;
            oRequest.readyState = oRequest._object.readyState;
            fSynchronizeValues(oRequest);
            if (oRequest._aborted) {
                oRequest.readyState = cXMLHttpRequest.UNSENT;
                return;
            }
            if (oRequest.readyState == cXMLHttpRequest.DONE) {
                delete oRequest._data;
                fCleanTransport(oRequest);
                if (bIE && bAsync)
                    window.detachEvent("onunload", fOnUnload);
            }
            if (nState != oRequest.readyState)
                fReadyStateChange(oRequest);
            nState = oRequest.readyState;
        }
    };

    function fXMLHttpRequest_send(oRequest) {
        oRequest._object.send(oRequest._data);
        if (bGecko && !oRequest._async) {
            oRequest.readyState = cXMLHttpRequest.OPENED;
            fSynchronizeValues(oRequest);
            while (oRequest.readyState < cXMLHttpRequest.DONE) {
                oRequest.readyState++;
                fReadyStateChange(oRequest);
                if (oRequest._aborted)
                    return;
            }
        }
    };
    cXMLHttpRequest.prototype.send = function (vData) {
        if (cXMLHttpRequest.onsend)
            cXMLHttpRequest.onsend.apply(this, arguments);
        if (!arguments.length)
            vData = null;
        if (vData && vData.nodeType) {
            vData = window.XMLSerializer ? new window.XMLSerializer().serializeToString(vData) : vData.xml;
            if (!this._headers["Content-Type"])
                this._object.setRequestHeader("Content-Type", "application/xml");
        }
        this._data = vData;
        fXMLHttpRequest_send(this);
    };
    cXMLHttpRequest.prototype.abort = function () {
        if (cXMLHttpRequest.onabort)
            cXMLHttpRequest.onabort.apply(this, arguments);
        if (this.readyState > cXMLHttpRequest.UNSENT)
            this._aborted = true;
        this._object.abort();
        fCleanTransport(this);
        this.readyState = cXMLHttpRequest.UNSENT;
        delete this._data;
    };
    cXMLHttpRequest.prototype.getAllResponseHeaders = function () {
        return this._object.getAllResponseHeaders();
    };
    cXMLHttpRequest.prototype.getResponseHeader = function (sName) {
        return this._object.getResponseHeader(sName);
    };
    cXMLHttpRequest.prototype.setRequestHeader = function (sName, sValue) {
        if (!this._headers)
            this._headers = {};
        this._headers[sName] = sValue;
        return this._object.setRequestHeader(sName, sValue);
    };
    cXMLHttpRequest.prototype.addEventListener = function (sName, fHandler, bUseCapture) {
        for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
            if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture)
                return;
        this._listeners.push([sName, fHandler, bUseCapture]);
    };
    cXMLHttpRequest.prototype.removeEventListener = function (sName, fHandler, bUseCapture) {
        for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
            if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture)
                break;
        if (oListener)
            this._listeners.splice(nIndex, 1);
    };
    cXMLHttpRequest.prototype.dispatchEvent = function (oEvent) {
        var oEventPseudo = {
            'type': oEvent.type,
            'target': this,
            'currentTarget': this,
            'eventPhase': 2,
            'bubbles': oEvent.bubbles,
            'cancelable': oEvent.cancelable,
            'timeStamp': oEvent.timeStamp,
            'stopPropagation': function () {},
            'preventDefault': function () {},
            'initEvent': function () {}
        };
        if (oEventPseudo.type == "readystatechange" && this.onreadystatechange)
            (this.onreadystatechange.handleEvent || this.onreadystatechange).apply(this, [oEventPseudo]);
        for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
            if (oListener[0] == oEventPseudo.type && !oListener[2])
                (oListener[1].handleEvent || oListener[1]).apply(this, [oEventPseudo]);
    };
    cXMLHttpRequest.prototype.toString = function () {
        return '[' + "object" + ' ' + "XMLHttpRequest" + ']';
    };
    cXMLHttpRequest.toString = function () {
        return '[' + "XMLHttpRequest" + ']';
    };

    function fReadyStateChange(oRequest) {
        if (cXMLHttpRequest.onreadystatechange)
            cXMLHttpRequest.onreadystatechange.apply(oRequest);
        oRequest.dispatchEvent({
            'type': "readystatechange",
            'bubbles': false,
            'cancelable': false,
            'timeStamp': new Date + 0
        });
    };

    function fGetDocument(oRequest) {
        var oDocument = oRequest.responseXML,
            sResponse = oRequest.responseText;
        if (bIE && sResponse && oDocument && !oDocument.documentElement && oRequest.getResponseHeader("Content-Type").match(/[^\/]+\/[^\+]+\+xml/)) {
            oDocument = new window.ActiveXObject("Microsoft.XMLDOM");
            oDocument.async = false;
            oDocument.validateOnParse = false;
            oDocument.loadXML(sResponse);
        }
        if (oDocument)
            if ((bIE && oDocument.parseError != 0) || !oDocument.documentElement || (oDocument.documentElement && oDocument.documentElement.tagName == "parsererror"))
                return null;
        return oDocument;
    };

    function fSynchronizeValues(oRequest) {
        try {
            oRequest.responseText = oRequest._object.responseText;
        } catch (e) {}
        try {
            oRequest.responseXML = fGetDocument(oRequest._object);
        } catch (e) {}
        try {
            oRequest.status = oRequest._object.status;
        } catch (e) {}
        try {
            oRequest.statusText = oRequest._object.statusText;
        } catch (e) {}
    };

    function fCleanTransport(oRequest) {
        oRequest._object.onreadystatechange = new window.Function;
    };
    if (!window.Function.prototype.apply) {
        window.Function.prototype.apply = function (oRequest, oArguments) {
            if (!oArguments)
                oArguments = [];
            oRequest.__func = this;
            oRequest.__func(oArguments[0], oArguments[1], oArguments[2], oArguments[3], oArguments[4]);
            delete oRequest.__func;
        };
    };
    OpenLayers.Request.XMLHttpRequest = cXMLHttpRequest;
})();
OpenLayers.Projection = OpenLayers.Class({
    proj: null,
    projCode: null,
    titleRegEx: /\+title=[^\+]*/,
    initialize: function (projCode, options) {
        OpenLayers.Util.extend(this, options);
        this.projCode = projCode;
        if (window.Proj4js) {
            this.proj = new Proj4js.Proj(projCode);
        }
    },
    getCode: function () {
        return this.proj ? this.proj.srsCode : this.projCode;
    },
    getUnits: function () {
        return this.proj ? this.proj.units : null;
    },
    toString: function () {
        return this.getCode();
    },
    equals: function (projection) {
        var p = projection,
            equals = false;
        if (p) {
            if (!(p instanceof OpenLayers.Projection)) {
                p = new OpenLayers.Projection(p);
            }
            if (window.Proj4js && this.proj.defData && p.proj.defData) {
                equals = this.proj.defData.replace(this.titleRegEx, "") == p.proj.defData.replace(this.titleRegEx, "");
            } else if (p.getCode) {
                var source = this.getCode(),
                    target = p.getCode();
                equals = source == target || !! OpenLayers.Projection.transforms[source] && OpenLayers.Projection.transforms[source][target] === OpenLayers.Projection.nullTransform;
            }
        }
        return equals;
    },
    destroy: function () {
        delete this.proj;
        delete this.projCode;
    },
    CLASS_NAME: "OpenLayers.Projection"
});
OpenLayers.Projection.transforms = {};
OpenLayers.Projection.defaults = {
    "EPSG:4326": {
        units: "degrees",
        maxExtent: [-180, -90, 180, 90],
        yx: true
    },
    "CRS:84": {
        units: "degrees",
        maxExtent: [-180, -90, 180, 90]
    },
    "EPSG:900913": {
        units: "m",
        maxExtent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34]
    }
};
OpenLayers.Projection.addTransform = function (from, to, method) {
    if (method === OpenLayers.Projection.nullTransform) {
        var defaults = OpenLayers.Projection.defaults[from];
        if (defaults && !OpenLayers.Projection.defaults[to]) {
            OpenLayers.Projection.defaults[to] = defaults;
        }
    }
    if (!OpenLayers.Projection.transforms[from]) {
        OpenLayers.Projection.transforms[from] = {};
    }
    OpenLayers.Projection.transforms[from][to] = method;
};
OpenLayers.Projection.transform = function (point, source, dest) {
    if (source && dest) {
        if (!(source instanceof OpenLayers.Projection)) {
            source = new OpenLayers.Projection(source);
        }
        if (!(dest instanceof OpenLayers.Projection)) {
            dest = new OpenLayers.Projection(dest);
        }
        if (source.proj && dest.proj) {
            point = Proj4js.transform(source.proj, dest.proj, point);
        } else {
            var sourceCode = source.getCode();
            var destCode = dest.getCode();
            var transforms = OpenLayers.Projection.transforms;
            if (transforms[sourceCode] && transforms[sourceCode][destCode]) {
                transforms[sourceCode][destCode](point);
            }
        }
    }
    return point;
};
OpenLayers.Projection.nullTransform = function (point) {
    return point;
};
(function () {
    var pole = 20037508.34;

    function inverseMercator(xy) {
        xy.x = 180 * xy.x / pole;
        xy.y = 180 / Math.PI * (2 * Math.atan(Math.exp((xy.y / pole) * Math.PI)) - Math.PI / 2);
        return xy;
    }

    function forwardMercator(xy) {
        xy.x = xy.x * pole / 180;
        xy.y = Math.log(Math.tan((90 + xy.y) * Math.PI / 360)) / Math.PI * pole;
        return xy;
    }

    function map(base, codes) {
        var add = OpenLayers.Projection.addTransform;
        var same = OpenLayers.Projection.nullTransform;
        var i, len, code, other, j;
        for (i = 0, len = codes.length; i < len; ++i) {
            code = codes[i];
            add(base, code, forwardMercator);
            add(code, base, inverseMercator);
            for (j = i + 1; j < len; ++j) {
                other = codes[j];
                add(code, other, same);
                add(other, code, same);
            }
        }
    }
    var mercator = ["EPSG:900913", "EPSG:3857", "EPSG:102113", "EPSG:102100"],
        geographic = ["CRS:84", "urn:ogc:def:crs:EPSG:6.6:4326", "EPSG:4326"],
        i;
    for (i = mercator.length - 1; i >= 0; --i) {
        map(mercator[i], geographic);
    }
    for (i = geographic.length - 1; i >= 0; --i) {
        map(geographic[i], mercator);
    }
})();
OpenLayers.Map = OpenLayers.Class({
    Z_INDEX_BASE: {
        BaseLayer: 100,
        Overlay: 325,
        Feature: 725,
        Popup: 750,
        Control: 1000
    },
    id: null,
    fractionalZoom: false,
    events: null,
    allOverlays: false,
    div: null,
    dragging: false,
    size: null,
    viewPortDiv: null,
    layerContainerOrigin: null,
    layerContainerDiv: null,
    layers: null,
    controls: null,
    popups: null,
    baseLayer: null,
    center: null,
    resolution: null,
    zoom: 0,
    panRatio: 1.5,
    options: null,
    tileSize: null,
    projection: "EPSG:4326",
    units: null,
    resolutions: null,
    maxResolution: null,
    minResolution: null,
    maxScale: null,
    minScale: null,
    maxExtent: null,
    minExtent: null,
    restrictedExtent: null,
    numZoomLevels: 16,
    theme: null,
    displayProjection: null,
    fallThrough: true,
    panTween: null,
    eventListeners: null,
    panMethod: OpenLayers.Easing.Expo.easeOut,
    panDuration: 50,
    paddingForPopups: null,
    minPx: null,
    maxPx: null,
    initialize: function (div, options) {
        if (arguments.length === 1 && typeof div === "object") {
            options = div;
            div = options && options.div;
        }
        this.tileSize = new OpenLayers.Size(OpenLayers.Map.TILE_WIDTH, OpenLayers.Map.TILE_HEIGHT);
        this.paddingForPopups = new OpenLayers.Bounds(15, 15, 15, 15);
        this.theme = OpenLayers._getScriptLocation() + 'js/OpenLayers/theme/default/style.css';
        this.options = OpenLayers.Util.extend({}, options);
        OpenLayers.Util.extend(this, options);
        var projCode = this.projection instanceof OpenLayers.Projection ? this.projection.projCode : this.projection;
        OpenLayers.Util.applyDefaults(this, OpenLayers.Projection.defaults[projCode]);
        if (this.maxExtent && !(this.maxExtent instanceof OpenLayers.Bounds)) {
            this.maxExtent = new OpenLayers.Bounds(this.maxExtent);
        }
        if (this.minExtent && !(this.minExtent instanceof OpenLayers.Bounds)) {
            this.minExtent = new OpenLayers.Bounds(this.minExtent);
        }
        if (this.restrictedExtent && !(this.restrictedExtent instanceof OpenLayers.Bounds)) {
            this.restrictedExtent = new OpenLayers.Bounds(this.restrictedExtent);
        }
        if (this.center && !(this.center instanceof OpenLayers.LonLat)) {
            this.center = new OpenLayers.LonLat(this.center);
        }
        this.layers = [];
        this.id = OpenLayers.Util.createUniqueID("OpenLayers.Map_");
        this.div = OpenLayers.Util.getElement(div);
        if (!this.div) {
            this.div = document.createElement("div");
            this.div.style.height = "1px";
            this.div.style.width = "1px";
        }
        OpenLayers.Element.addClass(this.div, 'olMap');
        var id = this.id + "_OpenLayers_ViewPort";
        this.viewPortDiv = OpenLayers.Util.createDiv(id, null, null, null, "relative", null, "hidden");
        this.viewPortDiv.style.width = "100%";
        this.viewPortDiv.style.height = "100%";
        this.viewPortDiv.className = "olMapViewport";
        this.div.appendChild(this.viewPortDiv);
        this.events = new OpenLayers.Events(this, this.viewPortDiv, null, this.fallThrough, {
            includeXY: true
        });
        id = this.id + "_OpenLayers_Container";
        this.layerContainerDiv = OpenLayers.Util.createDiv(id);
        this.layerContainerDiv.style.width = '100px';
        this.layerContainerDiv.style.height = '100px';
        this.layerContainerDiv.style.zIndex = this.Z_INDEX_BASE['Popup'] - 1;
        this.viewPortDiv.appendChild(this.layerContainerDiv);
        this.updateSize();
        if (this.eventListeners instanceof Object) {
            this.events.on(this.eventListeners);
        }
        if (parseFloat(navigator.appVersion.split("MSIE")[1]) < 9) {
            this.events.register("resize", this, this.updateSize);
        } else {
            this.updateSizeDestroy = OpenLayers.Function.bind(this.updateSize, this);
            OpenLayers.Event.observe(window, 'resize', this.updateSizeDestroy);
        }
        if (this.theme) {
            var addNode = true;
            var nodes = document.getElementsByTagName('link');
            for (var i = 0, len = nodes.length; i < len; ++i) {
                if (OpenLayers.Util.isEquivalentUrl(nodes.item(i).href, this.theme)) {
                    addNode = false;
                    break;
                }
            }
            if (addNode) {
                var cssNode = document.createElement('link');
                cssNode.setAttribute('rel', 'stylesheet');
                cssNode.setAttribute('type', 'text/css');
                cssNode.setAttribute('href', this.theme);
                document.getElementsByTagName('head')[0].appendChild(cssNode);
            }
        }
        if (this.controls == null) {
            this.controls = [];
            if (OpenLayers.Control != null) {
                if (OpenLayers.Control.Navigation) {
                    this.controls.push(new OpenLayers.Control.Navigation());
                } else if (OpenLayers.Control.TouchNavigation) {
                    this.controls.push(new OpenLayers.Control.TouchNavigation());
                }
                if (OpenLayers.Control.Zoom) {
                    this.controls.push(new OpenLayers.Control.Zoom());
                } else if (OpenLayers.Control.PanZoom) {
                    this.controls.push(new OpenLayers.Control.PanZoom());
                }
                if (OpenLayers.Control.ArgParser) {
                    this.controls.push(new OpenLayers.Control.ArgParser());
                }
                if (OpenLayers.Control.Attribution) {
                    this.controls.push(new OpenLayers.Control.Attribution());
                }
            }
        }
        for (var i = 0, len = this.controls.length; i < len; i++) {
            this.addControlToMap(this.controls[i]);
        }
        this.popups = [];
        this.unloadDestroy = OpenLayers.Function.bind(this.destroy, this);
        OpenLayers.Event.observe(window, 'unload', this.unloadDestroy);
        if (options && options.layers) {
            delete this.center;
            this.addLayers(options.layers);
            if (options.center && !this.getCenter()) {
                this.setCenter(options.center, options.zoom);
            }
        }
    },
    getViewport: function () {
        return this.viewPortDiv;
    },
    render: function (div) {
        this.div = OpenLayers.Util.getElement(div);
        OpenLayers.Element.addClass(this.div, 'olMap');
        this.viewPortDiv.parentNode.removeChild(this.viewPortDiv);
        this.div.appendChild(this.viewPortDiv);
        this.updateSize();
    },
    unloadDestroy: null,
    updateSizeDestroy: null,
    destroy: function () {
        if (!this.unloadDestroy) {
            return false;
        }
        if (this.panTween) {
            this.panTween.stop();
            this.panTween = null;
        }
        OpenLayers.Event.stopObserving(window, 'unload', this.unloadDestroy);
        this.unloadDestroy = null;
        if (this.updateSizeDestroy) {
            OpenLayers.Event.stopObserving(window, 'resize', this.updateSizeDestroy);
        } else {
            this.events.unregister("resize", this, this.updateSize);
        }
        this.paddingForPopups = null;
        if (this.controls != null) {
            for (var i = this.controls.length - 1; i >= 0; --i) {
                this.controls[i].destroy();
            }
            this.controls = null;
        }
        if (this.layers != null) {
            for (var i = this.layers.length - 1; i >= 0; --i) {
                this.layers[i].destroy(false);
            }
            this.layers = null;
        }
        if (this.viewPortDiv) {
            this.div.removeChild(this.viewPortDiv);
        }
        this.viewPortDiv = null;
        if (this.eventListeners) {
            this.events.un(this.eventListeners);
            this.eventListeners = null;
        }
        this.events.destroy();
        this.events = null;
        this.options = null;
    },
    setOptions: function (options) {
        var updatePxExtent = this.minPx && options.restrictedExtent != this.restrictedExtent;
        OpenLayers.Util.extend(this, options);
        updatePxExtent && this.moveTo(this.getCachedCenter(), this.zoom, {
            forceZoomChange: true
        });
    },
    getTileSize: function () {
        return this.tileSize;
    },
    getBy: function (array, property, match) {
        var test = (typeof match.test == "function");
        var found = OpenLayers.Array.filter(this[array], function (item) {
            return item[property] == match || (test && match.test(item[property]));
        });
        return found;
    },
    getLayersBy: function (property, match) {
        return this.getBy("layers", property, match);
    },
    getLayersByName: function (match) {
        return this.getLayersBy("name", match);
    },
    getLayersByClass: function (match) {
        return this.getLayersBy("CLASS_NAME", match);
    },
    getControlsBy: function (property, match) {
        return this.getBy("controls", property, match);
    },
    getControlsByClass: function (match) {
        return this.getControlsBy("CLASS_NAME", match);
    },
    getLayer: function (id) {
        var foundLayer = null;
        for (var i = 0, len = this.layers.length; i < len; i++) {
            var layer = this.layers[i];
            if (layer.id == id) {
                foundLayer = layer;
                break;
            }
        }
        return foundLayer;
    },
    setLayerZIndex: function (layer, zIdx) {
        layer.setZIndex(this.Z_INDEX_BASE[layer.isBaseLayer ? 'BaseLayer' : 'Overlay'] + zIdx * 5);
    },
    resetLayersZIndex: function () {
        for (var i = 0, len = this.layers.length; i < len; i++) {
            var layer = this.layers[i];
            this.setLayerZIndex(layer, i);
        }
    },
    addLayer: function (layer) {
        for (var i = 0, len = this.layers.length; i < len; i++) {
            if (this.layers[i] == layer) {
                return false;
            }
        }
        if (this.events.triggerEvent("preaddlayer", {
            layer: layer
        }) === false) {
            return false;
        }
        if (this.allOverlays) {
            layer.isBaseLayer = false;
        }
        layer.div.className = "olLayerDiv";
        layer.div.style.overflow = "";
        this.setLayerZIndex(layer, this.layers.length);
        if (layer.isFixed) {
            this.viewPortDiv.appendChild(layer.div);
        } else {
            this.layerContainerDiv.appendChild(layer.div);
        }
        this.layers.push(layer);
        layer.setMap(this);
        if (layer.isBaseLayer || (this.allOverlays && !this.baseLayer)) {
            if (this.baseLayer == null) {
                this.setBaseLayer(layer);
            } else {
                layer.setVisibility(false);
            }
        } else {
            layer.redraw();
        }
        this.events.triggerEvent("addlayer", {
            layer: layer
        });
        layer.events.triggerEvent("added", {
            map: this,
            layer: layer
        });
        layer.afterAdd();
        return true;
    },
    addLayers: function (layers) {
        for (var i = 0, len = layers.length; i < len; i++) {
            this.addLayer(layers[i]);
        }
    },
    removeLayer: function (layer, setNewBaseLayer) {
        if (this.events.triggerEvent("preremovelayer", {
            layer: layer
        }) === false) {
            return;
        }
        if (setNewBaseLayer == null) {
            setNewBaseLayer = true;
        }
        if (layer.isFixed) {
            this.viewPortDiv.removeChild(layer.div);
        } else {
            this.layerContainerDiv.removeChild(layer.div);
        }
        OpenLayers.Util.removeItem(this.layers, layer);
        layer.removeMap(this);
        layer.map = null;
        if (this.baseLayer == layer) {
            this.baseLayer = null;
            if (setNewBaseLayer) {
                for (var i = 0, len = this.layers.length; i < len; i++) {
                    var iLayer = this.layers[i];
                    if (iLayer.isBaseLayer || this.allOverlays) {
                        this.setBaseLayer(iLayer);
                        break;
                    }
                }
            }
        }
        this.resetLayersZIndex();
        this.events.triggerEvent("removelayer", {
            layer: layer
        });
        layer.events.triggerEvent("removed", {
            map: this,
            layer: layer
        });
    },
    getNumLayers: function () {
        return this.layers.length;
    },
    getLayerIndex: function (layer) {
        return OpenLayers.Util.indexOf(this.layers, layer);
    },
    setLayerIndex: function (layer, idx) {
        var base = this.getLayerIndex(layer);
        if (idx < 0) {
            idx = 0;
        } else if (idx > this.layers.length) {
            idx = this.layers.length;
        }
        if (base != idx) {
            this.layers.splice(base, 1);
            this.layers.splice(idx, 0, layer);
            for (var i = 0, len = this.layers.length; i < len; i++) {
                this.setLayerZIndex(this.layers[i], i);
            }
            this.events.triggerEvent("changelayer", {
                layer: layer,
                property: "order"
            });
            if (this.allOverlays) {
                if (idx === 0) {
                    this.setBaseLayer(layer);
                } else if (this.baseLayer !== this.layers[0]) {
                    this.setBaseLayer(this.layers[0]);
                }
            }
        }
    },
    raiseLayer: function (layer, delta) {
        var idx = this.getLayerIndex(layer) + delta;
        this.setLayerIndex(layer, idx);
    },
    setBaseLayer: function (newBaseLayer) {
        if (newBaseLayer != this.baseLayer) {
            if (OpenLayers.Util.indexOf(this.layers, newBaseLayer) != -1) {
                var center = this.getCachedCenter();
                var newResolution = OpenLayers.Util.getResolutionFromScale(this.getScale(), newBaseLayer.units);
                if (this.baseLayer != null && !this.allOverlays) {
                    this.baseLayer.setVisibility(false);
                }
                var previeousProjection = this.getProjection();
                this.baseLayer = newBaseLayer;
                this.resolutions = this.baseLayer.resolutions;
                if (!this.allOverlays || this.baseLayer.visibility) {
                    this.baseLayer.setVisibility(true);
                    if (this.baseLayer.inRange === false) {
                        this.baseLayer.redraw();
                    }
                }
                if (center != null) {
                    var p = new OpenLayers.Projection(previeousProjection);
                    var n = new OpenLayers.Projection(this.getProjection());
                    if (previeousProjection && previeousProjection != this.getProjection())
                        center.transform(p, n);
                    for (l in this.layers)
                        for (f in this.layers[l].features)
                            if (this.layers[l].features[f].geometry)
                                this.layers[l].features[f].geometry.transform(p, n);
                    var newZoom = this.getZoomForResolution(newResolution || this.resolution, true);
                    this.setCenter(center, newZoom, false, true);
                }
                this.events.triggerEvent("changebaselayer", {
                    layer: this.baseLayer
                });
            }
        }
    },
    addControl: function (control, px) {
        this.controls.push(control);
        this.addControlToMap(control, px);
    },
    addControls: function (controls, pixels) {
        var pxs = (arguments.length === 1) ? [] : pixels;
        for (var i = 0, len = controls.length; i < len; i++) {
            var ctrl = controls[i];
            var px = (pxs[i]) ? pxs[i] : null;
            this.addControl(ctrl, px);
        }
    },
    addControlToMap: function (control, px) {
        control.outsideViewport = (control.div != null);
        if (this.displayProjection && !control.displayProjection) {
            control.displayProjection = this.displayProjection;
        }
        control.setMap(this);
        var div = control.draw(px);
        if (div) {
            if (!control.outsideViewport) {
                div.style.zIndex = this.Z_INDEX_BASE['Control'] +
                    this.controls.length;
                this.viewPortDiv.appendChild(div);
            }
        }
        if (control.autoActivate) {
            control.activate();
        }
    },
    getControl: function (id) {
        var returnControl = null;
        for (var i = 0, len = this.controls.length; i < len; i++) {
            var control = this.controls[i];
            if (control.id == id) {
                returnControl = control;
                break;
            }
        }
        return returnControl;
    },
    removeControl: function (control) {
        if ((control) && (control == this.getControl(control.id))) {
            if (control.div && (control.div.parentNode == this.viewPortDiv)) {
                this.viewPortDiv.removeChild(control.div);
            }
            OpenLayers.Util.removeItem(this.controls, control);
        }
    },
    addPopup: function (popup, exclusive) {
        if (exclusive) {
            for (var i = this.popups.length - 1; i >= 0; --i) {
                this.removePopup(this.popups[i]);
            }
        }
        popup.map = this;
        this.popups.push(popup);
        var popupDiv = popup.draw();
        if (popupDiv) {
            popupDiv.style.zIndex = this.Z_INDEX_BASE['Popup'] +
                this.popups.length;
            this.layerContainerDiv.appendChild(popupDiv);
        }
    },
    removePopup: function (popup) {
        OpenLayers.Util.removeItem(this.popups, popup);
        if (popup.div) {
            try {
                this.layerContainerDiv.removeChild(popup.div);
            } catch (e) {}
        }
        popup.map = null;
    },
    getSize: function () {
        var size = null;
        if (this.size != null) {
            size = this.size.clone();
        }
        return size;
    },
    updateSize: function () {
        var newSize = this.getCurrentSize();
        if (newSize && !isNaN(newSize.h) && !isNaN(newSize.w)) {
            this.events.clearMouseCache();
            var oldSize = this.getSize();
            if (oldSize == null) {
                this.size = oldSize = newSize;
            }
            if (!newSize.equals(oldSize)) {
                this.size = newSize;
                for (var i = 0, len = this.layers.length; i < len; i++) {
                    this.layers[i].onMapResize();
                }
                var center = this.getCachedCenter();
                if (this.baseLayer != null && center != null) {
                    var zoom = this.getZoom();
                    this.zoom = null;
                    this.setCenter(center, zoom);
                }
            }
        }
    },
    getCurrentSize: function () {
        var size = new OpenLayers.Size(this.div.clientWidth, this.div.clientHeight);
        if (size.w == 0 && size.h == 0 || isNaN(size.w) && isNaN(size.h)) {
            size.w = this.div.offsetWidth;
            size.h = this.div.offsetHeight;
        }
        if (size.w == 0 && size.h == 0 || isNaN(size.w) && isNaN(size.h)) {
            size.w = parseInt(this.div.style.width);
            size.h = parseInt(this.div.style.height);
        }
        return size;
    },
    calculateBounds: function (center, resolution) {
        var extent = null;
        if (center == null) {
            center = this.getCachedCenter();
        }
        if (resolution == null) {
            resolution = this.getResolution();
        }
        if ((center != null) && (resolution != null)) {
            var halfWDeg = (this.size.w * resolution) / 2;
            var halfHDeg = (this.size.h * resolution) / 2;
            extent = new OpenLayers.Bounds(center.lon - halfWDeg, center.lat - halfHDeg, center.lon + halfWDeg, center.lat + halfHDeg);
        }
        return extent;
    },
    getCenter: function () {
        var center = null;
        var cachedCenter = this.getCachedCenter();
        if (cachedCenter) {
            center = cachedCenter.clone();
        }
        return center;
    },
    getCachedCenter: function () {
        if (!this.center && this.size) {
            this.center = this.getLonLatFromViewPortPx({
                x: this.size.w / 2,
                y: this.size.h / 2
            });
        }
        return this.center;
    },
    getZoom: function () {
        return this.zoom;
    },
    pan: function (dx, dy, options) {
        options = OpenLayers.Util.applyDefaults(options, {
            animate: true,
            dragging: false
        });
        if (options.dragging) {
            if (dx != 0 || dy != 0) {
                this.moveByPx(dx, dy);
            }
        } else {
            var centerPx = this.getViewPortPxFromLonLat(this.getCachedCenter());
            var newCenterPx = centerPx.add(dx, dy);
            if (this.dragging || !newCenterPx.equals(centerPx)) {
                var newCenterLonLat = this.getLonLatFromViewPortPx(newCenterPx);
                if (options.animate) {
                    this.panTo(newCenterLonLat);
                } else {
                    this.moveTo(newCenterLonLat);
                    if (this.dragging) {
                        this.dragging = false;
                        this.events.triggerEvent("moveend");
                    }
                }
            }
        }
    },
    panTo: function (lonlat) {
        if (this.panMethod && this.getExtent().scale(this.panRatio).containsLonLat(lonlat)) {
            if (!this.panTween) {
                this.panTween = new OpenLayers.Tween(this.panMethod);
            }
            var center = this.getCachedCenter();
            if (lonlat.equals(center)) {
                return;
            }
            var from = this.getPixelFromLonLat(center);
            var to = this.getPixelFromLonLat(lonlat);
            var vector = {
                x: to.x - from.x,
                y: to.y - from.y
            };
            var last = {
                x: 0,
                y: 0
            };
            this.panTween.start({
                x: 0,
                y: 0
            }, vector, this.panDuration, {
                callbacks: {
                    eachStep: OpenLayers.Function.bind(function (px) {
                        var x = px.x - last.x,
                            y = px.y - last.y;
                        this.moveByPx(x, y);
                        last.x = Math.round(px.x);
                        last.y = Math.round(px.y);
                    }, this),
                    done: OpenLayers.Function.bind(function (px) {
                        this.moveTo(lonlat);
                        this.dragging = false;
                        this.events.triggerEvent("moveend");
                    }, this)
                }
            });
        } else {
            this.setCenter(lonlat);
        }
    },
    setCenter: function (lonlat, zoom, dragging, forceZoomChange) {
        this.panTween && this.panTween.stop();
        this.moveTo(lonlat, zoom, {
            'dragging': dragging,
            'forceZoomChange': forceZoomChange
        });
    },
    moveByPx: function (dx, dy) {
        var hw = this.size.w / 2;
        var hh = this.size.h / 2;
        var x = hw + dx;
        var y = hh + dy;
        var wrapDateLine = this.baseLayer.wrapDateLine;
        var xRestriction = 0;
        var yRestriction = 0;
        if (this.restrictedExtent) {
            xRestriction = hw;
            yRestriction = hh;
            wrapDateLine = false;
        }
        dx = wrapDateLine || x <= this.maxPx.x - xRestriction && x >= this.minPx.x + xRestriction ? Math.round(dx) : 0;
        dy = y <= this.maxPx.y - yRestriction && y >= this.minPx.y + yRestriction ? Math.round(dy) : 0;
        if (dx || dy) {
            if (!this.dragging) {
                this.dragging = true;
                this.events.triggerEvent("movestart");
            }
            this.center = null;
            if (dx) {
                this.layerContainerDiv.style.left = parseInt(this.layerContainerDiv.style.left) - dx + "px";
                this.minPx.x -= dx;
                this.maxPx.x -= dx;
            }
            if (dy) {
                this.layerContainerDiv.style.top = parseInt(this.layerContainerDiv.style.top) - dy + "px";
                this.minPx.y -= dy;
                this.maxPx.y -= dy;
            }
            var layer, i, len;
            for (i = 0, len = this.layers.length; i < len; ++i) {
                layer = this.layers[i];
                if (layer.visibility && (layer === this.baseLayer || layer.inRange)) {
                    layer.moveByPx(dx, dy);
                    layer.events.triggerEvent("move");
                }
            }
            this.events.triggerEvent("move");
        }
    },
    adjustZoom: function (zoom) {
        var resolution, resolutions = this.baseLayer.resolutions,
            maxResolution = this.getMaxExtent().getWidth() / this.size.w;
        if (this.getResolutionForZoom(zoom) > maxResolution) {
            for (var i = zoom | 0, ii = resolutions.length; i < ii; ++i) {
                if (resolutions[i] <= maxResolution) {
                    zoom = i;
                    break;
                }
            }
        }
        return zoom;
    },
    moveTo: function (lonlat, zoom, options) {
        if (lonlat != null && !(lonlat instanceof OpenLayers.LonLat)) {
            lonlat = new OpenLayers.LonLat(lonlat);
        }
        if (!options) {
            options = {};
        }
        if (zoom != null) {
            zoom = parseFloat(zoom);
            if (!this.fractionalZoom) {
                zoom = Math.round(zoom);
            }
        }
        if (this.baseLayer.wrapDateLine) {
            var requestedZoom = zoom;
            zoom = this.adjustZoom(zoom);
            if (zoom !== requestedZoom) {
                lonlat = this.getCenter();
            }
        }
        var dragging = options.dragging || this.dragging;
        var forceZoomChange = options.forceZoomChange;
        if (!this.getCachedCenter() && !this.isValidLonLat(lonlat)) {
            lonlat = this.maxExtent.getCenterLonLat();
            this.center = lonlat.clone();
        }
        if (this.restrictedExtent != null) {
            if (lonlat == null) {
                lonlat = this.center;
            }
            if (zoom == null) {
                zoom = this.getZoom();
            }
            var resolution = this.getResolutionForZoom(zoom);
            var extent = this.calculateBounds(lonlat, resolution);
            if (!this.restrictedExtent.containsBounds(extent)) {
                var maxCenter = this.restrictedExtent.getCenterLonLat();
                if (extent.getWidth() > this.restrictedExtent.getWidth()) {
                    lonlat = new OpenLayers.LonLat(maxCenter.lon, lonlat.lat);
                } else if (extent.left < this.restrictedExtent.left) {
                    lonlat = lonlat.add(this.restrictedExtent.left -
                        extent.left, 0);
                } else if (extent.right > this.restrictedExtent.right) {
                    lonlat = lonlat.add(this.restrictedExtent.right -
                        extent.right, 0);
                }
                if (extent.getHeight() > this.restrictedExtent.getHeight()) {
                    lonlat = new OpenLayers.LonLat(lonlat.lon, maxCenter.lat);
                } else if (extent.bottom < this.restrictedExtent.bottom) {
                    lonlat = lonlat.add(0, this.restrictedExtent.bottom -
                        extent.bottom);
                } else if (extent.top > this.restrictedExtent.top) {
                    lonlat = lonlat.add(0, this.restrictedExtent.top -
                        extent.top);
                }
            }
        }
        var zoomChanged = forceZoomChange || ((this.isValidZoomLevel(zoom)) && (zoom != this.getZoom()));
        var centerChanged = (this.isValidLonLat(lonlat)) && (!lonlat.equals(this.center));
        if (zoomChanged || centerChanged || dragging) {
            dragging || this.events.triggerEvent("movestart");
            if (centerChanged) {
                if (!zoomChanged && this.center) {
                    this.centerLayerContainer(lonlat);
                }
                this.center = lonlat.clone();
            }
            var res = zoomChanged ? this.getResolutionForZoom(zoom) : this.getResolution();
            if (zoomChanged || this.layerContainerOrigin == null) {
                this.layerContainerOrigin = this.getCachedCenter();
                this.layerContainerDiv.style.left = "0px";
                this.layerContainerDiv.style.top = "0px";
                var maxExtent = this.getMaxExtent({
                    restricted: true
                });
                var maxExtentCenter = maxExtent.getCenterLonLat();
                var lonDelta = this.center.lon - maxExtentCenter.lon;
                var latDelta = maxExtentCenter.lat - this.center.lat;
                var extentWidth = Math.round(maxExtent.getWidth() / res);
                var extentHeight = Math.round(maxExtent.getHeight() / res);
                this.minPx = {
                    x: (this.size.w - extentWidth) / 2 - lonDelta / res,
                    y: (this.size.h - extentHeight) / 2 - latDelta / res
                };
                this.maxPx = {
                    x: this.minPx.x + Math.round(maxExtent.getWidth() / res),
                    y: this.minPx.y + Math.round(maxExtent.getHeight() / res)
                };
            }
            if (zoomChanged) {
                this.zoom = zoom;
                this.resolution = res;
            }
            var bounds = this.getExtent();
            if (this.baseLayer.visibility) {
                this.baseLayer.moveTo(bounds, zoomChanged, options.dragging);
                options.dragging || this.baseLayer.events.triggerEvent("moveend", {
                    zoomChanged: zoomChanged
                });
            }
            bounds = this.baseLayer.getExtent();
            for (var i = this.layers.length - 1; i >= 0; --i) {
                var layer = this.layers[i];
                if (layer !== this.baseLayer && !layer.isBaseLayer) {
                    var inRange = layer.calculateInRange();
                    if (layer.inRange != inRange) {
                        layer.inRange = inRange;
                        if (!inRange) {
                            layer.display(false);
                        }
                        this.events.triggerEvent("changelayer", {
                            layer: layer,
                            property: "visibility"
                        });
                    }
                    if (inRange && layer.visibility) {
                        layer.moveTo(bounds, zoomChanged, options.dragging);
                        options.dragging || layer.events.triggerEvent("moveend", {
                            zoomChanged: zoomChanged
                        });
                    }
                }
            }
            this.events.triggerEvent("move");
            dragging || this.events.triggerEvent("moveend");
            if (zoomChanged) {
                for (var i = 0, len = this.popups.length; i < len; i++) {
                    this.popups[i].updatePosition();
                }
                this.events.triggerEvent("zoomend");
            }
        }
    },
    centerLayerContainer: function (lonlat) {
        var originPx = this.getViewPortPxFromLonLat(this.layerContainerOrigin);
        var newPx = this.getViewPortPxFromLonLat(lonlat);
        if ((originPx != null) && (newPx != null)) {
            var oldLeft = parseInt(this.layerContainerDiv.style.left);
            var oldTop = parseInt(this.layerContainerDiv.style.top);
            var newLeft = Math.round(originPx.x - newPx.x);
            var newTop = Math.round(originPx.y - newPx.y);
            this.layerContainerDiv.style.left = newLeft + "px";
            this.layerContainerDiv.style.top = newTop + "px";
            var dx = oldLeft - newLeft;
            var dy = oldTop - newTop;
            this.minPx.x -= dx;
            this.maxPx.x -= dx;
            this.minPx.y -= dy;
            this.maxPx.y -= dy;
        }
    },
    isValidZoomLevel: function (zoomLevel) {
        return ((zoomLevel != null) && (zoomLevel >= 0) && (zoomLevel < this.getNumZoomLevels()));
    },
    isValidLonLat: function (lonlat) {
        var valid = false;
        if (lonlat != null) {
            var maxExtent = this.getMaxExtent();
            var worldBounds = this.baseLayer.wrapDateLine && maxExtent;
            valid = maxExtent.containsLonLat(lonlat, {
                worldBounds: worldBounds
            });
        }
        return valid;
    },
    getProjection: function () {
        var projection = this.getProjectionObject();
        return projection ? projection.getCode() : null;
    },
    getProjectionObject: function () {
        var projection = null;
        if (this.baseLayer != null) {
            projection = this.baseLayer.projection;
        }
        return projection;
    },
    getMaxResolution: function () {
        var maxResolution = null;
        if (this.baseLayer != null) {
            maxResolution = this.baseLayer.maxResolution;
        }
        return maxResolution;
    },
    getMaxExtent: function (options) {
        var maxExtent = null;
        if (options && options.restricted && this.restrictedExtent) {
            maxExtent = this.restrictedExtent;
        } else if (this.baseLayer != null) {
            maxExtent = this.baseLayer.maxExtent;
        }
        return maxExtent;
    },
    getNumZoomLevels: function () {
        var numZoomLevels = null;
        if (this.baseLayer != null) {
            numZoomLevels = this.baseLayer.numZoomLevels;
        }
        return numZoomLevels;
    },
    getExtent: function () {
        var extent = null;
        if (this.baseLayer != null) {
            extent = this.baseLayer.getExtent();
        }
        return extent;
    },
    getResolution: function () {
        var resolution = null;
        if (this.baseLayer != null) {
            resolution = this.baseLayer.getResolution();
        } else if (this.allOverlays === true && this.layers.length > 0) {
            resolution = this.layers[0].getResolution();
        }
        return resolution;
    },
    getUnits: function () {
        var units = null;
        if (this.baseLayer != null) {
            units = this.baseLayer.units;
        }
        return units;
    },
    getScale: function () {
        var scale = null;
        if (this.baseLayer != null) {
            var res = this.getResolution();
            var units = this.baseLayer.units;
            scale = OpenLayers.Util.getScaleFromResolution(res, units);
        }
        return scale;
    },
    getZoomForExtent: function (bounds, closest) {
        var zoom = null;
        if (this.baseLayer != null) {
            zoom = this.baseLayer.getZoomForExtent(bounds, closest);
        }
        return zoom;
    },
    getResolutionForZoom: function (zoom) {
        var resolution = null;
        if (this.baseLayer) {
            resolution = this.baseLayer.getResolutionForZoom(zoom);
        }
        return resolution;
    },
    getZoomForResolution: function (resolution, closest) {
        var zoom = null;
        if (this.baseLayer != null) {
            zoom = this.baseLayer.getZoomForResolution(resolution, closest);
        }
        return zoom;
    },
    zoomTo: function (zoom) {
        if (this.isValidZoomLevel(zoom)) {
            this.setCenter(null, zoom);
        }
    },
    zoomIn: function () {
        this.zoomTo(this.getZoom() + 1);
    },
    zoomOut: function () {
        this.zoomTo(this.getZoom() - 1);
    },
    zoomToExtent: function (bounds, closest) {
        if (!(bounds instanceof OpenLayers.Bounds)) {
            bounds = new OpenLayers.Bounds(bounds);
        }
        var center = bounds.getCenterLonLat();
        if (this.baseLayer.wrapDateLine) {
            var maxExtent = this.getMaxExtent();
            bounds = bounds.clone();
            while (bounds.right < bounds.left) {
                bounds.right += maxExtent.getWidth();
            }
            center = bounds.getCenterLonLat().wrapDateLine(maxExtent);
        }
        this.setCenter(center, this.getZoomForExtent(bounds, closest));
    },
    zoomToMaxExtent: function (options) {
        var restricted = (options) ? options.restricted : true;
        var maxExtent = this.getMaxExtent({
            'restricted': restricted
        });
        this.zoomToExtent(maxExtent);
    },
    zoomToScale: function (scale, closest) {
        var res = OpenLayers.Util.getResolutionFromScale(scale, this.baseLayer.units);
        var halfWDeg = (this.size.w * res) / 2;
        var halfHDeg = (this.size.h * res) / 2;
        var center = this.getCachedCenter();
        var extent = new OpenLayers.Bounds(center.lon - halfWDeg, center.lat - halfHDeg, center.lon + halfWDeg, center.lat + halfHDeg);
        this.zoomToExtent(extent, closest);
    },
    getLonLatFromViewPortPx: function (viewPortPx) {
        var lonlat = null;
        if (this.baseLayer != null) {
            lonlat = this.baseLayer.getLonLatFromViewPortPx(viewPortPx);
        }
        return lonlat;
    },
    getViewPortPxFromLonLat: function (lonlat) {
        var px = null;
        if (this.baseLayer != null) {
            px = this.baseLayer.getViewPortPxFromLonLat(lonlat);
        }
        return px;
    },
    getLonLatFromPixel: function (px) {
        return this.getLonLatFromViewPortPx(px);
    },
    getPixelFromLonLat: function (lonlat) {
        var px = this.getViewPortPxFromLonLat(lonlat);
        px.x = Math.round(px.x);
        px.y = Math.round(px.y);
        return px;
    },
    getGeodesicPixelSize: function (px) {
        var lonlat = px ? this.getLonLatFromPixel(px) : (this.getCachedCenter() || new OpenLayers.LonLat(0, 0));
        var res = this.getResolution();
        var left = lonlat.add(-res / 2, 0);
        var right = lonlat.add(res / 2, 0);
        var bottom = lonlat.add(0, -res / 2);
        var top = lonlat.add(0, res / 2);
        var dest = new OpenLayers.Projection("EPSG:4326");
        var source = this.getProjectionObject() || dest;
        if (!source.equals(dest)) {
            left.transform(source, dest);
            right.transform(source, dest);
            bottom.transform(source, dest);
            top.transform(source, dest);
        }
        return new OpenLayers.Size(OpenLayers.Util.distVincenty(left, right), OpenLayers.Util.distVincenty(bottom, top));
    },
    getViewPortPxFromLayerPx: function (layerPx) {
        var viewPortPx = null;
        if (layerPx != null) {
            var dX = parseInt(this.layerContainerDiv.style.left);
            var dY = parseInt(this.layerContainerDiv.style.top);
            viewPortPx = layerPx.add(dX, dY);
        }
        return viewPortPx;
    },
    getLayerPxFromViewPortPx: function (viewPortPx) {
        var layerPx = null;
        if (viewPortPx != null) {
            var dX = -parseInt(this.layerContainerDiv.style.left);
            var dY = -parseInt(this.layerContainerDiv.style.top);
            layerPx = viewPortPx.add(dX, dY);
            if (isNaN(layerPx.x) || isNaN(layerPx.y)) {
                layerPx = null;
            }
        }
        return layerPx;
    },
    getLonLatFromLayerPx: function (px) {
        px = this.getViewPortPxFromLayerPx(px);
        return this.getLonLatFromViewPortPx(px);
    },
    getLayerPxFromLonLat: function (lonlat) {
        var px = this.getPixelFromLonLat(lonlat);
        return this.getLayerPxFromViewPortPx(px);
    },
    CLASS_NAME: "OpenLayers.Map"
});
OpenLayers.Map.TILE_WIDTH = 256;
OpenLayers.Map.TILE_HEIGHT = 256;
OpenLayers.Layer = OpenLayers.Class({
    id: null,
    name: null,
    div: null,
    opacity: 1,
    alwaysInRange: null,
    RESOLUTION_PROPERTIES: ['scales', 'resolutions', 'maxScale', 'minScale', 'maxResolution', 'minResolution', 'numZoomLevels', 'maxZoomLevel'],
    events: null,
    map: null,
    isBaseLayer: false,
    alpha: false,
    displayInLayerSwitcher: true,
    visibility: true,
    attribution: null,
    inRange: false,
    imageSize: null,
    options: null,
    eventListeners: null,
    gutter: 0,
    projection: null,
    units: null,
    scales: null,
    resolutions: null,
    maxExtent: null,
    minExtent: null,
    maxResolution: null,
    minResolution: null,
    numZoomLevels: null,
    minScale: null,
    maxScale: null,
    displayOutsideMaxExtent: false,
    wrapDateLine: false,
    metadata: null,
    initialize: function (name, options) {
        this.metadata = {};
        this.addOptions(options);
        this.name = name;
        if (this.id == null) {
            this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
            this.div = OpenLayers.Util.createDiv(this.id);
            this.div.style.width = "100%";
            this.div.style.height = "100%";
            this.div.dir = "ltr";
            this.events = new OpenLayers.Events(this, this.div);
            if (this.eventListeners instanceof Object) {
                this.events.on(this.eventListeners);
            }
        }
    },
    destroy: function (setNewBaseLayer) {
        if (setNewBaseLayer == null) {
            setNewBaseLayer = true;
        }
        if (this.map != null) {
            this.map.removeLayer(this, setNewBaseLayer);
        }
        this.projection = null;
        this.map = null;
        this.name = null;
        this.div = null;
        this.options = null;
        if (this.events) {
            if (this.eventListeners) {
                this.events.un(this.eventListeners);
            }
            this.events.destroy();
        }
        this.eventListeners = null;
        this.events = null;
    },
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer(this.name, this.getOptions());
        }
        OpenLayers.Util.applyDefaults(obj, this);
        obj.map = null;
        return obj;
    },
    getOptions: function () {
        var options = {};
        for (var o in this.options) {
            options[o] = this[o];
        }
        return options;
    },
    setName: function (newName) {
        if (newName != this.name) {
            this.name = newName;
            if (this.map != null) {
                this.map.events.triggerEvent("changelayer", {
                    layer: this,
                    property: "name"
                });
            }
        }
    },
    addOptions: function (newOptions, reinitialize) {
        if (this.options == null) {
            this.options = {};
        }
        if (newOptions) {
            if (typeof newOptions.projection == "string") {
                newOptions.projection = new OpenLayers.Projection(newOptions.projection);
            }
            if (newOptions.projection) {
                OpenLayers.Util.applyDefaults(newOptions, OpenLayers.Projection.defaults[newOptions.projection.getCode()]);
            }
            if (newOptions.maxExtent && !(newOptions.maxExtent instanceof OpenLayers.Bounds)) {
                newOptions.maxExtent = new OpenLayers.Bounds(newOptions.maxExtent);
            }
            if (newOptions.minExtent && !(newOptions.minExtent instanceof OpenLayers.Bounds)) {
                newOptions.minExtent = new OpenLayers.Bounds(newOptions.minExtent);
            }
        }
        OpenLayers.Util.extend(this.options, newOptions);
        OpenLayers.Util.extend(this, newOptions);
        if (this.projection && this.projection.getUnits()) {
            this.units = this.projection.getUnits();
        }
        if (this.map) {
            var resolution = this.map.getResolution();
            var properties = this.RESOLUTION_PROPERTIES.concat(["projection", "units", "minExtent", "maxExtent"]);
            for (var o in newOptions) {
                if (newOptions.hasOwnProperty(o) && OpenLayers.Util.indexOf(properties, o) >= 0) {
                    this.initResolutions();
                    if (reinitialize && this.map.baseLayer === this) {
                        this.map.setCenter(this.map.getCenter(), this.map.getZoomForResolution(resolution), false, true);
                        this.map.events.triggerEvent("changebaselayer", {
                            layer: this
                        });
                    }
                    break;
                }
            }
        }
    },
    onMapResize: function () {},
    redraw: function () {
        var redrawn = false;
        if (this.map) {
            this.inRange = this.calculateInRange();
            var extent = this.getExtent();
            if (extent && this.inRange && this.visibility) {
                var zoomChanged = true;
                this.moveTo(extent, zoomChanged, false);
                this.events.triggerEvent("moveend", {
                    "zoomChanged": zoomChanged
                });
                redrawn = true;
            }
        }
        return redrawn;
    },
    moveTo: function (bounds, zoomChanged, dragging) {
        var display = this.visibility;
        if (!this.isBaseLayer) {
            display = display && this.inRange;
        }
        this.display(display);
    },
    moveByPx: function (dx, dy) {},
    setMap: function (map) {
        if (this.map == null) {
            this.map = map;
            this.maxExtent = this.maxExtent || this.map.maxExtent;
            this.minExtent = this.minExtent || this.map.minExtent;
            this.projection = this.projection || this.map.projection;
            if (typeof this.projection == "string") {
                this.projection = new OpenLayers.Projection(this.projection);
            }
            this.units = this.projection.getUnits() || this.units || this.map.units;
            this.initResolutions();
            if (!this.isBaseLayer) {
                this.inRange = this.calculateInRange();
                var show = ((this.visibility) && (this.inRange));
                this.div.style.display = show ? "" : "none";
            }
            this.setTileSize();
        }
    },
    afterAdd: function () {},
    removeMap: function (map) {},
    getImageSize: function (bounds) {
        return (this.imageSize || this.tileSize);
    },
    setTileSize: function (size) {
        var tileSize = (size) ? size : ((this.tileSize) ? this.tileSize : this.map.getTileSize());
        this.tileSize = tileSize;
        if (this.gutter) {
            this.imageSize = new OpenLayers.Size(tileSize.w + (2 * this.gutter), tileSize.h + (2 * this.gutter));
        }
    },
    getVisibility: function () {
        return this.visibility;
    },
    setVisibility: function (visibility) {
        if (visibility != this.visibility) {
            this.visibility = visibility;
            this.display(visibility);
            this.redraw();
            if (this.map != null) {
                this.map.events.triggerEvent("changelayer", {
                    layer: this,
                    property: "visibility"
                });
            }
            this.events.triggerEvent("visibilitychanged");
        }
    },
    display: function (display) {
        if (display != (this.div.style.display != "none")) {
            this.div.style.display = (display && this.calculateInRange()) ? "block" : "none";
        }
    },
    calculateInRange: function () {
        var inRange = false;
        if (this.alwaysInRange) {
            inRange = true;
        } else {
            if (this.map) {
                var resolution = OpenLayers.Util.getResolutionFromScale(this.map.getScale(), this.units);
                inRange = ((resolution >= this.minResolution) && (resolution <= this.maxResolution));
            }
        }
        return inRange;
    },
    setIsBaseLayer: function (isBaseLayer) {
        if (isBaseLayer != this.isBaseLayer) {
            this.isBaseLayer = isBaseLayer;
            if (this.map != null) {
                this.map.events.triggerEvent("changebaselayer", {
                    layer: this
                });
            }
        }
    },
    initResolutions: function () {
        var i, len, p;
        var props = {}, alwaysInRange = true;
        for (i = 0, len = this.RESOLUTION_PROPERTIES.length; i < len; i++) {
            p = this.RESOLUTION_PROPERTIES[i];
            props[p] = this.options[p];
            if (alwaysInRange && this.options[p]) {
                alwaysInRange = false;
            }
        }
        if (this.alwaysInRange == null) {
            this.alwaysInRange = alwaysInRange;
        }
        if (props.resolutions == null) {
            props.resolutions = this.resolutionsFromScales(props.scales);
        }
        if (props.resolutions == null) {
            props.resolutions = this.calculateResolutions(props);
        }
        if (props.resolutions == null) {
            for (i = 0, len = this.RESOLUTION_PROPERTIES.length; i < len; i++) {
                p = this.RESOLUTION_PROPERTIES[i];
                props[p] = this.options[p] != null ? this.options[p] : this.map[p];
            }
            if (props.resolutions == null) {
                props.resolutions = this.resolutionsFromScales(props.scales);
            }
            if (props.resolutions == null) {
                props.resolutions = this.calculateResolutions(props);
            }
        }
        var maxResolution;
        if (this.options.maxResolution && this.options.maxResolution !== "auto") {
            maxResolution = this.options.maxResolution;
        }
        if (this.options.minScale) {
            maxResolution = OpenLayers.Util.getResolutionFromScale(this.options.minScale, this.units);
        }
        var minResolution;
        if (this.options.minResolution && this.options.minResolution !== "auto") {
            minResolution = this.options.minResolution;
        }
        if (this.options.maxScale) {
            minResolution = OpenLayers.Util.getResolutionFromScale(this.options.maxScale, this.units);
        }
        if (props.resolutions) {
            props.resolutions.sort(function (a, b) {
                return (b - a);
            });
            if (!maxResolution) {
                maxResolution = props.resolutions[0];
            }
            if (!minResolution) {
                var lastIdx = props.resolutions.length - 1;
                minResolution = props.resolutions[lastIdx];
            }
        }
        this.resolutions = props.resolutions;
        if (this.resolutions) {
            len = this.resolutions.length;
            this.scales = new Array(len);
            for (i = 0; i < len; i++) {
                this.scales[i] = OpenLayers.Util.getScaleFromResolution(this.resolutions[i], this.units);
            }
            this.numZoomLevels = len;
        }
        this.minResolution = minResolution;
        if (minResolution) {
            this.maxScale = OpenLayers.Util.getScaleFromResolution(minResolution, this.units);
        }
        this.maxResolution = maxResolution;
        if (maxResolution) {
            this.minScale = OpenLayers.Util.getScaleFromResolution(maxResolution, this.units);
        }
    },
    resolutionsFromScales: function (scales) {
        if (scales == null) {
            return;
        }
        var resolutions, i, len;
        len = scales.length;
        resolutions = new Array(len);
        for (i = 0; i < len; i++) {
            resolutions[i] = OpenLayers.Util.getResolutionFromScale(scales[i], this.units);
        }
        return resolutions;
    },
    calculateResolutions: function (props) {
        var viewSize, wRes, hRes;
        var maxResolution = props.maxResolution;
        if (props.minScale != null) {
            maxResolution = OpenLayers.Util.getResolutionFromScale(props.minScale, this.units);
        } else if (maxResolution == "auto" && this.maxExtent != null) {
            viewSize = this.map.getSize();
            wRes = this.maxExtent.getWidth() / viewSize.w;
            hRes = this.maxExtent.getHeight() / viewSize.h;
            maxResolution = Math.max(wRes, hRes);
        }
        var minResolution = props.minResolution;
        if (props.maxScale != null) {
            minResolution = OpenLayers.Util.getResolutionFromScale(props.maxScale, this.units);
        } else if (props.minResolution == "auto" && this.minExtent != null) {
            viewSize = this.map.getSize();
            wRes = this.minExtent.getWidth() / viewSize.w;
            hRes = this.minExtent.getHeight() / viewSize.h;
            minResolution = Math.max(wRes, hRes);
        }
        if (typeof maxResolution !== "number" && typeof minResolution !== "number" && this.maxExtent != null) {
            var tileSize = this.map.getTileSize();
            maxResolution = Math.max(this.maxExtent.getWidth() / tileSize.w, this.maxExtent.getHeight() / tileSize.h);
        }
        var maxZoomLevel = props.maxZoomLevel;
        var numZoomLevels = props.numZoomLevels;
        if (typeof minResolution === "number" && typeof maxResolution === "number" && numZoomLevels === undefined) {
            var ratio = maxResolution / minResolution;
            numZoomLevels = Math.floor(Math.log(ratio) / Math.log(2)) + 1;
        } else if (numZoomLevels === undefined && maxZoomLevel != null) {
            numZoomLevels = maxZoomLevel + 1;
        }
        if (typeof numZoomLevels !== "number" || numZoomLevels <= 0 || (typeof maxResolution !== "number" && typeof minResolution !== "number")) {
            return;
        }
        var resolutions = new Array(numZoomLevels);
        var base = 2;
        if (typeof minResolution == "number" && typeof maxResolution == "number") {
            base = Math.pow((maxResolution / minResolution), (1 / (numZoomLevels - 1)));
        }
        var i;
        if (typeof maxResolution === "number") {
            for (i = 0; i < numZoomLevels; i++) {
                resolutions[i] = maxResolution / Math.pow(base, i);
            }
        } else {
            for (i = 0; i < numZoomLevels; i++) {
                resolutions[numZoomLevels - 1 - i] = minResolution * Math.pow(base, i);
            }
        }
        return resolutions;
    },
    getResolution: function () {
        var zoom = this.map.getZoom();
        return this.getResolutionForZoom(zoom);
    },
    getExtent: function () {
        return this.map.calculateBounds();
    },
    getZoomForExtent: function (extent, closest) {
        var viewSize = this.map.getSize();
        var idealResolution = Math.max(extent.getWidth() / viewSize.w, extent.getHeight() / viewSize.h);
        return this.getZoomForResolution(idealResolution, closest);
    },
    getDataExtent: function () {},
    getResolutionForZoom: function (zoom) {
        zoom = Math.max(0, Math.min(zoom, this.resolutions.length - 1));
        var resolution;
        if (this.map.fractionalZoom) {
            var low = Math.floor(zoom);
            var high = Math.ceil(zoom);
            resolution = this.resolutions[low] -
                ((zoom - low) * (this.resolutions[low] - this.resolutions[high]));
        } else {
            resolution = this.resolutions[Math.round(zoom)];
        }
        return resolution;
    },
    getZoomForResolution: function (resolution, closest) {
        var zoom, i, len;
        if (this.map.fractionalZoom) {
            var lowZoom = 0;
            var highZoom = this.resolutions.length - 1;
            var highRes = this.resolutions[lowZoom];
            var lowRes = this.resolutions[highZoom];
            var res;
            for (i = 0, len = this.resolutions.length; i < len; ++i) {
                res = this.resolutions[i];
                if (res >= resolution) {
                    highRes = res;
                    lowZoom = i;
                }
                if (res <= resolution) {
                    lowRes = res;
                    highZoom = i;
                    break;
                }
            }
            var dRes = highRes - lowRes;
            if (dRes > 0) {
                zoom = lowZoom + ((highRes - resolution) / dRes);
            } else {
                zoom = lowZoom;
            }
        } else {
            var diff;
            var minDiff = Number.POSITIVE_INFINITY;
            for (i = 0, len = this.resolutions.length; i < len; i++) {
                if (closest) {
                    diff = Math.abs(this.resolutions[i] - resolution);
                    if (diff > minDiff) {
                        break;
                    }
                    minDiff = diff;
                } else {
                    if (this.resolutions[i] < resolution) {
                        break;
                    }
                }
            }
            zoom = Math.max(0, i - 1);
        }
        return zoom;
    },
    getLonLatFromViewPortPx: function (viewPortPx) {
        var lonlat = null;
        var map = this.map;
        if (viewPortPx != null && map.minPx) {
            var res = map.getResolution();
            var maxExtent = map.getMaxExtent({
                restricted: true
            });
            var lon = (viewPortPx.x - map.minPx.x) * res + maxExtent.left;
            var lat = (map.minPx.y - viewPortPx.y) * res + maxExtent.top;
            lonlat = new OpenLayers.LonLat(lon, lat);
            if (this.wrapDateLine) {
                lonlat = lonlat.wrapDateLine(this.maxExtent);
            }
        }
        return lonlat;
    },
    getViewPortPxFromLonLat: function (lonlat, resolution) {
        var px = null;
        if (lonlat != null) {
            resolution = resolution || this.map.getResolution();
            var extent = this.map.calculateBounds(null, resolution);
            px = new OpenLayers.Pixel((1 / resolution * (lonlat.lon - extent.left)), (1 / resolution * (extent.top - lonlat.lat)));
        }
        return px;
    },
    setOpacity: function (opacity) {
        if (opacity != this.opacity) {
            this.opacity = opacity;
            var childNodes = this.div.childNodes;
            for (var i = 0, len = childNodes.length; i < len; ++i) {
                var element = childNodes[i].firstChild || childNodes[i];
                var lastChild = childNodes[i].lastChild;
                if (lastChild && lastChild.nodeName.toLowerCase() === "iframe") {
                    element = lastChild.parentNode;
                }
                OpenLayers.Util.modifyDOMElement(element, null, null, null, null, null, null, opacity);
            }
            if (this.map != null) {
                this.map.events.triggerEvent("changelayer", {
                    layer: this,
                    property: "opacity"
                });
            }
        }
    },
    getZIndex: function () {
        return this.div.style.zIndex;
    },
    setZIndex: function (zIndex) {
        this.div.style.zIndex = zIndex;
    },
    adjustBounds: function (bounds) {
        if (this.gutter) {
            var mapGutter = this.gutter * this.map.getResolution();
            bounds = new OpenLayers.Bounds(bounds.left - mapGutter, bounds.bottom - mapGutter, bounds.right + mapGutter, bounds.top + mapGutter);
        }
        if (this.wrapDateLine) {
            var wrappingOptions = {
                'rightTolerance': this.getResolution(),
                'leftTolerance': this.getResolution()
            };
            bounds = bounds.wrapDateLine(this.maxExtent, wrappingOptions);
        }
        return bounds;
    },
    CLASS_NAME: "OpenLayers.Layer"
});
OpenLayers.Marker = OpenLayers.Class({
    icon: null,
    lonlat: null,
    events: null,
    map: null,
    initialize: function (lonlat, icon) {
        this.lonlat = lonlat;
        var newIcon = (icon) ? icon : OpenLayers.Marker.defaultIcon();
        if (this.icon == null) {
            this.icon = newIcon;
        } else {
            this.icon.url = newIcon.url;
            this.icon.size = newIcon.size;
            this.icon.offset = newIcon.offset;
            this.icon.calculateOffset = newIcon.calculateOffset;
        }
        this.events = new OpenLayers.Events(this, this.icon.imageDiv);
    },
    destroy: function () {
        this.erase();
        this.map = null;
        this.events.destroy();
        this.events = null;
        if (this.icon != null) {
            this.icon.destroy();
            this.icon = null;
        }
    },
    draw: function (px) {
        return this.icon.draw(px);
    },
    erase: function () {
        if (this.icon != null) {
            this.icon.erase();
        }
    },
    moveTo: function (px) {
        if ((px != null) && (this.icon != null)) {
            this.icon.moveTo(px);
        }
        this.lonlat = this.map.getLonLatFromLayerPx(px);
    },
    isDrawn: function () {
        var isDrawn = (this.icon && this.icon.isDrawn());
        return isDrawn;
    },
    onScreen: function () {
        var onScreen = false;
        if (this.map) {
            var screenBounds = this.map.getExtent();
            onScreen = screenBounds.containsLonLat(this.lonlat);
        }
        return onScreen;
    },
    inflate: function (inflate) {
        if (this.icon) {
            this.icon.setSize({
                w: this.icon.size.w * inflate,
                h: this.icon.size.h * inflate
            });
        }
    },
    setOpacity: function (opacity) {
        this.icon.setOpacity(opacity);
    },
    setUrl: function (url) {
        this.icon.setUrl(url);
    },
    display: function (display) {
        this.icon.display(display);
    },
    CLASS_NAME: "OpenLayers.Marker"
});
OpenLayers.Marker.defaultIcon = function () {
    return new OpenLayers.Icon(OpenLayers.Util.getImageLocation("marker.png"), {
        w: 21,
        h: 25
    }, {
        x: -10.5,
        y: -25
    });
};
OpenLayers.Tile = OpenLayers.Class({
    events: null,
    eventListeners: null,
    id: null,
    layer: null,
    url: null,
    bounds: null,
    size: null,
    position: null,
    isLoading: false,
    initialize: function (layer, position, bounds, url, size, options) {
        this.layer = layer;
        this.position = position.clone();
        this.setBounds(bounds);
        this.url = url;
        if (size) {
            this.size = size.clone();
        }
        this.id = OpenLayers.Util.createUniqueID("Tile_");
        OpenLayers.Util.extend(this, options);
        this.events = new OpenLayers.Events(this);
        if (this.eventListeners instanceof Object) {
            this.events.on(this.eventListeners);
        }
    },
    unload: function () {
        if (this.isLoading) {
            this.isLoading = false;
            this.events.triggerEvent("unload");
        }
    },
    destroy: function () {
        this.layer = null;
        this.bounds = null;
        this.size = null;
        this.position = null;
        if (this.eventListeners) {
            this.events.un(this.eventListeners);
        }
        this.events.destroy();
        this.eventListeners = null;
        this.events = null;
    },
    draw: function (deferred) {
        if (!deferred) {
            this.clear();
        }
        var draw = this.shouldDraw();
        if (draw && !deferred) {
            draw = this.events.triggerEvent("beforedraw") !== false;
        }
        return draw;
    },
    shouldDraw: function () {
        var withinMaxExtent = false,
            maxExtent = this.layer.maxExtent;
        if (maxExtent) {
            var map = this.layer.map;
            var worldBounds = map.baseLayer.wrapDateLine && map.getMaxExtent();
            if (this.bounds.intersectsBounds(maxExtent, {
                inclusive: false,
                worldBounds: worldBounds
            })) {
                withinMaxExtent = true;
            }
        }
        return withinMaxExtent || this.layer.displayOutsideMaxExtent;
    },
    setBounds: function (bounds) {
        bounds = bounds.clone();
        if (this.layer.map.baseLayer.wrapDateLine) {
            var worldExtent = this.layer.map.getMaxExtent(),
                tolerance = this.layer.map.getResolution();
            bounds = bounds.wrapDateLine(worldExtent, {
                leftTolerance: tolerance,
                rightTolerance: tolerance
            });
        }
        this.bounds = bounds;
    },
    moveTo: function (bounds, position, redraw) {
        if (redraw == null) {
            redraw = true;
        }
        this.setBounds(bounds);
        this.position = position.clone();
        if (redraw) {
            this.draw();
        }
    },
    clear: function (draw) {},
    CLASS_NAME: "OpenLayers.Tile"
});
OpenLayers.Tile.Image = OpenLayers.Class(OpenLayers.Tile, {
    url: null,
    imgDiv: null,
    frame: null,
    imageReloadAttempts: null,
    layerAlphaHack: null,
    asyncRequestId: null,
    blankImageUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7",
    maxGetUrlLength: null,
    canvasContext: null,
    crossOriginKeyword: null,
    initialize: function (layer, position, bounds, url, size, options) {
        OpenLayers.Tile.prototype.initialize.apply(this, arguments);
        this.url = url;
        this.layerAlphaHack = this.layer.alpha && OpenLayers.Util.alphaHack();
        if (this.maxGetUrlLength != null || this.layer.gutter || this.layerAlphaHack) {
            this.frame = document.createElement("div");
            this.frame.style.position = "absolute";
            this.frame.style.overflow = "hidden";
        }
        if (this.maxGetUrlLength != null) {
            OpenLayers.Util.extend(this, OpenLayers.Tile.Image.IFrame);
        }
    },
    destroy: function () {
        if (this.imgDiv) {
            this.clear();
            this.imgDiv = null;
            this.frame = null;
        }
        this.asyncRequestId = null;
        OpenLayers.Tile.prototype.destroy.apply(this, arguments);
    },
    draw: function () {
        var drawn = OpenLayers.Tile.prototype.draw.apply(this, arguments);
        if (drawn) {
            if (this.layer != this.layer.map.baseLayer && this.layer.reproject) {
                this.bounds = this.getBoundsFromBaseLayer(this.position);
            }
            if (this.isLoading) {
                this._loadEvent = "reload";
            } else {
                this.isLoading = true;
                this._loadEvent = "loadstart";
            }
            this.positionTile();
            this.renderTile();
        } else {
            this.unload();
        }
        return drawn;
    },
    renderTile: function () {
        this.layer.div.appendChild(this.getTile());
        if (this.layer.async) {
            var id = this.asyncRequestId = (this.asyncRequestId || 0) + 1;
            this.layer.getURLasync(this.bounds, function (url) {
                if (id == this.asyncRequestId) {
                    this.url = url;
                    this.initImage();
                }
            }, this);
        } else {
            this.url = this.layer.getURL(this.bounds);
            this.initImage();
        }
    },
    positionTile: function () {
        var style = this.getTile().style,
            size = this.frame ? this.size : this.layer.getImageSize(this.bounds);
        style.left = this.position.x + "%";
        style.top = this.position.y + "%";
        style.width = size.w + "%";
        style.height = size.h + "%";
    },
    clear: function () {
        OpenLayers.Tile.prototype.clear.apply(this, arguments);
        var img = this.imgDiv;
        if (img) {
            OpenLayers.Event.stopObservingElement(img);
            var tile = this.getTile();
            if (tile.parentNode === this.layer.div) {
                this.layer.div.removeChild(tile);
            }
            this.setImgSrc();
            if (this.layerAlphaHack === true) {
                img.style.filter = "";
            }
            OpenLayers.Element.removeClass(img, "olImageLoadError");
        }
        this.canvasContext = null;
    },
    getImage: function () {
        if (!this.imgDiv) {
            this.imgDiv = document.createElement("img");
            this.imgDiv.className = "olTileImage";
            this.imgDiv.galleryImg = "no";
            var style = this.imgDiv.style;
            if (this.frame) {
                var left = 0,
                    top = 0;
                if (this.layer.gutter) {
                    left = this.layer.gutter / this.layer.tileSize.w * 100;
                    top = this.layer.gutter / this.layer.tileSize.h * 100;
                }
                style.left = -left + "%";
                style.top = -top + "%";
                style.width = (2 * left + 100) + "%";
                style.height = (2 * top + 100) + "%";
            }
            style.visibility = "hidden";
            style.opacity = 0;
            if (this.layer.opacity < 1) {
                style.filter = 'alpha(opacity=' +
                    (this.layer.opacity * 100) + ')';
            }
            style.position = "absolute";
            if (this.layerAlphaHack) {
                style.paddingTop = style.height;
                style.height = "0";
                style.width = "100%";
            }
            if (this.frame) {
                this.frame.appendChild(this.imgDiv);
            }
        }
        return this.imgDiv;
    },
    initImage: function () {
        this.events.triggerEvent(this._loadEvent);
        var img = this.getImage();
        if (this.url && img.getAttribute("src") == this.url) {
            this.onImageLoad();
        } else {
            var load = OpenLayers.Function.bind(function () {
                OpenLayers.Event.stopObservingElement(img);
                OpenLayers.Event.observe(img, "load", OpenLayers.Function.bind(this.onImageLoad, this));
                OpenLayers.Event.observe(img, "error", OpenLayers.Function.bind(this.onImageError, this));
                this.imageReloadAttempts = 0;
                this.setImgSrc(this.url);
            }, this);
            if (img.getAttribute("src") == this.blankImageUrl) {
                load();
            } else {
                OpenLayers.Event.observe(img, "load", load);
                OpenLayers.Event.observe(img, "error", load);
                if (this.crossOriginKeyword) {
                    img.removeAttribute("crossorigin");
                }
                img.src = this.blankImageUrl;
            }
        }
    },
    setImgSrc: function (url) {
        var img = this.imgDiv;
        img.style.visibility = 'hidden';
        img.style.opacity = 0;
        if (url) {
            if (this.crossOriginKeyword) {
                if (url.substr(0, 5) !== 'data:') {
                    img.setAttribute("crossorigin", this.crossOriginKeyword);
                } else {
                    img.removeAttribute("crossorigin");
                }
            }
            img.src = url;
        }
    },
    getTile: function () {
        return this.frame ? this.frame : this.getImage();
    },
    createBackBuffer: function () {
        if (!this.imgDiv || this.isLoading) {
            return;
        }
        var backBuffer;
        if (this.frame) {
            backBuffer = this.frame.cloneNode(false);
            backBuffer.appendChild(this.imgDiv);
        } else {
            backBuffer = this.imgDiv;
        }
        this.imgDiv = null;
        return backBuffer;
    },
    onImageLoad: function () {
        var img = this.imgDiv;
        OpenLayers.Event.stopObservingElement(img);
        img.style.visibility = 'inherit';
        img.style.opacity = this.layer.opacity;
        this.isLoading = false;
        this.canvasContext = null;
        this.events.triggerEvent("loadend");
        if (parseFloat(navigator.appVersion.split("MSIE")[1]) < 7 && this.layer && this.layer.div) {
            var span = document.createElement("span");
            span.style.display = "none";
            var layerDiv = this.layer.div;
            layerDiv.appendChild(span);
            window.setTimeout(function () {
                span.parentNode === layerDiv && span.parentNode.removeChild(span);
            }, 0);
        }
        if (this.layerAlphaHack === true) {
            img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" +
                img.src + "', sizingMethod='scale')";
        }
    },
    onImageError: function () {
        var img = this.imgDiv;
        if (img.src != null) {
            this.imageReloadAttempts++;
            if (this.imageReloadAttempts <= OpenLayers.IMAGE_RELOAD_ATTEMPTS) {
                this.setImgSrc(this.layer.getURL(this.bounds));
            } else {
                OpenLayers.Element.addClass(img, "olImageLoadError");
                this.events.triggerEvent("loaderror");
                this.onImageLoad();
            }
        }
    },
    getCanvasContext: function () {
        if (OpenLayers.CANVAS_SUPPORTED && this.imgDiv && !this.isLoading) {
            if (!this.canvasContext) {
                var canvas = document.createElement("canvas");
                canvas.width = this.size.w;
                canvas.height = this.size.h;
                this.canvasContext = canvas.getContext("2d");
                this.canvasContext.drawImage(this.imgDiv, 0, 0);
            }
            return this.canvasContext;
        }
    },
    CLASS_NAME: "OpenLayers.Tile.Image"
});
OpenLayers.Layer.SphericalMercator = {
    getExtent: function () {
        var extent = null;
        if (this.sphericalMercator) {
            extent = this.map.calculateBounds();
        } else {
            extent = OpenLayers.Layer.FixedZoomLevels.prototype.getExtent.apply(this);
        }
        return extent;
    },
    getLonLatFromViewPortPx: function (viewPortPx) {
        return OpenLayers.Layer.prototype.getLonLatFromViewPortPx.apply(this, arguments);
    },
    getViewPortPxFromLonLat: function (lonlat) {
        return OpenLayers.Layer.prototype.getViewPortPxFromLonLat.apply(this, arguments);
    },
    initMercatorParameters: function () {
        this.RESOLUTIONS = [];
        var maxResolution = 156543.03390625;
        for (var zoom = 0; zoom <= this.MAX_ZOOM_LEVEL; ++zoom) {
            this.RESOLUTIONS[zoom] = maxResolution / Math.pow(2, zoom);
        }
        this.units = "m";
        this.projection = this.projection || "EPSG:900913";
    },
    forwardMercator: (function () {
        var gg = new OpenLayers.Projection("EPSG:4326");
        var sm = new OpenLayers.Projection("EPSG:900913");
        return function (lon, lat) {
            var point = OpenLayers.Projection.transform({
                x: lon,
                y: lat
            }, gg, sm);
            return new OpenLayers.LonLat(point.x, point.y);
        };
    })(),
    inverseMercator: (function () {
        var gg = new OpenLayers.Projection("EPSG:4326");
        var sm = new OpenLayers.Projection("EPSG:900913");
        return function (x, y) {
            var point = OpenLayers.Projection.transform({
                x: x,
                y: y
            }, sm, gg);
            return new OpenLayers.LonLat(point.x, point.y);
        };
    })()
};
OpenLayers.Layer.EventPane = OpenLayers.Class(OpenLayers.Layer, {
    smoothDragPan: true,
    isBaseLayer: true,
    isFixed: true,
    pane: null,
    mapObject: null,
    initialize: function (name, options) {
        OpenLayers.Layer.prototype.initialize.apply(this, arguments);
        if (this.pane == null) {
            this.pane = OpenLayers.Util.createDiv(this.div.id + "_EventPane");
        }
    },
    destroy: function () {
        this.mapObject = null;
        this.pane = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments);
    },
    setMap: function (map) {
        OpenLayers.Layer.prototype.setMap.apply(this, arguments);
        this.pane.style.zIndex = parseInt(this.div.style.zIndex) + 1;
        this.pane.style.display = this.div.style.display;
        this.pane.style.width = "100%";
        this.pane.style.height = "100%";
        if (OpenLayers.BROWSER_NAME == "msie") {
            this.pane.style.background = "url(" + OpenLayers.Util.getImageLocation("blank.gif") + ")";
        }
        if (this.isFixed) {
            this.map.viewPortDiv.appendChild(this.pane);
        } else {
            this.map.layerContainerDiv.appendChild(this.pane);
        }
        this.loadMapObject();
        if (this.mapObject == null) {
            this.loadWarningMessage();
        }
    },
    removeMap: function (map) {
        if (this.pane && this.pane.parentNode) {
            this.pane.parentNode.removeChild(this.pane);
        }
        OpenLayers.Layer.prototype.removeMap.apply(this, arguments);
    },
    loadWarningMessage: function () {
        this.div.style.backgroundColor = "darkblue";
        var viewSize = this.map.getSize();
        var msgW = Math.min(viewSize.w, 300);
        var msgH = Math.min(viewSize.h, 200);
        var size = new OpenLayers.Size(msgW, msgH);
        var centerPx = new OpenLayers.Pixel(viewSize.w / 2, viewSize.h / 2);
        var topLeft = centerPx.add(-size.w / 2, -size.h / 2);
        var div = OpenLayers.Util.createDiv(this.name + "_warning", topLeft, size, null, null, null, "auto");
        div.style.padding = "7px";
        div.style.backgroundColor = "yellow";
        div.innerHTML = this.getWarningHTML();
        this.div.appendChild(div);
    },
    getWarningHTML: function () {
        return "";
    },
    display: function (display) {
        OpenLayers.Layer.prototype.display.apply(this, arguments);
        this.pane.style.display = this.div.style.display;
    },
    setZIndex: function (zIndex) {
        OpenLayers.Layer.prototype.setZIndex.apply(this, arguments);
        this.pane.style.zIndex = parseInt(this.div.style.zIndex) + 1;
    },
    moveByPx: function (dx, dy) {
        OpenLayers.Layer.prototype.moveByPx.apply(this, arguments);
        if (this.dragPanMapObject) {
            this.dragPanMapObject(dx, -dy);
        } else {
            this.moveTo(this.map.getCachedCenter());
        }
    },
    moveTo: function (bounds, zoomChanged, dragging) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);
        if (this.mapObject != null) {
            var newCenter = this.map.getCenter();
            var newZoom = this.map.getZoom();
            if (newCenter != null) {
                var moOldCenter = this.getMapObjectCenter();
                var oldCenter = this.getOLLonLatFromMapObjectLonLat(moOldCenter);
                var moOldZoom = this.getMapObjectZoom();
                var oldZoom = this.getOLZoomFromMapObjectZoom(moOldZoom);
                if (!(newCenter.equals(oldCenter)) || newZoom != oldZoom) {
                    if (!zoomChanged && oldCenter && this.dragPanMapObject && this.smoothDragPan) {
                        var oldPx = this.map.getViewPortPxFromLonLat(oldCenter);
                        var newPx = this.map.getViewPortPxFromLonLat(newCenter);
                        this.dragPanMapObject(newPx.x - oldPx.x, oldPx.y - newPx.y);
                    } else {
                        var center = this.getMapObjectLonLatFromOLLonLat(newCenter);
                        var zoom = this.getMapObjectZoomFromOLZoom(newZoom);
                        this.setMapObjectCenter(center, zoom, dragging);
                    }
                }
            }
        }
    },
    getLonLatFromViewPortPx: function (viewPortPx) {
        var lonlat = null;
        if ((this.mapObject != null) && (this.getMapObjectCenter() != null)) {
            var moPixel = this.getMapObjectPixelFromOLPixel(viewPortPx);
            var moLonLat = this.getMapObjectLonLatFromMapObjectPixel(moPixel);
            lonlat = this.getOLLonLatFromMapObjectLonLat(moLonLat);
        }
        return lonlat;
    },
    getViewPortPxFromLonLat: function (lonlat) {
        var viewPortPx = null;
        if ((this.mapObject != null) && (this.getMapObjectCenter() != null)) {
            var moLonLat = this.getMapObjectLonLatFromOLLonLat(lonlat);
            var moPixel = this.getMapObjectPixelFromMapObjectLonLat(moLonLat);
            viewPortPx = this.getOLPixelFromMapObjectPixel(moPixel);
        }
        return viewPortPx;
    },
    getOLLonLatFromMapObjectLonLat: function (moLonLat) {
        var olLonLat = null;
        if (moLonLat != null) {
            var lon = this.getLongitudeFromMapObjectLonLat(moLonLat);
            var lat = this.getLatitudeFromMapObjectLonLat(moLonLat);
            olLonLat = new OpenLayers.LonLat(lon, lat);
        }
        return olLonLat;
    },
    getMapObjectLonLatFromOLLonLat: function (olLonLat) {
        var moLatLng = null;
        if (olLonLat != null) {
            moLatLng = this.getMapObjectLonLatFromLonLat(olLonLat.lon, olLonLat.lat);
        }
        return moLatLng;
    },
    getOLPixelFromMapObjectPixel: function (moPixel) {
        var olPixel = null;
        if (moPixel != null) {
            var x = this.getXFromMapObjectPixel(moPixel);
            var y = this.getYFromMapObjectPixel(moPixel);
            olPixel = new OpenLayers.Pixel(x, y);
        }
        return olPixel;
    },
    getMapObjectPixelFromOLPixel: function (olPixel) {
        var moPixel = null;
        if (olPixel != null) {
            moPixel = this.getMapObjectPixelFromXY(olPixel.x, olPixel.y);
        }
        return moPixel;
    },
    CLASS_NAME: "OpenLayers.Layer.EventPane"
});
OpenLayers.Layer.FixedZoomLevels = OpenLayers.Class({
    initialize: function () {},
    initResolutions: function () {
        var props = ['minZoomLevel', 'maxZoomLevel', 'numZoomLevels'];
        for (var i = 0, len = props.length; i < len; i++) {
            var property = props[i];
            this[property] = (this.options[property] != null) ? this.options[property] : this.map[property];
        }
        if ((this.minZoomLevel == null) || (this.minZoomLevel < this.MIN_ZOOM_LEVEL)) {
            this.minZoomLevel = this.MIN_ZOOM_LEVEL;
        }
        var desiredZoomLevels;
        var limitZoomLevels = this.MAX_ZOOM_LEVEL - this.minZoomLevel + 1;
        if (((this.options.numZoomLevels == null) && (this.options.maxZoomLevel != null)) || ((this.numZoomLevels == null) && (this.maxZoomLevel != null))) {
            desiredZoomLevels = this.maxZoomLevel - this.minZoomLevel + 1;
        } else {
            desiredZoomLevels = this.numZoomLevels;
        }
        if (desiredZoomLevels != null) {
            this.numZoomLevels = Math.min(desiredZoomLevels, limitZoomLevels);
        } else {
            this.numZoomLevels = limitZoomLevels;
        }
        this.maxZoomLevel = this.minZoomLevel + this.numZoomLevels - 1;
        if (this.RESOLUTIONS != null) {
            var resolutionsIndex = 0;
            this.resolutions = [];
            for (var i = this.minZoomLevel; i <= this.maxZoomLevel; i++) {
                this.resolutions[resolutionsIndex++] = this.RESOLUTIONS[i];
            }
            this.maxResolution = this.resolutions[0];
            this.minResolution = this.resolutions[this.resolutions.length - 1];
        }
    },
    getResolution: function () {
        if (this.resolutions != null) {
            return OpenLayers.Layer.prototype.getResolution.apply(this, arguments);
        } else {
            var resolution = null;
            var viewSize = this.map.getSize();
            var extent = this.getExtent();
            if ((viewSize != null) && (extent != null)) {
                resolution = Math.max(extent.getWidth() / viewSize.w, extent.getHeight() / viewSize.h);
            }
            return resolution;
        }
    },
    getExtent: function () {
        var size = this.map.getSize();
        var tl = this.getLonLatFromViewPortPx({
            x: 0,
            y: 0
        });
        var br = this.getLonLatFromViewPortPx({
            x: size.w,
            y: size.h
        });
        if ((tl != null) && (br != null)) {
            return new OpenLayers.Bounds(tl.lon, br.lat, br.lon, tl.lat);
        } else {
            return null;
        }
    },
    getZoomForResolution: function (resolution) {
        if (this.resolutions != null) {
            return OpenLayers.Layer.prototype.getZoomForResolution.apply(this, arguments);
        } else {
            var extent = OpenLayers.Layer.prototype.getExtent.apply(this, []);
            return this.getZoomForExtent(extent);
        }
    },
    getOLZoomFromMapObjectZoom: function (moZoom) {
        var zoom = null;
        if (moZoom != null) {
            zoom = moZoom - this.minZoomLevel;
            if (this.map.baseLayer !== this) {
                zoom = this.map.baseLayer.getZoomForResolution(this.getResolutionForZoom(zoom));
            }
        }
        return zoom;
    },
    getMapObjectZoomFromOLZoom: function (olZoom) {
        var zoom = null;
        if (olZoom != null) {
            zoom = olZoom + this.minZoomLevel;
            if (this.map.baseLayer !== this) {
                zoom = this.getZoomForResolution(this.map.baseLayer.getResolutionForZoom(zoom));
            }
        }
        return zoom;
    },
    CLASS_NAME: "OpenLayers.Layer.FixedZoomLevels"
});
OpenLayers.Layer.Google = OpenLayers.Class(OpenLayers.Layer.EventPane, OpenLayers.Layer.FixedZoomLevels, {
    MIN_ZOOM_LEVEL: 0,
    MAX_ZOOM_LEVEL: 21,
    RESOLUTIONS: [1.40625, 0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625, 0.000171661376953125, 0.0000858306884765625, 0.00004291534423828125, 0.00002145767211914062, 0.00001072883605957031, 0.00000536441802978515, 0.00000268220901489257, 0.0000013411045074462891, 0.00000067055225372314453],
    type: null,
    wrapDateLine: true,
    sphericalMercator: false,
    version: null,
    initialize: function (name, options) {
        options = options || {};
        if (!options.version) {
            options.version = typeof GMap2 === "function" ? "2" : "3";
        }
        var mixin = OpenLayers.Layer.Google["v" +
            options.version.replace(/\./g, "_")];
        if (mixin) {
            OpenLayers.Util.applyDefaults(options, mixin);
        } else {
            throw "Unsupported Google Maps API version: " + options.version;
        }
        OpenLayers.Util.applyDefaults(options, mixin.DEFAULTS);
        if (options.maxExtent) {
            options.maxExtent = options.maxExtent.clone();
        }
        OpenLayers.Layer.EventPane.prototype.initialize.apply(this, [name, options]);
        OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this, [name, options]);
        if (this.sphericalMercator) {
            OpenLayers.Util.extend(this, OpenLayers.Layer.SphericalMercator);
            this.initMercatorParameters();
        }
    },
    clone: function () {
        return new OpenLayers.Layer.Google(this.name, this.getOptions());
    },
    setVisibility: function (visible) {
        var opacity = this.opacity == null ? 1 : this.opacity;
        OpenLayers.Layer.EventPane.prototype.setVisibility.apply(this, arguments);
        this.setOpacity(opacity);
    },
    display: function (visible) {
        if (!this._dragging) {
            this.setGMapVisibility(visible);
        }
        OpenLayers.Layer.EventPane.prototype.display.apply(this, arguments);
    },
    moveTo: function (bounds, zoomChanged, dragging) {
        this._dragging = dragging;
        OpenLayers.Layer.EventPane.prototype.moveTo.apply(this, arguments);
        delete this._dragging;
    },
    setOpacity: function (opacity) {
        if (opacity !== this.opacity) {
            if (this.map != null) {
                this.map.events.triggerEvent("changelayer", {
                    layer: this,
                    property: "opacity"
                });
            }
            this.opacity = opacity;
        }
        if (this.getVisibility()) {
            var container = this.getMapContainer();
            OpenLayers.Util.modifyDOMElement(container, null, null, null, null, null, null, opacity);
        }
    },
    destroy: function () {
        if (this.map) {
            this.setGMapVisibility(false);
            var cache = OpenLayers.Layer.Google.cache[this.map.id];
            if (cache && cache.count <= 1) {
                this.removeGMapElements();
            }
        }
        OpenLayers.Layer.EventPane.prototype.destroy.apply(this, arguments);
    },
    removeGMapElements: function () {
        var cache = OpenLayers.Layer.Google.cache[this.map.id];
        if (cache) {
            var container = this.mapObject && this.getMapContainer();
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }
            var termsOfUse = cache.termsOfUse;
            if (termsOfUse && termsOfUse.parentNode) {
                termsOfUse.parentNode.removeChild(termsOfUse);
            }
            var poweredBy = cache.poweredBy;
            if (poweredBy && poweredBy.parentNode) {
                poweredBy.parentNode.removeChild(poweredBy);
            }
        }
    },
    removeMap: function (map) {
        if (this.visibility && this.mapObject) {
            this.setGMapVisibility(false);
        }
        var cache = OpenLayers.Layer.Google.cache[map.id];
        if (cache) {
            if (cache.count <= 1) {
                this.removeGMapElements();
                delete OpenLayers.Layer.Google.cache[map.id];
            } else {
                --cache.count;
            }
        }
        delete this.termsOfUse;
        delete this.poweredBy;
        delete this.mapObject;
        delete this.dragObject;
        OpenLayers.Layer.EventPane.prototype.removeMap.apply(this, arguments);
    },
    getOLBoundsFromMapObjectBounds: function (moBounds) {
        var olBounds = null;
        if (moBounds != null) {
            var sw = moBounds.getSouthWest();
            var ne = moBounds.getNorthEast();
            if (this.sphericalMercator) {
                sw = this.forwardMercator(sw.lng(), sw.lat());
                ne = this.forwardMercator(ne.lng(), ne.lat());
            } else {
                sw = new OpenLayers.LonLat(sw.lng(), sw.lat());
                ne = new OpenLayers.LonLat(ne.lng(), ne.lat());
            }
            olBounds = new OpenLayers.Bounds(sw.lon, sw.lat, ne.lon, ne.lat);
        }
        return olBounds;
    },
    getWarningHTML: function () {
        return OpenLayers.i18n("googleWarning");
    },
    getMapObjectCenter: function () {
        return this.mapObject.getCenter();
    },
    getMapObjectZoom: function () {
        return this.mapObject.getZoom();
    },
    getLongitudeFromMapObjectLonLat: function (moLonLat) {
        return this.sphericalMercator ? this.forwardMercator(moLonLat.lng(), moLonLat.lat()).lon : moLonLat.lng();
    },
    getLatitudeFromMapObjectLonLat: function (moLonLat) {
        var lat = this.sphericalMercator ? this.forwardMercator(moLonLat.lng(), moLonLat.lat()).lat : moLonLat.lat();
        return lat;
    },
    getXFromMapObjectPixel: function (moPixel) {
        return moPixel.x;
    },
    getYFromMapObjectPixel: function (moPixel) {
        return moPixel.y;
    },
    CLASS_NAME: "OpenLayers.Layer.Google"
});
OpenLayers.Layer.Google.cache = {};
OpenLayers.Layer.Google.v2 = {
    termsOfUse: null,
    poweredBy: null,
    dragObject: null,
    loadMapObject: function () {
        if (!this.type) {
            this.type = G_NORMAL_MAP;
        }
        var mapObject, termsOfUse, poweredBy;
        var cache = OpenLayers.Layer.Google.cache[this.map.id];
        if (cache) {
            mapObject = cache.mapObject;
            termsOfUse = cache.termsOfUse;
            poweredBy = cache.poweredBy;
            ++cache.count;
        } else {
            var container = this.map.viewPortDiv;
            var div = document.createElement("div");
            div.id = this.map.id + "_GMap2Container";
            div.style.position = "absolute";
            div.style.width = "100%";
            div.style.height = "100%";
            container.appendChild(div);
            try {
                mapObject = new GMap2(div);
                termsOfUse = div.lastChild;
                container.appendChild(termsOfUse);
                termsOfUse.style.zIndex = "1100";
                termsOfUse.style.right = "";
                termsOfUse.style.bottom = "";
                termsOfUse.className = "olLayerGoogleCopyright";
                poweredBy = div.lastChild;
                container.appendChild(poweredBy);
                poweredBy.style.zIndex = "1100";
                poweredBy.style.right = "";
                poweredBy.style.bottom = "";
                poweredBy.className = "olLayerGooglePoweredBy gmnoprint";
            } catch (e) {
                throw (e);
            }
            OpenLayers.Layer.Google.cache[this.map.id] = {
                mapObject: mapObject,
                termsOfUse: termsOfUse,
                poweredBy: poweredBy,
                count: 1
            };
        }
        this.mapObject = mapObject;
        this.termsOfUse = termsOfUse;
        this.poweredBy = poweredBy;
        if (OpenLayers.Util.indexOf(this.mapObject.getMapTypes(), this.type) === -1) {
            this.mapObject.addMapType(this.type);
        }
        if (typeof mapObject.getDragObject == "function") {
            this.dragObject = mapObject.getDragObject();
        } else {
            this.dragPanMapObject = null;
        }
        if (this.isBaseLayer === false) {
            this.setGMapVisibility(this.div.style.display !== "none");
        }
    },
    onMapResize: function () {
        if (this.visibility && this.mapObject.isLoaded()) {
            this.mapObject.checkResize();
        } else {
            if (!this._resized) {
                var layer = this;
                var handle = GEvent.addListener(this.mapObject, "load", function () {
                    GEvent.removeListener(handle);
                    delete layer._resized;
                    layer.mapObject.checkResize();
                    layer.moveTo(layer.map.getCenter(), layer.map.getZoom());
                });
            }
            this._resized = true;
        }
    },
    setGMapVisibility: function (visible) {
        var cache = OpenLayers.Layer.Google.cache[this.map.id];
        if (cache) {
            var container = this.mapObject.getContainer();
            if (visible === true) {
                this.mapObject.setMapType(this.type);
                container.style.display = "";
                this.termsOfUse.style.left = "";
                this.termsOfUse.style.display = "";
                this.poweredBy.style.display = "";
                cache.displayed = this.id;
            } else {
                if (cache.displayed === this.id) {
                    delete cache.displayed;
                }
                if (!cache.displayed) {
                    container.style.display = "none";
                    this.termsOfUse.style.display = "none";
                    this.termsOfUse.style.left = "-9999px";
                    this.poweredBy.style.display = "none";
                }
            }
        }
    },
    getMapContainer: function () {
        return this.mapObject.getContainer();
    },
    getMapObjectBoundsFromOLBounds: function (olBounds) {
        var moBounds = null;
        if (olBounds != null) {
            var sw = this.sphericalMercator ? this.inverseMercator(olBounds.bottom, olBounds.left) : new OpenLayers.LonLat(olBounds.bottom, olBounds.left);
            var ne = this.sphericalMercator ? this.inverseMercator(olBounds.top, olBounds.right) : new OpenLayers.LonLat(olBounds.top, olBounds.right);
            moBounds = new GLatLngBounds(new GLatLng(sw.lat, sw.lon), new GLatLng(ne.lat, ne.lon));
        }
        return moBounds;
    },
    setMapObjectCenter: function (center, zoom) {
        this.mapObject.setCenter(center, zoom);
    },
    dragPanMapObject: function (dX, dY) {
        this.dragObject.moveBy(new GSize(-dX, dY));
    },
    getMapObjectLonLatFromMapObjectPixel: function (moPixel) {
        return this.mapObject.fromContainerPixelToLatLng(moPixel);
    },
    getMapObjectPixelFromMapObjectLonLat: function (moLonLat) {
        return this.mapObject.fromLatLngToContainerPixel(moLonLat);
    },
    getMapObjectZoomFromMapObjectBounds: function (moBounds) {
        return this.mapObject.getBoundsZoomLevel(moBounds);
    },
    getMapObjectLonLatFromLonLat: function (lon, lat) {
        var gLatLng;
        if (this.sphericalMercator) {
            var lonlat = this.inverseMercator(lon, lat);
            gLatLng = new GLatLng(lonlat.lat, lonlat.lon);
        } else {
            gLatLng = new GLatLng(lat, lon);
        }
        return gLatLng;
    },
    getMapObjectPixelFromXY: function (x, y) {
        return new GPoint(x, y);
    }
};
OpenLayers.Layer.Google.v3 = {
    DEFAULTS: {
        sphericalMercator: true,
        projection: "EPSG:900913"
    },
    animationEnabled: true,
    loadMapObject: function () {
        if (!this.type) {
            this.type = google.maps.MapTypeId.ROADMAP;
        }
        var mapObject;
        var cache = OpenLayers.Layer.Google.cache[this.map.id];
        if (cache) {
            mapObject = cache.mapObject;
            ++cache.count;
        } else {
            var container = this.map.viewPortDiv;
            var div = document.createElement("div");
            div.id = this.map.id + "_GMapContainer";
            div.style.position = "absolute";
            div.style.width = "100%";
            div.style.height = "100%";
            container.appendChild(div);
            var center = this.map.getCenter();
            mapObject = new google.maps.Map(div, {
                center: center ? new google.maps.LatLng(center.lat, center.lon) : new google.maps.LatLng(0, 0),
                zoom: this.map.getZoom() || 0,
                mapTypeId: this.type,
                disableDefaultUI: true,
                keyboardShortcuts: false,
                draggable: false,
                disableDoubleClickZoom: true,
                scrollwheel: false,
                streetViewControl: false
            });
            cache = {
                mapObject: mapObject,
                count: 1
            };
            OpenLayers.Layer.Google.cache[this.map.id] = cache;
            this.repositionListener = google.maps.event.addListenerOnce(mapObject, "center_changed", OpenLayers.Function.bind(this.repositionMapElements, this));
        }
        this.mapObject = mapObject;
        this.setGMapVisibility(this.visibility);
    },
    repositionMapElements: function () {
        google.maps.event.trigger(this.mapObject, "resize");
        var div = this.mapObject.getDiv().firstChild;
        if (!div || div.childNodes.length < 3) {
            this.repositionTimer = window.setTimeout(OpenLayers.Function.bind(this.repositionMapElements, this), 250);
            return false;
        }
        var cache = OpenLayers.Layer.Google.cache[this.map.id];
        var container = this.map.viewPortDiv;
        for (var i = div.children.length - 1; i >= 0; --i) {
            if (div.children[i].style.zIndex == 1000001) {
                var termsOfUse = div.children[i];
                container.appendChild(termsOfUse);
                termsOfUse.style.zIndex = "1100";
                termsOfUse.style.bottom = "";
                termsOfUse.className = "olLayerGoogleCopyright olLayerGoogleV3";
                termsOfUse.style.display = "";
                cache.termsOfUse = termsOfUse;
            }
            if (div.children[i].style.zIndex == 1000000) {
                var poweredBy = div.children[i];
                container.appendChild(poweredBy);
                poweredBy.style.zIndex = "1100";
                poweredBy.style.bottom = "";
                poweredBy.className = "olLayerGooglePoweredBy olLayerGoogleV3 gmnoprint";
                poweredBy.style.display = "";
                cache.poweredBy = poweredBy;
            }
            if (div.children[i].style.zIndex == 10000002) {
                container.appendChild(div.children[i]);
            }
        }
        this.setGMapVisibility(this.visibility);
    },
    onMapResize: function () {
        if (this.visibility) {
            google.maps.event.trigger(this.mapObject, "resize");
        } else {
            var cache = OpenLayers.Layer.Google.cache[this.map.id];
            if (!cache.resized) {
                var layer = this;
                google.maps.event.addListenerOnce(this.mapObject, "tilesloaded", function () {
                    google.maps.event.trigger(layer.mapObject, "resize");
                    layer.moveTo(layer.map.getCenter(), layer.map.getZoom());
                    delete cache.resized;
                });
            }
            cache.resized = true;
        }
    },
    setGMapVisibility: function (visible) {
        var cache = OpenLayers.Layer.Google.cache[this.map.id];
        if (cache) {
            var type = this.type;
            var layers = this.map.layers;
            var layer;
            for (var i = layers.length - 1; i >= 0; --i) {
                layer = layers[i];
                if (layer instanceof OpenLayers.Layer.Google && layer.visibility === true && layer.inRange === true) {
                    type = layer.type;
                    visible = true;
                    break;
                }
            }
            var container = this.mapObject.getDiv();
            if (visible === true) {
                this.mapObject.setMapTypeId(type);
                container.style.left = "";
                if (cache.termsOfUse && cache.termsOfUse.style) {
                    cache.termsOfUse.style.left = "";
                    cache.termsOfUse.style.display = "";
                    cache.poweredBy.style.display = "";
                }
                cache.displayed = this.id;
            } else {
                delete cache.displayed;
                container.style.left = "-9999px";
                if (cache.termsOfUse && cache.termsOfUse.style) {
                    cache.termsOfUse.style.display = "none";
                    cache.termsOfUse.style.left = "-9999px";
                    cache.poweredBy.style.display = "none";
                }
            }
        }
    },
    getMapContainer: function () {
        return this.mapObject.getDiv();
    },
    getMapObjectBoundsFromOLBounds: function (olBounds) {
        var moBounds = null;
        if (olBounds != null) {
            var sw = this.sphericalMercator ? this.inverseMercator(olBounds.bottom, olBounds.left) : new OpenLayers.LonLat(olBounds.bottom, olBounds.left);
            var ne = this.sphericalMercator ? this.inverseMercator(olBounds.top, olBounds.right) : new OpenLayers.LonLat(olBounds.top, olBounds.right);
            moBounds = new google.maps.LatLngBounds(new google.maps.LatLng(sw.lat, sw.lon), new google.maps.LatLng(ne.lat, ne.lon));
        }
        return moBounds;
    },
    getMapObjectLonLatFromMapObjectPixel: function (moPixel) {
        var size = this.map.getSize();
        var lon = this.getLongitudeFromMapObjectLonLat(this.mapObject.center);
        var lat = this.getLatitudeFromMapObjectLonLat(this.mapObject.center);
        var res = this.map.getResolution();
        var delta_x = moPixel.x - (size.w / 2);
        var delta_y = moPixel.y - (size.h / 2);
        var lonlat = new OpenLayers.LonLat(lon + delta_x * res, lat - delta_y * res);
        if (this.wrapDateLine) {
            lonlat = lonlat.wrapDateLine(this.maxExtent);
        }
        return this.getMapObjectLonLatFromLonLat(lonlat.lon, lonlat.lat);
    },
    getMapObjectPixelFromMapObjectLonLat: function (moLonLat) {
        var lon = this.getLongitudeFromMapObjectLonLat(moLonLat);
        var lat = this.getLatitudeFromMapObjectLonLat(moLonLat);
        var res = this.map.getResolution();
        var extent = this.map.getExtent();
        return this.getMapObjectPixelFromXY((1 / res * (lon - extent.left)), (1 / res * (extent.top - lat)));
    },
    setMapObjectCenter: function (center, zoom) {
        if (this.animationEnabled === false && zoom != this.mapObject.zoom) {
            var mapContainer = this.getMapContainer();
            google.maps.event.addListenerOnce(this.mapObject, "idle", function () {
                mapContainer.style.visibility = "";
            });
            mapContainer.style.visibility = "hidden";
        }
        this.mapObject.setOptions({
            center: center,
            zoom: zoom
        });
    },
    getMapObjectZoomFromMapObjectBounds: function (moBounds) {
        return this.mapObject.getBoundsZoomLevel(moBounds);
    },
    getMapObjectLonLatFromLonLat: function (lon, lat) {
        var gLatLng;
        if (this.sphericalMercator) {
            var lonlat = this.inverseMercator(lon, lat);
            gLatLng = new google.maps.LatLng(lonlat.lat, lonlat.lon);
        } else {
            gLatLng = new google.maps.LatLng(lat, lon);
        }
        return gLatLng;
    },
    getMapObjectPixelFromXY: function (x, y) {
        return new google.maps.Point(x, y);
    },
    destroy: function () {
        if (this.repositionListener) {
            google.maps.event.removeListener(this.repositionListener);
        }
        if (this.repositionTimer) {
            window.clearTimeout(this.repositionTimer);
        }
        OpenLayers.Layer.Google.prototype.destroy.apply(this, arguments);
    }
};
OpenLayers.Layer.HTTPRequest = OpenLayers.Class(OpenLayers.Layer, {
    URL_HASH_FACTOR: (Math.sqrt(5) - 1) / 2,
    url: null,
    params: null,
    reproject: false,
    initialize: function (name, url, params, options) {
        OpenLayers.Layer.prototype.initialize.apply(this, [name, options]);
        this.url = url;
        if (!this.params) {
            this.params = OpenLayers.Util.extend({}, params);
        }
    },
    destroy: function () {
        this.url = null;
        this.params = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments);
    },
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.HTTPRequest(this.name, this.url, this.params, this.getOptions());
        }
        obj = OpenLayers.Layer.prototype.clone.apply(this, [obj]);
        return obj;
    },
    setUrl: function (newUrl) {
        this.url = newUrl;
    },
    mergeNewParams: function (newParams) {
        this.params = OpenLayers.Util.extend(this.params, newParams);
        var ret = this.redraw();
        if (this.map != null) {
            this.map.events.triggerEvent("changelayer", {
                layer: this,
                property: "params"
            });
        }
        return ret;
    },
    redraw: function (force) {
        if (force) {
            return this.mergeNewParams({
                "_olSalt": Math.random()
            });
        } else {
            return OpenLayers.Layer.prototype.redraw.apply(this, []);
        }
    },
    selectUrl: function (paramString, urls) {
        var product = 1;
        for (var i = 0, len = paramString.length; i < len; i++) {
            product *= paramString.charCodeAt(i) * this.URL_HASH_FACTOR;
            product -= Math.floor(product);
        }
        return urls[Math.floor(product * urls.length)];
    },
    getFullRequestString: function (newParams, altUrl) {
        var url = altUrl || this.url;
        var allParams = OpenLayers.Util.extend({}, this.params);
        allParams = OpenLayers.Util.extend(allParams, newParams);
        var paramsString = OpenLayers.Util.getParameterString(allParams);
        if (OpenLayers.Util.isArray(url)) {
            url = this.selectUrl(paramsString, url);
        }
        var urlParams = OpenLayers.Util.upperCaseObject(OpenLayers.Util.getParameters(url));
        for (var key in allParams) {
            if (key.toUpperCase() in urlParams) {
                delete allParams[key];
            }
        }
        paramsString = OpenLayers.Util.getParameterString(allParams);
        return OpenLayers.Util.urlAppend(url, paramsString);
    },
    CLASS_NAME: "OpenLayers.Layer.HTTPRequest"
});
OpenLayers.Layer.Grid = OpenLayers.Class(OpenLayers.Layer.HTTPRequest, {
    tileSize: null,
    tileOriginCorner: "bl",
    tileOrigin: null,
    tileOptions: null,
    tileClass: OpenLayers.Tile.Image,
    grid: null,
    singleTile: false,
    ratio: 1.5,
    buffer: 0,
    transitionEffect: null,
    numLoadingTiles: 0,
    tileLoadingDelay: 85,
    serverResolutions: null,
    moveTimerId: null,
    deferMoveGriddedTiles: null,
    tileQueueId: null,
    tileQueue: null,
    loading: false,
    backBuffer: null,
    gridResolution: null,
    backBufferResolution: null,
    backBufferLonLat: null,
    backBufferTimerId: null,
    removeBackBufferDelay: null,
    className: null,
    initialize: function (name, url, params, options) {
        OpenLayers.Layer.HTTPRequest.prototype.initialize.apply(this, arguments);
        this.grid = [];
        this.tileQueue = [];
        if (this.removeBackBufferDelay === null) {
            this.removeBackBufferDelay = this.singleTile ? 0 : 2500;
        }
        if (this.className === null) {
            this.className = this.singleTile ? 'olLayerGridSingleTile' : 'olLayerGrid';
        }
        if (!OpenLayers.Animation.isNative) {
            this.deferMoveGriddedTiles = OpenLayers.Function.bind(function () {
                this.moveGriddedTiles(true);
                this.moveTimerId = null;
            }, this);
        }
    },
    setMap: function (map) {
        OpenLayers.Layer.HTTPRequest.prototype.setMap.call(this, map);
        OpenLayers.Element.addClass(this.div, this.className);
    },
    removeMap: function (map) {
        if (this.moveTimerId !== null) {
            window.clearTimeout(this.moveTimerId);
            this.moveTimerId = null;
        }
        this.clearTileQueue();
        if (this.backBufferTimerId !== null) {
            window.clearTimeout(this.backBufferTimerId);
            this.backBufferTimerId = null;
        }
    },
    destroy: function () {
        this.removeBackBuffer();
        this.clearGrid();
        this.grid = null;
        this.tileSize = null;
        OpenLayers.Layer.HTTPRequest.prototype.destroy.apply(this, arguments);
    },
    clearGrid: function () {
        this.clearTileQueue();
        if (this.grid) {
            for (var iRow = 0, len = this.grid.length; iRow < len; iRow++) {
                var row = this.grid[iRow];
                for (var iCol = 0, clen = row.length; iCol < clen; iCol++) {
                    var tile = row[iCol];
                    this.destroyTile(tile);
                }
            }
            this.grid = [];
            this.gridResolution = null;
        }
    },
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.Grid(this.name, this.url, this.params, this.getOptions());
        }
        obj = OpenLayers.Layer.HTTPRequest.prototype.clone.apply(this, [obj]);
        if (this.tileSize != null) {
            obj.tileSize = this.tileSize.clone();
        }
        obj.grid = [];
        obj.gridResolution = null;
        obj.backBuffer = null;
        obj.backBufferTimerId = null;
        obj.tileQueue = [];
        obj.tileQueueId = null;
        obj.loading = false;
        obj.moveTimerId = null;
        return obj;
    },
    moveTo: function (bounds, zoomChanged, dragging) {
        OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this, arguments);
        bounds = bounds || this.map.getExtent();
        if (bounds != null) {
            var forceReTile = !this.grid.length || zoomChanged;
            var tilesBounds = this.getTilesBounds();
            var resolution = this.map.getResolution();
            var serverResolution = this.getServerResolution(resolution);
            if (this.singleTile) {
                if (forceReTile || (!dragging && !tilesBounds.containsBounds(bounds))) {
                    if (zoomChanged && this.transitionEffect !== 'resize') {
                        this.removeBackBuffer();
                    }
                    if (!zoomChanged || this.transitionEffect === 'resize') {
                        this.applyBackBuffer(serverResolution);
                    }
                    this.initSingleTile(bounds);
                }
            } else {
                forceReTile = forceReTile || !tilesBounds.intersectsBounds(bounds, {
                    worldBounds: this.map.baseLayer.wrapDateLine && this.map.getMaxExtent()
                });
                if (resolution !== serverResolution) {
                    bounds = this.map.calculateBounds(null, serverResolution);
                    if (forceReTile) {
                        var scale = serverResolution / resolution;
                        this.transformDiv(scale);
                    }
                } else {
                    this.div.style.width = '100%';
                    this.div.style.height = '100%';
                    this.div.style.left = '0%';
                    this.div.style.top = '0%';
                }
                if (forceReTile) {
                    if (zoomChanged && this.transitionEffect === 'resize') {
                        this.applyBackBuffer(serverResolution);
                    }
                    this.initGriddedTiles(bounds);
                } else {
                    this.moveGriddedTiles();
                }
            }
        }
    },
    getTileData: function (loc) {
        var data = null,
            x = loc.lon,
            y = loc.lat,
            numRows = this.grid.length;
        if (this.map && numRows) {
            var res = this.map.getResolution(),
                tileWidth = this.tileSize.w,
                tileHeight = this.tileSize.h,
                bounds = this.grid[0][0].bounds,
                left = bounds.left,
                top = bounds.top;
            if (x < left) {
                if (this.map.baseLayer.wrapDateLine) {
                    var worldWidth = this.map.getMaxExtent().getWidth();
                    var worldsAway = Math.ceil((left - x) / worldWidth);
                    x += worldWidth * worldsAway;
                }
            }
            var dtx = (x - left) / (res * tileWidth);
            var dty = (top - y) / (res * tileHeight);
            var col = Math.floor(dtx);
            var row = Math.floor(dty);
            if (row >= 0 && row < numRows) {
                var tile = this.grid[row][col];
                if (tile) {
                    data = {
                        tile: tile,
                        i: Math.floor((dtx - col) * tileWidth),
                        j: Math.floor((dty - row) * tileHeight)
                    };
                }
            }
        }
        return data;
    },
    queueTileDraw: function (evt) {
        var tile = evt.object;
        if (!~OpenLayers.Util.indexOf(this.tileQueue, tile)) {
            this.tileQueue.push(tile);
        }
        if (!this.tileQueueId) {
            this.tileQueueId = OpenLayers.Animation.start(OpenLayers.Function.bind(this.drawTileFromQueue, this), null, this.div);
        }
        return false;
    },
    drawTileFromQueue: function () {
        if (this.tileQueue.length === 0) {
            this.clearTileQueue();
        } else {
            this.tileQueue.shift().draw(true);
        }
    },
    clearTileQueue: function () {
        OpenLayers.Animation.stop(this.tileQueueId);
        this.tileQueueId = null;
        this.tileQueue = [];
    },
    destroyTile: function (tile) {
        this.removeTileMonitoringHooks(tile);
        tile.destroy();
    },
    getServerResolution: function (resolution) {
        resolution = resolution || this.map.getResolution();
        if (this.serverResolutions && OpenLayers.Util.indexOf(this.serverResolutions, resolution) === -1) {
            var i, serverResolution;
            for (i = this.serverResolutions.length - 1; i >= 0; i--) {
                serverResolution = this.serverResolutions[i];
                if (serverResolution > resolution) {
                    resolution = serverResolution;
                    break;
                }
            }
            if (i === -1) {
                throw 'no appropriate resolution in serverResolutions';
            }
        }
        return resolution;
    },
    getServerZoom: function () {
        var resolution = this.getServerResolution();
        return this.serverResolutions ? OpenLayers.Util.indexOf(this.serverResolutions, resolution) : this.map.getZoomForResolution(resolution) + (this.zoomOffset || 0);
    },
    transformDiv: function (scale) {
        this.div.style.width = 100 * scale + '%';
        this.div.style.height = 100 * scale + '%';
        var size = this.map.getSize();
        var lcX = parseInt(this.map.layerContainerDiv.style.left, 10);
        var lcY = parseInt(this.map.layerContainerDiv.style.top, 10);
        var x = (lcX - (size.w / 2.0)) * (scale - 1);
        var y = (lcY - (size.h / 2.0)) * (scale - 1);
        this.div.style.left = x + '%';
        this.div.style.top = y + '%';
    },
    getResolutionScale: function () {
        return parseInt(this.div.style.width, 10) / 100;
    },
    applyBackBuffer: function (resolution) {
        if (this.backBufferTimerId !== null) {
            this.removeBackBuffer();
        }
        var backBuffer = this.backBuffer;
        if (!backBuffer) {
            backBuffer = this.createBackBuffer();
            if (!backBuffer) {
                return;
            }
            this.div.insertBefore(backBuffer, this.div.firstChild);
            this.backBuffer = backBuffer;
            var topLeftTileBounds = this.grid[0][0].bounds;
            this.backBufferLonLat = {
                lon: topLeftTileBounds.left,
                lat: topLeftTileBounds.top
            };
            this.backBufferResolution = this.gridResolution;
        }
        var style = backBuffer.style;
        var ratio = this.backBufferResolution / resolution;
        style.width = 100 * ratio + '%';
        style.height = 100 * ratio + '%';
        var position = this.getViewPortPxFromLonLat(this.backBufferLonLat, resolution);
        var leftOffset = parseInt(this.map.layerContainerDiv.style.left, 10);
        var topOffset = parseInt(this.map.layerContainerDiv.style.top, 10);
        backBuffer.style.left = Math.round(position.x - leftOffset) + '%';
        backBuffer.style.top = Math.round(position.y - topOffset) + '%';
    },
    createBackBuffer: function () {
        var backBuffer;
        if (this.grid.length > 0) {
            backBuffer = document.createElement('div');
            backBuffer.id = this.div.id + '_bb';
            backBuffer.className = 'olBackBuffer';
            backBuffer.style.position = 'absolute';
            backBuffer.style.width = '100%';
            backBuffer.style.height = '100%';
            for (var i = 0, lenI = this.grid.length; i < lenI; i++) {
                for (var j = 0, lenJ = this.grid[i].length; j < lenJ; j++) {
                    var tile = this.grid[i][j].createBackBuffer();
                    if (!tile) {
                        continue;
                    }
                    tile.style.top = (i * this.tileSize.h) + '%';
                    tile.style.left = (j * this.tileSize.w) + '%';
                    backBuffer.appendChild(tile);
                }
            }
        }
        return backBuffer;
    },
    removeBackBuffer: function () {
        if (this.backBuffer) {
            this.div.removeChild(this.backBuffer);
            this.backBuffer = null;
            this.backBufferResolution = null;
            if (this.backBufferTimerId !== null) {
                window.clearTimeout(this.backBufferTimerId);
                this.backBufferTimerId = null;
            }
        }
    },
    moveByPx: function (dx, dy) {
        if (!this.singleTile) {
            this.moveGriddedTiles();
        }
    },
    setTileSize: function (size) {
        if (this.singleTile) {
            size = this.map.getSize();
            size.h = parseInt(size.h * this.ratio);
            size.w = parseInt(size.w * this.ratio);
        }
        OpenLayers.Layer.HTTPRequest.prototype.setTileSize.apply(this, [size]);
    },
    getTilesBounds: function () {
        var bounds = null;
        var length = this.grid.length;
        if (length) {
            var bottomLeftTileBounds = this.grid[length - 1][0].bounds,
                width = this.grid[0].length * bottomLeftTileBounds.getWidth(),
                height = this.grid.length * bottomLeftTileBounds.getHeight();
            bounds = new OpenLayers.Bounds(bottomLeftTileBounds.left, bottomLeftTileBounds.bottom, bottomLeftTileBounds.left + width, bottomLeftTileBounds.bottom + height);
        }
        return bounds;
    },
    initSingleTile: function (bounds) {
        this.clearTileQueue();
        var center = bounds.getCenterLonLat();
        var tileWidth = bounds.getWidth() * this.ratio;
        var tileHeight = bounds.getHeight() * this.ratio;
        var tileBounds = new OpenLayers.Bounds(center.lon - (tileWidth / 2), center.lat - (tileHeight / 2), center.lon + (tileWidth / 2), center.lat + (tileHeight / 2));
        var px = this.map.getLayerPxFromLonLat({
            lon: tileBounds.left,
            lat: tileBounds.top
        });
        if (!this.grid.length) {
            this.grid[0] = [];
        }
        var tile = this.grid[0][0];
        if (!tile) {
            tile = this.addTile(tileBounds, px);
            this.addTileMonitoringHooks(tile);
            tile.draw();
            this.grid[0][0] = tile;
        } else {
            tile.moveTo(tileBounds, px);
        }
        this.removeExcessTiles(1, 1);
        this.gridResolution = this.getServerResolution();
    },
    calculateGridLayout: function (bounds, origin, resolution) {
        var tilelon = resolution * this.tileSize.w;
        var tilelat = resolution * this.tileSize.h;
        var offsetlon = bounds.left - origin.lon;
        var tilecol = Math.floor(offsetlon / tilelon) - this.buffer;
        var tilecolremain = offsetlon / tilelon - tilecol;
        var tileoffsetx = -tilecolremain * this.tileSize.w;
        var tileoffsetlon = origin.lon + tilecol * tilelon;
        var offsetlat = bounds.top - (origin.lat + tilelat);
        var tilerow = Math.ceil(offsetlat / tilelat) + this.buffer;
        var tilerowremain = tilerow - offsetlat / tilelat;
        var tileoffsety = -tilerowremain * this.tileSize.h;
        var tileoffsetlat = origin.lat + tilerow * tilelat;
        return {
            tilelon: tilelon,
            tilelat: tilelat,
            tileoffsetlon: tileoffsetlon,
            tileoffsetlat: tileoffsetlat,
            tileoffsetx: tileoffsetx,
            tileoffsety: tileoffsety
        };
    },
    getTileOrigin: function () {
        var origin = this.tileOrigin;
        if (!origin) {
            var extent = this.getMaxExtent();
            var edges = ({
                "tl": ["left", "top"],
                "tr": ["right", "top"],
                "bl": ["left", "bottom"],
                "br": ["right", "bottom"]
            })[this.tileOriginCorner];
            origin = new OpenLayers.LonLat(extent[edges[0]], extent[edges[1]]);
        }
        return origin;
    },
    initGriddedTiles: function (bounds) {
        this.clearTileQueue();
        var viewSize = this.map.getSize();
        var minRows = Math.ceil(viewSize.h / this.tileSize.h) +
            Math.max(1, 2 * this.buffer);
        var minCols = Math.ceil(viewSize.w / this.tileSize.w) +
            Math.max(1, 2 * this.buffer);
        var origin = this.getTileOrigin();
        var resolution = this.getServerResolution();
        var tileLayout = this.calculateGridLayout(bounds, origin, resolution);
        var tileoffsetx = Math.round(tileLayout.tileoffsetx);
        var tileoffsety = Math.round(tileLayout.tileoffsety);
        var tileoffsetlon = tileLayout.tileoffsetlon;
        var tileoffsetlat = tileLayout.tileoffsetlat;
        var tilelon = tileLayout.tilelon;
        var tilelat = tileLayout.tilelat;
        var startX = tileoffsetx;
        var startLon = tileoffsetlon;
        var rowidx = 0;
        var layerContainerDivLeft = parseInt(this.map.layerContainerDiv.style.left);
        var layerContainerDivTop = parseInt(this.map.layerContainerDiv.style.top);
        var tileData = [],
            center = this.map.getCenter();
        do {
            var row = this.grid[rowidx++];
            if (!row) {
                row = [];
                this.grid.push(row);
            }
            tileoffsetlon = startLon;
            tileoffsetx = startX;
            var colidx = 0;
            do {
                var tileBounds = new OpenLayers.Bounds(tileoffsetlon, tileoffsetlat, tileoffsetlon + tilelon, tileoffsetlat + tilelat);
                var x = tileoffsetx;
                x -= layerContainerDivLeft;
                var y = tileoffsety;
                y -= layerContainerDivTop;
                var px = new OpenLayers.Pixel(x, y);
                var tile = row[colidx++];
                if (!tile) {
                    tile = this.addTile(tileBounds, px);
                    this.addTileMonitoringHooks(tile);
                    row.push(tile);
                } else {
                    tile.moveTo(tileBounds, px, false);
                }
                var tileCenter = tileBounds.getCenterLonLat();
                tileData.push({
                    tile: tile,
                    distance: Math.pow(tileCenter.lon - center.lon, 2) + Math.pow(tileCenter.lat - center.lat, 2)
                });
                tileoffsetlon += tilelon;
                tileoffsetx += this.tileSize.w;
            } while ((tileoffsetlon <= bounds.right + tilelon * this.buffer) || colidx < minCols);
            tileoffsetlat -= tilelat;
            tileoffsety += this.tileSize.h;
        } while ((tileoffsetlat >= bounds.bottom - tilelat * this.buffer) || rowidx < minRows);
        this.removeExcessTiles(rowidx, colidx);
        this.gridResolution = this.getServerResolution();
        tileData.sort(function (a, b) {
            return a.distance - b.distance;
        });
        for (var i = 0, ii = tileData.length; i < ii; ++i) {
            tileData[i].tile.draw();
        }
    },
    getMaxExtent: function () {
        return this.maxExtent;
    },
    addTile: function (bounds, position) {
        var tile = new this.tileClass(this, position, bounds, null, this.tileSize, this.tileOptions);
        tile.events.register("beforedraw", this, this.queueTileDraw);
        return tile;
    },
    addTileMonitoringHooks: function (tile) {
        tile.onLoadStart = function () {
            if (this.loading === false) {
                this.loading = true;
                this.events.triggerEvent("loadstart");
            }
            this.events.triggerEvent("tileloadstart", {
                tile: tile
            });
            this.numLoadingTiles++;
        };
        tile.onLoadEnd = function () {
            this.numLoadingTiles--;
            this.events.triggerEvent("tileloaded", {
                tile: tile
            });
            if (this.tileQueue.length === 0 && this.numLoadingTiles === 0) {
                this.loading = false;
                this.events.triggerEvent("loadend");
                if (this.backBuffer) {
                    this.backBufferTimerId = window.setTimeout(OpenLayers.Function.bind(this.removeBackBuffer, this), this.removeBackBufferDelay);
                }
            }
        };
        tile.onLoadError = function () {
            this.events.triggerEvent("tileerror", {
                tile: tile
            });
        };
        tile.events.on({
            "loadstart": tile.onLoadStart,
            "loadend": tile.onLoadEnd,
            "unload": tile.onLoadEnd,
            "loaderror": tile.onLoadError,
            scope: this
        });
    },
    removeTileMonitoringHooks: function (tile) {
        tile.unload();
        tile.events.un({
            "loadstart": tile.onLoadStart,
            "loadend": tile.onLoadEnd,
            "unload": tile.onLoadEnd,
            "loaderror": tile.onLoadError,
            scope: this
        });
    },
    moveGriddedTiles: function (deferred) {
        if (!deferred && !OpenLayers.Animation.isNative) {
            if (this.moveTimerId != null) {
                window.clearTimeout(this.moveTimerId);
            }
            this.moveTimerId = window.setTimeout(this.deferMoveGriddedTiles, this.tileLoadingDelay);
            return;
        }
        var buffer = this.buffer || 1;
        var scale = this.getResolutionScale();
        while (true) {
            var tlViewPort = {
                x: (this.grid[0][0].position.x * scale) + parseInt(this.div.style.left, 10) + parseInt(this.map.layerContainerDiv.style.left),
                y: (this.grid[0][0].position.y * scale) + parseInt(this.div.style.top, 10) + parseInt(this.map.layerContainerDiv.style.top)
            };
            var tileSize = {
                w: this.tileSize.w * scale,
                h: this.tileSize.h * scale
            };
            if (tlViewPort.x > -tileSize.w * (buffer - 1)) {
                this.shiftColumn(true);
            } else if (tlViewPort.x < -tileSize.w * buffer) {
                this.shiftColumn(false);
            } else if (tlViewPort.y > -tileSize.h * (buffer - 1)) {
                this.shiftRow(true);
            } else if (tlViewPort.y < -tileSize.h * buffer) {
                this.shiftRow(false);
            } else {
                break;
            }
        }
    },
    shiftRow: function (prepend) {
        var modelRowIndex = (prepend) ? 0 : (this.grid.length - 1);
        var grid = this.grid;
        var modelRow = grid[modelRowIndex];
        var resolution = this.getServerResolution();
        var deltaY = (prepend) ? -this.tileSize.h : this.tileSize.h;
        var deltaLat = resolution * -deltaY;
        var row = (prepend) ? grid.pop() : grid.shift();
        for (var i = 0, len = modelRow.length; i < len; i++) {
            var modelTile = modelRow[i];
            var bounds = modelTile.bounds.clone();
            var position = modelTile.position.clone();
            bounds.bottom = bounds.bottom + deltaLat;
            bounds.top = bounds.top + deltaLat;
            position.y = position.y + deltaY;
            row[i].moveTo(bounds, position);
        }
        if (prepend) {
            grid.unshift(row);
        } else {
            grid.push(row);
        }
    },
    shiftColumn: function (prepend) {
        var deltaX = (prepend) ? -this.tileSize.w : this.tileSize.w;
        var resolution = this.getServerResolution();
        var deltaLon = resolution * deltaX;
        for (var i = 0, len = this.grid.length; i < len; i++) {
            var row = this.grid[i];
            var modelTileIndex = (prepend) ? 0 : (row.length - 1);
            var modelTile = row[modelTileIndex];
            var bounds = modelTile.bounds.clone();
            var position = modelTile.position.clone();
            bounds.left = bounds.left + deltaLon;
            bounds.right = bounds.right + deltaLon;
            position.x = position.x + deltaX;
            var tile = prepend ? this.grid[i].pop() : this.grid[i].shift();
            tile.moveTo(bounds, position);
            if (prepend) {
                row.unshift(tile);
            } else {
                row.push(tile);
            }
        }
    },
    removeExcessTiles: function (rows, columns) {
        var i, l;
        while (this.grid.length > rows) {
            var row = this.grid.pop();
            for (i = 0, l = row.length; i < l; i++) {
                var tile = row[i];
                this.destroyTile(tile);
            }
        }
        for (i = 0, l = this.grid.length; i < l; i++) {
            while (this.grid[i].length > columns) {
                var row = this.grid[i];
                var tile = row.pop();
                this.destroyTile(tile);
            }
        }
    },
    onMapResize: function () {
        if (this.singleTile) {
            this.clearGrid();
            this.setTileSize();
        }
    },
    getTileBounds: function (viewPortPx) {
        var maxExtent = this.maxExtent;
        var resolution = this.getResolution();
        var tileMapWidth = resolution * this.tileSize.w;
        var tileMapHeight = resolution * this.tileSize.h;
        var mapPoint = this.getLonLatFromViewPortPx(viewPortPx);
        var tileLeft = maxExtent.left + (tileMapWidth * Math.floor((mapPoint.lon -
            maxExtent.left) / tileMapWidth));
        var tileBottom = maxExtent.bottom + (tileMapHeight * Math.floor((mapPoint.lat -
            maxExtent.bottom) / tileMapHeight));
        return new OpenLayers.Bounds(tileLeft, tileBottom, tileLeft + tileMapWidth, tileBottom + tileMapHeight);
    },
    CLASS_NAME: "OpenLayers.Layer.Grid"
});
OpenLayers.Layer.Markers = OpenLayers.Class(OpenLayers.Layer, {
    isBaseLayer: false,
    markers: null,
    drawn: false,
    initialize: function (name, options) {
        OpenLayers.Layer.prototype.initialize.apply(this, arguments);
        this.markers = [];
    },
    destroy: function () {
        this.clearMarkers();
        this.markers = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments);
    },
    setOpacity: function (opacity) {
        if (opacity != this.opacity) {
            this.opacity = opacity;
            for (var i = 0, len = this.markers.length; i < len; i++) {
                this.markers[i].setOpacity(this.opacity);
            }
        }
    },
    moveTo: function (bounds, zoomChanged, dragging) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);
        if (zoomChanged || !this.drawn) {
            for (var i = 0, len = this.markers.length; i < len; i++) {
                this.drawMarker(this.markers[i]);
            }
            this.drawn = true;
        }
    },
    addMarker: function (marker) {
        this.markers.push(marker);
        if (this.opacity < 1) {
            marker.setOpacity(this.opacity);
        }
        if (this.map && this.map.getExtent()) {
            marker.map = this.map;
            this.drawMarker(marker);
        }
    },
    removeMarker: function (marker) {
        if (this.markers && this.markers.length) {
            OpenLayers.Util.removeItem(this.markers, marker);
            marker.erase();
        }
    },
    clearMarkers: function () {
        if (this.markers != null) {
            while (this.markers.length > 0) {
                this.removeMarker(this.markers[0]);
            }
        }
    },
    drawMarker: function (marker) {
        var px = this.map.getLayerPxFromLonLat(marker.lonlat);
        if (px == null) {
            marker.display(false);
        } else {
            if (!marker.isDrawn()) {
                var markerImg = marker.draw(px);
                this.div.appendChild(markerImg);
            } else if (marker.icon) {
                marker.icon.moveTo(px);
            }
        }
    },
    getDataExtent: function () {
        var maxExtent = null;
        if (this.markers && (this.markers.length > 0)) {
            var maxExtent = new OpenLayers.Bounds();
            for (var i = 0, len = this.markers.length; i < len; i++) {
                var marker = this.markers[i];
                maxExtent.extend(marker.lonlat);
            }
        }
        return maxExtent;
    },
    CLASS_NAME: "OpenLayers.Layer.Markers"
});
OpenLayers.Layer.WMS = OpenLayers.Class(OpenLayers.Layer.Grid, {
    DEFAULT_PARAMS: {
        service: "WMS",
        version: "1.1.1",
        request: "GetMap",
        styles: "",
        format: "image/jpeg"
    },
    isBaseLayer: true,
    encodeBBOX: false,
    noMagic: false,
    yx: {},
    initialize: function (name, url, params, options) {
        var newArguments = [];
        params = OpenLayers.Util.upperCaseObject(params);
        if (parseFloat(params.VERSION) >= 1.3 && !params.EXCEPTIONS) {
            params.EXCEPTIONS = "INIMAGE";
        }
        newArguments.push(name, url, params, options);
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);
        OpenLayers.Util.applyDefaults(this.params, OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS));
        if (!this.noMagic && this.params.TRANSPARENT && this.params.TRANSPARENT.toString().toLowerCase() == "true") {
            if ((options == null) || (!options.isBaseLayer)) {
                this.isBaseLayer = false;
            }
            if (this.params.FORMAT == "image/jpeg") {
                this.params.FORMAT = OpenLayers.Util.alphaHack() ? "image/gif" : "image/png";
            }
        }
    },
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.WMS(this.name, this.url, this.params, this.getOptions());
        }
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);
        return obj;
    },
    reverseAxisOrder: function () {
        var projCode = this.projection.getCode();
        return parseFloat(this.params.VERSION) >= 1.3 && !! (this.yx[projCode] || OpenLayers.Projection.defaults[projCode].yx);
    },
    getURL: function (bounds) {
        bounds = this.adjustBounds(bounds);
        var imageSize = this.getImageSize();
        var newParams = {};
        var reverseAxisOrder = this.reverseAxisOrder();
        newParams.BBOX = this.encodeBBOX ? bounds.toBBOX(null, reverseAxisOrder) : bounds.toArray(reverseAxisOrder);
        newParams.WIDTH = imageSize.w;
        newParams.HEIGHT = imageSize.h;
        var requestString = this.getFullRequestString(newParams);
        return requestString;
    },
    mergeNewParams: function (newParams) {
        var upperParams = OpenLayers.Util.upperCaseObject(newParams);
        var newArguments = [upperParams];
        return OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this, newArguments);
    },
    getFullRequestString: function (newParams, altUrl) {
        var mapProjection = this.map.getProjectionObject();
        var projectionCode = this.projection && this.projection.equals(mapProjection) ? this.projection.getCode() : mapProjection.getCode();
        var value = (projectionCode == "none") ? null : projectionCode;
        if (parseFloat(this.params.VERSION) >= 1.3) {
            this.params.CRS = value;
        } else {
            this.params.SRS = value;
        }
        if (typeof this.params.TRANSPARENT == "boolean") {
            newParams.TRANSPARENT = this.params.TRANSPARENT ? "TRUE" : "FALSE";
        }
        return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this, arguments);
    },
    CLASS_NAME: "OpenLayers.Layer.WMS"
});
OpenLayers.Layer.WMTS = OpenLayers.Class(OpenLayers.Layer.Grid, {
    isBaseLayer: true,
    version: "1.0.0",
    requestEncoding: "KVP",
    url: null,
    layer: null,
    matrixSet: null,
    style: null,
    format: "image/jpeg",
    tileOrigin: null,
    tileFullExtent: null,
    formatSuffix: null,
    matrixIds: null,
    dimensions: null,
    params: null,
    zoomOffset: 0,
    serverResolutions: null,
    formatSuffixMap: {
        "image/png": "png",
        "image/png8": "png",
        "image/png24": "png",
        "image/png32": "png",
        "png": "png",
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "jpeg": "jpg",
        "jpg": "jpg"
    },
    matrix: null,
    initialize: function (config) {
        var required = {
            url: true,
            layer: true,
            style: true,
            matrixSet: true
        };
        for (var prop in required) {
            if (!(prop in config)) {
                throw new Error("Missing property '" + prop + "' in layer configuration.");
            }
        }
        config.params = OpenLayers.Util.upperCaseObject(config.params);
        var args = [config.name, config.url, config.params, config];
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, args);
        if (!this.formatSuffix) {
            this.formatSuffix = this.formatSuffixMap[this.format] || this.format.split("/").pop();
        }
        if (this.matrixIds) {
            var len = this.matrixIds.length;
            if (len && typeof this.matrixIds[0] === "string") {
                var ids = this.matrixIds;
                this.matrixIds = new Array(len);
                for (var i = 0; i < len; ++i) {
                    this.matrixIds[i] = {
                        identifier: ids[i]
                    };
                }
            }
        }
    },
    setMap: function () {
        OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
        this.updateMatrixProperties();
    },
    updateMatrixProperties: function () {
        this.matrix = this.getMatrix();
        if (this.matrix) {
            if (this.matrix.topLeftCorner) {
                this.tileOrigin = this.matrix.topLeftCorner;
            }
            if (this.matrix.tileWidth && this.matrix.tileHeight) {
                this.tileSize = new OpenLayers.Size(this.matrix.tileWidth, this.matrix.tileHeight);
            }
            if (!this.tileOrigin) {
                this.tileOrigin = new OpenLayers.LonLat(this.maxExtent.left, this.maxExtent.top);
            }
            if (!this.tileFullExtent) {
                this.tileFullExtent = this.maxExtent;
            }
        }
    },
    moveTo: function (bounds, zoomChanged, dragging) {
        if (zoomChanged || !this.matrix) {
            this.updateMatrixProperties();
        }
        return OpenLayers.Layer.Grid.prototype.moveTo.apply(this, arguments);
    },
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.WMTS(this.options);
        }
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);
        return obj;
    },
    getIdentifier: function () {
        return this.getServerZoom();
    },
    getMatrix: function () {
        var matrix;
        if (!this.matrixIds || this.matrixIds.length === 0) {
            matrix = {
                identifier: this.getIdentifier()
            };
        } else {
            if ("scaleDenominator" in this.matrixIds[0]) {
                var denom = OpenLayers.METERS_PER_INCH * OpenLayers.INCHES_PER_UNIT[this.units] * this.getServerResolution() / 0.28E-3;
                var diff = Number.POSITIVE_INFINITY;
                var delta;
                for (var i = 0, ii = this.matrixIds.length; i < ii; ++i) {
                    delta = Math.abs(1 - (this.matrixIds[i].scaleDenominator / denom));
                    if (delta < diff) {
                        diff = delta;
                        matrix = this.matrixIds[i];
                    }
                }
            } else {
                matrix = this.matrixIds[this.getIdentifier()];
            }
        }
        return matrix;
    },
    getTileInfo: function (loc) {
        var res = this.getServerResolution();
        var fx = (loc.lon - this.tileOrigin.lon) / (res * this.tileSize.w);
        var fy = (this.tileOrigin.lat - loc.lat) / (res * this.tileSize.h);
        var col = Math.floor(fx);
        var row = Math.floor(fy);
        return {
            col: col,
            row: row,
            i: Math.floor((fx - col) * this.tileSize.w),
            j: Math.floor((fy - row) * this.tileSize.h)
        };
    },
    getURL: function (bounds) {
        bounds = this.adjustBounds(bounds);
        var url = "";
        if (!this.tileFullExtent || this.tileFullExtent.intersectsBounds(bounds)) {
            var center = bounds.getCenterLonLat();
            var info = this.getTileInfo(center);
            var matrixId = this.matrix.identifier;
            var dimensions = this.dimensions,
                params;
            if (this.requestEncoding.toUpperCase() === "REST") {
                params = this.params;
                if (typeof this.url === "string" && this.url.indexOf("{") !== -1) {
                    var template = this.url.replace(/\{/g, "${");
                    var context = {
                        style: this.style,
                        Style: this.style,
                        TileMatrixSet: this.matrixSet,
                        TileMatrix: this.matrix.identifier,
                        TileRow: info.row,
                        TileCol: info.col
                    };
                    if (dimensions) {
                        var dimension, i;
                        for (i = dimensions.length - 1; i >= 0; --i) {
                            dimension = dimensions[i];
                            context[dimension] = params[dimension.toUpperCase()];
                        }
                    }
                    url = OpenLayers.String.format(template, context);
                } else {
                    var path = this.version + "/" + this.layer + "/" + this.style + "/";
                    if (dimensions) {
                        for (var i = 0; i < dimensions.length; i++) {
                            if (params[dimensions[i]]) {
                                path = path + params[dimensions[i]] + "/";
                            }
                        }
                    }
                    path = path + this.matrixSet + "/" + this.matrix.identifier + "/" + info.row + "/" + info.col + "." + this.formatSuffix;
                    if (OpenLayers.Util.isArray(this.url)) {
                        url = this.selectUrl(path, this.url);
                    } else {
                        url = this.url;
                    }
                    if (!url.match(/\/$/)) {
                        url = url + "/";
                    }
                    url = url + path;
                }
            } else if (this.requestEncoding.toUpperCase() === "KVP") {
                params = {
                    SERVICE: "WMTS",
                    REQUEST: "GetTile",
                    VERSION: this.version,
                    LAYER: this.layer,
                    STYLE: this.style,
                    TILEMATRIXSET: this.matrixSet,
                    TILEMATRIX: this.matrix.identifier,
                    TILEROW: info.row,
                    TILECOL: info.col,
                    FORMAT: this.format
                };
                url = OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this, [params]);
            }
        }
        return url;
    },
    mergeNewParams: function (newParams) {
        if (this.requestEncoding.toUpperCase() === "KVP") {
            return OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this, [OpenLayers.Util.upperCaseObject(newParams)]);
        }
    },
    CLASS_NAME: "OpenLayers.Layer.WMTS"
});
OpenLayers.Layer.XYZ = OpenLayers.Class(OpenLayers.Layer.Grid, {
    isBaseLayer: true,
    sphericalMercator: false,
    zoomOffset: 0,
    serverResolutions: null,
    initialize: function (name, url, options) {
        if (options && options.sphericalMercator || this.sphericalMercator) {
            options = OpenLayers.Util.extend({
                projection: "EPSG:900913",
                numZoomLevels: 19
            }, options);
        }
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, [name || this.name, url || this.url, {},
            options
        ]);
    },
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.XYZ(this.name, this.url, this.getOptions());
        }
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);
        return obj;
    },
    getURL: function (bounds) {
        var xyz = this.getXYZ(bounds);
        var url = this.url;
        if (OpenLayers.Util.isArray(url)) {
            var s = '' + xyz.x + xyz.y + xyz.z;
            url = this.selectUrl(s, url);
        }
        return OpenLayers.String.format(url, xyz);
    },
    getXYZ: function (bounds) {
        var res = this.getServerResolution();
        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
        var z = this.getServerZoom();
        if (this.wrapDateLine) {
            var limit = Math.pow(2, z);
            x = ((x % limit) + limit) % limit;
        }
        return {
            'x': x,
            'y': y,
            'z': z
        };
    },
    setMap: function (map) {
        OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
        if (!this.tileOrigin) {
            this.tileOrigin = new OpenLayers.LonLat(this.maxExtent.left, this.maxExtent.bottom);
        }
    },
    CLASS_NAME: "OpenLayers.Layer.XYZ"
});
OpenLayers.Layer.OSM = OpenLayers.Class(OpenLayers.Layer.XYZ, {
    name: "OpenStreetMap",
    url: ['http://a.tile.openstreetmap.org/${z}/${x}/${y}.png', 'http://b.tile.openstreetmap.org/${z}/${x}/${y}.png', 'http://c.tile.openstreetmap.org/${z}/${x}/${y}.png'],
    attribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
    sphericalMercator: true,
    wrapDateLine: true,
    tileOptions: null,
    initialize: function (name, url, options) {
        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, arguments);
        this.tileOptions = OpenLayers.Util.extend({
            crossOriginKeyword: 'anonymous'
        }, this.options && this.options.tileOptions);
    },
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.OSM(this.name, this.url, this.getOptions());
        }
        obj = OpenLayers.Layer.XYZ.prototype.clone.apply(this, [obj]);
        return obj;
    },
    CLASS_NAME: "OpenLayers.Layer.OSM"
});
OpenLayers.Feature = OpenLayers.Class({
    layer: null,
    id: null,
    lonlat: null,
    data: null,
    marker: null,
    popupClass: null,
    popup: null,
    initialize: function (layer, lonlat, data) {
        this.layer = layer;
        this.lonlat = lonlat;
        this.data = (data != null) ? data : {};
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },
    destroy: function () {
        if ((this.layer != null) && (this.layer.map != null)) {
            if (this.popup != null) {
                this.layer.map.removePopup(this.popup);
            }
        }
        if (this.layer != null && this.marker != null) {
            this.layer.removeMarker(this.marker);
        }
        this.layer = null;
        this.id = null;
        this.lonlat = null;
        this.data = null;
        if (this.marker != null) {
            this.destroyMarker(this.marker);
            this.marker = null;
        }
        if (this.popup != null) {
            this.destroyPopup(this.popup);
            this.popup = null;
        }
    },
    onScreen: function () {
        var onScreen = false;
        if ((this.layer != null) && (this.layer.map != null)) {
            var screenBounds = this.layer.map.getExtent();
            onScreen = screenBounds.containsLonLat(this.lonlat);
        }
        return onScreen;
    },
    createMarker: function () {
        if (this.lonlat != null) {
            this.marker = new OpenLayers.Marker(this.lonlat, this.data.icon);
        }
        return this.marker;
    },
    destroyMarker: function () {
        this.marker.destroy();
    },
    createPopup: function (closeBox) {
        if (this.lonlat != null) {
            if (!this.popup) {
                var anchor = (this.marker) ? this.marker.icon : null;
                var popupClass = this.popupClass ? this.popupClass : OpenLayers.Popup.Anchored;
                this.popup = new popupClass(this.id + "_popup", this.lonlat, this.data.popupSize, this.data.popupContentHTML, anchor, closeBox);
            }
            if (this.data.overflow != null) {
                this.popup.contentDiv.style.overflow = this.data.overflow;
            }
            this.popup.feature = this;
        }
        return this.popup;
    },
    destroyPopup: function () {
        if (this.popup) {
            this.popup.feature = null;
            this.popup.destroy();
            this.popup = null;
        }
    },
    CLASS_NAME: "OpenLayers.Feature"
});
OpenLayers.State = {
    UNKNOWN: 'Unknown',
    INSERT: 'Insert',
    UPDATE: 'Update',
    DELETE: 'Delete'
};
OpenLayers.Feature.Vector = OpenLayers.Class(OpenLayers.Feature, {
    fid: null,
    geometry: null,
    attributes: null,
    bounds: null,
    state: null,
    style: null,
    url: null,
    renderIntent: "default",
    modified: null,
    initialize: function (geometry, attributes, style) {
        OpenLayers.Feature.prototype.initialize.apply(this, [null, null, attributes]);
        this.lonlat = null;
        this.geometry = geometry ? geometry : null;
        this.state = null;
        this.attributes = {};
        if (attributes) {
            this.attributes = OpenLayers.Util.extend(this.attributes, attributes);
        }
        this.style = style ? style : null;
    },
    destroy: function () {
        if (this.layer) {
            this.layer.removeFeatures(this);
            this.layer = null;
        }
        this.geometry = null;
        this.modified = null;
        OpenLayers.Feature.prototype.destroy.apply(this, arguments);
    },
    clone: function () {
        return new OpenLayers.Feature.Vector(this.geometry ? this.geometry.clone() : null, this.attributes, this.style);
    },
    onScreen: function (boundsOnly) {
        var onScreen = false;
        if (this.layer && this.layer.map) {
            var screenBounds = this.layer.map.getExtent();
            if (boundsOnly) {
                var featureBounds = this.geometry.getBounds();
                onScreen = screenBounds.intersectsBounds(featureBounds);
            } else {
                var screenPoly = screenBounds.toGeometry();
                onScreen = screenPoly.intersects(this.geometry);
            }
        }
        return onScreen;
    },
    getVisibility: function () {
        return !(this.style && this.style.display == 'none' || !this.layer || this.layer && this.layer.styleMap && this.layer.styleMap.createSymbolizer(this, this.renderIntent).display == 'none' || this.layer && !this.layer.getVisibility());
    },
    createMarker: function () {
        return null;
    },
    destroyMarker: function () {},
    createPopup: function () {
        return null;
    },
    atPoint: function (lonlat, toleranceLon, toleranceLat) {
        var atPoint = false;
        if (this.geometry) {
            atPoint = this.geometry.atPoint(lonlat, toleranceLon, toleranceLat);
        }
        return atPoint;
    },
    destroyPopup: function () {},
    move: function (location) {
        if (!this.layer || !this.geometry.move) {
            return undefined;
        }
        var pixel;
        if (location.CLASS_NAME == "OpenLayers.LonLat") {
            pixel = this.layer.getViewPortPxFromLonLat(location);
        } else {
            pixel = location;
        }
        var lastPixel = this.layer.getViewPortPxFromLonLat(this.geometry.getBounds().getCenterLonLat());
        var res = this.layer.map.getResolution();
        this.geometry.move(res * (pixel.x - lastPixel.x), res * (lastPixel.y - pixel.y));
        this.layer.drawFeature(this);
        return lastPixel;
    },
    toState: function (state) {
        if (state == OpenLayers.State.UPDATE) {
            switch (this.state) {
            case OpenLayers.State.UNKNOWN:
            case OpenLayers.State.DELETE:
                this.state = state;
                break;
            case OpenLayers.State.UPDATE:
            case OpenLayers.State.INSERT:
                break;
            }
        } else if (state == OpenLayers.State.INSERT) {
            switch (this.state) {
            case OpenLayers.State.UNKNOWN:
                break;
            default:
                this.state = state;
                break;
            }
        } else if (state == OpenLayers.State.DELETE) {
            switch (this.state) {
            case OpenLayers.State.INSERT:
                break;
            case OpenLayers.State.DELETE:
                break;
            case OpenLayers.State.UNKNOWN:
            case OpenLayers.State.UPDATE:
                this.state = state;
                break;
            }
        } else if (state == OpenLayers.State.UNKNOWN) {
            this.state = state;
        }
    },
    CLASS_NAME: "OpenLayers.Feature.Vector"
});
OpenLayers.Feature.Vector.style = {
    'default': {
        fillColor: "#ee9900",
        fillOpacity: 0.4,
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "#ee9900",
        strokeOpacity: 1,
        strokeWidth: 1,
        strokeLinecap: "round",
        strokeDashstyle: "solid",
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted",
        cursor: "inherit",
        fontColor: "#000000",
        labelAlign: "cm",
        labelOutlineColor: "white",
        labelOutlineWidth: 3
    },
    'select': {
        fillColor: "blue",
        fillOpacity: 0.4,
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "blue",
        strokeOpacity: 1,
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeDashstyle: "solid",
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted",
        cursor: "pointer",
        fontColor: "#000000",
        labelAlign: "cm",
        labelOutlineColor: "white",
        labelOutlineWidth: 3
    },
    'temporary': {
        fillColor: "#66cccc",
        fillOpacity: 0.2,
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "#66cccc",
        strokeOpacity: 1,
        strokeLinecap: "round",
        strokeWidth: 2,
        strokeDashstyle: "solid",
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted",
        cursor: "inherit",
        fontColor: "#000000",
        labelAlign: "cm",
        labelOutlineColor: "white",
        labelOutlineWidth: 3
    },
    'delete': {
        display: "none"
    }
};
OpenLayers.Handler = OpenLayers.Class({
    id: null,
    control: null,
    map: null,
    keyMask: null,
    active: false,
    evt: null,
    initialize: function (control, callbacks, options) {
        OpenLayers.Util.extend(this, options);
        this.control = control;
        this.callbacks = callbacks;
        var map = this.map || control.map;
        if (map) {
            this.setMap(map);
        }
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },
    setMap: function (map) {
        this.map = map;
    },
    checkModifiers: function (evt) {
        if (this.keyMask == null) {
            return true;
        }
        var keyModifiers = (evt.shiftKey ? OpenLayers.Handler.MOD_SHIFT : 0) | (evt.ctrlKey ? OpenLayers.Handler.MOD_CTRL : 0) | (evt.altKey ? OpenLayers.Handler.MOD_ALT : 0);
        return (keyModifiers == this.keyMask);
    },
    activate: function () {
        if (this.active) {
            return false;
        }
        var events = OpenLayers.Events.prototype.BROWSER_EVENTS;
        for (var i = 0, len = events.length; i < len; i++) {
            if (this[events[i]]) {
                this.register(events[i], this[events[i]]);
            }
        }
        this.active = true;
        return true;
    },
    deactivate: function () {
        if (!this.active) {
            return false;
        }
        var events = OpenLayers.Events.prototype.BROWSER_EVENTS;
        for (var i = 0, len = events.length; i < len; i++) {
            if (this[events[i]]) {
                this.unregister(events[i], this[events[i]]);
            }
        }
        this.active = false;
        return true;
    },
    callback: function (name, args) {
        if (name && this.callbacks[name]) {
            this.callbacks[name].apply(this.control, args);
        }
    },
    register: function (name, method) {
        this.map.events.registerPriority(name, this, method);
        this.map.events.registerPriority(name, this, this.setEvent);
    },
    unregister: function (name, method) {
        this.map.events.unregister(name, this, method);
        this.map.events.unregister(name, this, this.setEvent);
    },
    setEvent: function (evt) {
        this.evt = evt;
        return true;
    },
    destroy: function () {
        this.deactivate();
        this.control = this.map = null;
    },
    CLASS_NAME: "OpenLayers.Handler"
});
OpenLayers.Handler.MOD_NONE = 0;
OpenLayers.Handler.MOD_SHIFT = 1;
OpenLayers.Handler.MOD_CTRL = 2;
OpenLayers.Handler.MOD_ALT = 4;
OpenLayers.Handler.Click = OpenLayers.Class(OpenLayers.Handler, {
    delay: 300,
    single: true,
    'double': false,
    pixelTolerance: 0,
    dblclickTolerance: 13,
    stopSingle: false,
    stopDouble: false,
    timerId: null,
    touch: false,
    down: null,
    last: null,
    first: null,
    rightclickTimerId: null,
    touchstart: function (evt) {
        if (!this.touch) {
            this.unregisterMouseListeners();
            this.touch = true;
        }
        this.down = this.getEventInfo(evt);
        this.last = this.getEventInfo(evt);
        return true;
    },
    touchmove: function (evt) {
        this.last = this.getEventInfo(evt);
        return true;
    },
    touchend: function (evt) {
        if (this.down) {
            evt.xy = this.last.xy;
            evt.lastTouches = this.last.touches;
            this.handleSingle(evt);
            this.down = null;
        }
        return true;
    },
    unregisterMouseListeners: function () {
        this.map.events.un({
            mousedown: this.mousedown,
            mouseup: this.mouseup,
            click: this.click,
            dblclick: this.dblclick,
            scope: this
        });
    },
    mousedown: function (evt) {
        this.down = this.getEventInfo(evt);
        this.last = this.getEventInfo(evt);
        return true;
    },
    mouseup: function (evt) {
        var propagate = true;
        if (this.checkModifiers(evt) && this.control.handleRightClicks && OpenLayers.Event.isRightClick(evt)) {
            propagate = this.rightclick(evt);
        }
        return propagate;
    },
    rightclick: function (evt) {
        if (this.passesTolerance(evt)) {
            if (this.rightclickTimerId != null) {
                this.clearTimer();
                this.callback('dblrightclick', [evt]);
                return !this.stopDouble;
            } else {
                var clickEvent = this['double'] ? OpenLayers.Util.extend({}, evt) : this.callback('rightclick', [evt]);
                var delayedRightCall = OpenLayers.Function.bind(this.delayedRightCall, this, clickEvent);
                this.rightclickTimerId = window.setTimeout(delayedRightCall, this.delay);
            }
        }
        return !this.stopSingle;
    },
    delayedRightCall: function (evt) {
        this.rightclickTimerId = null;
        if (evt) {
            this.callback('rightclick', [evt]);
        }
    },
    click: function (evt) {
        if (!this.last) {
            this.last = this.getEventInfo(evt);
        }
        this.handleSingle(evt);
        return !this.stopSingle;
    },
    dblclick: function (evt) {
        this.handleDouble(evt);
        return !this.stopDouble;
    },
    handleDouble: function (evt) {
        if (this.passesDblclickTolerance(evt)) {
            if (this["double"]) {
                this.callback("dblclick", [evt]);
            }
            this.clearTimer();
        }
    },
    handleSingle: function (evt) {
        if (this.passesTolerance(evt)) {
            if (this.timerId != null) {
                if (this.last.touches && this.last.touches.length === 1) {
                    if (this["double"]) {
                        OpenLayers.Event.stop(evt);
                    }
                    this.handleDouble(evt);
                }
                if (!this.last.touches || this.last.touches.length !== 2) {
                    this.clearTimer();
                }
            } else {
                this.first = this.getEventInfo(evt);
                var clickEvent = this.single ? OpenLayers.Util.extend({}, evt) : null;
                this.queuePotentialClick(clickEvent);
            }
        }
    },
    queuePotentialClick: function (evt) {
        this.timerId = window.setTimeout(OpenLayers.Function.bind(this.delayedCall, this, evt), this.delay);
    },
    passesTolerance: function (evt) {
        var passes = true;
        if (this.pixelTolerance != null && this.down && this.down.xy) {
            passes = this.pixelTolerance >= this.down.xy.distanceTo(evt.xy);
            if (passes && this.touch && this.down.touches.length === this.last.touches.length) {
                for (var i = 0, ii = this.down.touches.length; i < ii; ++i) {
                    if (this.getTouchDistance(this.down.touches[i], this.last.touches[i]) > this.pixelTolerance) {
                        passes = false;
                        break;
                    }
                }
            }
        }
        return passes;
    },
    getTouchDistance: function (from, to) {
        return Math.sqrt(Math.pow(from.clientX - to.clientX, 2) +
            Math.pow(from.clientY - to.clientY, 2));
    },
    passesDblclickTolerance: function (evt) {
        var passes = true;
        if (this.down && this.first) {
            passes = this.down.xy.distanceTo(this.first.xy) <= this.dblclickTolerance;
        }
        return passes;
    },
    clearTimer: function () {
        if (this.timerId != null) {
            window.clearTimeout(this.timerId);
            this.timerId = null;
        }
        if (this.rightclickTimerId != null) {
            window.clearTimeout(this.rightclickTimerId);
            this.rightclickTimerId = null;
        }
    },
    delayedCall: function (evt) {
        this.timerId = null;
        if (evt) {
            this.callback("click", [evt]);
        }
    },
    getEventInfo: function (evt) {
        var touches;
        if (evt.touches) {
            var len = evt.touches.length;
            touches = new Array(len);
            var touch;
            for (var i = 0; i < len; i++) {
                touch = evt.touches[i];
                touches[i] = {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                };
            }
        }
        return {
            xy: evt.xy,
            touches: touches
        };
    },
    deactivate: function () {
        var deactivated = false;
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.clearTimer();
            this.down = null;
            this.first = null;
            this.last = null;
            this.touch = false;
            deactivated = true;
        }
        return deactivated;
    },
    CLASS_NAME: "OpenLayers.Handler.Click"
});
OpenLayers.Handler.Point = OpenLayers.Class(OpenLayers.Handler, {
    point: null,
    layer: null,
    multi: false,
    citeCompliant: false,
    mouseDown: false,
    stoppedDown: null,
    lastDown: null,
    lastUp: null,
    persist: false,
    stopDown: false,
    stopUp: false,
    layerOptions: null,
    pixelTolerance: 5,
    touch: false,
    lastTouchPx: null,
    initialize: function (control, callbacks, options) {
        if (!(options && options.layerOptions && options.layerOptions.styleMap)) {
            this.style = OpenLayers.Util.extend(OpenLayers.Feature.Vector.style['default'], {});
        }
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
    },
    activate: function () {
        if (!OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            return false;
        }
        var options = OpenLayers.Util.extend({
            displayInLayerSwitcher: false,
            calculateInRange: OpenLayers.Function.True,
            wrapDateLine: this.citeCompliant
        }, this.layerOptions);
        this.layer = new OpenLayers.Layer.Vector(this.CLASS_NAME, options);
        this.map.addLayer(this.layer);
        return true;
    },
    createFeature: function (pixel) {
        var lonlat = this.layer.getLonLatFromViewPortPx(pixel);
        var geometry = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
        this.point = new OpenLayers.Feature.Vector(geometry);
        this.callback("create", [this.point.geometry, this.point]);
        this.point.geometry.clearBounds();
        this.layer.addFeatures([this.point], {
            silent: true
        });
    },
    deactivate: function () {
        if (!OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            return false;
        }
        this.cancel();
        if (this.layer.map != null) {
            this.destroyFeature(true);
            this.layer.destroy(false);
        }
        this.layer = null;
        this.touch = false;
        return true;
    },
    destroyFeature: function (force) {
        if (this.layer && (force || !this.persist)) {
            this.layer.destroyFeatures();
        }
        this.point = null;
    },
    destroyPersistedFeature: function () {
        var layer = this.layer;
        if (layer && layer.features.length > 1) {
            this.layer.features[0].destroy();
        }
    },
    finalize: function (cancel) {
        var key = cancel ? "cancel" : "done";
        this.mouseDown = false;
        this.lastDown = null;
        this.lastUp = null;
        this.lastTouchPx = null;
        this.callback(key, [this.geometryClone()]);
        this.destroyFeature(cancel);
    },
    cancel: function () {
        this.finalize(true);
    },
    click: function (evt) {
        OpenLayers.Event.stop(evt);
        return false;
    },
    dblclick: function (evt) {
        OpenLayers.Event.stop(evt);
        return false;
    },
    modifyFeature: function (pixel) {
        if (!this.point) {
            this.createFeature(pixel);
        }
        var lonlat = this.layer.getLonLatFromViewPortPx(pixel);
        this.point.geometry.x = lonlat.lon;
        this.point.geometry.y = lonlat.lat;
        this.callback("modify", [this.point.geometry, this.point, false]);
        this.point.geometry.clearBounds();
        this.drawFeature();
    },
    drawFeature: function () {
        this.layer.drawFeature(this.point, this.style);
    },
    getGeometry: function () {
        var geometry = this.point && this.point.geometry;
        if (geometry && this.multi) {
            geometry = new OpenLayers.Geometry.MultiPoint([geometry]);
        }
        return geometry;
    },
    geometryClone: function () {
        var geom = this.getGeometry();
        return geom && geom.clone();
    },
    mousedown: function (evt) {
        return this.down(evt);
    },
    touchstart: function (evt) {
        if (!this.touch) {
            this.touch = true;
            this.map.events.un({
                mousedown: this.mousedown,
                mouseup: this.mouseup,
                mousemove: this.mousemove,
                click: this.click,
                dblclick: this.dblclick,
                scope: this
            });
        }
        this.lastTouchPx = evt.xy;
        return this.down(evt);
    },
    mousemove: function (evt) {
        return this.move(evt);
    },
    touchmove: function (evt) {
        this.lastTouchPx = evt.xy;
        return this.move(evt);
    },
    mouseup: function (evt) {
        return this.up(evt);
    },
    touchend: function (evt) {
        evt.xy = this.lastTouchPx;
        return this.up(evt);
    },
    down: function (evt) {
        this.mouseDown = true;
        this.lastDown = evt.xy;
        if (!this.touch) {
            this.modifyFeature(evt.xy);
        }
        this.stoppedDown = this.stopDown;
        return !this.stopDown;
    },
    move: function (evt) {
        if (!this.touch && (!this.mouseDown || this.stoppedDown)) {
            this.modifyFeature(evt.xy);
        }
        return true;
    },
    up: function (evt) {
        this.mouseDown = false;
        this.stoppedDown = this.stopDown;
        if (!this.checkModifiers(evt)) {
            return true;
        }
        if (this.lastUp && this.lastUp.equals(evt.xy)) {
            return true;
        }
        if (this.lastDown && this.passesTolerance(this.lastDown, evt.xy, this.pixelTolerance)) {
            if (this.touch) {
                this.modifyFeature(evt.xy);
            }
            if (this.persist) {
                this.destroyPersistedFeature();
            }
            this.lastUp = evt.xy;
            this.finalize();
            return !this.stopUp;
        } else {
            return true;
        }
    },
    mouseout: function (evt) {
        if (OpenLayers.Util.mouseLeft(evt, this.map.viewPortDiv)) {
            this.stoppedDown = this.stopDown;
            this.mouseDown = false;
        }
    },
    passesTolerance: function (pixel1, pixel2, tolerance) {
        var passes = true;
        if (tolerance != null && pixel1 && pixel2) {
            var dist = pixel1.distanceTo(pixel2);
            if (dist > tolerance) {
                passes = false;
            }
        }
        return passes;
    },
    CLASS_NAME: "OpenLayers.Handler.Point"
});
OpenLayers.Handler.Feature = OpenLayers.Class(OpenLayers.Handler, {
    EVENTMAP: {
        'click': {
            'in': 'click',
            'out': 'clickout'
        },
        'mousemove': {
            'in': 'over',
            'out': 'out'
        },
        'dblclick': {
            'in': 'dblclick',
            'out': null
        },
        'mousedown': {
            'in': null,
            'out': null
        },
        'mouseup': {
            'in': null,
            'out': null
        },
        'touchstart': {
            'in': 'click',
            'out': 'clickout'
        }
    },
    feature: null,
    lastFeature: null,
    down: null,
    up: null,
    touch: false,
    clickTolerance: 4,
    geometryTypes: null,
    stopClick: true,
    stopDown: true,
    stopUp: false,
    initialize: function (control, layer, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, [control, callbacks, options]);
        this.layer = layer;
    },
    touchstart: function (evt) {
        if (!this.touch) {
            this.touch = true;
            this.map.events.un({
                mousedown: this.mousedown,
                mouseup: this.mouseup,
                mousemove: this.mousemove,
                click: this.click,
                dblclick: this.dblclick,
                scope: this
            });
        }
        return OpenLayers.Event.isMultiTouch(evt) ? true : this.mousedown(evt);
    },
    touchmove: function (evt) {
        OpenLayers.Event.stop(evt);
    },
    mousedown: function (evt) {
        if (OpenLayers.Event.isLeftClick(evt) || OpenLayers.Event.isSingleTouch(evt)) {
            this.down = evt.xy;
        }
        return this.handle(evt) ? !this.stopDown : true;
    },
    mouseup: function (evt) {
        this.up = evt.xy;
        return this.handle(evt) ? !this.stopUp : true;
    },
    click: function (evt) {
        return this.handle(evt) ? !this.stopClick : true;
    },
    mousemove: function (evt) {
        if (!this.callbacks['over'] && !this.callbacks['out']) {
            return true;
        }
        this.handle(evt);
        return true;
    },
    dblclick: function (evt) {
        return !this.handle(evt);
    },
    geometryTypeMatches: function (feature) {
        return this.geometryTypes == null || OpenLayers.Util.indexOf(this.geometryTypes, feature.geometry.CLASS_NAME) > -1;
    },
    handle: function (evt) {
        if (this.feature && !this.feature.layer) {
            this.feature = null;
        }
        var type = evt.type;
        var handled = false;
        var previouslyIn = !! (this.feature);
        var click = (type == "click" || type == "dblclick" || type == "touchstart");
        this.feature = this.layer.getFeatureFromEvent(evt);
        if (this.feature && !this.feature.layer) {
            this.feature = null;
        }
        if (this.lastFeature && !this.lastFeature.layer) {
            this.lastFeature = null;
        }
        if (this.feature) {
            if (type === "touchstart") {
                OpenLayers.Event.stop(evt);
            }
            var inNew = (this.feature != this.lastFeature);
            if (this.geometryTypeMatches(this.feature)) {
                if (previouslyIn && inNew) {
                    if (this.lastFeature) {
                        this.triggerCallback(type, 'out', [this.lastFeature]);
                    }
                    this.triggerCallback(type, 'in', [this.feature]);
                } else if (!previouslyIn || click) {
                    this.triggerCallback(type, 'in', [this.feature]);
                }
                this.lastFeature = this.feature;
                handled = true;
            } else {
                if (this.lastFeature && (previouslyIn && inNew || click)) {
                    this.triggerCallback(type, 'out', [this.lastFeature]);
                }
                this.feature = null;
            }
        } else {
            if (this.lastFeature && (previouslyIn || click)) {
                this.triggerCallback(type, 'out', [this.lastFeature]);
            }
        }
        return handled;
    },
    triggerCallback: function (type, mode, args) {
        var key = this.EVENTMAP[type][mode];
        if (key) {
            if (type == 'click' && this.up && this.down) {
                var dpx = Math.sqrt(Math.pow(this.up.x - this.down.x, 2) +
                    Math.pow(this.up.y - this.down.y, 2));
                if (dpx <= this.clickTolerance) {
                    this.callback(key, args);
                }
            } else {
                this.callback(key, args);
            }
        }
    },
    activate: function () {
        var activated = false;
        if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.moveLayerToTop();
            this.map.events.on({
                "removelayer": this.handleMapEvents,
                "changelayer": this.handleMapEvents,
                scope: this
            });
            activated = true;
        }
        return activated;
    },
    deactivate: function () {
        var deactivated = false;
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.moveLayerBack();
            this.feature = null;
            this.lastFeature = null;
            this.down = null;
            this.up = null;
            this.touch = false;
            this.map.events.un({
                "removelayer": this.handleMapEvents,
                "changelayer": this.handleMapEvents,
                scope: this
            });
            deactivated = true;
        }
        return deactivated;
    },
    handleMapEvents: function (evt) {
        if (evt.type == "removelayer" || evt.property == "order") {
            this.moveLayerToTop();
        }
    },
    moveLayerToTop: function () {
        var index = Math.max(this.map.Z_INDEX_BASE['Feature'] - 1, this.layer.getZIndex()) + 1;
        this.layer.setZIndex(index);
    },
    moveLayerBack: function () {
        var index = this.layer.getZIndex() - 1;
        if (index >= this.map.Z_INDEX_BASE['Feature']) {
            this.layer.setZIndex(index);
        } else {
            this.map.setLayerZIndex(this.layer, this.map.getLayerIndex(this.layer));
        }
    },
    CLASS_NAME: "OpenLayers.Handler.Feature"
});
OpenLayers.Handler.Drag = OpenLayers.Class(OpenLayers.Handler, {
    started: false,
    stopDown: true,
    dragging: false,
    touch: false,
    last: null,
    start: null,
    lastMoveEvt: null,
    oldOnselectstart: null,
    interval: 0,
    timeoutId: null,
    documentDrag: false,
    documentEvents: null,
    initialize: function (control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        if (this.documentDrag === true) {
            var me = this;
            this._docMove = function (evt) {
                me.mousemove({
                    xy: {
                        x: evt.clientX,
                        y: evt.clientY
                    },
                    element: document
                });
            };
            this._docUp = function (evt) {
                me.mouseup({
                    xy: {
                        x: evt.clientX,
                        y: evt.clientY
                    }
                });
            };
        }
    },
    dragstart: function (evt) {
        var propagate = true;
        this.dragging = false;
        if (this.checkModifiers(evt) && (OpenLayers.Event.isLeftClick(evt) || OpenLayers.Event.isSingleTouch(evt))) {
            this.started = true;
            this.start = evt.xy;
            this.last = evt.xy;
            OpenLayers.Element.addClass(this.map.viewPortDiv, "olDragDown");
            this.down(evt);
            this.callback("down", [evt.xy]);
            OpenLayers.Event.stop(evt);
            if (!this.oldOnselectstart) {
                this.oldOnselectstart = document.onselectstart ? document.onselectstart : OpenLayers.Function.True;
            }
            document.onselectstart = OpenLayers.Function.False;
            propagate = !this.stopDown;
        } else {
            this.started = false;
            this.start = null;
            this.last = null;
        }
        return propagate;
    },
    dragmove: function (evt) {
        this.lastMoveEvt = evt;
        if (this.started && !this.timeoutId && (evt.xy.x != this.last.x || evt.xy.y != this.last.y)) {
            if (this.documentDrag === true && this.documentEvents) {
                if (evt.element === document) {
                    this.adjustXY(evt);
                    this.setEvent(evt);
                } else {
                    this.removeDocumentEvents();
                }
            }
            if (this.interval > 0) {
                this.timeoutId = setTimeout(OpenLayers.Function.bind(this.removeTimeout, this), this.interval);
            }
            this.dragging = true;
            this.move(evt);
            this.callback("move", [evt.xy]);
            if (!this.oldOnselectstart) {
                this.oldOnselectstart = document.onselectstart;
                document.onselectstart = OpenLayers.Function.False;
            }
            this.last = evt.xy;
        }
        return true;
    },
    dragend: function (evt) {
        if (this.started) {
            if (this.documentDrag === true && this.documentEvents) {
                this.adjustXY(evt);
                this.removeDocumentEvents();
            }
            var dragged = (this.start != this.last);
            this.started = false;
            this.dragging = false;
            OpenLayers.Element.removeClass(this.map.viewPortDiv, "olDragDown");
            this.up(evt);
            this.callback("up", [evt.xy]);
            if (dragged) {
                this.callback("done", [evt.xy]);
            }
            document.onselectstart = this.oldOnselectstart;
        }
        return true;
    },
    down: function (evt) {},
    move: function (evt) {},
    up: function (evt) {},
    out: function (evt) {},
    mousedown: function (evt) {
        return this.dragstart(evt);
    },
    touchstart: function (evt) {
        if (!this.touch) {
            this.touch = true;
            this.map.events.un({
                mousedown: this.mousedown,
                mouseup: this.mouseup,
                mousemove: this.mousemove,
                click: this.click,
                scope: this
            });
        }
        return this.dragstart(evt);
    },
    mousemove: function (evt) {
        return this.dragmove(evt);
    },
    touchmove: function (evt) {
        return this.dragmove(evt);
    },
    removeTimeout: function () {
        this.timeoutId = null;
        if (this.dragging) {
            this.mousemove(this.lastMoveEvt);
        }
    },
    mouseup: function (evt) {
        return this.dragend(evt);
    },
    touchend: function (evt) {
        evt.xy = this.last;
        return this.dragend(evt);
    },
    mouseout: function (evt) {
        if (this.started && OpenLayers.Util.mouseLeft(evt, this.map.viewPortDiv)) {
            if (this.documentDrag === true) {
                this.addDocumentEvents();
            } else {
                var dragged = (this.start != this.last);
                this.started = false;
                this.dragging = false;
                OpenLayers.Element.removeClass(this.map.viewPortDiv, "olDragDown");
                this.out(evt);
                this.callback("out", []);
                if (dragged) {
                    this.callback("done", [evt.xy]);
                }
                if (document.onselectstart) {
                    document.onselectstart = this.oldOnselectstart;
                }
            }
        }
        return true;
    },
    click: function (evt) {
        return (this.start == this.last);
    },
    activate: function () {
        var activated = false;
        if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.dragging = false;
            activated = true;
        }
        return activated;
    },
    deactivate: function () {
        var deactivated = false;
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.touch = false;
            this.started = false;
            this.dragging = false;
            this.start = null;
            this.last = null;
            deactivated = true;
            OpenLayers.Element.removeClass(this.map.viewPortDiv, "olDragDown");
        }
        return deactivated;
    },
    adjustXY: function (evt) {
        var pos = OpenLayers.Util.pagePosition(this.map.viewPortDiv);
        evt.xy.x -= pos[0];
        evt.xy.y -= pos[1];
    },
    addDocumentEvents: function () {
        OpenLayers.Element.addClass(document.body, "olDragDown");
        this.documentEvents = true;
        OpenLayers.Event.observe(document, "mousemove", this._docMove);
        OpenLayers.Event.observe(document, "mouseup", this._docUp);
    },
    removeDocumentEvents: function () {
        OpenLayers.Element.removeClass(document.body, "olDragDown");
        this.documentEvents = false;
        OpenLayers.Event.stopObserving(document, "mousemove", this._docMove);
        OpenLayers.Event.stopObserving(document, "mouseup", this._docUp);
    },
    CLASS_NAME: "OpenLayers.Handler.Drag"
});
OpenLayers.Handler.Box = OpenLayers.Class(OpenLayers.Handler, {
    dragHandler: null,
    boxDivClassName: 'olHandlerBoxZoomBox',
    boxOffsets: null,
    initialize: function (control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        this.dragHandler = new OpenLayers.Handler.Drag(this, {
            down: this.startBox,
            move: this.moveBox,
            out: this.removeBox,
            up: this.endBox
        }, {
            keyMask: this.keyMask
        });
    },
    destroy: function () {
        OpenLayers.Handler.prototype.destroy.apply(this, arguments);
        if (this.dragHandler) {
            this.dragHandler.destroy();
            this.dragHandler = null;
        }
    },
    setMap: function (map) {
        OpenLayers.Handler.prototype.setMap.apply(this, arguments);
        if (this.dragHandler) {
            this.dragHandler.setMap(map);
        }
    },
    startBox: function (xy) {
        this.callback("start", []);
        this.zoomBox = OpenLayers.Util.createDiv('zoomBox', {
            x: -9999,
            y: -9999
        });
        this.zoomBox.className = this.boxDivClassName;
        this.zoomBox.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
        this.map.viewPortDiv.appendChild(this.zoomBox);
        OpenLayers.Element.addClass(this.map.viewPortDiv, "olDrawBox");
    },
    moveBox: function (xy) {
        var startX = this.dragHandler.start.x;
        var startY = this.dragHandler.start.y;
        var deltaX = Math.abs(startX - xy.x);
        var deltaY = Math.abs(startY - xy.y);
        var offset = this.getBoxOffsets();
        this.zoomBox.style.width = (deltaX + offset.width + 1) + "px";
        this.zoomBox.style.height = (deltaY + offset.height + 1) + "px";
        this.zoomBox.style.left = (xy.x < startX ? startX - deltaX - offset.left : startX - offset.left) + "px";
        this.zoomBox.style.top = (xy.y < startY ? startY - deltaY - offset.top : startY - offset.top) + "px";
    },
    endBox: function (end) {
        var result;
        if (Math.abs(this.dragHandler.start.x - end.x) > 5 || Math.abs(this.dragHandler.start.y - end.y) > 5) {
            var start = this.dragHandler.start;
            var top = Math.min(start.y, end.y);
            var bottom = Math.max(start.y, end.y);
            var left = Math.min(start.x, end.x);
            var right = Math.max(start.x, end.x);
            result = new OpenLayers.Bounds(left, bottom, right, top);
        } else {
            result = this.dragHandler.start.clone();
        }
        this.removeBox();
        this.callback("done", [result]);
    },
    removeBox: function () {
        this.map.viewPortDiv.removeChild(this.zoomBox);
        this.zoomBox = null;
        this.boxOffsets = null;
        OpenLayers.Element.removeClass(this.map.viewPortDiv, "olDrawBox");
    },
    activate: function () {
        if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.dragHandler.activate();
            return true;
        } else {
            return false;
        }
    },
    deactivate: function () {
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            if (this.dragHandler.deactivate()) {
                if (this.zoomBox) {
                    this.removeBox();
                }
            }
            return true;
        } else {
            return false;
        }
    },
    getBoxOffsets: function () {
        if (!this.boxOffsets) {
            var testDiv = document.createElement("div");
            testDiv.style.position = "absolute";
            testDiv.style.border = "1px solid black";
            testDiv.style.width = "3px";
            document.body.appendChild(testDiv);
            var w3cBoxModel = testDiv.clientWidth == 3;
            document.body.removeChild(testDiv);
            var left = parseInt(OpenLayers.Element.getStyle(this.zoomBox, "border-left-width"));
            var right = parseInt(OpenLayers.Element.getStyle(this.zoomBox, "border-right-width"));
            var top = parseInt(OpenLayers.Element.getStyle(this.zoomBox, "border-top-width"));
            var bottom = parseInt(OpenLayers.Element.getStyle(this.zoomBox, "border-bottom-width"));
            this.boxOffsets = {
                left: left,
                right: right,
                top: top,
                bottom: bottom,
                width: w3cBoxModel === false ? left + right : 0,
                height: w3cBoxModel === false ? top + bottom : 0
            };
        }
        return this.boxOffsets;
    },
    CLASS_NAME: "OpenLayers.Handler.Box"
});
OpenLayers.Handler.MouseWheel = OpenLayers.Class(OpenLayers.Handler, {
    wheelListener: null,
    mousePosition: null,
    interval: 0,
    delta: 0,
    cumulative: true,
    initialize: function (control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        this.wheelListener = OpenLayers.Function.bindAsEventListener(this.onWheelEvent, this);
    },
    destroy: function () {
        OpenLayers.Handler.prototype.destroy.apply(this, arguments);
        this.wheelListener = null;
    },
    onWheelEvent: function (e) {
        if (!this.map || !this.checkModifiers(e)) {
            return;
        }
        var overScrollableDiv = false;
        var overLayerDiv = false;
        var overMapDiv = false;
        var elem = OpenLayers.Event.element(e);
        while ((elem != null) && !overMapDiv && !overScrollableDiv) {
            if (!overScrollableDiv) {
                try {
                    if (elem.currentStyle) {
                        overflow = elem.currentStyle["overflow"];
                    } else {
                        var style = document.defaultView.getComputedStyle(elem, null);
                        var overflow = style.getPropertyValue("overflow");
                    }
                    overScrollableDiv = (overflow && (overflow == "auto") || (overflow == "scroll"));
                } catch (err) {}
            }
            if (!overLayerDiv) {
                for (var i = 0, len = this.map.layers.length; i < len; i++) {
                    if (elem == this.map.layers[i].div || elem == this.map.layers[i].pane) {
                        overLayerDiv = true;
                        break;
                    }
                }
            }
            overMapDiv = (elem == this.map.div);
            elem = elem.parentNode;
        }
        if (!overScrollableDiv && overMapDiv) {
            if (overLayerDiv) {
                var delta = 0;
                if (!e) {
                    e = window.event;
                }
                if (e.wheelDelta) {
                    delta = e.wheelDelta / 120;
                    if (window.opera && window.opera.version() < 9.2) {
                        delta = -delta;
                    }
                } else if (e.detail) {
                    delta = -e.detail / 3;
                }
                this.delta = this.delta + delta;
                if (this.interval) {
                    window.clearTimeout(this._timeoutId);
                    this._timeoutId = window.setTimeout(OpenLayers.Function.bind(function () {
                        this.wheelZoom(e);
                    }, this), this.interval);
                } else {
                    this.wheelZoom(e);
                }
            }
            OpenLayers.Event.stop(e);
        }
    },
    wheelZoom: function (e) {
        var delta = this.delta;
        this.delta = 0;
        if (delta) {
            if (this.mousePosition) {
                e.xy = this.mousePosition;
            }
            if (!e.xy) {
                e.xy = this.map.getPixelFromLonLat(this.map.getCenter());
            }
            if (delta < 0) {
                this.callback("down", [e, this.cumulative ? delta : -1]);
            } else {
                this.callback("up", [e, this.cumulative ? delta : 1]);
            }
        }
    },
    mousemove: function (evt) {
        this.mousePosition = evt.xy;
    },
    activate: function (evt) {
        if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            var wheelListener = this.wheelListener;
            OpenLayers.Event.observe(window, "DOMMouseScroll", wheelListener);
            OpenLayers.Event.observe(window, "mousewheel", wheelListener);
            OpenLayers.Event.observe(document, "mousewheel", wheelListener);
            return true;
        } else {
            return false;
        }
    },
    deactivate: function (evt) {
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            var wheelListener = this.wheelListener;
            OpenLayers.Event.stopObserving(window, "DOMMouseScroll", wheelListener);
            OpenLayers.Event.stopObserving(window, "mousewheel", wheelListener);
            OpenLayers.Event.stopObserving(document, "mousewheel", wheelListener);
            return true;
        } else {
            return false;
        }
    },
    CLASS_NAME: "OpenLayers.Handler.MouseWheel"
});
OpenLayers.Control = OpenLayers.Class({
    id: null,
    map: null,
    div: null,
    type: null,
    allowSelection: false,
    displayClass: "",
    title: "",
    autoActivate: false,
    active: null,
    handler: null,
    eventListeners: null,
    events: null,
    initialize: function (options) {
        this.displayClass = this.CLASS_NAME.replace("OpenLayers.", "ol").replace(/\./g, "");
        OpenLayers.Util.extend(this, options);
        this.events = new OpenLayers.Events(this);
        if (this.eventListeners instanceof Object) {
            this.events.on(this.eventListeners);
        }
        if (this.id == null) {
            this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
        }
    },
    destroy: function () {
        if (this.events) {
            if (this.eventListeners) {
                this.events.un(this.eventListeners);
            }
            this.events.destroy();
            this.events = null;
        }
        this.eventListeners = null;
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }
        if (this.handlers) {
            for (var key in this.handlers) {
                if (this.handlers.hasOwnProperty(key) && typeof this.handlers[key].destroy == "function") {
                    this.handlers[key].destroy();
                }
            }
            this.handlers = null;
        }
        if (this.map) {
            this.map.removeControl(this);
            this.map = null;
        }
        this.div = null;
    },
    setMap: function (map) {
        this.map = map;
        if (this.handler) {
            this.handler.setMap(map);
        }
    },
    draw: function (px) {
        if (this.div == null) {
            this.div = OpenLayers.Util.createDiv(this.id);
            this.div.className = this.displayClass;
            if (!this.allowSelection) {
                this.div.className += " olControlNoSelect";
                this.div.setAttribute("unselectable", "on", 0);
                this.div.onselectstart = OpenLayers.Function.False;
            }
            if (this.title != "") {
                this.div.title = this.title;
            }
        }
        if (px != null) {
            this.position = px.clone();
        }
        this.moveTo(this.position);
        return this.div;
    },
    moveTo: function (px) {
        if ((px != null) && (this.div != null)) {
            this.div.style.left = px.x + "px";
            this.div.style.top = px.y + "px";
        }
    },
    activate: function () {
        if (this.active) {
            return false;
        }
        if (this.handler) {
            this.handler.activate();
        }
        this.active = true;
        if (this.map) {
            OpenLayers.Element.addClass(this.map.viewPortDiv, this.displayClass.replace(/ /g, "") + "Active");
        }
        this.events.triggerEvent("activate");
        return true;
    },
    deactivate: function () {
        if (this.active) {
            if (this.handler) {
                this.handler.deactivate();
            }
            this.active = false;
            if (this.map) {
                OpenLayers.Element.removeClass(this.map.viewPortDiv, this.displayClass.replace(/ /g, "") + "Active");
            }
            this.events.triggerEvent("deactivate");
            return true;
        }
        return false;
    },
    CLASS_NAME: "OpenLayers.Control"
});
OpenLayers.Control.TYPE_BUTTON = 1;
OpenLayers.Control.TYPE_TOGGLE = 2;
OpenLayers.Control.TYPE_TOOL = 3;
OpenLayers.Control.Attribution = OpenLayers.Class(OpenLayers.Control, {
    separator: ", ",
    template: "${layers}",
    destroy: function () {
        this.map.events.un({
            "removelayer": this.updateAttribution,
            "addlayer": this.updateAttribution,
            "changelayer": this.updateAttribution,
            "changebaselayer": this.updateAttribution,
            scope: this
        });
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },
    draw: function () {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        this.map.events.on({
            'changebaselayer': this.updateAttribution,
            'changelayer': this.updateAttribution,
            'addlayer': this.updateAttribution,
            'removelayer': this.updateAttribution,
            scope: this
        });
        this.updateAttribution();
        return this.div;
    },
    updateAttribution: function () {
        var attributions = [];
        if (this.map && this.map.layers) {
            for (var i = 0, len = this.map.layers.length; i < len; i++) {
                var layer = this.map.layers[i];
                if (layer.attribution && layer.getVisibility()) {
                    if (OpenLayers.Util.indexOf(attributions, layer.attribution) === -1) {
                        attributions.push(layer.attribution);
                    }
                }
            }
            this.div.innerHTML = OpenLayers.String.format(this.template, {
                layers: attributions.join(this.separator)
            });
        }
    },
    CLASS_NAME: "OpenLayers.Control.Attribution"
});
OpenLayers.Control.ZoomBox = OpenLayers.Class(OpenLayers.Control, {
    type: OpenLayers.Control.TYPE_TOOL,
    out: false,
    keyMask: null,
    alwaysZoom: false,
    draw: function () {
        this.handler = new OpenLayers.Handler.Box(this, {
            done: this.zoomBox
        }, {
            keyMask: this.keyMask
        });
    },
    zoomBox: function (position) {
        if (position instanceof OpenLayers.Bounds) {
            var bounds;
            if (!this.out) {
                var minXY = this.map.getLonLatFromPixel({
                    x: position.left,
                    y: position.bottom
                });
                var maxXY = this.map.getLonLatFromPixel({
                    x: position.right,
                    y: position.top
                });
                bounds = new OpenLayers.Bounds(minXY.lon, minXY.lat, maxXY.lon, maxXY.lat);
            } else {
                var pixWidth = Math.abs(position.right - position.left);
                var pixHeight = Math.abs(position.top - position.bottom);
                var zoomFactor = Math.min((this.map.size.h / pixHeight), (this.map.size.w / pixWidth));
                var extent = this.map.getExtent();
                var center = this.map.getLonLatFromPixel(position.getCenterPixel());
                var xmin = center.lon - (extent.getWidth() / 2) * zoomFactor;
                var xmax = center.lon + (extent.getWidth() / 2) * zoomFactor;
                var ymin = center.lat - (extent.getHeight() / 2) * zoomFactor;
                var ymax = center.lat + (extent.getHeight() / 2) * zoomFactor;
                bounds = new OpenLayers.Bounds(xmin, ymin, xmax, ymax);
            }
            var lastZoom = this.map.getZoom();
            this.map.zoomToExtent(bounds);
            if (lastZoom == this.map.getZoom() && this.alwaysZoom == true) {
                this.map.zoomTo(lastZoom + (this.out ? -1 : 1));
            }
        } else {
            if (!this.out) {
                this.map.setCenter(this.map.getLonLatFromPixel(position), this.map.getZoom() + 1);
            } else {
                this.map.setCenter(this.map.getLonLatFromPixel(position), this.map.getZoom() - 1);
            }
        }
    },
    CLASS_NAME: "OpenLayers.Control.ZoomBox"
});
OpenLayers.Control.DragPan = OpenLayers.Class(OpenLayers.Control, {
    type: OpenLayers.Control.TYPE_TOOL,
    panned: false,
    interval: 1,
    documentDrag: false,
    kinetic: null,
    enableKinetic: false,
    kineticInterval: 10,
    draw: function () {
        if (this.enableKinetic) {
            var config = {
                interval: this.kineticInterval
            };
            if (typeof this.enableKinetic === "object") {
                config = OpenLayers.Util.extend(config, this.enableKinetic);
            }
            this.kinetic = new OpenLayers.Kinetic(config);
        }
        this.handler = new OpenLayers.Handler.Drag(this, {
            "move": this.panMap,
            "done": this.panMapDone,
            "down": this.panMapStart
        }, {
            interval: this.interval,
            documentDrag: this.documentDrag
        });
    },
    panMapStart: function () {
        if (this.kinetic) {
            this.kinetic.begin();
        }
    },
    panMap: function (xy) {
        if (this.kinetic) {
            this.kinetic.update(xy);
        }
        this.panned = true;
        this.map.pan(this.handler.last.x - xy.x, this.handler.last.y - xy.y, {
            dragging: true,
            animate: false
        });
    },
    panMapDone: function (xy) {
        if (this.panned) {
            var res = null;
            if (this.kinetic) {
                res = this.kinetic.end(xy);
            }
            this.map.pan(this.handler.last.x - xy.x, this.handler.last.y - xy.y, {
                dragging: !! res,
                animate: false
            });
            if (res) {
                var self = this;
                this.kinetic.move(res, function (x, y, end) {
                    self.map.pan(x, y, {
                        dragging: !end,
                        animate: false
                    });
                });
            }
            this.panned = false;
        }
    },
    CLASS_NAME: "OpenLayers.Control.DragPan"
});
OpenLayers.Control.Navigation = OpenLayers.Class(OpenLayers.Control, {
    dragPan: null,
    dragPanOptions: null,
    pinchZoom: null,
    pinchZoomOptions: null,
    documentDrag: false,
    zoomBox: null,
    zoomBoxEnabled: true,
    zoomWheelEnabled: true,
    mouseWheelOptions: null,
    handleRightClicks: false,
    zoomBoxKeyMask: OpenLayers.Handler.MOD_SHIFT,
    autoActivate: true,
    initialize: function (options) {
        this.handlers = {};
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },
    destroy: function () {
        this.deactivate();
        if (this.dragPan) {
            this.dragPan.destroy();
        }
        this.dragPan = null;
        if (this.zoomBox) {
            this.zoomBox.destroy();
        }
        this.zoomBox = null;
        if (this.pinchZoom) {
            this.pinchZoom.destroy();
        }
        this.pinchZoom = null;
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },
    activate: function () {
        this.dragPan.activate();
        if (this.zoomWheelEnabled) {
            this.handlers.wheel.activate();
        }
        this.handlers.click.activate();
        if (this.zoomBoxEnabled) {
            this.zoomBox.activate();
        }
        if (this.pinchZoom) {
            this.pinchZoom.activate();
        }
        return OpenLayers.Control.prototype.activate.apply(this, arguments);
    },
    deactivate: function () {
        if (this.pinchZoom) {
            this.pinchZoom.deactivate();
        }
        this.zoomBox.deactivate();
        this.dragPan.deactivate();
        this.handlers.click.deactivate();
        this.handlers.wheel.deactivate();
        return OpenLayers.Control.prototype.deactivate.apply(this, arguments);
    },
    draw: function () {
        if (this.handleRightClicks) {
            this.map.viewPortDiv.oncontextmenu = OpenLayers.Function.False;
        }
        var clickCallbacks = {
            'click': this.defaultClick,
            'dblclick': this.defaultDblClick,
            'dblrightclick': this.defaultDblRightClick
        };
        var clickOptions = {
            'double': true,
            'stopDouble': true
        };
        this.handlers.click = new OpenLayers.Handler.Click(this, clickCallbacks, clickOptions);
        this.dragPan = new OpenLayers.Control.DragPan(OpenLayers.Util.extend({
            map: this.map,
            documentDrag: this.documentDrag
        }, this.dragPanOptions));
        this.zoomBox = new OpenLayers.Control.ZoomBox({
            map: this.map,
            keyMask: this.zoomBoxKeyMask
        });
        this.dragPan.draw();
        this.zoomBox.draw();
        this.handlers.wheel = new OpenLayers.Handler.MouseWheel(this, {
            "up": this.wheelUp,
            "down": this.wheelDown
        }, this.mouseWheelOptions);
        if (OpenLayers.Control.PinchZoom) {
            this.pinchZoom = new OpenLayers.Control.PinchZoom(OpenLayers.Util.extend({
                map: this.map
            }, this.pinchZoomOptions));
        }
    },
    defaultClick: function (evt) {
        if (evt.lastTouches && evt.lastTouches.length == 2) {
            this.map.zoomOut();
        }
    },
    defaultDblClick: function (evt) {
        var newCenter = this.map.getLonLatFromViewPortPx(evt.xy);
        this.map.setCenter(newCenter, this.map.zoom + 1);
    },
    defaultDblRightClick: function (evt) {
        var newCenter = this.map.getLonLatFromViewPortPx(evt.xy);
        this.map.setCenter(newCenter, this.map.zoom - 1);
    },
    wheelChange: function (evt, deltaZ) {
        var currentZoom = this.map.getZoom();
        var newZoom = this.map.getZoom() + Math.round(deltaZ);
        newZoom = Math.max(newZoom, 0);
        newZoom = Math.min(newZoom, this.map.getNumZoomLevels());
        if (newZoom === currentZoom) {
            return;
        }
        var size = this.map.getSize();
        var deltaX = size.w / 2 - evt.xy.x;
        var deltaY = evt.xy.y - size.h / 2;
        var newRes = this.map.baseLayer.getResolutionForZoom(newZoom);
        var zoomPoint = this.map.getLonLatFromPixel(evt.xy);
        var newCenter = new OpenLayers.LonLat(zoomPoint.lon + deltaX * newRes, zoomPoint.lat + deltaY * newRes);
        this.map.setCenter(newCenter, newZoom);
    },
    wheelUp: function (evt, delta) {
        this.wheelChange(evt, delta || 1);
    },
    wheelDown: function (evt, delta) {
        this.wheelChange(evt, delta || -1);
    },
    disableZoomBox: function () {
        this.zoomBoxEnabled = false;
        this.zoomBox.deactivate();
    },
    enableZoomBox: function () {
        this.zoomBoxEnabled = true;
        if (this.active) {
            this.zoomBox.activate();
        }
    },
    disableZoomWheel: function () {
        this.zoomWheelEnabled = false;
        this.handlers.wheel.deactivate();
    },
    enableZoomWheel: function () {
        this.zoomWheelEnabled = true;
        if (this.active) {
            this.handlers.wheel.activate();
        }
    },
    CLASS_NAME: "OpenLayers.Control.Navigation"
});
OpenLayers.Control.MousePosition = OpenLayers.Class(OpenLayers.Control, {
    autoActivate: true,
    element: null,
    prefix: '',
    separator: ', ',
    suffix: '',
    numDigits: 5,
    granularity: 10,
    emptyString: null,
    lastXy: null,
    displayProjection: null,
    destroy: function () {
        this.deactivate();
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },
    activate: function () {
        if (OpenLayers.Control.prototype.activate.apply(this, arguments)) {
            this.map.events.register('mousemove', this, this.redraw);
            this.map.events.register('mouseout', this, this.reset);
            this.redraw();
            return true;
        } else {
            return false;
        }
    },
    deactivate: function () {
        if (OpenLayers.Control.prototype.deactivate.apply(this, arguments)) {
            this.map.events.unregister('mousemove', this, this.redraw);
            this.map.events.unregister('mouseout', this, this.reset);
            this.element.innerHTML = "";
            return true;
        } else {
            return false;
        }
    },
    draw: function () {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        if (!this.element) {
            this.div.left = "";
            this.div.top = "";
            this.element = this.div;
        }
        return this.div;
    },
    redraw: function (evt) {
        var lonLat;
        if (evt == null) {
            this.reset();
            return;
        } else {
            if (this.lastXy == null || Math.abs(evt.xy.x - this.lastXy.x) > this.granularity || Math.abs(evt.xy.y - this.lastXy.y) > this.granularity) {
                this.lastXy = evt.xy;
                return;
            }
            lonLat = this.map.getLonLatFromPixel(evt.xy);
            if (!lonLat) {
                return;
            }
            if (this.displayProjection) {
                lonLat.transform(this.map.getProjectionObject(), this.displayProjection);
            }
            this.lastXy = evt.xy;
        }
        var newHtml = this.formatOutput(lonLat);
        if (newHtml != this.element.innerHTML) {
            this.element.innerHTML = newHtml;
        }
    },
    reset: function (evt) {
        if (this.emptyString != null) {
            this.element.innerHTML = this.emptyString;
        }
    },
    formatOutput: function (lonLat) {
        var digits = parseInt(this.numDigits);
        var newHtml = this.prefix +
            lonLat.lon.toFixed(digits) +
            this.separator +
            lonLat.lat.toFixed(digits) +
            this.suffix;
        return newHtml;
    },
    CLASS_NAME: "OpenLayers.Control.MousePosition"
});
OpenLayers.Control.PanZoom = OpenLayers.Class(OpenLayers.Control, {
    slideFactor: 50,
    slideRatio: null,
    buttons: null,
    position: null,
    initialize: function (options) {
        this.position = new OpenLayers.Pixel(OpenLayers.Control.PanZoom.X, OpenLayers.Control.PanZoom.Y);
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },
    destroy: function () {
        if (this.map) {
            this.map.events.unregister("buttonclick", this, this.onButtonClick);
        }
        this.removeButtons();
        this.buttons = null;
        this.position = null;
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },
    setMap: function (map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
        this.map.events.register("buttonclick", this, this.onButtonClick);
    },
    draw: function (px) {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        px = this.position;
        this.buttons = [];
        var sz = {
            w: 18,
            h: 18
        };
        var centered = new OpenLayers.Pixel(px.x + sz.w / 2, px.y);
        this._addButton("panup", "north-mini.png", centered, sz);
        px.y = centered.y + sz.h;
        this._addButton("panleft", "west-mini.png", px, sz);
        this._addButton("panright", "east-mini.png", px.add(sz.w, 0), sz);
        this._addButton("pandown", "south-mini.png", centered.add(0, sz.h * 2), sz);
        this._addButton("zoomin", "zoom-plus-mini.png", centered.add(0, sz.h * 3 + 5), sz);
        this._addButton("zoomworld", "zoom-world-mini.png", centered.add(0, sz.h * 4 + 5), sz);
        this._addButton("zoomout", "zoom-minus-mini.png", centered.add(0, sz.h * 5 + 5), sz);
        return this.div;
    },
    _addButton: function (id, img, xy, sz) {
        var imgLocation = OpenLayers.Util.getImageLocation(img);
        var btn = OpenLayers.Util.createAlphaImageDiv(this.id + "_" + id, xy, sz, imgLocation, "absolute");
        btn.style.cursor = "pointer";
        this.div.appendChild(btn);
        btn.action = id;
        btn.className = "olButton";
        this.buttons.push(btn);
        return btn;
    },
    _removeButton: function (btn) {
        this.div.removeChild(btn);
        OpenLayers.Util.removeItem(this.buttons, btn);
    },
    removeButtons: function () {
        for (var i = this.buttons.length - 1; i >= 0; --i) {
            this._removeButton(this.buttons[i]);
        }
    },
    onButtonClick: function (evt) {
        var btn = evt.buttonElement;
        switch (btn.action) {
        case "panup":
            this.map.pan(0, -this.getSlideFactor("h"));
            break;
        case "pandown":
            this.map.pan(0, this.getSlideFactor("h"));
            break;
        case "panleft":
            this.map.pan(-this.getSlideFactor("w"), 0);
            break;
        case "panright":
            this.map.pan(this.getSlideFactor("w"), 0);
            break;
        case "zoomin":
            this.map.zoomIn();
            break;
        case "zoomout":
            this.map.zoomOut();
            break;
        case "zoomworld":
            this.map.zoomToMaxExtent();
            break;
        }
    },
    getSlideFactor: function (dim) {
        return this.slideRatio ? this.map.getSize()[dim] * this.slideRatio : this.slideFactor;
    },
    CLASS_NAME: "OpenLayers.Control.PanZoom"
});
OpenLayers.Control.PanZoom.X = 4;
OpenLayers.Control.PanZoom.Y = 4;
OpenLayers.Control.PanZoomBar = OpenLayers.Class(OpenLayers.Control.PanZoom, {
    zoomStopWidth: 18,
    zoomStopHeight: 11,
    slider: null,
    sliderEvents: null,
    zoombarDiv: null,
    zoomWorldIcon: false,
    panIcons: true,
    forceFixedZoomLevel: false,
    mouseDragStart: null,
    deltaY: null,
    zoomStart: null,
    destroy: function () {
        this._removeZoomBar();
        this.map.events.un({
            "changebaselayer": this.redraw,
            scope: this
        });
        OpenLayers.Control.PanZoom.prototype.destroy.apply(this, arguments);
        delete this.mouseDragStart;
        delete this.zoomStart;
    },
    setMap: function (map) {
        OpenLayers.Control.PanZoom.prototype.setMap.apply(this, arguments);
        this.map.events.register("changebaselayer", this, this.redraw);
    },
    redraw: function () {
        if (this.div != null) {
            this.removeButtons();
            this._removeZoomBar();
        }
        this.draw();
    },
    draw: function (px) {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        px = this.position.clone();
        this.buttons = [];
        var sz = {
            w: 18,
            h: 18
        };
        if (this.panIcons) {
            var centered = new OpenLayers.Pixel(px.x + sz.w / 2, px.y);
            var wposition = sz.w;
            if (this.zoomWorldIcon) {
                centered = new OpenLayers.Pixel(px.x + sz.w, px.y);
            }
            this._addButton("panup", "north-mini.png", centered, sz);
            px.y = centered.y + sz.h;
            this._addButton("panleft", "west-mini.png", px, sz);
            if (this.zoomWorldIcon) {
                this._addButton("zoomworld", "zoom-world-mini.png", px.add(sz.w, 0), sz);
                wposition *= 2;
            }
            this._addButton("panright", "east-mini.png", px.add(wposition, 0), sz);
            this._addButton("pandown", "south-mini.png", centered.add(0, sz.h * 2), sz);
            this._addButton("zoomin", "zoom-plus-mini.png", centered.add(0, sz.h * 3 + 5), sz);
            centered = this._addZoomBar(centered.add(0, sz.h * 4 + 5));
            this._addButton("zoomout", "zoom-minus-mini.png", centered, sz);
        } else {
            this._addButton("zoomin", "zoom-plus-mini.png", px, sz);
            centered = this._addZoomBar(px.add(0, sz.h));
            this._addButton("zoomout", "zoom-minus-mini.png", centered, sz);
            if (this.zoomWorldIcon) {
                centered = centered.add(0, sz.h + 3);
                this._addButton("zoomworld", "zoom-world-mini.png", centered, sz);
            }
        }
        return this.div;
    },
    _addZoomBar: function (centered) {
        var imgLocation = OpenLayers.Util.getImageLocation("slider.png");
        var id = this.id + "_" + this.map.id;
        var zoomsToEnd = this.map.getNumZoomLevels() - 1 - this.map.getZoom();
        var slider = OpenLayers.Util.createAlphaImageDiv(id, centered.add(-1, zoomsToEnd * this.zoomStopHeight), {
            w: 20,
            h: 9
        }, imgLocation, "absolute");
        slider.style.cursor = "move";
        this.slider = slider;
        this.sliderEvents = new OpenLayers.Events(this, slider, null, true, {
            includeXY: true
        });
        this.sliderEvents.on({
            "touchstart": this.zoomBarDown,
            "touchmove": this.zoomBarDrag,
            "touchend": this.zoomBarUp,
            "mousedown": this.zoomBarDown,
            "mousemove": this.zoomBarDrag,
            "mouseup": this.zoomBarUp
        });
        var sz = {
            w: this.zoomStopWidth,
            h: this.zoomStopHeight * this.map.getNumZoomLevels()
        };
        var imgLocation = OpenLayers.Util.getImageLocation("zoombar.png");
        var div = null;
        if (OpenLayers.Util.alphaHack()) {
            var id = this.id + "_" + this.map.id;
            div = OpenLayers.Util.createAlphaImageDiv(id, centered, {
                w: sz.w,
                h: this.zoomStopHeight
            }, imgLocation, "absolute", null, "crop");
            div.style.height = sz.h + "px";
        } else {
            div = OpenLayers.Util.createDiv('OpenLayers_Control_PanZoomBar_Zoombar' + this.map.id, centered, sz, imgLocation);
        }
        div.style.cursor = "pointer";
        div.className = "olButton";
        this.zoombarDiv = div;
        this.div.appendChild(div);
        this.startTop = parseInt(div.style.top);
        this.div.appendChild(slider);
        this.map.events.register("zoomend", this, this.moveZoomBar);
        centered = centered.add(0, this.zoomStopHeight * this.map.getNumZoomLevels());
        return centered;
    },
    _removeZoomBar: function () {
        this.sliderEvents.un({
            "touchstart": this.zoomBarDown,
            "touchmove": this.zoomBarDrag,
            "touchend": this.zoomBarUp,
            "mousedown": this.zoomBarDown,
            "mousemove": this.zoomBarDrag,
            "mouseup": this.zoomBarUp
        });
        this.sliderEvents.destroy();
        this.div.removeChild(this.zoombarDiv);
        this.zoombarDiv = null;
        this.div.removeChild(this.slider);
        this.slider = null;
        this.map.events.unregister("zoomend", this, this.moveZoomBar);
    },
    onButtonClick: function (evt) {
        OpenLayers.Control.PanZoom.prototype.onButtonClick.apply(this, arguments);
        if (evt.buttonElement === this.zoombarDiv) {
            var levels = evt.buttonXY.y / this.zoomStopHeight;
            if (this.forceFixedZoomLevel || !this.map.fractionalZoom) {
                levels = Math.floor(levels);
            }
            var zoom = (this.map.getNumZoomLevels() - 1) - levels;
            zoom = Math.min(Math.max(zoom, 0), this.map.getNumZoomLevels() - 1);
            this.map.zoomTo(zoom);
        }
    },
    passEventToSlider: function (evt) {
        this.sliderEvents.handleBrowserEvent(evt);
    },
    zoomBarDown: function (evt) {
        if (!OpenLayers.Event.isLeftClick(evt) && !OpenLayers.Event.isSingleTouch(evt)) {
            return;
        }
        this.map.events.on({
            "touchmove": this.passEventToSlider,
            "mousemove": this.passEventToSlider,
            "mouseup": this.passEventToSlider,
            scope: this
        });
        this.mouseDragStart = evt.xy.clone();
        this.zoomStart = evt.xy.clone();
        this.div.style.cursor = "move";
        this.zoombarDiv.offsets = null;
        OpenLayers.Event.stop(evt);
    },
    zoomBarDrag: function (evt) {
        if (this.mouseDragStart != null) {
            var deltaY = this.mouseDragStart.y - evt.xy.y;
            var offsets = OpenLayers.Util.pagePosition(this.zoombarDiv);
            if ((evt.clientY - offsets[1]) > 0 && (evt.clientY - offsets[1]) < parseInt(this.zoombarDiv.style.height) - 2) {
                var newTop = parseInt(this.slider.style.top) - deltaY;
                this.slider.style.top = newTop + "px";
                this.mouseDragStart = evt.xy.clone();
            }
            this.deltaY = this.zoomStart.y - evt.xy.y;
            OpenLayers.Event.stop(evt);
        }
    },
    zoomBarUp: function (evt) {
        if (!OpenLayers.Event.isLeftClick(evt) && evt.type !== "touchend") {
            return;
        }
        if (this.mouseDragStart) {
            this.div.style.cursor = "";
            this.map.events.un({
                "touchmove": this.passEventToSlider,
                "mouseup": this.passEventToSlider,
                "mousemove": this.passEventToSlider,
                scope: this
            });
            var zoomLevel = this.map.zoom;
            if (!this.forceFixedZoomLevel && this.map.fractionalZoom) {
                zoomLevel += this.deltaY / this.zoomStopHeight;
                zoomLevel = Math.min(Math.max(zoomLevel, 0), this.map.getNumZoomLevels() - 1);
            } else {
                zoomLevel += this.deltaY / this.zoomStopHeight;
                zoomLevel = Math.max(Math.round(zoomLevel), 0);
            }
            this.map.zoomTo(zoomLevel);
            this.mouseDragStart = null;
            this.zoomStart = null;
            this.deltaY = 0;
            OpenLayers.Event.stop(evt);
        }
    },
    moveZoomBar: function () {
        var newTop = ((this.map.getNumZoomLevels() - 1) - this.map.getZoom()) * this.zoomStopHeight + this.startTop + 1;
        this.slider.style.top = newTop + "px";
    },
    CLASS_NAME: "OpenLayers.Control.PanZoomBar"
});
OpenLayers.Control.ArgParser = OpenLayers.Class(OpenLayers.Control, {
    center: null,
    zoom: null,
    layers: null,
    displayProjection: null,
    getParameters: function (url) {
        url = url || window.location.href;
        var parameters = OpenLayers.Util.getParameters(url);
        var index = url.indexOf('#');
        if (index > 0) {
            url = '?' + url.substring(index + 1, url.length);
            OpenLayers.Util.extend(parameters, OpenLayers.Util.getParameters(url));
        }
        return parameters;
    },
    setMap: function (map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
        for (var i = 0, len = this.map.controls.length; i < len; i++) {
            var control = this.map.controls[i];
            if ((control != this) && (control.CLASS_NAME == "OpenLayers.Control.ArgParser")) {
                if (control.displayProjection != this.displayProjection) {
                    this.displayProjection = control.displayProjection;
                }
                break;
            }
        }
        if (i == this.map.controls.length) {
            var args = this.getParameters();
            if (args.layers) {
                this.layers = args.layers;
                this.map.events.register('addlayer', this, this.configureLayers);
                this.configureLayers();
            }
            if (args.lat && args.lon) {
                this.center = new OpenLayers.LonLat(parseFloat(args.lon), parseFloat(args.lat));
                if (args.zoom) {
                    this.zoom = parseFloat(args.zoom);
                }
                this.map.events.register('changebaselayer', this, this.setCenter);
                this.setCenter();
            }
        }
    },
    setCenter: function () {
        if (this.map.baseLayer) {
            this.map.events.unregister('changebaselayer', this, this.setCenter);
            if (this.displayProjection) {
                this.center.transform(this.displayProjection, this.map.getProjectionObject());
            }
            this.map.setCenter(this.center, this.zoom);
        }
    },
    configureLayers: function () {
        if (this.layers.length == this.map.layers.length) {
            this.map.events.unregister('addlayer', this, this.configureLayers);
            for (var i = 0, len = this.layers.length; i < len; i++) {
                var layer = this.map.layers[i];
                var c = this.layers.charAt(i);
                if (c == "B") {
                    this.map.setBaseLayer(layer);
                } else if ((c == "T") || (c == "F")) {
                    layer.setVisibility(c == "T");
                }
            }
        }
    },
    CLASS_NAME: "OpenLayers.Control.ArgParser"
});
OpenLayers.Control.Permalink = OpenLayers.Class(OpenLayers.Control, {
    argParserClass: OpenLayers.Control.ArgParser,
    element: null,
    anchor: false,
    base: '',
    displayProjection: null,
    initialize: function (element, base, options) {
        if (element !== null && typeof element == 'object' && !OpenLayers.Util.isElement(element)) {
            options = element;
            this.base = document.location.href;
            OpenLayers.Control.prototype.initialize.apply(this, [options]);
            if (this.element != null) {
                this.element = OpenLayers.Util.getElement(this.element);
            }
        } else {
            OpenLayers.Control.prototype.initialize.apply(this, [options]);
            this.element = OpenLayers.Util.getElement(element);
            this.base = base || document.location.href;
        }
    },
    destroy: function () {
        if (this.element && this.element.parentNode == this.div) {
            this.div.removeChild(this.element);
            this.element = null;
        }
        if (this.map) {
            this.map.events.unregister('moveend', this, this.updateLink);
        }
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },
    setMap: function (map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
        for (var i = 0, len = this.map.controls.length; i < len; i++) {
            var control = this.map.controls[i];
            if (control.CLASS_NAME == this.argParserClass.CLASS_NAME) {
                if (control.displayProjection != this.displayProjection) {
                    this.displayProjection = control.displayProjection;
                }
                break;
            }
        }
        if (i == this.map.controls.length) {
            this.map.addControl(new this.argParserClass({
                'displayProjection': this.displayProjection
            }));
        }
    },
    draw: function () {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        if (!this.element && !this.anchor) {
            this.element = document.createElement("a");
            this.element.innerHTML = OpenLayers.i18n("Permalink");
            this.element.href = "";
            this.div.appendChild(this.element);
        }
        this.map.events.on({
            'moveend': this.updateLink,
            'changelayer': this.updateLink,
            'changebaselayer': this.updateLink,
            scope: this
        });
        this.updateLink();
        return this.div;
    },
    updateLink: function () {
        var separator = this.anchor ? '#' : '?';
        var href = this.base;
        if (href.indexOf(separator) != -1) {
            href = href.substring(0, href.indexOf(separator));
        }
        href += separator + OpenLayers.Util.getParameterString(this.createParams());
        if (this.anchor && !this.element) {
            window.location.href = href;
        } else {
            this.element.href = href;
        }
    },
    createParams: function (center, zoom, layers) {
        center = center || this.map.getCenter();
        var params = OpenLayers.Util.getParameters(this.base);
        if (center) {
            params.zoom = zoom || this.map.getZoom();
            var lat = center.lat;
            var lon = center.lon;
            if (this.displayProjection) {
                var mapPosition = OpenLayers.Projection.transform({
                    x: lon,
                    y: lat
                }, this.map.getProjectionObject(), this.displayProjection);
                lon = mapPosition.x;
                lat = mapPosition.y;
            }
            params.lat = Math.round(lat * 100000) / 100000;
            params.lon = Math.round(lon * 100000) / 100000;
            layers = layers || this.map.layers;
            params.layers = '';
            for (var i = 0, len = layers.length; i < len; i++) {
                var layer = layers[i];
                if (layer.isBaseLayer) {
                    params.layers += (layer == this.map.baseLayer) ? "B" : "0";
                } else {
                    params.layers += (layer.getVisibility()) ? "T" : "F";
                }
            }
        }
        return params;
    },
    CLASS_NAME: "OpenLayers.Control.Permalink"
});
OpenLayers.Control.ScaleLine = OpenLayers.Class(OpenLayers.Control, {
    maxWidth: 100,
    topOutUnits: "km",
    topInUnits: "m",
    bottomOutUnits: "mi",
    bottomInUnits: "ft",
    eTop: null,
    eBottom: null,
    geodesic: false,
    draw: function () {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        if (!this.eTop) {
            this.eTop = document.createElement("div");
            this.eTop.className = this.displayClass + "Top";
            var theLen = this.topInUnits.length;
            this.div.appendChild(this.eTop);
            if ((this.topOutUnits == "") || (this.topInUnits == "")) {
                this.eTop.style.visibility = "hidden";
            } else {
                this.eTop.style.visibility = "visible";
            }
            this.eBottom = document.createElement("div");
            this.eBottom.className = this.displayClass + "Bottom";
            this.div.appendChild(this.eBottom);
            if ((this.bottomOutUnits == "") || (this.bottomInUnits == "")) {
                this.eBottom.style.visibility = "hidden";
            } else {
                this.eBottom.style.visibility = "visible";
            }
        }
        this.map.events.register('moveend', this, this.update);
        this.update();
        return this.div;
    },
    getBarLen: function (maxLen) {
        var digits = parseInt(Math.log(maxLen) / Math.log(10));
        var pow10 = Math.pow(10, digits);
        var firstChar = parseInt(maxLen / pow10);
        var barLen;
        if (firstChar > 5) {
            barLen = 5;
        } else if (firstChar > 2) {
            barLen = 2;
        } else {
            barLen = 1;
        }
        return barLen * pow10;
    },
    update: function () {
        var res = this.map.getResolution();
        if (!res) {
            return;
        }
        var curMapUnits = this.map.getUnits();
        var inches = OpenLayers.INCHES_PER_UNIT;
        var maxSizeData = this.maxWidth * res * inches[curMapUnits];
        var geodesicRatio = 1;
        if (this.geodesic === true) {
            var maxSizeGeodesic = (this.map.getGeodesicPixelSize().w || 0.000001) * this.maxWidth;
            var maxSizeKilometers = maxSizeData / inches["km"];
            geodesicRatio = maxSizeGeodesic / maxSizeKilometers;
            maxSizeData *= geodesicRatio;
        }
        var topUnits;
        var bottomUnits;
        if (maxSizeData > 100000) {
            topUnits = this.topOutUnits;
            bottomUnits = this.bottomOutUnits;
        } else {
            topUnits = this.topInUnits;
            bottomUnits = this.bottomInUnits;
        }
        var topMax = maxSizeData / inches[topUnits];
        var bottomMax = maxSizeData / inches[bottomUnits];
        var topRounded = this.getBarLen(topMax);
        var bottomRounded = this.getBarLen(bottomMax);
        topMax = topRounded / inches[curMapUnits] * inches[topUnits];
        bottomMax = bottomRounded / inches[curMapUnits] * inches[bottomUnits];
        var topPx = topMax / res / geodesicRatio;
        var bottomPx = bottomMax / res / geodesicRatio;
        if (this.eBottom.style.visibility == "visible") {
            this.eBottom.style.width = Math.round(bottomPx) + "px";
            this.eBottom.innerHTML = bottomRounded + " " + bottomUnits;
        }
        if (this.eTop.style.visibility == "visible") {
            this.eTop.style.width = Math.round(topPx) + "px";
            this.eTop.innerHTML = topRounded + " " + topUnits;
        }
    },
    CLASS_NAME: "OpenLayers.Control.ScaleLine"
});
OpenLayers.Control.LayerSwitcher = OpenLayers.Class(OpenLayers.Control, {
    roundedCorner: false,
    roundedCornerColor: "darkblue",
    layerStates: null,
    layersDiv: null,
    baseLayersDiv: null,
    baseLayers: null,
    dataLbl: null,
    dataLayersDiv: null,
    dataLayers: null,
    minimizeDiv: null,
    maximizeDiv: null,
    ascending: true,
    initialize: function (options) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.layerStates = [];
        if (this.roundedCorner) {
            OpenLayers.Console.warn('roundedCorner option is deprecated');
        }
    },
    destroy: function () {
        this.clearLayersArray("base");
        this.clearLayersArray("data");
        this.map.events.un({
            buttonclick: this.onButtonClick,
            addlayer: this.redraw,
            changelayer: this.redraw,
            removelayer: this.redraw,
            changebaselayer: this.redraw,
            scope: this
        });
        this.events.unregister("buttonclick", this, this.onButtonClick);
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },
    setMap: function (map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
        this.map.events.on({
            addlayer: this.redraw,
            changelayer: this.redraw,
            removelayer: this.redraw,
            changebaselayer: this.redraw,
            scope: this
        });
        if (this.outsideViewport) {
            this.events.attachToElement(this.div);
            this.events.register("buttonclick", this, this.onButtonClick);
        } else {
            this.map.events.register("buttonclick", this, this.onButtonClick);
        }
    },
    draw: function () {
        OpenLayers.Control.prototype.draw.apply(this);
        this.loadContents();
        if (!this.outsideViewport) {
            this.minimizeControl();
        }
        this.redraw();
        return this.div;
    },
    onButtonClick: function (evt) {
        var button = evt.buttonElement;
        if (button === this.minimizeDiv) {
            this.minimizeControl();
        } else if (button === this.maximizeDiv) {
            this.maximizeControl();
        } else if (button._layerSwitcher === this.id) {
            if (button["for"]) {
                button = document.getElementById(button["for"]);
            }
            if (!button.disabled) {
                if (button.type == "radio") {
                    button.checked = true;
                    this.map.setBaseLayer(this.map.getLayer(button._layer));
                } else {
                    button.checked = !button.checked;
                    this.updateMap();
                }
            }
        }
    },
    clearLayersArray: function (layersType) {
        this[layersType + "LayersDiv"].innerHTML = "";
        this[layersType + "Layers"] = [];
    },
    checkRedraw: function () {
        var redraw = false;
        if (!this.layerStates.length || (this.map.layers.length != this.layerStates.length)) {
            redraw = true;
        } else {
            for (var i = 0, len = this.layerStates.length; i < len; i++) {
                var layerState = this.layerStates[i];
                var layer = this.map.layers[i];
                if ((layerState.name != layer.name) || (layerState.inRange != layer.inRange) || (layerState.id != layer.id) || (layerState.visibility != layer.visibility)) {
                    redraw = true;
                    break;
                }
            }
        }
        return redraw;
    },
    redraw: function () {
        if (!this.checkRedraw()) {
            return this.div;
        }
        this.clearLayersArray("base");
        this.clearLayersArray("data");
        var containsOverlays = false;
        var containsBaseLayers = false;
        var len = this.map.layers.length;
        this.layerStates = new Array(len);
        for (var i = 0; i < len; i++) {
            var layer = this.map.layers[i];
            this.layerStates[i] = {
                'name': layer.name,
                'visibility': layer.visibility,
                'inRange': layer.inRange,
                'id': layer.id
            };
        }
        var layers = this.map.layers.slice();
        if (!this.ascending) {
            layers.reverse();
        }
        for (var i = 0, len = layers.length; i < len; i++) {
            var layer = layers[i];
            var baseLayer = layer.isBaseLayer;
            if (layer.displayInLayerSwitcher) {
                if (baseLayer) {
                    containsBaseLayers = true;
                } else {
                    containsOverlays = true;
                }
                var checked = (baseLayer) ? (layer == this.map.baseLayer) : layer.getVisibility();
                var inputElem = document.createElement("input");
                inputElem.id = this.id + "_input_" + layer.name;
                inputElem.name = (baseLayer) ? this.id + "_baseLayers" : layer.name;
                inputElem.type = (baseLayer) ? "radio" : "checkbox";
                inputElem.value = layer.name;
                inputElem.checked = checked;
                inputElem.defaultChecked = checked;
                inputElem.className = "olButton";
                inputElem._layer = layer.id;
                inputElem._layerSwitcher = this.id;
                if (!baseLayer && !layer.inRange) {
                    inputElem.disabled = true;
                }
                var labelSpan = document.createElement("label");
                labelSpan["for"] = inputElem.id;
                OpenLayers.Element.addClass(labelSpan, "labelSpan olButton");
                labelSpan._layer = layer.id;
                labelSpan._layerSwitcher = this.id;
                if (!baseLayer && !layer.inRange) {
                    labelSpan.style.color = "gray";
                }
                labelSpan.innerHTML = layer.name;
                labelSpan.style.verticalAlign = (baseLayer) ? "bottom" : "baseline";
                var br = document.createElement("br");
                var groupArray = (baseLayer) ? this.baseLayers : this.dataLayers;
                groupArray.push({
                    'layer': layer,
                    'inputElem': inputElem,
                    'labelSpan': labelSpan
                });
                var groupDiv = (baseLayer) ? this.baseLayersDiv : this.dataLayersDiv;
                groupDiv.appendChild(inputElem);
                groupDiv.appendChild(labelSpan);
                groupDiv.appendChild(br);
            }
        }
        this.dataLbl.style.display = (containsOverlays) ? "" : "none";
        this.baseLbl.style.display = (containsBaseLayers) ? "" : "none";
        return this.div;
    },
    updateMap: function () {
        for (var i = 0, len = this.baseLayers.length; i < len; i++) {
            var layerEntry = this.baseLayers[i];
            if (layerEntry.inputElem.checked) {
                this.map.setBaseLayer(layerEntry.layer, false);
            }
        }
        for (var i = 0, len = this.dataLayers.length; i < len; i++) {
            var layerEntry = this.dataLayers[i];
            layerEntry.layer.setVisibility(layerEntry.inputElem.checked);
        }
    },
    maximizeControl: function (e) {
        this.div.style.width = "";
        this.div.style.height = "";
        this.showControls(false);
        if (e != null) {
            OpenLayers.Event.stop(e);
        }
    },
    minimizeControl: function (e) {
        this.div.style.width = "0px";
        this.div.style.height = "0px";
        this.showControls(true);
        if (e != null) {
            OpenLayers.Event.stop(e);
        }
    },
    showControls: function (minimize) {
        this.maximizeDiv.style.display = minimize ? "" : "none";
        this.minimizeDiv.style.display = minimize ? "none" : "";
        this.layersDiv.style.display = minimize ? "none" : "";
    },
    loadContents: function () {
        this.layersDiv = document.createElement("div");
        this.layersDiv.id = this.id + "_layersDiv";
        OpenLayers.Element.addClass(this.layersDiv, "layersDiv");
        this.baseLbl = document.createElement("div");
        this.baseLbl.innerHTML = OpenLayers.i18n("Base Layer");
        OpenLayers.Element.addClass(this.baseLbl, "baseLbl");
        this.baseLayersDiv = document.createElement("div");
        OpenLayers.Element.addClass(this.baseLayersDiv, "baseLayersDiv");
        this.dataLbl = document.createElement("div");
        this.dataLbl.innerHTML = OpenLayers.i18n("Overlays");
        OpenLayers.Element.addClass(this.dataLbl, "dataLbl");
        this.dataLayersDiv = document.createElement("div");
        OpenLayers.Element.addClass(this.dataLayersDiv, "dataLayersDiv");
        if (this.ascending) {
            this.layersDiv.appendChild(this.baseLbl);
            this.layersDiv.appendChild(this.baseLayersDiv);
            this.layersDiv.appendChild(this.dataLbl);
            this.layersDiv.appendChild(this.dataLayersDiv);
        } else {
            this.layersDiv.appendChild(this.dataLbl);
            this.layersDiv.appendChild(this.dataLayersDiv);
            this.layersDiv.appendChild(this.baseLbl);
            this.layersDiv.appendChild(this.baseLayersDiv);
        }
        this.div.appendChild(this.layersDiv);
        if (this.roundedCorner) {
            OpenLayers.Rico.Corner.round(this.div, {
                corners: "tl bl",
                bgColor: "transparent",
                color: this.roundedCornerColor,
                blend: false
            });
            OpenLayers.Rico.Corner.changeOpacity(this.layersDiv, 0.75);
        }
        var img = OpenLayers.Util.getImageLocation('layer-switcher-maximize.png');
        this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MaximizeDiv", null, null, img, "absolute");
        OpenLayers.Element.addClass(this.maximizeDiv, "maximizeDiv olButton");
        this.maximizeDiv.style.display = "none";
        this.div.appendChild(this.maximizeDiv);
        var img = OpenLayers.Util.getImageLocation('layer-switcher-minimize.png');
        this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MinimizeDiv", null, null, img, "absolute");
        OpenLayers.Element.addClass(this.minimizeDiv, "minimizeDiv olButton");
        this.minimizeDiv.style.display = "none";
        this.div.appendChild(this.minimizeDiv);
    },
    CLASS_NAME: "OpenLayers.Control.LayerSwitcher"
});
OpenLayers.Control.DragFeature = OpenLayers.Class(OpenLayers.Control, {
    geometryTypes: null,
    onStart: function (feature, pixel) {},
    onDrag: function (feature, pixel) {},
    onComplete: function (feature, pixel) {},
    onEnter: function (feature) {},
    onLeave: function (feature) {},
    documentDrag: false,
    layer: null,
    feature: null,
    dragCallbacks: {},
    featureCallbacks: {},
    lastPixel: null,
    initialize: function (layer, options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        this.layer = layer;
        this.handlers = {
            drag: new OpenLayers.Handler.Drag(this, OpenLayers.Util.extend({
                down: this.downFeature,
                move: this.moveFeature,
                up: this.upFeature,
                out: this.cancel,
                done: this.doneDragging
            }, this.dragCallbacks), {
                documentDrag: this.documentDrag
            }),
            feature: new OpenLayers.Handler.Feature(this, this.layer, OpenLayers.Util.extend({
                click: this.clickFeature,
                clickout: this.clickoutFeature,
                over: this.overFeature,
                out: this.outFeature
            }, this.featureCallbacks), {
                geometryTypes: this.geometryTypes
            })
        };
    },
    clickFeature: function (feature) {
        if (this.handlers.feature.touch && !this.over && this.overFeature(feature)) {
            this.handlers.drag.dragstart(this.handlers.feature.evt);
            this.handlers.drag.stopDown = false;
        }
    },
    clickoutFeature: function (feature) {
        if (this.handlers.feature.touch && this.over) {
            this.outFeature(feature);
            this.handlers.drag.stopDown = true;
        }
    },
    destroy: function () {
        this.layer = null;
        OpenLayers.Control.prototype.destroy.apply(this, []);
    },
    activate: function () {
        return (this.handlers.feature.activate() && OpenLayers.Control.prototype.activate.apply(this, arguments));
    },
    deactivate: function () {
        this.handlers.drag.deactivate();
        this.handlers.feature.deactivate();
        this.feature = null;
        this.dragging = false;
        this.lastPixel = null;
        OpenLayers.Element.removeClass(this.map.viewPortDiv, this.displayClass + "Over");
        return OpenLayers.Control.prototype.deactivate.apply(this, arguments);
    },
    overFeature: function (feature) {
        var activated = false;
        if (!this.handlers.drag.dragging) {
            this.feature = feature;
            this.handlers.drag.activate();
            activated = true;
            this.over = true;
            OpenLayers.Element.addClass(this.map.viewPortDiv, this.displayClass + "Over");
            this.onEnter(feature);
        } else {
            if (this.feature.id == feature.id) {
                this.over = true;
            } else {
                this.over = false;
            }
        }
        return activated;
    },
    downFeature: function (pixel) {
        this.lastPixel = pixel;
        this.onStart(this.feature, pixel);
    },
    moveFeature: function (pixel) {
        var res = this.map.getResolution();
        this.feature.geometry.move(res * (pixel.x - this.lastPixel.x), res * (this.lastPixel.y - pixel.y));
        this.layer.drawFeature(this.feature);
        this.lastPixel = pixel;
        this.onDrag(this.feature, pixel);
    },
    upFeature: function (pixel) {
        if (!this.over) {
            this.handlers.drag.deactivate();
        }
    },
    doneDragging: function (pixel) {
        this.onComplete(this.feature, pixel);
    },
    outFeature: function (feature) {
        if (!this.handlers.drag.dragging) {
            this.over = false;
            this.handlers.drag.deactivate();
            OpenLayers.Element.removeClass(this.map.viewPortDiv, this.displayClass + "Over");
            this.onLeave(feature);
            this.feature = null;
        } else {
            if (this.feature.id == feature.id) {
                this.over = false;
            }
        }
    },
    cancel: function () {
        this.handlers.drag.deactivate();
        this.over = false;
    },
    setMap: function (map) {
        this.handlers.drag.setMap(map);
        this.handlers.feature.setMap(map);
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
    },
    CLASS_NAME: "OpenLayers.Control.DragFeature"
});
OpenLayers.Control.SelectFeature = OpenLayers.Class(OpenLayers.Control, {
    multipleKey: null,
    toggleKey: null,
    multiple: false,
    clickout: true,
    toggle: false,
    hover: false,
    highlightOnly: false,
    box: false,
    onBeforeSelect: function () {},
    onSelect: function () {},
    onUnselect: function () {},
    scope: null,
    geometryTypes: null,
    layer: null,
    layers: null,
    callbacks: null,
    selectStyle: null,
    renderIntent: "select",
    handlers: null,
    initialize: function (layers, options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        if (this.scope === null) {
            this.scope = this;
        }
        this.initLayer(layers);
        var callbacks = {
            click: this.clickFeature,
            clickout: this.clickoutFeature
        };
        if (this.hover) {
            callbacks.over = this.overFeature;
            callbacks.out = this.outFeature;
        }
        this.callbacks = OpenLayers.Util.extend(callbacks, this.callbacks);
        this.handlers = {
            feature: new OpenLayers.Handler.Feature(this, this.layer, this.callbacks, {
                geometryTypes: this.geometryTypes
            })
        };
        if (this.box) {
            this.handlers.box = new OpenLayers.Handler.Box(this, {
                done: this.selectBox
            }, {
                boxDivClassName: "olHandlerBoxSelectFeature"
            });
        }
    },
    initLayer: function (layers) {
        if (OpenLayers.Util.isArray(layers)) {
            this.layers = layers;
            this.layer = new OpenLayers.Layer.Vector.RootContainer(this.id + "_container", {
                layers: layers
            });
        } else {
            this.layer = layers;
        }
    },
    destroy: function () {
        if (this.active && this.layers) {
            this.map.removeLayer(this.layer);
        }
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
        if (this.layers) {
            this.layer.destroy();
        }
    },
    activate: function () {
        if (!this.active) {
            if (this.layers) {
                this.map.addLayer(this.layer);
            }
            this.handlers.feature.activate();
            if (this.box && this.handlers.box) {
                this.handlers.box.activate();
            }
        }
        return OpenLayers.Control.prototype.activate.apply(this, arguments);
    },
    deactivate: function () {
        if (this.active) {
            this.handlers.feature.deactivate();
            if (this.handlers.box) {
                this.handlers.box.deactivate();
            }
            if (this.layers) {
                this.map.removeLayer(this.layer);
            }
        }
        return OpenLayers.Control.prototype.deactivate.apply(this, arguments);
    },
    unselectAll: function (options) {
        var layers = this.layers || [this.layer];
        var layer, feature;
        for (var l = 0; l < layers.length; ++l) {
            layer = layers[l];
            for (var i = layer.selectedFeatures.length - 1; i >= 0; --i) {
                feature = layer.selectedFeatures[i];
                if (!options || options.except != feature) {
                    this.unselect(feature);
                }
            }
        }
    },
    clickFeature: function (feature) {
        if (!this.hover) {
            var selected = (OpenLayers.Util.indexOf(feature.layer.selectedFeatures, feature) > -1);
            if (selected) {
                if (this.toggleSelect()) {
                    this.unselect(feature);
                } else if (!this.multipleSelect()) {
                    this.unselectAll({
                        except: feature
                    });
                }
            } else {
                if (!this.multipleSelect()) {
                    this.unselectAll({
                        except: feature
                    });
                }
                this.select(feature);
            }
        }
    },
    multipleSelect: function () {
        return this.multiple || (this.handlers.feature.evt && this.handlers.feature.evt[this.multipleKey]);
    },
    toggleSelect: function () {
        return this.toggle || (this.handlers.feature.evt && this.handlers.feature.evt[this.toggleKey]);
    },
    clickoutFeature: function (feature) {
        if (!this.hover && this.clickout) {
            this.unselectAll();
        }
    },
    overFeature: function (feature) {
        var layer = feature.layer;
        if (this.hover) {
            if (this.highlightOnly) {
                this.highlight(feature);
            } else if (OpenLayers.Util.indexOf(layer.selectedFeatures, feature) == -1) {
                this.select(feature);
            }
        }
    },
    outFeature: function (feature) {
        if (this.hover) {
            if (this.highlightOnly) {
                if (feature._lastHighlighter == this.id) {
                    if (feature._prevHighlighter && feature._prevHighlighter != this.id) {
                        delete feature._lastHighlighter;
                        var control = this.map.getControl(feature._prevHighlighter);
                        if (control) {
                            control.highlight(feature);
                        }
                    } else {
                        this.unhighlight(feature);
                    }
                }
            } else {
                this.unselect(feature);
            }
        }
    },
    highlight: function (feature) {
        var layer = feature.layer;
        var cont = this.events.triggerEvent("beforefeaturehighlighted", {
            feature: feature
        });
        if (cont !== false) {
            feature._prevHighlighter = feature._lastHighlighter;
            feature._lastHighlighter = this.id;
            var style = this.selectStyle || this.renderIntent;
            layer.drawFeature(feature, style);
            this.events.triggerEvent("featurehighlighted", {
                feature: feature
            });
        }
    },
    unhighlight: function (feature) {
        var layer = feature.layer;
        if (feature._prevHighlighter == undefined) {
            delete feature._lastHighlighter;
        } else if (feature._prevHighlighter == this.id) {
            delete feature._prevHighlighter;
        } else {
            feature._lastHighlighter = feature._prevHighlighter;
            delete feature._prevHighlighter;
        }
        layer.drawFeature(feature, feature.style || feature.layer.style || "default");
        this.events.triggerEvent("featureunhighlighted", {
            feature: feature
        });
    },
    select: function (feature) {
        var cont = this.onBeforeSelect.call(this.scope, feature);
        var layer = feature.layer;
        if (cont !== false) {
            cont = layer.events.triggerEvent("beforefeatureselected", {
                feature: feature
            });
            if (cont !== false) {
                layer.selectedFeatures.push(feature);
                this.highlight(feature);
                if (!this.handlers.feature.lastFeature) {
                    this.handlers.feature.lastFeature = layer.selectedFeatures[0];
                }
                layer.events.triggerEvent("featureselected", {
                    feature: feature
                });
                this.onSelect.call(this.scope, feature);
            }
        }
    },
    unselect: function (feature) {
        var layer = feature.layer;
        this.unhighlight(feature);
        OpenLayers.Util.removeItem(layer.selectedFeatures, feature);
        layer.events.triggerEvent("featureunselected", {
            feature: feature
        });
        this.onUnselect.call(this.scope, feature);
    },
    selectBox: function (position) {
        if (position instanceof OpenLayers.Bounds) {
            var minXY = this.map.getLonLatFromPixel({
                x: position.left,
                y: position.bottom
            });
            var maxXY = this.map.getLonLatFromPixel({
                x: position.right,
                y: position.top
            });
            var bounds = new OpenLayers.Bounds(minXY.lon, minXY.lat, maxXY.lon, maxXY.lat);
            if (!this.multipleSelect()) {
                this.unselectAll();
            }
            var prevMultiple = this.multiple;
            this.multiple = true;
            var layers = this.layers || [this.layer];
            this.events.triggerEvent("boxselectionstart", {
                layers: layers
            });
            var layer;
            for (var l = 0; l < layers.length; ++l) {
                layer = layers[l];
                for (var i = 0, len = layer.features.length; i < len; ++i) {
                    var feature = layer.features[i];
                    if (!feature.getVisibility()) {
                        continue;
                    }
                    if (this.geometryTypes == null || OpenLayers.Util.indexOf(this.geometryTypes, feature.geometry.CLASS_NAME) > -1) {
                        if (bounds.toGeometry().intersects(feature.geometry)) {
                            if (OpenLayers.Util.indexOf(layer.selectedFeatures, feature) == -1) {
                                this.select(feature);
                            }
                        }
                    }
                }
            }
            this.multiple = prevMultiple;
            this.events.triggerEvent("boxselectionend", {
                layers: layers
            });
        }
    },
    setMap: function (map) {
        this.handlers.feature.setMap(map);
        if (this.box) {
            this.handlers.box.setMap(map);
        }
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
    },
    setLayer: function (layers) {
        var isActive = this.active;
        this.unselectAll();
        this.deactivate();
        if (this.layers) {
            this.layer.destroy();
            this.layers = null;
        }
        this.initLayer(layers);
        this.handlers.feature.layer = this.layer;
        if (isActive) {
            this.activate();
        }
    },
    CLASS_NAME: "OpenLayers.Control.SelectFeature"
});
OpenLayers.Geometry = OpenLayers.Class({
    id: null,
    parent: null,
    bounds: null,
    initialize: function () {
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },
    destroy: function () {
        this.id = null;
        this.bounds = null;
    },
    clone: function () {
        return new OpenLayers.Geometry();
    },
    setBounds: function (bounds) {
        if (bounds) {
            this.bounds = bounds.clone();
        }
    },
    clearBounds: function () {
        this.bounds = null;
        if (this.parent) {
            this.parent.clearBounds();
        }
    },
    extendBounds: function (newBounds) {
        var bounds = this.getBounds();
        if (!bounds) {
            this.setBounds(newBounds);
        } else {
            this.bounds.extend(newBounds);
        }
    },
    getBounds: function () {
        if (this.bounds == null) {
            this.calculateBounds();
        }
        return this.bounds;
    },
    calculateBounds: function () {},
    distanceTo: function (geometry, options) {},
    getVertices: function (nodes) {},
    atPoint: function (lonlat, toleranceLon, toleranceLat) {
        var atPoint = false;
        var bounds = this.getBounds();
        if ((bounds != null) && (lonlat != null)) {
            var dX = (toleranceLon != null) ? toleranceLon : 0;
            var dY = (toleranceLat != null) ? toleranceLat : 0;
            var toleranceBounds = new OpenLayers.Bounds(this.bounds.left - dX, this.bounds.bottom - dY, this.bounds.right + dX, this.bounds.top + dY);
            atPoint = toleranceBounds.containsLonLat(lonlat);
        }
        return atPoint;
    },
    getLength: function () {
        return 0.0;
    },
    getArea: function () {
        return 0.0;
    },
    getCentroid: function () {
        return null;
    },
    toString: function () {
        var string;
        if (OpenLayers.Format && OpenLayers.Format.WKT) {
            string = OpenLayers.Format.WKT.prototype.write(new OpenLayers.Feature.Vector(this));
        } else {
            string = Object.prototype.toString.call(this);
        }
        return string;
    },
    CLASS_NAME: "OpenLayers.Geometry"
});
OpenLayers.Geometry.fromWKT = function (wkt) {
    var geom;
    if (OpenLayers.Format && OpenLayers.Format.WKT) {
        var format = OpenLayers.Geometry.fromWKT.format;
        if (!format) {
            format = new OpenLayers.Format.WKT();
            OpenLayers.Geometry.fromWKT.format = format;
        }
        var result = format.read(wkt);
        if (result instanceof OpenLayers.Feature.Vector) {
            geom = result.geometry;
        } else if (OpenLayers.Util.isArray(result)) {
            var len = result.length;
            var components = new Array(len);
            for (var i = 0; i < len; ++i) {
                components[i] = result[i].geometry;
            }
            geom = new OpenLayers.Geometry.Collection(components);
        }
    }
    return geom;
};
OpenLayers.Geometry.segmentsIntersect = function (seg1, seg2, options) {
    var point = options && options.point;
    var tolerance = options && options.tolerance;
    var intersection = false;
    var x11_21 = seg1.x1 - seg2.x1;
    var y11_21 = seg1.y1 - seg2.y1;
    var x12_11 = seg1.x2 - seg1.x1;
    var y12_11 = seg1.y2 - seg1.y1;
    var y22_21 = seg2.y2 - seg2.y1;
    var x22_21 = seg2.x2 - seg2.x1;
    var d = (y22_21 * x12_11) - (x22_21 * y12_11);
    var n1 = (x22_21 * y11_21) - (y22_21 * x11_21);
    var n2 = (x12_11 * y11_21) - (y12_11 * x11_21);
    if (d == 0) {
        if (n1 == 0 && n2 == 0) {
            intersection = true;
        }
    } else {
        var along1 = n1 / d;
        var along2 = n2 / d;
        if (along1 >= 0 && along1 <= 1 && along2 >= 0 && along2 <= 1) {
            if (!point) {
                intersection = true;
            } else {
                var x = seg1.x1 + (along1 * x12_11);
                var y = seg1.y1 + (along1 * y12_11);
                intersection = new OpenLayers.Geometry.Point(x, y);
            }
        }
    }
    if (tolerance) {
        var dist;
        if (intersection) {
            if (point) {
                var segs = [seg1, seg2];
                var seg, x, y;
                outer: for (var i = 0; i < 2; ++i) {
                    seg = segs[i];
                    for (var j = 1; j < 3; ++j) {
                        x = seg["x" + j];
                        y = seg["y" + j];
                        dist = Math.sqrt(Math.pow(x - intersection.x, 2) +
                            Math.pow(y - intersection.y, 2));
                        if (dist < tolerance) {
                            intersection.x = x;
                            intersection.y = y;
                            break outer;
                        }
                    }
                }
            }
        } else {
            var segs = [seg1, seg2];
            var source, target, x, y, p, result;
            outer: for (var i = 0; i < 2; ++i) {
                source = segs[i];
                target = segs[(i + 1) % 2];
                for (var j = 1; j < 3; ++j) {
                    p = {
                        x: source["x" + j],
                        y: source["y" + j]
                    };
                    result = OpenLayers.Geometry.distanceToSegment(p, target);
                    if (result.distance < tolerance) {
                        if (point) {
                            intersection = new OpenLayers.Geometry.Point(p.x, p.y);
                        } else {
                            intersection = true;
                        }
                        break outer;
                    }
                }
            }
        }
    }
    return intersection;
};
OpenLayers.Geometry.distanceToSegment = function (point, segment) {
    var x0 = point.x;
    var y0 = point.y;
    var x1 = segment.x1;
    var y1 = segment.y1;
    var x2 = segment.x2;
    var y2 = segment.y2;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var along = ((dx * (x0 - x1)) + (dy * (y0 - y1))) / (Math.pow(dx, 2) + Math.pow(dy, 2));
    var x, y;
    if (along <= 0.0) {
        x = x1;
        y = y1;
    } else if (along >= 1.0) {
        x = x2;
        y = y2;
    } else {
        x = x1 + along * dx;
        y = y1 + along * dy;
    }
    return {
        distance: Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2)),
        x: x,
        y: y
    };
};
OpenLayers.Geometry.Collection = OpenLayers.Class(OpenLayers.Geometry, {
    components: null,
    componentTypes: null,
    initialize: function (components) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
        this.components = [];
        if (components != null) {
            this.addComponents(components);
        }
    },
    destroy: function () {
        this.components.length = 0;
        this.components = null;
        OpenLayers.Geometry.prototype.destroy.apply(this, arguments);
    },
    clone: function () {
        var geometry = eval("new " + this.CLASS_NAME + "()");
        for (var i = 0, len = this.components.length; i < len; i++) {
            geometry.addComponent(this.components[i].clone());
        }
        OpenLayers.Util.applyDefaults(geometry, this);
        return geometry;
    },
    getComponentsString: function () {
        var strings = [];
        for (var i = 0, len = this.components.length; i < len; i++) {
            strings.push(this.components[i].toShortString());
        }
        return strings.join(",");
    },
    calculateBounds: function () {
        this.bounds = null;
        var bounds = new OpenLayers.Bounds();
        var components = this.components;
        if (components) {
            for (var i = 0, len = components.length; i < len; i++) {
                bounds.extend(components[i].getBounds());
            }
        }
        if (bounds.left != null && bounds.bottom != null && bounds.right != null && bounds.top != null) {
            this.setBounds(bounds);
        }
    },
    addComponents: function (components) {
        if (!(OpenLayers.Util.isArray(components))) {
            components = [components];
        }
        for (var i = 0, len = components.length; i < len; i++) {
            this.addComponent(components[i]);
        }
    },
    addComponent: function (component, index) {
        var added = false;
        if (component) {
            if (this.componentTypes == null || (OpenLayers.Util.indexOf(this.componentTypes, component.CLASS_NAME) > -1)) {
                if (index != null && (index < this.components.length)) {
                    var components1 = this.components.slice(0, index);
                    var components2 = this.components.slice(index, this.components.length);
                    components1.push(component);
                    this.components = components1.concat(components2);
                } else {
                    this.components.push(component);
                }
                component.parent = this;
                this.clearBounds();
                added = true;
            }
        }
        return added;
    },
    removeComponents: function (components) {
        var removed = false;
        if (!(OpenLayers.Util.isArray(components))) {
            components = [components];
        }
        for (var i = components.length - 1; i >= 0; --i) {
            removed = this.removeComponent(components[i]) || removed;
        }
        return removed;
    },
    removeComponent: function (component) {
        OpenLayers.Util.removeItem(this.components, component);
        this.clearBounds();
        return true;
    },
    getLength: function () {
        var length = 0.0;
        for (var i = 0, len = this.components.length; i < len; i++) {
            length += this.components[i].getLength();
        }
        return length;
    },
    getArea: function () {
        var area = 0.0;
        for (var i = 0, len = this.components.length; i < len; i++) {
            area += this.components[i].getArea();
        }
        return area;
    },
    getGeodesicArea: function (projection) {
        var area = 0.0;
        for (var i = 0, len = this.components.length; i < len; i++) {
            area += this.components[i].getGeodesicArea(projection);
        }
        return area;
    },
    getCentroid: function (weighted) {
        if (!weighted) {
            return this.components.length && this.components[0].getCentroid();
        }
        var len = this.components.length;
        if (!len) {
            return false;
        }
        var areas = [];
        var centroids = [];
        var areaSum = 0;
        var minArea = Number.MAX_VALUE;
        var component;
        for (var i = 0; i < len; ++i) {
            component = this.components[i];
            var area = component.getArea();
            var centroid = component.getCentroid(true);
            if (isNaN(area) || isNaN(centroid.x) || isNaN(centroid.y)) {
                continue;
            }
            areas.push(area);
            areaSum += area;
            minArea = (area < minArea && area > 0) ? area : minArea;
            centroids.push(centroid);
        }
        len = areas.length;
        if (areaSum === 0) {
            for (var i = 0; i < len; ++i) {
                areas[i] = 1;
            }
            areaSum = areas.length;
        } else {
            for (var i = 0; i < len; ++i) {
                areas[i] /= minArea;
            }
            areaSum /= minArea;
        }
        var xSum = 0,
            ySum = 0,
            centroid, area;
        for (var i = 0; i < len; ++i) {
            centroid = centroids[i];
            area = areas[i];
            xSum += centroid.x * area;
            ySum += centroid.y * area;
        }
        return new OpenLayers.Geometry.Point(xSum / areaSum, ySum / areaSum);
    },
    getGeodesicLength: function (projection) {
        var length = 0.0;
        for (var i = 0, len = this.components.length; i < len; i++) {
            length += this.components[i].getGeodesicLength(projection);
        }
        return length;
    },
    move: function (x, y) {
        for (var i = 0, len = this.components.length; i < len; i++) {
            this.components[i].move(x, y);
        }
    },
    rotate: function (angle, origin) {
        for (var i = 0, len = this.components.length; i < len; ++i) {
            this.components[i].rotate(angle, origin);
        }
    },
    resize: function (scale, origin, ratio) {
        for (var i = 0; i < this.components.length; ++i) {
            this.components[i].resize(scale, origin, ratio);
        }
        return this;
    },
    distanceTo: function (geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var result, best, distance;
        var min = Number.POSITIVE_INFINITY;
        for (var i = 0, len = this.components.length; i < len; ++i) {
            result = this.components[i].distanceTo(geometry, options);
            distance = details ? result.distance : result;
            if (distance < min) {
                min = distance;
                best = result;
                if (min == 0) {
                    break;
                }
            }
        }
        return best;
    },
    equals: function (geometry) {
        var equivalent = true;
        if (!geometry || !geometry.CLASS_NAME || (this.CLASS_NAME != geometry.CLASS_NAME)) {
            equivalent = false;
        } else if (!(OpenLayers.Util.isArray(geometry.components)) || (geometry.components.length != this.components.length)) {
            equivalent = false;
        } else {
            for (var i = 0, len = this.components.length; i < len; ++i) {
                if (!this.components[i].equals(geometry.components[i])) {
                    equivalent = false;
                    break;
                }
            }
        }
        return equivalent;
    },
    transform: function (source, dest) {
        if (source && dest) {
            for (var i = 0, len = this.components.length; i < len; i++) {
                var component = this.components[i];
                component.transform(source, dest);
            }
            this.bounds = null;
        }
        return this;
    },
    intersects: function (geometry) {
        var intersect = false;
        for (var i = 0, len = this.components.length; i < len; ++i) {
            intersect = geometry.intersects(this.components[i]);
            if (intersect) {
                break;
            }
        }
        return intersect;
    },
    getVertices: function (nodes) {
        var vertices = [];
        for (var i = 0, len = this.components.length; i < len; ++i) {
            Array.prototype.push.apply(vertices, this.components[i].getVertices(nodes));
        }
        return vertices;
    },
    CLASS_NAME: "OpenLayers.Geometry.Collection"
});
OpenLayers.Geometry.Point = OpenLayers.Class(OpenLayers.Geometry, {
    x: null,
    y: null,
    initialize: function (x, y) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    },
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Geometry.Point(this.x, this.y);
        }
        OpenLayers.Util.applyDefaults(obj, this);
        return obj;
    },
    calculateBounds: function () {
        this.bounds = new OpenLayers.Bounds(this.x, this.y, this.x, this.y);
    },
    distanceTo: function (geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var distance, x0, y0, x1, y1, result;
        if (geometry instanceof OpenLayers.Geometry.Point) {
            x0 = this.x;
            y0 = this.y;
            x1 = geometry.x;
            y1 = geometry.y;
            distance = Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
            result = !details ? distance : {
                x0: x0,
                y0: y0,
                x1: x1,
                y1: y1,
                distance: distance
            };
        } else {
            result = geometry.distanceTo(this, options);
            if (details) {
                result = {
                    x0: result.x1,
                    y0: result.y1,
                    x1: result.x0,
                    y1: result.y0,
                    distance: result.distance
                };
            }
        }
        return result;
    },
    equals: function (geom) {
        var equals = false;
        if (geom != null) {
            equals = ((this.x == geom.x && this.y == geom.y) || (isNaN(this.x) && isNaN(this.y) && isNaN(geom.x) && isNaN(geom.y)));
        }
        return equals;
    },
    toShortString: function () {
        return (this.x + ", " + this.y);
    },
    move: function (x, y) {
        this.x = this.x + x;
        this.y = this.y + y;
        this.clearBounds();
    },
    rotate: function (angle, origin) {
        angle *= Math.PI / 180;
        var radius = this.distanceTo(origin);
        var theta = angle + Math.atan2(this.y - origin.y, this.x - origin.x);
        this.x = origin.x + (radius * Math.cos(theta));
        this.y = origin.y + (radius * Math.sin(theta));
        this.clearBounds();
    },
    getCentroid: function () {
        return new OpenLayers.Geometry.Point(this.x, this.y);
    },
    resize: function (scale, origin, ratio) {
        ratio = (ratio == undefined) ? 1 : ratio;
        this.x = origin.x + (scale * ratio * (this.x - origin.x));
        this.y = origin.y + (scale * (this.y - origin.y));
        this.clearBounds();
        return this;
    },
    intersects: function (geometry) {
        var intersect = false;
        if (geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            intersect = this.equals(geometry);
        } else {
            intersect = geometry.intersects(this);
        }
        return intersect;
    },
    transform: function (source, dest) {
        if ((source && dest)) {
            OpenLayers.Projection.transform(this, source, dest);
            this.bounds = null;
        }
        return this;
    },
    getVertices: function (nodes) {
        return [this];
    },
    CLASS_NAME: "OpenLayers.Geometry.Point"
});
OpenLayers.Geometry.MultiPoint = OpenLayers.Class(OpenLayers.Geometry.Collection, {
    componentTypes: ["OpenLayers.Geometry.Point"],
    addPoint: function (point, index) {
        this.addComponent(point, index);
    },
    removePoint: function (point) {
        this.removeComponent(point);
    },
    CLASS_NAME: "OpenLayers.Geometry.MultiPoint"
});
OpenLayers.Geometry.Curve = OpenLayers.Class(OpenLayers.Geometry.MultiPoint, {
    componentTypes: ["OpenLayers.Geometry.Point"],
    getLength: function () {
        var length = 0.0;
        if (this.components && (this.components.length > 1)) {
            for (var i = 1, len = this.components.length; i < len; i++) {
                length += this.components[i - 1].distanceTo(this.components[i]);
            }
        }
        return length;
    },
    getGeodesicLength: function (projection) {
        var geom = this;
        if (projection) {
            var gg = new OpenLayers.Projection("EPSG:4326");
            if (!gg.equals(projection)) {
                geom = this.clone().transform(projection, gg);
            }
        }
        var length = 0.0;
        if (geom.components && (geom.components.length > 1)) {
            var p1, p2;
            for (var i = 1, len = geom.components.length; i < len; i++) {
                p1 = geom.components[i - 1];
                p2 = geom.components[i];
                length += OpenLayers.Util.distVincenty({
                    lon: p1.x,
                    lat: p1.y
                }, {
                    lon: p2.x,
                    lat: p2.y
                });
            }
        }
        return length * 1000;
    },
    CLASS_NAME: "OpenLayers.Geometry.Curve"
});
OpenLayers.Geometry.LineString = OpenLayers.Class(OpenLayers.Geometry.Curve, {
    removeComponent: function (point) {
        var removed = this.components && (this.components.length > 2);
        if (removed) {
            OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this, arguments);
        }
        return removed;
    },
    intersects: function (geometry) {
        var intersect = false;
        var type = geometry.CLASS_NAME;
        if (type == "OpenLayers.Geometry.LineString" || type == "OpenLayers.Geometry.LinearRing" || type == "OpenLayers.Geometry.Point") {
            var segs1 = this.getSortedSegments();
            var segs2;
            if (type == "OpenLayers.Geometry.Point") {
                segs2 = [{
                        x1: geometry.x,
                        y1: geometry.y,
                        x2: geometry.x,
                        y2: geometry.y
                    }
                ];
            } else {
                segs2 = geometry.getSortedSegments();
            }
            var seg1, seg1x1, seg1x2, seg1y1, seg1y2, seg2, seg2y1, seg2y2;
            outer: for (var i = 0, len = segs1.length; i < len; ++i) {
                seg1 = segs1[i];
                seg1x1 = seg1.x1;
                seg1x2 = seg1.x2;
                seg1y1 = seg1.y1;
                seg1y2 = seg1.y2;
                inner: for (var j = 0, jlen = segs2.length; j < jlen; ++j) {
                    seg2 = segs2[j];
                    if (seg2.x1 > seg1x2) {
                        break;
                    }
                    if (seg2.x2 < seg1x1) {
                        continue;
                    }
                    seg2y1 = seg2.y1;
                    seg2y2 = seg2.y2;
                    if (Math.min(seg2y1, seg2y2) > Math.max(seg1y1, seg1y2)) {
                        continue;
                    }
                    if (Math.max(seg2y1, seg2y2) < Math.min(seg1y1, seg1y2)) {
                        continue;
                    }
                    if (OpenLayers.Geometry.segmentsIntersect(seg1, seg2)) {
                        intersect = true;
                        break outer;
                    }
                }
            }
        } else {
            intersect = geometry.intersects(this);
        }
        return intersect;
    },
    getSortedSegments: function () {
        var numSeg = this.components.length - 1;
        var segments = new Array(numSeg),
            point1, point2;
        for (var i = 0; i < numSeg; ++i) {
            point1 = this.components[i];
            point2 = this.components[i + 1];
            if (point1.x < point2.x) {
                segments[i] = {
                    x1: point1.x,
                    y1: point1.y,
                    x2: point2.x,
                    y2: point2.y
                };
            } else {
                segments[i] = {
                    x1: point2.x,
                    y1: point2.y,
                    x2: point1.x,
                    y2: point1.y
                };
            }
        }

        function byX1(seg1, seg2) {
            return seg1.x1 - seg2.x1;
        }
        return segments.sort(byX1);
    },
    splitWithSegment: function (seg, options) {
        var edge = !(options && options.edge === false);
        var tolerance = options && options.tolerance;
        var lines = [];
        var verts = this.getVertices();
        var points = [];
        var intersections = [];
        var split = false;
        var vert1, vert2, point;
        var node, vertex, target;
        var interOptions = {
            point: true,
            tolerance: tolerance
        };
        var result = null;
        for (var i = 0, stop = verts.length - 2; i <= stop; ++i) {
            vert1 = verts[i];
            points.push(vert1.clone());
            vert2 = verts[i + 1];
            target = {
                x1: vert1.x,
                y1: vert1.y,
                x2: vert2.x,
                y2: vert2.y
            };
            point = OpenLayers.Geometry.segmentsIntersect(seg, target, interOptions);
            if (point instanceof OpenLayers.Geometry.Point) {
                if ((point.x === seg.x1 && point.y === seg.y1) || (point.x === seg.x2 && point.y === seg.y2) || point.equals(vert1) || point.equals(vert2)) {
                    vertex = true;
                } else {
                    vertex = false;
                }
                if (vertex || edge) {
                    if (!point.equals(intersections[intersections.length - 1])) {
                        intersections.push(point.clone());
                    }
                    if (i === 0) {
                        if (point.equals(vert1)) {
                            continue;
                        }
                    }
                    if (point.equals(vert2)) {
                        continue;
                    }
                    split = true;
                    if (!point.equals(vert1)) {
                        points.push(point);
                    }
                    lines.push(new OpenLayers.Geometry.LineString(points));
                    points = [point.clone()];
                }
            }
        }
        if (split) {
            points.push(vert2.clone());
            lines.push(new OpenLayers.Geometry.LineString(points));
        }
        if (intersections.length > 0) {
            var xDir = seg.x1 < seg.x2 ? 1 : -1;
            var yDir = seg.y1 < seg.y2 ? 1 : -1;
            result = {
                lines: lines,
                points: intersections.sort(function (p1, p2) {
                    return (xDir * p1.x - xDir * p2.x) || (yDir * p1.y - yDir * p2.y);
                })
            };
        }
        return result;
    },
    split: function (target, options) {
        var results = null;
        var mutual = options && options.mutual;
        var sourceSplit, targetSplit, sourceParts, targetParts;
        if (target instanceof OpenLayers.Geometry.LineString) {
            var verts = this.getVertices();
            var vert1, vert2, seg, splits, lines, point;
            var points = [];
            sourceParts = [];
            for (var i = 0, stop = verts.length - 2; i <= stop; ++i) {
                vert1 = verts[i];
                vert2 = verts[i + 1];
                seg = {
                    x1: vert1.x,
                    y1: vert1.y,
                    x2: vert2.x,
                    y2: vert2.y
                };
                targetParts = targetParts || [target];
                if (mutual) {
                    points.push(vert1.clone());
                }
                for (var j = 0; j < targetParts.length; ++j) {
                    splits = targetParts[j].splitWithSegment(seg, options);
                    if (splits) {
                        lines = splits.lines;
                        if (lines.length > 0) {
                            lines.unshift(j, 1);
                            Array.prototype.splice.apply(targetParts, lines);
                            j += lines.length - 2;
                        }
                        if (mutual) {
                            for (var k = 0, len = splits.points.length; k < len; ++k) {
                                point = splits.points[k];
                                if (!point.equals(vert1)) {
                                    points.push(point);
                                    sourceParts.push(new OpenLayers.Geometry.LineString(points));
                                    if (point.equals(vert2)) {
                                        points = [];
                                    } else {
                                        points = [point.clone()];
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (mutual && sourceParts.length > 0 && points.length > 0) {
                points.push(vert2.clone());
                sourceParts.push(new OpenLayers.Geometry.LineString(points));
            }
        } else {
            results = target.splitWith(this, options);
        }
        if (targetParts && targetParts.length > 1) {
            targetSplit = true;
        } else {
            targetParts = [];
        }
        if (sourceParts && sourceParts.length > 1) {
            sourceSplit = true;
        } else {
            sourceParts = [];
        }
        if (targetSplit || sourceSplit) {
            if (mutual) {
                results = [sourceParts, targetParts];
            } else {
                results = targetParts;
            }
        }
        return results;
    },
    splitWith: function (geometry, options) {
        return geometry.split(this, options);
    },
    getVertices: function (nodes) {
        var vertices;
        if (nodes === true) {
            vertices = [this.components[0], this.components[this.components.length - 1]];
        } else if (nodes === false) {
            vertices = this.components.slice(1, this.components.length - 1);
        } else {
            vertices = this.components.slice();
        }
        return vertices;
    },
    distanceTo: function (geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var result, best = {};
        var min = Number.POSITIVE_INFINITY;
        if (geometry instanceof OpenLayers.Geometry.Point) {
            var segs = this.getSortedSegments();
            var x = geometry.x;
            var y = geometry.y;
            var seg;
            for (var i = 0, len = segs.length; i < len; ++i) {
                seg = segs[i];
                result = OpenLayers.Geometry.distanceToSegment(geometry, seg);
                if (result.distance < min) {
                    min = result.distance;
                    best = result;
                    if (min === 0) {
                        break;
                    }
                } else {
                    if (seg.x2 > x && ((y > seg.y1 && y < seg.y2) || (y < seg.y1 && y > seg.y2))) {
                        break;
                    }
                }
            }
            if (details) {
                best = {
                    distance: best.distance,
                    x0: best.x,
                    y0: best.y,
                    x1: x,
                    y1: y
                };
            } else {
                best = best.distance;
            }
        } else if (geometry instanceof OpenLayers.Geometry.LineString) {
            var segs0 = this.getSortedSegments();
            var segs1 = geometry.getSortedSegments();
            var seg0, seg1, intersection, x0, y0;
            var len1 = segs1.length;
            var interOptions = {
                point: true
            };
            outer: for (var i = 0, len = segs0.length; i < len; ++i) {
                seg0 = segs0[i];
                x0 = seg0.x1;
                y0 = seg0.y1;
                for (var j = 0; j < len1; ++j) {
                    seg1 = segs1[j];
                    intersection = OpenLayers.Geometry.segmentsIntersect(seg0, seg1, interOptions);
                    if (intersection) {
                        min = 0;
                        best = {
                            distance: 0,
                            x0: intersection.x,
                            y0: intersection.y,
                            x1: intersection.x,
                            y1: intersection.y
                        };
                        break outer;
                    } else {
                        result = OpenLayers.Geometry.distanceToSegment({
                            x: x0,
                            y: y0
                        }, seg1);
                        if (result.distance < min) {
                            min = result.distance;
                            best = {
                                distance: min,
                                x0: x0,
                                y0: y0,
                                x1: result.x,
                                y1: result.y
                            };
                        }
                    }
                }
            }
            if (!details) {
                best = best.distance;
            }
            if (min !== 0) {
                if (seg0) {
                    result = geometry.distanceTo(new OpenLayers.Geometry.Point(seg0.x2, seg0.y2), options);
                    var dist = details ? result.distance : result;
                    if (dist < min) {
                        if (details) {
                            best = {
                                distance: min,
                                x0: result.x1,
                                y0: result.y1,
                                x1: result.x0,
                                y1: result.y0
                            };
                        } else {
                            best = dist;
                        }
                    }
                }
            }
        } else {
            best = geometry.distanceTo(this, options);
            if (details) {
                best = {
                    distance: best.distance,
                    x0: best.x1,
                    y0: best.y1,
                    x1: best.x0,
                    y1: best.y0
                };
            }
        }
        return best;
    },
    simplify: function (tolerance) {
        if (this && this !== null) {
            var points = this.getVertices();
            if (points.length < 3) {
                return this;
            }
            var compareNumbers = function (a, b) {
                return (a - b);
            };
            var douglasPeuckerReduction = function (points, firstPoint, lastPoint, tolerance) {
                var maxDistance = 0;
                var indexFarthest = 0;
                for (var index = firstPoint, distance; index < lastPoint; index++) {
                    distance = perpendicularDistance(points[firstPoint], points[lastPoint], points[index]);
                    if (distance > maxDistance) {
                        maxDistance = distance;
                        indexFarthest = index;
                    }
                }
                if (maxDistance > tolerance && indexFarthest != firstPoint) {
                    pointIndexsToKeep.push(indexFarthest);
                    douglasPeuckerReduction(points, firstPoint, indexFarthest, tolerance);
                    douglasPeuckerReduction(points, indexFarthest, lastPoint, tolerance);
                }
            };
            var perpendicularDistance = function (point1, point2, point) {
                var area = Math.abs(0.5 * (point1.x * point2.y + point2.x * point.y + point.x * point1.y - point2.x * point1.y - point.x * point2.y - point1.x * point.y));
                var bottom = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
                var height = area / bottom * 2;
                return height;
            };
            var firstPoint = 0;
            var lastPoint = points.length - 1;
            var pointIndexsToKeep = [];
            pointIndexsToKeep.push(firstPoint);
            pointIndexsToKeep.push(lastPoint);
            while (points[firstPoint].equals(points[lastPoint])) {
                lastPoint--;
                pointIndexsToKeep.push(lastPoint);
            }
            douglasPeuckerReduction(points, firstPoint, lastPoint, tolerance);
            var returnPoints = [];
            pointIndexsToKeep.sort(compareNumbers);
            for (var index = 0; index < pointIndexsToKeep.length; index++) {
                returnPoints.push(points[pointIndexsToKeep[index]]);
            }
            return new OpenLayers.Geometry.LineString(returnPoints);
        } else {
            return this;
        }
    },
    CLASS_NAME: "OpenLayers.Geometry.LineString"
});
OpenLayers.Geometry.LinearRing = OpenLayers.Class(OpenLayers.Geometry.LineString, {
    componentTypes: ["OpenLayers.Geometry.Point"],
    addComponent: function (point, index) {
        var added = false;
        var lastPoint = this.components.pop();
        if (index != null || !point.equals(lastPoint)) {
            added = OpenLayers.Geometry.Collection.prototype.addComponent.apply(this, arguments);
        }
        var firstPoint = this.components[0];
        OpenLayers.Geometry.Collection.prototype.addComponent.apply(this, [firstPoint]);
        return added;
    },
    removeComponent: function (point) {
        var removed = this.components && (this.components.length > 3);
        if (removed) {
            this.components.pop();
            OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this, arguments);
            var firstPoint = this.components[0];
            OpenLayers.Geometry.Collection.prototype.addComponent.apply(this, [firstPoint]);
        }
        return removed;
    },
    move: function (x, y) {
        for (var i = 0, len = this.components.length; i < len - 1; i++) {
            this.components[i].move(x, y);
        }
    },
    rotate: function (angle, origin) {
        for (var i = 0, len = this.components.length; i < len - 1; ++i) {
            this.components[i].rotate(angle, origin);
        }
    },
    resize: function (scale, origin, ratio) {
        for (var i = 0, len = this.components.length; i < len - 1; ++i) {
            this.components[i].resize(scale, origin, ratio);
        }
        return this;
    },
    transform: function (source, dest) {
        if (source && dest) {
            for (var i = 0, len = this.components.length; i < len - 1; i++) {
                var component = this.components[i];
                component.transform(source, dest);
            }
            this.bounds = null;
        }
        return this;
    },
    getCentroid: function () {
        if (this.components && (this.components.length > 2)) {
            var sumX = 0.0;
            var sumY = 0.0;
            for (var i = 0; i < this.components.length - 1; i++) {
                var b = this.components[i];
                var c = this.components[i + 1];
                sumX += (b.x + c.x) * (b.x * c.y - c.x * b.y);
                sumY += (b.y + c.y) * (b.x * c.y - c.x * b.y);
            }
            var area = -1 * this.getArea();
            var x = sumX / (6 * area);
            var y = sumY / (6 * area);
            return new OpenLayers.Geometry.Point(x, y);
        } else {
            return null;
        }
    },
    getArea: function () {
        var area = 0.0;
        if (this.components && (this.components.length > 2)) {
            var sum = 0.0;
            for (var i = 0, len = this.components.length; i < len - 1; i++) {
                var b = this.components[i];
                var c = this.components[i + 1];
                sum += (b.x + c.x) * (c.y - b.y);
            }
            area = -sum / 2.0;
        }
        return area;
    },
    getGeodesicArea: function (projection) {
        var ring = this;
        if (projection) {
            var gg = new OpenLayers.Projection("EPSG:4326");
            if (!gg.equals(projection)) {
                ring = this.clone().transform(projection, gg);
            }
        }
        var area = 0.0;
        var len = ring.components && ring.components.length;
        if (len > 2) {
            var p1, p2;
            for (var i = 0; i < len - 1; i++) {
                p1 = ring.components[i];
                p2 = ring.components[i + 1];
                area += OpenLayers.Util.rad(p2.x - p1.x) * (2 + Math.sin(OpenLayers.Util.rad(p1.y)) +
                    Math.sin(OpenLayers.Util.rad(p2.y)));
            }
            area = area * 6378137.0 * 6378137.0 / 2.0;
        }
        return area;
    },
    containsPoint: function (point) {
        var approx = OpenLayers.Number.limitSigDigs;
        var digs = 14;
        var px = approx(point.x, digs);
        var py = approx(point.y, digs);

        function getX(y, x1, y1, x2, y2) {
            return (y - y2) * ((x2 - x1) / (y2 - y1)) + x2;
        }
        var numSeg = this.components.length - 1;
        var start, end, x1, y1, x2, y2, cx, cy;
        var crosses = 0;
        for (var i = 0; i < numSeg; ++i) {
            start = this.components[i];
            x1 = approx(start.x, digs);
            y1 = approx(start.y, digs);
            end = this.components[i + 1];
            x2 = approx(end.x, digs);
            y2 = approx(end.y, digs);
            if (y1 == y2) {
                if (py == y1) {
                    if (x1 <= x2 && (px >= x1 && px <= x2) || x1 >= x2 && (px <= x1 && px >= x2)) {
                        crosses = -1;
                        break;
                    }
                }
                continue;
            }
            cx = approx(getX(py, x1, y1, x2, y2), digs);
            if (cx == px) {
                if (y1 < y2 && (py >= y1 && py <= y2) || y1 > y2 && (py <= y1 && py >= y2)) {
                    crosses = -1;
                    break;
                }
            }
            if (cx <= px) {
                continue;
            }
            if (x1 != x2 && (cx < Math.min(x1, x2) || cx > Math.max(x1, x2))) {
                continue;
            }
            if (y1 < y2 && (py >= y1 && py < y2) || y1 > y2 && (py < y1 && py >= y2)) {
                ++crosses;
            }
        }
        var contained = (crosses == -1) ? 1 : !! (crosses & 1);
        return contained;
    },
    intersects: function (geometry) {
        var intersect = false;
        if (geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            intersect = this.containsPoint(geometry);
        } else if (geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
            intersect = geometry.intersects(this);
        } else if (geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
            intersect = OpenLayers.Geometry.LineString.prototype.intersects.apply(this, [geometry]);
        } else {
            for (var i = 0, len = geometry.components.length; i < len; ++i) {
                intersect = geometry.components[i].intersects(this);
                if (intersect) {
                    break;
                }
            }
        }
        return intersect;
    },
    getVertices: function (nodes) {
        return (nodes === true) ? [] : this.components.slice(0, this.components.length - 1);
    },
    CLASS_NAME: "OpenLayers.Geometry.LinearRing"
});
OpenLayers.Geometry.Polygon = OpenLayers.Class(OpenLayers.Geometry.Collection, {
    componentTypes: ["OpenLayers.Geometry.LinearRing"],
    getArea: function () {
        var area = 0.0;
        if (this.components && (this.components.length > 0)) {
            area += Math.abs(this.components[0].getArea());
            for (var i = 1, len = this.components.length; i < len; i++) {
                area -= Math.abs(this.components[i].getArea());
            }
        }
        return area;
    },
    getGeodesicArea: function (projection) {
        var area = 0.0;
        if (this.components && (this.components.length > 0)) {
            area += Math.abs(this.components[0].getGeodesicArea(projection));
            for (var i = 1, len = this.components.length; i < len; i++) {
                area -= Math.abs(this.components[i].getGeodesicArea(projection));
            }
        }
        return area;
    },
    containsPoint: function (point) {
        var numRings = this.components.length;
        var contained = false;
        if (numRings > 0) {
            contained = this.components[0].containsPoint(point);
            if (contained !== 1) {
                if (contained && numRings > 1) {
                    var hole;
                    for (var i = 1; i < numRings; ++i) {
                        hole = this.components[i].containsPoint(point);
                        if (hole) {
                            if (hole === 1) {
                                contained = 1;
                            } else {
                                contained = false;
                            }
                            break;
                        }
                    }
                }
            }
        }
        return contained;
    },
    intersects: function (geometry) {
        var intersect = false;
        var i, len;
        if (geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            intersect = this.containsPoint(geometry);
        } else if (geometry.CLASS_NAME == "OpenLayers.Geometry.LineString" || geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
            for (i = 0, len = this.components.length; i < len; ++i) {
                intersect = geometry.intersects(this.components[i]);
                if (intersect) {
                    break;
                }
            }
            if (!intersect) {
                for (i = 0, len = geometry.components.length; i < len; ++i) {
                    intersect = this.containsPoint(geometry.components[i]);
                    if (intersect) {
                        break;
                    }
                }
            }
        } else {
            for (i = 0, len = geometry.components.length; i < len; ++i) {
                intersect = this.intersects(geometry.components[i]);
                if (intersect) {
                    break;
                }
            }
        }
        if (!intersect && geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
            var ring = this.components[0];
            for (i = 0, len = ring.components.length; i < len; ++i) {
                intersect = geometry.containsPoint(ring.components[i]);
                if (intersect) {
                    break;
                }
            }
        }
        return intersect;
    },
    distanceTo: function (geometry, options) {
        var edge = !(options && options.edge === false);
        var result;
        if (!edge && this.intersects(geometry)) {
            result = 0;
        } else {
            result = OpenLayers.Geometry.Collection.prototype.distanceTo.apply(this, [geometry, options]);
        }
        return result;
    },
    CLASS_NAME: "OpenLayers.Geometry.Polygon"
});
OpenLayers.Geometry.Polygon.createRegularPolygon = function (origin, radius, sides, rotation) {
    var angle = Math.PI * ((1 / sides) - (1 / 2));
    if (rotation) {
        angle += (rotation / 180) * Math.PI;
    }
    var rotatedAngle, x, y;
    var points = [];
    for (var i = 0; i < sides; ++i) {
        rotatedAngle = angle + (i * 2 * Math.PI / sides);
        x = origin.x + (radius * Math.cos(rotatedAngle));
        y = origin.y + (radius * Math.sin(rotatedAngle));
        points.push(new OpenLayers.Geometry.Point(x, y));
    }
    var ring = new OpenLayers.Geometry.LinearRing(points);
    return new OpenLayers.Geometry.Polygon([ring]);
};
OpenLayers.Renderer = OpenLayers.Class({
    container: null,
    root: null,
    extent: null,
    locked: false,
    size: null,
    resolution: null,
    map: null,
    featureDx: 0,
    initialize: function (containerID, options) {
        this.container = OpenLayers.Util.getElement(containerID);
        OpenLayers.Util.extend(this, options);
    },
    destroy: function () {
        this.container = null;
        this.extent = null;
        this.size = null;
        this.resolution = null;
        this.map = null;
    },
    supported: function () {
        return false;
    },
    setExtent: function (extent, resolutionChanged) {
        this.extent = extent.clone();
        if (this.map.baseLayer && this.map.baseLayer.wrapDateLine) {
            var ratio = extent.getWidth() / this.map.getExtent().getWidth(),
                extent = extent.scale(1 / ratio);
            this.extent = extent.wrapDateLine(this.map.getMaxExtent()).scale(ratio);
        }
        if (resolutionChanged) {
            this.resolution = null;
        }
        return true;
    },
    setSize: function (size) {
        this.size = size.clone();
        this.resolution = null;
    },
    getResolution: function () {
        this.resolution = this.resolution || this.map.getResolution();
        return this.resolution;
    },
    drawFeature: function (feature, style) {
        if (style == null) {
            style = feature.style;
        }
        if (feature.geometry) {
            var bounds = feature.geometry.getBounds();
            if (bounds) {
                var worldBounds;
                if (this.map.baseLayer && this.map.baseLayer.wrapDateLine) {
                    worldBounds = this.map.getMaxExtent();
                }
                if (!bounds.intersectsBounds(this.extent, {
                    worldBounds: worldBounds
                })) {
                    style = {
                        display: "none"
                    };
                } else {
                    this.calculateFeatureDx(bounds, worldBounds);
                }
                var rendered = this.drawGeometry(feature.geometry, style, feature.id);
                if (style.display != "none" && style.label && rendered !== false) {
                    var location = feature.geometry.getCentroid();
                    if (style.labelXOffset || style.labelYOffset) {
                        var xOffset = isNaN(style.labelXOffset) ? 0 : style.labelXOffset;
                        var yOffset = isNaN(style.labelYOffset) ? 0 : style.labelYOffset;
                        var res = this.getResolution();
                        location.move(xOffset * res, yOffset * res);
                    }
                    this.drawText(feature.id, style, location);
                } else {
                    this.removeText(feature.id);
                }
                return rendered;
            }
        }
    },
    calculateFeatureDx: function (bounds, worldBounds) {
        this.featureDx = 0;
        if (worldBounds) {
            var worldWidth = worldBounds.getWidth(),
                rendererCenterX = (this.extent.left + this.extent.right) / 2,
                featureCenterX = (bounds.left + bounds.right) / 2,
                worldsAway = Math.round((featureCenterX - rendererCenterX) / worldWidth);
            this.featureDx = worldsAway * worldWidth;
        }
    },
    drawGeometry: function (geometry, style, featureId) {},
    drawText: function (featureId, style, location) {},
    removeText: function (featureId) {},
    clear: function () {},
    getFeatureIdFromEvent: function (evt) {},
    eraseFeatures: function (features) {
        if (!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }
        for (var i = 0, len = features.length; i < len; ++i) {
            var feature = features[i];
            this.eraseGeometry(feature.geometry, feature.id);
            this.removeText(feature.id);
        }
    },
    eraseGeometry: function (geometry, featureId) {},
    moveRoot: function (renderer) {},
    getRenderLayerId: function () {
        return this.container.id;
    },
    applyDefaultSymbolizer: function (symbolizer) {
        var result = OpenLayers.Util.extend({}, OpenLayers.Renderer.defaultSymbolizer);
        if (symbolizer.stroke === false) {
            delete result.strokeWidth;
            delete result.strokeColor;
        }
        if (symbolizer.fill === false) {
            delete result.fillColor;
        }
        OpenLayers.Util.extend(result, symbolizer);
        return result;
    },
    CLASS_NAME: "OpenLayers.Renderer"
});
OpenLayers.Renderer.defaultSymbolizer = {
    fillColor: "#000000",
    strokeColor: "#000000",
    strokeWidth: 2,
    fillOpacity: 1,
    strokeOpacity: 1,
    pointRadius: 0,
    labelAlign: 'cm'
};
OpenLayers.Renderer.symbol = {
    "star": [350, 75, 379, 161, 469, 161, 397, 215, 423, 301, 350, 250, 277, 301, 303, 215, 231, 161, 321, 161, 350, 75],
    "cross": [4, 0, 6, 0, 6, 4, 10, 4, 10, 6, 6, 6, 6, 10, 4, 10, 4, 6, 0, 6, 0, 4, 4, 4, 4, 0],
    "x": [0, 0, 25, 0, 50, 35, 75, 0, 100, 0, 65, 50, 100, 100, 75, 100, 50, 65, 25, 100, 0, 100, 35, 50, 0, 0],
    "square": [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    "triangle": [0, 10, 10, 10, 5, 0, 0, 10]
};
OpenLayers.ElementsIndexer = OpenLayers.Class({
    maxZIndex: null,
    order: null,
    indices: null,
    compare: null,
    initialize: function (yOrdering) {
        this.compare = yOrdering ? OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER_Y_ORDER : OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER_DRAWING_ORDER;
        this.clear();
    },
    insert: function (newNode) {
        if (this.exists(newNode)) {
            this.remove(newNode);
        }
        var nodeId = newNode.id;
        this.determineZIndex(newNode);
        var leftIndex = -1;
        var rightIndex = this.order.length;
        var middle;
        while (rightIndex - leftIndex > 1) {
            middle = parseInt((leftIndex + rightIndex) / 2);
            var placement = this.compare(this, newNode, OpenLayers.Util.getElement(this.order[middle]));
            if (placement > 0) {
                leftIndex = middle;
            } else {
                rightIndex = middle;
            }
        }
        this.order.splice(rightIndex, 0, nodeId);
        this.indices[nodeId] = this.getZIndex(newNode);
        return this.getNextElement(rightIndex);
    },
    remove: function (node) {
        var nodeId = node.id;
        var arrayIndex = OpenLayers.Util.indexOf(this.order, nodeId);
        if (arrayIndex >= 0) {
            this.order.splice(arrayIndex, 1);
            delete this.indices[nodeId];
            if (this.order.length > 0) {
                var lastId = this.order[this.order.length - 1];
                this.maxZIndex = this.indices[lastId];
            } else {
                this.maxZIndex = 0;
            }
        }
    },
    clear: function () {
        this.order = [];
        this.indices = {};
        this.maxZIndex = 0;
    },
    exists: function (node) {
        return (this.indices[node.id] != null);
    },
    getZIndex: function (node) {
        return node._style.graphicZIndex;
    },
    determineZIndex: function (node) {
        var zIndex = node._style.graphicZIndex;
        if (zIndex == null) {
            zIndex = this.maxZIndex;
            node._style.graphicZIndex = zIndex;
        } else if (zIndex > this.maxZIndex) {
            this.maxZIndex = zIndex;
        }
    },
    getNextElement: function (index) {
        var nextIndex = index + 1;
        if (nextIndex < this.order.length) {
            var nextElement = OpenLayers.Util.getElement(this.order[nextIndex]);
            if (nextElement == undefined) {
                nextElement = this.getNextElement(nextIndex);
            }
            return nextElement;
        } else {
            return null;
        }
    },
    CLASS_NAME: "OpenLayers.ElementsIndexer"
});
OpenLayers.ElementsIndexer.IndexingMethods = {
    Z_ORDER: function (indexer, newNode, nextNode) {
        var newZIndex = indexer.getZIndex(newNode);
        var returnVal = 0;
        if (nextNode) {
            var nextZIndex = indexer.getZIndex(nextNode);
            returnVal = newZIndex - nextZIndex;
        }
        return returnVal;
    },
    Z_ORDER_DRAWING_ORDER: function (indexer, newNode, nextNode) {
        var returnVal = OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER(indexer, newNode, nextNode);
        if (nextNode && returnVal == 0) {
            returnVal = 1;
        }
        return returnVal;
    },
    Z_ORDER_Y_ORDER: function (indexer, newNode, nextNode) {
        var returnVal = OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER(indexer, newNode, nextNode);
        if (nextNode && returnVal === 0) {
            var result = nextNode._boundsBottom - newNode._boundsBottom;
            returnVal = (result === 0) ? 1 : result;
        }
        return returnVal;
    }
};
OpenLayers.Renderer.Elements = OpenLayers.Class(OpenLayers.Renderer, {
    rendererRoot: null,
    root: null,
    vectorRoot: null,
    textRoot: null,
    xmlns: null,
    xOffset: 0,
    indexer: null,
    BACKGROUND_ID_SUFFIX: "_background",
    LABEL_ID_SUFFIX: "_label",
    LABEL_OUTLINE_SUFFIX: "_outline",
    initialize: function (containerID, options) {
        OpenLayers.Renderer.prototype.initialize.apply(this, arguments);
        this.rendererRoot = this.createRenderRoot();
        this.root = this.createRoot("_root");
        this.vectorRoot = this.createRoot("_vroot");
        this.textRoot = this.createRoot("_troot");
        this.root.appendChild(this.vectorRoot);
        this.root.appendChild(this.textRoot);
        this.rendererRoot.appendChild(this.root);
        this.container.appendChild(this.rendererRoot);
        if (options && (options.zIndexing || options.yOrdering)) {
            this.indexer = new OpenLayers.ElementsIndexer(options.yOrdering);
        }
    },
    destroy: function () {
        this.clear();
        this.rendererRoot = null;
        this.root = null;
        this.xmlns = null;
        OpenLayers.Renderer.prototype.destroy.apply(this, arguments);
    },
    clear: function () {
        var child;
        var root = this.vectorRoot;
        if (root) {
            while (child = root.firstChild) {
                root.removeChild(child);
            }
        }
        root = this.textRoot;
        if (root) {
            while (child = root.firstChild) {
                root.removeChild(child);
            }
        }
        if (this.indexer) {
            this.indexer.clear();
        }
    },
    setExtent: function (extent, resolutionChanged) {
        var coordSysUnchanged = OpenLayers.Renderer.prototype.setExtent.apply(this, arguments);
        var resolution = this.getResolution();
        if (this.map.baseLayer && this.map.baseLayer.wrapDateLine) {
            var rightOfDateLine, ratio = extent.getWidth() / this.map.getExtent().getWidth(),
                extent = extent.scale(1 / ratio),
                world = this.map.getMaxExtent();
            if (world.right > extent.left && world.right < extent.right) {
                rightOfDateLine = true;
            } else if (world.left > extent.left && world.left < extent.right) {
                rightOfDateLine = false;
            }
            if (rightOfDateLine !== this.rightOfDateLine || resolutionChanged) {
                coordSysUnchanged = false;
                this.xOffset = rightOfDateLine === true ? world.getWidth() / resolution : 0;
            }
            this.rightOfDateLine = rightOfDateLine;
        }
        return coordSysUnchanged;
    },
    getNodeType: function (geometry, style) {},
    drawGeometry: function (geometry, style, featureId) {
        var className = geometry.CLASS_NAME;
        var rendered = true;
        if ((className == "OpenLayers.Geometry.Collection") || (className == "OpenLayers.Geometry.MultiPoint") || (className == "OpenLayers.Geometry.MultiLineString") || (className == "OpenLayers.Geometry.MultiPolygon")) {
            for (var i = 0, len = geometry.components.length; i < len; i++) {
                rendered = this.drawGeometry(geometry.components[i], style, featureId) && rendered;
            }
            return rendered;
        }
        rendered = false;
        var removeBackground = false;
        if (style.display != "none") {
            if (style.backgroundGraphic) {
                this.redrawBackgroundNode(geometry.id, geometry, style, featureId);
            } else {
                removeBackground = true;
            }
            rendered = this.redrawNode(geometry.id, geometry, style, featureId);
        }
        if (rendered == false) {
            var node = document.getElementById(geometry.id);
            if (node) {
                if (node._style.backgroundGraphic) {
                    removeBackground = true;
                }
                node.parentNode.removeChild(node);
            }
        }
        if (removeBackground) {
            var node = document.getElementById(geometry.id + this.BACKGROUND_ID_SUFFIX);
            if (node) {
                node.parentNode.removeChild(node);
            }
        }
        return rendered;
    },
    redrawNode: function (id, geometry, style, featureId) {
        style = this.applyDefaultSymbolizer(style);
        var node = this.nodeFactory(id, this.getNodeType(geometry, style));
        node._featureId = featureId;
        node._boundsBottom = geometry.getBounds().bottom;
        node._geometryClass = geometry.CLASS_NAME;
        node._style = style;
        var drawResult = this.drawGeometryNode(node, geometry, style);
        if (drawResult === false) {
            return false;
        }
        node = drawResult.node;
        if (this.indexer) {
            var insert = this.indexer.insert(node);
            if (insert) {
                this.vectorRoot.insertBefore(node, insert);
            } else {
                this.vectorRoot.appendChild(node);
            }
        } else {
            if (node.parentNode !== this.vectorRoot) {
                this.vectorRoot.appendChild(node);
            }
        }
        this.postDraw(node);
        return drawResult.complete;
    },
    redrawBackgroundNode: function (id, geometry, style, featureId) {
        var backgroundStyle = OpenLayers.Util.extend({}, style);
        backgroundStyle.externalGraphic = backgroundStyle.backgroundGraphic;
        backgroundStyle.graphicXOffset = backgroundStyle.backgroundXOffset;
        backgroundStyle.graphicYOffset = backgroundStyle.backgroundYOffset;
        backgroundStyle.graphicZIndex = backgroundStyle.backgroundGraphicZIndex;
        backgroundStyle.graphicWidth = backgroundStyle.backgroundWidth || backgroundStyle.graphicWidth;
        backgroundStyle.graphicHeight = backgroundStyle.backgroundHeight || backgroundStyle.graphicHeight;
        backgroundStyle.backgroundGraphic = null;
        backgroundStyle.backgroundXOffset = null;
        backgroundStyle.backgroundYOffset = null;
        backgroundStyle.backgroundGraphicZIndex = null;
        return this.redrawNode(id + this.BACKGROUND_ID_SUFFIX, geometry, backgroundStyle, null);
    },
    drawGeometryNode: function (node, geometry, style) {
        style = style || node._style;
        var options = {
            'isFilled': style.fill === undefined ? true : style.fill,
            'isStroked': style.stroke === undefined ? !! style.strokeWidth : style.stroke
        };
        var drawn;
        switch (geometry.CLASS_NAME) {
        case "OpenLayers.Geometry.Point":
            if (style.graphic === false) {
                options.isFilled = false;
                options.isStroked = false;
            } else options.isFilled = true;
            drawn = this.drawPoint(node, geometry);
            break;
        case "OpenLayers.Geometry.LineString":
            options.isFilled = false;
            drawn = this.drawLineString(node, geometry);
            break;
        case "OpenLayers.Geometry.LinearRing":
            drawn = this.drawLinearRing(node, geometry);
            break;
        case "OpenLayers.Geometry.Polygon":
            drawn = this.drawPolygon(node, geometry);
            break;
        case "OpenLayers.Geometry.Rectangle":
            drawn = this.drawRectangle(node, geometry);
            break;
        default:
            break;
        }
        node._options = options;
        if (drawn != false) {
            return {
                node: this.setStyle(node, style, options, geometry),
                complete: drawn
            };
        } else {
            return false;
        }
    },
    postDraw: function (node) {},
    drawPoint: function (node, geometry) {},
    drawLineString: function (node, geometry) {},
    drawLinearRing: function (node, geometry) {},
    drawPolygon: function (node, geometry) {},
    drawRectangle: function (node, geometry) {},
    drawCircle: function (node, geometry) {},
    removeText: function (featureId) {
        var label = document.getElementById(featureId + this.LABEL_ID_SUFFIX);
        if (label) {
            this.textRoot.removeChild(label);
        }
        var outline = document.getElementById(featureId + this.LABEL_OUTLINE_SUFFIX);
        if (outline) {
            this.textRoot.removeChild(outline);
        }
    },
    getFeatureIdFromEvent: function (evt) {
        var target = evt.target;
        var useElement = target && target.correspondingUseElement;
        var node = useElement ? useElement : (target || evt.srcElement);
        return node._featureId;
    },
    eraseGeometry: function (geometry, featureId) {
        if ((geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPoint") || (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiLineString") || (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPolygon") || (geometry.CLASS_NAME == "OpenLayers.Geometry.Collection")) {
            for (var i = 0, len = geometry.components.length; i < len; i++) {
                this.eraseGeometry(geometry.components[i], featureId);
            }
        } else {
            var element = OpenLayers.Util.getElement(geometry.id);
            if (element && element.parentNode) {
                if (element.geometry) {
                    element.geometry.destroy();
                    element.geometry = null;
                }
                element.parentNode.removeChild(element);
                if (this.indexer) {
                    this.indexer.remove(element);
                }
                if (element._style.backgroundGraphic) {
                    var backgroundId = geometry.id + this.BACKGROUND_ID_SUFFIX;
                    var bElem = OpenLayers.Util.getElement(backgroundId);
                    if (bElem && bElem.parentNode) {
                        bElem.parentNode.removeChild(bElem);
                    }
                }
            }
        }
    },
    nodeFactory: function (id, type) {
        var node = OpenLayers.Util.getElement(id);
        if (node) {
            if (!this.nodeTypeCompare(node, type)) {
                node.parentNode.removeChild(node);
                node = this.nodeFactory(id, type);
            }
        } else {
            node = this.createNode(type, id);
        }
        return node;
    },
    nodeTypeCompare: function (node, type) {},
    createNode: function (type, id) {},
    moveRoot: function (renderer) {
        var root = this.root;
        if (renderer.root.parentNode == this.rendererRoot) {
            root = renderer.root;
        }
        root.parentNode.removeChild(root);
        renderer.rendererRoot.appendChild(root);
    },
    getRenderLayerId: function () {
        return this.root.parentNode.parentNode.id;
    },
    isComplexSymbol: function (graphicName) {
        return (graphicName != "circle") && !! graphicName;
    },
    CLASS_NAME: "OpenLayers.Renderer.Elements"
});
OpenLayers.Renderer.SVG = OpenLayers.Class(OpenLayers.Renderer.Elements, {
    xmlns: "http://www.w3.org/2000/svg",
    xlinkns: "http://www.w3.org/1999/xlink",
    MAX_PIXEL: 15000,
    translationParameters: null,
    symbolMetrics: null,
    initialize: function (containerID) {
        if (!this.supported()) {
            return;
        }
        OpenLayers.Renderer.Elements.prototype.initialize.apply(this, arguments);
        this.translationParameters = {
            x: 0,
            y: 0
        };
        this.symbolMetrics = {};
    },
    supported: function () {
        var svgFeature = "http://www.w3.org/TR/SVG11/feature#";
        return (document.implementation && (document.implementation.hasFeature("org.w3c.svg", "1.0") || document.implementation.hasFeature(svgFeature + "SVG", "1.1") || document.implementation.hasFeature(svgFeature + "BasicStructure", "1.1")));
    },
    inValidRange: function (x, y, xyOnly) {
        var left = x + (xyOnly ? 0 : this.translationParameters.x);
        var top = y + (xyOnly ? 0 : this.translationParameters.y);
        return (left >= -this.MAX_PIXEL && left <= this.MAX_PIXEL && top >= -this.MAX_PIXEL && top <= this.MAX_PIXEL);
    },
    setExtent: function (extent, resolutionChanged) {
        var coordSysUnchanged = OpenLayers.Renderer.Elements.prototype.setExtent.apply(this, arguments);
        var resolution = this.getResolution(),
            left = -extent.left / resolution,
            top = extent.top / resolution;
        if (resolutionChanged) {
            this.left = left;
            this.top = top;
            var extentString = "0 0 " + this.size.w + " " + this.size.h;
            this.rendererRoot.setAttributeNS(null, "viewBox", extentString);
            this.translate(this.xOffset, 0);
            return true;
        } else {
            var inRange = this.translate(left - this.left + this.xOffset, top - this.top);
            if (!inRange) {
                this.setExtent(extent, true);
            }
            return coordSysUnchanged && inRange;
        }
    },
    translate: function (x, y) {
        if (!this.inValidRange(x, y, true)) {
            return false;
        } else {
            var transformString = "";
            if (x || y) {
                transformString = "translate(" + x + "," + y + ")";
            }
            this.root.setAttributeNS(null, "transform", transformString);
            this.translationParameters = {
                x: x,
                y: y
            };
            return true;
        }
    },
    setSize: function (size) {
        OpenLayers.Renderer.prototype.setSize.apply(this, arguments);
        this.rendererRoot.setAttributeNS(null, "width", this.size.w);
        this.rendererRoot.setAttributeNS(null, "height", this.size.h);
    },
    getNodeType: function (geometry, style) {
        var nodeType = null;
        switch (geometry.CLASS_NAME) {
        case "OpenLayers.Geometry.Point":
            if (style.externalGraphic) {
                nodeType = "image";
            } else if (this.isComplexSymbol(style.graphicName)) {
                nodeType = "svg";
            } else {
                nodeType = "circle";
            }
            break;
        case "OpenLayers.Geometry.Rectangle":
            nodeType = "rect";
            break;
        case "OpenLayers.Geometry.LineString":
            nodeType = "polyline";
            break;
        case "OpenLayers.Geometry.LinearRing":
            nodeType = "polygon";
            break;
        case "OpenLayers.Geometry.Polygon":
        case "OpenLayers.Geometry.Curve":
            nodeType = "path";
            break;
        default:
            break;
        }
        return nodeType;
    },
    setStyle: function (node, style, options) {
        style = style || node._style;
        options = options || node._options;
        var r = parseFloat(node.getAttributeNS(null, "r"));
        var widthFactor = 1;
        var pos;
        if (node._geometryClass == "OpenLayers.Geometry.Point" && r) {
            node.style.visibility = "";
            if (style.graphic === false) {
                node.style.visibility = "hidden";
            } else if (style.externalGraphic) {
                pos = this.getPosition(node);
                if (style.graphicTitle) {
                    node.setAttributeNS(null, "title", style.graphicTitle);
                    var titleNode = node.getElementsByTagName("title");
                    if (titleNode.length > 0) {
                        titleNode[0].firstChild.textContent = style.graphicTitle;
                    } else {
                        var label = this.nodeFactory(null, "title");
                        label.textContent = style.graphicTitle;
                        node.appendChild(label);
                    }
                }
                if (style.graphicWidth && style.graphicHeight) {
                    node.setAttributeNS(null, "preserveAspectRatio", "none");
                }
                var width = style.graphicWidth || style.graphicHeight;
                var height = style.graphicHeight || style.graphicWidth;
                width = width ? width : style.pointRadius * 2;
                height = height ? height : style.pointRadius * 2;
                var xOffset = (style.graphicXOffset != undefined) ? style.graphicXOffset : -(0.5 * width);
                var yOffset = (style.graphicYOffset != undefined) ? style.graphicYOffset : -(0.5 * height);
                var opacity = style.graphicOpacity || style.fillOpacity;
                node.setAttributeNS(null, "x", (pos.x + xOffset).toFixed());
                node.setAttributeNS(null, "y", (pos.y + yOffset).toFixed());
                node.setAttributeNS(null, "width", width);
                node.setAttributeNS(null, "height", height);
                node.setAttributeNS(this.xlinkns, "href", style.externalGraphic);
                node.setAttributeNS(null, "style", "opacity: " + opacity);
                node.onclick = OpenLayers.Renderer.SVG.preventDefault;
            } else if (this.isComplexSymbol(style.graphicName)) {
                var offset = style.pointRadius * 3;
                var size = offset * 2;
                var src = this.importSymbol(style.graphicName);
                pos = this.getPosition(node);
                widthFactor = this.symbolMetrics[src.id][0] * 3 / size;
                var parent = node.parentNode;
                var nextSibling = node.nextSibling;
                if (parent) {
                    parent.removeChild(node);
                }
                node.firstChild && node.removeChild(node.firstChild);
                node.appendChild(src.firstChild.cloneNode(true));
                node.setAttributeNS(null, "viewBox", src.getAttributeNS(null, "viewBox"));
                node.setAttributeNS(null, "width", size);
                node.setAttributeNS(null, "height", size);
                node.setAttributeNS(null, "x", pos.x - offset);
                node.setAttributeNS(null, "y", pos.y - offset);
                if (nextSibling) {
                    parent.insertBefore(node, nextSibling);
                } else if (parent) {
                    parent.appendChild(node);
                }
            } else {
                node.setAttributeNS(null, "r", style.pointRadius);
            }
            var rotation = style.rotation;
            if ((rotation !== undefined || node._rotation !== undefined) && pos) {
                node._rotation = rotation;
                rotation |= 0;
                if (node.nodeName !== "svg") {
                    node.setAttributeNS(null, "transform", "rotate(" + rotation + " " + pos.x + " " +
                        pos.y + ")");
                } else {
                    var metrics = this.symbolMetrics[src.id];
                    node.firstChild.setAttributeNS(null, "transform", "rotate(" + rotation + " " + metrics[1] + " " + metrics[2] + ")");
                }
            }
        }
        if (options.isFilled) {
            node.setAttributeNS(null, "fill", style.fillColor);
            node.setAttributeNS(null, "fill-opacity", style.fillOpacity);
        } else {
            node.setAttributeNS(null, "fill", "none");
        }
        if (options.isStroked) {
            node.setAttributeNS(null, "stroke", style.strokeColor);
            node.setAttributeNS(null, "stroke-opacity", style.strokeOpacity);
            node.setAttributeNS(null, "stroke-width", style.strokeWidth * widthFactor);
            node.setAttributeNS(null, "stroke-linecap", style.strokeLinecap || "round");
            node.setAttributeNS(null, "stroke-linejoin", "round");
            style.strokeDashstyle && node.setAttributeNS(null, "stroke-dasharray", this.dashStyle(style, widthFactor));
        } else {
            node.setAttributeNS(null, "stroke", "none");
        }
        if (style.pointerEvents) {
            node.setAttributeNS(null, "pointer-events", style.pointerEvents);
        }
        if (style.cursor != null) {
            node.setAttributeNS(null, "cursor", style.cursor);
        }
        return node;
    },
    dashStyle: function (style, widthFactor) {
        var w = style.strokeWidth * widthFactor;
        var str = style.strokeDashstyle;
        switch (str) {
        case 'solid':
            return 'none';
        case 'dot':
            return [1, 4 * w].join();
        case 'dash':
            return [4 * w, 4 * w].join();
        case 'dashdot':
            return [4 * w, 4 * w, 1, 4 * w].join();
        case 'longdash':
            return [8 * w, 4 * w].join();
        case 'longdashdot':
            return [8 * w, 4 * w, 1, 4 * w].join();
        default:
            return OpenLayers.String.trim(str).replace(/\s+/g, ",");
        }
    },
    createNode: function (type, id) {
        var node = document.createElementNS(this.xmlns, type);
        if (id) {
            node.setAttributeNS(null, "id", id);
        }
        return node;
    },
    nodeTypeCompare: function (node, type) {
        return (type == node.nodeName);
    },
    createRenderRoot: function () {
        var svg = this.nodeFactory(this.container.id + "_svgRoot", "svg");
        svg.style.display = "block";
        return svg;
    },
    createRoot: function (suffix) {
        return this.nodeFactory(this.container.id + suffix, "g");
    },
    createDefs: function () {
        var defs = this.nodeFactory(this.container.id + "_defs", "defs");
        this.rendererRoot.appendChild(defs);
        return defs;
    },
    drawPoint: function (node, geometry) {
        return this.drawCircle(node, geometry, 1);
    },
    drawCircle: function (node, geometry, radius) {
        var resolution = this.getResolution();
        var x = ((geometry.x - this.featureDx) / resolution + this.left);
        var y = (this.top - geometry.y / resolution);
        if (this.inValidRange(x, y)) {
            node.setAttributeNS(null, "cx", x);
            node.setAttributeNS(null, "cy", y);
            node.setAttributeNS(null, "r", radius);
            return node;
        } else {
            return false;
        }
    },
    drawLineString: function (node, geometry) {
        var componentsResult = this.getComponentsString(geometry.components);
        if (componentsResult.path) {
            node.setAttributeNS(null, "points", componentsResult.path);
            return (componentsResult.complete ? node : null);
        } else {
            return false;
        }
    },
    drawLinearRing: function (node, geometry) {
        var componentsResult = this.getComponentsString(geometry.components);
        if (componentsResult.path) {
            node.setAttributeNS(null, "points", componentsResult.path);
            return (componentsResult.complete ? node : null);
        } else {
            return false;
        }
    },
    drawPolygon: function (node, geometry) {
        var d = "";
        var draw = true;
        var complete = true;
        var linearRingResult, path;
        for (var j = 0, len = geometry.components.length; j < len; j++) {
            d += " M";
            linearRingResult = this.getComponentsString(geometry.components[j].components, " ");
            path = linearRingResult.path;
            if (path) {
                d += " " + path;
                complete = linearRingResult.complete && complete;
            } else {
                draw = false;
            }
        }
        d += " z";
        if (draw) {
            node.setAttributeNS(null, "d", d);
            node.setAttributeNS(null, "fill-rule", "evenodd");
            return complete ? node : null;
        } else {
            return false;
        }
    },
    drawRectangle: function (node, geometry) {
        var resolution = this.getResolution();
        var x = ((geometry.x - this.featureDx) / resolution + this.left);
        var y = (this.top - geometry.y / resolution);
        if (this.inValidRange(x, y)) {
            node.setAttributeNS(null, "x", x);
            node.setAttributeNS(null, "y", y);
            node.setAttributeNS(null, "width", geometry.width / resolution);
            node.setAttributeNS(null, "height", geometry.height / resolution);
            return node;
        } else {
            return false;
        }
    },
    drawText: function (featureId, style, location) {
        var drawOutline = ( !! style.labelOutlineWidth);
        if (drawOutline) {
            var outlineStyle = OpenLayers.Util.extend({}, style);
            outlineStyle.fontColor = outlineStyle.labelOutlineColor;
            outlineStyle.fontStrokeColor = outlineStyle.labelOutlineColor;
            outlineStyle.fontStrokeWidth = style.labelOutlineWidth;
            delete outlineStyle.labelOutlineWidth;
            this.drawText(featureId, outlineStyle, location);
        }
        var resolution = this.getResolution();
        var x = ((location.x - this.featureDx) / resolution + this.left);
        var y = (location.y / resolution - this.top);
        var suffix = (drawOutline) ? this.LABEL_OUTLINE_SUFFIX : this.LABEL_ID_SUFFIX;
        var label = this.nodeFactory(featureId + suffix, "text");
        label.setAttributeNS(null, "x", x);
        label.setAttributeNS(null, "y", -y);
        if (style.fontColor) {
            label.setAttributeNS(null, "fill", style.fontColor);
        }
        if (style.fontStrokeColor) {
            label.setAttributeNS(null, "stroke", style.fontStrokeColor);
        }
        if (style.fontStrokeWidth) {
            label.setAttributeNS(null, "stroke-width", style.fontStrokeWidth);
        }
        if (style.fontOpacity) {
            label.setAttributeNS(null, "opacity", style.fontOpacity);
        }
        if (style.fontFamily) {
            label.setAttributeNS(null, "font-family", style.fontFamily);
        }
        if (style.fontSize) {
            label.setAttributeNS(null, "font-size", style.fontSize);
        }
        if (style.fontWeight) {
            label.setAttributeNS(null, "font-weight", style.fontWeight);
        }
        if (style.fontStyle) {
            label.setAttributeNS(null, "font-style", style.fontStyle);
        }
        if (style.labelSelect === true) {
            label.setAttributeNS(null, "pointer-events", "visible");
            label._featureId = featureId;
        } else {
            label.setAttributeNS(null, "pointer-events", "none");
        }
        var align = style.labelAlign || OpenLayers.Renderer.defaultSymbolizer.labelAlign;
        label.setAttributeNS(null, "text-anchor", OpenLayers.Renderer.SVG.LABEL_ALIGN[align[0]] || "middle");
        if (OpenLayers.IS_GECKO === true) {
            label.setAttributeNS(null, "dominant-baseline", OpenLayers.Renderer.SVG.LABEL_ALIGN[align[1]] || "central");
        }
        var labelRows = style.label.split('\n');
        var numRows = labelRows.length;
        while (label.childNodes.length > numRows) {
            label.removeChild(label.lastChild);
        }
        for (var i = 0; i < numRows; i++) {
            var tspan = this.nodeFactory(featureId + suffix + "_tspan_" + i, "tspan");
            if (style.labelSelect === true) {
                tspan._featureId = featureId;
                tspan._geometry = location;
                tspan._geometryClass = location.CLASS_NAME;
            }
            if (OpenLayers.IS_GECKO === false) {
                tspan.setAttributeNS(null, "baseline-shift", OpenLayers.Renderer.SVG.LABEL_VSHIFT[align[1]] || "-35%");
            }
            tspan.setAttribute("x", x);
            if (i == 0) {
                var vfactor = OpenLayers.Renderer.SVG.LABEL_VFACTOR[align[1]];
                if (vfactor == null) {
                    vfactor = -.5;
                }
                tspan.setAttribute("dy", (vfactor * (numRows - 1)) + "em");
            } else {
                tspan.setAttribute("dy", "1em");
            }
            tspan.textContent = (labelRows[i] === '') ? ' ' : labelRows[i];
            if (!tspan.parentNode) {
                label.appendChild(tspan);
            }
        }
        if (!label.parentNode) {
            this.textRoot.appendChild(label);
        }
    },
    getComponentsString: function (components, separator) {
        var renderCmp = [];
        var complete = true;
        var len = components.length;
        var strings = [];
        var str, component;
        for (var i = 0; i < len; i++) {
            component = components[i];
            renderCmp.push(component);
            str = this.getShortString(component);
            if (str) {
                strings.push(str);
            } else {
                if (i > 0) {
                    if (this.getShortString(components[i - 1])) {
                        strings.push(this.clipLine(components[i], components[i - 1]));
                    }
                }
                if (i < len - 1) {
                    if (this.getShortString(components[i + 1])) {
                        strings.push(this.clipLine(components[i], components[i + 1]));
                    }
                }
                complete = false;
            }
        }
        return {
            path: strings.join(separator || ","),
            complete: complete
        };
    },
    clipLine: function (badComponent, goodComponent) {
        if (goodComponent.equals(badComponent)) {
            return "";
        }
        var resolution = this.getResolution();
        var maxX = this.MAX_PIXEL - this.translationParameters.x;
        var maxY = this.MAX_PIXEL - this.translationParameters.y;
        var x1 = (goodComponent.x - this.featureDx) / resolution + this.left;
        var y1 = this.top - goodComponent.y / resolution;
        var x2 = (badComponent.x - this.featureDx) / resolution + this.left;
        var y2 = this.top - badComponent.y / resolution;
        var k;
        if (x2 < -maxX || x2 > maxX) {
            k = (y2 - y1) / (x2 - x1);
            x2 = x2 < 0 ? -maxX : maxX;
            y2 = y1 + (x2 - x1) * k;
        }
        if (y2 < -maxY || y2 > maxY) {
            k = (x2 - x1) / (y2 - y1);
            y2 = y2 < 0 ? -maxY : maxY;
            x2 = x1 + (y2 - y1) * k;
        }
        return x2 + "," + y2;
    },
    getShortString: function (point) {
        var resolution = this.getResolution();
        var x = ((point.x - this.featureDx) / resolution + this.left);
        var y = (this.top - point.y / resolution);
        if (this.inValidRange(x, y)) {
            return x + "," + y;
        } else {
            return false;
        }
    },
    getPosition: function (node) {
        return ({
            x: parseFloat(node.getAttributeNS(null, "cx")),
            y: parseFloat(node.getAttributeNS(null, "cy"))
        });
    },
    importSymbol: function (graphicName) {
        if (!this.defs) {
            this.defs = this.createDefs();
        }
        var id = this.container.id + "-" + graphicName;
        var existing = document.getElementById(id);
        if (existing != null) {
            return existing;
        }
        var symbol = OpenLayers.Renderer.symbol[graphicName];
        if (!symbol) {
            throw new Error(graphicName + ' is not a valid symbol name');
        }
        var symbolNode = this.nodeFactory(id, "symbol");
        var node = this.nodeFactory(null, "polygon");
        symbolNode.appendChild(node);
        var symbolExtent = new OpenLayers.Bounds(Number.MAX_VALUE, Number.MAX_VALUE, 0, 0);
        var points = [];
        var x, y;
        for (var i = 0; i < symbol.length; i = i + 2) {
            x = symbol[i];
            y = symbol[i + 1];
            symbolExtent.left = Math.min(symbolExtent.left, x);
            symbolExtent.bottom = Math.min(symbolExtent.bottom, y);
            symbolExtent.right = Math.max(symbolExtent.right, x);
            symbolExtent.top = Math.max(symbolExtent.top, y);
            points.push(x, ",", y);
        }
        node.setAttributeNS(null, "points", points.join(" "));
        var width = symbolExtent.getWidth();
        var height = symbolExtent.getHeight();
        var viewBox = [symbolExtent.left - width, symbolExtent.bottom - height, width * 3, height * 3];
        symbolNode.setAttributeNS(null, "viewBox", viewBox.join(" "));
        this.symbolMetrics[id] = [Math.max(width, height), symbolExtent.getCenterLonLat().lon, symbolExtent.getCenterLonLat().lat];
        this.defs.appendChild(symbolNode);
        return symbolNode;
    },
    getFeatureIdFromEvent: function (evt) {
        var featureId = OpenLayers.Renderer.Elements.prototype.getFeatureIdFromEvent.apply(this, arguments);
        if (!featureId) {
            var target = evt.target;
            featureId = target.parentNode && target != this.rendererRoot ? target.parentNode._featureId : undefined;
        }
        return featureId;
    },
    CLASS_NAME: "OpenLayers.Renderer.SVG"
});
OpenLayers.Renderer.SVG.LABEL_ALIGN = {
    "l": "start",
    "r": "end",
    "b": "bottom",
    "t": "hanging"
};
OpenLayers.Renderer.SVG.LABEL_VSHIFT = {
    "t": "-70%",
    "b": "0"
};
OpenLayers.Renderer.SVG.LABEL_VFACTOR = {
    "t": 0,
    "b": -1
};
OpenLayers.Renderer.SVG.preventDefault = function (e) {
    e.preventDefault && e.preventDefault();
};
OpenLayers.Renderer.VML = OpenLayers.Class(OpenLayers.Renderer.Elements, {
    xmlns: "urn:schemas-microsoft-com:vml",
    symbolCache: {},
    offset: null,
    initialize: function (containerID) {
        if (!this.supported()) {
            return;
        }
        if (!document.namespaces.olv) {
            document.namespaces.add("olv", this.xmlns);
            var style = document.createStyleSheet();
            var shapes = ['shape', 'rect', 'oval', 'fill', 'stroke', 'imagedata', 'group', 'textbox'];
            for (var i = 0, len = shapes.length; i < len; i++) {
                style.addRule('olv\\:' + shapes[i], "behavior: url(#default#VML); " + "position: absolute; display: inline-block;");
            }
        }
        OpenLayers.Renderer.Elements.prototype.initialize.apply(this, arguments);
    },
    supported: function () {
        return !!(document.namespaces);
    },
    setExtent: function (extent, resolutionChanged) {
        var coordSysUnchanged = OpenLayers.Renderer.Elements.prototype.setExtent.apply(this, arguments);
        var resolution = this.getResolution();
        var left = (extent.left / resolution) | 0;
        var top = (extent.top / resolution - this.size.h) | 0;
        if (resolutionChanged || !this.offset) {
            this.offset = {
                x: left,
                y: top
            };
            left = 0;
            top = 0;
        } else {
            left = left - this.offset.x;
            top = top - this.offset.y;
        }
        var org = (left - this.xOffset) + " " + top;
        this.root.coordorigin = org;
        var roots = [this.root, this.vectorRoot, this.textRoot];
        var root;
        for (var i = 0, len = roots.length; i < len; ++i) {
            root = roots[i];
            var size = this.size.w + " " + this.size.h;
            root.coordsize = size;
        }
        this.root.style.flip = "y";
        return coordSysUnchanged;
    },
    setSize: function (size) {
        OpenLayers.Renderer.prototype.setSize.apply(this, arguments);
        var roots = [this.rendererRoot, this.root, this.vectorRoot, this.textRoot];
        var w = this.size.w + "px";
        var h = this.size.h + "px";
        var root;
        for (var i = 0, len = roots.length; i < len; ++i) {
            root = roots[i];
            root.style.width = w;
            root.style.height = h;
        }
    },
    getNodeType: function (geometry, style) {
        var nodeType = null;
        switch (geometry.CLASS_NAME) {
        case "OpenLayers.Geometry.Point":
            if (style.externalGraphic) {
                nodeType = "olv:rect";
            } else if (this.isComplexSymbol(style.graphicName)) {
                nodeType = "olv:shape";
            } else {
                nodeType = "olv:oval";
            }
            break;
        case "OpenLayers.Geometry.Rectangle":
            nodeType = "olv:rect";
            break;
        case "OpenLayers.Geometry.LineString":
        case "OpenLayers.Geometry.LinearRing":
        case "OpenLayers.Geometry.Polygon":
        case "OpenLayers.Geometry.Curve":
            nodeType = "olv:shape";
            break;
        default:
            break;
        }
        return nodeType;
    },
    setStyle: function (node, style, options, geometry) {
        style = style || node._style;
        options = options || node._options;
        var fillColor = style.fillColor;
        if (node._geometryClass === "OpenLayers.Geometry.Point") {
            if (style.externalGraphic) {
                options.isFilled = true;
                if (style.graphicTitle) {
                    node.title = style.graphicTitle;
                }
                var width = style.graphicWidth || style.graphicHeight;
                var height = style.graphicHeight || style.graphicWidth;
                width = width ? width : style.pointRadius * 2;
                height = height ? height : style.pointRadius * 2;
                var resolution = this.getResolution();
                var xOffset = (style.graphicXOffset != undefined) ? style.graphicXOffset : -(0.5 * width);
                var yOffset = (style.graphicYOffset != undefined) ? style.graphicYOffset : -(0.5 * height);
                node.style.left = ((((geometry.x - this.featureDx) / resolution - this.offset.x) + xOffset) | 0) + "px";
                node.style.top = (((geometry.y / resolution - this.offset.y) - (yOffset + height)) | 0) + "px";
                node.style.width = width + "px";
                node.style.height = height + "px";
                node.style.flip = "y";
                fillColor = "none";
                options.isStroked = false;
            } else if (this.isComplexSymbol(style.graphicName)) {
                var cache = this.importSymbol(style.graphicName);
                node.path = cache.path;
                node.coordorigin = cache.left + "," + cache.bottom;
                var size = cache.size;
                node.coordsize = size + "," + size;
                this.drawCircle(node, geometry, style.pointRadius);
                node.style.flip = "y";
            } else {
                this.drawCircle(node, geometry, style.pointRadius);
            }
        }
        if (options.isFilled) {
            node.fillcolor = fillColor;
        } else {
            node.filled = "false";
        }
        var fills = node.getElementsByTagName("fill");
        var fill = (fills.length == 0) ? null : fills[0];
        if (!options.isFilled) {
            if (fill) {
                node.removeChild(fill);
            }
        } else {
            if (!fill) {
                fill = this.createNode('olv:fill', node.id + "_fill");
            }
            fill.opacity = style.fillOpacity;
            if (node._geometryClass === "OpenLayers.Geometry.Point" && style.externalGraphic) {
                if (style.graphicOpacity) {
                    fill.opacity = style.graphicOpacity;
                }
                fill.src = style.externalGraphic;
                fill.type = "frame";
                if (!(style.graphicWidth && style.graphicHeight)) {
                    fill.aspect = "atmost";
                }
            }
            if (fill.parentNode != node) {
                node.appendChild(fill);
            }
        }
        var rotation = style.rotation;
        if ((rotation !== undefined || node._rotation !== undefined)) {
            node._rotation = rotation;
            if (style.externalGraphic) {
                this.graphicRotate(node, xOffset, yOffset, style);
                fill.opacity = 0;
            } else if (node._geometryClass === "OpenLayers.Geometry.Point") {
                node.style.rotation = rotation || 0;
            }
        }
        var strokes = node.getElementsByTagName("stroke");
        var stroke = (strokes.length == 0) ? null : strokes[0];
        if (!options.isStroked) {
            node.stroked = false;
            if (stroke) {
                stroke.on = false;
            }
        } else {
            if (!stroke) {
                stroke = this.createNode('olv:stroke', node.id + "_stroke");
                node.appendChild(stroke);
            }
            stroke.on = true;
            stroke.color = style.strokeColor;
            stroke.weight = style.strokeWidth + "px";
            stroke.opacity = style.strokeOpacity;
            stroke.endcap = style.strokeLinecap == 'butt' ? 'flat' : (style.strokeLinecap || 'round');
            if (style.strokeDashstyle) {
                stroke.dashstyle = this.dashStyle(style);
            }
        }
        if (style.cursor != "inherit" && style.cursor != null) {
            node.style.cursor = style.cursor;
        }
        return node;
    },
    graphicRotate: function (node, xOffset, yOffset, style) {
        var style = style || node._style;
        var rotation = style.rotation || 0;
        var aspectRatio, size;
        if (!(style.graphicWidth && style.graphicHeight)) {
            var img = new Image();
            img.onreadystatechange = OpenLayers.Function.bind(function () {
                if (img.readyState == "complete" || img.readyState == "interactive") {
                    aspectRatio = img.width / img.height;
                    size = Math.max(style.pointRadius * 2, style.graphicWidth || 0, style.graphicHeight || 0);
                    xOffset = xOffset * aspectRatio;
                    style.graphicWidth = size * aspectRatio;
                    style.graphicHeight = size;
                    this.graphicRotate(node, xOffset, yOffset, style);
                }
            }, this);
            img.src = style.externalGraphic;
            return;
        } else {
            size = Math.max(style.graphicWidth, style.graphicHeight);
            aspectRatio = style.graphicWidth / style.graphicHeight;
        }
        var width = Math.round(style.graphicWidth || size * aspectRatio);
        var height = Math.round(style.graphicHeight || size);
        node.style.width = width + "px";
        node.style.height = height + "px";
        var image = document.getElementById(node.id + "_image");
        if (!image) {
            image = this.createNode("olv:imagedata", node.id + "_image");
            node.appendChild(image);
        }
        image.style.width = width + "px";
        image.style.height = height + "px";
        image.src = style.externalGraphic;
        image.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(" + "src='', sizingMethod='scale')";
        var rot = rotation * Math.PI / 180;
        var sintheta = Math.sin(rot);
        var costheta = Math.cos(rot);
        var filter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + costheta + ",M12=" + (-sintheta) + ",M21=" + sintheta + ",M22=" + costheta + ",SizingMethod='auto expand')\n";
        var opacity = style.graphicOpacity || style.fillOpacity;
        if (opacity && opacity != 1) {
            filter += "progid:DXImageTransform.Microsoft.BasicImage(opacity=" +
                opacity + ")\n";
        }
        node.style.filter = filter;
        var centerPoint = new OpenLayers.Geometry.Point(-xOffset, -yOffset);
        var imgBox = new OpenLayers.Bounds(0, 0, width, height).toGeometry();
        imgBox.rotate(style.rotation, centerPoint);
        var imgBounds = imgBox.getBounds();
        node.style.left = Math.round(parseInt(node.style.left) + imgBounds.left) + "px";
        node.style.top = Math.round(parseInt(node.style.top) - imgBounds.bottom) + "px";
    },
    postDraw: function (node) {
        node.style.visibility = "visible";
        var fillColor = node._style.fillColor;
        var strokeColor = node._style.strokeColor;
        if (fillColor == "none" && node.fillcolor != fillColor) {
            node.fillcolor = fillColor;
        }
        if (strokeColor == "none" && node.strokecolor != strokeColor) {
            node.strokecolor = strokeColor;
        }
    },
    setNodeDimension: function (node, geometry) {
        var bbox = geometry.getBounds();
        if (bbox) {
            var resolution = this.getResolution();
            var scaledBox = new OpenLayers.Bounds(((bbox.left - this.featureDx) / resolution - this.offset.x) | 0, (bbox.bottom / resolution - this.offset.y) | 0, ((bbox.right - this.featureDx) / resolution - this.offset.x) | 0, (bbox.top / resolution - this.offset.y) | 0);
            node.style.left = scaledBox.left + "px";
            node.style.top = scaledBox.top + "px";
            node.style.width = scaledBox.getWidth() + "px";
            node.style.height = scaledBox.getHeight() + "px";
            node.coordorigin = scaledBox.left + " " + scaledBox.top;
            node.coordsize = scaledBox.getWidth() + " " + scaledBox.getHeight();
        }
    },
    dashStyle: function (style) {
        var dash = style.strokeDashstyle;
        switch (dash) {
        case 'solid':
        case 'dot':
        case 'dash':
        case 'dashdot':
        case 'longdash':
        case 'longdashdot':
            return dash;
        default:
            var parts = dash.split(/[ ,]/);
            if (parts.length == 2) {
                if (1 * parts[0] >= 2 * parts[1]) {
                    return "longdash";
                }
                return (parts[0] == 1 || parts[1] == 1) ? "dot" : "dash";
            } else if (parts.length == 4) {
                return (1 * parts[0] >= 2 * parts[1]) ? "longdashdot" : "dashdot";
            }
            return "solid";
        }
    },
    createNode: function (type, id) {
        var node = document.createElement(type);
        if (id) {
            node.id = id;
        }
        node.unselectable = 'on';
        node.onselectstart = OpenLayers.Function.False;
        return node;
    },
    nodeTypeCompare: function (node, type) {
        var subType = type;
        var splitIndex = subType.indexOf(":");
        if (splitIndex != -1) {
            subType = subType.substr(splitIndex + 1);
        }
        var nodeName = node.nodeName;
        splitIndex = nodeName.indexOf(":");
        if (splitIndex != -1) {
            nodeName = nodeName.substr(splitIndex + 1);
        }
        return (subType == nodeName);
    },
    createRenderRoot: function () {
        return this.nodeFactory(this.container.id + "_vmlRoot", "div");
    },
    createRoot: function (suffix) {
        return this.nodeFactory(this.container.id + suffix, "olv:group");
    },
    drawPoint: function (node, geometry) {
        return this.drawCircle(node, geometry, 1);
    },
    drawCircle: function (node, geometry, radius) {
        if (!isNaN(geometry.x) && !isNaN(geometry.y)) {
            var resolution = this.getResolution();
            node.style.left = ((((geometry.x - this.featureDx) / resolution - this.offset.x) | 0) - radius) + "px";
            node.style.top = (((geometry.y / resolution - this.offset.y) | 0) - radius) + "px";
            var diameter = radius * 2;
            node.style.width = diameter + "px";
            node.style.height = diameter + "px";
            return node;
        }
        return false;
    },
    drawLineString: function (node, geometry) {
        return this.drawLine(node, geometry, false);
    },
    drawLinearRing: function (node, geometry) {
        return this.drawLine(node, geometry, true);
    },
    drawLine: function (node, geometry, closeLine) {
        this.setNodeDimension(node, geometry);
        var resolution = this.getResolution();
        var numComponents = geometry.components.length;
        var parts = new Array(numComponents);
        var comp, x, y;
        for (var i = 0; i < numComponents; i++) {
            comp = geometry.components[i];
            x = ((comp.x - this.featureDx) / resolution - this.offset.x) | 0;
            y = (comp.y / resolution - this.offset.y) | 0;
            parts[i] = " " + x + "," + y + " l ";
        }
        var end = (closeLine) ? " x e" : " e";
        node.path = "m" + parts.join("") + end;
        return node;
    },
    drawPolygon: function (node, geometry) {
        this.setNodeDimension(node, geometry);
        var resolution = this.getResolution();
        var path = [];
        var j, jj, points, area, first, second, i, ii, comp, pathComp, x, y;
        for (j = 0, jj = geometry.components.length; j < jj; j++) {
            path.push("m");
            points = geometry.components[j].components;
            area = (j === 0);
            first = null;
            second = null;
            for (i = 0, ii = points.length; i < ii; i++) {
                comp = points[i];
                x = ((comp.x - this.featureDx) / resolution - this.offset.x) | 0;
                y = (comp.y / resolution - this.offset.y) | 0;
                pathComp = " " + x + "," + y;
                path.push(pathComp);
                if (i == 0) {
                    path.push(" l");
                }
                if (!area) {
                    if (!first) {
                        first = pathComp;
                    } else if (first != pathComp) {
                        if (!second) {
                            second = pathComp;
                        } else if (second != pathComp) {
                            area = true;
                        }
                    }
                }
            }
            path.push(area ? " x " : " ");
        }
        path.push("e");
        node.path = path.join("");
        return node;
    },
    drawRectangle: function (node, geometry) {
        var resolution = this.getResolution();
        node.style.left = (((geometry.x - this.featureDx) / resolution - this.offset.x) | 0) + "px";
        node.style.top = ((geometry.y / resolution - this.offset.y) | 0) + "px";
        node.style.width = ((geometry.width / resolution) | 0) + "px";
        node.style.height = ((geometry.height / resolution) | 0) + "px";
        return node;
    },
    drawText: function (featureId, style, location) {
        var label = this.nodeFactory(featureId + this.LABEL_ID_SUFFIX, "olv:rect");
        var textbox = this.nodeFactory(featureId + this.LABEL_ID_SUFFIX + "_textbox", "olv:textbox");
        var resolution = this.getResolution();
        label.style.left = (((location.x - this.featureDx) / resolution - this.offset.x) | 0) + "px";
        label.style.top = ((location.y / resolution - this.offset.y) | 0) + "px";
        label.style.flip = "y";
        textbox.innerText = style.label;
        if (style.cursor != "inherit" && style.cursor != null) {
            textbox.style.cursor = style.cursor;
        }
        if (style.fontColor) {
            textbox.style.color = style.fontColor;
        }
        if (style.fontOpacity) {
            textbox.style.filter = 'alpha(opacity=' + (style.fontOpacity * 100) + ')';
        }
        if (style.fontFamily) {
            textbox.style.fontFamily = style.fontFamily;
        }
        if (style.fontSize) {
            textbox.style.fontSize = style.fontSize;
        }
        if (style.fontWeight) {
            textbox.style.fontWeight = style.fontWeight;
        }
        if (style.fontStyle) {
            textbox.style.fontStyle = style.fontStyle;
        }
        if (style.labelSelect === true) {
            label._featureId = featureId;
            textbox._featureId = featureId;
            textbox._geometry = location;
            textbox._geometryClass = location.CLASS_NAME;
        }
        if (style.labelOutlineColor)
            textbox.style.backgroundColor = style.labelOutlineColor;
        textbox.style.whiteSpace = "nowrap";
        textbox.inset = "1px,0px,0px,0px";
        if (!label.parentNode) {
            label.appendChild(textbox);
            this.textRoot.appendChild(label);
        }
        var align = style.labelAlign || "cm";
        if (align.length == 1) {
            align += "m";
        }
        var xshift = textbox.clientWidth * (OpenLayers.Renderer.VML.LABEL_SHIFT[align.substr(0, 1)]);
        var yshift = textbox.clientHeight * (OpenLayers.Renderer.VML.LABEL_SHIFT[align.substr(1, 1)]);
        label.style.left = parseInt(label.style.left) - xshift - 1 + "px";
        label.style.top = parseInt(label.style.top) + yshift + "px";
    },
    moveRoot: function (renderer) {
        var layer = this.map.getLayer(renderer.container.id);
        if (layer instanceof OpenLayers.Layer.Vector.RootContainer) {
            layer = this.map.getLayer(this.container.id);
        }
        layer && layer.renderer.clear();
        OpenLayers.Renderer.Elements.prototype.moveRoot.apply(this, arguments);
        layer && layer.redraw();
    },
    importSymbol: function (graphicName) {
        var id = this.container.id + "-" + graphicName;
        var cache = this.symbolCache[id];
        if (cache) {
            return cache;
        }
        var symbol = OpenLayers.Renderer.symbol[graphicName];
        if (!symbol) {
            throw new Error(graphicName + ' is not a valid symbol name');
        }
        var symbolExtent = new OpenLayers.Bounds(Number.MAX_VALUE, Number.MAX_VALUE, 0, 0);
        var pathitems = ["m"];
        for (var i = 0; i < symbol.length; i = i + 2) {
            var x = symbol[i];
            var y = symbol[i + 1];
            symbolExtent.left = Math.min(symbolExtent.left, x);
            symbolExtent.bottom = Math.min(symbolExtent.bottom, y);
            symbolExtent.right = Math.max(symbolExtent.right, x);
            symbolExtent.top = Math.max(symbolExtent.top, y);
            pathitems.push(x);
            pathitems.push(y);
            if (i == 0) {
                pathitems.push("l");
            }
        }
        pathitems.push("x e");
        var path = pathitems.join(" ");
        var diff = (symbolExtent.getWidth() - symbolExtent.getHeight()) / 2;
        if (diff > 0) {
            symbolExtent.bottom = symbolExtent.bottom - diff;
            symbolExtent.top = symbolExtent.top + diff;
        } else {
            symbolExtent.left = symbolExtent.left + diff;
            symbolExtent.right = symbolExtent.right - diff;
        }
        cache = {
            path: path,
            size: symbolExtent.getWidth(),
            left: symbolExtent.left,
            bottom: symbolExtent.bottom
        };
        this.symbolCache[id] = cache;
        return cache;
    },
    CLASS_NAME: "OpenLayers.Renderer.VML"
});
OpenLayers.Renderer.VML.LABEL_SHIFT = {
    "l": 0,
    "c": .5,
    "r": 1,
    "t": 0,
    "m": .5,
    "b": 1
};
OpenLayers.Layer.Vector = OpenLayers.Class(OpenLayers.Layer, {
    isBaseLayer: false,
    isFixed: false,
    features: null,
    filter: null,
    selectedFeatures: null,
    unrenderedFeatures: null,
    reportError: true,
    style: null,
    styleMap: null,
    strategies: null,
    protocol: null,
    renderers: ['SVG', 'VML', 'Canvas'],
    renderer: null,
    rendererOptions: null,
    geometryType: null,
    drawn: false,
    ratio: 1,
    initialize: function (name, options) {
        OpenLayers.Layer.prototype.initialize.apply(this, arguments);
        if (!this.renderer || !this.renderer.supported()) {
            this.assignRenderer();
        }
        if (!this.renderer || !this.renderer.supported()) {
            this.renderer = null;
            this.displayError();
        }
        if (!this.styleMap) {
            this.styleMap = new OpenLayers.StyleMap();
        }
        this.features = [];
        this.selectedFeatures = [];
        this.unrenderedFeatures = {};
        if (this.strategies) {
            for (var i = 0, len = this.strategies.length; i < len; i++) {
                this.strategies[i].setLayer(this);
            }
        }
    },
    destroy: function () {
        if (this.strategies) {
            var strategy, i, len;
            for (i = 0, len = this.strategies.length; i < len; i++) {
                strategy = this.strategies[i];
                if (strategy.autoDestroy) {
                    strategy.destroy();
                }
            }
            this.strategies = null;
        }
        if (this.protocol) {
            if (this.protocol.autoDestroy) {
                this.protocol.destroy();
            }
            this.protocol = null;
        }
        this.destroyFeatures();
        this.features = null;
        this.selectedFeatures = null;
        this.unrenderedFeatures = null;
        if (this.renderer) {
            this.renderer.destroy();
        }
        this.renderer = null;
        this.geometryType = null;
        this.drawn = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments);
    },
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.Vector(this.name, this.getOptions());
        }
        obj = OpenLayers.Layer.prototype.clone.apply(this, [obj]);
        var features = this.features;
        var len = features.length;
        var clonedFeatures = new Array(len);
        for (var i = 0; i < len; ++i) {
            clonedFeatures[i] = features[i].clone();
        }
        obj.features = clonedFeatures;
        return obj;
    },
    refresh: function (obj) {
        if (this.calculateInRange() && this.visibility) {
            this.events.triggerEvent("refresh", obj);
        }
    },
    assignRenderer: function () {
        for (var i = 0, len = this.renderers.length; i < len; i++) {
            var rendererClass = this.renderers[i];
            var renderer = (typeof rendererClass == "function") ? rendererClass : OpenLayers.Renderer[rendererClass];
            if (renderer && renderer.prototype.supported()) {
                this.renderer = new renderer(this.div, this.rendererOptions);
                break;
            }
        }
    },
    displayError: function () {
        if (this.reportError) {
            OpenLayers.Console.userError(OpenLayers.i18n("browserNotSupported", {
                renderers: this.renderers.join('\n')
            }));
        }
    },
    setMap: function (map) {
        OpenLayers.Layer.prototype.setMap.apply(this, arguments);
        if (!this.renderer) {
            this.map.removeLayer(this);
        } else {
            this.renderer.map = this.map;
            var newSize = this.map.getSize();
            newSize.w = newSize.w * this.ratio;
            newSize.h = newSize.h * this.ratio;
            this.renderer.setSize(newSize);
        }
    },
    afterAdd: function () {
        if (this.strategies) {
            var strategy, i, len;
            for (i = 0, len = this.strategies.length; i < len; i++) {
                strategy = this.strategies[i];
                if (strategy.autoActivate) {
                    strategy.activate();
                }
            }
        }
    },
    removeMap: function (map) {
        this.drawn = false;
        if (this.strategies) {
            var strategy, i, len;
            for (i = 0, len = this.strategies.length; i < len; i++) {
                strategy = this.strategies[i];
                if (strategy.autoActivate) {
                    strategy.deactivate();
                }
            }
        }
    },
    onMapResize: function () {
        OpenLayers.Layer.prototype.onMapResize.apply(this, arguments);
        var newSize = this.map.getSize();
        newSize.w = newSize.w * this.ratio;
        newSize.h = newSize.h * this.ratio;
        this.renderer.setSize(newSize);
    },
    moveTo: function (bounds, zoomChanged, dragging) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);
        var coordSysUnchanged = true;
        if (!dragging) {
            this.renderer.root.style.visibility = 'hidden';
            var viewSize = this.map.getSize(),
                viewWidth = viewSize.w,
                viewHeight = viewSize.h,
                offsetLeft = (viewWidth / 2 * this.ratio) - viewWidth / 2,
                offsetTop = (viewHeight / 2 * this.ratio) - viewHeight / 2;
            offsetLeft += parseInt(this.map.layerContainerDiv.style.left, 10);
            offsetLeft = -Math.round(offsetLeft);
            offsetTop += parseInt(this.map.layerContainerDiv.style.top, 10);
            offsetTop = -Math.round(offsetTop);
            this.div.style.left = offsetLeft + 'px';
            this.div.style.top = offsetTop + 'px';
            var extent = this.map.getExtent().scale(this.ratio);
            coordSysUnchanged = this.renderer.setExtent(extent, zoomChanged);
            this.renderer.root.style.visibility = 'visible';
            if (OpenLayers.IS_GECKO === true) {
                this.div.scrollLeft = this.div.scrollLeft;
            }
            if (!zoomChanged && coordSysUnchanged) {
                for (var i in this.unrenderedFeatures) {
                    var feature = this.unrenderedFeatures[i];
                    this.drawFeature(feature);
                }
            }
        }
        if (!this.drawn || zoomChanged || !coordSysUnchanged) {
            this.drawn = true;
            var feature;
            for (var i = 0, len = this.features.length; i < len; i++) {
                this.renderer.locked = (i !== (len - 1));
                feature = this.features[i];
                this.drawFeature(feature);
            }
        }
    },
    display: function (display) {
        OpenLayers.Layer.prototype.display.apply(this, arguments);
        var currentDisplay = this.div.style.display;
        if (currentDisplay != this.renderer.root.style.display) {
            this.renderer.root.style.display = currentDisplay;
        }
    },
    addFeatures: function (features, options) {
        if (!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }
        var notify = !options || !options.silent;
        if (notify) {
            var event = {
                features: features
            };
            var ret = this.events.triggerEvent("beforefeaturesadded", event);
            if (ret === false) {
                return;
            }
            features = event.features;
        }
        var featuresAdded = [];
        for (var i = 0, len = features.length; i < len; i++) {
            if (i != (features.length - 1)) {
                this.renderer.locked = true;
            } else {
                this.renderer.locked = false;
            }
            var feature = features[i];
            if (this.geometryType && !(feature.geometry instanceof this.geometryType)) {
                throw new TypeError('addFeatures: component should be an ' +
                    this.geometryType.prototype.CLASS_NAME);
            }
            feature.layer = this;
            if (!feature.style && this.style) {
                feature.style = OpenLayers.Util.extend({}, this.style);
            }
            if (notify) {
                if (this.events.triggerEvent("beforefeatureadded", {
                    feature: feature
                }) === false) {
                    continue;
                }
                this.preFeatureInsert(feature);
            }
            featuresAdded.push(feature);
            this.features.push(feature);
            this.drawFeature(feature);
            if (notify) {
                this.events.triggerEvent("featureadded", {
                    feature: feature
                });
                this.onFeatureInsert(feature);
            }
        }
        if (notify) {
            this.events.triggerEvent("featuresadded", {
                features: featuresAdded
            });
        }
    },
    removeFeatures: function (features, options) {
        if (!features || features.length === 0) {
            return;
        }
        if (features === this.features) {
            return this.removeAllFeatures(options);
        }
        if (!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }
        if (features === this.selectedFeatures) {
            features = features.slice();
        }
        var notify = !options || !options.silent;
        if (notify) {
            this.events.triggerEvent("beforefeaturesremoved", {
                features: features
            });
        }
        for (var i = features.length - 1; i >= 0; i--) {
            if (i != 0 && features[i - 1].geometry) {
                this.renderer.locked = true;
            } else {
                this.renderer.locked = false;
            }
            var feature = features[i];
            delete this.unrenderedFeatures[feature.id];
            if (notify) {
                this.events.triggerEvent("beforefeatureremoved", {
                    feature: feature
                });
            }
            this.features = OpenLayers.Util.removeItem(this.features, feature);
            feature.layer = null;
            if (feature.geometry) {
                this.renderer.eraseFeatures(feature);
            }
            if (OpenLayers.Util.indexOf(this.selectedFeatures, feature) != -1) {
                OpenLayers.Util.removeItem(this.selectedFeatures, feature);
            }
            if (notify) {
                this.events.triggerEvent("featureremoved", {
                    feature: feature
                });
            }
        }
        if (notify) {
            this.events.triggerEvent("featuresremoved", {
                features: features
            });
        }
    },
    removeAllFeatures: function (options) {
        var notify = !options || !options.silent;
        var features = this.features;
        if (notify) {
            this.events.triggerEvent("beforefeaturesremoved", {
                features: features
            });
        }
        var feature;
        for (var i = features.length - 1; i >= 0; i--) {
            feature = features[i];
            if (notify) {
                this.events.triggerEvent("beforefeatureremoved", {
                    feature: feature
                });
            }
            feature.layer = null;
            if (notify) {
                this.events.triggerEvent("featureremoved", {
                    feature: feature
                });
            }
        }
        this.renderer.clear();
        this.features = [];
        this.unrenderedFeatures = {};
        this.selectedFeatures = [];
        if (notify) {
            this.events.triggerEvent("featuresremoved", {
                features: features
            });
        }
    },
    destroyFeatures: function (features, options) {
        var all = (features == undefined);
        if (all) {
            features = this.features;
        }
        if (features) {
            this.removeFeatures(features, options);
            for (var i = features.length - 1; i >= 0; i--) {
                features[i].destroy();
            }
        }
    },
    drawFeature: function (feature, style) {
        if (!this.drawn) {
            return;
        }
        if (typeof style != "object") {
            if (!style && feature.state === OpenLayers.State.DELETE) {
                style = "delete";
            }
            var renderIntent = style || feature.renderIntent;
            style = feature.style || this.style;
            if (!style) {
                style = this.styleMap.createSymbolizer(feature, renderIntent);
            }
        }
        var drawn = this.renderer.drawFeature(feature, style);
        if (drawn === false || drawn === null) {
            this.unrenderedFeatures[feature.id] = feature;
        } else {
            delete this.unrenderedFeatures[feature.id];
        }
    },
    eraseFeatures: function (features) {
        this.renderer.eraseFeatures(features);
    },
    getFeatureFromEvent: function (evt) {
        if (!this.renderer) {
            throw new Error('getFeatureFromEvent called on layer with no ' + 'renderer. This usually means you destroyed a ' + 'layer, but not some handler which is associated ' + 'with it.');
        }
        var feature = null;
        var featureId = this.renderer.getFeatureIdFromEvent(evt);
        if (featureId) {
            if (typeof featureId === "string") {
                feature = this.getFeatureById(featureId);
            } else {
                feature = featureId;
            }
        }
        return feature;
    },
    getFeatureBy: function (property, value) {
        var feature = null;
        for (var i = 0, len = this.features.length; i < len; ++i) {
            if (this.features[i][property] == value) {
                feature = this.features[i];
                break;
            }
        }
        return feature;
    },
    getFeatureById: function (featureId) {
        return this.getFeatureBy('id', featureId);
    },
    getFeatureByFid: function (featureFid) {
        return this.getFeatureBy('fid', featureFid);
    },
    getFeaturesByAttribute: function (attrName, attrValue) {
        var i, feature, len = this.features.length,
            foundFeatures = [];
        for (i = 0; i < len; i++) {
            feature = this.features[i];
            if (feature && feature.attributes) {
                if (feature.attributes[attrName] === attrValue) {
                    foundFeatures.push(feature);
                }
            }
        }
        return foundFeatures;
    },
    onFeatureInsert: function (feature) {},
    preFeatureInsert: function (feature) {},
    getDataExtent: function () {
        var maxExtent = null;
        var features = this.features;
        if (features && (features.length > 0)) {
            var geometry = null;
            for (var i = 0, len = features.length; i < len; i++) {
                geometry = features[i].geometry;
                if (geometry) {
                    if (maxExtent === null) {
                        maxExtent = new OpenLayers.Bounds();
                    }
                    maxExtent.extend(geometry.getBounds());
                }
            }
        }
        return maxExtent;
    },
    CLASS_NAME: "OpenLayers.Layer.Vector"
});
OpenLayers.Layer.Vector.RootContainer = OpenLayers.Class(OpenLayers.Layer.Vector, {
    displayInLayerSwitcher: false,
    layers: null,
    display: function () {},
    getFeatureFromEvent: function (evt) {
        var layers = this.layers;
        var feature;
        for (var i = 0; i < layers.length; i++) {
            feature = layers[i].getFeatureFromEvent(evt);
            if (feature) {
                return feature;
            }
        }
    },
    setMap: function (map) {
        OpenLayers.Layer.Vector.prototype.setMap.apply(this, arguments);
        this.collectRoots();
        map.events.register("changelayer", this, this.handleChangeLayer);
    },
    removeMap: function (map) {
        map.events.unregister("changelayer", this, this.handleChangeLayer);
        this.resetRoots();
        OpenLayers.Layer.Vector.prototype.removeMap.apply(this, arguments);
    },
    collectRoots: function () {
        var layer;
        for (var i = 0; i < this.map.layers.length; ++i) {
            layer = this.map.layers[i];
            if (OpenLayers.Util.indexOf(this.layers, layer) != -1) {
                layer.renderer.moveRoot(this.renderer);
            }
        }
    },
    resetRoots: function () {
        var layer;
        for (var i = 0; i < this.layers.length; ++i) {
            layer = this.layers[i];
            if (this.renderer && layer.renderer.getRenderLayerId() == this.id) {
                this.renderer.moveRoot(layer.renderer);
            }
        }
    },
    handleChangeLayer: function (evt) {
        var layer = evt.layer;
        if (evt.property == "order" && OpenLayers.Util.indexOf(this.layers, layer) != -1) {
            this.resetRoots();
            this.collectRoots();
        }
    },
    CLASS_NAME: "OpenLayers.Layer.Vector.RootContainer"
});
OpenLayers.Strategy = OpenLayers.Class({
    layer: null,
    options: null,
    active: null,
    autoActivate: true,
    autoDestroy: true,
    initialize: function (options) {
        OpenLayers.Util.extend(this, options);
        this.options = options;
        this.active = false;
    },
    destroy: function () {
        this.deactivate();
        this.layer = null;
        this.options = null;
    },
    setLayer: function (layer) {
        this.layer = layer;
    },
    activate: function () {
        if (!this.active) {
            this.active = true;
            return true;
        }
        return false;
    },
    deactivate: function () {
        if (this.active) {
            this.active = false;
            return true;
        }
        return false;
    },
    CLASS_NAME: "OpenLayers.Strategy"
});
OpenLayers.Strategy.BBOX = OpenLayers.Class(OpenLayers.Strategy, {
    bounds: null,
    resolution: null,
    ratio: 2,
    resFactor: null,
    response: null,
    activate: function () {
        var activated = OpenLayers.Strategy.prototype.activate.call(this);
        if (activated) {
            this.layer.events.on({
                "moveend": this.update,
                "refresh": this.update,
                "visibilitychanged": this.update,
                scope: this
            });
            this.update();
        }
        return activated;
    },
    deactivate: function () {
        var deactivated = OpenLayers.Strategy.prototype.deactivate.call(this);
        if (deactivated) {
            this.layer.events.un({
                "moveend": this.update,
                "refresh": this.update,
                "visibilitychanged": this.update,
                scope: this
            });
        }
        return deactivated;
    },
    update: function (options) {
        var mapBounds = this.getMapBounds();
        if (mapBounds !== null && ((options && options.force) || (this.layer.visibility && this.layer.calculateInRange() && this.invalidBounds(mapBounds)))) {
            this.calculateBounds(mapBounds);
            this.resolution = this.layer.map.getResolution();
            this.triggerRead(options);
        }
    },
    getMapBounds: function () {
        if (this.layer.map === null) {
            return null;
        }
        var bounds = this.layer.map.getExtent();
        if (bounds && !this.layer.projection.equals(this.layer.map.getProjectionObject())) {
            bounds = bounds.clone().transform(this.layer.map.getProjectionObject(), this.layer.projection);
        }
        return bounds;
    },
    invalidBounds: function (mapBounds) {
        if (!mapBounds) {
            mapBounds = this.getMapBounds();
        }
        var invalid = !this.bounds || !this.bounds.containsBounds(mapBounds);
        if (!invalid && this.resFactor) {
            var ratio = this.resolution / this.layer.map.getResolution();
            invalid = (ratio >= this.resFactor || ratio <= (1 / this.resFactor));
        }
        return invalid;
    },
    calculateBounds: function (mapBounds) {
        if (!mapBounds) {
            mapBounds = this.getMapBounds();
        }
        var center = mapBounds.getCenterLonLat();
        var dataWidth = mapBounds.getWidth() * this.ratio;
        var dataHeight = mapBounds.getHeight() * this.ratio;
        this.bounds = new OpenLayers.Bounds(center.lon - (dataWidth / 2), center.lat - (dataHeight / 2), center.lon + (dataWidth / 2), center.lat + (dataHeight / 2));
    },
    triggerRead: function (options) {
        if (this.response && !(options && options.noAbort === true)) {
            this.layer.protocol.abort(this.response);
            this.layer.events.triggerEvent("loadend");
        }
        this.layer.events.triggerEvent("loadstart");
        this.response = this.layer.protocol.read(OpenLayers.Util.applyDefaults({
            filter: this.createFilter(),
            callback: this.merge,
            scope: this
        }, options));
    },
    createFilter: function () {
        var filter = new OpenLayers.Filter.Spatial({
            type: OpenLayers.Filter.Spatial.BBOX,
            value: this.bounds,
            projection: this.layer.projection
        });
        if (this.layer.filter) {
            filter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: [this.layer.filter, filter]
            });
        }
        return filter;
    },
    merge: function (resp) {
        this.layer.destroyFeatures();
        var features = resp.features;
        if (features && features.length > 0) {
            var remote = this.layer.projection;
            var local = this.layer.map.getProjectionObject();
            if (!local.equals(remote)) {
                var geom;
                for (var i = 0, len = features.length; i < len; ++i) {
                    geom = features[i].geometry;
                    if (geom) {
                        geom.transform(remote, local);
                    }
                }
            }
            this.layer.addFeatures(features);
        }
        this.response = null;
        this.layer.events.triggerEvent("loadend");
    },
    CLASS_NAME: "OpenLayers.Strategy.BBOX"
});
OpenLayers.Filter = OpenLayers.Class({
    initialize: function (options) {
        OpenLayers.Util.extend(this, options);
    },
    destroy: function () {},
    evaluate: function (context) {
        return true;
    },
    clone: function () {
        return null;
    },
    toString: function () {
        var string;
        if (OpenLayers.Format && OpenLayers.Format.CQL) {
            string = OpenLayers.Format.CQL.prototype.write(this);
        } else {
            string = Object.prototype.toString.call(this);
        }
        return string;
    },
    CLASS_NAME: "OpenLayers.Filter"
});
OpenLayers.Filter.Comparison = OpenLayers.Class(OpenLayers.Filter, {
    type: null,
    property: null,
    value: null,
    matchCase: true,
    lowerBoundary: null,
    upperBoundary: null,
    initialize: function (options) {
        OpenLayers.Filter.prototype.initialize.apply(this, [options]);
        if (this.type === OpenLayers.Filter.Comparison.LIKE && options.matchCase === undefined) {
            this.matchCase = null;
        }
    },
    evaluate: function (context) {
        if (context instanceof OpenLayers.Feature.Vector) {
            context = context.attributes;
        }
        var result = false;
        var got = context[this.property];
        var exp;
        switch (this.type) {
        case OpenLayers.Filter.Comparison.EQUAL_TO:
            exp = this.value;
            if (!this.matchCase && typeof got == "string" && typeof exp == "string") {
                result = (got.toUpperCase() == exp.toUpperCase());
            } else {
                result = (got == exp);
            }
            break;
        case OpenLayers.Filter.Comparison.NOT_EQUAL_TO:
            exp = this.value;
            if (!this.matchCase && typeof got == "string" && typeof exp == "string") {
                result = (got.toUpperCase() != exp.toUpperCase());
            } else {
                result = (got != exp);
            }
            break;
        case OpenLayers.Filter.Comparison.LESS_THAN:
            result = got < this.value;
            break;
        case OpenLayers.Filter.Comparison.GREATER_THAN:
            result = got > this.value;
            break;
        case OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO:
            result = got <= this.value;
            break;
        case OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO:
            result = got >= this.value;
            break;
        case OpenLayers.Filter.Comparison.BETWEEN:
            result = (got >= this.lowerBoundary) && (got <= this.upperBoundary);
            break;
        case OpenLayers.Filter.Comparison.LIKE:
            var regexp = new RegExp(this.value, "gi");
            result = regexp.test(got);
            break;
        }
        return result;
    },
    value2regex: function (wildCard, singleChar, escapeChar) {
        if (wildCard == ".") {
            throw new Error("'.' is an unsupported wildCard character for " + "OpenLayers.Filter.Comparison");
        }
        wildCard = wildCard ? wildCard : "*";
        singleChar = singleChar ? singleChar : ".";
        escapeChar = escapeChar ? escapeChar : "!";
        this.value = this.value.replace(new RegExp("\\" + escapeChar + "(.|$)", "g"), "\\$1");
        this.value = this.value.replace(new RegExp("\\" + singleChar, "g"), ".");
        this.value = this.value.replace(new RegExp("\\" + wildCard, "g"), ".*");
        this.value = this.value.replace(new RegExp("\\\\.\\*", "g"), "\\" + wildCard);
        this.value = this.value.replace(new RegExp("\\\\\\.", "g"), "\\" + singleChar);
        return this.value;
    },
    regex2value: function () {
        var value = this.value;
        value = value.replace(/!/g, "!!");
        value = value.replace(/(\\)?\\\./g, function ($0, $1) {
            return $1 ? $0 : "!.";
        });
        value = value.replace(/(\\)?\\\*/g, function ($0, $1) {
            return $1 ? $0 : "!*";
        });
        value = value.replace(/\\\\/g, "\\");
        value = value.replace(/\.\*/g, "*");
        return value;
    },
    clone: function () {
        return OpenLayers.Util.extend(new OpenLayers.Filter.Comparison(), this);
    },
    CLASS_NAME: "OpenLayers.Filter.Comparison"
});
OpenLayers.Filter.Comparison.EQUAL_TO = "==";
OpenLayers.Filter.Comparison.NOT_EQUAL_TO = "!=";
OpenLayers.Filter.Comparison.LESS_THAN = "<";
OpenLayers.Filter.Comparison.GREATER_THAN = ">";
OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO = "<=";
OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO = ">=";
OpenLayers.Filter.Comparison.BETWEEN = "..";
OpenLayers.Filter.Comparison.LIKE = "~";
OpenLayers.Filter.Spatial = OpenLayers.Class(OpenLayers.Filter, {
    type: null,
    property: null,
    value: null,
    distance: null,
    distanceUnits: null,
    evaluate: function (feature) {
        var intersect = false;
        switch (this.type) {
        case OpenLayers.Filter.Spatial.BBOX:
        case OpenLayers.Filter.Spatial.INTERSECTS:
            if (feature.geometry) {
                var geom = this.value;
                if (this.value.CLASS_NAME == "OpenLayers.Bounds") {
                    geom = this.value.toGeometry();
                }
                if (feature.geometry.intersects(geom)) {
                    intersect = true;
                }
            }
            break;
        default:
            throw new Error('evaluate is not implemented for this filter type.');
        }
        return intersect;
    },
    clone: function () {
        var options = OpenLayers.Util.applyDefaults({
            value: this.value && this.value.clone && this.value.clone()
        }, this);
        return new OpenLayers.Filter.Spatial(options);
    },
    CLASS_NAME: "OpenLayers.Filter.Spatial"
});
OpenLayers.Filter.Spatial.BBOX = "BBOX";
OpenLayers.Filter.Spatial.INTERSECTS = "INTERSECTS";
OpenLayers.Filter.Spatial.DWITHIN = "DWITHIN";
OpenLayers.Filter.Spatial.WITHIN = "WITHIN";
OpenLayers.Filter.Spatial.CONTAINS = "CONTAINS";
OpenLayers.Protocol = OpenLayers.Class({
    format: null,
    options: null,
    autoDestroy: true,
    defaultFilter: null,
    initialize: function (options) {
        options = options || {};
        OpenLayers.Util.extend(this, options);
        this.options = options;
    },
    mergeWithDefaultFilter: function (filter) {
        var merged;
        if (filter && this.defaultFilter) {
            merged = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: [this.defaultFilter, filter]
            });
        } else {
            merged = filter || this.defaultFilter || undefined;
        }
        return merged;
    },
    destroy: function () {
        this.options = null;
        this.format = null;
    },
    read: function (options) {
        options = options || {};
        options.filter = this.mergeWithDefaultFilter(options.filter);
    },
    create: function () {},
    update: function () {},
    "delete": function () {},
    commit: function () {},
    abort: function (response) {},
    createCallback: function (method, response, options) {
        return OpenLayers.Function.bind(function () {
            method.apply(this, [response, options]);
        }, this);
    },
    CLASS_NAME: "OpenLayers.Protocol"
});
OpenLayers.Protocol.Response = OpenLayers.Class({
    code: null,
    requestType: null,
    last: true,
    features: null,
    data: null,
    reqFeatures: null,
    priv: null,
    error: null,
    initialize: function (options) {
        OpenLayers.Util.extend(this, options);
    },
    success: function () {
        return this.code > 0;
    },
    CLASS_NAME: "OpenLayers.Protocol.Response"
});
OpenLayers.Protocol.Response.SUCCESS = 1;
OpenLayers.Protocol.Response.FAILURE = 0;
OpenLayers.Protocol.HTTP = OpenLayers.Class(OpenLayers.Protocol, {
    url: null,
    headers: null,
    params: null,
    callback: null,
    scope: null,
    readWithPOST: false,
    updateWithPOST: false,
    deleteWithPOST: false,
    wildcarded: false,
    srsInBBOX: false,
    initialize: function (options) {
        options = options || {};
        this.params = {};
        this.headers = {};
        OpenLayers.Protocol.prototype.initialize.apply(this, arguments);
        if (!this.filterToParams && OpenLayers.Format.QueryStringFilter) {
            var format = new OpenLayers.Format.QueryStringFilter({
                wildcarded: this.wildcarded,
                srsInBBOX: this.srsInBBOX
            });
            this.filterToParams = function (filter, params) {
                return format.write(filter, params);
            };
        }
    },
    destroy: function () {
        this.params = null;
        this.headers = null;
        OpenLayers.Protocol.prototype.destroy.apply(this);
    },
    read: function (options) {
        OpenLayers.Protocol.prototype.read.apply(this, arguments);
        options = options || {};
        options.params = OpenLayers.Util.applyDefaults(options.params, this.options.params);
        options = OpenLayers.Util.applyDefaults(options, this.options);
        if (options.filter && this.filterToParams) {
            options.params = this.filterToParams(options.filter, options.params);
        }
        var readWithPOST = (options.readWithPOST !== undefined) ? options.readWithPOST : this.readWithPOST;
        var resp = new OpenLayers.Protocol.Response({
            requestType: "read"
        });
        if (readWithPOST) {
            var headers = options.headers || {};
            headers["Content-Type"] = "application/x-www-form-urlencoded";
            resp.priv = OpenLayers.Request.POST({
                url: options.url,
                callback: this.createCallback(this.handleRead, resp, options),
                data: OpenLayers.Util.getParameterString(options.params),
                headers: headers
            });
        } else {
            resp.priv = OpenLayers.Request.GET({
                url: options.url,
                callback: this.createCallback(this.handleRead, resp, options),
                params: options.params,
                headers: options.headers
            });
        }
        return resp;
    },
    handleRead: function (resp, options) {
        this.handleResponse(resp, options);
    },
    create: function (features, options) {
        options = OpenLayers.Util.applyDefaults(options, this.options);
        var resp = new OpenLayers.Protocol.Response({
            reqFeatures: features,
            requestType: "create"
        });
        resp.priv = OpenLayers.Request.POST({
            url: options.url,
            callback: this.createCallback(this.handleCreate, resp, options),
            headers: options.headers,
            data: this.format.write(features)
        });
        return resp;
    },
    handleCreate: function (resp, options) {
        this.handleResponse(resp, options);
    },
    update: function (feature, options) {
        options = options || {};
        var url = options.url || feature.url || this.options.url + "/" + feature.fid;
        options = OpenLayers.Util.applyDefaults(options, this.options);
        var resp = new OpenLayers.Protocol.Response({
            reqFeatures: feature,
            requestType: "update"
        });
        var method = this.updateWithPOST ? "POST" : "PUT";
        resp.priv = OpenLayers.Request[method]({
            url: url,
            callback: this.createCallback(this.handleUpdate, resp, options),
            headers: options.headers,
            data: this.format.write(feature)
        });
        return resp;
    },
    handleUpdate: function (resp, options) {
        this.handleResponse(resp, options);
    },
    "delete": function (feature, options) {
        options = options || {};
        var url = options.url || feature.url || this.options.url + "/" + feature.fid;
        options = OpenLayers.Util.applyDefaults(options, this.options);
        var resp = new OpenLayers.Protocol.Response({
            reqFeatures: feature,
            requestType: "delete"
        });
        var method = this.deleteWithPOST ? "POST" : "DELETE";
        var requestOptions = {
            url: url,
            callback: this.createCallback(this.handleDelete, resp, options),
            headers: options.headers
        };
        if (this.deleteWithPOST) {
            requestOptions.data = this.format.write(feature);
        }
        resp.priv = OpenLayers.Request[method](requestOptions);
        return resp;
    },
    handleDelete: function (resp, options) {
        this.handleResponse(resp, options);
    },
    handleResponse: function (resp, options) {
        var request = resp.priv;
        if (options.callback) {
            if (request.status >= 200 && request.status < 300) {
                if (resp.requestType != "delete") {
                    resp.features = this.parseFeatures(request);
                }
                resp.code = OpenLayers.Protocol.Response.SUCCESS;
            } else {
                resp.code = OpenLayers.Protocol.Response.FAILURE;
            }
            options.callback.call(options.scope, resp);
        }
    },
    parseFeatures: function (request) {
        var doc = request.responseXML;
        if (!doc || !doc.documentElement) {
            doc = request.responseText;
        }
        if (!doc || doc.length <= 0) {
            return null;
        }
        return this.format.read(doc);
    },
    commit: function (features, options) {
        options = OpenLayers.Util.applyDefaults(options, this.options);
        var resp = [],
            nResponses = 0;
        var types = {};
        types[OpenLayers.State.INSERT] = [];
        types[OpenLayers.State.UPDATE] = [];
        types[OpenLayers.State.DELETE] = [];
        var feature, list, requestFeatures = [];
        for (var i = 0, len = features.length; i < len; ++i) {
            feature = features[i];
            list = types[feature.state];
            if (list) {
                list.push(feature);
                requestFeatures.push(feature);
            }
        }
        var nRequests = (types[OpenLayers.State.INSERT].length > 0 ? 1 : 0) +
            types[OpenLayers.State.UPDATE].length +
            types[OpenLayers.State.DELETE].length;
        var success = true;
        var finalResponse = new OpenLayers.Protocol.Response({
            reqFeatures: requestFeatures
        });

        function insertCallback(response) {
            var len = response.features ? response.features.length : 0;
            var fids = new Array(len);
            for (var i = 0; i < len; ++i) {
                fids[i] = response.features[i].fid;
            }
            finalResponse.insertIds = fids;
            callback.apply(this, [response]);
        }

        function callback(response) {
            this.callUserCallback(response, options);
            success = success && response.success();
            nResponses++;
            if (nResponses >= nRequests) {
                if (options.callback) {
                    finalResponse.code = success ? OpenLayers.Protocol.Response.SUCCESS : OpenLayers.Protocol.Response.FAILURE;
                    options.callback.apply(options.scope, [finalResponse]);
                }
            }
        }
        var queue = types[OpenLayers.State.INSERT];
        if (queue.length > 0) {
            resp.push(this.create(queue, OpenLayers.Util.applyDefaults({
                callback: insertCallback,
                scope: this
            }, options.create)));
        }
        queue = types[OpenLayers.State.UPDATE];
        for (var i = queue.length - 1; i >= 0; --i) {
            resp.push(this.update(queue[i], OpenLayers.Util.applyDefaults({
                callback: callback,
                scope: this
            }, options.update)));
        }
        queue = types[OpenLayers.State.DELETE];
        for (var i = queue.length - 1; i >= 0; --i) {
            resp.push(this["delete"](queue[i], OpenLayers.Util.applyDefaults({
                callback: callback,
                scope: this
            }, options["delete"])));
        }
        return resp;
    },
    abort: function (response) {
        if (response) {
            response.priv.abort();
        }
    },
    callUserCallback: function (resp, options) {
        var opt = options[resp.requestType];
        if (opt && opt.callback) {
            opt.callback.call(opt.scope, resp);
        }
    },
    CLASS_NAME: "OpenLayers.Protocol.HTTP"
});
OpenLayers.Style = OpenLayers.Class({
    id: null,
    name: null,
    title: null,
    description: null,
    layerName: null,
    isDefault: false,
    rules: null,
    context: null,
    defaultStyle: null,
    defaultsPerSymbolizer: false,
    propertyStyles: null,
    initialize: function (style, options) {
        OpenLayers.Util.extend(this, options);
        this.rules = [];
        if (options && options.rules) {
            this.addRules(options.rules);
        }
        this.setDefaultStyle(style || OpenLayers.Feature.Vector.style["default"]);
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },
    destroy: function () {
        for (var i = 0, len = this.rules.length; i < len; i++) {
            this.rules[i].destroy();
            this.rules[i] = null;
        }
        this.rules = null;
        this.defaultStyle = null;
    },
    createSymbolizer: function (feature) {
        var style = this.defaultsPerSymbolizer ? {} : this.createLiterals(OpenLayers.Util.extend({}, this.defaultStyle), feature);
        var rules = this.rules;
        var rule, context;
        var elseRules = [];
        var appliedRules = false;
        for (var i = 0, len = rules.length; i < len; i++) {
            rule = rules[i];
            var applies = rule.evaluate(feature);
            if (applies) {
                if (rule instanceof OpenLayers.Rule && rule.elseFilter) {
                    elseRules.push(rule);
                } else {
                    appliedRules = true;
                    this.applySymbolizer(rule, style, feature);
                }
            }
        }
        if (appliedRules == false && elseRules.length > 0) {
            appliedRules = true;
            for (var i = 0, len = elseRules.length; i < len; i++) {
                this.applySymbolizer(elseRules[i], style, feature);
            }
        }
        if (rules.length > 0 && appliedRules == false) {
            style.display = "none";
        }
        if (style.label != null && typeof style.label !== "string") {
            style.label = String(style.label);
        }
        return style;
    },
    applySymbolizer: function (rule, style, feature) {
        var symbolizerPrefix = feature.geometry ? this.getSymbolizerPrefix(feature.geometry) : OpenLayers.Style.SYMBOLIZER_PREFIXES[0];
        var symbolizer = rule.symbolizer[symbolizerPrefix] || rule.symbolizer;
        if (typeof rule.symbolizer["Text"] === "object")
            OpenLayers.Util.applyDefaults(symbolizer, rule.symbolizer["Text"]);
        if (this.defaultsPerSymbolizer === true) {
            var defaults = this.defaultStyle;
            OpenLayers.Util.applyDefaults(symbolizer, {
                pointRadius: defaults.pointRadius
            });
            if (symbolizer.stroke === true || symbolizer.graphic === true) {
                OpenLayers.Util.applyDefaults(symbolizer, {
                    strokeWidth: defaults.strokeWidth,
                    strokeColor: defaults.strokeColor,
                    strokeOpacity: defaults.strokeOpacity,
                    strokeDashstyle: defaults.strokeDashstyle,
                    strokeLinecap: defaults.strokeLinecap
                });
            }
            if (symbolizer.fill === true || symbolizer.graphic === true) {
                OpenLayers.Util.applyDefaults(symbolizer, {
                    fillColor: defaults.fillColor,
                    fillOpacity: defaults.fillOpacity
                });
            }
            if (symbolizer.graphic === true) {
                OpenLayers.Util.applyDefaults(symbolizer, {
                    pointRadius: this.defaultStyle.pointRadius,
                    externalGraphic: this.defaultStyle.externalGraphic,
                    graphicName: this.defaultStyle.graphicName,
                    graphicOpacity: this.defaultStyle.graphicOpacity,
                    graphicWidth: this.defaultStyle.graphicWidth,
                    graphicHeight: this.defaultStyle.graphicHeight,
                    graphicXOffset: this.defaultStyle.graphicXOffset,
                    graphicYOffset: this.defaultStyle.graphicYOffset
                });
            }
        }
        return this.createLiterals(OpenLayers.Util.extend(style, symbolizer), feature);
    },
    createLiterals: function (style, feature) {
        var context = OpenLayers.Util.extend({}, feature.attributes || feature.data);
        OpenLayers.Util.extend(context, this.context);
        for (var i in this.propertyStyles) {
            style[i] = OpenLayers.Style.createLiteral(style[i], context, feature, i);
        }
        return style;
    },
    findPropertyStyles: function () {
        var propertyStyles = {};
        var style = this.defaultStyle;
        this.addPropertyStyles(propertyStyles, style);
        var rules = this.rules;
        var symbolizer, value;
        for (var i = 0, len = rules.length; i < len; i++) {
            symbolizer = rules[i].symbolizer;
            for (var key in symbolizer) {
                value = symbolizer[key];
                if (typeof value == "object") {
                    this.addPropertyStyles(propertyStyles, value);
                } else {
                    this.addPropertyStyles(propertyStyles, symbolizer);
                    break;
                }
            }
        }
        return propertyStyles;
    },
    addPropertyStyles: function (propertyStyles, symbolizer) {
        var property;
        for (var key in symbolizer) {
            property = symbolizer[key];
            if (typeof property == "string" && property.match(/\$\{\w+\}/)) {
                propertyStyles[key] = true;
            }
        }
        return propertyStyles;
    },
    addRules: function (rules) {
        Array.prototype.push.apply(this.rules, rules);
        this.propertyStyles = this.findPropertyStyles();
    },
    setDefaultStyle: function (style) {
        this.defaultStyle = style;
        this.propertyStyles = this.findPropertyStyles();
    },
    getSymbolizerPrefix: function (geometry) {
        var prefixes = OpenLayers.Style.SYMBOLIZER_PREFIXES;
        for (var i = 0, len = prefixes.length; i < len; i++) {
            if (geometry.CLASS_NAME.indexOf(prefixes[i]) != -1) {
                return prefixes[i];
            }
        }
    },
    clone: function () {
        var options = OpenLayers.Util.extend({}, this);
        if (this.rules) {
            options.rules = [];
            for (var i = 0, len = this.rules.length; i < len; ++i) {
                options.rules.push(this.rules[i].clone());
            }
        }
        options.context = this.context && OpenLayers.Util.extend({}, this.context);
        var defaultStyle = OpenLayers.Util.extend({}, this.defaultStyle);
        return new OpenLayers.Style(defaultStyle, options);
    },
    CLASS_NAME: "OpenLayers.Style"
});
OpenLayers.Style.createLiteral = function (value, context, feature, property) {
    if (typeof value == "string" && value.indexOf("${") != -1) {
        value = OpenLayers.String.format(value, context, [feature, property]);
        value = (isNaN(value) || !value) ? value : parseFloat(value);
    }
    if (typeof value == 'string')
        return value.replace(/[\x00-\x1F\x7F]/g, '');
    else
        return value;
};
OpenLayers.Style.SYMBOLIZER_PREFIXES = ['Point', 'Line', 'Polygon', 'Text', 'Raster'];
OpenLayers.StyleMap = OpenLayers.Class({
    styles: null,
    extendDefault: true,
    initialize: function (style, options) {
        this.styles = {
            "default": new OpenLayers.Style(OpenLayers.Feature.Vector.style["default"]),
            "select": new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"]),
            "temporary": new OpenLayers.Style(OpenLayers.Feature.Vector.style["temporary"]),
            "delete": new OpenLayers.Style(OpenLayers.Feature.Vector.style["delete"])
        };
        if (style instanceof OpenLayers.Style) {
            this.styles["default"] = style;
            this.styles["select"] = style;
            this.styles["temporary"] = style;
            this.styles["delete"] = style;
        } else if (typeof style == "object") {
            for (var key in style) {
                if (style[key] instanceof OpenLayers.Style) {
                    this.styles[key] = style[key];
                } else if (typeof style[key] == "object") {
                    this.styles[key] = new OpenLayers.Style(style[key]);
                } else {
                    this.styles["default"] = new OpenLayers.Style(style);
                    this.styles["select"] = new OpenLayers.Style(style);
                    this.styles["temporary"] = new OpenLayers.Style(style);
                    this.styles["delete"] = new OpenLayers.Style(style);
                    break;
                }
            }
        }
        OpenLayers.Util.extend(this, options);
    },
    destroy: function () {
        for (var key in this.styles) {
            this.styles[key].destroy();
        }
        this.styles = null;
    },
    createSymbolizer: function (feature, intent) {
        if (!feature) {
            feature = new OpenLayers.Feature.Vector();
        }
        if (!this.styles[intent]) {
            intent = "default";
        }
        feature.renderIntent = intent;
        var defaultSymbolizer = {};
        if (this.extendDefault && intent != "default") {
            defaultSymbolizer = this.styles["default"].createSymbolizer(feature);
        }
        return OpenLayers.Util.extend(defaultSymbolizer, this.styles[intent].createSymbolizer(feature));
    },
    addUniqueValueRules: function (renderIntent, property, symbolizers, context) {
        var rules = [];
        for (var value in symbolizers) {
            rules.push(new OpenLayers.Rule({
                symbolizer: symbolizers[value],
                context: context,
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: property,
                    value: value
                })
            }));
        }
        this.styles[renderIntent].addRules(rules);
    },
    CLASS_NAME: "OpenLayers.StyleMap"
});
OpenLayers.Rule = OpenLayers.Class({
    id: null,
    name: null,
    title: null,
    description: null,
    context: null,
    filter: null,
    elseFilter: false,
    symbolizer: null,
    symbolizers: null,
    minScaleDenominator: null,
    maxScaleDenominator: null,
    initialize: function (options) {
        this.symbolizer = {};
        OpenLayers.Util.extend(this, options);
        if (this.symbolizers) {
            delete this.symbolizer;
        }
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },
    destroy: function () {
        for (var i in this.symbolizer) {
            this.symbolizer[i] = null;
        }
        this.symbolizer = null;
        delete this.symbolizers;
    },
    evaluate: function (feature) {
        var context = this.getContext(feature);
        var applies = true;
        if (this.minScaleDenominator || this.maxScaleDenominator) {
            var scale = feature.layer.map.getScale();
        }
        if (this.minScaleDenominator) {
            applies = scale >= OpenLayers.Style.createLiteral(this.minScaleDenominator, context);
        }
        if (applies && this.maxScaleDenominator) {
            applies = scale < OpenLayers.Style.createLiteral(this.maxScaleDenominator, context);
        }
        if (applies && this.filter) {
            if (this.filter.CLASS_NAME == "OpenLayers.Filter.FeatureId") {
                applies = this.filter.evaluate(feature);
            } else {
                applies = this.filter.evaluate(context);
            }
        }
        return applies;
    },
    getContext: function (feature) {
        var context = this.context;
        if (!context) {
            context = feature.attributes || feature.data;
        }
        if (typeof this.context == "function") {
            context = this.context(feature);
        }
        return context;
    },
    clone: function () {
        var options = OpenLayers.Util.extend({}, this);
        if (this.symbolizers) {
            var len = this.symbolizers.length;
            options.symbolizers = new Array(len);
            for (var i = 0; i < len; ++i) {
                options.symbolizers[i] = this.symbolizers[i].clone();
            }
        } else {
            options.symbolizer = {};
            var value, type;
            for (var key in this.symbolizer) {
                value = this.symbolizer[key];
                type = typeof value;
                if (type === "object") {
                    options.symbolizer[key] = OpenLayers.Util.extend({}, value);
                } else if (type === "string") {
                    options.symbolizer[key] = value;
                }
            }
        }
        options.filter = this.filter && this.filter.clone();
        options.context = this.context && OpenLayers.Util.extend({}, this.context);
        return new OpenLayers.Rule(options);
    },
    CLASS_NAME: "OpenLayers.Rule"
});
OpenLayers.Format = OpenLayers.Class({
    options: null,
    externalProjection: null,
    internalProjection: null,
    data: null,
    keepData: false,
    initialize: function (options) {
        OpenLayers.Util.extend(this, options);
        this.options = options;
    },
    destroy: function () {},
    read: function (data) {
        throw new Error('Read not implemented.');
    },
    write: function (object) {
        throw new Error('Write not implemented.');
    },
    CLASS_NAME: "OpenLayers.Format"
});
OpenLayers.Format.QueryStringFilter = (function () {
    var cmpToStr = {};
    cmpToStr[OpenLayers.Filter.Comparison.EQUAL_TO] = "eq";
    cmpToStr[OpenLayers.Filter.Comparison.NOT_EQUAL_TO] = "ne";
    cmpToStr[OpenLayers.Filter.Comparison.LESS_THAN] = "lt";
    cmpToStr[OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO] = "lte";
    cmpToStr[OpenLayers.Filter.Comparison.GREATER_THAN] = "gt";
    cmpToStr[OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO] = "gte";
    cmpToStr[OpenLayers.Filter.Comparison.LIKE] = "ilike";

    function regex2value(value) {
        value = value.replace(/%/g, "\\%");
        value = value.replace(/\\\\\.(\*)?/g, function ($0, $1) {
            return $1 ? $0 : "\\\\_";
        });
        value = value.replace(/\\\\\.\*/g, "\\\\%");
        value = value.replace(/(\\)?\.(\*)?/g, function ($0, $1, $2) {
            return $1 || $2 ? $0 : "_";
        });
        value = value.replace(/(\\)?\.\*/g, function ($0, $1) {
            return $1 ? $0 : "%";
        });
        value = value.replace(/\\\./g, ".");
        value = value.replace(/(\\)?\\\*/g, function ($0, $1) {
            return $1 ? $0 : "*";
        });
        return value;
    }
    return OpenLayers.Class(OpenLayers.Format, {
        wildcarded: false,
        srsInBBOX: false,
        write: function (filter, params) {
            params = params || {};
            var className = filter.CLASS_NAME;
            var filterType = className.substring(className.lastIndexOf(".") + 1);
            switch (filterType) {
            case "Spatial":
                switch (filter.type) {
                case OpenLayers.Filter.Spatial.BBOX:
                    params.bbox = filter.value.toArray();
                    if (this.srsInBBOX && filter.projection) {
                        params.bbox.push(filter.projection.getCode());
                    }
                    break;
                case OpenLayers.Filter.Spatial.DWITHIN:
                    params.tolerance = filter.distance;
                case OpenLayers.Filter.Spatial.WITHIN:
                    params.lon = filter.value.x;
                    params.lat = filter.value.y;
                    break;
                default:
                    OpenLayers.Console.warn("Unknown spatial filter type " + filter.type);
                }
                break;
            case "Comparison":
                var op = cmpToStr[filter.type];
                if (op !== undefined) {
                    var value = filter.value;
                    if (filter.type == OpenLayers.Filter.Comparison.LIKE) {
                        value = regex2value(value);
                        if (this.wildcarded) {
                            value = "%" + value + "%";
                        }
                    }
                    params[filter.property + "__" + op] = value;
                    params.queryable = params.queryable || [];
                    params.queryable.push(filter.property);
                } else {
                    OpenLayers.Console.warn("Unknown comparison filter type " + filter.type);
                }
                break;
            case "Logical":
                if (filter.type === OpenLayers.Filter.Logical.AND) {
                    for (var i = 0, len = filter.filters.length; i < len; i++) {
                        params = this.write(filter.filters[i], params);
                    }
                } else {
                    OpenLayers.Console.warn("Unsupported logical filter type " + filter.type);
                }
                break;
            default:
                OpenLayers.Console.warn("Unknown filter type " + filterType);
            }
            return params;
        },
        CLASS_NAME: "OpenLayers.Format.QueryStringFilter"
    });
})();
OpenLayers.Format.XML = OpenLayers.Class(OpenLayers.Format, {
    namespaces: null,
    namespaceAlias: null,
    defaultPrefix: null,
    readers: {},
    writers: {},
    xmldom: null,
    initialize: function (options) {
        if (window.ActiveXObject) {
            this.xmldom = new ActiveXObject("Microsoft.XMLDOM");
        }
        OpenLayers.Format.prototype.initialize.apply(this, [options]);
        this.namespaces = OpenLayers.Util.extend({}, this.namespaces);
        this.namespaceAlias = {};
        for (var alias in this.namespaces) {
            this.namespaceAlias[this.namespaces[alias]] = alias;
        }
    },
    destroy: function () {
        this.xmldom = null;
        OpenLayers.Format.prototype.destroy.apply(this, arguments);
    },
    setNamespace: function (alias, uri) {
        this.namespaces[alias] = uri;
        this.namespaceAlias[uri] = alias;
    },
    read: function (text) {
        var index = text.indexOf('<');
        if (index > 0) {
            text = text.substring(index);
        }
        var node = OpenLayers.Util.Try(OpenLayers.Function.bind((function () {
            var xmldom;
            if (window.ActiveXObject && !this.xmldom) {
                xmldom = new ActiveXObject("Microsoft.XMLDOM");
            } else {
                xmldom = this.xmldom;
            }
            xmldom.loadXML(text);
            return xmldom;
        }), this), function () {
            return new DOMParser().parseFromString(text, 'text/xml');
        }, function () {
            var req = new XMLHttpRequest();
            req.open("GET", "data:" + "text/xml" + ";charset=utf-8," + encodeURIComponent(text), false);
            if (req.overrideMimeType) {
                req.overrideMimeType("text/xml");
            }
            req.send(null);
            return req.responseXML;
        });
        if (this.keepData) {
            this.data = node;
        }
        return node;
    },
    write: function (node) {
        var data;
        if (this.xmldom) {
            data = node.xml;
        } else {
            var serializer = new XMLSerializer();
            if (node.nodeType == 1) {
                var doc = document.implementation.createDocument("", "", null);
                if (doc.importNode) {
                    node = doc.importNode(node, true);
                }
                doc.appendChild(node);
                data = serializer.serializeToString(doc);
            } else {
                data = serializer.serializeToString(node);
            }
        }
        return data;
    },
    createElementNS: function (uri, name) {
        var element;
        if (this.xmldom) {
            if (typeof uri == "string") {
                element = this.xmldom.createNode(1, name, uri);
            } else {
                element = this.xmldom.createNode(1, name, "");
            }
        } else {
            element = document.createElementNS(uri, name);
        }
        return element;
    },
    createTextNode: function (text) {
        var node;
        if (typeof text !== "string") {
            text = String(text);
        }
        if (this.xmldom) {
            node = this.xmldom.createTextNode(text);
        } else {
            node = document.createTextNode(text);
        }
        return node;
    },
    getElementsByTagNameNS: function (node, uri, name) {
        var elements = [];
        if (node.getElementsByTagNameNS) {
            elements = node.getElementsByTagNameNS(uri, name);
        } else {
            var allNodes = node.getElementsByTagName("*");
            var potentialNode, fullName;
            for (var i = 0, len = allNodes.length; i < len; ++i) {
                potentialNode = allNodes[i];
                fullName = (potentialNode.prefix) ? (potentialNode.prefix + ":" + name) : name;
                if ((name == "*") || (fullName == potentialNode.nodeName)) {
                    if ((uri == "*") || (uri == potentialNode.namespaceURI)) {
                        elements.push(potentialNode);
                    }
                }
            }
        }
        return elements;
    },
    getAttributeNodeNS: function (node, uri, name) {
        var attributeNode = null;
        if (node.getAttributeNodeNS) {
            attributeNode = node.getAttributeNodeNS(uri, name);
        } else {
            var attributes = node.attributes;
            var potentialNode, fullName;
            for (var i = 0, len = attributes.length; i < len; ++i) {
                potentialNode = attributes[i];
                if (potentialNode.namespaceURI == uri) {
                    fullName = (potentialNode.prefix) ? (potentialNode.prefix + ":" + name) : name;
                    if (fullName == potentialNode.nodeName) {
                        attributeNode = potentialNode;
                        break;
                    }
                }
            }
        }
        return attributeNode;
    },
    getAttributeNS: function (node, uri, name) {
        var attributeValue = "";
        if (node.getAttributeNS) {
            attributeValue = node.getAttributeNS(uri, name) || "";
        } else {
            var attributeNode = this.getAttributeNodeNS(node, uri, name);
            if (attributeNode) {
                attributeValue = attributeNode.nodeValue;
            }
        }
        return attributeValue;
    },
    getChildValue: function (node, def) {
        var value = def || "";
        if (node) {
            for (var child = node.firstChild; child; child = child.nextSibling) {
                switch (child.nodeType) {
                case 3:
                case 4:
                    value += child.nodeValue;
                }
            }
        }
        return value;
    },
    isSimpleContent: function (node) {
        var simple = true;
        for (var child = node.firstChild; child; child = child.nextSibling) {
            if (child.nodeType === 1) {
                simple = false;
                break;
            }
        }
        return simple;
    },
    contentType: function (node) {
        var simple = false,
            complex = false;
        var type = OpenLayers.Format.XML.CONTENT_TYPE.EMPTY;
        for (var child = node.firstChild; child; child = child.nextSibling) {
            switch (child.nodeType) {
            case 1:
                complex = true;
                break;
            case 8:
                break;
            default:
                simple = true;
            }
            if (complex && simple) {
                break;
            }
        }
        if (complex && simple) {
            type = OpenLayers.Format.XML.CONTENT_TYPE.MIXED;
        } else if (complex) {
            return OpenLayers.Format.XML.CONTENT_TYPE.COMPLEX;
        } else if (simple) {
            return OpenLayers.Format.XML.CONTENT_TYPE.SIMPLE;
        }
        return type;
    },
    hasAttributeNS: function (node, uri, name) {
        var found = false;
        if (node.hasAttributeNS) {
            found = node.hasAttributeNS(uri, name);
        } else {
            found = !! this.getAttributeNodeNS(node, uri, name);
        }
        return found;
    },
    setAttributeNS: function (node, uri, name, value) {
        if (node.setAttributeNS) {
            node.setAttributeNS(uri, name, value);
        } else {
            if (this.xmldom) {
                if (uri) {
                    var attribute = node.ownerDocument.createNode(2, name, uri);
                    attribute.nodeValue = value;
                    node.setAttributeNode(attribute);
                } else {
                    node.setAttribute(name, value);
                }
            } else {
                throw "setAttributeNS not implemented";
            }
        }
    },
    createElementNSPlus: function (name, options) {
        options = options || {};
        var uri = options.uri || this.namespaces[options.prefix];
        if (!uri) {
            var loc = name.indexOf(":");
            uri = this.namespaces[name.substring(0, loc)];
        }
        if (!uri) {
            uri = this.namespaces[this.defaultPrefix];
        }
        var node = this.createElementNS(uri, name);
        if (options.attributes) {
            this.setAttributes(node, options.attributes);
        }
        var value = options.value;
        if (value != null) {
            node.appendChild(this.createTextNode(value));
        }
        return node;
    },
    setAttributes: function (node, obj) {
        var value, uri;
        for (var name in obj) {
            if (obj[name] != null && obj[name].toString) {
                value = obj[name].toString();
                uri = this.namespaces[name.substring(0, name.indexOf(":"))] || null;
                this.setAttributeNS(node, uri, name, value);
            }
        }
    },
    readNode: function (node, obj) {
        if (!obj) {
            obj = {};
        }
        var group = this.readers[node.namespaceURI ? this.namespaceAlias[node.namespaceURI] : this.defaultPrefix];
        if (group) {
            var local = node.localName || node.nodeName.split(":").pop();
            var reader = group[local] || group["*"];
            if (reader) {
                reader.apply(this, [node, obj]);
            }
        }
        return obj;
    },
    readChildNodes: function (node, obj) {
        if (!obj) {
            obj = {};
        }
        var children = node.childNodes;
        var child;
        for (var i = 0, len = children.length; i < len; ++i) {
            child = children[i];
            if (child.nodeType == 1) {
                this.readNode(child, obj);
            }
        }
        return obj;
    },
    writeNode: function (name, obj, parent) {
        var prefix, local;
        var split = name.indexOf(":");
        if (split > 0) {
            prefix = name.substring(0, split);
            local = name.substring(split + 1);
        } else {
            if (parent) {
                prefix = this.namespaceAlias[parent.namespaceURI];
            } else {
                prefix = this.defaultPrefix;
            }
            local = name;
        }
        var child = this.writers[prefix][local].apply(this, [obj]);
        if (parent) {
            parent.appendChild(child);
        }
        return child;
    },
    getChildEl: function (node, name, uri) {
        return node && this.getThisOrNextEl(node.firstChild, name, uri);
    },
    getNextEl: function (node, name, uri) {
        return node && this.getThisOrNextEl(node.nextSibling, name, uri);
    },
    getThisOrNextEl: function (node, name, uri) {
        outer: for (var sibling = node; sibling; sibling = sibling.nextSibling) {
            switch (sibling.nodeType) {
            case 1:
                if ((!name || name === (sibling.localName || sibling.nodeName.split(":").pop())) && (!uri || uri === sibling.namespaceURI)) {
                    break outer;
                }
                sibling = null;
                break outer;
            case 3:
                if (/^\s*$/.test(sibling.nodeValue)) {
                    break;
                }
            case 4:
            case 6:
            case 12:
            case 10:
            case 11:
                sibling = null;
                break outer;
            }
        }
        return sibling || null;
    },
    lookupNamespaceURI: function (node, prefix) {
        var uri = null;
        if (node) {
            if (node.lookupNamespaceURI) {
                uri = node.lookupNamespaceURI(prefix);
            } else {
                outer: switch (node.nodeType) {
                case 1:
                    if (node.namespaceURI !== null && node.prefix === prefix) {
                        uri = node.namespaceURI;
                        break outer;
                    }
                    var len = node.attributes.length;
                    if (len) {
                        var attr;
                        for (var i = 0; i < len; ++i) {
                            attr = node.attributes[i];
                            if (attr.prefix === "xmlns" && attr.name === "xmlns:" + prefix) {
                                uri = attr.value || null;
                                break outer;
                            } else if (attr.name === "xmlns" && prefix === null) {
                                uri = attr.value || null;
                                break outer;
                            }
                        }
                    }
                    uri = this.lookupNamespaceURI(node.parentNode, prefix);
                    break outer;
                case 2:
                    uri = this.lookupNamespaceURI(node.ownerElement, prefix);
                    break outer;
                case 9:
                    uri = this.lookupNamespaceURI(node.documentElement, prefix);
                    break outer;
                case 6:
                case 12:
                case 10:
                case 11:
                    break outer;
                default:
                    uri = this.lookupNamespaceURI(node.parentNode, prefix);
                    break outer;
                }
            }
        }
        return uri;
    },
    getXMLDoc: function () {
        if (!OpenLayers.Format.XML.document && !this.xmldom) {
            if (document.implementation && document.implementation.createDocument) {
                OpenLayers.Format.XML.document = document.implementation.createDocument("", "", null);
            } else if (!this.xmldom && window.ActiveXObject) {
                this.xmldom = new ActiveXObject("Microsoft.XMLDOM");
            }
        }
        return OpenLayers.Format.XML.document || this.xmldom;
    },
    CLASS_NAME: "OpenLayers.Format.XML"
});
OpenLayers.Format.XML.CONTENT_TYPE = {
    EMPTY: 0,
    SIMPLE: 1,
    COMPLEX: 2,
    MIXED: 3
};
OpenLayers.Format.XML.lookupNamespaceURI = OpenLayers.Function.bind(OpenLayers.Format.XML.prototype.lookupNamespaceURI, OpenLayers.Format.XML.prototype);
OpenLayers.Format.XML.document = null;
OpenLayers.Format.XML.VersionedOGC = OpenLayers.Class(OpenLayers.Format.XML, {
    defaultVersion: null,
    version: null,
    profile: null,
    errorProperty: null,
    name: null,
    stringifyOutput: false,
    parser: null,
    initialize: function (options) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
        var className = this.CLASS_NAME;
        this.name = className.substring(className.lastIndexOf(".") + 1);
    },
    getVersion: function (root, options) {
        var version;
        if (root) {
            version = this.version;
            if (!version) {
                version = root.getAttribute("version");
                if (!version) {
                    version = this.defaultVersion;
                }
            }
        } else {
            version = (options && options.version) || this.version || this.defaultVersion;
        }
        return version;
    },
    getParser: function (version) {
        version = version || this.defaultVersion;
        var profile = this.profile ? "_" + this.profile : "";
        if (!this.parser || this.parser.VERSION != version) {
            var format = OpenLayers.Format[this.name]["v" + version.replace(/\./g, "_") + profile];
            if (!format) {
                throw "Can't find a " + this.name + " parser for version " +
                    version + profile;
            }
            this.parser = new format(this.options);
        }
        return this.parser;
    },
    write: function (obj, options) {
        var version = this.getVersion(null, options);
        this.parser = this.getParser(version);
        var root = this.parser.write(obj, options);
        if (this.stringifyOutput === false) {
            return root;
        } else {
            return OpenLayers.Format.XML.prototype.write.apply(this, [root]);
        }
    },
    read: function (data, options) {
        if (typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        var root = data.documentElement;
        var version = this.getVersion(root);
        this.parser = this.getParser(version);
        var obj = this.parser.read(data, options);
        if (this.errorProperty !== null && obj[this.errorProperty] === undefined) {
            var format = new OpenLayers.Format.OGCExceptionReport();
            obj.error = format.read(data);
        }
        obj.version = version;
        return obj;
    },
    CLASS_NAME: "OpenLayers.Format.XML.VersionedOGC"
});
OpenLayers.Format.GML = OpenLayers.Class(OpenLayers.Format.XML, {
    featureNS: "http://mapserver.gis.umn.edu/mapserver",
    featurePrefix: "feature",
    featureName: "featureMember",
    layerName: "features",
    geometryName: "geometry",
    collectionName: "FeatureCollection",
    gmlns: "http://www.opengis.net/gml",
    extractAttributes: true,
    xy: true,
    initialize: function (options) {
        this.regExes = {
            trimSpace: (/^\s*|\s*$/g),
            removeSpace: (/\s*/g),
            splitSpace: (/\s+/),
            trimComma: (/\s*,\s*/g)
        };
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
    },
    read: function (data) {
        if (typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        var featureNodes = this.getElementsByTagNameNS(data.documentElement, this.gmlns, this.featureName);
        var features = [];
        for (var i = 0; i < featureNodes.length; i++) {
            var feature = this.parseFeature(featureNodes[i]);
            if (feature) {
                features.push(feature);
            }
        }
        return features;
    },
    parseFeature: function (node) {
        var order = ["MultiPolygon", "Polygon", "MultiLineString", "LineString", "MultiPoint", "Point", "Envelope"];
        var type, nodeList, geometry, parser;
        for (var i = 0; i < order.length; ++i) {
            type = order[i];
            nodeList = this.getElementsByTagNameNS(node, this.gmlns, type);
            if (nodeList.length > 0) {
                parser = this.parseGeometry[type.toLowerCase()];
                if (parser) {
                    geometry = parser.apply(this, [nodeList[0]]);
                    if (this.internalProjection && this.externalProjection) {
                        geometry.transform(this.externalProjection, this.internalProjection);
                    }
                } else {
                    throw new TypeError("Unsupported geometry type: " + type);
                }
                break;
            }
        }
        var bounds;
        var boxNodes = this.getElementsByTagNameNS(node, this.gmlns, "Box");
        for (i = 0; i < boxNodes.length; ++i) {
            var boxNode = boxNodes[i];
            var box = this.parseGeometry["box"].apply(this, [boxNode]);
            var parentNode = boxNode.parentNode;
            var parentName = parentNode.localName || parentNode.nodeName.split(":").pop();
            if (parentName === "boundedBy") {
                bounds = box;
            } else {
                geometry = box.toGeometry();
            }
        }
        var attributes;
        if (this.extractAttributes) {
            attributes = this.parseAttributes(node);
        }
        var feature = new OpenLayers.Feature.Vector(geometry, attributes);
        feature.bounds = bounds;
        feature.gml = {
            featureType: node.firstChild.nodeName.split(":")[1],
            featureNS: node.firstChild.namespaceURI,
            featureNSPrefix: node.firstChild.prefix
        };
        var childNode = node.firstChild;
        var fid;
        while (childNode) {
            if (childNode.nodeType == 1) {
                fid = childNode.getAttribute("fid") || childNode.getAttribute("id");
                if (fid) {
                    break;
                }
            }
            childNode = childNode.nextSibling;
        }
        feature.fid = fid;
        return feature;
    },
    parseGeometry: {
        point: function (node) {
            var nodeList, coordString;
            var coords = [];
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns, "pos");
            if (nodeList.length > 0) {
                coordString = nodeList[0].firstChild.nodeValue;
                coordString = coordString.replace(this.regExes.trimSpace, "");
                coords = coordString.split(this.regExes.splitSpace);
            }
            if (coords.length == 0) {
                nodeList = this.getElementsByTagNameNS(node, this.gmlns, "coordinates");
                if (nodeList.length > 0) {
                    coordString = nodeList[0].firstChild.nodeValue;
                    coordString = coordString.replace(this.regExes.removeSpace, "");
                    coords = coordString.split(",");
                }
            }
            if (coords.length == 0) {
                nodeList = this.getElementsByTagNameNS(node, this.gmlns, "coord");
                if (nodeList.length > 0) {
                    var xList = this.getElementsByTagNameNS(nodeList[0], this.gmlns, "X");
                    var yList = this.getElementsByTagNameNS(nodeList[0], this.gmlns, "Y");
                    if (xList.length > 0 && yList.length > 0) {
                        coords = [xList[0].firstChild.nodeValue, yList[0].firstChild.nodeValue];
                    }
                }
            }
            if (coords.length == 2) {
                coords[2] = null;
            }
            if (this.xy) {
                return new OpenLayers.Geometry.Point(coords[0], coords[1], coords[2]);
            } else {
                return new OpenLayers.Geometry.Point(coords[1], coords[0], coords[2]);
            }
        },
        multipoint: function (node) {
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns, "Point");
            var components = [];
            if (nodeList.length > 0) {
                var point;
                for (var i = 0; i < nodeList.length; ++i) {
                    point = this.parseGeometry.point.apply(this, [nodeList[i]]);
                    if (point) {
                        components.push(point);
                    }
                }
            }
            return new OpenLayers.Geometry.MultiPoint(components);
        },
        linestring: function (node, ring) {
            var nodeList, coordString;
            var coords = [];
            var points = [];
            nodeList = this.getElementsByTagNameNS(node, this.gmlns, "posList");
            if (nodeList.length > 0) {
                coordString = this.getChildValue(nodeList[0]);
                coordString = coordString.replace(this.regExes.trimSpace, "");
                coords = coordString.split(this.regExes.splitSpace);
                var dim = parseInt(nodeList[0].getAttribute("dimension"));
                var j, x, y, z;
                for (var i = 0; i < coords.length / dim; ++i) {
                    j = i * dim;
                    x = coords[j];
                    y = coords[j + 1];
                    z = (dim == 2) ? null : coords[j + 2];
                    if (this.xy) {
                        points.push(new OpenLayers.Geometry.Point(x, y, z));
                    } else {
                        points.push(new OpenLayers.Geometry.Point(y, x, z));
                    }
                }
            }
            if (coords.length == 0) {
                nodeList = this.getElementsByTagNameNS(node, this.gmlns, "coordinates");
                if (nodeList.length > 0) {
                    coordString = this.getChildValue(nodeList[0]);
                    coordString = coordString.replace(this.regExes.trimSpace, "");
                    coordString = coordString.replace(this.regExes.trimComma, ",");
                    var pointList = coordString.split(this.regExes.splitSpace);
                    for (var i = 0; i < pointList.length; ++i) {
                        coords = pointList[i].split(",");
                        if (coords.length == 2) {
                            coords[2] = null;
                        }
                        if (this.xy) {
                            points.push(new OpenLayers.Geometry.Point(coords[0], coords[1], coords[2]));
                        } else {
                            points.push(new OpenLayers.Geometry.Point(coords[1], coords[0], coords[2]));
                        }
                    }
                }
            }
            var line = null;
            if (points.length != 0) {
                if (ring) {
                    line = new OpenLayers.Geometry.LinearRing(points);
                } else {
                    line = new OpenLayers.Geometry.LineString(points);
                }
            }
            return line;
        },
        multilinestring: function (node) {
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns, "LineString");
            var components = [];
            if (nodeList.length > 0) {
                var line;
                for (var i = 0; i < nodeList.length; ++i) {
                    line = this.parseGeometry.linestring.apply(this, [nodeList[i]]);
                    if (line) {
                        components.push(line);
                    }
                }
            }
            return new OpenLayers.Geometry.MultiLineString(components);
        },
        polygon: function (node) {
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns, "LinearRing");
            var components = [];
            if (nodeList.length > 0) {
                var ring;
                for (var i = 0; i < nodeList.length; ++i) {
                    ring = this.parseGeometry.linestring.apply(this, [nodeList[i], true]);
                    if (ring) {
                        components.push(ring);
                    }
                }
            }
            return new OpenLayers.Geometry.Polygon(components);
        },
        multipolygon: function (node) {
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns, "Polygon");
            var components = [];
            if (nodeList.length > 0) {
                var polygon;
                for (var i = 0; i < nodeList.length; ++i) {
                    polygon = this.parseGeometry.polygon.apply(this, [nodeList[i]]);
                    if (polygon) {
                        components.push(polygon);
                    }
                }
            }
            return new OpenLayers.Geometry.MultiPolygon(components);
        },
        envelope: function (node) {
            var components = [];
            var coordString;
            var envelope;
            var lpoint = this.getElementsByTagNameNS(node, this.gmlns, "lowerCorner");
            if (lpoint.length > 0) {
                var coords = [];
                if (lpoint.length > 0) {
                    coordString = lpoint[0].firstChild.nodeValue;
                    coordString = coordString.replace(this.regExes.trimSpace, "");
                    coords = coordString.split(this.regExes.splitSpace);
                }
                if (coords.length == 2) {
                    coords[2] = null;
                }
                if (this.xy) {
                    var lowerPoint = new OpenLayers.Geometry.Point(coords[0], coords[1], coords[2]);
                } else {
                    var lowerPoint = new OpenLayers.Geometry.Point(coords[1], coords[0], coords[2]);
                }
            }
            var upoint = this.getElementsByTagNameNS(node, this.gmlns, "upperCorner");
            if (upoint.length > 0) {
                var coords = [];
                if (upoint.length > 0) {
                    coordString = upoint[0].firstChild.nodeValue;
                    coordString = coordString.replace(this.regExes.trimSpace, "");
                    coords = coordString.split(this.regExes.splitSpace);
                }
                if (coords.length == 2) {
                    coords[2] = null;
                }
                if (this.xy) {
                    var upperPoint = new OpenLayers.Geometry.Point(coords[0], coords[1], coords[2]);
                } else {
                    var upperPoint = new OpenLayers.Geometry.Point(coords[1], coords[0], coords[2]);
                }
            }
            if (lowerPoint && upperPoint) {
                components.push(new OpenLayers.Geometry.Point(lowerPoint.x, lowerPoint.y));
                components.push(new OpenLayers.Geometry.Point(upperPoint.x, lowerPoint.y));
                components.push(new OpenLayers.Geometry.Point(upperPoint.x, upperPoint.y));
                components.push(new OpenLayers.Geometry.Point(lowerPoint.x, upperPoint.y));
                components.push(new OpenLayers.Geometry.Point(lowerPoint.x, lowerPoint.y));
                var ring = new OpenLayers.Geometry.LinearRing(components);
                envelope = new OpenLayers.Geometry.Polygon([ring]);
            }
            return envelope;
        },
        box: function (node) {
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns, "coordinates");
            var coordString;
            var coords, beginPoint = null,
                endPoint = null;
            if (nodeList.length > 0) {
                coordString = nodeList[0].firstChild.nodeValue;
                coords = coordString.split(" ");
                if (coords.length == 2) {
                    beginPoint = coords[0].split(",");
                    endPoint = coords[1].split(",");
                }
            }
            if (beginPoint !== null && endPoint !== null) {
                return new OpenLayers.Bounds(parseFloat(beginPoint[0]), parseFloat(beginPoint[1]), parseFloat(endPoint[0]), parseFloat(endPoint[1]));
            }
        }
    },
    parseAttributes: function (node) {
        var attributes = {};
        var childNode = node.firstChild;
        var children, i, child, grandchildren, grandchild, name, value;
        while (childNode) {
            if (childNode.nodeType == 1) {
                children = childNode.childNodes;
                for (i = 0; i < children.length; ++i) {
                    child = children[i];
                    if (child.nodeType == 1) {
                        grandchildren = child.childNodes;
                        if (grandchildren.length == 1) {
                            grandchild = grandchildren[0];
                            if (grandchild.nodeType == 3 || grandchild.nodeType == 4) {
                                name = (child.prefix) ? child.nodeName.split(":")[1] : child.nodeName;
                                value = grandchild.nodeValue.replace(this.regExes.trimSpace, "");
                                attributes[name] = value;
                            }
                        } else {
                            attributes[child.nodeName.split(":").pop()] = null;
                        }
                    }
                }
                break;
            }
            childNode = childNode.nextSibling;
        }
        return attributes;
    },
    write: function (features) {
        if (!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }
        var gml = this.createElementNS("http://www.opengis.net/wfs", "wfs:" + this.collectionName);
        for (var i = 0; i < features.length; i++) {
            gml.appendChild(this.createFeatureXML(features[i]));
        }
        return OpenLayers.Format.XML.prototype.write.apply(this, [gml]);
    },
    createFeatureXML: function (feature) {
        var geometry = feature.geometry;
        var geometryNode = this.buildGeometryNode(geometry);
        var geomContainer = this.createElementNS(this.featureNS, this.featurePrefix + ":" +
            this.geometryName);
        geomContainer.appendChild(geometryNode);
        var featureNode = this.createElementNS(this.gmlns, "gml:" + this.featureName);
        var featureContainer = this.createElementNS(this.featureNS, this.featurePrefix + ":" +
            this.layerName);
        var fid = feature.fid || feature.id;
        featureContainer.setAttribute("fid", fid);
        featureContainer.appendChild(geomContainer);
        for (var attr in feature.attributes) {
            var attrText = this.createTextNode(feature.attributes[attr]);
            var nodename = attr.substring(attr.lastIndexOf(":") + 1);
            var attrContainer = this.createElementNS(this.featureNS, this.featurePrefix + ":" +
                nodename);
            attrContainer.appendChild(attrText);
            featureContainer.appendChild(attrContainer);
        }
        featureNode.appendChild(featureContainer);
        return featureNode;
    },
    buildGeometryNode: function (geometry) {
        if (this.externalProjection && this.internalProjection) {
            geometry = geometry.clone();
            geometry.transform(this.internalProjection, this.externalProjection);
        }
        var className = geometry.CLASS_NAME;
        var type = className.substring(className.lastIndexOf(".") + 1);
        var builder = this.buildGeometry[type.toLowerCase()];
        return builder.apply(this, [geometry]);
    },
    buildGeometry: {
        point: function (geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:Point");
            gml.appendChild(this.buildCoordinatesNode(geometry));
            return gml;
        },
        multipoint: function (geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:MultiPoint");
            var points = geometry.components;
            var pointMember, pointGeom;
            for (var i = 0; i < points.length; i++) {
                pointMember = this.createElementNS(this.gmlns, "gml:pointMember");
                pointGeom = this.buildGeometry.point.apply(this, [points[i]]);
                pointMember.appendChild(pointGeom);
                gml.appendChild(pointMember);
            }
            return gml;
        },
        linestring: function (geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:LineString");
            gml.appendChild(this.buildCoordinatesNode(geometry));
            return gml;
        },
        multilinestring: function (geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:MultiLineString");
            var lines = geometry.components;
            var lineMember, lineGeom;
            for (var i = 0; i < lines.length; ++i) {
                lineMember = this.createElementNS(this.gmlns, "gml:lineStringMember");
                lineGeom = this.buildGeometry.linestring.apply(this, [lines[i]]);
                lineMember.appendChild(lineGeom);
                gml.appendChild(lineMember);
            }
            return gml;
        },
        linearring: function (geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:LinearRing");
            gml.appendChild(this.buildCoordinatesNode(geometry));
            return gml;
        },
        polygon: function (geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:Polygon");
            var rings = geometry.components;
            var ringMember, ringGeom, type;
            for (var i = 0; i < rings.length; ++i) {
                type = (i == 0) ? "outerBoundaryIs" : "innerBoundaryIs";
                ringMember = this.createElementNS(this.gmlns, "gml:" + type);
                ringGeom = this.buildGeometry.linearring.apply(this, [rings[i]]);
                ringMember.appendChild(ringGeom);
                gml.appendChild(ringMember);
            }
            return gml;
        },
        multipolygon: function (geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:MultiPolygon");
            var polys = geometry.components;
            var polyMember, polyGeom;
            for (var i = 0; i < polys.length; ++i) {
                polyMember = this.createElementNS(this.gmlns, "gml:polygonMember");
                polyGeom = this.buildGeometry.polygon.apply(this, [polys[i]]);
                polyMember.appendChild(polyGeom);
                gml.appendChild(polyMember);
            }
            return gml;
        },
        bounds: function (bounds) {
            var gml = this.createElementNS(this.gmlns, "gml:Box");
            gml.appendChild(this.buildCoordinatesNode(bounds));
            return gml;
        }
    },
    buildCoordinatesNode: function (geometry) {
        var coordinatesNode = this.createElementNS(this.gmlns, "gml:coordinates");
        coordinatesNode.setAttribute("decimal", ".");
        coordinatesNode.setAttribute("cs", ",");
        coordinatesNode.setAttribute("ts", " ");
        var parts = [];
        if (geometry instanceof OpenLayers.Bounds) {
            parts.push(geometry.left + "," + geometry.bottom);
            parts.push(geometry.right + "," + geometry.top);
        } else {
            var points = (geometry.components) ? geometry.components : [geometry];
            for (var i = 0; i < points.length; i++) {
                parts.push(points[i].x + "," + points[i].y);
            }
        }
        var txtNode = this.createTextNode(parts.join(" "));
        coordinatesNode.appendChild(txtNode);
        return coordinatesNode;
    },
    CLASS_NAME: "OpenLayers.Format.GML"
});
if (!OpenLayers.Format.GML) {
    OpenLayers.Format.GML = {};
}
OpenLayers.Format.GML.Base = OpenLayers.Class(OpenLayers.Format.XML, {
    namespaces: {
        gml: "http://www.opengis.net/gml",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        wfs: "http://www.opengis.net/wfs"
    },
    defaultPrefix: "gml",
    schemaLocation: null,
    featureType: null,
    featureNS: null,
    geometryName: "geometry",
    extractAttributes: true,
    srsName: null,
    xy: true,
    geometryTypes: null,
    singleFeatureType: null,
    regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g),
        featureMember: (/^(.*:)?featureMembers?$/)
    },
    initialize: function (options) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
        this.setGeometryTypes();
        if (options && options.featureNS) {
            this.setNamespace("feature", options.featureNS);
        }
        this.singleFeatureType = !options || (typeof options.featureType === "string");
    },
    read: function (data) {
        if (typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if (data && data.nodeType == 9) {
            data = data.documentElement;
        }
        var features = [];
        this.readNode(data, {
            features: features
        }, true);
        if (features.length == 0) {
            var elements = this.getElementsByTagNameNS(data, this.namespaces.gml, "featureMember");
            if (elements.length) {
                for (var i = 0, len = elements.length; i < len; ++i) {
                    this.readNode(elements[i], {
                        features: features
                    }, true);
                }
            } else {
                var elements = this.getElementsByTagNameNS(data, this.namespaces.gml, "featureMembers");
                if (elements.length) {
                    this.readNode(elements[0], {
                        features: features
                    }, true);
                }
            }
        }
        return features;
    },
    readNode: function (node, obj, first) {
        if (first === true && this.autoConfig === true) {
            this.featureType = null;
            delete this.namespaceAlias[this.featureNS];
            delete this.namespaces["feature"];
            this.featureNS = null;
        }
        if (!this.featureNS && (!(node.prefix in this.namespaces) && node.parentNode.namespaceURI == this.namespaces["gml"] && this.regExes.featureMember.test(node.parentNode.nodeName))) {
            this.featureType = node.nodeName.split(":").pop();
            this.setNamespace("feature", node.namespaceURI);
            this.featureNS = node.namespaceURI;
            this.autoConfig = true;
        }
        return OpenLayers.Format.XML.prototype.readNode.apply(this, [node, obj]);
    },
    readers: {
        "gml": {
            "featureMember": function (node, obj) {
                this.readChildNodes(node, obj);
            },
            "featureMembers": function (node, obj) {
                this.readChildNodes(node, obj);
            },
            "name": function (node, obj) {
                obj.name = this.getChildValue(node);
            },
            "boundedBy": function (node, obj) {
                var container = {};
                this.readChildNodes(node, container);
                if (container.components && container.components.length > 0) {
                    obj.bounds = container.components[0];
                }
            },
            "Point": function (node, container) {
                var obj = {
                    points: []
                };
                this.readChildNodes(node, obj);
                if (!container.components) {
                    container.components = [];
                }
                container.components.push(obj.points[0]);
            },
            "coordinates": function (node, obj) {
                var str = this.getChildValue(node).replace(this.regExes.trimSpace, "");
                str = str.replace(this.regExes.trimComma, ",");
                var pointList = str.split(this.regExes.splitSpace);
                var coords;
                var numPoints = pointList.length;
                var points = new Array(numPoints);
                for (var i = 0; i < numPoints; ++i) {
                    coords = pointList[i].split(",");
                    if (this.xy) {
                        points[i] = new OpenLayers.Geometry.Point(coords[0], coords[1], coords[2]);
                    } else {
                        points[i] = new OpenLayers.Geometry.Point(coords[1], coords[0], coords[2]);
                    }
                }
                obj.points = points;
            },
            "coord": function (node, obj) {
                var coord = {};
                this.readChildNodes(node, coord);
                if (!obj.points) {
                    obj.points = [];
                }
                obj.points.push(new OpenLayers.Geometry.Point(coord.x, coord.y, coord.z));
            },
            "X": function (node, coord) {
                coord.x = this.getChildValue(node);
            },
            "Y": function (node, coord) {
                coord.y = this.getChildValue(node);
            },
            "Z": function (node, coord) {
                coord.z = this.getChildValue(node);
            },
            "MultiPoint": function (node, container) {
                var obj = {
                    components: []
                };
                this.readChildNodes(node, obj);
                container.components = [new OpenLayers.Geometry.MultiPoint(obj.components)];
            },
            "pointMember": function (node, obj) {
                this.readChildNodes(node, obj);
            },
            "LineString": function (node, container) {
                var obj = {};
                this.readChildNodes(node, obj);
                if (!container.components) {
                    container.components = [];
                }
                container.components.push(new OpenLayers.Geometry.LineString(obj.points));
            },
            "MultiLineString": function (node, container) {
                var obj = {
                    components: []
                };
                this.readChildNodes(node, obj);
                container.components = [new OpenLayers.Geometry.MultiLineString(obj.components)];
            },
            "lineStringMember": function (node, obj) {
                this.readChildNodes(node, obj);
            },
            "Polygon": function (node, container) {
                var obj = {
                    outer: null,
                    inner: []
                };
                this.readChildNodes(node, obj);
                obj.inner.unshift(obj.outer);
                if (!container.components) {
                    container.components = [];
                }
                container.components.push(new OpenLayers.Geometry.Polygon(obj.inner));
            },
            "LinearRing": function (node, obj) {
                var container = {};
                this.readChildNodes(node, container);
                obj.components = [new OpenLayers.Geometry.LinearRing(container.points)];
            },
            "MultiPolygon": function (node, container) {
                var obj = {
                    components: []
                };
                this.readChildNodes(node, obj);
                container.components = [new OpenLayers.Geometry.MultiPolygon(obj.components)];
            },
            "polygonMember": function (node, obj) {
                this.readChildNodes(node, obj);
            },
            "GeometryCollection": function (node, container) {
                var obj = {
                    components: []
                };
                this.readChildNodes(node, obj);
                container.components = [new OpenLayers.Geometry.Collection(obj.components)];
            },
            "geometryMember": function (node, obj) {
                this.readChildNodes(node, obj);
            }
        },
        "feature": {
            "*": function (node, obj) {
                var name;
                var local = node.localName || node.nodeName.split(":").pop();
                if (obj.features) {
                    if (!this.singleFeatureType && (OpenLayers.Util.indexOf(this.featureType, local) !== -1)) {
                        name = "_typeName";
                    } else if (local === this.featureType) {
                        name = "_typeName";
                    }
                } else {
                    if (node.childNodes.length == 0 || (node.childNodes.length == 1 && node.firstChild.nodeType == 3)) {
                        if (this.extractAttributes) {
                            name = "_attribute";
                        }
                    } else {
                        name = "_geometry";
                    }
                }
                if (name) {
                    this.readers.feature[name].apply(this, [node, obj]);
                }
            },
            "_typeName": function (node, obj) {
                var container = {
                    components: [],
                    attributes: {}
                };
                this.readChildNodes(node, container);
                if (container.name) {
                    container.attributes.name = container.name;
                }
                var feature = new OpenLayers.Feature.Vector(container.components[0], container.attributes);
                if (!this.singleFeatureType) {
                    feature.type = node.nodeName.split(":").pop();
                    feature.namespace = node.namespaceURI;
                }
                var fid = node.getAttribute("fid") || this.getAttributeNS(node, this.namespaces["gml"], "id");
                if (fid) {
                    feature.fid = fid;
                }
                if (this.internalProjection && this.externalProjection && feature.geometry) {
                    feature.geometry.transform(this.externalProjection, this.internalProjection);
                }
                if (container.bounds) {
                    feature.bounds = container.bounds;
                }
                obj.features.push(feature);
            },
            "_geometry": function (node, obj) {
                if (!this.geometryName) {
                    this.geometryName = node.nodeName.split(":").pop();
                }
                this.readChildNodes(node, obj);
            },
            "_attribute": function (node, obj) {
                var local = node.localName || node.nodeName.split(":").pop();
                var value = this.getChildValue(node);
                obj.attributes[local] = value;
            }
        },
        "wfs": {
            "FeatureCollection": function (node, obj) {
                this.readChildNodes(node, obj);
            }
        }
    },
    write: function (features) {
        var name;
        if (OpenLayers.Util.isArray(features)) {
            name = "featureMembers";
        } else {
            name = "featureMember";
        }
        var root = this.writeNode("gml:" + name, features);
        this.setAttributeNS(root, this.namespaces["xsi"], "xsi:schemaLocation", this.schemaLocation);
        return OpenLayers.Format.XML.prototype.write.apply(this, [root]);
    },
    writers: {
        "gml": {
            "featureMember": function (feature) {
                var node = this.createElementNSPlus("gml:featureMember");
                this.writeNode("feature:_typeName", feature, node);
                return node;
            },
            "MultiPoint": function (geometry) {
                var node = this.createElementNSPlus("gml:MultiPoint");
                var components = geometry.components || [geometry];
                for (var i = 0, ii = components.length; i < ii; ++i) {
                    this.writeNode("pointMember", components[i], node);
                }
                return node;
            },
            "pointMember": function (geometry) {
                var node = this.createElementNSPlus("gml:pointMember");
                this.writeNode("Point", geometry, node);
                return node;
            },
            "MultiLineString": function (geometry) {
                var node = this.createElementNSPlus("gml:MultiLineString");
                var components = geometry.components || [geometry];
                for (var i = 0, ii = components.length; i < ii; ++i) {
                    this.writeNode("lineStringMember", components[i], node);
                }
                return node;
            },
            "lineStringMember": function (geometry) {
                var node = this.createElementNSPlus("gml:lineStringMember");
                this.writeNode("LineString", geometry, node);
                return node;
            },
            "MultiPolygon": function (geometry) {
                var node = this.createElementNSPlus("gml:MultiPolygon");
                var components = geometry.components || [geometry];
                for (var i = 0, ii = components.length; i < ii; ++i) {
                    this.writeNode("polygonMember", components[i], node);
                }
                return node;
            },
            "polygonMember": function (geometry) {
                var node = this.createElementNSPlus("gml:polygonMember");
                this.writeNode("Polygon", geometry, node);
                return node;
            },
            "GeometryCollection": function (geometry) {
                var node = this.createElementNSPlus("gml:GeometryCollection");
                for (var i = 0, len = geometry.components.length; i < len; ++i) {
                    this.writeNode("geometryMember", geometry.components[i], node);
                }
                return node;
            },
            "geometryMember": function (geometry) {
                var node = this.createElementNSPlus("gml:geometryMember");
                var child = this.writeNode("feature:_geometry", geometry);
                node.appendChild(child.firstChild);
                return node;
            }
        },
        "feature": {
            "_typeName": function (feature) {
                var node = this.createElementNSPlus("feature:" + this.featureType, {
                    attributes: {
                        fid: feature.fid
                    }
                });
                if (feature.geometry) {
                    this.writeNode("feature:_geometry", feature.geometry, node);
                }
                for (var name in feature.attributes) {
                    var value = feature.attributes[name];
                    if (value != null) {
                        this.writeNode("feature:_attribute", {
                            name: name,
                            value: value
                        }, node);
                    }
                }
                return node;
            },
            "_geometry": function (geometry) {
                if (this.externalProjection && this.internalProjection) {
                    geometry = geometry.clone().transform(this.internalProjection, this.externalProjection);
                }
                var node = this.createElementNSPlus("feature:" + this.geometryName);
                var type = this.geometryTypes[geometry.CLASS_NAME];
                var child = this.writeNode("gml:" + type, geometry, node);
                if (this.srsName) {
                    child.setAttribute("srsName", this.srsName);
                }
                return node;
            },
            "_attribute": function (obj) {
                return this.createElementNSPlus("feature:" + obj.name, {
                    value: obj.value
                });
            }
        },
        "wfs": {
            "FeatureCollection": function (features) {
                var node = this.createElementNSPlus("wfs:FeatureCollection");
                for (var i = 0, len = features.length; i < len; ++i) {
                    this.writeNode("gml:featureMember", features[i], node);
                }
                return node;
            }
        }
    },
    setGeometryTypes: function () {
        this.geometryTypes = {
            "OpenLayers.Geometry.Point": "Point",
            "OpenLayers.Geometry.MultiPoint": "MultiPoint",
            "OpenLayers.Geometry.LineString": "LineString",
            "OpenLayers.Geometry.MultiLineString": "MultiLineString",
            "OpenLayers.Geometry.Polygon": "Polygon",
            "OpenLayers.Geometry.MultiPolygon": "MultiPolygon",
            "OpenLayers.Geometry.Collection": "GeometryCollection"
        };
    },
    CLASS_NAME: "OpenLayers.Format.GML.Base"
});
OpenLayers.Format.GML.v2 = OpenLayers.Class(OpenLayers.Format.GML.Base, {
    schemaLocation: "http://www.opengis.net/gml http://schemas.opengis.net/gml/2.1.2/feature.xsd",
    initialize: function (options) {
        OpenLayers.Format.GML.Base.prototype.initialize.apply(this, [options]);
    },
    readers: {
        "gml": OpenLayers.Util.applyDefaults({
            "outerBoundaryIs": function (node, container) {
                var obj = {};
                this.readChildNodes(node, obj);
                container.outer = obj.components[0];
            },
            "innerBoundaryIs": function (node, container) {
                var obj = {};
                this.readChildNodes(node, obj);
                container.inner.push(obj.components[0]);
            },
            "Box": function (node, container) {
                var obj = {};
                this.readChildNodes(node, obj);
                if (!container.components) {
                    container.components = [];
                }
                var min = obj.points[0];
                var max = obj.points[1];
                container.components.push(new OpenLayers.Bounds(min.x, min.y, max.x, max.y));
            }
        }, OpenLayers.Format.GML.Base.prototype.readers["gml"]),
        "feature": OpenLayers.Format.GML.Base.prototype.readers["feature"],
        "wfs": OpenLayers.Format.GML.Base.prototype.readers["wfs"]
    },
    write: function (features) {
        var name;
        if (OpenLayers.Util.isArray(features)) {
            name = "wfs:FeatureCollection";
        } else {
            name = "gml:featureMember";
        }
        var root = this.writeNode(name, features);
        this.setAttributeNS(root, this.namespaces["xsi"], "xsi:schemaLocation", this.schemaLocation);
        return OpenLayers.Format.XML.prototype.write.apply(this, [root]);
    },
    writers: {
        "gml": OpenLayers.Util.applyDefaults({
            "Point": function (geometry) {
                var node = this.createElementNSPlus("gml:Point");
                this.writeNode("coordinates", [geometry], node);
                return node;
            },
            "coordinates": function (points) {
                var numPoints = points.length;
                var parts = new Array(numPoints);
                var point;
                for (var i = 0; i < numPoints; ++i) {
                    point = points[i];
                    if (this.xy) {
                        parts[i] = point.x + "," + point.y;
                    } else {
                        parts[i] = point.y + "," + point.x;
                    }
                    if (point.z != undefined) {
                        parts[i] += "," + point.z;
                    }
                }
                return this.createElementNSPlus("gml:coordinates", {
                    attributes: {
                        decimal: ".",
                        cs: ",",
                        ts: " "
                    },
                    value: (numPoints == 1) ? parts[0] : parts.join(" ")
                });
            },
            "LineString": function (geometry) {
                var node = this.createElementNSPlus("gml:LineString");
                this.writeNode("coordinates", geometry.components, node);
                return node;
            },
            "Polygon": function (geometry) {
                var node = this.createElementNSPlus("gml:Polygon");
                this.writeNode("outerBoundaryIs", geometry.components[0], node);
                for (var i = 1; i < geometry.components.length; ++i) {
                    this.writeNode("innerBoundaryIs", geometry.components[i], node);
                }
                return node;
            },
            "outerBoundaryIs": function (ring) {
                var node = this.createElementNSPlus("gml:outerBoundaryIs");
                this.writeNode("LinearRing", ring, node);
                return node;
            },
            "innerBoundaryIs": function (ring) {
                var node = this.createElementNSPlus("gml:innerBoundaryIs");
                this.writeNode("LinearRing", ring, node);
                return node;
            },
            "LinearRing": function (ring) {
                var node = this.createElementNSPlus("gml:LinearRing");
                this.writeNode("coordinates", ring.components, node);
                return node;
            },
            "Box": function (bounds) {
                var node = this.createElementNSPlus("gml:Box");
                this.writeNode("coordinates", [{
                        x: bounds.left,
                        y: bounds.bottom
                    }, {
                        x: bounds.right,
                        y: bounds.top
                    }
                ], node);
                if (this.srsName) {
                    node.setAttribute("srsName", this.srsName);
                }
                return node;
            }
        }, OpenLayers.Format.GML.Base.prototype.writers["gml"]),
        "feature": OpenLayers.Format.GML.Base.prototype.writers["feature"],
        "wfs": OpenLayers.Format.GML.Base.prototype.writers["wfs"]
    },
    CLASS_NAME: "OpenLayers.Format.GML.v2"
});
OpenLayers.Format.GPX = OpenLayers.Class(OpenLayers.Format.XML, {
    defaultDesc: "No description available",
    extractWaypoints: true,
    extractTracks: true,
    extractRoutes: true,
    extractAttributes: true,
    namespaces: {
        gpx: "http://www.topografix.com/GPX/1/1",
        xsi: "http://www.w3.org/2001/XMLSchema-instance"
    },
    schemaLocation: "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd",
    creator: "OpenLayers",
    initialize: function (options) {
        this.externalProjection = new OpenLayers.Projection("EPSG:4326");
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
    },
    read: function (doc) {
        if (typeof doc == "string") {
            doc = OpenLayers.Format.XML.prototype.read.apply(this, [doc]);
        }
        var features = [];
        if (this.extractTracks) {
            var tracks = doc.getElementsByTagName("trk");
            for (var i = 0, len = tracks.length; i < len; i++) {
                var attrs = {};
                if (this.extractAttributes) {
                    attrs = this.parseAttributes(tracks[i]);
                }
                var segs = this.getElementsByTagNameNS(tracks[i], tracks[i].namespaceURI, "trkseg");
                for (var j = 0, seglen = segs.length; j < seglen; j++) {
                    var track = this.extractSegment(segs[j], "trkpt");
                    features.push(new OpenLayers.Feature.Vector(track, attrs));
                }
            }
        }
        if (this.extractRoutes) {
            var routes = doc.getElementsByTagName("rte");
            for (var k = 0, klen = routes.length; k < klen; k++) {
                var attrs = {};
                if (this.extractAttributes) {
                    attrs = this.parseAttributes(routes[k]);
                }
                var route = this.extractSegment(routes[k], "rtept");
                features.push(new OpenLayers.Feature.Vector(route, attrs));
            }
        }
        if (this.extractWaypoints) {
            var waypoints = doc.getElementsByTagName("wpt");
            for (var l = 0, len = waypoints.length; l < len; l++) {
                var attrs = {};
                if (this.extractAttributes) {
                    attrs = this.parseAttributes(waypoints[l]);
                }
                var wpt = new OpenLayers.Geometry.Point(waypoints[l].getAttribute("lon"), waypoints[l].getAttribute("lat"));
                features.push(new OpenLayers.Feature.Vector(wpt, attrs));
            }
        }
        if (this.internalProjection && this.externalProjection) {
            for (var g = 0, featLength = features.length; g < featLength; g++) {
                features[g].geometry.transform(this.externalProjection, this.internalProjection);
            }
        }
        return features;
    },
    extractSegment: function (segment, segmentType) {
        var points = this.getElementsByTagNameNS(segment, segment.namespaceURI, segmentType);
        var point_features = [];
        for (var i = 0, len = points.length; i < len; i++) {
            point_features.push(new OpenLayers.Geometry.Point(points[i].getAttribute("lon"), points[i].getAttribute("lat")));
        }
        return new OpenLayers.Geometry.LineString(point_features);
    },
    parseAttributes: function (node) {
        var attributes = {};
        var attrNode = node.firstChild,
            value, name;
        while (attrNode) {
            if (attrNode.nodeType == 1 && attrNode.firstChild) {
                value = attrNode.firstChild;
                if (value.nodeType == 3 || value.nodeType == 4) {
                    name = (attrNode.prefix) ? attrNode.nodeName.split(":")[1] : attrNode.nodeName;
                    if (name != "trkseg" && name != "rtept") {
                        attributes[name] = value.nodeValue;
                    }
                }
            }
            attrNode = attrNode.nextSibling;
        }
        return attributes;
    },
    write: function (features, metadata) {
        features = OpenLayers.Util.isArray(features) ? features : [features];
        var gpx = this.createElementNS(this.namespaces.gpx, "gpx");
        gpx.setAttribute("version", "1.1");
        gpx.setAttribute("creator", this.creator);
        this.setAttributes(gpx, {
            "xsi:schemaLocation": this.schemaLocation
        });
        if (metadata && typeof metadata == 'object') {
            gpx.appendChild(this.buildMetadataNode(metadata));
        }
        for (var i = 0, len = features.length; i < len; i++) {
            gpx.appendChild(this.buildFeatureNode(features[i]));
        }
        return OpenLayers.Format.XML.prototype.write.apply(this, [gpx]);
    },
    buildMetadataNode: function (metadata) {
        var types = ['name', 'desc', 'author'],
            node = this.createElementNSPlus('gpx:metadata');
        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            if (metadata[type]) {
                var n = this.createElementNSPlus("gpx:" + type);
                n.appendChild(this.createTextNode(metadata[type]));
                node.appendChild(n);
            }
        }
        return node;
    },
    buildFeatureNode: function (feature) {
        var geometry = feature.geometry;
        geometry = geometry.clone();
        if (this.internalProjection && this.externalProjection) {
            geometry.transform(this.internalProjection, this.externalProjection);
        }
        if (geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            var wpt = this.buildWptNode(geometry);
            this.appendAttributesNode(wpt, feature);
            return wpt;
        } else {
            var trkNode = this.createElementNSPlus("gpx:trk");
            this.appendAttributesNode(trkNode, feature);
            var trkSegNodes = this.buildTrkSegNode(geometry);
            trkSegNodes = OpenLayers.Util.isArray(trkSegNodes) ? trkSegNodes : [trkSegNodes];
            for (var i = 0, len = trkSegNodes.length; i < len; i++) {
                trkNode.appendChild(trkSegNodes[i]);
            }
            return trkNode;
        }
    },
    buildTrkSegNode: function (geometry) {
        var node, i, len, point, nodes;
        if (geometry.CLASS_NAME == "OpenLayers.Geometry.LineString" || geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
            node = this.createElementNSPlus("gpx:trkseg");
            for (i = 0, len = geometry.components.length; i < len; i++) {
                point = geometry.components[i];
                node.appendChild(this.buildTrkPtNode(point));
            }
            return node;
        } else {
            nodes = [];
            for (i = 0, len = geometry.components.length; i < len; i++) {
                nodes.push(this.buildTrkSegNode(geometry.components[i]));
            }
            return nodes;
        }
    },
    buildTrkPtNode: function (point) {
        var node = this.createElementNSPlus("gpx:trkpt");
        node.setAttribute("lon", point.x);
        node.setAttribute("lat", point.y);
        return node;
    },
    buildWptNode: function (geometry) {
        var node = this.createElementNSPlus("gpx:wpt");
        node.setAttribute("lon", geometry.x);
        node.setAttribute("lat", geometry.y);
        return node;
    },
    appendAttributesNode: function (node, feature) {
        var name = this.createElementNSPlus('gpx:name');
        name.appendChild(this.createTextNode(feature.attributes.name || feature.id));
        node.appendChild(name);
        var desc = this.createElementNSPlus('gpx:desc');
        desc.appendChild(this.createTextNode(feature.attributes.description || this.defaultDesc));
        node.appendChild(desc);
    },
    CLASS_NAME: "OpenLayers.Format.GPX"
});
OpenLayers.Format.Filter = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
    defaultVersion: "1.0.0",
    CLASS_NAME: "OpenLayers.Format.Filter"
});
OpenLayers.Format.Filter.v1 = OpenLayers.Class(OpenLayers.Format.XML, {
    namespaces: {
        ogc: "http://www.opengis.net/ogc",
        gml: "http://www.opengis.net/gml",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance"
    },
    defaultPrefix: "ogc",
    schemaLocation: null,
    initialize: function (options) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
    },
    read: function (data) {
        var obj = {};
        this.readers.ogc["Filter"].apply(this, [data, obj]);
        return obj.filter;
    },
    readers: {
        "ogc": {
            "_expression": function (node) {
                var obj, value = "";
                for (var child = node.firstChild; child; child = child.nextSibling) {
                    switch (child.nodeType) {
                    case 1:
                        obj = this.readNode(child);
                        if (obj.property) {
                            value += "${" + obj.property + "}";
                        } else if (obj.value !== undefined) {
                            value += obj.value;
                        }
                        break;
                    case 3:
                    case 4:
                        value += child.nodeValue;
                    }
                }
                return value;
            },
            "Filter": function (node, parent) {
                var obj = {
                    fids: [],
                    filters: []
                };
                this.readChildNodes(node, obj);
                if (obj.fids.length > 0) {
                    parent.filter = new OpenLayers.Filter.FeatureId({
                        fids: obj.fids
                    });
                } else if (obj.filters.length > 0) {
                    parent.filter = obj.filters[0];
                }
            },
            "FeatureId": function (node, obj) {
                var fid = node.getAttribute("fid");
                if (fid) {
                    obj.fids.push(fid);
                }
            },
            "And": function (node, obj) {
                var filter = new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.AND
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "Or": function (node, obj) {
                var filter = new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.OR
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "Not": function (node, obj) {
                var filter = new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.NOT
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsLessThan": function (node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LESS_THAN
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsGreaterThan": function (node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.GREATER_THAN
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsLessThanOrEqualTo": function (node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsGreaterThanOrEqualTo": function (node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsBetween": function (node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "Literal": function (node, obj) {
                obj.value = OpenLayers.String.numericIf(this.getChildValue(node));
            },
            "PropertyName": function (node, filter) {
                filter.property = this.getChildValue(node);
            },
            "LowerBoundary": function (node, filter) {
                filter.lowerBoundary = OpenLayers.String.numericIf(this.readers.ogc._expression.call(this, node));
            },
            "UpperBoundary": function (node, filter) {
                filter.upperBoundary = OpenLayers.String.numericIf(this.readers.ogc._expression.call(this, node));
            },
            "Intersects": function (node, obj) {
                this.readSpatial(node, obj, OpenLayers.Filter.Spatial.INTERSECTS);
            },
            "Within": function (node, obj) {
                this.readSpatial(node, obj, OpenLayers.Filter.Spatial.WITHIN);
            },
            "Contains": function (node, obj) {
                this.readSpatial(node, obj, OpenLayers.Filter.Spatial.CONTAINS);
            },
            "DWithin": function (node, obj) {
                this.readSpatial(node, obj, OpenLayers.Filter.Spatial.DWITHIN);
            },
            "Distance": function (node, obj) {
                obj.distance = parseInt(this.getChildValue(node));
                obj.distanceUnits = node.getAttribute("units");
            },
            "Function": function (node, obj) {
                return;
            }
        }
    },
    readSpatial: function (node, obj, type) {
        var filter = new OpenLayers.Filter.Spatial({
            type: type
        });
        this.readChildNodes(node, filter);
        filter.value = filter.components[0];
        delete filter.components;
        obj.filters.push(filter);
    },
    writeOgcExpression: function (value, node) {
        if (value instanceof OpenLayers.Filter.Function) {
            var child = this.writeNode("Function", value, node);
            node.appendChild(child);
        } else {
            this.writeNode("Literal", value, node);
        }
        return node;
    },
    write: function (filter) {
        return this.writers.ogc["Filter"].apply(this, [filter]);
    },
    writeFeatureIdNodes: function (filter, node) {
        for (var i = 0, ii = filter.fids.length; i < ii; ++i) {
            this.writeNode("FeatureId", filter.fids[i], node);
        }
    },
    writers: {
        "ogc": {
            "Filter": function (filter) {
                var node = this.createElementNSPlus("ogc:Filter");
                if (filter.type === "FID") {
                    OpenLayers.Format.Filter.v1.prototype.writeFeatureIdNodes.call(this, filter, node);
                } else {
                    this.writeNode(this.getFilterType(filter), filter, node);
                }
                return node;
            },
            "FeatureId": function (fid) {
                return this.createElementNSPlus("ogc:FeatureId", {
                    attributes: {
                        fid: fid
                    }
                });
            },
            "And": function (filter) {
                var node = this.createElementNSPlus("ogc:And");
                var childFilter;
                for (var i = 0, ii = filter.filters.length; i < ii; ++i) {
                    childFilter = filter.filters[i];
                    if (childFilter.type === "FID") {
                        OpenLayers.Format.Filter.v1.prototype.writeFeatureIdNodes.call(this, childFilter, node);
                    } else {
                        this.writeNode(this.getFilterType(childFilter), childFilter, node);
                    }
                }
                return node;
            },
            "Or": function (filter) {
                var node = this.createElementNSPlus("ogc:Or");
                var childFilter;
                for (var i = 0, ii = filter.filters.length; i < ii; ++i) {
                    childFilter = filter.filters[i];
                    if (childFilter.type === "FID") {
                        OpenLayers.Format.Filter.v1.prototype.writeFeatureIdNodes.call(this, childFilter, node);
                    } else {
                        this.writeNode(this.getFilterType(childFilter), childFilter, node);
                    }
                }
                return node;
            },
            "Not": function (filter) {
                var node = this.createElementNSPlus("ogc:Not");
                var childFilter = filter.filters[0];
                if (childFilter.type === "FID") {
                    OpenLayers.Format.Filter.v1.prototype.writeFeatureIdNodes.call(this, childFilter, node);
                } else {
                    this.writeNode(this.getFilterType(childFilter), childFilter, node);
                }
                return node;
            },
            "PropertyIsLessThan": function (filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsLessThan");
                this.writeNode("PropertyName", filter, node);
                this.writeOgcExpression(filter.value, node);
                return node;
            },
            "PropertyIsGreaterThan": function (filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsGreaterThan");
                this.writeNode("PropertyName", filter, node);
                this.writeOgcExpression(filter.value, node);
                return node;
            },
            "PropertyIsLessThanOrEqualTo": function (filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsLessThanOrEqualTo");
                this.writeNode("PropertyName", filter, node);
                this.writeOgcExpression(filter.value, node);
                return node;
            },
            "PropertyIsGreaterThanOrEqualTo": function (filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsGreaterThanOrEqualTo");
                this.writeNode("PropertyName", filter, node);
                this.writeOgcExpression(filter.value, node);
                return node;
            },
            "PropertyIsBetween": function (filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsBetween");
                this.writeNode("PropertyName", filter, node);
                this.writeNode("LowerBoundary", filter, node);
                this.writeNode("UpperBoundary", filter, node);
                return node;
            },
            "PropertyName": function (filter) {
                return this.createElementNSPlus("ogc:PropertyName", {
                    value: filter.property
                });
            },
            "Literal": function (value) {
                return this.createElementNSPlus("ogc:Literal", {
                    value: value
                });
            },
            "LowerBoundary": function (filter) {
                var node = this.createElementNSPlus("ogc:LowerBoundary");
                this.writeOgcExpression(filter.lowerBoundary, node);
                return node;
            },
            "UpperBoundary": function (filter) {
                var node = this.createElementNSPlus("ogc:UpperBoundary");
                this.writeNode("Literal", filter.upperBoundary, node);
                return node;
            },
            "INTERSECTS": function (filter) {
                return this.writeSpatial(filter, "Intersects");
            },
            "WITHIN": function (filter) {
                return this.writeSpatial(filter, "Within");
            },
            "CONTAINS": function (filter) {
                return this.writeSpatial(filter, "Contains");
            },
            "DWITHIN": function (filter) {
                var node = this.writeSpatial(filter, "DWithin");
                this.writeNode("Distance", filter, node);
                return node;
            },
            "Distance": function (filter) {
                return this.createElementNSPlus("ogc:Distance", {
                    attributes: {
                        units: filter.distanceUnits
                    },
                    value: filter.distance
                });
            },
            "Function": function (filter) {
                var node = this.createElementNSPlus("ogc:Function", {
                    attributes: {
                        name: filter.name
                    }
                });
                var params = filter.params;
                for (var i = 0, len = params.length; i < len; i++) {
                    this.writeOgcExpression(params[i], node);
                }
                return node;
            }
        }
    },
    getFilterType: function (filter) {
        var filterType = this.filterMap[filter.type];
        if (!filterType) {
            throw "Filter writing not supported for rule type: " + filter.type;
        }
        return filterType;
    },
    filterMap: {
        "&&": "And",
        "||": "Or",
        "!": "Not",
        "==": "PropertyIsEqualTo",
        "!=": "PropertyIsNotEqualTo",
        "<": "PropertyIsLessThan",
        ">": "PropertyIsGreaterThan",
        "<=": "PropertyIsLessThanOrEqualTo",
        ">=": "PropertyIsGreaterThanOrEqualTo",
        "..": "PropertyIsBetween",
        "~": "PropertyIsLike",
        "BBOX": "BBOX",
        "DWITHIN": "DWITHIN",
        "WITHIN": "WITHIN",
        "CONTAINS": "CONTAINS",
        "INTERSECTS": "INTERSECTS",
        "FID": "FeatureId"
    },
    CLASS_NAME: "OpenLayers.Format.Filter.v1"
});
OpenLayers.Format.Filter.v1_0_0 = OpenLayers.Class(OpenLayers.Format.GML.v2, OpenLayers.Format.Filter.v1, {
    VERSION: "1.0.0",
    schemaLocation: "http://www.opengis.net/ogc/filter/1.0.0/filter.xsd",
    initialize: function (options) {
        OpenLayers.Format.GML.v2.prototype.initialize.apply(this, [options]);
    },
    readers: {
        "ogc": OpenLayers.Util.applyDefaults({
            "PropertyIsEqualTo": function (node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsNotEqualTo": function (node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsLike": function (node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LIKE
                });
                this.readChildNodes(node, filter);
                var wildCard = node.getAttribute("wildCard");
                var singleChar = node.getAttribute("singleChar");
                var esc = node.getAttribute("escape");
                filter.value2regex(wildCard, singleChar, esc);
                obj.filters.push(filter);
            }
        }, OpenLayers.Format.Filter.v1.prototype.readers["ogc"]),
        "gml": OpenLayers.Format.GML.v2.prototype.readers["gml"],
        "feature": OpenLayers.Format.GML.v2.prototype.readers["feature"]
    },
    writers: {
        "ogc": OpenLayers.Util.applyDefaults({
            "PropertyIsEqualTo": function (filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsEqualTo");
                this.writeNode("PropertyName", filter, node);
                this.writeOgcExpression(filter.value, node);
                return node;
            },
            "PropertyIsNotEqualTo": function (filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsNotEqualTo");
                this.writeNode("PropertyName", filter, node);
                this.writeOgcExpression(filter.value, node);
                return node;
            },
            "PropertyIsLike": function (filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsLike", {
                    attributes: {
                        wildCard: "*",
                        singleChar: ".",
                        escape: "!"
                    }
                });
                this.writeNode("PropertyName", filter, node);
                this.writeNode("Literal", filter.regex2value(), node);
                return node;
            },
            "BBOX": function (filter) {
                var node = this.createElementNSPlus("ogc:BBOX");
                filter.property && this.writeNode("PropertyName", filter, node);
                var box = this.writeNode("gml:Box", filter.value, node);
                if (filter.projection) {
                    box.setAttribute("srsName", filter.projection);
                }
                return node;
            }
        }, OpenLayers.Format.Filter.v1.prototype.writers["ogc"]),
        "gml": OpenLayers.Format.GML.v2.prototype.writers["gml"],
        "feature": OpenLayers.Format.GML.v2.prototype.writers["feature"]
    },
    writeSpatial: function (filter, name) {
        var node = this.createElementNSPlus("ogc:" + name);
        this.writeNode("PropertyName", filter, node);
        if (filter.value instanceof OpenLayers.Filter.Function) {
            this.writeNode("Function", filter.value, node);
        } else {
            var child;
            if (filter.value instanceof OpenLayers.Geometry) {
                child = this.writeNode("feature:_geometry", filter.value).firstChild;
            } else {
                child = this.writeNode("gml:Box", filter.value);
            }
            if (filter.projection) {
                child.setAttribute("srsName", filter.projection);
            }
            node.appendChild(child);
        }
        return node;
    },
    CLASS_NAME: "OpenLayers.Format.Filter.v1_0_0"
});
OpenLayers.Format.SLD = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
    profile: null,
    defaultVersion: "1.0.0",
    stringifyOutput: true,
    namedLayersAsArray: false,
    CLASS_NAME: "OpenLayers.Format.SLD"
});
OpenLayers.Format.SLD.v1 = OpenLayers.Class(OpenLayers.Format.Filter.v1_0_0, {
    namespaces: {
        sld: "http://www.opengis.net/sld",
        ogc: "http://www.opengis.net/ogc",
        gml: "http://www.opengis.net/gml",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance"
    },
    defaultPrefix: "sld",
    schemaLocation: null,
    multipleSymbolizers: false,
    featureTypeCounter: null,
    defaultSymbolizer: {
        fillColor: "#808080",
        fillOpacity: 1,
        strokeColor: "#000000",
        strokeOpacity: 1,
        strokeWidth: 1,
        strokeDashstyle: "solid",
        pointRadius: 3,
        graphicName: "square"
    },
    read: function (data, options) {
        options = OpenLayers.Util.applyDefaults(options, this.options);
        var sld = {
            namedLayers: options.namedLayersAsArray === true ? [] : {}
        };
        this.readChildNodes(data, sld);
        return sld;
    },
    readers: OpenLayers.Util.applyDefaults({
        "sld": {
            "StyledLayerDescriptor": function (node, sld) {
                sld.version = node.getAttribute("version");
                this.readChildNodes(node, sld);
            },
            "Name": function (node, obj) {
                obj.name = this.getChildValue(node);
            },
            "Title": function (node, obj) {
                obj.title = this.getChildValue(node);
            },
            "Abstract": function (node, obj) {
                obj.description = this.getChildValue(node);
            },
            "NamedLayer": function (node, sld) {
                var layer = {
                    userStyles: [],
                    namedStyles: []
                };
                this.readChildNodes(node, layer);
                for (var i = 0, len = layer.userStyles.length; i < len; ++i) {
                    layer.userStyles[i].layerName = layer.name;
                }
                if (OpenLayers.Util.isArray(sld.namedLayers)) {
                    sld.namedLayers.push(layer);
                } else {
                    sld.namedLayers[layer.name] = layer;
                }
            },
            "NamedStyle": function (node, layer) {
                layer.namedStyles.push(this.getChildName(node.firstChild));
            },
            "UserStyle": function (node, layer) {
                var obj = {
                    defaultsPerSymbolizer: true,
                    rules: []
                };
                this.featureTypeCounter = -1;
                this.readChildNodes(node, obj);
                var style;
                if (this.multipleSymbolizers) {
                    delete obj.defaultsPerSymbolizer;
                    style = new OpenLayers.Style2(obj);
                } else {
                    style = new OpenLayers.Style(this.defaultSymbolizer, obj);
                }
                layer.userStyles.push(style);
            },
            "IsDefault": function (node, style) {
                if (this.getChildValue(node) == "1") {
                    style.isDefault = true;
                }
            },
            "FeatureTypeStyle": function (node, style) {
                ++this.featureTypeCounter;
                var obj = {
                    rules: this.multipleSymbolizers ? style.rules : []
                };
                this.readChildNodes(node, obj);
                if (!this.multipleSymbolizers) {
                    style.rules = obj.rules;
                }
            },
            "Rule": function (node, obj) {
                var config;
                if (this.multipleSymbolizers) {
                    config = {
                        symbolizers: []
                    };
                }
                var rule = new OpenLayers.Rule(config);
                this.readChildNodes(node, rule);
                obj.rules.push(rule);
            },
            "ElseFilter": function (node, rule) {
                rule.elseFilter = true;
            },
            "MinScaleDenominator": function (node, rule) {
                rule.minScaleDenominator = parseFloat(this.getChildValue(node));
            },
            "MaxScaleDenominator": function (node, rule) {
                rule.maxScaleDenominator = parseFloat(this.getChildValue(node));
            },
            "TextSymbolizer": function (node, rule) {
                var config = {};
                this.readChildNodes(node, config);
                if (this.multipleSymbolizers) {
                    config.zIndex = this.featureTypeCounter;
                    rule.symbolizers.push(new OpenLayers.Symbolizer.Text(config));
                } else {
                    rule.symbolizer["Text"] = OpenLayers.Util.applyDefaults(config, rule.symbolizer["Text"]);
                }
            },
            "LabelPlacement": function (node, symbolizer) {
                this.readChildNodes(node, symbolizer);
            },
            "PointPlacement": function (node, symbolizer) {
                var config = {};
                this.readChildNodes(node, config);
                config.labelRotation = config.rotation;
                delete config.rotation;
                var labelAlign, x = symbolizer.labelAnchorPointX,
                    y = symbolizer.labelAnchorPointY;
                if (x <= 1 / 3) {
                    labelAlign = 'l';
                } else if (x > 1 / 3 && x < 2 / 3) {
                    labelAlign = 'c';
                } else if (x >= 2 / 3) {
                    labelAlign = 'r';
                }
                if (y <= 1 / 3) {
                    labelAlign += 'b';
                } else if (y > 1 / 3 && y < 2 / 3) {
                    labelAlign += 'm';
                } else if (y >= 2 / 3) {
                    labelAlign += 't';
                }
                config.labelAlign = labelAlign;
                OpenLayers.Util.applyDefaults(symbolizer, config);
            },
            "AnchorPoint": function (node, symbolizer) {
                this.readChildNodes(node, symbolizer);
            },
            "AnchorPointX": function (node, symbolizer) {
                var labelAnchorPointX = this.readers.ogc._expression.call(this, node);
                if (labelAnchorPointX) {
                    symbolizer.labelAnchorPointX = labelAnchorPointX;
                }
            },
            "AnchorPointY": function (node, symbolizer) {
                var labelAnchorPointY = this.readers.ogc._expression.call(this, node);
                if (labelAnchorPointY) {
                    symbolizer.labelAnchorPointY = labelAnchorPointY;
                }
            },
            "Displacement": function (node, symbolizer) {
                this.readChildNodes(node, symbolizer);
            },
            "DisplacementX": function (node, symbolizer) {
                var labelXOffset = this.readers.ogc._expression.call(this, node);
                if (labelXOffset) {
                    symbolizer.labelXOffset = labelXOffset;
                }
            },
            "DisplacementY": function (node, symbolizer) {
                var labelYOffset = this.readers.ogc._expression.call(this, node);
                if (labelYOffset) {
                    symbolizer.labelYOffset = labelYOffset;
                }
            },
            "LinePlacement": function (node, symbolizer) {
                this.readChildNodes(node, symbolizer);
            },
            "PerpendicularOffset": function (node, symbolizer) {
                var labelPerpendicularOffset = this.readers.ogc._expression.call(this, node);
                if (labelPerpendicularOffset) {
                    symbolizer.labelPerpendicularOffset = labelPerpendicularOffset;
                }
            },
            "Label": function (node, symbolizer) {
                var value = this.readers.ogc._expression.call(this, node);
                if (value) {
                    symbolizer.label = value;
                }
            },
            "Font": function (node, symbolizer) {
                this.readChildNodes(node, symbolizer);
            },
            "Halo": function (node, symbolizer) {
                var obj = {};
                this.readChildNodes(node, obj);
                symbolizer.haloRadius = obj.haloRadius;
                symbolizer.haloColor = obj.fillColor;
                symbolizer.haloOpacity = obj.fillOpacity;
            },
            "Radius": function (node, symbolizer) {
                var radius = this.readers.ogc._expression.call(this, node);
                if (radius != null) {
                    symbolizer.haloRadius = radius;
                }
            },
            "RasterSymbolizer": function (node, rule) {
                var config = {};
                this.readChildNodes(node, config);
                if (this.multipleSymbolizers) {
                    config.zIndex = this.featureTypeCounter;
                    rule.symbolizers.push(new OpenLayers.Symbolizer.Raster(config));
                } else {
                    rule.symbolizer["Raster"] = OpenLayers.Util.applyDefaults(config, rule.symbolizer["Raster"]);
                }
            },
            "Geometry": function (node, obj) {
                obj.geometry = {};
                this.readChildNodes(node, obj.geometry);
            },
            "ColorMap": function (node, symbolizer) {
                symbolizer.colorMap = [];
                this.readChildNodes(node, symbolizer.colorMap);
            },
            "ColorMapEntry": function (node, colorMap) {
                var q = node.getAttribute("quantity");
                var o = node.getAttribute("opacity");
                colorMap.push({
                    color: node.getAttribute("color"),
                    quantity: q !== null ? parseFloat(q) : undefined,
                    label: node.getAttribute("label") || undefined,
                    opacity: o !== null ? parseFloat(o) : undefined
                });
            },
            "LineSymbolizer": function (node, rule) {
                var config = {};
                this.readChildNodes(node, config);
                if (this.multipleSymbolizers) {
                    config.zIndex = this.featureTypeCounter;
                    rule.symbolizers.push(new OpenLayers.Symbolizer.Line(config));
                } else {
                    rule.symbolizer["Line"] = OpenLayers.Util.applyDefaults(config, rule.symbolizer["Line"]);
                }
            },
            "PolygonSymbolizer": function (node, rule) {
                var config = {
                    fill: false,
                    stroke: false
                };
                if (!this.multipleSymbolizers) {
                    config = rule.symbolizer["Polygon"] || config;
                }
                this.readChildNodes(node, config);
                if (this.multipleSymbolizers) {
                    config.zIndex = this.featureTypeCounter;
                    rule.symbolizers.push(new OpenLayers.Symbolizer.Polygon(config));
                } else {
                    rule.symbolizer["Polygon"] = config;
                }
            },
            "PointSymbolizer": function (node, rule) {
                var config = {
                    fill: false,
                    stroke: false,
                    graphic: false
                };
                if (!this.multipleSymbolizers) {
                    config = rule.symbolizer["Point"] || config;
                }
                this.readChildNodes(node, config);
                if (this.multipleSymbolizers) {
                    config.zIndex = this.featureTypeCounter;
                    rule.symbolizers.push(new OpenLayers.Symbolizer.Point(config));
                } else {
                    rule.symbolizer["Point"] = config;
                }
            },
            "Stroke": function (node, symbolizer) {
                symbolizer.stroke = true;
                this.readChildNodes(node, symbolizer);
            },
            "Fill": function (node, symbolizer) {
                symbolizer.fill = true;
                this.readChildNodes(node, symbolizer);
            },
            "CssParameter": function (node, symbolizer) {
                var cssProperty = node.getAttribute("name");
                var symProperty = this.cssMap[cssProperty];
                if (symbolizer.label) {
                    if (cssProperty === 'fill') {
                        symProperty = "fontColor";
                    } else if (cssProperty === 'fill-opacity') {
                        symProperty = "fontOpacity";
                    }
                }
                if (symProperty) {
                    var value = this.readers.ogc._expression.call(this, node);
                    if (value) {
                        symbolizer[symProperty] = value;
                    }
                }
            },
            "Graphic": function (node, symbolizer) {
                symbolizer.graphic = true;
                var graphic = {};
                this.readChildNodes(node, graphic);
                var properties = ["stroke", "strokeColor", "strokeWidth", "strokeOpacity", "strokeLinecap", "fill", "fillColor", "fillOpacity", "graphicName", "rotation", "graphicFormat"];
                var prop, value;
                for (var i = 0, len = properties.length; i < len; ++i) {
                    prop = properties[i];
                    value = graphic[prop];
                    if (value != undefined) {
                        symbolizer[prop] = value;
                    }
                }
                if (graphic.opacity != undefined) {
                    symbolizer.graphicOpacity = graphic.opacity;
                }
                if (graphic.size != undefined) {
                    var pointRadius = graphic.size / 2;
                    if (isNaN(pointRadius)) {
                        symbolizer.graphicWidth = graphic.size;
                    } else {
                        symbolizer.pointRadius = graphic.size / 2;
                    }
                }
                if (graphic.href != undefined) {
                    symbolizer.externalGraphic = graphic.href;
                }
                if (graphic.rotation != undefined) {
                    symbolizer.rotation = graphic.rotation;
                }
            },
            "ExternalGraphic": function (node, graphic) {
                this.readChildNodes(node, graphic);
            },
            "Mark": function (node, graphic) {
                this.readChildNodes(node, graphic);
            },
            "WellKnownName": function (node, graphic) {
                graphic.graphicName = this.getChildValue(node);
            },
            "Opacity": function (node, obj) {
                var opacity = this.readers.ogc._expression.call(this, node);
                if (opacity) {
                    obj.opacity = opacity;
                }
            },
            "Size": function (node, obj) {
                var size = this.readers.ogc._expression.call(this, node);
                if (size) {
                    obj.size = size;
                }
            },
            "Rotation": function (node, obj) {
                var rotation = this.readers.ogc._expression.call(this, node);
                if (rotation) {
                    obj.rotation = rotation;
                }
            },
            "OnlineResource": function (node, obj) {
                obj.href = this.getAttributeNS(node, this.namespaces.xlink, "href");
            },
            "Format": function (node, graphic) {
                graphic.graphicFormat = this.getChildValue(node);
            }
        }
    }, OpenLayers.Format.Filter.v1_0_0.prototype.readers),
    cssMap: {
        "font-color": "fontColor",
        "label-background-color": "labelBackgroundColor",
        "label-x-offset": "labelXOffset",
        "label-y-offset": "labelYOffset",
        "font-stroke-color": "fontStrokeColor",
        "font-stroke-width": "fontStrokeWidth",
        "cursor": "cursor",
        "label-outline-color": "labelOutlineColor",
        "label-outline-width": "labelOutlineWidth",
        "stroke": "strokeColor",
        "stroke-opacity": "strokeOpacity",
        "stroke-width": "strokeWidth",
        "stroke-linecap": "strokeLinecap",
        "stroke-dasharray": "strokeDashstyle",
        "fill": "fillColor",
        "fill-opacity": "fillOpacity",
        "font-family": "fontFamily",
        "font-size": "fontSize",
        "font-weight": "fontWeight",
        "font-style": "fontStyle"
    },
    getCssProperty: function (sym) {
        var css = null;
        for (var prop in this.cssMap) {
            if (this.cssMap[prop] == sym) {
                css = prop;
                break;
            }
        }
        return css;
    },
    getGraphicFormat: function (href) {
        var format, regex;
        for (var key in this.graphicFormats) {
            if (this.graphicFormats[key].test(href)) {
                format = key;
                break;
            }
        }
        return format || this.defaultGraphicFormat;
    },
    defaultGraphicFormat: "image/png",
    graphicFormats: {
        "image/jpeg": /\.jpe?g$/i,
        "image/gif": /\.gif$/i,
        "image/png": /\.png$/i
    },
    write: function (sld) {
        return this.writers.sld.StyledLayerDescriptor.apply(this, [sld]);
    },
    writers: OpenLayers.Util.applyDefaults({
        "sld": {
            "_OGCExpression": function (nodeName, value) {
                var node = this.createElementNSPlus(nodeName);
                var tokens = typeof value == "string" ? value.split("${") : [value];
                node.appendChild(this.createTextNode(tokens[0]));
                var item, last;
                for (var i = 1, len = tokens.length; i < len; i++) {
                    item = tokens[i];
                    last = item.indexOf("}");
                    if (last > 0) {
                        this.writeNode("ogc:PropertyName", {
                            property: item.substring(0, last)
                        }, node);
                        node.appendChild(this.createTextNode(item.substring(++last)));
                    } else {
                        node.appendChild(this.createTextNode("${" + item));
                    }
                }
                return node;
            },
            "StyledLayerDescriptor": function (sld) {
                var root = this.createElementNSPlus("sld:StyledLayerDescriptor", {
                    attributes: {
                        "version": this.VERSION,
                        "xsi:schemaLocation": this.schemaLocation
                    }
                });
                root.setAttribute("xmlns:ogc", this.namespaces.ogc);
                root.setAttribute("xmlns:gml", this.namespaces.gml);
                if (sld.name) {
                    this.writeNode("Name", sld.name, root);
                }
                if (sld.title) {
                    this.writeNode("Title", sld.title, root);
                }
                if (sld.description) {
                    this.writeNode("Abstract", sld.description, root);
                }
                if (OpenLayers.Util.isArray(sld.namedLayers)) {
                    for (var i = 0, len = sld.namedLayers.length; i < len; ++i) {
                        this.writeNode("NamedLayer", sld.namedLayers[i], root);
                    }
                } else {
                    for (var name in sld.namedLayers) {
                        this.writeNode("NamedLayer", sld.namedLayers[name], root);
                    }
                }
                return root;
            },
            "Name": function (name) {
                return this.createElementNSPlus("sld:Name", {
                    value: name
                });
            },
            "Title": function (title) {
                return this.createElementNSPlus("sld:Title", {
                    value: title
                });
            },
            "Abstract": function (description) {
                return this.createElementNSPlus("sld:Abstract", {
                    value: description
                });
            },
            "NamedLayer": function (layer) {
                var node = this.createElementNSPlus("sld:NamedLayer");
                this.writeNode("Name", layer.name, node);
                if (layer.namedStyles) {
                    for (var i = 0, len = layer.namedStyles.length; i < len; ++i) {
                        this.writeNode("NamedStyle", layer.namedStyles[i], node);
                    }
                }
                if (layer.userStyles) {
                    for (var i = 0, len = layer.userStyles.length; i < len; ++i) {
                        this.writeNode("UserStyle", layer.userStyles[i], node);
                    }
                }
                return node;
            },
            "NamedStyle": function (name) {
                var node = this.createElementNSPlus("sld:NamedStyle");
                this.writeNode("Name", name, node);
                return node;
            },
            "UserStyle": function (style) {
                var node = this.createElementNSPlus("sld:UserStyle");
                if (style.name) {
                    this.writeNode("Name", style.name, node);
                }
                if (style.title) {
                    this.writeNode("Title", style.title, node);
                }
                if (style.description) {
                    this.writeNode("Abstract", style.description, node);
                }
                if (style.isDefault) {
                    this.writeNode("IsDefault", style.isDefault, node);
                }
                if (this.multipleSymbolizers && style.rules) {
                    var rulesByZ = {
                        0: []
                    };
                    var zValues = [0];
                    var rule, ruleMap, symbolizer, zIndex, clone;
                    for (var i = 0, ii = style.rules.length; i < ii; ++i) {
                        rule = style.rules[i];
                        if (rule.symbolizers) {
                            ruleMap = {};
                            for (var j = 0, jj = rule.symbolizers.length; j < jj; ++j) {
                                symbolizer = rule.symbolizers[j];
                                zIndex = symbolizer.zIndex;
                                if (!(zIndex in ruleMap)) {
                                    clone = rule.clone();
                                    clone.symbolizers = [];
                                    ruleMap[zIndex] = clone;
                                }
                                ruleMap[zIndex].symbolizers.push(symbolizer.clone());
                            }
                            for (zIndex in ruleMap) {
                                if (!(zIndex in rulesByZ)) {
                                    zValues.push(zIndex);
                                    rulesByZ[zIndex] = [];
                                }
                                rulesByZ[zIndex].push(ruleMap[zIndex]);
                            }
                        } else {
                            rulesByZ[0].push(rule.clone());
                        }
                    }
                    zValues.sort();
                    var rules;
                    for (var i = 0, ii = zValues.length; i < ii; ++i) {
                        rules = rulesByZ[zValues[i]];
                        if (rules.length > 0) {
                            clone = style.clone();
                            clone.rules = rulesByZ[zValues[i]];
                            this.writeNode("FeatureTypeStyle", clone, node);
                        }
                    }
                } else {
                    this.writeNode("FeatureTypeStyle", style, node);
                }
                return node;
            },
            "IsDefault": function (bool) {
                return this.createElementNSPlus("sld:IsDefault", {
                    value: (bool) ? "1" : "0"
                });
            },
            "FeatureTypeStyle": function (style) {
                var node = this.createElementNSPlus("sld:FeatureTypeStyle");
                for (var i = 0, len = style.rules.length; i < len; ++i) {
                    this.writeNode("Rule", style.rules[i], node);
                }
                return node;
            },
            "Rule": function (rule) {
                var node = this.createElementNSPlus("sld:Rule");
                if (rule.name) {
                    this.writeNode("Name", rule.name, node);
                }
                if (rule.title) {
                    this.writeNode("Title", rule.title, node);
                }
                if (rule.description) {
                    this.writeNode("Abstract", rule.description, node);
                }
                if (rule.elseFilter) {
                    this.writeNode("ElseFilter", null, node);
                } else if (rule.filter) {
                    this.writeNode("ogc:Filter", rule.filter, node);
                }
                if (rule.minScaleDenominator != undefined) {
                    this.writeNode("MinScaleDenominator", rule.minScaleDenominator, node);
                }
                if (rule.maxScaleDenominator != undefined) {
                    this.writeNode("MaxScaleDenominator", rule.maxScaleDenominator, node);
                }
                var type, symbolizer;
                if (this.multipleSymbolizers && rule.symbolizers) {
                    var symbolizer;
                    for (var i = 0, ii = rule.symbolizers.length; i < ii; ++i) {
                        symbolizer = rule.symbolizers[i];
                        type = symbolizer.CLASS_NAME.split(".").pop();
                        this.writeNode(type + "Symbolizer", symbolizer, node);
                    }
                } else {
                    var types = OpenLayers.Style.SYMBOLIZER_PREFIXES;
                    for (var i = 0, len = types.length; i < len; ++i) {
                        type = types[i];
                        symbolizer = rule.symbolizer[type];
                        if (symbolizer) {
                            this.writeNode(type + "Symbolizer", symbolizer, node);
                        }
                    }
                }
                return node;
            },
            "ElseFilter": function () {
                return this.createElementNSPlus("sld:ElseFilter");
            },
            "MinScaleDenominator": function (scale) {
                return this.createElementNSPlus("sld:MinScaleDenominator", {
                    value: scale
                });
            },
            "MaxScaleDenominator": function (scale) {
                return this.createElementNSPlus("sld:MaxScaleDenominator", {
                    value: scale
                });
            },
            "LineSymbolizer": function (symbolizer) {
                var node = this.createElementNSPlus("sld:LineSymbolizer");
                this.writeNode("Stroke", symbolizer, node);
                return node;
            },
            "Stroke": function (symbolizer) {
                var node = this.createElementNSPlus("sld:Stroke");
                if (symbolizer.strokeColor != undefined) {
                    this.writeNode("CssParameter", {
                        symbolizer: symbolizer,
                        key: "strokeColor"
                    }, node);
                }
                if (symbolizer.strokeOpacity != undefined) {
                    this.writeNode("CssParameter", {
                        symbolizer: symbolizer,
                        key: "strokeOpacity"
                    }, node);
                }
                if (symbolizer.strokeWidth != undefined) {
                    this.writeNode("CssParameter", {
                        symbolizer: symbolizer,
                        key: "strokeWidth"
                    }, node);
                }
                if (symbolizer.strokeDashstyle != undefined && symbolizer.strokeDashstyle !== "solid") {
                    this.writeNode("CssParameter", {
                        symbolizer: symbolizer,
                        key: "strokeDashstyle"
                    }, node);
                }
                if (symbolizer.strokeLinecap != undefined) {
                    this.writeNode("CssParameter", {
                        symbolizer: symbolizer,
                        key: "strokeLinecap"
                    }, node);
                }
                return node;
            },
            "CssParameter": function (obj) {
                return this.createElementNSPlus("sld:CssParameter", {
                    attributes: {
                        name: this.getCssProperty(obj.key)
                    },
                    value: obj.symbolizer[obj.key]
                });
            },
            "TextSymbolizer": function (symbolizer) {
                var node = this.createElementNSPlus("sld:TextSymbolizer");
                if (symbolizer.label != null) {
                    this.writeNode("Label", symbolizer.label, node);
                }
                if (symbolizer.fontFamily != null || symbolizer.fontSize != null || symbolizer.fontWeight != null || symbolizer.fontStyle != null) {
                    this.writeNode("Font", symbolizer, node);
                }
                if (symbolizer.labelAnchorPointX != null || symbolizer.labelAnchorPointY != null || symbolizer.labelAlign != null || symbolizer.labelXOffset != null || symbolizer.labelYOffset != null || symbolizer.labelRotation != null || symbolizer.labelPerpendicularOffset != null) {
                    this.writeNode("LabelPlacement", symbolizer, node);
                }
                if (symbolizer.haloRadius != null || symbolizer.haloColor != null || symbolizer.haloOpacity != null) {
                    this.writeNode("Halo", symbolizer, node);
                }
                if (symbolizer.fontColor != null || symbolizer.fontOpacity != null) {
                    this.writeNode("Fill", {
                        fillColor: symbolizer.fontColor,
                        fillOpacity: symbolizer.fontOpacity
                    }, node);
                }
                return node;
            },
            "LabelPlacement": function (symbolizer) {
                var node = this.createElementNSPlus("sld:LabelPlacement");
                if ((symbolizer.labelAnchorPointX != null || symbolizer.labelAnchorPointY != null || symbolizer.labelAlign != null || symbolizer.labelXOffset != null || symbolizer.labelYOffset != null || symbolizer.labelRotation != null) && symbolizer.labelPerpendicularOffset == null) {
                    this.writeNode("PointPlacement", symbolizer, node);
                }
                if (symbolizer.labelPerpendicularOffset != null) {
                    this.writeNode("LinePlacement", symbolizer, node);
                }
                return node;
            },
            "LinePlacement": function (symbolizer) {
                var node = this.createElementNSPlus("sld:LinePlacement");
                this.writeNode("PerpendicularOffset", symbolizer.labelPerpendicularOffset, node);
                return node;
            },
            "PerpendicularOffset": function (value) {
                return this.createElementNSPlus("sld:PerpendicularOffset", {
                    value: value
                });
            },
            "PointPlacement": function (symbolizer) {
                var node = this.createElementNSPlus("sld:PointPlacement");
                if (symbolizer.labelAnchorPointX != null || symbolizer.labelAnchorPointY != null || symbolizer.labelAlign != null) {
                    this.writeNode("AnchorPoint", symbolizer, node);
                }
                if (symbolizer.labelXOffset != null || symbolizer.labelYOffset != null) {
                    this.writeNode("Displacement", symbolizer, node);
                }
                if (symbolizer.labelRotation != null) {
                    this.writeNode("Rotation", symbolizer.labelRotation, node);
                }
                return node;
            },
            "AnchorPoint": function (symbolizer) {
                var node = this.createElementNSPlus("sld:AnchorPoint");
                var x = symbolizer.labelAnchorPointX,
                    y = symbolizer.labelAnchorPointY;
                if (x != null) {
                    this.writeNode("AnchorPointX", x, node);
                }
                if (y != null) {
                    this.writeNode("AnchorPointY", y, node);
                }
                if (x == null && y == null) {
                    var xAlign = symbolizer.labelAlign.substr(0, 1),
                        yAlign = symbolizer.labelAlign.substr(1, 1);
                    if (xAlign === "l") {
                        x = 0;
                    } else if (xAlign === "c") {
                        x = 0.5;
                    } else if (xAlign === "r") {
                        x = 1;
                    }
                    if (yAlign === "b") {
                        y = 0;
                    } else if (yAlign === "m") {
                        y = 0.5;
                    } else if (yAlign === "t") {
                        y = 1;
                    }
                    this.writeNode("AnchorPointX", x, node);
                    this.writeNode("AnchorPointY", y, node);
                }
                return node;
            },
            "AnchorPointX": function (value) {
                return this.createElementNSPlus("sld:AnchorPointX", {
                    value: value
                });
            },
            "AnchorPointY": function (value) {
                return this.createElementNSPlus("sld:AnchorPointY", {
                    value: value
                });
            },
            "Displacement": function (symbolizer) {
                var node = this.createElementNSPlus("sld:Displacement");
                if (symbolizer.labelXOffset != null) {
                    this.writeNode("DisplacementX", symbolizer.labelXOffset, node);
                }
                if (symbolizer.labelYOffset != null) {
                    this.writeNode("DisplacementY", symbolizer.labelYOffset, node);
                }
                return node;
            },
            "DisplacementX": function (value) {
                return this.createElementNSPlus("sld:DisplacementX", {
                    value: value
                });
            },
            "DisplacementY": function (value) {
                return this.createElementNSPlus("sld:DisplacementY", {
                    value: value
                });
            },
            "Font": function (symbolizer) {
                var node = this.createElementNSPlus("sld:Font");
                if (symbolizer.fontFamily) {
                    this.writeNode("CssParameter", {
                        symbolizer: symbolizer,
                        key: "fontFamily"
                    }, node);
                }
                if (symbolizer.fontSize) {
                    this.writeNode("CssParameter", {
                        symbolizer: symbolizer,
                        key: "fontSize"
                    }, node);
                }
                if (symbolizer.fontWeight) {
                    this.writeNode("CssParameter", {
                        symbolizer: symbolizer,
                        key: "fontWeight"
                    }, node);
                }
                if (symbolizer.fontStyle) {
                    this.writeNode("CssParameter", {
                        symbolizer: symbolizer,
                        key: "fontStyle"
                    }, node);
                }
                return node;
            },
            "Label": function (label) {
                return this.writers.sld._OGCExpression.call(this, "sld:Label", label);
            },
            "Halo": function (symbolizer) {
                var node = this.createElementNSPlus("sld:Halo");
                if (symbolizer.haloRadius) {
                    this.writeNode("Radius", symbolizer.haloRadius, node);
                }
                if (symbolizer.haloColor || symbolizer.haloOpacity) {
                    this.writeNode("Fill", {
                        fillColor: symbolizer.haloColor,
                        fillOpacity: symbolizer.haloOpacity
                    }, node);
                }
                return node;
            },
            "Radius": function (value) {
                return this.createElementNSPlus("sld:Radius", {
                    value: value
                });
            },
            "RasterSymbolizer": function (symbolizer) {
                var node = this.createElementNSPlus("sld:RasterSymbolizer");
                if (symbolizer.geometry) {
                    this.writeNode("Geometry", symbolizer.geometry, node);
                }
                if (symbolizer.opacity) {
                    this.writeNode("Opacity", symbolizer.opacity, node);
                }
                if (symbolizer.colorMap) {
                    this.writeNode("ColorMap", symbolizer.colorMap, node);
                }
                return node;
            },
            "Geometry": function (geometry) {
                var node = this.createElementNSPlus("sld:Geometry");
                if (geometry.property) {
                    this.writeNode("ogc:PropertyName", geometry, node);
                }
                return node;
            },
            "ColorMap": function (colorMap) {
                var node = this.createElementNSPlus("sld:ColorMap");
                for (var i = 0, len = colorMap.length; i < len; ++i) {
                    this.writeNode("ColorMapEntry", colorMap[i], node);
                }
                return node;
            },
            "ColorMapEntry": function (colorMapEntry) {
                var node = this.createElementNSPlus("sld:ColorMapEntry");
                var a = colorMapEntry;
                node.setAttribute("color", a.color);
                a.opacity !== undefined && node.setAttribute("opacity", parseFloat(a.opacity));
                a.quantity !== undefined && node.setAttribute("quantity", parseFloat(a.quantity));
                a.label !== undefined && node.setAttribute("label", a.label);
                return node;
            },
            "PolygonSymbolizer": function (symbolizer) {
                var node = this.createElementNSPlus("sld:PolygonSymbolizer");
                if (symbolizer.fill !== false) {
                    this.writeNode("Fill", symbolizer, node);
                }
                if (symbolizer.stroke !== false) {
                    this.writeNode("Stroke", symbolizer, node);
                }
                return node;
            },
            "Fill": function (symbolizer) {
                var node = this.createElementNSPlus("sld:Fill");
                if (symbolizer.fillColor) {
                    this.writeNode("CssParameter", {
                        symbolizer: symbolizer,
                        key: "fillColor"
                    }, node);
                }
                if (symbolizer.fillOpacity != null) {
                    this.writeNode("CssParameter", {
                        symbolizer: symbolizer,
                        key: "fillOpacity"
                    }, node);
                }
                return node;
            },
            "PointSymbolizer": function (symbolizer) {
                var node = this.createElementNSPlus("sld:PointSymbolizer");
                this.writeNode("Graphic", symbolizer, node);
                return node;
            },
            "Graphic": function (symbolizer) {
                var node = this.createElementNSPlus("sld:Graphic");
                if (symbolizer.externalGraphic != undefined) {
                    this.writeNode("ExternalGraphic", symbolizer, node);
                } else {
                    this.writeNode("Mark", symbolizer, node);
                }
                if (symbolizer.graphicOpacity != undefined) {
                    this.writeNode("Opacity", symbolizer.graphicOpacity, node);
                }
                if (symbolizer.pointRadius != undefined) {
                    this.writeNode("Size", symbolizer.pointRadius * 2, node);
                } else if (symbolizer.graphicWidth != undefined) {
                    this.writeNode("Size", symbolizer.graphicWidth, node);
                }
                if (symbolizer.rotation != undefined) {
                    this.writeNode("Rotation", symbolizer.rotation, node);
                }
                return node;
            },
            "ExternalGraphic": function (symbolizer) {
                var node = this.createElementNSPlus("sld:ExternalGraphic");
                this.writeNode("OnlineResource", symbolizer.externalGraphic, node);
                var format = symbolizer.graphicFormat || this.getGraphicFormat(symbolizer.externalGraphic);
                this.writeNode("Format", format, node);
                return node;
            },
            "Mark": function (symbolizer) {
                var node = this.createElementNSPlus("sld:Mark");
                if (symbolizer.graphicName) {
                    this.writeNode("WellKnownName", symbolizer.graphicName, node);
                }
                if (symbolizer.fill !== false) {
                    this.writeNode("Fill", symbolizer, node);
                }
                if (symbolizer.stroke !== false) {
                    this.writeNode("Stroke", symbolizer, node);
                }
                return node;
            },
            "WellKnownName": function (name) {
                return this.createElementNSPlus("sld:WellKnownName", {
                    value: name
                });
            },
            "Opacity": function (value) {
                return this.createElementNSPlus("sld:Opacity", {
                    value: value
                });
            },
            "Size": function (value) {
                return this.writers.sld._OGCExpression.call(this, "sld:Size", value);
            },
            "Rotation": function (value) {
                return this.createElementNSPlus("sld:Rotation", {
                    value: value
                });
            },
            "OnlineResource": function (href) {
                return this.createElementNSPlus("sld:OnlineResource", {
                    attributes: {
                        "xlink:type": "simple",
                        "xlink:href": href
                    }
                });
            },
            "Format": function (format) {
                return this.createElementNSPlus("sld:Format", {
                    value: format
                });
            }
        }
    }, OpenLayers.Format.Filter.v1_0_0.prototype.writers),
    CLASS_NAME: "OpenLayers.Format.SLD.v1"
});
OpenLayers.Format.SLD.v1_0_0 = OpenLayers.Class(OpenLayers.Format.SLD.v1, {
    VERSION: "1.0.0",
    schemaLocation: "http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd",
    CLASS_NAME: "OpenLayers.Format.SLD.v1_0_0"
});
OpenLayers.Lang = {
    code: null,
    defaultCode: "en",
    getCode: function () {
        if (!OpenLayers.Lang.code) {
            OpenLayers.Lang.setCode();
        }
        return OpenLayers.Lang.code;
    },
    setCode: function (code) {
        var lang;
        if (!code) {
            code = (OpenLayers.BROWSER_NAME == "msie") ? navigator.userLanguage : navigator.language;
        }
        var parts = code.split('-');
        parts[0] = parts[0].toLowerCase();
        if (typeof OpenLayers.Lang[parts[0]] == "object") {
            lang = parts[0];
        }
        if (parts[1]) {
            var testLang = parts[0] + '-' + parts[1].toUpperCase();
            if (typeof OpenLayers.Lang[testLang] == "object") {
                lang = testLang;
            }
        }
        if (!lang) {
            OpenLayers.Console.warn('Failed to find OpenLayers.Lang.' + parts.join("-") + ' dictionary, falling back to default language');
            lang = OpenLayers.Lang.defaultCode;
        }
        OpenLayers.Lang.code = lang;
    },
    translate: function (key, context) {
        var dictionary = OpenLayers.Lang[OpenLayers.Lang.getCode()];
        var message = dictionary && dictionary[key];
        if (!message) {
            message = key;
        }
        if (context) {
            message = OpenLayers.String.format(message, context);
        }
        return message;
    }
};
OpenLayers.i18n = OpenLayers.Lang.translate;
OpenLayers.Spherical = OpenLayers.Spherical || {};
OpenLayers.Spherical.DEFAULT_RADIUS = 6378137;
OpenLayers.Spherical.computeDistanceBetween = function (from, to, radius) {
    var R = radius || OpenLayers.Spherical.DEFAULT_RADIUS;
    var sinHalfDeltaLon = Math.sin(Math.PI * (to.lon - from.lon) / 360);
    var sinHalfDeltaLat = Math.sin(Math.PI * (to.lat - from.lat) / 360);
    var a = sinHalfDeltaLat * sinHalfDeltaLat +
        sinHalfDeltaLon * sinHalfDeltaLon * Math.cos(Math.PI * from.lat / 180) * Math.cos(Math.PI * to.lat / 180);
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
OpenLayers.Spherical.computeHeading = function (from, to) {
    var y = Math.sin(Math.PI * (from.lon - to.lon) / 180) * Math.cos(Math.PI * to.lat / 180);
    var x = Math.cos(Math.PI * from.lat / 180) * Math.sin(Math.PI * to.lat / 180) -
        Math.sin(Math.PI * from.lat / 180) * Math.cos(Math.PI * to.lat / 180) * Math.cos(Math.PI * (from.lon - to.lon) / 180);
    return 180 * Math.atan2(y, x) / Math.PI;
};
OpenLayers.Lang["fr"] = OpenLayers.Util.applyDefaults({
    'unhandledRequest': "Requ�te non g�r�e, retournant ${statusText}",
    'Permalink': "Permalien",
    'Overlays': "Calques",
    'Base Layer': "Calque de base",
    'noFID': "Impossible de mettre � jour un objet sans identifiant (fid).",
    'browserNotSupported': "Votre navigateur ne supporte pas le rendu vectoriel. Les renderers actuellement support�s sont : \n${renderers}",
    'minZoomLevelError': "La propri�t� minZoomLevel doit seulement �tre utilis�e pour des couches FixedZoomLevels-descendent. Le fait que cette couche WFS v�rifie la pr�sence de minZoomLevel est une relique du pass�. Nous ne pouvons toutefois la supprimer sans casser des applications qui pourraient en d�pendre. C\'est pourquoi nous la d�pr�cions -- la v�rification du minZoomLevel sera supprim�e en version 3.0. A la place, merci d\'utiliser les param�tres de r�solutions min/max tel que d�crit sur : http://trac.openlayers.org/wiki/SettingZoomLevels",
    'commitSuccess': "Transaction WFS : SUCCES ${response}",
    'commitFailed': "Transaction WFS : ECHEC ${response}",
    'googleWarning': "La couche Google n\'a pas �t� en mesure de se charger correctement.\x3cbr\x3e\x3cbr\x3ePour supprimer ce message, choisissez une nouvelle BaseLayer dans le s�lecteur de couche en haut � droite.\x3cbr\x3e\x3cbr\x3eCela est possiblement caus� par la non-inclusion de la librairie Google Maps, ou alors parce que la cl� de l\'API ne correspond pas � votre site.\x3cbr\x3e\x3cbr\x3eD�veloppeurs : pour savoir comment corriger ceci, \x3ca href=\'http://trac.openlayers.org/wiki/Google\' target=\'_blank\'\x3ecliquez ici\x3c/a\x3e",
    'getLayerWarning': "La couche ${layerType} n\'est pas en mesure de se charger correctement.\x3cbr\x3e\x3cbr\x3ePour supprimer ce message, choisissez une nouvelle BaseLayer dans le s�lecteur de couche en haut � droite.\x3cbr\x3e\x3cbr\x3eCela est possiblement caus� par la non-inclusion de la librairie ${layerLib}.\x3cbr\x3e\x3cbr\x3eD�veloppeurs : pour savoir comment corriger ceci, \x3ca href=\'http://trac.openlayers.org/wiki/${layerLib}\' target=\'_blank\'\x3ecliquez ici\x3c/a\x3e",
    'Scale = 1 : ${scaleDenom}': "Echelle ~ 1 : ${scaleDenom}",
    'W': "O",
    'E': "E",
    'N': "N",
    'S': "S",
    'reprojectDeprecated': "Vous utilisez l\'option \'reproject\' sur la couche ${layerName}. Cette option est d�pr�ci�e : Son usage permettait d\'afficher des donn�es au dessus de couches raster commerciales.Cette fonctionalit� est maintenant support�e en utilisant le support de la projection Mercator Sph�rique. Plus d\'information est disponible sur http://trac.openlayers.org/wiki/SphericalMercator.",
    'methodDeprecated': "Cette m�thode est d�pr�ci�e, et sera supprim�e � la version 3.0. Merci d\'utiliser ${newMethod} � la place.",
    'proxyNeeded': "Vous avez tr�s probablement besoin de renseigner OpenLayers.ProxyHost pour acc�der � ${url}. Voir http://trac.osgeo.org/openlayers/wiki/FrequentlyAskedQuestions#ProxyHost"
});
OpenLayers.Util.initialCookies = document.cookie;
OpenLayers.Util.writeCookie = function (nom, valeur, expire) {
    if (typeof expire == 'undefined')
        expire = false;
    if (expire == true)
        expire = new Date();
    document.cookie = 'Ol' + escape(nom) + '=' + escape(valeur) + ';path=/' + (expire ? ';expires=' + new Date(new Date().getTime() + expire * 1000).toGMTString() : '');
}
OpenLayers.Util.readCookie = function (nom, defaut) {
    var nom = 'Ol' + escape(nom);
    var deb = OpenLayers.Util.initialCookies.indexOf(nom + '=');
    if (deb >= 0) {
        deb += nom.length + 1;
        var fin = OpenLayers.Util.initialCookies.indexOf(';', deb);
        if (fin < 0) fin = OpenLayers.Util.initialCookies.length;
        return unescape(OpenLayers.Util.initialCookies.substring(deb, fin));
    }
    return typeof defaut == 'undefined' ? null : defaut;
}
OpenLayers.MapListened = OpenLayers.Class(OpenLayers.Map, {
    addLayersListened: function (layers) {
        this.addLayers(layers);
        var actionEcouteur = [new OpenLayers.Control.SelectFeature(layers, {
                hover: true,
                highlightOnly: true,
                eventListeners: {
                    featurehighlighted: function (e) {
                        if (e.feature.attributes.url)
                            e.feature.layer.map.div.style.cursor = 'pointer';
                    },
                    featureunhighlighted: function (e) {
                        e.feature.layer.map.div.style.cursor = 'default';
                    }
                }
            }), new OpenLayers.Control.SelectFeature(layers, {
                clickout: true,
                onSelect: function (e) {
                    if (e.attributes.url)
                        document.location.href = e.attributes.url;
                }
            })];
        for (i in layers)
            if (typeof layers[i].onDrag == 'function') {
                actionEcouteur.push(new OpenLayers.Control.DragFeature(layers[i], {
                    onDrag: function (feature) {
                        feature.layer.onDrag();
                    }
                }));
            }
        for (i in actionEcouteur) this.addControl(actionEcouteur[i]);
        for (i in actionEcouteur) actionEcouteur[i].activate();
    },
    CLASS_NAME: "OpenLayers.MapListened"
});
OpenLayers.Control.ArgParserCookies = OpenLayers.Class(OpenLayers.Control.ArgParser, {
    scale: null,
    baseLayer: null,
    setMap: function (map) {
        OpenLayers.Control.ArgParser.prototype.setMap.apply(this, arguments);
        var params = this.getParameters();
        if (params.baseLayer)
            this.map.events.register('addlayer', this, this.setBaselayer);
    },
    setBaselayer: function (e) {
        var params = this.getParameters();
        if (e.layer.name == params.baseLayer) {
            this.map.setBaseLayer(e.layer);
            this.map.events.unregister('addlayer', this, this.setBaselayer);
        }
        if (this.map.baseLayer && params.scale) {
            var resolution = OpenLayers.Util.getResolutionFromScale(params.scale, this.map.baseLayer.units);
            this.map.zoomTo(this.map.getZoomForResolution(resolution, true));
        }
    },
    getParameters: function (url) {
        var params = this.map.defaut || {};
        var cookies = OpenLayers.Util.getParameters('?' + OpenLayers.Util.readCookie('params'));
        if (cookies)
            OpenLayers.Util.extend(params, cookies);
        if (this.map.params)
            OpenLayers.Util.extend(params, this.map.params);
        url = url || window.location.href;
        OpenLayers.Util.extend(params, OpenLayers.Util.getParameters(url));
        url = '?' + OpenLayers.Util.getParameterString(params);
        return OpenLayers.Control.ArgParser.prototype.getParameters.call(this, url);
    },
    configureLayers: function () {
        var params = this.getParameters();
        if (params.baseLayer && (params.layers == '.' || this.layers.length == this.map.layers.length)) {
            var newLayers = '';
            for (var i = 0, len = this.map.layers.length; i < len; i++)
                if (!this.map.layers[i].isBaseLayer)
                    newLayers += this.layers.charAt(i);
                else if (this.map.layers[i].name == params.baseLayer)
                newLayers += 'B';
            else
                newLayers += 'O';
            this.layers = newLayers;
        }
        OpenLayers.Control.ArgParser.prototype.configureLayers.call(this, params);
        if (this.map.baseLayer && params.scale) {
            var resolution = OpenLayers.Util.getResolutionFromScale(params.scale, this.map.baseLayer.units);
            this.map.zoomTo(this.map.getZoomForResolution(resolution, true));
        }
    },
    CLASS_NAME: "OpenLayers.Control.ArgParserCookies"
});
OpenLayers.Control.PermalinkCookies = OpenLayers.Class(OpenLayers.Control.Permalink, {
    argParserClass: OpenLayers.Control.ArgParserCookies,
    createParams: function (center, zoom, layers) {
        var params = OpenLayers.Control.Permalink.prototype.createParams.apply(this, arguments);
        if (this.map.baseLayer) {
            params.scale = Math.round(OpenLayers.Util.getScaleFromResolution(this.map.baseLayer.resolutions[this.map.zoom], this.map.baseLayer.units));
            params.baseLayer = this.map.baseLayer.name;
        }
        OpenLayers.Util.writeCookie('params', OpenLayers.Util.getParameterString(params));
        return params;
    },
    CLASS_NAME: "OpenLayers.Control.PermalinkCookies"
});
OpenLayers.Control.LayerSwitcherConditional = OpenLayers.Class(OpenLayers.Control.LayerSwitcher, {
    setMap: function (map) {
        OpenLayers.Control.LayerSwitcher.prototype.setMap.apply(this, arguments);
        this.map.events.on({
            addlayer: this.greySwitcher,
            moveend: this.greySwitcher,
            scope: this
        });
    },
    greySwitcher: function () {
        this.div.className = 'olControlLayerSwitcher olControlNoSelect';
        var mapext = this.map.getExtent();
        if (!mapext) return;
        var refprj = new OpenLayers.Projection('EPSG:4326');
        var mapprj = this.map.getProjectionObject();
        mapext = mapext.transform(mapprj, refprj);
        for (var i = 0, len = this.baseLayers.length; i < len; i++) {
            var layerEntry = this.baseLayers[i];
            var inRange = layerEntry.layer.calculateInRange();
            var layprj = layerEntry.layer.projection;
            var layext = layerEntry.layer.maxExtent.clone();
            layext = layext.transform(layprj, refprj);
            var contains = layext.containsBounds(mapext);
            if ((contains && inRange) || layerEntry.layer == this.map.baseLayer) {
                layerEntry.inputElem.disabled = false;
                layerEntry.labelSpan.style.color = layerEntry.inputElem.title = layerEntry.labelSpan.title = '';
            } else {
                layerEntry.inputElem.disabled = true;
                layerEntry.labelSpan.style.color = 'gray';
                layerEntry.inputElem.title = layerEntry.labelSpan.title = 'Couche non disponible ' + (contains ? '� cette �chelle' : 'sur cette zone');
            }
        }
    },
    CLASS_NAME: "OpenLayers.Control.LayerSwitcherConditional"
});
var Proj4js = {
    defaultDatum: 'WGS84',
    transform: function (source, dest, point) {
        if (!source.readyToUse) {
            this.reportError("Proj4js initialization for:" + source.srsCode + " not yet complete");
            return point;
        }
        if (!dest.readyToUse) {
            this.reportError("Proj4js initialization for:" + dest.srsCode + " not yet complete");
            return point;
        }
        if (source.datum && dest.datum && (((source.datum.datum_type == Proj4js.common.PJD_3PARAM || source.datum.datum_type == Proj4js.common.PJD_7PARAM) && dest.datumCode != "WGS84") || ((dest.datum.datum_type == Proj4js.common.PJD_3PARAM || dest.datum.datum_type == Proj4js.common.PJD_7PARAM) && source.datumCode != "WGS84"))) {
            var wgs84 = Proj4js.WGS84;
            this.transform(source, wgs84, point);
            source = wgs84;
        }
        if (source.axis != "enu") {
            this.adjust_axis(source, false, point);
        }
        if (source.projName == "longlat") {
            point.x *= Proj4js.common.D2R;
            point.y *= Proj4js.common.D2R;
        } else {
            if (source.to_meter) {
                point.x *= source.to_meter;
                point.y *= source.to_meter;
            }
            source.inverse(point);
        }
        if (source.from_greenwich) {
            point.x += source.from_greenwich;
        }
        point = this.datum_transform(source.datum, dest.datum, point);
        if (dest.from_greenwich) {
            point.x -= dest.from_greenwich;
        }
        if (dest.projName == "longlat") {
            point.x *= Proj4js.common.R2D;
            point.y *= Proj4js.common.R2D;
        } else {
            dest.forward(point);
            if (dest.to_meter) {
                point.x /= dest.to_meter;
                point.y /= dest.to_meter;
            }
        }
        if (dest.axis != "enu") {
            this.adjust_axis(dest, true, point);
        }
        return point;
    },
    datum_transform: function (source, dest, point) {
        if (source.compare_datums(dest)) {
            return point;
        }
        if (source.datum_type == Proj4js.common.PJD_NODATUM || dest.datum_type == Proj4js.common.PJD_NODATUM) {
            return point;
        }
        if (source.es != dest.es || source.a != dest.a || source.datum_type == Proj4js.common.PJD_3PARAM || source.datum_type == Proj4js.common.PJD_7PARAM || dest.datum_type == Proj4js.common.PJD_3PARAM || dest.datum_type == Proj4js.common.PJD_7PARAM) {
            source.geodetic_to_geocentric(point);
            if (source.datum_type == Proj4js.common.PJD_3PARAM || source.datum_type == Proj4js.common.PJD_7PARAM) {
                source.geocentric_to_wgs84(point);
            }
            if (dest.datum_type == Proj4js.common.PJD_3PARAM || dest.datum_type == Proj4js.common.PJD_7PARAM) {
                dest.geocentric_from_wgs84(point);
            }
            dest.geocentric_to_geodetic(point);
        }
        return point;
    },
    adjust_axis: function (crs, denorm, point) {
        var xin = point.x,
            yin = point.y,
            zin = point.z || 0.0;
        var v, t;
        for (var i = 0; i < 3; i++) {
            if (denorm && i == 2 && point.z === undefined) {
                continue;
            }
            if (i == 0) {
                v = xin;
                t = 'x';
            } else if (i == 1) {
                v = yin;
                t = 'y';
            } else {
                v = zin;
                t = 'z';
            }
            switch (crs.axis[i]) {
            case 'e':
                point[t] = v;
                break;
            case 'w':
                point[t] = -v;
                break;
            case 'n':
                point[t] = v;
                break;
            case 's':
                point[t] = -v;
                break;
            case 'u':
                if (point[t] !== undefined) {
                    point.z = v;
                }
                break;
            case 'd':
                if (point[t] !== undefined) {
                    point.z = -v;
                }
                break;
            default:
                alert("ERROR: unknow axis (" + crs.axis[i] + ") - check definition of " + crs.projName);
                return null;
            }
        }
        return point;
    },
    reportError: function (msg) {},
    extend: function (destination, source) {
        destination = destination || {};
        if (source) {
            for (var property in source) {
                var value = source[property];
                if (value !== undefined) {
                    destination[property] = value;
                }
            }
        }
        return destination;
    },
    Class: function () {
        var Class = function () {
            this.initialize.apply(this, arguments);
        };
        var extended = {};
        var parent;
        for (var i = 0; i < arguments.length; ++i) {
            if (typeof arguments[i] == "function") {
                parent = arguments[i].prototype;
            } else {
                parent = arguments[i];
            }
            Proj4js.extend(extended, parent);
        }
        Class.prototype = extended;
        return Class;
    },
    bind: function (func, object) {
        var args = Array.prototype.slice.apply(arguments, [2]);
        return function () {
            var newArgs = args.concat(Array.prototype.slice.apply(arguments, [0]));
            return func.apply(object, newArgs);
        };
    },
    scriptName: "proj4js-combined.js",
    defsLookupService: 'http://spatialreference.org/ref',
    libPath: null,
    getScriptLocation: function () {
        if (this.libPath) return this.libPath;
        var scriptName = this.scriptName;
        var scriptNameLen = scriptName.length;
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].getAttribute('src');
            if (src) {
                var index = src.lastIndexOf(scriptName);
                if ((index > -1) && (index + scriptNameLen == src.length)) {
                    this.libPath = src.slice(0, -scriptNameLen);
                    break;
                }
            }
        }
        return this.libPath || "";
    },
    loadScript: function (url, onload, onfail, loadCheck) {
        var script = document.createElement('script');
        script.defer = false;
        script.type = "text/javascript";
        script.id = url;
        script.src = url;
        script.onload = onload;
        script.onerror = onfail;
        script.loadCheck = loadCheck;
        if (/MSIE/.test(navigator.userAgent)) {
            script.onreadystatechange = this.checkReadyState;
        }
        document.getElementsByTagName('head')[0].appendChild(script);
    },
    checkReadyState: function () {
        if (this.readyState == 'loaded') {
            if (!this.loadCheck()) {
                this.onerror();
            } else {
                this.onload();
            }
        }
    }
};
Proj4js.Proj = Proj4js.Class({
    readyToUse: false,
    title: null,
    projName: null,
    units: null,
    datum: null,
    x0: 0,
    y0: 0,
    localCS: false,
    queue: null,
    initialize: function (srsCode, callback) {
        this.srsCodeInput = srsCode;
        this.queue = [];
        if (callback) {
            this.queue.push(callback);
        }
        if ((srsCode.indexOf('GEOGCS') >= 0) || (srsCode.indexOf('GEOCCS') >= 0) || (srsCode.indexOf('PROJCS') >= 0) || (srsCode.indexOf('LOCAL_CS') >= 0)) {
            this.parseWKT(srsCode);
            this.deriveConstants();
            this.loadProjCode(this.projName);
            return;
        }
        if (srsCode.indexOf('urn:') == 0) {
            var urn = srsCode.split(':');
            if ((urn[1] == 'ogc' || urn[1] == 'x-ogc') && (urn[2] == 'def') && (urn[3] == 'crs')) {
                srsCode = urn[4] + ':' + urn[urn.length - 1];
            }
        } else if (srsCode.indexOf('http://') == 0) {
            var url = srsCode.split('#');
            if (url[0].match(/epsg.org/)) {
                srsCode = 'EPSG:' + url[1];
            } else if (url[0].match(/RIG.xml/)) {
                srsCode = 'IGNF:' + url[1];
            }
        }
        this.srsCode = srsCode.toUpperCase();
        if (this.srsCode.indexOf("EPSG") == 0) {
            this.srsCode = this.srsCode;
            this.srsAuth = 'epsg';
            this.srsProjNumber = this.srsCode.substring(5);
        } else if (this.srsCode.indexOf("IGNF") == 0) {
            this.srsCode = this.srsCode;
            this.srsAuth = 'IGNF';
            this.srsProjNumber = this.srsCode.substring(5);
        } else if (this.srsCode.indexOf("CRS") == 0) {
            this.srsCode = this.srsCode;
            this.srsAuth = 'CRS';
            this.srsProjNumber = this.srsCode.substring(4);
        } else {
            this.srsAuth = '';
            this.srsProjNumber = this.srsCode;
        }
        this.loadProjDefinition();
    },
    loadProjDefinition: function () {
        if (Proj4js.defs[this.srsCode]) {
            this.defsLoaded();
            return;
        }
        var url = Proj4js.getScriptLocation() + 'defs/' + this.srsAuth.toUpperCase() + this.srsProjNumber + '.js';
        Proj4js.loadScript(url, Proj4js.bind(this.defsLoaded, this), Proj4js.bind(this.loadFromService, this), Proj4js.bind(this.checkDefsLoaded, this));
    },
    loadFromService: function () {
        var url = Proj4js.defsLookupService + '/' + this.srsAuth + '/' + this.srsProjNumber + '/proj4js/';
        Proj4js.loadScript(url, Proj4js.bind(this.defsLoaded, this), Proj4js.bind(this.defsFailed, this), Proj4js.bind(this.checkDefsLoaded, this));
    },
    defsLoaded: function () {
        this.parseDefs();
        this.loadProjCode(this.projName);
    },
    checkDefsLoaded: function () {
        if (Proj4js.defs[this.srsCode]) {
            return true;
        } else {
            return false;
        }
    },
    defsFailed: function () {
        Proj4js.reportError('failed to load projection definition for: ' + this.srsCode);
        Proj4js.defs[this.srsCode] = Proj4js.defs['WGS84'];
        this.defsLoaded();
    },
    loadProjCode: function (projName) {
        if (Proj4js.Proj[projName]) {
            this.initTransforms();
            return;
        }
        var url = Proj4js.getScriptLocation() + 'projCode/' + projName + '.js';
        Proj4js.loadScript(url, Proj4js.bind(this.loadProjCodeSuccess, this, projName), Proj4js.bind(this.loadProjCodeFailure, this, projName), Proj4js.bind(this.checkCodeLoaded, this, projName));
    },
    loadProjCodeSuccess: function (projName) {
        if (Proj4js.Proj[projName].dependsOn) {
            this.loadProjCode(Proj4js.Proj[projName].dependsOn);
        } else {
            this.initTransforms();
        }
    },
    loadProjCodeFailure: function (projName) {
        Proj4js.reportError("failed to find projection file for: " + projName);
    },
    checkCodeLoaded: function (projName) {
        if (Proj4js.Proj[projName]) {
            return true;
        } else {
            return false;
        }
    },
    initTransforms: function () {
        Proj4js.extend(this, Proj4js.Proj[this.projName]);
        this.init();
        this.readyToUse = true;
        if (this.queue) {
            var item;
            while ((item = this.queue.shift())) {
                item.call(this, this);
            }
        }
    },
    wktRE: /^(\w+)\[(.*)\]$/,
    parseWKT: function (wkt) {
        var wktMatch = wkt.match(this.wktRE);
        if (!wktMatch) return;
        var wktObject = wktMatch[1];
        var wktContent = wktMatch[2];
        var wktTemp = wktContent.split(",");
        var wktName;
        if (wktObject.toUpperCase() == "TOWGS84") {
            wktName = wktObject;
        } else {
            wktName = wktTemp.shift();
        }
        wktName = wktName.replace(/^\"/, "");
        wktName = wktName.replace(/\"$/, "");
        var wktArray = new Array();
        var bkCount = 0;
        var obj = "";
        for (var i = 0; i < wktTemp.length; ++i) {
            var token = wktTemp[i];
            for (var j = 0; j < token.length; ++j) {
                if (token.charAt(j) == "[")++bkCount;
                if (token.charAt(j) == "]")--bkCount;
            }
            obj += token;
            if (bkCount === 0) {
                wktArray.push(obj);
                obj = "";
            } else {
                obj += ",";
            }
        }
        switch (wktObject) {
        case 'LOCAL_CS':
            this.projName = 'identity'
            this.localCS = true;
            this.srsCode = wktName;
            break;
        case 'GEOGCS':
            this.projName = 'longlat'
            this.geocsCode = wktName;
            if (!this.srsCode) this.srsCode = wktName;
            break;
        case 'PROJCS':
            this.srsCode = wktName;
            break;
        case 'GEOCCS':
            break;
        case 'PROJECTION':
            this.projName = Proj4js.wktProjections[wktName]
            break;
        case 'DATUM':
            this.datumName = wktName;
            break;
        case 'LOCAL_DATUM':
            this.datumCode = 'none';
            break;
        case 'SPHEROID':
            this.ellps = wktName;
            this.a = parseFloat(wktArray.shift());
            this.rf = parseFloat(wktArray.shift());
            break;
        case 'PRIMEM':
            this.from_greenwich = parseFloat(wktArray.shift());
            break;
        case 'UNIT':
            this.units = wktName;
            this.unitsPerMeter = parseFloat(wktArray.shift());
            break;
        case 'PARAMETER':
            var name = wktName.toLowerCase();
            var value = parseFloat(wktArray.shift());
            switch (name) {
            case 'false_easting':
                this.x0 = value;
                break;
            case 'false_northing':
                this.y0 = value;
                break;
            case 'scale_factor':
                this.k0 = value;
                break;
            case 'central_meridian':
                this.long0 = value * Proj4js.common.D2R;
                break;
            case 'latitude_of_origin':
                this.lat0 = value * Proj4js.common.D2R;
                break;
            case 'more_here':
                break;
            default:
                break;
            }
            break;
        case 'TOWGS84':
            this.datum_params = wktArray;
            break;
        case 'AXIS':
            var name = wktName.toLowerCase();
            var value = wktArray.shift();
            switch (value) {
            case 'EAST':
                value = 'e';
                break;
            case 'WEST':
                value = 'w';
                break;
            case 'NORTH':
                value = 'n';
                break;
            case 'SOUTH':
                value = 's';
                break;
            case 'UP':
                value = 'u';
                break;
            case 'DOWN':
                value = 'd';
                break;
            case 'OTHER':
            default:
                value = ' ';
                break;
            }
            if (!this.axis) {
                this.axis = "enu";
            }
            switch (name) {
            case 'x':
                this.axis = value + this.axis.substr(1, 2);
                break;
            case 'y':
                this.axis = this.axis.substr(0, 1) + value + this.axis.substr(2, 1);
                break;
            case 'z':
                this.axis = this.axis.substr(0, 2) + value;
                break;
            default:
                break;
            }
        case 'MORE_HERE':
            break;
        default:
            break;
        }
        for (var i = 0; i < wktArray.length; ++i) {
            this.parseWKT(wktArray[i]);
        }
    },
    parseDefs: function () {
        this.defData = Proj4js.defs[this.srsCode];
        var paramName, paramVal;
        if (!this.defData) {
            return;
        }
        var paramArray = this.defData.split("+");
        for (var prop = 0; prop < paramArray.length; prop++) {
            var property = paramArray[prop].split("=");
            paramName = property[0].toLowerCase();
            paramVal = property[1];
            switch (paramName.replace(/\s/gi, "")) {
            case "":
                break;
            case "title":
                this.title = paramVal;
                break;
            case "proj":
                this.projName = paramVal.replace(/\s/gi, "");
                break;
            case "units":
                this.units = paramVal.replace(/\s/gi, "");
                break;
            case "datum":
                this.datumCode = paramVal.replace(/\s/gi, "");
                break;
            case "nadgrids":
                this.nagrids = paramVal.replace(/\s/gi, "");
                break;
            case "ellps":
                this.ellps = paramVal.replace(/\s/gi, "");
                break;
            case "a":
                this.a = parseFloat(paramVal);
                break;
            case "b":
                this.b = parseFloat(paramVal);
                break;
            case "rf":
                this.rf = parseFloat(paramVal);
                break;
            case "lat_0":
                this.lat0 = paramVal * Proj4js.common.D2R;
                break;
            case "lat_1":
                this.lat1 = paramVal * Proj4js.common.D2R;
                break;
            case "lat_2":
                this.lat2 = paramVal * Proj4js.common.D2R;
                break;
            case "lat_ts":
                this.lat_ts = paramVal * Proj4js.common.D2R;
                break;
            case "lon_0":
                this.long0 = paramVal * Proj4js.common.D2R;
                break;
            case "alpha":
                this.alpha = parseFloat(paramVal) * Proj4js.common.D2R;
                break;
            case "lonc":
                this.longc = paramVal * Proj4js.common.D2R;
                break;
            case "x_0":
                this.x0 = parseFloat(paramVal);
                break;
            case "y_0":
                this.y0 = parseFloat(paramVal);
                break;
            case "k_0":
                this.k0 = parseFloat(paramVal);
                break;
            case "k":
                this.k0 = parseFloat(paramVal);
                break;
            case "r_a":
                this.R_A = true;
                break;
            case "zone":
                this.zone = parseInt(paramVal, 10);
                break;
            case "south":
                this.utmSouth = true;
                break;
            case "towgs84":
                this.datum_params = paramVal.split(",");
                break;
            case "to_meter":
                this.to_meter = parseFloat(paramVal);
                break;
            case "from_greenwich":
                this.from_greenwich = paramVal * Proj4js.common.D2R;
                break;
            case "pm":
                paramVal = paramVal.replace(/\s/gi, "");
                this.from_greenwich = Proj4js.PrimeMeridian[paramVal] ? Proj4js.PrimeMeridian[paramVal] : parseFloat(paramVal);
                this.from_greenwich *= Proj4js.common.D2R;
                break;
            case "axis":
                paramVal = paramVal.replace(/\s/gi, "");
                var legalAxis = "ewnsud";
                if (paramVal.length == 3 && legalAxis.indexOf(paramVal.substr(0, 1)) != -1 && legalAxis.indexOf(paramVal.substr(1, 1)) != -1 && legalAxis.indexOf(paramVal.substr(2, 1)) != -1) {
                    this.axis = paramVal;
                }
                break
            case "no_defs":
                break;
            default:
            }
        }
        this.deriveConstants();
    },
    deriveConstants: function () {
        if (this.nagrids == '@null') this.datumCode = 'none';
        if (this.datumCode && this.datumCode != 'none') {
            var datumDef = Proj4js.Datum[this.datumCode];
            if (datumDef) {
                this.datum_params = datumDef.towgs84 ? datumDef.towgs84.split(',') : null;
                this.ellps = datumDef.ellipse;
                this.datumName = datumDef.datumName ? datumDef.datumName : this.datumCode;
            }
        }
        if (!this.a) {
            var ellipse = Proj4js.Ellipsoid[this.ellps] ? Proj4js.Ellipsoid[this.ellps] : Proj4js.Ellipsoid['WGS84'];
            Proj4js.extend(this, ellipse);
        }
        if (this.rf && !this.b) this.b = (1.0 - 1.0 / this.rf) * this.a;
        if (this.rf === 0 || Math.abs(this.a - this.b) < Proj4js.common.EPSLN) {
            this.sphere = true;
            this.b = this.a;
        }
        this.a2 = this.a * this.a;
        this.b2 = this.b * this.b;
        this.es = (this.a2 - this.b2) / this.a2;
        this.e = Math.sqrt(this.es);
        if (this.R_A) {
            this.a *= 1. - this.es * (Proj4js.common.SIXTH + this.es * (Proj4js.common.RA4 + this.es * Proj4js.common.RA6));
            this.a2 = this.a * this.a;
            this.b2 = this.b * this.b;
            this.es = 0.;
        }
        this.ep2 = (this.a2 - this.b2) / this.b2;
        if (!this.k0) this.k0 = 1.0;
        if (!this.axis) {
            this.axis = "enu";
        }
        this.datum = new Proj4js.datum(this);
    }
});
Proj4js.Proj.longlat = {
    init: function () {},
    forward: function (pt) {
        return pt;
    },
    inverse: function (pt) {
        return pt;
    }
};
Proj4js.Proj.identity = Proj4js.Proj.longlat;
Proj4js.defs = {
    'WGS84': "+title=long/lat:WGS84 +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees",
    'EPSG:4326': "+title=long/lat:WGS84 +proj=longlat +a=6378137.0 +b=6356752.31424518 +ellps=WGS84 +datum=WGS84 +units=degrees",
    'EPSG:4269': "+title=long/lat:NAD83 +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees",
    'EPSG:3875': "+title= Google Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs"
};
Proj4js.defs['EPSG:3785'] = Proj4js.defs['EPSG:3875'];
Proj4js.defs['GOOGLE'] = Proj4js.defs['EPSG:3875'];
Proj4js.defs['EPSG:900913'] = Proj4js.defs['EPSG:3875'];
Proj4js.defs['EPSG:102113'] = Proj4js.defs['EPSG:3875'];
Proj4js.common = {
    PI: 3.141592653589793238,
    HALF_PI: 1.570796326794896619,
    TWO_PI: 6.283185307179586477,
    FORTPI: 0.78539816339744833,
    R2D: 57.29577951308232088,
    D2R: 0.01745329251994329577,
    SEC_TO_RAD: 4.84813681109535993589914102357e-6,
    EPSLN: 1.0e-10,
    MAX_ITER: 20,
    COS_67P5: 0.38268343236508977,
    AD_C: 1.0026000,
    PJD_UNKNOWN: 0,
    PJD_3PARAM: 1,
    PJD_7PARAM: 2,
    PJD_GRIDSHIFT: 3,
    PJD_WGS84: 4,
    PJD_NODATUM: 5,
    SRS_WGS84_SEMIMAJOR: 6378137.0,
    SIXTH: .1666666666666666667,
    RA4: .04722222222222222222,
    RA6: .02215608465608465608,
    RV4: .06944444444444444444,
    RV6: .04243827160493827160,
    msfnz: function (eccent, sinphi, cosphi) {
        var con = eccent * sinphi;
        return cosphi / (Math.sqrt(1.0 - con * con));
    },
    tsfnz: function (eccent, phi, sinphi) {
        var con = eccent * sinphi;
        var com = .5 * eccent;
        con = Math.pow(((1.0 - con) / (1.0 + con)), com);
        return (Math.tan(.5 * (this.HALF_PI - phi)) / con);
    },
    phi2z: function (eccent, ts) {
        var eccnth = .5 * eccent;
        var con, dphi;
        var phi = this.HALF_PI - 2 * Math.atan(ts);
        for (var i = 0; i <= 15; i++) {
            con = eccent * Math.sin(phi);
            dphi = this.HALF_PI - 2 * Math.atan(ts * (Math.pow(((1.0 - con) / (1.0 + con)), eccnth))) - phi;
            phi += dphi;
            if (Math.abs(dphi) <= .0000000001) return phi;
        }
        alert("phi2z has NoConvergence");
        return (-9999);
    },
    qsfnz: function (eccent, sinphi) {
        var con;
        if (eccent > 1.0e-7) {
            con = eccent * sinphi;
            return ((1.0 - eccent * eccent) * (sinphi / (1.0 - con * con) - (.5 / eccent) * Math.log((1.0 - con) / (1.0 + con))));
        } else {
            return (2.0 * sinphi);
        }
    },
    asinz: function (x) {
        if (Math.abs(x) > 1.0) {
            x = (x > 1.0) ? 1.0 : -1.0;
        }
        return Math.asin(x);
    },
    e0fn: function (x) {
        return (1.0 - 0.25 * x * (1.0 + x / 16.0 * (3.0 + 1.25 * x)));
    },
    e1fn: function (x) {
        return (0.375 * x * (1.0 + 0.25 * x * (1.0 + 0.46875 * x)));
    },
    e2fn: function (x) {
        return (0.05859375 * x * x * (1.0 + 0.75 * x));
    },
    e3fn: function (x) {
        return (x * x * x * (35.0 / 3072.0));
    },
    mlfn: function (e0, e1, e2, e3, phi) {
        return (e0 * phi - e1 * Math.sin(2.0 * phi) + e2 * Math.sin(4.0 * phi) - e3 * Math.sin(6.0 * phi));
    },
    srat: function (esinp, exp) {
        return (Math.pow((1.0 - esinp) / (1.0 + esinp), exp));
    },
    sign: function (x) {
        if (x < 0.0) return (-1);
        else return (1);
    },
    adjust_lon: function (x) {
        x = (Math.abs(x) < this.PI) ? x : (x - (this.sign(x) * this.TWO_PI));
        return x;
    },
    adjust_lat: function (x) {
        x = (Math.abs(x) < this.HALF_PI) ? x : (x - (this.sign(x) * this.PI));
        return x;
    },
    latiso: function (eccent, phi, sinphi) {
        if (Math.abs(phi) > this.HALF_PI) return +Number.NaN;
        if (phi == this.HALF_PI) return Number.POSITIVE_INFINITY;
        if (phi == -1.0 * this.HALF_PI) return -1.0 * Number.POSITIVE_INFINITY;
        var con = eccent * sinphi;
        return Math.log(Math.tan((this.HALF_PI + phi) / 2.0)) + eccent * Math.log((1.0 - con) / (1.0 + con)) / 2.0;
    },
    fL: function (x, L) {
        return 2.0 * Math.atan(x * Math.exp(L)) - this.HALF_PI;
    },
    invlatiso: function (eccent, ts) {
        var phi = this.fL(1.0, ts);
        var Iphi = 0.0;
        var con = 0.0;
        do {
            Iphi = phi;
            con = eccent * Math.sin(Iphi);
            phi = this.fL(Math.exp(eccent * Math.log((1.0 + con) / (1.0 - con)) / 2.0), ts)
        } while (Math.abs(phi - Iphi) > 1.0e-12);
        return phi;
    },
    sinh: function (x) {
        var r = Math.exp(x);
        r = (r - 1.0 / r) / 2.0;
        return r;
    },
    cosh: function (x) {
        var r = Math.exp(x);
        r = (r + 1.0 / r) / 2.0;
        return r;
    },
    tanh: function (x) {
        var r = Math.exp(x);
        r = (r - 1.0 / r) / (r + 1.0 / r);
        return r;
    },
    asinh: function (x) {
        var s = (x >= 0 ? 1.0 : -1.0);
        return s * (Math.log(Math.abs(x) + Math.sqrt(x * x + 1.0)));
    },
    acosh: function (x) {
        return 2.0 * Math.log(Math.sqrt((x + 1.0) / 2.0) + Math.sqrt((x - 1.0) / 2.0));
    },
    atanh: function (x) {
        return Math.log((x - 1.0) / (x + 1.0)) / 2.0;
    },
    gN: function (a, e, sinphi) {
        var temp = e * sinphi;
        return a / Math.sqrt(1.0 - temp * temp);
    },
    pj_enfn: function (es) {
        var en = new Array();
        en[0] = this.C00 - es * (this.C02 + es * (this.C04 + es * (this.C06 + es * this.C08)));
        en[1] = es * (this.C22 - es * (this.C04 + es * (this.C06 + es * this.C08)));
        var t = es * es;
        en[2] = t * (this.C44 - es * (this.C46 + es * this.C48));
        t *= es;
        en[3] = t * (this.C66 - es * this.C68);
        en[4] = t * es * this.C88;
        return en;
    },
    pj_mlfn: function (phi, sphi, cphi, en) {
        cphi *= sphi;
        sphi *= sphi;
        return (en[0] * phi - cphi * (en[1] + sphi * (en[2] + sphi * (en[3] + sphi * en[4]))));
    },
    pj_inv_mlfn: function (arg, es, en) {
        var k = 1. / (1. - es);
        var phi = arg;
        for (var i = Proj4js.common.MAX_ITER; i; --i) {
            var s = Math.sin(phi);
            var t = 1. - es * s * s;
            t = (this.pj_mlfn(phi, s, Math.cos(phi), en) - arg) * (t * Math.sqrt(t)) * k;
            phi -= t;
            if (Math.abs(t) < Proj4js.common.EPSLN)
                return phi;
        }
        Proj4js.reportError("cass:pj_inv_mlfn: Convergence error");
        return phi;
    },
    C00: 1.0,
    C02: .25,
    C04: .046875,
    C06: .01953125,
    C08: .01068115234375,
    C22: .75,
    C44: .46875,
    C46: .01302083333333333333,
    C48: .00712076822916666666,
    C66: .36458333333333333333,
    C68: .00569661458333333333,
    C88: .3076171875
};
Proj4js.datum = Proj4js.Class({
    initialize: function (proj) {
        this.datum_type = Proj4js.common.PJD_WGS84;
        if (proj.datumCode && proj.datumCode == 'none') {
            this.datum_type = Proj4js.common.PJD_NODATUM;
        }
        if (proj && proj.datum_params) {
            for (var i = 0; i < proj.datum_params.length; i++) {
                proj.datum_params[i] = parseFloat(proj.datum_params[i]);
            }
            if (proj.datum_params[0] != 0 || proj.datum_params[1] != 0 || proj.datum_params[2] != 0) {
                this.datum_type = Proj4js.common.PJD_3PARAM;
            }
            if (proj.datum_params.length > 3) {
                if (proj.datum_params[3] != 0 || proj.datum_params[4] != 0 || proj.datum_params[5] != 0 || proj.datum_params[6] != 0) {
                    this.datum_type = Proj4js.common.PJD_7PARAM;
                    proj.datum_params[3] *= Proj4js.common.SEC_TO_RAD;
                    proj.datum_params[4] *= Proj4js.common.SEC_TO_RAD;
                    proj.datum_params[5] *= Proj4js.common.SEC_TO_RAD;
                    proj.datum_params[6] = (proj.datum_params[6] / 1000000.0) + 1.0;
                }
            }
        }
        if (proj) {
            this.a = proj.a;
            this.b = proj.b;
            this.es = proj.es;
            this.ep2 = proj.ep2;
            this.datum_params = proj.datum_params;
        }
    },
    compare_datums: function (dest) {
        if (this.datum_type != dest.datum_type) {
            return false;
        } else if (this.a != dest.a || Math.abs(this.es - dest.es) > 0.000000000050) {
            return false;
        } else if (this.datum_type == Proj4js.common.PJD_3PARAM) {
            return (this.datum_params[0] == dest.datum_params[0] && this.datum_params[1] == dest.datum_params[1] && this.datum_params[2] == dest.datum_params[2]);
        } else if (this.datum_type == Proj4js.common.PJD_7PARAM) {
            return (this.datum_params[0] == dest.datum_params[0] && this.datum_params[1] == dest.datum_params[1] && this.datum_params[2] == dest.datum_params[2] && this.datum_params[3] == dest.datum_params[3] && this.datum_params[4] == dest.datum_params[4] && this.datum_params[5] == dest.datum_params[5] && this.datum_params[6] == dest.datum_params[6]);
        } else if (this.datum_type == Proj4js.common.PJD_GRIDSHIFT || dest.datum_type == Proj4js.common.PJD_GRIDSHIFT) {
            alert("ERROR: Grid shift transformations are not implemented.");
            return false
        } else {
            return true;
        }
    },
    geodetic_to_geocentric: function (p) {
        var Longitude = p.x;
        var Latitude = p.y;
        var Height = p.z ? p.z : 0;
        var X;
        var Y;
        var Z;
        var Error_Code = 0;
        var Rn;
        var Sin_Lat;
        var Sin2_Lat;
        var Cos_Lat;
        if (Latitude < -Proj4js.common.HALF_PI && Latitude > -1.001 * Proj4js.common.HALF_PI) {
            Latitude = -Proj4js.common.HALF_PI;
        } else if (Latitude > Proj4js.common.HALF_PI && Latitude < 1.001 * Proj4js.common.HALF_PI) {
            Latitude = Proj4js.common.HALF_PI;
        } else if ((Latitude < -Proj4js.common.HALF_PI) || (Latitude > Proj4js.common.HALF_PI)) {
            Proj4js.reportError('geocent:lat out of range:' + Latitude);
            return null;
        }
        if (Longitude > Proj4js.common.PI) Longitude -= (2 * Proj4js.common.PI);
        Sin_Lat = Math.sin(Latitude);
        Cos_Lat = Math.cos(Latitude);
        Sin2_Lat = Sin_Lat * Sin_Lat;
        Rn = this.a / (Math.sqrt(1.0e0 - this.es * Sin2_Lat));
        X = (Rn + Height) * Cos_Lat * Math.cos(Longitude);
        Y = (Rn + Height) * Cos_Lat * Math.sin(Longitude);
        Z = ((Rn * (1 - this.es)) + Height) * Sin_Lat;
        p.x = X;
        p.y = Y;
        p.z = Z;
        return Error_Code;
    },
    geocentric_to_geodetic: function (p) {
        var genau = 1.E-12;
        var genau2 = (genau * genau);
        var maxiter = 30;
        var P;
        var RR;
        var CT;
        var ST;
        var RX;
        var RK;
        var RN;
        var CPHI0;
        var SPHI0;
        var CPHI;
        var SPHI;
        var SDPHI;
        var At_Pole;
        var iter;
        var X = p.x;
        var Y = p.y;
        var Z = p.z ? p.z : 0.0;
        var Longitude;
        var Latitude;
        var Height;
        At_Pole = false;
        P = Math.sqrt(X * X + Y * Y);
        RR = Math.sqrt(X * X + Y * Y + Z * Z);
        if (P / this.a < genau) {
            At_Pole = true;
            Longitude = 0.0;
            if (RR / this.a < genau) {
                Latitude = Proj4js.common.HALF_PI;
                Height = -this.b;
                return;
            }
        } else {
            Longitude = Math.atan2(Y, X);
        }
        CT = Z / RR;
        ST = P / RR;
        RX = 1.0 / Math.sqrt(1.0 - this.es * (2.0 - this.es) * ST * ST);
        CPHI0 = ST * (1.0 - this.es) * RX;
        SPHI0 = CT * RX;
        iter = 0;
        do {
            iter++;
            RN = this.a / Math.sqrt(1.0 - this.es * SPHI0 * SPHI0);
            Height = P * CPHI0 + Z * SPHI0 - RN * (1.0 - this.es * SPHI0 * SPHI0);
            RK = this.es * RN / (RN + Height);
            RX = 1.0 / Math.sqrt(1.0 - RK * (2.0 - RK) * ST * ST);
            CPHI = ST * (1.0 - RK) * RX;
            SPHI = CT * RX;
            var bidon = false;
            SDPHI = SPHI * CPHI0 - CPHI * SPHI0;
            CPHI0 = CPHI;
            SPHI0 = SPHI;
        }
        while (SDPHI * SDPHI > genau2 && iter < maxiter);
        Latitude = Math.atan(SPHI / Math.abs(CPHI));
        p.x = Longitude;
        p.y = Latitude;
        p.z = Height;
        return p;
    },
    geocentric_to_geodetic_noniter: function (p) {
        var X = p.x;
        var Y = p.y;
        var Z = p.z ? p.z : 0;
        var Longitude;
        var Latitude;
        var Height;
        var W;
        var W2;
        var T0;
        var T1;
        var S0;
        var S1;
        var Sin_B0;
        var Sin3_B0;
        var Cos_B0;
        var Sin_p1;
        var Cos_p1;
        var Rn;
        var Sum;
        var At_Pole;
        X = parseFloat(X);
        Y = parseFloat(Y);
        Z = parseFloat(Z);
        At_Pole = false;
        if (X != 0.0) {
            Longitude = Math.atan2(Y, X);
        } else {
            if (Y > 0) {
                Longitude = Proj4js.common.HALF_PI;
            } else if (Y < 0) {
                Longitude = -Proj4js.common.HALF_PI;
            } else {
                At_Pole = true;
                Longitude = 0.0;
                if (Z > 0.0) {
                    Latitude = Proj4js.common.HALF_PI;
                } else if (Z < 0.0) {
                    Latitude = -Proj4js.common.HALF_PI;
                } else {
                    Latitude = Proj4js.common.HALF_PI;
                    Height = -this.b;
                    return;
                }
            }
        }
        W2 = X * X + Y * Y;
        W = Math.sqrt(W2);
        T0 = Z * Proj4js.common.AD_C;
        S0 = Math.sqrt(T0 * T0 + W2);
        Sin_B0 = T0 / S0;
        Cos_B0 = W / S0;
        Sin3_B0 = Sin_B0 * Sin_B0 * Sin_B0;
        T1 = Z + this.b * this.ep2 * Sin3_B0;
        Sum = W - this.a * this.es * Cos_B0 * Cos_B0 * Cos_B0;
        S1 = Math.sqrt(T1 * T1 + Sum * Sum);
        Sin_p1 = T1 / S1;
        Cos_p1 = Sum / S1;
        Rn = this.a / Math.sqrt(1.0 - this.es * Sin_p1 * Sin_p1);
        if (Cos_p1 >= Proj4js.common.COS_67P5) {
            Height = W / Cos_p1 - Rn;
        } else if (Cos_p1 <= -Proj4js.common.COS_67P5) {
            Height = W / -Cos_p1 - Rn;
        } else {
            Height = Z / Sin_p1 + Rn * (this.es - 1.0);
        }
        if (At_Pole == false) {
            Latitude = Math.atan(Sin_p1 / Cos_p1);
        }
        p.x = Longitude;
        p.y = Latitude;
        p.z = Height;
        return p;
    },
    geocentric_to_wgs84: function (p) {
        if (this.datum_type == Proj4js.common.PJD_3PARAM) {
            p.x += this.datum_params[0];
            p.y += this.datum_params[1];
            p.z += this.datum_params[2];
        } else if (this.datum_type == Proj4js.common.PJD_7PARAM) {
            var Dx_BF = this.datum_params[0];
            var Dy_BF = this.datum_params[1];
            var Dz_BF = this.datum_params[2];
            var Rx_BF = this.datum_params[3];
            var Ry_BF = this.datum_params[4];
            var Rz_BF = this.datum_params[5];
            var M_BF = this.datum_params[6];
            var x_out = M_BF * (p.x - Rz_BF * p.y + Ry_BF * p.z) + Dx_BF;
            var y_out = M_BF * (Rz_BF * p.x + p.y - Rx_BF * p.z) + Dy_BF;
            var z_out = M_BF * (-Ry_BF * p.x + Rx_BF * p.y + p.z) + Dz_BF;
            p.x = x_out;
            p.y = y_out;
            p.z = z_out;
        }
    },
    geocentric_from_wgs84: function (p) {
        if (this.datum_type == Proj4js.common.PJD_3PARAM) {
            p.x -= this.datum_params[0];
            p.y -= this.datum_params[1];
            p.z -= this.datum_params[2];
        } else if (this.datum_type == Proj4js.common.PJD_7PARAM) {
            var Dx_BF = this.datum_params[0];
            var Dy_BF = this.datum_params[1];
            var Dz_BF = this.datum_params[2];
            var Rx_BF = this.datum_params[3];
            var Ry_BF = this.datum_params[4];
            var Rz_BF = this.datum_params[5];
            var M_BF = this.datum_params[6];
            var x_tmp = (p.x - Dx_BF) / M_BF;
            var y_tmp = (p.y - Dy_BF) / M_BF;
            var z_tmp = (p.z - Dz_BF) / M_BF;
            p.x = x_tmp + Rz_BF * y_tmp - Ry_BF * z_tmp;
            p.y = -Rz_BF * x_tmp + y_tmp + Rx_BF * z_tmp;
            p.z = Ry_BF * x_tmp - Rx_BF * y_tmp + z_tmp;
        }
    }
});
Proj4js.Point = Proj4js.Class({
    initialize: function (x, y, z) {
        if (typeof x == 'object') {
            this.x = x[0];
            this.y = x[1];
            this.z = x[2] || 0.0;
        } else if (typeof x == 'string' && typeof y == 'undefined') {
            var coords = x.split(',');
            this.x = parseFloat(coords[0]);
            this.y = parseFloat(coords[1]);
            this.z = parseFloat(coords[2]) || 0.0;
        } else {
            this.x = x;
            this.y = y;
            this.z = z || 0.0;
        }
    },
    clone: function () {
        return new Proj4js.Point(this.x, this.y, this.z);
    },
    toString: function () {
        return ("x=" + this.x + ",y=" + this.y);
    },
    toShortString: function () {
        return (this.x + ", " + this.y);
    }
});
Proj4js.PrimeMeridian = {
    "greenwich": 0.0,
    "lisbon": -9.131906111111,
    "paris": 2.337229166667,
    "bogota": -74.080916666667,
    "madrid": -3.687938888889,
    "rome": 12.452333333333,
    "bern": 7.439583333333,
    "jakarta": 106.807719444444,
    "ferro": -17.666666666667,
    "brussels": 4.367975,
    "stockholm": 18.058277777778,
    "athens": 23.7163375,
    "oslo": 10.722916666667
};
Proj4js.Ellipsoid = {
    "MERIT": {
        a: 6378137.0,
        rf: 298.257,
        ellipseName: "MERIT 1983"
    },
    "SGS85": {
        a: 6378136.0,
        rf: 298.257,
        ellipseName: "Soviet Geodetic System 85"
    },
    "GRS80": {
        a: 6378137.0,
        rf: 298.257222101,
        ellipseName: "GRS 1980(IUGG, 1980)"
    },
    "IAU76": {
        a: 6378140.0,
        rf: 298.257,
        ellipseName: "IAU 1976"
    },
    "airy": {
        a: 6377563.396,
        b: 6356256.910,
        ellipseName: "Airy 1830"
    },
    "APL4.": {
        a: 6378137,
        rf: 298.25,
        ellipseName: "Appl. Physics. 1965"
    },
    "NWL9D": {
        a: 6378145.0,
        rf: 298.25,
        ellipseName: "Naval Weapons Lab., 1965"
    },
    "mod_airy": {
        a: 6377340.189,
        b: 6356034.446,
        ellipseName: "Modified Airy"
    },
    "andrae": {
        a: 6377104.43,
        rf: 300.0,
        ellipseName: "Andrae 1876 (Den., Iclnd.)"
    },
    "aust_SA": {
        a: 6378160.0,
        rf: 298.25,
        ellipseName: "Australian Natl & S. Amer. 1969"
    },
    "GRS67": {
        a: 6378160.0,
        rf: 298.2471674270,
        ellipseName: "GRS 67(IUGG 1967)"
    },
    "bessel": {
        a: 6377397.155,
        rf: 299.1528128,
        ellipseName: "Bessel 1841"
    },
    "bess_nam": {
        a: 6377483.865,
        rf: 299.1528128,
        ellipseName: "Bessel 1841 (Namibia)"
    },
    "clrk66": {
        a: 6378206.4,
        b: 6356583.8,
        ellipseName: "Clarke 1866"
    },
    "clrk80": {
        a: 6378249.145,
        rf: 293.4663,
        ellipseName: "Clarke 1880 mod."
    },
    "CPM": {
        a: 6375738.7,
        rf: 334.29,
        ellipseName: "Comm. des Poids et Mesures 1799"
    },
    "delmbr": {
        a: 6376428.0,
        rf: 311.5,
        ellipseName: "Delambre 1810 (Belgium)"
    },
    "engelis": {
        a: 6378136.05,
        rf: 298.2566,
        ellipseName: "Engelis 1985"
    },
    "evrst30": {
        a: 6377276.345,
        rf: 300.8017,
        ellipseName: "Everest 1830"
    },
    "evrst48": {
        a: 6377304.063,
        rf: 300.8017,
        ellipseName: "Everest 1948"
    },
    "evrst56": {
        a: 6377301.243,
        rf: 300.8017,
        ellipseName: "Everest 1956"
    },
    "evrst69": {
        a: 6377295.664,
        rf: 300.8017,
        ellipseName: "Everest 1969"
    },
    "evrstSS": {
        a: 6377298.556,
        rf: 300.8017,
        ellipseName: "Everest (Sabah & Sarawak)"
    },
    "fschr60": {
        a: 6378166.0,
        rf: 298.3,
        ellipseName: "Fischer (Mercury Datum) 1960"
    },
    "fschr60m": {
        a: 6378155.0,
        rf: 298.3,
        ellipseName: "Fischer 1960"
    },
    "fschr68": {
        a: 6378150.0,
        rf: 298.3,
        ellipseName: "Fischer 1968"
    },
    "helmert": {
        a: 6378200.0,
        rf: 298.3,
        ellipseName: "Helmert 1906"
    },
    "hough": {
        a: 6378270.0,
        rf: 297.0,
        ellipseName: "Hough"
    },
    "intl": {
        a: 6378388.0,
        rf: 297.0,
        ellipseName: "International 1909 (Hayford)"
    },
    "kaula": {
        a: 6378163.0,
        rf: 298.24,
        ellipseName: "Kaula 1961"
    },
    "lerch": {
        a: 6378139.0,
        rf: 298.257,
        ellipseName: "Lerch 1979"
    },
    "mprts": {
        a: 6397300.0,
        rf: 191.0,
        ellipseName: "Maupertius 1738"
    },
    "new_intl": {
        a: 6378157.5,
        b: 6356772.2,
        ellipseName: "New International 1967"
    },
    "plessis": {
        a: 6376523.0,
        rf: 6355863.0,
        ellipseName: "Plessis 1817 (France)"
    },
    "krass": {
        a: 6378245.0,
        rf: 298.3,
        ellipseName: "Krassovsky, 1942"
    },
    "SEasia": {
        a: 6378155.0,
        b: 6356773.3205,
        ellipseName: "Southeast Asia"
    },
    "walbeck": {
        a: 6376896.0,
        b: 6355834.8467,
        ellipseName: "Walbeck"
    },
    "WGS60": {
        a: 6378165.0,
        rf: 298.3,
        ellipseName: "WGS 60"
    },
    "WGS66": {
        a: 6378145.0,
        rf: 298.25,
        ellipseName: "WGS 66"
    },
    "WGS72": {
        a: 6378135.0,
        rf: 298.26,
        ellipseName: "WGS 72"
    },
    "WGS84": {
        a: 6378137.0,
        rf: 298.257223563,
        ellipseName: "WGS 84"
    },
    "sphere": {
        a: 6370997.0,
        b: 6370997.0,
        ellipseName: "Normal Sphere (r=6370997)"
    }
};
Proj4js.Datum = {
    "WGS84": {
        towgs84: "0,0,0",
        ellipse: "WGS84",
        datumName: "WGS84"
    },
    "GGRS87": {
        towgs84: "-199.87,74.79,246.62",
        ellipse: "GRS80",
        datumName: "Greek_Geodetic_Reference_System_1987"
    },
    "NAD83": {
        towgs84: "0,0,0",
        ellipse: "GRS80",
        datumName: "North_American_Datum_1983"
    },
    "NAD27": {
        nadgrids: "@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat",
        ellipse: "clrk66",
        datumName: "North_American_Datum_1927"
    },
    "potsdam": {
        towgs84: "606.0,23.0,413.0",
        ellipse: "bessel",
        datumName: "Potsdam Rauenberg 1950 DHDN"
    },
    "carthage": {
        towgs84: "-263.0,6.0,431.0",
        ellipse: "clark80",
        datumName: "Carthage 1934 Tunisia"
    },
    "hermannskogel": {
        towgs84: "653.0,-212.0,449.0",
        ellipse: "bessel",
        datumName: "Hermannskogel"
    },
    "ire65": {
        towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
        ellipse: "mod_airy",
        datumName: "Ireland 1965"
    },
    "nzgd49": {
        towgs84: "59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993",
        ellipse: "intl",
        datumName: "New Zealand Geodetic Datum 1949"
    },
    "OSGB36": {
        towgs84: "446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894",
        ellipse: "airy",
        datumName: "Airy 1830"
    }
};
Proj4js.WGS84 = new Proj4js.Proj('WGS84');
Proj4js.Datum['OSB36'] = Proj4js.Datum['OSGB36'];
Proj4js.wktProjections = {
    "Lambert Tangential Conformal Conic Projection": "lcc",
    "Mercator": "merc",
    "Popular Visualisation Pseudo Mercator": "merc",
    "Mercator_1SP": "merc",
    "Transverse_Mercator": "tmerc",
    "Transverse Mercator": "tmerc",
    "Lambert Azimuthal Equal Area": "laea",
    "Universal Transverse Mercator System": "utm"
};
Proj4js.Proj.aea = {
    init: function () {
        if (Math.abs(this.lat1 + this.lat2) < Proj4js.common.EPSLN) {
            Proj4js.reportError("aeaInitEqualLatitudes");
            return;
        }
        this.temp = this.b / this.a;
        this.es = 1.0 - Math.pow(this.temp, 2);
        this.e3 = Math.sqrt(this.es);
        this.sin_po = Math.sin(this.lat1);
        this.cos_po = Math.cos(this.lat1);
        this.t1 = this.sin_po;
        this.con = this.sin_po;
        this.ms1 = Proj4js.common.msfnz(this.e3, this.sin_po, this.cos_po);
        this.qs1 = Proj4js.common.qsfnz(this.e3, this.sin_po, this.cos_po);
        this.sin_po = Math.sin(this.lat2);
        this.cos_po = Math.cos(this.lat2);
        this.t2 = this.sin_po;
        this.ms2 = Proj4js.common.msfnz(this.e3, this.sin_po, this.cos_po);
        this.qs2 = Proj4js.common.qsfnz(this.e3, this.sin_po, this.cos_po);
        this.sin_po = Math.sin(this.lat0);
        this.cos_po = Math.cos(this.lat0);
        this.t3 = this.sin_po;
        this.qs0 = Proj4js.common.qsfnz(this.e3, this.sin_po, this.cos_po);
        if (Math.abs(this.lat1 - this.lat2) > Proj4js.common.EPSLN) {
            this.ns0 = (this.ms1 * this.ms1 - this.ms2 * this.ms2) / (this.qs2 - this.qs1);
        } else {
            this.ns0 = this.con;
        }
        this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1;
        this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0) / this.ns0;
    },
    forward: function (p) {
        var lon = p.x;
        var lat = p.y;
        this.sin_phi = Math.sin(lat);
        this.cos_phi = Math.cos(lat);
        var qs = Proj4js.common.qsfnz(this.e3, this.sin_phi, this.cos_phi);
        var rh1 = this.a * Math.sqrt(this.c - this.ns0 * qs) / this.ns0;
        var theta = this.ns0 * Proj4js.common.adjust_lon(lon - this.long0);
        var x = rh1 * Math.sin(theta) + this.x0;
        var y = this.rh - rh1 * Math.cos(theta) + this.y0;
        p.x = x;
        p.y = y;
        return p;
    },
    inverse: function (p) {
        var rh1, qs, con, theta, lon, lat;
        p.x -= this.x0;
        p.y = this.rh - p.y + this.y0;
        if (this.ns0 >= 0) {
            rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
            con = 1.0;
        } else {
            rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
            con = -1.0;
        }
        theta = 0.0;
        if (rh1 != 0.0) {
            theta = Math.atan2(con * p.x, con * p.y);
        }
        con = rh1 * this.ns0 / this.a;
        qs = (this.c - con * con) / this.ns0;
        if (this.e3 >= 1e-10) {
            con = 1 - .5 * (1.0 - this.es) * Math.log((1.0 - this.e3) / (1.0 + this.e3)) / this.e3;
            if (Math.abs(Math.abs(con) - Math.abs(qs)) > .0000000001) {
                lat = this.phi1z(this.e3, qs);
            } else {
                if (qs >= 0) {
                    lat = .5 * Proj4js.common.PI;
                } else {
                    lat = -.5 * Proj4js.common.PI;
                }
            }
        } else {
            lat = this.phi1z(this.e3, qs);
        }
        lon = Proj4js.common.adjust_lon(theta / this.ns0 + this.long0);
        p.x = lon;
        p.y = lat;
        return p;
    },
    phi1z: function (eccent, qs) {
        var sinphi, cosphi, con, com, dphi;
        var phi = Proj4js.common.asinz(.5 * qs);
        if (eccent < Proj4js.common.EPSLN) return phi;
        var eccnts = eccent * eccent;
        for (var i = 1; i <= 25; i++) {
            sinphi = Math.sin(phi);
            cosphi = Math.cos(phi);
            con = eccent * sinphi;
            com = 1.0 - con * con;
            dphi = .5 * com * com / cosphi * (qs / (1.0 - eccnts) - sinphi / com + .5 / eccent * Math.log((1.0 - con) / (1.0 + con)));
            phi = phi + dphi;
            if (Math.abs(dphi) <= 1e-7) return phi;
        }
        Proj4js.reportError("aea:phi1z:Convergence error");
        return null;
    }
};
Proj4js.Proj.sterea = {
    dependsOn: 'gauss',
    init: function () {
        Proj4js.Proj['gauss'].init.apply(this);
        if (!this.rc) {
            Proj4js.reportError("sterea:init:E_ERROR_0");
            return;
        }
        this.sinc0 = Math.sin(this.phic0);
        this.cosc0 = Math.cos(this.phic0);
        this.R2 = 2.0 * this.rc;
        if (!this.title) this.title = "Oblique Stereographic Alternative";
    },
    forward: function (p) {
        var sinc, cosc, cosl, k;
        p.x = Proj4js.common.adjust_lon(p.x - this.long0);
        Proj4js.Proj['gauss'].forward.apply(this, [p]);
        sinc = Math.sin(p.y);
        cosc = Math.cos(p.y);
        cosl = Math.cos(p.x);
        k = this.k0 * this.R2 / (1.0 + this.sinc0 * sinc + this.cosc0 * cosc * cosl);
        p.x = k * cosc * Math.sin(p.x);
        p.y = k * (this.cosc0 * sinc - this.sinc0 * cosc * cosl);
        p.x = this.a * p.x + this.x0;
        p.y = this.a * p.y + this.y0;
        return p;
    },
    inverse: function (p) {
        var sinc, cosc, lon, lat, rho;
        p.x = (p.x - this.x0) / this.a;
        p.y = (p.y - this.y0) / this.a;
        p.x /= this.k0;
        p.y /= this.k0;
        if ((rho = Math.sqrt(p.x * p.x + p.y * p.y))) {
            var c = 2.0 * Math.atan2(rho, this.R2);
            sinc = Math.sin(c);
            cosc = Math.cos(c);
            lat = Math.asin(cosc * this.sinc0 + p.y * sinc * this.cosc0 / rho);
            lon = Math.atan2(p.x * sinc, rho * this.cosc0 * cosc - p.y * this.sinc0 * sinc);
        } else {
            lat = this.phic0;
            lon = 0.;
        }
        p.x = lon;
        p.y = lat;
        Proj4js.Proj['gauss'].inverse.apply(this, [p]);
        p.x = Proj4js.common.adjust_lon(p.x + this.long0);
        return p;
    }
};

function phi4z(eccent, e0, e1, e2, e3, a, b, c, phi) {
    var sinphi, sin2ph, tanphi, ml, mlp, con1, con2, con3, dphi, i;
    phi = a;
    for (i = 1; i <= 15; i++) {
        sinphi = Math.sin(phi);
        tanphi = Math.tan(phi);
        c = tanphi * Math.sqrt(1.0 - eccent * sinphi * sinphi);
        sin2ph = Math.sin(2.0 * phi);
        ml = e0 * phi - e1 * sin2ph + e2 * Math.sin(4.0 * phi) - e3 * Math.sin(6.0 * phi);
        mlp = e0 - 2.0 * e1 * Math.cos(2.0 * phi) + 4.0 * e2 * Math.cos(4.0 * phi) - 6.0 * e3 * Math.cos(6.0 * phi);
        con1 = 2.0 * ml + c * (ml * ml + b) - 2.0 * a * (c * ml + 1.0);
        con2 = eccent * sin2ph * (ml * ml + b - 2.0 * a * ml) / (2.0 * c);
        con3 = 2.0 * (a - ml) * (c * mlp - 2.0 / sin2ph) - 2.0 * mlp;
        dphi = con1 / (con2 + con3);
        phi += dphi;
        if (Math.abs(dphi) <= .0000000001) return (phi);
    }
    Proj4js.reportError("phi4z: No convergence");
    return null;
}

function e4fn(x) {
    var con, com;
    con = 1.0 + x;
    com = 1.0 - x;
    return (Math.sqrt((Math.pow(con, con)) * (Math.pow(com, com))));
}
Proj4js.Proj.poly = {
    init: function () {
        var temp;
        if (this.lat0 == 0) this.lat0 = 90;
        this.temp = this.b / this.a;
        this.es = 1.0 - Math.pow(this.temp, 2);
        this.e = Math.sqrt(this.es);
        this.e0 = Proj4js.common.e0fn(this.es);
        this.e1 = Proj4js.common.e1fn(this.es);
        this.e2 = Proj4js.common.e2fn(this.es);
        this.e3 = Proj4js.common.e3fn(this.es);
        this.ml0 = Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
    },
    forward: function (p) {
        var sinphi, cosphi;
        var al;
        var c;
        var con, ml;
        var ms;
        var x, y;
        var lon = p.x;
        var lat = p.y;
        con = Proj4js.common.adjust_lon(lon - this.long0);
        if (Math.abs(lat) <= .0000001) {
            x = this.x0 + this.a * con;
            y = this.y0 - this.a * this.ml0;
        } else {
            sinphi = Math.sin(lat);
            cosphi = Math.cos(lat);
            ml = Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, lat);
            ms = Proj4js.common.msfnz(this.e, sinphi, cosphi);
            con = sinphi;
            x = this.x0 + this.a * ms * Math.sin(con) / sinphi;
            y = this.y0 + this.a * (ml - this.ml0 + ms * (1.0 - Math.cos(con)) / sinphi);
        }
        p.x = x;
        p.y = y;
        return p;
    },
    inverse: function (p) {
        var sin_phi, cos_phi;
        var al;
        var b;
        var c;
        var con, ml;
        var iflg;
        var lon, lat;
        p.x -= this.x0;
        p.y -= this.y0;
        al = this.ml0 + p.y / this.a;
        iflg = 0;
        if (Math.abs(al) <= .0000001) {
            lon = p.x / this.a + this.long0;
            lat = 0.0;
        } else {
            b = al * al + (p.x / this.a) * (p.x / this.a);
            iflg = phi4z(this.es, this.e0, this.e1, this.e2, this.e3, this.al, b, c, lat);
            if (iflg != 1) return (iflg);
            lon = Proj4js.common.adjust_lon((Proj4js.common.asinz(p.x * c / this.a) / Math.sin(lat)) + this.long0);
        }
        p.x = lon;
        p.y = lat;
        return p;
    }
};
Proj4js.Proj.equi = {
    init: function () {
        if (!this.x0) this.x0 = 0;
        if (!this.y0) this.y0 = 0;
        if (!this.lat0) this.lat0 = 0;
        if (!this.long0) this.long0 = 0;
    },
    forward: function (p) {
        var lon = p.x;
        var lat = p.y;
        var dlon = Proj4js.common.adjust_lon(lon - this.long0);
        var x = this.x0 + this.a * dlon * Math.cos(this.lat0);
        var y = this.y0 + this.a * lat;
        this.t1 = x;
        this.t2 = Math.cos(this.lat0);
        p.x = x;
        p.y = y;
        return p;
    },
    inverse: function (p) {
        p.x -= this.x0;
        p.y -= this.y0;
        var lat = p.y / this.a;
        if (Math.abs(lat) > Proj4js.common.HALF_PI) {
            Proj4js.reportError("equi:Inv:DataError");
        }
        var lon = Proj4js.common.adjust_lon(this.long0 + p.x / (this.a * Math.cos(this.lat0)));
        p.x = lon;
        p.y = lat;
    }
};
Proj4js.Proj.merc = {
    init: function () {
        if (this.lat_ts) {
            if (this.sphere) {
                this.k0 = Math.cos(this.lat_ts);
            } else {
                this.k0 = Proj4js.common.msfnz(this.es, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
            }
        }
    },
    forward: function (p) {
        var lon = p.x;
        var lat = p.y;
        if (lat * Proj4js.common.R2D > 90.0 && lat * Proj4js.common.R2D < -90.0 && lon * Proj4js.common.R2D > 180.0 && lon * Proj4js.common.R2D < -180.0) {
            Proj4js.reportError("merc:forward: llInputOutOfRange: " + lon + " : " + lat);
            return null;
        }
        var x, y;
        if (Math.abs(Math.abs(lat) - Proj4js.common.HALF_PI) <= Proj4js.common.EPSLN) {
            Proj4js.reportError("merc:forward: ll2mAtPoles");
            return null;
        } else {
            if (this.sphere) {
                x = this.x0 + this.a * this.k0 * Proj4js.common.adjust_lon(lon - this.long0);
                y = this.y0 + this.a * this.k0 * Math.log(Math.tan(Proj4js.common.FORTPI + 0.5 * lat));
            } else {
                var sinphi = Math.sin(lat);
                var ts = Proj4js.common.tsfnz(this.e, lat, sinphi);
                x = this.x0 + this.a * this.k0 * Proj4js.common.adjust_lon(lon - this.long0);
                y = this.y0 - this.a * this.k0 * Math.log(ts);
            }
            p.x = x;
            p.y = y;
            return p;
        }
    },
    inverse: function (p) {
        var x = p.x - this.x0;
        var y = p.y - this.y0;
        var lon, lat;
        if (this.sphere) {
            lat = Proj4js.common.HALF_PI - 2.0 * Math.atan(Math.exp(-y / this.a * this.k0));
        } else {
            var ts = Math.exp(-y / (this.a * this.k0));
            lat = Proj4js.common.phi2z(this.e, ts);
            if (lat == -9999) {
                Proj4js.reportError("merc:inverse: lat = -9999");
                return null;
            }
        }
        lon = Proj4js.common.adjust_lon(this.long0 + x / (this.a * this.k0));
        p.x = lon;
        p.y = lat;
        return p;
    }
};
Proj4js.Proj.utm = {
    dependsOn: 'tmerc',
    init: function () {
        if (!this.zone) {
            Proj4js.reportError("utm:init: zone must be specified for UTM");
            return;
        }
        this.lat0 = 0.0;
        this.long0 = ((6 * Math.abs(this.zone)) - 183) * Proj4js.common.D2R;
        this.x0 = 500000.0;
        this.y0 = this.utmSouth ? 10000000.0 : 0.0;
        this.k0 = 0.9996;
        Proj4js.Proj['tmerc'].init.apply(this);
        this.forward = Proj4js.Proj['tmerc'].forward;
        this.inverse = Proj4js.Proj['tmerc'].inverse;
    }
};
Proj4js.Proj.eqdc = {
    init: function () {
        if (!this.mode) this.mode = 0;
        this.temp = this.b / this.a;
        this.es = 1.0 - Math.pow(this.temp, 2);
        this.e = Math.sqrt(this.es);
        this.e0 = Proj4js.common.e0fn(this.es);
        this.e1 = Proj4js.common.e1fn(this.es);
        this.e2 = Proj4js.common.e2fn(this.es);
        this.e3 = Proj4js.common.e3fn(this.es);
        this.sinphi = Math.sin(this.lat1);
        this.cosphi = Math.cos(this.lat1);
        this.ms1 = Proj4js.common.msfnz(this.e, this.sinphi, this.cosphi);
        this.ml1 = Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, this.lat1);
        if (this.mode != 0) {
            if (Math.abs(this.lat1 + this.lat2) < Proj4js.common.EPSLN) {
                Proj4js.reportError("eqdc:Init:EqualLatitudes");
            }
            this.sinphi = Math.sin(this.lat2);
            this.cosphi = Math.cos(this.lat2);
            this.ms2 = Proj4js.common.msfnz(this.e, this.sinphi, this.cosphi);
            this.ml2 = Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, this.lat2);
            if (Math.abs(this.lat1 - this.lat2) >= Proj4js.common.EPSLN) {
                this.ns = (this.ms1 - this.ms2) / (this.ml2 - this.ml1);
            } else {
                this.ns = this.sinphi;
            }
        } else {
            this.ns = this.sinphi;
        }
        this.g = this.ml1 + this.ms1 / this.ns;
        this.ml0 = Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
        this.rh = this.a * (this.g - this.ml0);
    },
    forward: function (p) {
        var lon = p.x;
        var lat = p.y;
        var ml = Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, lat);
        var rh1 = this.a * (this.g - ml);
        var theta = this.ns * Proj4js.common.adjust_lon(lon - this.long0);
        var x = this.x0 + rh1 * Math.sin(theta);
        var y = this.y0 + this.rh - rh1 * Math.cos(theta);
        p.x = x;
        p.y = y;
        return p;
    },
    inverse: function (p) {
        p.x -= this.x0;
        p.y = this.rh - p.y + this.y0;
        var con, rh1;
        if (this.ns >= 0) {
            rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
            con = 1.0;
        } else {
            rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
            con = -1.0;
        }
        var theta = 0.0;
        if (rh1 != 0.0) theta = Math.atan2(con * p.x, con * p.y);
        var ml = this.g - rh1 / this.a;
        var lat = this.phi3z(ml, this.e0, this.e1, this.e2, this.e3);
        var lon = Proj4js.common.adjust_lon(this.long0 + theta / this.ns);
        p.x = lon;
        p.y = lat;
        return p;
    },
    phi3z: function (ml, e0, e1, e2, e3) {
        var phi;
        var dphi;
        phi = ml;
        for (var i = 0; i < 15; i++) {
            dphi = (ml + e1 * Math.sin(2.0 * phi) - e2 * Math.sin(4.0 * phi) + e3 * Math.sin(6.0 * phi)) / e0 - phi;
            phi += dphi;
            if (Math.abs(dphi) <= .0000000001) {
                return phi;
            }
        }
        Proj4js.reportError("PHI3Z-CONV:Latitude failed to converge after 15 iterations");
        return null;
    }
};
Proj4js.Proj.tmerc = {
    init: function () {
        this.e0 = Proj4js.common.e0fn(this.es);
        this.e1 = Proj4js.common.e1fn(this.es);
        this.e2 = Proj4js.common.e2fn(this.es);
        this.e3 = Proj4js.common.e3fn(this.es);
        this.ml0 = this.a * Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
    },
    forward: function (p) {
        var lon = p.x;
        var lat = p.y;
        var delta_lon = Proj4js.common.adjust_lon(lon - this.long0);
        var con;
        var x, y;
        var sin_phi = Math.sin(lat);
        var cos_phi = Math.cos(lat);
        if (this.sphere) {
            var b = cos_phi * Math.sin(delta_lon);
            if ((Math.abs(Math.abs(b) - 1.0)) < .0000000001) {
                Proj4js.reportError("tmerc:forward: Point projects into infinity");
                return (93);
            } else {
                x = .5 * this.a * this.k0 * Math.log((1.0 + b) / (1.0 - b));
                con = Math.acos(cos_phi * Math.cos(delta_lon) / Math.sqrt(1.0 - b * b));
                if (lat < 0) con = -con;
                y = this.a * this.k0 * (con - this.lat0);
            }
        } else {
            var al = cos_phi * delta_lon;
            var als = Math.pow(al, 2);
            var c = this.ep2 * Math.pow(cos_phi, 2);
            var tq = Math.tan(lat);
            var t = Math.pow(tq, 2);
            con = 1.0 - this.es * Math.pow(sin_phi, 2);
            var n = this.a / Math.sqrt(con);
            var ml = this.a * Proj4js.common.mlfn(this.e0, this.e1, this.e2, this.e3, lat);
            x = this.k0 * n * al * (1.0 + als / 6.0 * (1.0 - t + c + als / 20.0 * (5.0 - 18.0 * t + Math.pow(t, 2) + 72.0 * c - 58.0 * this.ep2))) + this.x0;
            y = this.k0 * (ml - this.ml0 + n * tq * (als * (0.5 + als / 24.0 * (5.0 - t + 9.0 * c + 4.0 * Math.pow(c, 2) + als / 30.0 * (61.0 - 58.0 * t + Math.pow(t, 2) + 600.0 * c - 330.0 * this.ep2))))) + this.y0;
        }
        p.x = x;
        p.y = y;
        return p;
    },
    inverse: function (p) {
        var con, phi;
        var delta_phi;
        var i;
        var max_iter = 6;
        var lat, lon;
        if (this.sphere) {
            var f = Math.exp(p.x / (this.a * this.k0));
            var g = .5 * (f - 1 / f);
            var temp = this.lat0 + p.y / (this.a * this.k0);
            var h = Math.cos(temp);
            con = Math.sqrt((1.0 - h * h) / (1.0 + g * g));
            lat = Proj4js.common.asinz(con);
            if (temp < 0)
                lat = -lat;
            if ((g == 0) && (h == 0)) {
                lon = this.long0;
            } else {
                lon = Proj4js.common.adjust_lon(Math.atan2(g, h) + this.long0);
            }
        } else {
            var x = p.x - this.x0;
            var y = p.y - this.y0;
            con = (this.ml0 + y / this.k0) / this.a;
            phi = con;
            for (i = 0; true; i++) {
                delta_phi = ((con + this.e1 * Math.sin(2.0 * phi) - this.e2 * Math.sin(4.0 * phi) + this.e3 * Math.sin(6.0 * phi)) / this.e0) - phi;
                phi += delta_phi;
                if (Math.abs(delta_phi) <= Proj4js.common.EPSLN) break;
                if (i >= max_iter) {
                    Proj4js.reportError("tmerc:inverse: Latitude failed to converge");
                    return (95);
                }
            }
            if (Math.abs(phi) < Proj4js.common.HALF_PI) {
                var sin_phi = Math.sin(phi);
                var cos_phi = Math.cos(phi);
                var tan_phi = Math.tan(phi);
                var c = this.ep2 * Math.pow(cos_phi, 2);
                var cs = Math.pow(c, 2);
                var t = Math.pow(tan_phi, 2);
                var ts = Math.pow(t, 2);
                con = 1.0 - this.es * Math.pow(sin_phi, 2);
                var n = this.a / Math.sqrt(con);
                var r = n * (1.0 - this.es) / con;
                var d = x / (n * this.k0);
                var ds = Math.pow(d, 2);
                lat = phi - (n * tan_phi * ds / r) * (0.5 - ds / 24.0 * (5.0 + 3.0 * t + 10.0 * c - 4.0 * cs - 9.0 * this.ep2 - ds / 30.0 * (61.0 + 90.0 * t + 298.0 * c + 45.0 * ts - 252.0 * this.ep2 - 3.0 * cs)));
                lon = Proj4js.common.adjust_lon(this.long0 + (d * (1.0 - ds / 6.0 * (1.0 + 2.0 * t + c - ds / 20.0 * (5.0 - 2.0 * c + 28.0 * t - 3.0 * cs + 8.0 * this.ep2 + 24.0 * ts))) / cos_phi));
            } else {
                lat = Proj4js.common.HALF_PI * Proj4js.common.sign(y);
                lon = this.long0;
            }
        }
        p.x = lon;
        p.y = lat;
        return p;
    }
};
Proj4js.defs["GOOGLE"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
Proj4js.defs["EPSG:900913"] = Proj4js.defs["GOOGLE"];
Proj4js.Proj.gstmerc = {
    init: function () {
        var temp = this.b / this.a;
        this.e = Math.sqrt(1.0 - temp * temp);
        this.lc = this.long0;
        this.rs = Math.sqrt(1.0 + this.e * this.e * Math.pow(Math.cos(this.lat0), 4.0) / (1.0 - this.e * this.e));
        var sinz = Math.sin(this.lat0);
        var pc = Math.asin(sinz / this.rs);
        var sinzpc = Math.sin(pc);
        this.cp = Proj4js.common.latiso(0.0, pc, sinzpc) - this.rs * Proj4js.common.latiso(this.e, this.lat0, sinz);
        this.n2 = this.k0 * this.a * Math.sqrt(1.0 - this.e * this.e) / (1.0 - this.e * this.e * sinz * sinz);
        this.xs = this.x0;
        this.ys = this.y0 - this.n2 * pc;
        if (!this.title) this.title = "Gauss Schreiber transverse mercator";
    },
    forward: function (p) {
        var lon = p.x;
        var lat = p.y;
        var L = this.rs * (lon - this.lc);
        var Ls = this.cp + (this.rs * Proj4js.common.latiso(this.e, lat, Math.sin(lat)));
        var lat1 = Math.asin(Math.sin(L) / Proj4js.common.cosh(Ls));
        var Ls1 = Proj4js.common.latiso(0.0, lat1, Math.sin(lat1));
        p.x = this.xs + (this.n2 * Ls1);
        p.y = this.ys + (this.n2 * Math.atan(Proj4js.common.sinh(Ls) / Math.cos(L)));
        return p;
    },
    inverse: function (p) {
        var x = p.x;
        var y = p.y;
        var L = Math.atan(Proj4js.common.sinh((x - this.xs) / this.n2) / Math.cos((y - this.ys) / this.n2));
        var lat1 = Math.asin(Math.sin((y - this.ys) / this.n2) / Proj4js.common.cosh((x - this.xs) / this.n2));
        var LC = Proj4js.common.latiso(0.0, lat1, Math.sin(lat1));
        p.x = this.lc + L / this.rs;
        p.y = Proj4js.common.invlatiso(this.e, (LC - this.cp) / this.rs);
        return p;
    }
};
Proj4js.Proj.ortho = {
    init: function (def) {;
        this.sin_p14 = Math.sin(this.lat0);
        this.cos_p14 = Math.cos(this.lat0);
    },
    forward: function (p) {
        var sinphi, cosphi;
        var dlon;
        var coslon;
        var ksp;
        var g;
        var lon = p.x;
        var lat = p.y;
        dlon = Proj4js.common.adjust_lon(lon - this.long0);
        sinphi = Math.sin(lat);
        cosphi = Math.cos(lat);
        coslon = Math.cos(dlon);
        g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
        ksp = 1.0;
        if ((g > 0) || (Math.abs(g) <= Proj4js.common.EPSLN)) {
            var x = this.a * ksp * cosphi * Math.sin(dlon);
            var y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);
        } else {
            Proj4js.reportError("orthoFwdPointError");
        }
        p.x = x;
        p.y = y;
        return p;
    },
    inverse: function (p) {
        var rh;
        var z;
        var sinz, cosz;
        var temp;
        var con;
        var lon, lat;
        p.x -= this.x0;
        p.y -= this.y0;
        rh = Math.sqrt(p.x * p.x + p.y * p.y);
        if (rh > this.a + .0000001) {
            Proj4js.reportError("orthoInvDataError");
        }
        z = Proj4js.common.asinz(rh / this.a);
        sinz = Math.sin(z);
        cosz = Math.cos(z);
        lon = this.long0;
        if (Math.abs(rh) <= Proj4js.common.EPSLN) {
            lat = this.lat0;
        }
        lat = Proj4js.common.asinz(cosz * this.sin_p14 + (p.y * sinz * this.cos_p14) / rh);
        con = Math.abs(this.lat0) - Proj4js.common.HALF_PI;
        if (Math.abs(con) <= Proj4js.common.EPSLN) {
            if (this.lat0 >= 0) {
                lon = Proj4js.common.adjust_lon(this.long0 + Math.atan2(p.x, -p.y));
            } else {
                lon = Proj4js.common.adjust_lon(this.long0 - Math.atan2(-p.x, p.y));
            }
        }
        con = cosz - this.sin_p14 * Math.sin(lat);
        p.x = lon;
        p.y = lat;
        return p;
    }
};
Proj4js.Proj.krovak = {
    init: function () {
        this.a = 6377397.155;
        this.es = 0.006674372230614;
        this.e = Math.sqrt(this.es);
        if (!this.lat0) {
            this.lat0 = 0.863937979737193;
        }
        if (!this.long0) {
            this.long0 = 0.7417649320975901 - 0.308341501185665;
        }
        if (!this.k0) {
            this.k0 = 0.9999;
        }
        this.s45 = 0.785398163397448;
        this.s90 = 2 * this.s45;
        this.fi0 = this.lat0;
        this.e2 = this.es;
        this.e = Math.sqrt(this.e2);
        this.alfa = Math.sqrt(1. + (this.e2 * Math.pow(Math.cos(this.fi0), 4)) / (1. - this.e2));
        this.uq = 1.04216856380474;
        this.u0 = Math.asin(Math.sin(this.fi0) / this.alfa);
        this.g = Math.pow((1. + this.e * Math.sin(this.fi0)) / (1. - this.e * Math.sin(this.fi0)), this.alfa * this.e / 2.);
        this.k = Math.tan(this.u0 / 2. + this.s45) / Math.pow(Math.tan(this.fi0 / 2. + this.s45), this.alfa) * this.g;
        this.k1 = this.k0;
        this.n0 = this.a * Math.sqrt(1. - this.e2) / (1. - this.e2 * Math.pow(Math.sin(this.fi0), 2));
        this.s0 = 1.37008346281555;
        this.n = Math.sin(this.s0);
        this.ro0 = this.k1 * this.n0 / Math.tan(this.s0);
        this.ad = this.s90 - this.uq;
    },
    forward: function (p) {
        var gfi, u, deltav, s, d, eps, ro;
        var lon = p.x;
        var lat = p.y;
        var delta_lon = Proj4js.common.adjust_lon(lon - this.long0);
        gfi = Math.pow(((1. + this.e * Math.sin(lat)) / (1. - this.e * Math.sin(lat))), (this.alfa * this.e / 2.));
        u = 2. * (Math.atan(this.k * Math.pow(Math.tan(lat / 2. + this.s45), this.alfa) / gfi) - this.s45);
        deltav = -delta_lon * this.alfa;
        s = Math.asin(Math.cos(this.ad) * Math.sin(u) + Math.sin(this.ad) * Math.cos(u) * Math.cos(deltav));
        d = Math.asin(Math.cos(u) * Math.sin(deltav) / Math.cos(s));
        eps = this.n * d;
        ro = this.ro0 * Math.pow(Math.tan(this.s0 / 2. + this.s45), this.n) / Math.pow(Math.tan(s / 2. + this.s45), this.n);
        p.y = ro * Math.cos(eps) / 1.0;
        p.x = ro * Math.sin(eps) / 1.0;
        if (this.czech) {
            p.y *= -1.0;
            p.x *= -1.0;
        }
        return (p);
    },
    inverse: function (p) {
        var u, deltav, s, d, eps, ro, fi1;
        var ok;
        var tmp = p.x;
        p.x = p.y;
        p.y = tmp;
        if (this.czech) {
            p.y *= -1.0;
            p.x *= -1.0;
        }
        ro = Math.sqrt(p.x * p.x + p.y * p.y);
        eps = Math.atan2(p.y, p.x);
        d = eps / Math.sin(this.s0);
        s = 2. * (Math.atan(Math.pow(this.ro0 / ro, 1. / this.n) * Math.tan(this.s0 / 2. + this.s45)) - this.s45);
        u = Math.asin(Math.cos(this.ad) * Math.sin(s) - Math.sin(this.ad) * Math.cos(s) * Math.cos(d));
        deltav = Math.asin(Math.cos(s) * Math.sin(d) / Math.cos(u));
        p.x = this.long0 - deltav / this.alfa;
        fi1 = u;
        ok = 0;
        var iter = 0;
        do {
            p.y = 2. * (Math.atan(Math.pow(this.k, -1. / this.alfa) * Math.pow(Math.tan(u / 2. + this.s45), 1. / this.alfa) * Math.pow((1. + this.e * Math.sin(fi1)) / (1. - this.e * Math.sin(fi1)), this.e / 2.)) - this.s45);
            if (Math.abs(fi1 - p.y) < 0.0000000001) ok = 1;
            fi1 = p.y;
            iter += 1;
        } while (ok == 0 && iter < 15);
        if (iter >= 15) {
            Proj4js.reportError("PHI3Z-CONV:Latitude failed to converge after 15 iterations");
            return null;
        }
        return (p);
    }
};
Proj4js.Proj.somerc = {
    init: function () {
        var phy0 = this.lat0;
        this.lambda0 = this.long0;
        var sinPhy0 = Math.sin(phy0);
        var semiMajorAxis = this.a;
        var invF = this.rf;
        var flattening = 1 / invF;
        var e2 = 2 * flattening - Math.pow(flattening, 2);
        var e = this.e = Math.sqrt(e2);
        this.R = this.k0 * semiMajorAxis * Math.sqrt(1 - e2) / (1 - e2 * Math.pow(sinPhy0, 2.0));
        this.alpha = Math.sqrt(1 + e2 / (1 - e2) * Math.pow(Math.cos(phy0), 4.0));
        this.b0 = Math.asin(sinPhy0 / this.alpha);
        this.K = Math.log(Math.tan(Math.PI / 4.0 + this.b0 / 2.0)) - this.alpha * Math.log(Math.tan(Math.PI / 4.0 + phy0 / 2.0)) + this.alpha * e / 2 * Math.log((1 + e * sinPhy0) / (1 - e * sinPhy0));
    },
    forward: function (p) {
        var Sa1 = Math.log(Math.tan(Math.PI / 4.0 - p.y / 2.0));
        var Sa2 = this.e / 2.0 * Math.log((1 + this.e * Math.sin(p.y)) / (1 - this.e * Math.sin(p.y)));
        var S = -this.alpha * (Sa1 + Sa2) + this.K;
        var b = 2.0 * (Math.atan(Math.exp(S)) - Math.PI / 4.0);
        var I = this.alpha * (p.x - this.lambda0);
        var rotI = Math.atan(Math.sin(I) / (Math.sin(this.b0) * Math.tan(b) +
            Math.cos(this.b0) * Math.cos(I)));
        var rotB = Math.asin(Math.cos(this.b0) * Math.sin(b) -
            Math.sin(this.b0) * Math.cos(b) * Math.cos(I));
        p.y = this.R / 2.0 * Math.log((1 + Math.sin(rotB)) / (1 - Math.sin(rotB))) + this.y0;
        p.x = this.R * rotI + this.x0;
        return p;
    },
    inverse: function (p) {
        var Y = p.x - this.x0;
        var X = p.y - this.y0;
        var rotI = Y / this.R;
        var rotB = 2 * (Math.atan(Math.exp(X / this.R)) - Math.PI / 4.0);
        var b = Math.asin(Math.cos(this.b0) * Math.sin(rotB) + Math.sin(this.b0) * Math.cos(rotB) * Math.cos(rotI));
        var I = Math.atan(Math.sin(rotI) / (Math.cos(this.b0) * Math.cos(rotI) - Math.sin(this.b0) * Math.tan(rotB)));
        var lambda = this.lambda0 + I / this.alpha;
        var S = 0.0;
        var phy = b;
        var prevPhy = -1000.0;
        var iteration = 0;
        while (Math.abs(phy - prevPhy) > 0.0000001) {
            if (++iteration > 20) {
                Proj4js.reportError("omercFwdInfinity");
                return;
            }
            S = 1.0 / this.alpha * (Math.log(Math.tan(Math.PI / 4.0 + b / 2.0)) - this.K) + this.e * Math.log(Math.tan(Math.PI / 4.0 + Math.asin(this.e * Math.sin(phy)) / 2.0));
            prevPhy = phy;
            phy = 2.0 * Math.atan(Math.exp(S)) - Math.PI / 2.0;
        }
        p.x = lambda;
        p.y = phy;
        return p;
    }
};

Proj4js.Proj.stere = {
    ssfn_: function (phit, sinphi, eccen) {
        sinphi *= eccen;
        return (Math.tan(.5 * (Proj4js.common.HALF_PI + phit)) * Math.pow((1. - sinphi) / (1. + sinphi), .5 * eccen));
    },
    TOL: 1.e-8,
    NITER: 8,
    CONV: 1.e-10,
    S_POLE: 0,
    N_POLE: 1,
    OBLIQ: 2,
    EQUIT: 3,
    init: function () {
        this.phits = this.lat_ts ? this.lat_ts : Proj4js.common.HALF_PI;
        var t = Math.abs(this.lat0);
        if ((Math.abs(t) - Proj4js.common.HALF_PI) < Proj4js.common.EPSLN) {
            this.mode = this.lat0 < 0. ? this.S_POLE : this.N_POLE;
        } else {
            this.mode = t > Proj4js.common.EPSLN ? this.OBLIQ : this.EQUIT;
        }
        this.phits = Math.abs(this.phits);
        if (this.es) {
            var X;
            switch (this.mode) {
            case this.N_POLE:
            case this.S_POLE:
                if (Math.abs(this.phits - Proj4js.common.HALF_PI) < Proj4js.common.EPSLN) {
                    this.akm1 = 2. * this.k0 / Math.sqrt(Math.pow(1 + this.e, 1 + this.e) * Math.pow(1 - this.e, 1 - this.e));
                } else {
                    t = Math.sin(this.phits);
                    this.akm1 = Math.cos(this.phits) / Proj4js.common.tsfnz(this.e, this.phits, t);
                    t *= this.e;
                    this.akm1 /= Math.sqrt(1. - t * t);
                }
                break;
            case this.EQUIT:
                this.akm1 = 2. * this.k0;
                break;
            case this.OBLIQ:
                t = Math.sin(this.lat0);
                X = 2. * Math.atan(this.ssfn_(this.lat0, t, this.e)) - Proj4js.common.HALF_PI;
                t *= this.e;
                this.akm1 = 2. * this.k0 * Math.cos(this.lat0) / Math.sqrt(1. - t * t);
                this.sinX1 = Math.sin(X);
                this.cosX1 = Math.cos(X);
                break;
            }
        } else {
            switch (this.mode) {
            case this.OBLIQ:
                this.sinph0 = Math.sin(this.lat0);
                this.cosph0 = Math.cos(this.lat0);
            case this.EQUIT:
                this.akm1 = 2. * this.k0;
                break;
            case this.S_POLE:
            case this.N_POLE:
                this.akm1 = Math.abs(this.phits - Proj4js.common.HALF_PI) >= Proj4js.common.EPSLN ? Math.cos(this.phits) / Math.tan(Proj4js.common.FORTPI - .5 * this.phits) : 2. * this.k0;
                break;
            }
        }
    },
    forward: function (p) {
        var lon = p.x;
        lon = Proj4js.common.adjust_lon(lon - this.long0);
        var lat = p.y;
        var x, y;
        if (this.sphere) {
            var sinphi, cosphi, coslam, sinlam;
            sinphi = Math.sin(lat);
            cosphi = Math.cos(lat);
            coslam = Math.cos(lon);
            sinlam = Math.sin(lon);
            switch (this.mode) {
            case this.EQUIT:
                y = 1. + cosphi * coslam;
                if (y <= Proj4js.common.EPSLN) {
                    Proj4js.reportError("stere:forward:Equit");
                }
                y = this.akm1 / y;
                x = y * cosphi * sinlam;
                y *= sinphi;
                break;
            case this.OBLIQ:
                y = 1. + this.sinph0 * sinphi + this.cosph0 * cosphi * coslam;
                if (y <= Proj4js.common.EPSLN) {
                    Proj4js.reportError("stere:forward:Obliq");
                }
                y = this.akm1 / y;
                x = y * cosphi * sinlam;
                y *= this.cosph0 * sinphi - this.sinph0 * cosphi * coslam;
                break;
            case this.N_POLE:
                coslam = -coslam;
                lat = -lat;
            case this.S_POLE:
                if (Math.abs(lat - Proj4js.common.HALF_PI) < this.TOL) {
                    Proj4js.reportError("stere:forward:S_POLE");
                }
                y = this.akm1 * Math.tan(Proj4js.common.FORTPI + .5 * lat);
                x = sinlam * y;
                y *= coslam;
                break;
            }
        } else {
            coslam = Math.cos(lon);
            sinlam = Math.sin(lon);
            sinphi = Math.sin(lat);
            var sinX, cosX;
            if (this.mode == this.OBLIQ || this.mode == this.EQUIT) {
                var Xt = 2. * Math.atan(this.ssfn_(lat, sinphi, this.e));
                sinX = Math.sin(Xt - Proj4js.common.HALF_PI);
                cosX = Math.cos(Xt);
            }
            switch (this.mode) {
            case this.OBLIQ:
                var A = this.akm1 / (this.cosX1 * (1. + this.sinX1 * sinX + this.cosX1 * cosX * coslam));
                y = A * (this.cosX1 * sinX - this.sinX1 * cosX * coslam);
                x = A * cosX;
                break;
            case this.EQUIT:
                var A = 2. * this.akm1 / (1. + cosX * coslam);
                y = A * sinX;
                x = A * cosX;
                break;
            case this.S_POLE:
                lat = -lat;
                coslam = -coslam;
                sinphi = -sinphi;
            case this.N_POLE:
                x = this.akm1 * Proj4js.common.tsfnz(this.e, lat, sinphi);
                y = -x * coslam;
                break;
            }
            x = x * sinlam;
        }
        p.x = x * this.a + this.x0;
        p.y = y * this.a + this.y0;
        return p;
    },
    inverse: function (p) {
        var x = (p.x - this.x0) / this.a;
        var y = (p.y - this.y0) / this.a;
        var lon, lat;
        var cosphi, sinphi, tp = 0.0,
            phi_l = 0.0,
            rho, halfe = 0.0,
            pi2 = 0.0;
        var i;
        if (this.sphere) {
            var c, rh, sinc, cosc;
            rh = Math.sqrt(x * x + y * y);
            c = 2. * Math.atan(rh / this.akm1);
            sinc = Math.sin(c);
            cosc = Math.cos(c);
            lon = 0.;
            switch (this.mode) {
            case this.EQUIT:
                if (Math.abs(rh) <= Proj4js.common.EPSLN) {
                    lat = 0.;
                } else {
                    lat = Math.asin(y * sinc / rh);
                }
                if (cosc != 0. || x != 0.) lon = Math.atan2(x * sinc, cosc * rh);
                break;
            case this.OBLIQ:
                if (Math.abs(rh) <= Proj4js.common.EPSLN) {
                    lat = this.phi0;
                } else {
                    lat = Math.asin(cosc * this.sinph0 + y * sinc * this.cosph0 / rh);
                }
                c = cosc - this.sinph0 * Math.sin(lat);
                if (c != 0. || x != 0.) {
                    lon = Math.atan2(x * sinc * this.cosph0, c * rh);
                }
                break;
            case this.N_POLE:
                y = -y;
            case this.S_POLE:
                if (Math.abs(rh) <= Proj4js.common.EPSLN) {
                    lat = this.phi0;
                } else {
                    lat = Math.asin(this.mode == this.S_POLE ? -cosc : cosc);
                }
                lon = (x == 0. && y == 0.) ? 0. : Math.atan2(x, y);
                break;
            }
            p.x = Proj4js.common.adjust_lon(lon + this.long0);
            p.y = lat;
        } else {
            rho = Math.sqrt(x * x + y * y);
            switch (this.mode) {
            case this.OBLIQ:
            case this.EQUIT:
                tp = 2. * Math.atan2(rho * this.cosX1, this.akm1);
                cosphi = Math.cos(tp);
                sinphi = Math.sin(tp);
                if (rho == 0.0) {
                    phi_l = Math.asin(cosphi * this.sinX1);
                } else {
                    phi_l = Math.asin(cosphi * this.sinX1 + (y * sinphi * this.cosX1 / rho));
                }
                tp = Math.tan(.5 * (Proj4js.common.HALF_PI + phi_l));
                x *= sinphi;
                y = rho * this.cosX1 * cosphi - y * this.sinX1 * sinphi;
                pi2 = Proj4js.common.HALF_PI;
                halfe = .5 * this.e;
                break;
            case this.N_POLE:
                y = -y;
            case this.S_POLE:
                tp = -rho / this.akm1;
                phi_l = Proj4js.common.HALF_PI - 2. * Math.atan(tp);
                pi2 = -Proj4js.common.HALF_PI;
                halfe = -.5 * this.e;
                break;
            }
            for (i = this.NITER; i--; phi_l = lat) {
                sinphi = this.e * Math.sin(phi_l);
                lat = 2. * Math.atan(tp * Math.pow((1. + sinphi) / (1. - sinphi), halfe)) - pi2;
                if (Math.abs(phi_l - lat) < this.CONV) {
                    if (this.mode == this.S_POLE) lat = -lat;
                    lon = (x == 0. && y == 0.) ? 0. : Math.atan2(x, y);
                    p.x = Proj4js.common.adjust_lon(lon + this.long0);
                    p.y = lat;
                    return p;
                }
            }
        }
    }
};
Proj4js.Proj.nzmg = {
    iterations: 1,
    init: function () {
        this.A = new Array();
        this.A[1] = +0.6399175073;
        this.A[2] = -0.1358797613;
        this.A[3] = +0.063294409;
        this.A[4] = -0.02526853;
        this.A[5] = +0.0117879;
        this.A[6] = -0.0055161;
        this.A[7] = +0.0026906;
        this.A[8] = -0.001333;
        this.A[9] = +0.00067;
        this.A[10] = -0.00034;
        this.B_re = new Array();
        this.B_im = new Array();
        this.B_re[1] = +0.7557853228;
        this.B_im[1] = 0.0;
        this.B_re[2] = +0.249204646;
        this.B_im[2] = +0.003371507;
        this.B_re[3] = -0.001541739;
        this.B_im[3] = +0.041058560;
        this.B_re[4] = -0.10162907;
        this.B_im[4] = +0.01727609;
        this.B_re[5] = -0.26623489;
        this.B_im[5] = -0.36249218;
        this.B_re[6] = -0.6870983;
        this.B_im[6] = -1.1651967;
        this.C_re = new Array();
        this.C_im = new Array();
        this.C_re[1] = +1.3231270439;
        this.C_im[1] = 0.0;
        this.C_re[2] = -0.577245789;
        this.C_im[2] = -0.007809598;
        this.C_re[3] = +0.508307513;
        this.C_im[3] = -0.112208952;
        this.C_re[4] = -0.15094762;
        this.C_im[4] = +0.18200602;
        this.C_re[5] = +1.01418179;
        this.C_im[5] = +1.64497696;
        this.C_re[6] = +1.9660549;
        this.C_im[6] = +2.5127645;
        this.D = new Array();
        this.D[1] = +1.5627014243;
        this.D[2] = +0.5185406398;
        this.D[3] = -0.03333098;
        this.D[4] = -0.1052906;
        this.D[5] = -0.0368594;
        this.D[6] = +0.007317;
        this.D[7] = +0.01220;
        this.D[8] = +0.00394;
        this.D[9] = -0.0013;
    },
    forward: function (p) {
        var lon = p.x;
        var lat = p.y;
        var delta_lat = lat - this.lat0;
        var delta_lon = lon - this.long0;
        var d_phi = delta_lat / Proj4js.common.SEC_TO_RAD * 1E-5;
        var d_lambda = delta_lon;
        var d_phi_n = 1;
        var d_psi = 0;
        for (var n = 1; n <= 10; n++) {
            d_phi_n = d_phi_n * d_phi;
            d_psi = d_psi + this.A[n] * d_phi_n;
        }
        var th_re = d_psi;
        var th_im = d_lambda;
        var th_n_re = 1;
        var th_n_im = 0;
        var th_n_re1;
        var th_n_im1;
        var z_re = 0;
        var z_im = 0;
        for (var n = 1; n <= 6; n++) {
            th_n_re1 = th_n_re * th_re - th_n_im * th_im;
            th_n_im1 = th_n_im * th_re + th_n_re * th_im;
            th_n_re = th_n_re1;
            th_n_im = th_n_im1;
            z_re = z_re + this.B_re[n] * th_n_re - this.B_im[n] * th_n_im;
            z_im = z_im + this.B_im[n] * th_n_re + this.B_re[n] * th_n_im;
        }
        p.x = (z_im * this.a) + this.x0;
        p.y = (z_re * this.a) + this.y0;
        return p;
    },
    inverse: function (p) {
        var x = p.x;
        var y = p.y;
        var delta_x = x - this.x0;
        var delta_y = y - this.y0;
        var z_re = delta_y / this.a;
        var z_im = delta_x / this.a;
        var z_n_re = 1;
        var z_n_im = 0;
        var z_n_re1;
        var z_n_im1;
        var th_re = 0;
        var th_im = 0;
        for (var n = 1; n <= 6; n++) {
            z_n_re1 = z_n_re * z_re - z_n_im * z_im;
            z_n_im1 = z_n_im * z_re + z_n_re * z_im;
            z_n_re = z_n_re1;
            z_n_im = z_n_im1;
            th_re = th_re + this.C_re[n] * z_n_re - this.C_im[n] * z_n_im;
            th_im = th_im + this.C_im[n] * z_n_re + this.C_re[n] * z_n_im;
        }
        for (var i = 0; i < this.iterations; i++) {
            var th_n_re = th_re;
            var th_n_im = th_im;
            var th_n_re1;
            var th_n_im1;
            var num_re = z_re;
            var num_im = z_im;
            for (var n = 2; n <= 6; n++) {
                th_n_re1 = th_n_re * th_re - th_n_im * th_im;
                th_n_im1 = th_n_im * th_re + th_n_re * th_im;
                th_n_re = th_n_re1;
                th_n_im = th_n_im1;
                num_re = num_re + (n - 1) * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
                num_im = num_im + (n - 1) * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
            }
            th_n_re = 1;
            th_n_im = 0;
            var den_re = this.B_re[1];
            var den_im = this.B_im[1];
            for (var n = 2; n <= 6; n++) {
                th_n_re1 = th_n_re * th_re - th_n_im * th_im;
                th_n_im1 = th_n_im * th_re + th_n_re * th_im;
                th_n_re = th_n_re1;
                th_n_im = th_n_im1;
                den_re = den_re + n * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
                den_im = den_im + n * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
            }
            var den2 = den_re * den_re + den_im * den_im;
            th_re = (num_re * den_re + num_im * den_im) / den2;
            th_im = (num_im * den_re - num_re * den_im) / den2;
        }
        var d_psi = th_re;
        var d_lambda = th_im;
        var d_psi_n = 1;
        var d_phi = 0;
        for (var n = 1; n <= 9; n++) {
            d_psi_n = d_psi_n * d_psi;
            d_phi = d_phi + this.D[n] * d_psi_n;
        }
        var lat = this.lat0 + (d_phi * Proj4js.common.SEC_TO_RAD * 1E5);
        var lon = this.long0 + d_lambda;
        p.x = lon;
        p.y = lat;
        return p;
    }
};
Proj4js.Proj.mill = {
    init: function () {},
    forward: function (p) {
        var lon = p.x;
        var lat = p.y;
        var dlon = Proj4js.common.adjust_lon(lon - this.long0);
        var x = this.x0 + this.a * dlon;
        var y = this.y0 + this.a * Math.log(Math.tan((Proj4js.common.PI / 4.0) + (lat / 2.5))) * 1.25;
        p.x = x;
        p.y = y;
        return p;
    },
    inverse: function (p) {
        p.x -= this.x0;
        p.y -= this.y0;
        var lon = Proj4js.common.adjust_lon(this.long0 + p.x / this.a);
        var lat = 2.5 * (Math.atan(Math.exp(0.8 * p.y / this.a)) - Proj4js.common.PI / 4.0);
        p.x = lon;
        p.y = lat;
        return p;
    }
};
Proj4js.Proj.gnom = {
    init: function (def) {
        this.sin_p14 = Math.sin(this.lat0);
        this.cos_p14 = Math.cos(this.lat0);
        this.infinity_dist = 1000 * this.a;
        this.rc = 1;
    },
    forward: function (p) {
        var sinphi, cosphi;
        var dlon;
        var coslon;
        var ksp;
        var g;
        var x, y;
        var lon = p.x;
        var lat = p.y;
        dlon = Proj4js.common.adjust_lon(lon - this.long0);
        sinphi = Math.sin(lat);
        cosphi = Math.cos(lat);
        coslon = Math.cos(dlon);
        g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
        ksp = 1.0;
        if ((g > 0) || (Math.abs(g) <= Proj4js.common.EPSLN)) {
            x = this.x0 + this.a * ksp * cosphi * Math.sin(dlon) / g;
            y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon) / g;
        } else {
            Proj4js.reportError("orthoFwdPointError");
            x = this.x0 + this.infinity_dist * cosphi * Math.sin(dlon);
            y = this.y0 + this.infinity_dist * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);
        }
        p.x = x;
        p.y = y;
        return p;
    },
    inverse: function (p) {
        var rh;
        var z;
        var sinc, cosc;
        var c;
        var lon, lat;
        p.x = (p.x - this.x0) / this.a;
        p.y = (p.y - this.y0) / this.a;
        p.x /= this.k0;
        p.y /= this.k0;
        if ((rh = Math.sqrt(p.x * p.x + p.y * p.y))) {
            c = Math.atan2(rh, this.rc);
            sinc = Math.sin(c);
            cosc = Math.cos(c);
            lat = Proj4js.common.asinz(cosc * this.sin_p14 + (p.y * sinc * this.cos_p14) / rh);
            lon = Math.atan2(p.x * sinc, rh * this.cos_p14 * cosc - p.y * this.sin_p14 * sinc);
            lon = Proj4js.common.adjust_lon(this.long0 + lon);
        } else {
            lat = this.phic0;
            lon = 0.0;
        }
        p.x = lon;
        p.y = lat;
        return p;
    }
};
Proj4js.Proj.sinu = {
    init: function () {
        if (!this.sphere) {
            this.en = Proj4js.common.pj_enfn(this.es);
        } else {
            this.n = 1.;
            this.m = 0.;
            this.es = 0;
            this.C_y = Math.sqrt((this.m + 1.) / this.n);
            this.C_x = this.C_y / (this.m + 1.);
        }
    },
    forward: function (p) {
        var x, y, delta_lon;
        var lon = p.x;
        var lat = p.y;
        lon = Proj4js.common.adjust_lon(lon - this.long0);
        if (this.sphere) {
            if (!this.m) {
                lat = this.n != 1. ? Math.asin(this.n * Math.sin(lat)) : lat;
            } else {
                var k = this.n * Math.sin(lat);
                for (var i = Proj4js.common.MAX_ITER; i; --i) {
                    var V = (this.m * lat + Math.sin(lat) - k) / (this.m + Math.cos(lat));
                    lat -= V;
                    if (Math.abs(V) < Proj4js.common.EPSLN) break;
                }
            }
            x = this.a * this.C_x * lon * (this.m + Math.cos(lat));
            y = this.a * this.C_y * lat;
        } else {
            var s = Math.sin(lat);
            var c = Math.cos(lat);
            y = this.a * Proj4js.common.pj_mlfn(lat, s, c, this.en);
            x = this.a * lon * c / Math.sqrt(1. - this.es * s * s);
        }
        p.x = x;
        p.y = y;
        return p;
    },
    inverse: function (p) {
        var lat, temp, lon;
        p.x -= this.x0;
        p.y -= this.y0;
        lat = p.y / this.a;
        if (this.sphere) {
            p.y /= this.C_y;
            lat = this.m ? Math.asin((this.m * p.y + Math.sin(p.y)) / this.n) : (this.n != 1. ? Math.asin(Math.sin(p.y) / this.n) : p.y);
            lon = p.x / (this.C_x * (this.m + Math.cos(p.y)));
        } else {
            lat = Proj4js.common.pj_inv_mlfn(p.y / this.a, this.es, this.en)
            var s = Math.abs(lat);
            if (s < Proj4js.common.HALF_PI) {
                s = Math.sin(lat);
                temp = this.long0 + p.x * Math.sqrt(1. - this.es * s * s) / (this.a * Math.cos(lat));
                lon = Proj4js.common.adjust_lon(temp);
            } else if ((s - Proj4js.common.EPSLN) < Proj4js.common.HALF_PI) {
                lon = this.long0;
            }
        }
        p.x = lon;
        p.y = lat;
        return p;
    }
};
Proj4js.Proj.vandg = {
    init: function () {
        this.R = 6370997.0;
    },
    forward: function (p) {
        var lon = p.x;
        var lat = p.y;
        var dlon = Proj4js.common.adjust_lon(lon - this.long0);
        var x, y;
        if (Math.abs(lat) <= Proj4js.common.EPSLN) {
            x = this.x0 + this.R * dlon;
            y = this.y0;
        }
        var theta = Proj4js.common.asinz(2.0 * Math.abs(lat / Proj4js.common.PI));
        if ((Math.abs(dlon) <= Proj4js.common.EPSLN) || (Math.abs(Math.abs(lat) - Proj4js.common.HALF_PI) <= Proj4js.common.EPSLN)) {
            x = this.x0;
            if (lat >= 0) {
                y = this.y0 + Proj4js.common.PI * this.R * Math.tan(.5 * theta);
            } else {
                y = this.y0 + Proj4js.common.PI * this.R * -Math.tan(.5 * theta);
            }
        }
        var al = .5 * Math.abs((Proj4js.common.PI / dlon) - (dlon / Proj4js.common.PI));
        var asq = al * al;
        var sinth = Math.sin(theta);
        var costh = Math.cos(theta);
        var g = costh / (sinth + costh - 1.0);
        var gsq = g * g;
        var m = g * (2.0 / sinth - 1.0);
        var msq = m * m;
        var con = Proj4js.common.PI * this.R * (al * (g - msq) + Math.sqrt(asq * (g - msq) * (g - msq) - (msq + asq) * (gsq - msq))) / (msq + asq);
        if (dlon < 0) {
            con = -con;
        }
        x = this.x0 + con;
        con = Math.abs(con / (Proj4js.common.PI * this.R));
        if (lat >= 0) {
            y = this.y0 + Proj4js.common.PI * this.R * Math.sqrt(1.0 - con * con - 2.0 * al * con);
        } else {
            y = this.y0 - Proj4js.common.PI * this.R * Math.sqrt(1.0 - con * con - 2.0 * al * con);
        }
        p.x = x;
        p.y = y;
        return p;
    },
    inverse: function (p) {
        var lon, lat;
        var xx, yy, xys, c1, c2, c3;
        var al, asq;
        var a1;
        var m1;
        var con;
        var th1;
        var d;
        p.x -= this.x0;
        p.y -= this.y0;
        con = Proj4js.common.PI * this.R;
        xx = p.x / con;
        yy = p.y / con;
        xys = xx * xx + yy * yy;
        c1 = -Math.abs(yy) * (1.0 + xys);
        c2 = c1 - 2.0 * yy * yy + xx * xx;
        c3 = -2.0 * c1 + 1.0 + 2.0 * yy * yy + xys * xys;
        d = yy * yy / c3 + (2.0 * c2 * c2 * c2 / c3 / c3 / c3 - 9.0 * c1 * c2 / c3 / c3) / 27.0;
        a1 = (c1 - c2 * c2 / 3.0 / c3) / c3;
        m1 = 2.0 * Math.sqrt(-a1 / 3.0);
        con = ((3.0 * d) / a1) / m1;
        if (Math.abs(con) > 1.0) {
            if (con >= 0.0) {
                con = 1.0;
            } else {
                con = -1.0;
            }
        }
        th1 = Math.acos(con) / 3.0;
        if (p.y >= 0) {
            lat = (-m1 * Math.cos(th1 + Proj4js.common.PI / 3.0) - c2 / 3.0 / c3) * Proj4js.common.PI;
        } else {
            lat = -(-m1 * Math.cos(th1 + Proj4js.common.PI / 3.0) - c2 / 3.0 / c3) * Proj4js.common.PI;
        }
        if (Math.abs(xx) < Proj4js.common.EPSLN) {
            lon = this.long0;
        }
        lon = Proj4js.common.adjust_lon(this.long0 + Proj4js.common.PI * (xys - 1.0 + Math.sqrt(1.0 + 2.0 * (xx * xx - yy * yy) + xys * xys)) / 2.0 / xx);
        p.x = lon;
        p.y = lat;
        return p;
    }
};
Proj4js.Proj.cea = {
    init: function () {},
    forward: function (p) {
        var lon = p.x;
        var lat = p.y;
        var dlon = Proj4js.common.adjust_lon(lon - this.long0);
        var x = this.x0 + this.a * dlon * Math.cos(this.lat_ts);
        var y = this.y0 + this.a * Math.sin(lat) / Math.cos(this.lat_ts);
        p.x = x;
        p.y = y;
        return p;
    },
    inverse: function (p) {
        p.x -= this.x0;
        p.y -= this.y0;
        var lon = Proj4js.common.adjust_lon(this.long0 + (p.x / this.a) / Math.cos(this.lat_ts));
        var lat = Math.asin((p.y / this.a) * Math.cos(this.lat_ts));
        p.x = lon;
        p.y = lat;
        return p;
    }
};
Proj4js.Proj.eqc = {
    init: function () {
        if (!this.x0) this.x0 = 0;
        if (!this.y0) this.y0 = 0;
        if (!this.lat0) this.lat0 = 0;
        if (!this.long0) this.long0 = 0;
        if (!this.lat_ts) this.lat_ts = 0;
        if (!this.title) this.title = "Equidistant Cylindrical (Plate Carre)";
        this.rc = Math.cos(this.lat_ts);
    },
    forward: function (p) {
        var lon = p.x;
        var lat = p.y;
        var dlon = Proj4js.common.adjust_lon(lon - this.long0);
        var dlat = Proj4js.common.adjust_lat(lat - this.lat0);
        p.x = this.x0 + (this.a * dlon * this.rc);
        p.y = this.y0 + (this.a * dlat);
        return p;
    },
    inverse: function (p) {
        var x = p.x;
        var y = p.y;
        p.x = Proj4js.common.adjust_lon(this.long0 + ((x - this.x0) / (this.a * this.rc)));
        p.y = Proj4js.common.adjust_lat(this.lat0 + ((y - this.y0) / (this.a)));
        return p;
    }
};
Proj4js.Proj.cass = {
    init: function () {
        if (!this.sphere) {
            this.en = Proj4js.common.pj_enfn(this.es)
            this.m0 = Proj4js.common.pj_mlfn(this.lat0, Math.sin(this.lat0), Math.cos(this.lat0), this.en);
        }
    },
    C1: .16666666666666666666,
    C2: .00833333333333333333,
    C3: .04166666666666666666,
    C4: .33333333333333333333,
    C5: .06666666666666666666,
    forward: function (p) {
        var x, y;
        var lam = p.x;
        var phi = p.y;
        lam = Proj4js.common.adjust_lon(lam - this.long0);
        if (this.sphere) {
            x = Math.asin(Math.cos(phi) * Math.sin(lam));
            y = Math.atan2(Math.tan(phi), Math.cos(lam)) - this.phi0;
        } else {
            this.n = Math.sin(phi);
            this.c = Math.cos(phi);
            y = Proj4js.common.pj_mlfn(phi, this.n, this.c, this.en);
            this.n = 1. / Math.sqrt(1. - this.es * this.n * this.n);
            this.tn = Math.tan(phi);
            this.t = this.tn * this.tn;
            this.a1 = lam * this.c;
            this.c *= this.es * this.c / (1 - this.es);
            this.a2 = this.a1 * this.a1;
            x = this.n * this.a1 * (1. - this.a2 * this.t * (this.C1 - (8. - this.t + 8. * this.c) * this.a2 * this.C2));
            y -= this.m0 - this.n * this.tn * this.a2 * (.5 + (5. - this.t + 6. * this.c) * this.a2 * this.C3);
        }
        p.x = this.a * x + this.x0;
        p.y = this.a * y + this.y0;
        return p;
    },
    inverse: function (p) {
        p.x -= this.x0;
        p.y -= this.y0;
        var x = p.x / this.a;
        var y = p.y / this.a;
        var phi, lam;
        if (this.sphere) {
            this.dd = y + this.lat0;
            phi = Math.asin(Math.sin(this.dd) * Math.cos(x));
            lam = Math.atan2(Math.tan(x), Math.cos(this.dd));
        } else {
            var ph1 = Proj4js.common.pj_inv_mlfn(this.m0 + y, this.es, this.en);
            this.tn = Math.tan(ph1);
            this.t = this.tn * this.tn;
            this.n = Math.sin(ph1);
            this.r = 1. / (1. - this.es * this.n * this.n);
            this.n = Math.sqrt(this.r);
            this.r *= (1. - this.es) * this.n;
            this.dd = x / this.n;
            this.d2 = this.dd * this.dd;
            phi = ph1 - (this.n * this.tn / this.r) * this.d2 * (.5 - (1. + 3. * this.t) * this.d2 * this.C3);
            lam = this.dd * (1. + this.t * this.d2 * (-this.C4 + (1. + 3. * this.t) * this.d2 * this.C5)) / Math.cos(ph1);
        }
        p.x = Proj4js.common.adjust_lon(this.long0 + lam);
        p.y = phi;
        return p;
    }
}
Proj4js.Proj.gauss = {
    init: function () {
        var sphi = Math.sin(this.lat0);
        var cphi = Math.cos(this.lat0);
        cphi *= cphi;
        this.rc = Math.sqrt(1.0 - this.es) / (1.0 - this.es * sphi * sphi);
        this.C = Math.sqrt(1.0 + this.es * cphi * cphi / (1.0 - this.es));
        this.phic0 = Math.asin(sphi / this.C);
        this.ratexp = 0.5 * this.C * this.e;
        this.K = Math.tan(0.5 * this.phic0 + Proj4js.common.FORTPI) / (Math.pow(Math.tan(0.5 * this.lat0 + Proj4js.common.FORTPI), this.C) * Proj4js.common.srat(this.e * sphi, this.ratexp));
    },
    forward: function (p) {
        var lon = p.x;
        var lat = p.y;
        p.y = 2.0 * Math.atan(this.K * Math.pow(Math.tan(0.5 * lat + Proj4js.common.FORTPI), this.C) * Proj4js.common.srat(this.e * Math.sin(lat), this.ratexp)) - Proj4js.common.HALF_PI;
        p.x = this.C * lon;
        return p;
    },
    inverse: function (p) {
        var DEL_TOL = 1e-14;
        var lon = p.x / this.C;
        var lat = p.y;
        var num = Math.pow(Math.tan(0.5 * lat + Proj4js.common.FORTPI) / this.K, 1. / this.C);
        for (var i = Proj4js.common.MAX_ITER; i > 0; --i) {
            lat = 2.0 * Math.atan(num * Proj4js.common.srat(this.e * Math.sin(p.y), -0.5 * this.e)) - Proj4js.common.HALF_PI;
            if (Math.abs(lat - p.y) < DEL_TOL) break;
            p.y = lat;
        }
        if (!i) {
            Proj4js.reportError("gauss:inverse:convergence failed");
            return null;
        }
        p.x = lon;
        p.y = lat;
        return p;
    }
};
Proj4js.Proj.omerc = {
    init: function () {
        if (!this.mode) this.mode = 0;
        if (!this.lon1) {
            this.lon1 = 0;
            this.mode = 1;
        }
        if (!this.lon2) this.lon2 = 0;
        if (!this.lat2) this.lat2 = 0;
        var temp = this.b / this.a;
        var es = 1.0 - Math.pow(temp, 2);
        var e = Math.sqrt(es);
        this.sin_p20 = Math.sin(this.lat0);
        this.cos_p20 = Math.cos(this.lat0);
        this.con = 1.0 - this.es * this.sin_p20 * this.sin_p20;
        this.com = Math.sqrt(1.0 - es);
        this.bl = Math.sqrt(1.0 + this.es * Math.pow(this.cos_p20, 4.0) / (1.0 - es));
        this.al = this.a * this.bl * this.k0 * this.com / this.con;
        if (Math.abs(this.lat0) < Proj4js.common.EPSLN) {
            this.ts = 1.0;
            this.d = 1.0;
            this.el = 1.0;
        } else {
            this.ts = Proj4js.common.tsfnz(this.e, this.lat0, this.sin_p20);
            this.con = Math.sqrt(this.con);
            this.d = this.bl * this.com / (this.cos_p20 * this.con);
            if ((this.d * this.d - 1.0) > 0.0) {
                if (this.lat0 >= 0.0) {
                    this.f = this.d + Math.sqrt(this.d * this.d - 1.0);
                } else {
                    this.f = this.d - Math.sqrt(this.d * this.d - 1.0);
                }
            } else {
                this.f = this.d;
            }
            this.el = this.f * Math.pow(this.ts, this.bl);
        }
        if (this.mode != 0) {
            this.g = .5 * (this.f - 1.0 / this.f);
            this.gama = Proj4js.common.asinz(Math.sin(this.alpha) / this.d);
            this.longc = this.longc - Proj4js.common.asinz(this.g * Math.tan(this.gama)) / this.bl;
            this.con = Math.abs(this.lat0);
            if ((this.con > Proj4js.common.EPSLN) && (Math.abs(this.con - Proj4js.common.HALF_PI) > Proj4js.common.EPSLN)) {
                this.singam = Math.sin(this.gama);
                this.cosgam = Math.cos(this.gama);
                this.sinaz = Math.sin(this.alpha);
                this.cosaz = Math.cos(this.alpha);
                if (this.lat0 >= 0) {
                    this.u = (this.al / this.bl) * Math.atan(Math.sqrt(this.d * this.d - 1.0) / this.cosaz);
                } else {
                    this.u = -(this.al / this.bl) * Math.atan(Math.sqrt(this.d * this.d - 1.0) / this.cosaz);
                }
            } else {
                Proj4js.reportError("omerc:Init:DataError");
            }
        } else {
            this.sinphi = Math.sin(this.at1);
            this.ts1 = Proj4js.common.tsfnz(this.e, this.lat1, this.sinphi);
            this.sinphi = Math.sin(this.lat2);
            this.ts2 = Proj4js.common.tsfnz(this.e, this.lat2, this.sinphi);
            this.h = Math.pow(this.ts1, this.bl);
            this.l = Math.pow(this.ts2, this.bl);
            this.f = this.el / this.h;
            this.g = .5 * (this.f - 1.0 / this.f);
            this.j = (this.el * this.el - this.l * this.h) / (this.el * this.el + this.l * this.h);
            this.p = (this.l - this.h) / (this.l + this.h);
            this.dlon = this.lon1 - this.lon2;
            if (this.dlon < -Proj4js.common.PI) this.lon2 = this.lon2 - 2.0 * Proj4js.common.PI;
            if (this.dlon > Proj4js.common.PI) this.lon2 = this.lon2 + 2.0 * Proj4js.common.PI;
            this.dlon = this.lon1 - this.lon2;
            this.longc = .5 * (this.lon1 + this.lon2) - Math.atan(this.j * Math.tan(.5 * this.bl * this.dlon) / this.p) / this.bl;
            this.dlon = Proj4js.common.adjust_lon(this.lon1 - this.longc);
            this.gama = Math.atan(Math.sin(this.bl * this.dlon) / this.g);
            this.alpha = Proj4js.common.asinz(this.d * Math.sin(this.gama));
            if (Math.abs(this.lat1 - this.lat2) <= Proj4js.common.EPSLN) {
                Proj4js.reportError("omercInitDataError");
            } else {
                this.con = Math.abs(this.lat1);
            }
            if ((this.con <= Proj4js.common.EPSLN) || (Math.abs(this.con - Proj4js.common.HALF_PI) <= Proj4js.common.EPSLN)) {
                Proj4js.reportError("omercInitDataError");
            } else {
                if (Math.abs(Math.abs(this.lat0) - Proj4js.common.HALF_PI) <= Proj4js.common.EPSLN) {
                    Proj4js.reportError("omercInitDataError");
                }
            }
            this.singam = Math.sin(this.gam);
            this.cosgam = Math.cos(this.gam);
            this.sinaz = Math.sin(this.alpha);
            this.cosaz = Math.cos(this.alpha);
            if (this.lat0 >= 0) {
                this.u = (this.al / this.bl) * Math.atan(Math.sqrt(this.d * this.d - 1.0) / this.cosaz);
            } else {
                this.u = -(this.al / this.bl) * Math.atan(Math.sqrt(this.d * this.d - 1.0) / this.cosaz);
            }
        }
    },
    forward: function (p) {
        var theta;
        var sin_phi, cos_phi;
        var b;
        var c, t, tq;
        var con, n, ml;
        var q, us, vl;
        var ul, vs;
        var s;
        var dlon;
        var ts1;
        var lon = p.x;
        var lat = p.y;
        sin_phi = Math.sin(lat);
        dlon = Proj4js.common.adjust_lon(lon - this.longc);
        vl = Math.sin(this.bl * dlon);
        if (Math.abs(Math.abs(lat) - Proj4js.common.HALF_PI) > Proj4js.common.EPSLN) {
            ts1 = Proj4js.common.tsfnz(this.e, lat, sin_phi);
            q = this.el / (Math.pow(ts1, this.bl));
            s = .5 * (q - 1.0 / q);
            t = .5 * (q + 1.0 / q);
            ul = (s * this.singam - vl * this.cosgam) / t;
            con = Math.cos(this.bl * dlon);
            if (Math.abs(con) < .0000001) {
                us = this.al * this.bl * dlon;
            } else {
                us = this.al * Math.atan((s * this.cosgam + vl * this.singam) / con) / this.bl;
                if (con < 0) us = us + Proj4js.common.PI * this.al / this.bl;
            }
        } else {
            if (lat >= 0) {
                ul = this.singam;
            } else {
                ul = -this.singam;
            }
            us = this.al * lat / this.bl;
        }
        if (Math.abs(Math.abs(ul) - 1.0) <= Proj4js.common.EPSLN) {
            Proj4js.reportError("omercFwdInfinity");
        }
        vs = .5 * this.al * Math.log((1.0 - ul) / (1.0 + ul)) / this.bl;
        us = us - this.u;
        var x = this.x0 + vs * this.cosaz + us * this.sinaz;
        var y = this.y0 + us * this.cosaz - vs * this.sinaz;
        p.x = x;
        p.y = y;
        return p;
    },
    inverse: function (p) {
        var delta_lon;
        var theta;
        var delta_theta;
        var sin_phi, cos_phi;
        var b;
        var c, t, tq;
        var con, n, ml;
        var vs, us, q, s, ts1;
        var vl, ul, bs;
        var lon, lat;
        var flag;
        p.x -= this.x0;
        p.y -= this.y0;
        flag = 0;
        vs = p.x * this.cosaz - p.y * this.sinaz;
        us = p.y * this.cosaz + p.x * this.sinaz;
        us = us + this.u;
        q = Math.exp(-this.bl * vs / this.al);
        s = .5 * (q - 1.0 / q);
        t = .5 * (q + 1.0 / q);
        vl = Math.sin(this.bl * us / this.al);
        ul = (vl * this.cosgam + s * this.singam) / t;
        if (Math.abs(Math.abs(ul) - 1.0) <= Proj4js.common.EPSLN) {
            lon = this.longc;
            if (ul >= 0.0) {
                lat = Proj4js.common.HALF_PI;
            } else {
                lat = -Proj4js.common.HALF_PI;
            }
        } else {
            con = 1.0 / this.bl;
            ts1 = Math.pow((this.el / Math.sqrt((1.0 + ul) / (1.0 - ul))), con);
            lat = Proj4js.common.phi2z(this.e, ts1);
            theta = this.longc - Math.atan2((s * this.cosgam - vl * this.singam), con) / this.bl;
            lon = Proj4js.common.adjust_lon(theta);
        }
        p.x = lon;
        p.y = lat;
        return p;
    }
};
Proj4js.Proj.lcc = {
    init: function () {
        if (!this.lat2) {
            this.lat2 = this.lat0;
        }
        if (!this.k0) this.k0 = 1.0;
        if (Math.abs(this.lat1 + this.lat2) < Proj4js.common.EPSLN) {
            Proj4js.reportError("lcc:init: Equal Latitudes");
            return;
        }
        var temp = this.b / this.a;
        this.e = Math.sqrt(1.0 - temp * temp);
        var sin1 = Math.sin(this.lat1);
        var cos1 = Math.cos(this.lat1);
        var ms1 = Proj4js.common.msfnz(this.e, sin1, cos1);
        var ts1 = Proj4js.common.tsfnz(this.e, this.lat1, sin1);
        var sin2 = Math.sin(this.lat2);
        var cos2 = Math.cos(this.lat2);
        var ms2 = Proj4js.common.msfnz(this.e, sin2, cos2);
        var ts2 = Proj4js.common.tsfnz(this.e, this.lat2, sin2);
        var ts0 = Proj4js.common.tsfnz(this.e, this.lat0, Math.sin(this.lat0));
        if (Math.abs(this.lat1 - this.lat2) > Proj4js.common.EPSLN) {
            this.ns = Math.log(ms1 / ms2) / Math.log(ts1 / ts2);
        } else {
            this.ns = sin1;
        }
        this.f0 = ms1 / (this.ns * Math.pow(ts1, this.ns));
        this.rh = this.a * this.f0 * Math.pow(ts0, this.ns);
        if (!this.title) this.title = "Lambert Conformal Conic";
    },
    forward: function (p) {
        var lon = p.x;
        var lat = p.y;
        if (lat <= 90.0 && lat >= -90.0 && lon <= 180.0 && lon >= -180.0) {} else {
            Proj4js.reportError("lcc:forward: llInputOutOfRange: " + lon + " : " + lat);
            return null;
        }
        var con = Math.abs(Math.abs(lat) - Proj4js.common.HALF_PI);
        var ts, rh1;
        if (con > Proj4js.common.EPSLN) {
            ts = Proj4js.common.tsfnz(this.e, lat, Math.sin(lat));
            rh1 = this.a * this.f0 * Math.pow(ts, this.ns);
        } else {
            con = lat * this.ns;
            if (con <= 0) {
                Proj4js.reportError("lcc:forward: No Projection");
                return null;
            }
            rh1 = 0;
        }
        var theta = this.ns * Proj4js.common.adjust_lon(lon - this.long0);
        p.x = this.k0 * (rh1 * Math.sin(theta)) + this.x0;
        p.y = this.k0 * (this.rh - rh1 * Math.cos(theta)) + this.y0;
        return p;
    },
    inverse: function (p) {
        var rh1, con, ts;
        var lat, lon;
        var x = (p.x - this.x0) / this.k0;
        var y = (this.rh - (p.y - this.y0) / this.k0);
        if (this.ns > 0) {
            rh1 = Math.sqrt(x * x + y * y);
            con = 1.0;
        } else {
            rh1 = -Math.sqrt(x * x + y * y);
            con = -1.0;
        }
        var theta = 0.0;
        if (rh1 != 0) {
            theta = Math.atan2((con * x), (con * y));
        }
        if ((rh1 != 0) || (this.ns > 0.0)) {
            con = 1.0 / this.ns;
            ts = Math.pow((rh1 / (this.a * this.f0)), con);
            lat = Proj4js.common.phi2z(this.e, ts);
            if (lat == -9999) return null;
        } else {
            lat = -Proj4js.common.HALF_PI;
        }
        lon = Proj4js.common.adjust_lon(theta / this.ns + this.long0);
        p.x = lon;
        p.y = lat;
        return p;
    }
};
Proj4js.Proj.laea = {
    S_POLE: 1,
    N_POLE: 2,
    EQUIT: 3,
    OBLIQ: 4,
    init: function () {
        var t = Math.abs(this.lat0);
        if (Math.abs(t - Proj4js.common.HALF_PI) < Proj4js.common.EPSLN) {
            this.mode = this.lat0 < 0. ? this.S_POLE : this.N_POLE;
        } else if (Math.abs(t) < Proj4js.common.EPSLN) {
            this.mode = this.EQUIT;
        } else {
            this.mode = this.OBLIQ;
        }
        if (this.es > 0) {
            var sinphi;
            this.qp = Proj4js.common.qsfnz(this.e, 1.0);
            this.mmf = .5 / (1. - this.es);
            this.apa = this.authset(this.es);
            switch (this.mode) {
            case this.N_POLE:
            case this.S_POLE:
                this.dd = 1.;
                break;
            case this.EQUIT:
                this.rq = Math.sqrt(.5 * this.qp);
                this.dd = 1. / this.rq;
                this.xmf = 1.;
                this.ymf = .5 * this.qp;
                break;
            case this.OBLIQ:
                this.rq = Math.sqrt(.5 * this.qp);
                sinphi = Math.sin(this.lat0);
                this.sinb1 = Proj4js.common.qsfnz(this.e, sinphi) / this.qp;
                this.cosb1 = Math.sqrt(1. - this.sinb1 * this.sinb1);
                this.dd = Math.cos(this.lat0) / (Math.sqrt(1. - this.es * sinphi * sinphi) * this.rq * this.cosb1);
                this.ymf = (this.xmf = this.rq) / this.dd;
                this.xmf *= this.dd;
                break;
            }
        } else {
            if (this.mode == this.OBLIQ) {
                this.sinph0 = Math.sin(this.lat0);
                this.cosph0 = Math.cos(this.lat0);
            }
        }
    },
    forward: function (p) {
        var x, y;
        var lam = p.x;
        var phi = p.y;
        lam = Proj4js.common.adjust_lon(lam - this.long0);
        if (this.sphere) {
            var coslam, cosphi, sinphi;
            sinphi = Math.sin(phi);
            cosphi = Math.cos(phi);
            coslam = Math.cos(lam);
            switch (this.mode) {
            case this.OBLIQ:
            case this.EQUIT:
                y = (this.mode == this.EQUIT) ? 1. + cosphi * coslam : 1. + this.sinph0 * sinphi + this.cosph0 * cosphi * coslam;
                if (y <= Proj4js.common.EPSLN) {
                    Proj4js.reportError("laea:fwd:y less than eps");
                    return null;
                }
                y = Math.sqrt(2. / y);
                x = y * cosphi * Math.sin(lam);
                y *= (this.mode == this.EQUIT) ? sinphi : this.cosph0 * sinphi - this.sinph0 * cosphi * coslam;
                break;
            case this.N_POLE:
                coslam = -coslam;
            case this.S_POLE:
                if (Math.abs(phi + this.phi0) < Proj4js.common.EPSLN) {
                    Proj4js.reportError("laea:fwd:phi < eps");
                    return null;
                }
                y = Proj4js.common.FORTPI - phi * .5;
                y = 2. * ((this.mode == this.S_POLE) ? Math.cos(y) : Math.sin(y));
                x = y * Math.sin(lam);
                y *= coslam;
                break;
            }
        } else {
            var coslam, sinlam, sinphi, q, sinb = 0.0,
                cosb = 0.0,
                b = 0.0;
            coslam = Math.cos(lam);
            sinlam = Math.sin(lam);
            sinphi = Math.sin(phi);
            q = Proj4js.common.qsfnz(this.e, sinphi);
            if (this.mode == this.OBLIQ || this.mode == this.EQUIT) {
                sinb = q / this.qp;
                cosb = Math.sqrt(1. - sinb * sinb);
            }
            switch (this.mode) {
            case this.OBLIQ:
                b = 1. + this.sinb1 * sinb + this.cosb1 * cosb * coslam;
                break;
            case this.EQUIT:
                b = 1. + cosb * coslam;
                break;
            case this.N_POLE:
                b = Proj4js.common.HALF_PI + phi;
                q = this.qp - q;
                break;
            case this.S_POLE:
                b = phi - Proj4js.common.HALF_PI;
                q = this.qp + q;
                break;
            }
            if (Math.abs(b) < Proj4js.common.EPSLN) {
                Proj4js.reportError("laea:fwd:b < eps");
                return null;
            }
            switch (this.mode) {
            case this.OBLIQ:
            case this.EQUIT:
                b = Math.sqrt(2. / b);
                if (this.mode == this.OBLIQ) {
                    y = this.ymf * b * (this.cosb1 * sinb - this.sinb1 * cosb * coslam);
                } else {
                    y = (b = Math.sqrt(2. / (1. + cosb * coslam))) * sinb * this.ymf;
                }
                x = this.xmf * b * cosb * sinlam;
                break;
            case this.N_POLE:
            case this.S_POLE:
                if (q >= 0.) {
                    x = (b = Math.sqrt(q)) * sinlam;
                    y = coslam * ((this.mode == this.S_POLE) ? b : -b);
                } else {
                    x = y = 0.;
                }
                break;
            }
        }
        p.x = this.a * x + this.x0;
        p.y = this.a * y + this.y0;
        return p;
    },
    inverse: function (p) {
        p.x -= this.x0;
        p.y -= this.y0;
        var x = p.x / this.a;
        var y = p.y / this.a;
        var lam, phi;
        if (this.sphere) {
            var cosz = 0.0,
                rh, sinz = 0.0;
            rh = Math.sqrt(x * x + y * y);
            phi = rh * .5;
            if (phi > 1.) {
                Proj4js.reportError("laea:Inv:DataError");
                return null;
            }
            phi = 2. * Math.asin(phi);
            if (this.mode == this.OBLIQ || this.mode == this.EQUIT) {
                sinz = Math.sin(phi);
                cosz = Math.cos(phi);
            }
            switch (this.mode) {
            case this.EQUIT:
                phi = (Math.abs(rh) <= Proj4js.common.EPSLN) ? 0. : Math.asin(y * sinz / rh);
                x *= sinz;
                y = cosz * rh;
                break;
            case this.OBLIQ:
                phi = (Math.abs(rh) <= Proj4js.common.EPSLN) ? this.phi0 : Math.asin(cosz * this.sinph0 + y * sinz * this.cosph0 / rh);
                x *= sinz * this.cosph0;
                y = (cosz - Math.sin(phi) * this.sinph0) * rh;
                break;
            case this.N_POLE:
                y = -y;
                phi = Proj4js.common.HALF_PI - phi;
                break;
            case this.S_POLE:
                phi -= Proj4js.common.HALF_PI;
                break;
            }
            lam = (y == 0. && (this.mode == this.EQUIT || this.mode == this.OBLIQ)) ? 0. : Math.atan2(x, y);
        } else {
            var cCe, sCe, q, rho, ab = 0.0;
            switch (this.mode) {
            case this.EQUIT:
            case this.OBLIQ:
                x /= this.dd;
                y *= this.dd;
                rho = Math.sqrt(x * x + y * y);
                if (rho < Proj4js.common.EPSLN) {
                    p.x = 0.;
                    p.y = this.phi0;
                    return p;
                }
                sCe = 2. * Math.asin(.5 * rho / this.rq);
                cCe = Math.cos(sCe);
                x *= (sCe = Math.sin(sCe));
                if (this.mode == this.OBLIQ) {
                    ab = cCe * this.sinb1 + y * sCe * this.cosb1 / rho
                    q = this.qp * ab;
                    y = rho * this.cosb1 * cCe - y * this.sinb1 * sCe;
                } else {
                    ab = y * sCe / rho;
                    q = this.qp * ab;
                    y = rho * cCe;
                }
                break;
            case this.N_POLE:
                y = -y;
            case this.S_POLE:
                q = (x * x + y * y);
                if (!q) {
                    p.x = 0.;
                    p.y = this.phi0;
                    return p;
                }
                ab = 1. - q / this.qp;
                if (this.mode == this.S_POLE) {
                    ab = -ab;
                }
                break;
            }
            lam = Math.atan2(x, y);
            phi = this.authlat(Math.asin(ab), this.apa);
        }
        p.x = Proj4js.common.adjust_lon(this.long0 + lam);
        p.y = phi;
        return p;
    },
    P00: .33333333333333333333,
    P01: .17222222222222222222,
    P02: .10257936507936507936,
    P10: .06388888888888888888,
    P11: .06640211640211640211,
    P20: .01641501294219154443,
    authset: function (es) {
        var t;
        var APA = new Array();
        APA[0] = es * this.P00;
        t = es * es;
        APA[0] += t * this.P01;
        APA[1] = t * this.P10;
        t *= es;
        APA[0] += t * this.P02;
        APA[1] += t * this.P11;
        APA[2] = t * this.P20;
        return APA;
    },
    authlat: function (beta, APA) {
        var t = beta + beta;
        return (beta + APA[0] * Math.sin(t) + APA[1] * Math.sin(t + t) + APA[2] * Math.sin(t + t + t));
    }
};
Proj4js.Proj.aeqd = {
    init: function () {
        this.sin_p12 = Math.sin(this.lat0);
        this.cos_p12 = Math.cos(this.lat0);
    },
    forward: function (p) {
        var lon = p.x;
        var lat = p.y;
        var ksp;
        var sinphi = Math.sin(p.y);
        var cosphi = Math.cos(p.y);
        var dlon = Proj4js.common.adjust_lon(lon - this.long0);
        var coslon = Math.cos(dlon);
        var g = this.sin_p12 * sinphi + this.cos_p12 * cosphi * coslon;
        if (Math.abs(Math.abs(g) - 1.0) < Proj4js.common.EPSLN) {
            ksp = 1.0;
            if (g < 0.0) {
                Proj4js.reportError("aeqd:Fwd:PointError");
                return;
            }
        } else {
            var z = Math.acos(g);
            ksp = z / Math.sin(z);
        }
        p.x = this.x0 + this.a * ksp * cosphi * Math.sin(dlon);
        p.y = this.y0 + this.a * ksp * (this.cos_p12 * sinphi - this.sin_p12 * cosphi * coslon);
        return p;
    },
    inverse: function (p) {
        p.x -= this.x0;
        p.y -= this.y0;
        var rh = Math.sqrt(p.x * p.x + p.y * p.y);
        if (rh > (2.0 * Proj4js.common.HALF_PI * this.a)) {
            Proj4js.reportError("aeqdInvDataError");
            return;
        }
        var z = rh / this.a;
        var sinz = Math.sin(z);
        var cosz = Math.cos(z);
        var lon = this.long0;
        var lat;
        if (Math.abs(rh) <= Proj4js.common.EPSLN) {
            lat = this.lat0;
        } else {
            lat = Proj4js.common.asinz(cosz * this.sin_p12 + (p.y * sinz * this.cos_p12) / rh);
            var con = Math.abs(this.lat0) - Proj4js.common.HALF_PI;
            if (Math.abs(con) <= Proj4js.common.EPSLN) {
                if (this.lat0 >= 0.0) {
                    lon = Proj4js.common.adjust_lon(this.long0 + Math.atan2(p.x, -p.y));
                } else {
                    lon = Proj4js.common.adjust_lon(this.long0 - Math.atan2(-p.x, p.y));
                }
            } else {
                con = cosz - this.sin_p12 * Math.sin(lat);
                if ((Math.abs(con) < Proj4js.common.EPSLN) && (Math.abs(p.x) < Proj4js.common.EPSLN)) {} else {
                    var temp = Math.atan2((p.x * sinz * this.cos_p12), (con * rh));
                    lon = Proj4js.common.adjust_lon(this.long0 + Math.atan2((p.x * sinz * this.cos_p12), (con * rh)));
                }
            }
        }
        p.x = lon;
        p.y = lat;
        return p;
    }
};
Proj4js.Proj.moll = {
    init: function () {},
    forward: function (p) {
        var lon = p.x;
        var lat = p.y;
        var delta_lon = Proj4js.common.adjust_lon(lon - this.long0);
        var theta = lat;
        var con = Proj4js.common.PI * Math.sin(lat);
        for (var i = 0; true; i++) {
            var delta_theta = -(theta + Math.sin(theta) - con) / (1.0 + Math.cos(theta));
            theta += delta_theta;
            if (Math.abs(delta_theta) < Proj4js.common.EPSLN) break;
            if (i >= 50) {
                Proj4js.reportError("moll:Fwd:IterationError");
            }
        }
        theta /= 2.0;
        if (Proj4js.common.PI / 2 - Math.abs(lat) < Proj4js.common.EPSLN) delta_lon = 0;
        var x = 0.900316316158 * this.a * delta_lon * Math.cos(theta) + this.x0;
        var y = 1.4142135623731 * this.a * Math.sin(theta) + this.y0;
        p.x = x;
        p.y = y;
        return p;
    },
    inverse: function (p) {
        var theta;
        var arg;
        p.x -= this.x0;
        var arg = p.y / (1.4142135623731 * this.a);
        if (Math.abs(arg) > 0.999999999999) arg = 0.999999999999;
        var theta = Math.asin(arg);
        var lon = Proj4js.common.adjust_lon(this.long0 + (p.x / (0.900316316158 * this.a * Math.cos(theta))));
        if (lon < (-Proj4js.common.PI)) lon = -Proj4js.common.PI;
        if (lon > Proj4js.common.PI) lon = Proj4js.common.PI;
        arg = (2.0 * theta + Math.sin(2.0 * theta)) / Proj4js.common.PI;
        if (Math.abs(arg) > 1.0) arg = 1.0;
        var lat = Math.asin(arg);
        p.x = lon;
        p.y = lat;
        return p;
    }
};
OpenLayers.Position = OpenLayers.Class({
    projections: {
        decimal: 'Degr�s d�cimaux',
        degminsec: 'Deg Min Sec',
        'EPSG:21781': 'SwissGrid(CH1903/NV03)',
        'EPSG:32630': 'UTM 30N (France ouest)',
        'EPSG:32631': 'UTM 31N (France centre)',
        'EPSG:32632': 'UTM 32N (France est)',
        'EPSG:32633': 'UTM 33N (Autriche)',
        'EPSG:27571': 'Lambert I (Nord)',
        'EPSG:27572': 'Lambert II (Centre)',
        'EPSG:27573': 'Lambert III (Sud)',
        'EPSG:27574': 'Lambert IV (Corse)'
    },
    bounds: {
        'EPSG:21781': new OpenLayers.Bounds(5.97, 45.83, 10.49, 47.81),
        'EPSG:32630': new OpenLayers.Bounds(-6, 0, 0, 84),
        'EPSG:32631': new OpenLayers.Bounds(0, 0, 6, 84),
        'EPSG:32632': new OpenLayers.Bounds(6, 0, 12, 84),
        'EPSG:32633': new OpenLayers.Bounds(12, 0, 18, 84),
        'EPSG:27571': new OpenLayers.Bounds(-5.2, 48.15, 8.23, 51.1),
        'EPSG:27572': new OpenLayers.Bounds(-5.2, 42.25, 8.23, 51.1),
        'EPSG:27573': new OpenLayers.Bounds(-1.76, 42.33, 7.77, 45.45),
        'EPSG:27574': new OpenLayers.Bounds(8.5, 41.33, 9.6, 43.05)
    },
    titles: {
        defaut: {
            lon: 'Longitude',
            lat: 'Latitude'
        },
        'EPSG:21781': {
            lon: 'x',
            lat: 'y'
        }
    },
    format: {
        defaut: function (v) {
            v = Math.abs(v);
            if (v < 1000) return v;
            var m = Math.floor(v / 1000);
            var u = Math.round(v - m * 1000);
            if (u < 10) u = '00' + u;
            else if (u < 100) u = '0' + u;
            if (u == 1000) {
                m++;
                u = '000';
            }
            return '' + m + ' ' + u;
        },
        decimal: function (v) {
            return Math.round(v * 100000) / 100000;
        },
        degminsec: function (v) {
            v = Math.abs(v);
            var d = Math.floor(v);
            var mf = (v - d) * 60;
            var m = Math.floor(mf);
            var s = Math.round((mf - m) * 60);
            if (s == 60) {
                m++;
                s = 0;
            }
            if (m == 60) {
                d++;
                m = 0;
            }
            return "" + d + "?" + (m < 10 ? '0' : '') + m + "'" + (s < 10 ? '0' : '') + s + '"';
        }
    },
    unformat: {
        defaut: function (v) {
            return v.replace(/ |\.|,/g, '');
        },
        decimal: function (v) {
            return v;
        },
        degminsec: function (v) {
            var vs = v.replace(/'|"/g, '?').split('?');
            return vs[0] / 1 + vs[1] / 60 + vs[2] / 3600;
        }
    },
    prefixeId: {
        titre: 'titre-',
        decimal: 'dec-',
        projected: ''
    },
    idll: {
        lon: 'lon',
        lat: 'lat'
    },
    el: {},
    idSelect: 'select-projection',
    projection: 'decimal',
    position: null,
    initialize: function (options) {
        OpenLayers.Util.extend(this, options);
        for (e in this.prefixeId)
            this.el[e] = {
                lon: document.getElementById(this.prefixeId[e] + this.idll.lon),
                lat: document.getElementById(this.prefixeId[e] + this.idll.lat)
        };
        this.elSelect = document.getElementById(this.idSelect);
        if (this.elSelect) {
            this.elSelect.owner = this;
            this.elSelect.onchange = function (e) {
                this.owner.projection = this.value;
                this.owner.draw();
            }
        }
        for (l in this.idll)
            if (this.el.projected[l]) {
                this.el.projected[l].owner = this;
                this.el.projected[l].onchange = function (e) {
                    var unformat = this.owner.find(this.owner.unformat, this.owner.projection);
                    var ll = new OpenLayers.LonLat(unformat(this.owner.el.projected.lon.value), unformat(this.owner.el.projected.lat.value));
                    if (Proj4js.defs[this.owner.projection])
                        ll.transform(new OpenLayers.Projection(this.owner.projection), new OpenLayers.Projection('EPSG:4326'));
                    if (typeof this.owner.updatePosition == 'function')
                        this.owner.updatePosition(ll);
                    this.owner.setPosition(ll);
                }
            }
        if (this.position)
            this.drawSelect();
        this.draw();
    },
    drawSelect: function () {
        if (this.elSelect) {
            while (this.elSelect.hasChildNodes())
                this.elSelect.removeChild(this.elSelect.firstChild);
            for (i in this.projections)
                if (!this.bounds[i] || this.bounds[i].contains(this.position.lon, this.position.lat)) {
                    var option = document.createElement('option');
                    option.value = i;
                    if (i == this.projection)
                        option.selected = 'selected';
                    option.appendChild(document.createTextNode(this.projections[i]));
                    this.elSelect.appendChild(option);
                }
            this.projection = this.elSelect.value;
        }
    },
    updatePosition: function (ll) {},
    setPosition: function (ll) {
        this.position = ll;
        this.drawSelect();
        this.draw();
    },
    draw: function () {
        var data = {
            titre: this.find(this.titles, this.projection),
            decimal: this.position,
            projected: Proj4js.defs[this.projection] ? this.position.clone().transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection(this.projection)) : this.position
        }
        var format = {
            projected: this.find(this.format, this.projection),
            decimal: this.format.decimal
        }
        for (e in this.prefixeId)
            for (l in this.idll) {
                var val = format[e] ? format[e](data[e][l]) : data[e][l];
                var el = this.el[e][l];
                if (el) {
                    if (el.tagName == 'INPUT')
                        el.value = val;
                    else
                        el.innerHTML = val;
                }
        }
    },
    find: function (s, m) {
        var r = null;
        for (i in s)
            if (i == m)
                return s[i];
            else if (!r)
            r = s[i];
        return r;
    },
    CLASS_NAME: "OpenLayers.Position"
});
OpenLayers.Layer.Img = OpenLayers.Class(OpenLayers.Layer.Vector, {
    initialize: function (name, options) {
        OpenLayers.Util.extend(this, options);
        OpenLayers.Layer.Vector.prototype.initialize.apply(this, arguments);
        if (!this.pos)
            this.pos = new OpenLayers.LonLat(0, 0);
        this.addFeatures(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(this.pos.lon, this.pos.lat), null, {
            externalGraphic: this.img,
            graphicHeight: this.h,
            graphicWidth: this.l
        }));
    },
    setPosition: function (ll) {
        this.features[0].move(new OpenLayers.LonLat(0, 0));
        this.features[0].move(ll.clone().transform(this.map.displayProjection, this.map.getProjectionObject()));
    },
    updatePosition: function (ll) {},
    onDrag: function () {
        var ll = this.features[0].geometry.getBounds().getCenterLonLat()
        if (typeof this.updatePosition == 'function')
            this.updatePosition(ll.clone().transform(this.map.getProjectionObject(), this.map.displayProjection));
    },
    centre: function () {
        var ll = this.map.getCenter().transform(this.map.getProjectionObject(), this.map.displayProjection);
        this.setPosition(ll);
        if (typeof this.updatePosition == 'function')
            this.updatePosition(ll);
    },
    CLASS_NAME: "OpenLayers.Layer.Img"
});
OpenLayers.Layer.GMLSLD = OpenLayers.Class(OpenLayers.Layer.Vector, {
    options: null,
    layers: [],
    sldFiles: [],
    initialize: function (name, options) {
        this.options = options;
        if (OpenLayers.Layer.GMLSLD.prototype.layers[options.urlSLD] == undefined) {
            OpenLayers.Layer.GMLSLD.prototype.layers[options.urlSLD] = [];
            OpenLayers.Request.GET({
                url: options.urlSLD,
                scope: this,
                success: function (sldFile) {
                    OpenLayers.Layer.GMLSLD.prototype.sldFiles[this.options.urlSLD] = sldFile;
                    var layers = OpenLayers.Layer.GMLSLD.prototype.layers[this.options.urlSLD];
                    for (i in layers)
                        layers[i].setStyle(sldFile);
                },
                failure: function () {
                    alert('Echec chargement de la feuille de style SLD ' + this.options.urlSLD);
                }
            });
        }
        OpenLayers.Layer.Vector.prototype.initialize.call(this, name, OpenLayers.Util.extend(options, {
            protocol: new OpenLayers.Protocol.HTTP({
                url: options.urlGML,
                format: new OpenLayers.Format.GML()
            }),
            strategies: [new OpenLayers.Strategy.BBOX({
                    ratio: 1,
                    resFactor: 1
                })]
        }));
        if (OpenLayers.Layer.GMLSLD.prototype.sldFiles[options.urlSLD])
            this.setStyle(sldFile);
        else
            OpenLayers.Layer.GMLSLD.prototype.layers[options.urlSLD].push(this);
    },
    setStyle: function (sldFile) {
        var format = new OpenLayers.Format.SLD().read(sldFile.responseXML || sldFile.responseText).namedLayers[this.options.styleName];
        var style = new Array();
        if (typeof format == 'object' && typeof format.userStyles == 'object')
            for (i in format.userStyles)
                if (typeof format.userStyles[i] == 'object')
                    style[format.userStyles[i].name] = format.userStyles[i];
        this.styleMap = new OpenLayers.StyleMap(style);
        this.redraw();
    },
    CLASS_NAME: "OpenLayers.Layer.GMLSLD"
});

/* --> GMaps TERRAIN
 * Une extension dédiée à google.maps.MapTypeId.TERRAIN
 */
OpenLayers.Layer.Google.Terrain=OpenLayers.Class(OpenLayers.Layer.Google,
        {
            type:google.maps.MapTypeId.TERRAIN,
            MAX_ZOOM_LEVEL:15,
            CLASS_NAME:"OpenLayers.Google.Terrain"
        }
);           

/* --> IGN layers
 * Demande de clé de production: http://pro.ign.fr/api-web => Service en ligne => S'ABONNER
 *  new OpenLayers.Layer.IGN ('IGN Topo', '6o9nu2vyxo6xytjmpdp47r8v')
 *  new OpenLayers.Layer.IGN.Photo ('IGN photo', '6o9nu2vyxo6xytjmpdp47r8v')
 */ 
OpenLayers.Layer.IGN = OpenLayers.Class(OpenLayers.Layer.WMTS,
        {
            layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS',
            maxZoomLevel: 18,
            initialize: function(name, cle) {
                OpenLayers.Layer.WMTS.prototype.initialize.call(this, {
                    name: name,
                    url: 'http://gpp3-wxs.ign.fr/' + cle + '/wmts',
                    layer: this.layer,
                    matrixSet: 'PM',
                    style: 'normal',
                    projection: 'EPSG:900913',
                    maxZoomLevel: this.maxZoomLevel,
                    attribution: '&copy;IGN ' + '<a href="http://www.geoportail.fr/" target="_blank">' + '<img src="http://api.ign.fr/geoportail/api/js/2.0.0beta/theme/geoportal/img/logo_gp.gif">' + '</a> ' + '<a href="http://www.geoportail.gouv.fr/depot/api/cgu/licAPI_CGUF.pdf" alt="TOS" title="TOS" target="_blank">' + 'Terms of Service' + '</a>'
                });
            },
            CLASS_NAME: "OpenLayers.Layer.IGN"}
);

OpenLayers.Layer.IGN.Photo = OpenLayers.Class(OpenLayers.Layer.IGN, {
    layer: 'ORTHOIMAGERY.ORTHOPHOTOS',
    maxZoomLevel: 19,
    CLASS_NAME: "OpenLayers.Layer.IGN.Photo"}
);

/* --> Swisstopo layers
 * Automatiquement autorisé sur localhost
 * Demande pour autoriser un domaine: http://www.swisstopo.admin.ch/internet/swisstopo/fr/home/products/services/web_services/webaccess.html
 * => Accès au formulaire de commande 
 */            
OpenLayers.Layer.SwissTopo = OpenLayers.Class(OpenLayers.Layer.WMTS, {
    layerName: 'ch.swisstopo.pixelkarte-farbe',
    time: 20120809,
    format: 'jpeg',
    resolutions: [2250, 2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5],
    attribution: {
        name: 'SwissTopo',
        site: 'http://map.geo.admin.ch/',
        licence: 'http://www.geo.admin.ch/internet/geoportal/fr/home/geoadmin/contact.html#copyright',
        style: 'color:white;background-color:red'
    },
    getCapabilities: function () {
        var matrixIds = [],
            id = 7;
        for (i in this.resolutions)
            matrixIds.push({
                identifier: id++,
                scaleDenominator: this.resolutions[i] * 3571.43764288
            });
        return {
            operationsMetadata_GetTile_dcp_http_get: ['http://wmts0.geo.admin.ch/', 'http://wmts1.geo.admin.ch/', 'http://wmts.geo.admin.ch/'],
            matrixIds: matrixIds
        };
    },
    initialize: function (name, options) {
        OpenLayers.Util.extend(this, options);
        var capa = this.getCapabilities();
        OpenLayers.Layer.WMTS.prototype.initialize.call(this, {
            name: name,
            url: capa.operationsMetadata_GetTile_dcp_http_get,
            layer: this.layerName,
            matrixSet: '21781',
            projection: 'EPSG:21781',
            maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
            units: 'm',
            resolutions: this.resolutions,
            matrixIds: capa.matrixIds,
            requestEncoding: 'REST',
            style: 'default',
            dimensions: ['TIME'],
            params: {
                'time': this.time
            },
            formatSuffix: this.format,
            attribution: '<a class="DCattribution" style="' + this.attribution.style + '" href="' + this.attribution.site + '" title"Site d\'origine">&copy; ' + this.attribution.name + '</a>&nbsp;' + '<a href="' + this.attribution.licence + '" title="Conditions d\'utilisation">Conditions d\'utilisation</a>'
        });
    },
    CLASS_NAME: "OpenLayers.Layer.SwissTopo"
});

OpenLayers.Layer.SwissTopo.Photo = OpenLayers.Class(OpenLayers.Layer.SwissTopo, {
    layerName: 'ch.swisstopo.swissimage',
    time: 20120809,
    resolutions: [2250, 2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25],
    CLASS_NAME: "OpenLayers.Layer.SwissTopo.Photo"
});
Proj4js.defs["EPSG:21781"] = "+title=CH1903 / LV03 +proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs";