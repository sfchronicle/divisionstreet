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

// Gray photo gallery
var photo00 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992057/3/2000x1000.jpg",
  caption: "A jet takes off over the original levees that surround Oakland International Airport, which opened in 1962. With as little as 18 inches of sea level rise, water could spill across Doolittle Drive onto the airport runways several times a year during extra-high tides unless the drive’s low spots are raised. ",
};
var photo01 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992054/3/2000x1000.jpg",
  caption: "Some ponds are a lot more saturated with salt than others at the Ravenswood Ponds in East Palo Alto. Ravenswood is one of the South Bay Salt Pond Restoration projects. ",
};
var photo02 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992097/3/2000x1000.jpg",
  caption: "Remnants of the old salt works from the 1920s remain at the Eden Landing Ecological Reserve in Hayward. Eden Landing is one of the South Bay Salt Pond Restoration projects. ",
};
var photo03 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992096/3/2000x1000.jpg",
  caption: "An estimated 9,000 properties in Foster City are protected by a levee that runs around the entire development. City officials are considering their options after the Federal Emergency Management Agency’s pending coastal flood map indicates that Foster City’s levee system is no longer adequate. ",
};
var photo04 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992051/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};
var photo05 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992159/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};

// filling in Gray slideshow
[0,1,2,3,4,5].forEach(function(ff){
  $("#photo_g0"+ff).append(slideshow_template(eval("photo0"+ff)));
});

// McKinney photos
var photo10 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992456/3/2000x1000.jpg",
  caption: "A jet takes off over the original levees that surround Oakland International Airport, which opened in 1962. With as little as 18 inches of sea level rise, water could spill across Doolittle Drive onto the airport runways several times a year during extra-high tides unless the drive’s low spots are raised. ",
};
var photo11 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992409/3/2000x1000.jpg",
  caption: "Some ponds are a lot more saturated with salt than others at the Ravenswood Ponds in East Palo Alto. Ravenswood is one of the South Bay Salt Pond Restoration projects. ",
};
var photo12 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992465/3/2000x1000.jpg",
  caption: "Remnants of the old salt works from the 1920s remain at the Eden Landing Ecological Reserve in Hayward. Eden Landing is one of the South Bay Salt Pond Restoration projects. ",
};
var photo13 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992466/3/2000x1000.jpg",
  caption: "An estimated 9,000 properties in Foster City are protected by a levee that runs around the entire development. City officials are considering their options after the Federal Emergency Management Agency’s pending coastal flood map indicates that Foster City’s levee system is no longer adequate. ",
};
var photo14 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992460/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};

// filling in McKinney slideshow
[0,1,2,3,4].forEach(function(ff){
  $("#photo_g1"+ff).append(slideshow_template(eval("photo1"+ff)));
});

// Brownell gallery
var photo20 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991713/3/2000x1000.jpg",
  caption: "A jet takes off over the original levees that surround Oakland International Airport, which opened in 1962. With as little as 18 inches of sea level rise, water could spill across Doolittle Drive onto the airport runways several times a year during extra-high tides unless the drive’s low spots are raised. ",
};
var photo21 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991666/3/2000x1000.jpg",
  caption: "Some ponds are a lot more saturated with salt than others at the Ravenswood Ponds in East Palo Alto. Ravenswood is one of the South Bay Salt Pond Restoration projects. ",
};
var photo22 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991802/3/2000x1000.jpg",
  caption: "Remnants of the old salt works from the 1920s remain at the Eden Landing Ecological Reserve in Hayward. Eden Landing is one of the South Bay Salt Pond Restoration projects. ",
};
var photo23 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991805/3/2000x1000.jpg",
  caption: "An estimated 9,000 properties in Foster City are protected by a levee that runs around the entire development. City officials are considering their options after the Federal Emergency Management Agency’s pending coastal flood map indicates that Foster City’s levee system is no longer adequate. ",
};
var photo24 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991760/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};
var photo25 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991667/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};
var photo26 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991762/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};
var photo27 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991705/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};
var photo28 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991801/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};
var photo29 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991764/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};

// filling in Brownell slideshow
[0,1,2,3,4,5,6,7,8,9].forEach(function(ff){
  $("#photo_g2"+ff).append(slideshow_template(eval("photo2"+ff)));
});

// Mayweather photos
var photo30 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992286/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};
var photo31 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992342/3/2000x1000.jpg",
  caption: "Some ponds are a lot more saturated with salt than others at the Ravenswood Ponds in East Palo Alto. Ravenswood is one of the South Bay Salt Pond Restoration projects. ",
};
var photo32 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992341/3/2000x1000.jpg",
  caption: "Remnants of the old salt works from the 1920s remain at the Eden Landing Ecological Reserve in Hayward. Eden Landing is one of the South Bay Salt Pond Restoration projects. ",
};
var photo33 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992339/3/2000x1000.jpg",
  caption: "An estimated 9,000 properties in Foster City are protected by a levee that runs around the entire development. City officials are considering their options after the Federal Emergency Management Agency’s pending coastal flood map indicates that Foster City’s levee system is no longer adequate. ",
};
var photo34 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992335/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};
var photo35 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992408/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};

// filling in Mayweather slideshow
[0,1,2,3,4,5].forEach(function(ff){
  $("#photo_g3"+ff).append(slideshow_template(eval("photo3"+ff)));
});

// Smirf photos
var photo40 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992219/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};
var photo41 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992216/3/2000x1000.jpg",
  caption: "Some ponds are a lot more saturated with salt than others at the Ravenswood Ponds in East Palo Alto. Ravenswood is one of the South Bay Salt Pond Restoration projects. ",
};
var photo42 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992283/3/2000x1000.jpg",
  caption: "Remnants of the old salt works from the 1920s remain at the Eden Landing Ecological Reserve in Hayward. Eden Landing is one of the South Bay Salt Pond Restoration projects. ",
};
var photo43 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992212/3/2000x1000.jpg",
  caption: "An estimated 9,000 properties in Foster City are protected by a levee that runs around the entire development. City officials are considering their options after the Federal Emergency Management Agency’s pending coastal flood map indicates that Foster City’s levee system is no longer adequate. ",
};
var photo44 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992280/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};
var photo45 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992220/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};

// filling in Smirf slideshow
[0,1,2,3,4,5].forEach(function(ff){
  $("#photo_g4"+ff).append(slideshow_template(eval("photo4"+ff)));
});

// Quinn photos
var photo50 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991926/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};
var photo51 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991864/3/2000x1000.jpg",
  caption: "Some ponds are a lot more saturated with salt than others at the Ravenswood Ponds in East Palo Alto. Ravenswood is one of the South Bay Salt Pond Restoration projects. ",
};
var photo52 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991921/3/2000x1000.jpg",
  caption: "Remnants of the old salt works from the 1920s remain at the Eden Landing Ecological Reserve in Hayward. Eden Landing is one of the South Bay Salt Pond Restoration projects. ",
};
var photo53 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991925/3/2000x1000.jpg",
  caption: "An estimated 9,000 properties in Foster City are protected by a levee that runs around the entire development. City officials are considering their options after the Federal Emergency Management Agency’s pending coastal flood map indicates that Foster City’s levee system is no longer adequate. ",
};
var photo54 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991974/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};
var photo55 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991976/3/2000x1000.jpg",
  caption: "Brian Gilardi operates a spreader filled with lime that is distributed along the levees at the Sears Point Wetland Restoration in Sonoma. The lime is used to balance the acidity of the soil, which will encourage plant growth. ",
};

// filling in Quinn slideshow
[0,1,2,3,4,5].forEach(function(ff){
  $("#photo_g5"+ff).append(slideshow_template(eval("photo5"+ff)));
});

// photo gallery event listeners
var gallery0_idx = 0, gallery1_idx = 0, gallery2_idx = 0, gallery3_idx = 0, gallery4_idx = 0, gallery5_idx = 0;
[0,1,2,3,4,5].forEach(function(kk){
  // set up clicking to update map interactive on mobile
  document.getElementById("scroll-right-gallery"+kk).addEventListener("click", function() {
    console.log("clicked right");
    if (kk == 0) {gallery0_idx = gallery0_idx+1}
    else if (kk == 1) {gallery1_idx = gallery1_idx+1}
    else if (kk == 2) {gallery2_idx = gallery2_idx+1}
    else if (kk == 3) {gallery3_idx = gallery3_idx+1}
    else if (kk == 4) {gallery4_idx = gallery4_idx+1}
    else if (kk == 5) {gallery5_idx = gallery5_idx+1};
    $(".photo_g"+kk).removeClass("active");
    $("#photo_g" + kk + eval("gallery"+kk+"_idx") ).addClass("active");
    console.log("#photo_g" + kk + eval("gallery"+kk+"_idx"));
    console.log(eval("gallery"+kk+"_idx"));
    if (eval("gallery"+kk+"_idx") == 4) {
      $("#scroll-right-gallery"+kk).addClass("last");
    } else {
      $("#scroll-right-gallery"+kk).removeClass("last");
    };
    if (eval("gallery"+kk+"_idx") == 0) {
      $("#scroll-left-gallery"+kk).addClass("first");
    } else {
      $("#scroll-left-gallery"+kk).removeClass("first");
    };
  });
  document.getElementById("scroll-left-gallery"+kk).addEventListener("click", function() {
    console.log("clicked left");
    if (kk == 0) {gallery0_idx = gallery0_idx-1}
    else if (kk == 1) {gallery1_idx = gallery1_idx-1}
    else if (kk == 2) {gallery2_idx = gallery2_idx-1}
    else if (kk == 3) {gallery3_idx = gallery3_idx-1}
    else if (kk == 4) {gallery4_idx = gallery4_idx-1}
    else if (kk == 5) {gallery5_idx = gallery5_idx-1};
    $(".photo_g"+kk).removeClass("active");
    $("#photo_g" + kk + eval("gallery"+kk+"_idx") ).addClass("active");
    console.log("#photo_g" + kk + eval("gallery"+kk+"_idx"));
    console.log(eval("gallery"+kk+"_idx"));
    if (eval("gallery"+kk+"_idx") == 4) {
      $("#scroll-right-gallery"+kk).addClass("last");
    } else {
      $("#scroll-right-gallery"+kk).removeClass("last");
    };
    if (eval("gallery"+kk+"_idx") == 0) {
      $("#scroll-left-gallery"+kk).addClass("first");
    } else {
      $("#scroll-left-gallery"+kk).removeClass("first");
    };
  });
});
