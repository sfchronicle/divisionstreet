require("./lib/social"); //Do not delete
// var $ = require("jquery");

var profileOrder = ["Quinn","Gray","McKinney","Brownell","Mayweather","Smirf"];

// variables for path drawing
// var orig,length,timer;
var orig,length;
var distancePerPoint = 1;
var drawFPS          = 100;

// functions for path drawing
function drawPath(orig,routeID){
  console.log("drawing a path");
  length = 0;
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
      console.log(['#start'+p]);
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
          var N = SectionLen;
          var Nlist = Array.apply(null, {length: N}).map(Number.call, Number);
          Nlist.forEach(function(d,idx){
            $("#person"+activeProfileIdx+"event"+d).removeClass("active");
          });
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
          drawPath(orig);
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
