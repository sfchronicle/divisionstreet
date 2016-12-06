require("./lib/social"); //Do not delete
require("velocity-animate");

// list of all the characters in the story
var profileOrder = ["Gray","McKinney","Brownell","Mayweather","Smirf","Quinn"];

var svgElement = document.querySelector("#svgID");

// function for zooming and panning
function zoom(panHoriz,panVert,zoomVal){
  // apply new viewBox attributes
  // svgElement.setAttribute('viewBox', viewBoxValues.join(' '));
  $("#svgID").velocity("stop",true).velocity({scale: zoomVal,
    translateX: panHoriz,
    translateY: panVert},{duration:10,loop:false});
}

// initializing parameters
var orig, bounds;
var panHoriz = 0, panVert = 0, scaleVal = 1;

// hightlight the part of the journey by highlighting the path and zooming the map
function drawPath(orig,routeID){

  // highlight the appropriate path with the appropriate color
  if (routeID == "QuinnRoute") {
    orig.style.stroke = '#CF5EA3';
  } else if (routeID == "GrayRoute") {
    orig.style.stroke = '#E5B76B';
  } else if (routeID == "McKinneyRoute") {
    orig.style.stroke = '#21A466';
  } else if (routeID == "BrownellRoute") {
    orig.style.stroke = '#E14940';
  } else if (routeID == "MayweatherRoute") {
    orig.style.stroke = '#34C1D5';
  } else if (routeID == "SmirfRoute") {
    orig.style.stroke = '#0085BB';
  }
  orig.style["stroke-opacity"] = 1;

  // zoom and pan the SVG
  bounds = orig.getBoundingClientRect();
  var windowHeight = $(window).height();
  var pathLength = Math.sqrt(bounds.height*bounds.height+bounds.width*bounds.width);
  scaleVal = (1-pathLength/windowHeight)*0.6+0.7;
  panHoriz = "0px";
  panVert = "0px";
  zoom(panHoriz,panVert,scaleVal);
}

var idx_old = -1;
var state_var = "invisible";
var pos_prev = 0;
var previousChildren;
var previousRouteID = [];
var activeProfile, activeProfileIdx, activeSectionStart;
var activeProfilePrevious;
var SectionLen, N, Nlist;
var routes, childrenOrig, childrenList;

$(window).scroll(function(){

  var pos = $(this).scrollTop();
  state_var = "invisible";
  profileOrder.forEach(function(p,pdx){

    var SectionStart = $('#start'+p).offset().top-600;
    var SectionEnd = $('#end'+p).offset().top-100;

    if (pos > SectionStart && pos < SectionEnd) {

      state_var = "visible";
      activeProfile = p;

      if (activeProfile != activeProfilePrevious){
        // clearing the paths when sections change
        if (previousChildren){
          previousChildren.forEach(function(d,idx){
            d.style["stroke-opacity"] = 0.3;
          });
        }
        idx_old = -1;
      }

      activeProfileIdx = pdx;
      activeSectionStart = SectionStart;
      activeProfilePrevious = activeProfile;

    }
  });

  if (state_var == "visible") {

    // initializing for the path drawing
    var i = 0;
    var routeID = activeProfile+"Route";

    if (routeID != previousRouteID) {
      previousRouteID = routeID;
      routes = document.getElementById(routeID);
      childrenOrig = routes.childNodes;
      childrenList = [];
      for (var ii=0; ii<childrenOrig.length; ii++) {
        if (childrenOrig[ii]["nodeName"] == "path"){
          childrenList.push(childrenOrig[ii]);
        }
      }
      childrenList = childrenList.reverse();
      previousChildren = childrenList;
      SectionLen = childrenList.length;
      N = SectionLen;
      Nlist = Array.apply(null, {length: N}).map(Number.call, Number);
    }
    Nlist.forEach(function(d,idx){
      $("#person"+activeProfileIdx+"event"+d).removeClass("active");
    });

    var idx = Math.round((pos-(activeSectionStart+SectionLen*100))/ 300);
    if (idx == -0) { idx = 0};

    if (idx < SectionLen && idx >= 0) {
      $("#person"+activeProfileIdx+"event"+idx).addClass("active");
    } else {
      $("#person"+activeProfileIdx+"event"+SectionLen).addClass("active");
    }

    if ((idx != idx_old) && (childrenList)) {
      Nlist.forEach(function(d,nn){
        childrenList[d].style["stroke-opacity"] = 0.3;
      });
      var NlistActive = Array.apply(null, {length: Math.min(idx,SectionLen)}).map(Number.call, Number);
      NlistActive.forEach(function(d,mm){
        orig = childrenList[d];
        drawPath(orig,routeID);
      });
    }
  }
});
