require("./lib/social"); //Do not delete


var orig,length,timer;
var distancePerPoint = 1;
var drawFPS          = 60;

var currentData = [];
var dates_list = [], svg_list = [], text_list = [];
var looping = false;

// var years = pathData.
var loop = null;
var i = 0;
var tick = function() {
  // animatePaths(dates_list);
  // currentData.forEach(function(element,idx) {
    // var timer = setInterval(function() {
      orig = document.querySelector("path");
      startDrawingPath();
      updateInfo(dates_list[i],text_list[i]);
      i = (i + 1) % dates_list.length;
      loop = setTimeout(tick, i == 0 ? 4000 : 2000);

      // },10000);
  // });
  // i = (i + 1) % dates_list.length;
  // loop = setTimeout(tick, i == 0 ? 1700 : 1000);
};
//
// tick();

// var orig = document.querySelector('path'), length, timer;
// orig.addEventListener('mouseover',startDrawingPath,false);
// orig.addEventListener('mouseout', stopDrawingPath, false);

// fills in HTML for year as years toggle
var updateInfo = function(date,text) {
  document.querySelector(".timeline-date").innerHTML = `<strong>${date}</strong>`;
  document.querySelector(".timeline-text").innerHTML = `<strong>${text}</strong>`;
};

function startDrawingPath(){
  length = 0;
  orig.style.stroke = '#f60';
  timer = setInterval(increaseLength,1000/drawFPS);
}

function increaseLength(){
  var pathLength = orig.getTotalLength();
  length += distancePerPoint;
  orig.style.strokeDasharray = [length,pathLength].join(' ');
  if (length >= pathLength) clearInterval(timer);
}

// function stopDrawingPath(){
//   clearInterval(timer);
//   orig.style.stroke = '';
//   orig.style.strokeDasharray = '';
// }

var looping = true;
var currentData = pathData.filter(function(x){return x.personID == 0});
for (var ii=0; ii<currentData.length; ++ii) {
  dates_list.push(currentData[ii]["date"]);
  svg_list.push(currentData[ii]["svgID"]);
  text_list.push(currentData[ii]["text"]);
}
// console.log(currentData);
tick();

// event listeners for props
var qsa = s => Array.prototype.slice.call(document.querySelectorAll(s));
qsa(".profile").forEach(function(person,index) {
  person.addEventListener("click", function(e) {
    // clearTimeout(loop);
    var allprofiles = document.getElementsByClassName('profile');
    for (var idx = 0; idx < allprofiles.length; ++idx) {
        var item = allprofiles[idx];
        item.classList.remove("active");
    }
    this.classList.add("active");
    currentData = pathData.filter(function(x){return x.personID == index});
    for (var ii=0; ii<currentData.length; ++ii) {
      dates_list.push(currentData[ii]["date"]);
      svg_list.push(currentData[ii]["svgID"]);
      text_list.push(currentData[ii]["text"]);
    }
    clearTimeout(loop);
    looping = true;
    tick();
  });
});

// sticky nav on the top

window.onscroll = function() {activate()};

function activate() {
  var sticker = document.getElementById('stick-me-profiles');
  var sticker_ph = document.getElementById('stick-ph-profiles');
  var window_top = document.body.scrollTop;
  var sticker_stop = document.getElementById('stop-stick-here').getBoundingClientRect().top + window_top - 100;
  var div_top = document.getElementById('stick-here-profiles').getBoundingClientRect().top + window_top;
  if ((window_top > div_top) && (window_top < sticker_stop)) {
    sticker.classList.add('fixed-profiles');
    sticker_ph.style.height = '131px';
    sticker_ph.style.display = 'block'; // puts in a placeholder for where sticky used to be for smooth scrolling
  } else {
    sticker.classList.remove('fixed-profiles');
    sticker_ph.style.display = 'none'; // removes placeholder
  }
  // var title_top = document.getElementById('title-marker').getBoundingClientRect().top + window_top;
  // if (window_top > title_top) {
  //   document.getElementById('special-link').classList.add("link-active");
  // } else {
  //   document.getElementById('special-link').classList.remove("link-active");
  // }
}
