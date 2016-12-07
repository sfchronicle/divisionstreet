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
  caption: "Kathy Gray makes a purchase after cashing a check in October. "
};
var photo01 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992054/3/2000x1000.jpg",
  caption: "As rain falls in January, Kathy Gray takes shelter in her tent along 13th Street. "
};
var photo02 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992097/3/2000x1000.jpg",
  caption: "Kathy Gray waits at a check-cashing center in October. "
};
var photo03 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992096/3/2000x1000.jpg",
  caption: "Gracie the dog gets a piece of Kathy Gray’s donut in their room at the Civic Center Navigation Center in October. "
};
var photo04 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992051/3/2000x1000.jpg",
  caption: "A photo of Kathy Gray living in a tent and a birthday card decorate her wall at the Civic Center Navigation Center. "
};
var photo05 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992159/3/2000x1000.jpg",
  caption: "S.F. Homeless Outreach Team member Alex Farrand (left) speaks with Kathy Gray as they head to the Social Security Administration office in November. ",
};

// filling in Gray slideshow
[0,1,2,3,4,5].forEach(function(ff){
  $("#photo_g0"+ff).append(slideshow_template(eval("photo0"+ff)));
});

// McKinney photos
var photo10 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992456/3/2000x1000.jpg",
  caption: "Oscar McKinney pedals along 13th Street as Cassandra Brownell (left) leaves her RV in October. "
};
var photo11 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992409/3/2000x1000.jpg",
  caption: "Oscar McKinney peeks out of his tent on 13th Street in January after a visit from the city’s Homeless Outreach Team. "
};
var photo12 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992465/3/2000x1000.jpg",
  caption: "After hearing of plans to remove shelters along 13th Street, Oscar McKinney prepares to move one of his tents early on a February morning. He was living in one tent and renting out two others. "
};
var photo13 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992466/3/2000x1000.jpg",
  caption: "Oscar McKinney (left) waits for a cup of soup as Rashida Coleman spoons some into a cup as she and her son Mikah, 15, feed homeless people around the Division Street encampment in February. "
};
var photo14 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992460/3/2000x1000.jpg",
  caption: "Rashida Coleman hands Oscar McKinney a cup of soup as she helps feed people at the Division Street encampment. "
};

// filling in McKinney slideshow
[0,1,2,3,4].forEach(function(ff){
  $("#photo_g1"+ff).append(slideshow_template(eval("photo1"+ff)));
});

// Brownell gallery
var photo20 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991713/3/2000x1000.jpg",
  caption: "Robert Brownell and Cassandra Brownell embrace on the sidewalk along 13th Street while talking with their neighbors in November. "
};
var photo21 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991666/3/2000x1000.jpg",
  caption: "Robert Brownell shaves in his RV in November. "
};
var photo22 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991802/3/2000x1000.jpg",
  caption: "Cassandra Brownell pours a glass of water while eating breakfast with her husband, Robert, in November. "
};
var photo23 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991805/3/2000x1000.jpg",
  caption: "Cassandra Brownell reaches for eggs while making breakfast. "
};
var photo24 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991760/3/2000x1000.jpg",
  caption: "Robert Brownell (right) thanks Circole “Cole” Beye, who donated clothes during a sidewalk sale in November. "
};
var photo25 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991667/3/2000x1000.jpg",
  caption: "Robert Brownell talks with his wife, Cassandra, in their RV in October. "
};
var photo26 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991762/3/2000x1000.jpg",
  caption: "Robert Brownell keeps coins earned at the sidewalk sale in a empty cigarette pack. "
};
var photo27 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991705/3/2000x1000.jpg",
  caption: "Cassandra Brownell (second from left) and her husband, Robert, talk on a Muni bus as Cassandra prepares to visit her grandson in October. "
};
var photo28 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991801/3/2000x1000.jpg",
  caption: "Cassandra Brownell knocks on the door of her dentist’s office before a November appointment. "
};
var photo29 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991764/3/2000x1000.jpg",
  caption: "Cassandra Brownell hugs Dr. Connie Rocabo after getting new dentures in November. After seeing herself in a mirror, Brownell said, “I've been ugly for too long,” as tears rolled down her face. "
};

// filling in Brownell slideshow
[0,1,2,3,4,5,6,7,8,9].forEach(function(ff){
  $("#photo_g2"+ff).append(slideshow_template(eval("photo2"+ff)));
});

// Mayweather photos
var photo30 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992286/3/2000x1000.jpg",
  caption: "Angelique Mayweather sits in her tent on Utah Street in October. "
};
var photo31 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992342/3/2000x1000.jpg",
  caption: "Angelique Mayweather (with bike) stands at Florida and Division streets in February as Seanda Conley hands out soup. "
};
var photo32 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992341/3/2000x1000.jpg",
  caption: "Angelique Mayweather struggles to secure her tent and belongings on Utah Street during an October storm. "
};
var photo33 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992339/3/2000x1000.jpg",
  caption: "Angelique Mayweather holds her dog, Man Man, next to her tent on Utah Street in October. "
};
var photo34 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992335/3/2000x1000.jpg",
  caption: "Angelique Mayweather rests in her tarp-covered tent in October. "
};
var photo35 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992408/3/2000x1000.jpg",
  caption: "Cedric Roll takes a battery pack from Ned DePuy, who works in the neighborhood and charges batteries for Roll and Angelique Mayweather to help them out. "
};

// filling in Mayweather slideshow
[0,1,2,3,4,5].forEach(function(ff){
  $("#photo_g3"+ff).append(slideshow_template(eval("photo3"+ff)));
});

// Smirf photos
var photo40 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992219/3/2000x1000.jpg",
  caption: "“Papa Smirf” and Dawn “Mama Smirf” embrace in their tent along Florida Street in November."
};
var photo41 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992216/3/2000x1000.jpg",
  caption: "“Papa Smirf” (center) carries belongings while moving from his tent on 13th Street to the Pier 80 shelter in February. The San Francisco Homeless Outreach Team was there to help the residents. "
};
var photo42 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992283/3/2000x1000.jpg",
  caption: "“Papa Smirf” on Market Street in October. "
};
var photo43 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992212/3/2000x1000.jpg",
  caption: "“Papa Smirf” (left) talks with “Polar Bear” as they pack up their tents before heading out with the S.F. Homeless Outreach Team to the Pier 80 shelter in February. "
};
var photo44 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992280/3/2000x1000.jpg",
  caption: "“Papa Smirf” wears gifts from other homeless people in January. "
};
var photo45 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11992220/3/2000x1000.jpg",
  caption: "“Papa Smirf” holds a blanket next to the mat designated as his spot after arriving at the Pier 80 shelter. "
};

// filling in Smirf slideshow
[0,1,2,3,4,5].forEach(function(ff){
  $("#photo_g4"+ff).append(slideshow_template(eval("photo4"+ff)));
});

// Quinn photos
var photo50 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991926/3/2000x1000.jpg",
  caption: "Terry Quinn orders food at the corner market near his Henry Hotel home in November. "
};
var photo51 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991864/3/2000x1000.jpg",
  caption: "Terry Quinn (left) walks from the corner market back to the Henry Hotel. "
};
var photo52 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991921/3/2000x1000.jpg",
  caption: "Terry Quinn displays a scar on the back of his neck in February. "
};
var photo53 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991925/3/2000x1000.jpg",
  caption: "Terry Quinn enters through a security gate at the Henry Hotel in November. "
};
var photo54 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991974/3/2000x1000.jpg",
  caption: "Terry Quinn moves things around in his new home at the Henry Hotel in November."
};
var photo55 = {
  url: "http://ww2.hdnux.com/photos/54/11/64/11991976/3/2000x1000.jpg",
  caption: "Terry Quinn walks through a corridor at the Henry Hotel."
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
