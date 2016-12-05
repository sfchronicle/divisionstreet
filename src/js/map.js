require("./lib/social"); //Do not delete
require("snapsvg");
// var $ = require("jquery");

// list of all the characters in the story
var profileOrder = ["Quinn","Gray","McKinney","Brownell","Mayweather","Smirf"];

// variables for path drawing
// var orig,length,timer;
// var orig,length;
// var distancePerPoint = 1;
// var drawFPS          = 100;

var svgElement = document.querySelector("#svgID");
var s = Snap("#svgID");

// function for zooming and panning
function zoom(panHoriz,panVert,zoomVal){

  // get current viewBox attributes
  var viewBox = svgElement.getAttribute('viewBox');
  console.log(viewBox);
  var viewBoxValues = viewBox.split(' ');
  console.log(viewBoxValues);

  // values for panning
  viewBoxValues[0] = parseFloat(viewBoxValues[0]);
  viewBoxValues[1] = parseFloat(viewBoxValues[1]);
  viewBoxValues[0] += panHoriz;
  viewBoxValues[1] += panVert;

  // values for zooming
  viewBoxValues[2] = parseFloat(viewBoxValues[2]);
  viewBoxValues[3] = parseFloat(viewBoxValues[3]);
  viewBoxValues[2] *= zoomVal;	// Increase the width and height attributes of the viewBox attribute to zoom out.
  viewBoxValues[3] *= zoomVal;

  // apply new viewBox attributes
  console.log(viewBoxValues.join(" "));
  svgElement.setAttribute('viewBox', viewBoxValues.join(' '));

  // workaround, generate an animation fragment (to test browser support)
  // var m = '<animate id="svgID" attributeName="viewBox" begin="1s" dur="5s" values="'+viewBoxValues.join(" ")+'" fill="freeze" />';
  // var o = Snap.parse(m);
  // s.add(o);
  // Snap.animate(svgElement.attr("viewBox").vb.split(" "), [ x, y, width, height ], function(values){ p.attr("viewBox", values.join(" "); }, duration ms, easing)
  // s.animate({viewBox: viewBoxValues.join(' ') },500);
  // console.log(s);
}

// initializing parameters
var orig, bounds;
var panHoriz = 0, panVert = 0, scaleVal = 1;

// hightlight the part of the journey by highlighting the path and zooming the map
function drawPath(orig,routeID){

  // reset the zoom to original location to make transformations easier
  zoom(-panHoriz,-panVert,1/scaleVal);

  // highlight the appropriate path with the appropriate color
  console.log(routeID);
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
  console.log("bounds are: ");
  console.log(bounds);
  var windowHeight = $(window).height();
  var pathHeight = bounds.height;
  if ((bounds.height > 300) || (bounds.width > 300)){
    console.log("this is one of the long paths");
    scaleVal = 1.1;
    panHoriz = 150;
    panVert = 10;
    zoom(panHoriz,panVert,scaleVal);
  } else if (bounds.height < 50){
    console.log("this is a very short path");
    scaleVal = 0.6;
    panHoriz = 250;
    panVert = 130;
    zoom(panHoriz,panVert,scaleVal);
  } else {
    console.log("this is one of the short paths");
    scaleVal = 0.9;
    panHoriz = 10;
    panVert = 0;
    zoom(panHoriz,panVert,scaleVal);
  }
  // console.log("pathHeight is: ");
  // console.log(pathHeight);
  // console.log("windowHeight is: ");
  // console.log(windowHeight);
  // scaleVal = 0.7/(1-(pathHeight/windowHeight));//0.99;
  // console.log("scaleVal is: ")
  // console.log(scaleVal);
  // panHoriz = 20;
  // panVert = 0;
  // zoom(panHoriz,panVert,scaleVal);

  // var timer = setInterval(increaseLength,1000/drawFPS);
  // if (length >= pathLength){
  //   console.log("clearing the timer");
  //   clearInterval(timer);
  // }
}


// initializing for the path drawing (for Quinn)
// var i = 0;
// var routeID = "GrayRoute";
// var routes = document.getElementById(routeID);
// var childrenOrig = routes.childNodes;
// var childrenList = [];
// for (var ii=0; ii<childrenOrig.length; ii++) {
//   if (childrenOrig[ii]["nodeName"] == "path"){
//     childrenList.push(childrenOrig[ii]);
//   }
// }
// childrenList = childrenList.reverse();
// console.log(childrenList.length);
// console.log(childrenList);
// orig = childrenList[i];

var idx_old = -1;
var state_var = "invisible";
var pos_prev = 0;
var previousChildren;

$(window).scroll(function(){

  var pos = $(this).scrollTop();
  // if ((pos-pos_prev) > 0){
  //   var direction = "down"
  // } else {
  //   var direction = "up"
  // }

  state_var = "invisible";
  // $("#map-container").toggleClass("dontshow");

  var activeProfile, activeProfileIdx, activeSectionStart;
  var activeProfilePrevious;

  profileOrder.forEach(function(p,pdx){
      // Show map for Quinn route
      var SectionStart = $('#start'+p).offset().top-600;
      var SectionEnd = $('#end'+p).offset().top-100;
      // $("#map-container").offset().top = pos;
      console.log(state_var);
      if (pos > SectionStart && pos < SectionEnd) {
        console.log("we are on section: ");
        console.log(p);
        // console.log(state_var);
        // console.log("changing to be visible");
        state_var = "visible";
        // $("#map-container").offset().top = pos;
        // $("#map-container").toggleClass("dontshow");
        activeProfile = p;

        if (activeProfile != activeProfilePrevious){
          console.log("we are entering a new section");
          if (previousChildren){
            console.log("clearing the paths");
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

      // initializing for the path drawing (for Quinn)
      var i = 0;
      var routeID = activeProfile+"Route";
      console.log(routeID);
      var routes = document.getElementById(routeID);
      var childrenOrig = routes.childNodes;
      var childrenList = [];
      for (var ii=0; ii<childrenOrig.length; ii++) {
        if (childrenOrig[ii]["nodeName"] == "path"){
          childrenList.push(childrenOrig[ii]);
        }
      }
      childrenList = childrenList.reverse();
      previousChildren = childrenList;
      console.log(childrenList.length);

      var SectionLen = childrenList.length;
      console.log(activeProfile+"Data");
      console.log("SectionLen = ");
      console.log(SectionLen);

      var N = SectionLen;
      var Nlist = Array.apply(null, {length: N}).map(Number.call, Number);
      console.log(Nlist);
      Nlist.forEach(function(d,idx){
        $("#person"+activeProfileIdx+"event"+d).removeClass("active");
      });
      // idx_old = idx;
      var idx = Math.round((pos-(activeSectionStart+SectionLen*100))/ 300);
      if (idx == -0) { idx = 0};
      console.log(idx);

      if (idx < SectionLen && idx >= 0) {
        $("#person"+activeProfileIdx+"event"+idx).addClass("active");
      } else {
        $("#person"+activeProfileIdx+"event"+SectionLen).addClass("active");
      }

      // if (orig) {
      //   stopDrawingPath();
      // }
      // if (idx == SectionLen) {
      //   console.log("on the last thing");
      //   orig = childrenList[idx];
      //   drawPath(orig);
      //   // idx_old = idx+1;
      // }

      if (idx != idx_old) {
        if (childrenList[idx] && (idx > idx_old)){
          orig = childrenList[idx];
          idx_old = idx;
          // clearInterval(timer);
          drawPath(orig,routeID);
        } else if (idx < (SectionLen-2)) {
          console.log("hiding paths");
          if (childrenList[idx-1]) {
            console.log("erasing");
            console.log(idx-1);
            childrenList[idx-1].style["stroke-opacity"] = 0.3;
            idx_old = idx;
          }
          // var N = idx;
          // idx_old = idx;
          // var Nlist = Array.apply(null, {length: N}).map(Number.call, Number);
          // console.log(Nlist);
          // Nlist.forEach(function(n){
          //     childrenList[n].style["stroke-opacity"] = 0.3;
          // });
        }
        console.log("idx = ");
        console.log(idx);
        console.log("old idx = ");
        console.log(idx_old);

      }

      // this is not working!!!
      // if (idx < idx_old) {
      //   if (childrenList[idx_old]){
      //     childrenList[idx_old].style["stroke-opacity"] = 0.3;
      //   }
      // }

  }
});

// function stopDrawingPath(){
//   clearInterval(timer);
//   // orig.style.stroke = '';
//   // orig.style.strokeDasharray = '';
//   var pathLength = orig.getTotalLength();
//   orig.style.strokeDasharray = pathLength;
// }
//
// function increaseLength(){
//   // console.log(orig);
//   console.log("increasing length");
//   // if (orig){
//     var pathLength = orig.getTotalLength();
//     console.log(pathLength);
//     length += distancePerPoint;
//     console.log(length);
//     orig.style.strokeDasharray = [length,pathLength].join(' ');
//     if (length >= pathLength){
//       console.log("clearing the timer");
//       clearInterval(timer);
//     }
//   // }
// }

//

//
// var currentData = [];
// var dates_list = [], svg_list = [], text_list = [];
// var looping = false;
// var childrenList;
//
// // function to pan and zoom
// var zoomAndPan = function(xval,yval) {
//   // try to zoom svg
//   var svgElement = document.querySelector("svg");
//   console.log(svgElement);
//   var translateValue = "translate("+ xval + "," + yval + ")";
//   console.log(translateValue);
//   svgElement.setAttribute("transform",translateValue);
// }
//
//
// // var years = pathData.
// var loop = null;
// var startpath = function() {
//
//       var i = 0;
//       orig = document.getElementById(routeID);
//       var childrenOrig = orig.childNodes;
//       console.log(childrenOrig);
//       childrenList = [];
//       for (var ii=0; ii<childrenOrig.length; ii++) {
//         if (childrenOrig[ii]["nodeName"] == "path"){
//           childrenList.push(childrenOrig[ii]);
//         }
//       }
//       childrenList = childrenList.reverse();
//       console.log(childrenList.length);
//       // console.log(childrenList);
//       orig = childrenList[i];
//       console.log(orig);
//
//       // try to zoom svg
//       zoomAndPan(100,100);
//
//       // orig = document.querySelector("path");
//       startDrawingPath();
//       updateInfo(dates_list[i],text_list[i]);
//
//       var startover = document.getElementById("refreshbutton");
//       var next = document.getElementById("nextbutton");
//       startover.style.display = "none";
//       next.style.display = "block";
//       next.addEventListener("click",function() {
//         console.log("clicked on next");
//         i = i+1;
//         console.log(i);
//         orig = [];
//         orig = childrenList[i];
//
//         // try to zoom svg
//         zoomAndPan(100,100);
//
//         startDrawingPath();
//         // updateInfo(dates_list[i],text_list[i]);
//         if ((i+1) == (childrenList.length)) {
//           console.log("at the last node");
//           next.style.display = "none";
//           startover.style.display = "block";
//           i = i+1;
//         }
//       });
//       startover.addEventListener("click",function() {
//         console.log("clicked on start over");
//         i = 0;
//         console.log(i);
//         orig = [];
//         orig = childrenList[i];
//
//         // try to zoom svg
//         zoomAndPan(100,100);
//
//         startDrawingPath();
//         startover.style.display = "none";
//         next.style.display = "block";
//       });
//
//       // i = (i + 1) % dates_list.length;
//       // loop = setTimeout(tick, i == 0 ? 4000 : 2000);
// };
//
// // fills in HTML for year as years toggle
// var updateInfo = function(date,text) {
//   document.querySelector(".timeline-date").innerHTML = `<strong>${date}</strong>`;
//   document.querySelector(".timeline-text").innerHTML = `<strong>${text}</strong>`;
// };
//

//
// var looping = true;
// var currentData = pathData.filter(function(x){return x.personID == 0});
// for (var ii=0; ii<currentData.length; ++ii) {
//   dates_list.push(currentData[ii]["date"]);
//   svg_list.push(currentData[ii]["svgID"]);
//   text_list.push(currentData[ii]["text"]);
// }
// var routeID = "QuinnRoute";
// startpath();
//
// // event listeners for props
// var qsa = s => Array.prototype.slice.call(document.querySelectorAll(s));
// qsa(".profile").forEach(function(person,index) {
//   person.addEventListener("click", function(e) {
//     // clearTimeout(loop);
//     var allprofiles = document.getElementsByClassName('profile');
//     for (var idx = 0; idx < allprofiles.length; ++idx) {
//         var item = allprofiles[idx];
//         item.classList.remove("active");
//     }
//     this.classList.add("active");
//     currentData = pathData.filter(function(x){return x.personID == index});
//     for (var ii=0; ii<currentData.length; ++ii) {
//       dates_list.push(currentData[ii]["date"]);
//       svg_list.push(currentData[ii]["svgID"]);
//       text_list.push(currentData[ii]["text"]);
//     }
//
//     routeID = profileData[index]["pathname"];
//     console.log(routeID);
//
//     // clearTimeout(loop);
//     // looping = true;
//     startpath();
//   });
// });
//
// // sticky nav on the top
//
// // window.onscroll = function() {activate()};
// //
// // function activate() {
// //   var sticker = document.getElementById('stick-me-profiles');
// //   var sticker_ph = document.getElementById('stick-ph-profiles');
// //   var window_top = document.body.scrollTop;
// //   var sticker_stop = document.getElementById('stop-stick-here').getBoundingClientRect().top + window_top - 100;
// //   var div_top = document.getElementById('stick-here-profiles').getBoundingClientRect().top + window_top;
// //   if ((window_top > div_top) && (window_top < sticker_stop)) {
// //     sticker.classList.add('fixed-profiles');
// //     sticker_ph.style.height = '131px';
// //     sticker_ph.style.display = 'block'; // puts in a placeholder for where sticky used to be for smooth scrolling
// //   } else {
// //     sticker.classList.remove('fixed-profiles');
// //     sticker_ph.style.display = 'none'; // removes placeholder
// //   }
// // }
