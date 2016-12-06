require("./lib/social"); //Do not delete
require("velocity-animate");
var dot = require("./lib/dot");

// list of all the characters in the story
var profileOrder = ["Gray","McKinney","Brownell","Mayweather","Smirf","Quinn"];

var svgElement = document.querySelector("#svgID");

// function for zooming and panning
function zoom(panHoriz,panVert,zoomVal){
  // apply new viewBox attributes
  // svgElement.setAttribute('viewBox', viewBoxValues.join(' '));
  $("#svgID").velocity("stop",true).velocity({scale: zoomVal,
    translateX: panHoriz,
    translateY: panVert},{duration:50,loop:false});
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
      // childrenList = childrenList.reverse();
      previousChildren = childrenList;
      SectionLen = childrenList.length;
      N = SectionLen;
      Nlist = Array.apply(null, {length: N}).map(Number.call, Number);
    }
    Nlist.forEach(function(d,idx){
      $("#person"+activeProfileIdx+"event"+d).removeClass("active");
    });

    if (screen.width <=480){
      var idx = Math.round((pos-(activeSectionStart+SectionLen*80))/ 300);
    } else {
      var idx = Math.round((pos-(activeSectionStart+SectionLen*80))/ 300);
    }
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
      // var last = Math.min(idx,SectionLen);
      NlistActive.forEach(function(d,mm){
        orig = childrenList[d];
        drawPath(orig,routeID);
      });
      // childrenList[last].style["stroke-width"] = "20 !important";
    }
  }
});




// IMAGE GALLERIES

// templates for the two interactives
var slideshow_template = dot.compile(require("../partials/_slideshow.html"));

// -----------------------------------------------------------------------------
// photo gallery 6 ---------------------------
// -----------------------------------------------------------------------------

// Gray photo gallery
var photo00 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813276/3/2000x1000.jpg",
  caption: "A jet takes off over the original levees that surround Oakland International Airport, which opened in 1962. With as little as 18 inches of sea level rise, water could spill across Doolittle Drive onto the airport runways several times a year during extra-high tides unless the drive’s low spots are raised. ",
  credit: "Michael Macor"
};
var photo01 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813273/3/2000x1000.jpg",
  caption: "Some ponds are a lot more saturated with salt than others at the Ravenswood Ponds in East Palo Alto. Ravenswood is one of the South Bay Salt Pond Restoration projects. ",
  credit: "Michael Macor"
};
var photo02 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813274/3/2000x1000.jpg",
  caption: "Remnants of the old salt works from the 1920s remain at the Eden Landing Ecological Reserve in Hayward. Eden Landing is one of the South Bay Salt Pond Restoration projects. ",
  credit: "Michael Macor"
};
var photo03 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813277/3/2000x1000.jpg",
  caption: "An estimated 9,000 properties in Foster City are protected by a levee that runs around the entire development. City officials are considering their options after the Federal Emergency Management Agency’s pending coastal flood map indicates that Foster City’s levee system is no longer adequate. ",
  credit: "Michael Macor"
};
var photo04 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};
var photo05 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};

// filling in Gray slideshow
[0,1,2,3,4,5].forEach(function(ff){
  $("#photo_g0"+ff).append(slideshow_template(eval("photo0"+ff)));
});

var photo10 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813276/3/2000x1000.jpg",
  caption: "A jet takes off over the original levees that surround Oakland International Airport, which opened in 1962. With as little as 18 inches of sea level rise, water could spill across Doolittle Drive onto the airport runways several times a year during extra-high tides unless the drive’s low spots are raised. ",
  credit: "Michael Macor"
};
var photo11 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813273/3/2000x1000.jpg",
  caption: "Some ponds are a lot more saturated with salt than others at the Ravenswood Ponds in East Palo Alto. Ravenswood is one of the South Bay Salt Pond Restoration projects. ",
  credit: "Michael Macor"
};
var photo12 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813274/3/2000x1000.jpg",
  caption: "Remnants of the old salt works from the 1920s remain at the Eden Landing Ecological Reserve in Hayward. Eden Landing is one of the South Bay Salt Pond Restoration projects. ",
  credit: "Michael Macor"
};
var photo13 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813277/3/2000x1000.jpg",
  caption: "An estimated 9,000 properties in Foster City are protected by a levee that runs around the entire development. City officials are considering their options after the Federal Emergency Management Agency’s pending coastal flood map indicates that Foster City’s levee system is no longer adequate. ",
  credit: "Michael Macor"
};
var photo14 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};

// filling in McKinney slideshow
[0,1,2,3,4].forEach(function(ff){
  $("#photo_g1"+ff).append(slideshow_template(eval("photo1"+ff)));
});

// Brownell gallery
var photo20 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813276/3/2000x1000.jpg",
  caption: "A jet takes off over the original levees that surround Oakland International Airport, which opened in 1962. With as little as 18 inches of sea level rise, water could spill across Doolittle Drive onto the airport runways several times a year during extra-high tides unless the drive’s low spots are raised. ",
  credit: "Michael Macor"
};
var photo21 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813273/3/2000x1000.jpg",
  caption: "Some ponds are a lot more saturated with salt than others at the Ravenswood Ponds in East Palo Alto. Ravenswood is one of the South Bay Salt Pond Restoration projects. ",
  credit: "Michael Macor"
};
var photo22 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813274/3/2000x1000.jpg",
  caption: "Remnants of the old salt works from the 1920s remain at the Eden Landing Ecological Reserve in Hayward. Eden Landing is one of the South Bay Salt Pond Restoration projects. ",
  credit: "Michael Macor"
};
var photo23 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813277/3/2000x1000.jpg",
  caption: "An estimated 9,000 properties in Foster City are protected by a levee that runs around the entire development. City officials are considering their options after the Federal Emergency Management Agency’s pending coastal flood map indicates that Foster City’s levee system is no longer adequate. ",
  credit: "Michael Macor"
};
var photo24 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};
var photo25 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};
var photo26 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};
var photo27 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};
var photo28 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};
var photo29 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};

// filling in Brownell slideshow
[0,1,2,3,4,5,6,7,8,9].forEach(function(ff){
  $("#photo_g2"+ff).append(slideshow_template(eval("photo2"+ff)));
});

var photo30 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};
var photo31 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813273/3/2000x1000.jpg",
  caption: "Some ponds are a lot more saturated with salt than others at the Ravenswood Ponds in East Palo Alto. Ravenswood is one of the South Bay Salt Pond Restoration projects. ",
  credit: "Michael Macor"
};
var photo32 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813274/3/2000x1000.jpg",
  caption: "Remnants of the old salt works from the 1920s remain at the Eden Landing Ecological Reserve in Hayward. Eden Landing is one of the South Bay Salt Pond Restoration projects. ",
  credit: "Michael Macor"
};
var photo33 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813277/3/2000x1000.jpg",
  caption: "An estimated 9,000 properties in Foster City are protected by a levee that runs around the entire development. City officials are considering their options after the Federal Emergency Management Agency’s pending coastal flood map indicates that Foster City’s levee system is no longer adequate. ",
  credit: "Michael Macor"
};
var photo34 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};
var photo35 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};

// filling in Mayweather slideshow
[0,1,2,3,4,5].forEach(function(ff){
  $("#photo_g3"+ff).append(slideshow_template(eval("photo3"+ff)));
});

var photo40 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};
var photo41 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813273/3/2000x1000.jpg",
  caption: "Some ponds are a lot more saturated with salt than others at the Ravenswood Ponds in East Palo Alto. Ravenswood is one of the South Bay Salt Pond Restoration projects. ",
  credit: "Michael Macor"
};
var photo42 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813274/3/2000x1000.jpg",
  caption: "Remnants of the old salt works from the 1920s remain at the Eden Landing Ecological Reserve in Hayward. Eden Landing is one of the South Bay Salt Pond Restoration projects. ",
  credit: "Michael Macor"
};
var photo43 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813277/3/2000x1000.jpg",
  caption: "An estimated 9,000 properties in Foster City are protected by a levee that runs around the entire development. City officials are considering their options after the Federal Emergency Management Agency’s pending coastal flood map indicates that Foster City’s levee system is no longer adequate. ",
  credit: "Michael Macor"
};
var photo44 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};
var photo45 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};

// filling in Smirf slideshow
[0,1,2,3,4,5].forEach(function(ff){
  $("#photo_g4"+ff).append(slideshow_template(eval("photo4"+ff)));
});

var photo50 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};
var photo51 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813273/3/2000x1000.jpg",
  caption: "Some ponds are a lot more saturated with salt than others at the Ravenswood Ponds in East Palo Alto. Ravenswood is one of the South Bay Salt Pond Restoration projects. ",
  credit: "Michael Macor"
};
var photo52 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813274/3/2000x1000.jpg",
  caption: "Remnants of the old salt works from the 1920s remain at the Eden Landing Ecological Reserve in Hayward. Eden Landing is one of the South Bay Salt Pond Restoration projects. ",
  credit: "Michael Macor"
};
var photo53 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813277/3/2000x1000.jpg",
  caption: "An estimated 9,000 properties in Foster City are protected by a levee that runs around the entire development. City officials are considering their options after the Federal Emergency Management Agency’s pending coastal flood map indicates that Foster City’s levee system is no longer adequate. ",
  credit: "Michael Macor"
};
var photo54 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};
var photo55 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11813236/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
  credit: "Michael Macor"
};

// filling in Quinn slideshow
[0,1,2,3,4,5].forEach(function(ff){
  $("#photo_g5"+ff).append(slideshow_template(eval("photo5"+ff)));
});

// photo gallery event listeners
var gallery0_idx = 0, gallery1_idx = 0, gallery2_idx = 0, gallery3_idx = 0, gallery4_idx = 0, gallery5_idx = 0;
[0].forEach(function(kk){
  // set up clicking to update map interactive on mobile
  document.getElementById("scroll-right-gallery0").addEventListener("click", function() {
    gallery0_idx = gallery0_idx+1;
    $(".photo_g0").removeClass("active");
    $("#photo_g0"+gallery0_idx).addClass("active");
    if (gallery0_idx == 4) {
      $("#scroll-right-gallery"+kk).addClass("last");
    } else {
      $("#scroll-right-gallery"+kk).removeClass("last");
    };
    if (gallery0_idx == 0) {
      $("#scroll-left-gallery"+kk).addClass("first");
    } else {
      $("#scroll-left-gallery"+kk).removeClass("first");
    };
  });
  document.getElementById("scroll-left-gallery0").addEventListener("click", function() {
    gallery0_idx = gallery0_idx-1;
    $(".photo_g0").removeClass("active");
    $("#photo_g0"+gallery0_idx).addClass("active");
    if (gallery0_idx == 4) {
      $("#scroll-right-gallery"+kk).addClass("last");
    } else {
      $("#scroll-right-gallery"+kk).removeClass("last");
    };
    if (gallery0_idx == 0) {
      $("#scroll-left-gallery"+kk).addClass("first");
    } else {
      $("#scroll-left-gallery"+kk).removeClass("first");
    };
  });
});
