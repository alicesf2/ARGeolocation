//parse json
var geoString = '{"geoobjects":[{"name": "Productive Edge","lat": 41.890637,"long": -87.627443},{"name": "Trump Tower","lat": 41.888803,"long": -87.626312},{"name": "Tribune Tower","lat":41.890380,"long":-87.623674}]}'
var geoObj = JSON.parse(geoString);

//declare variables
var loc0;
var loc1;
var modelEarth;
var indicatorImage;
var indicatorDrawable;
var obj0;
var obj1;
var obj2;
//stores all geoobject locations
var locArr = [];
//stores all objects in display
var objArr = [];

//instantiate world object
var World = {
  loaded: false,
  rotating: false,

  //initialize world
  init: function initFn() {
    this.assignLoc();
    this.loadModels();
    this.initPosition();
    //console.log("world initialized");
  },

  //create geolocations out of latitude and longitude from json
  assignLoc: function assignLocFn() {
    loc0 = new AR.GeoLocation(geoObj.geoobjects[0].lat, geoObj.geoobjects[0].long);
    locArr.push(loc0);
    loc1 = new AR.GeoLocation(geoObj.geoobjects[1].lat, geoObj.geoobjects[1].long);
    locArr.push(loc1);
    loc2 = new AR.GeoLocation(geoObj.geoobjects[2].lat, geoObj.geoobjects[2].long);
    locArr.push(loc2);
    //console.log("locations assigned");
  },

  //load and scale 3D models from asset images
  loadModels: function loadModelsFn() {
    modelEarth = new AR.Model("assets/earth.wt3", {
      onLoaded: this.worldLoaded,
      scale: {
        x: 1,
        y: 1,
        z: 1
      }
    });
    indicatorImage = new AR.ImageResource("assets/indi.png");

    indicatorDrawable = new AR.ImageDrawable(indicatorImage, 0.1, {
      verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP
    });
    //console.log("models loaded");
  },

  //removes loading message if models loaded
  worldLoaded: function worldLoadedFn() {
    World.loaded = true;
    var e = document.getElementById('loadingMessage');
    e.parentElement.removeChild(e);
  },

  //create geoobjects out of models at a certain location
  createModel: function createModelFn(objName, loc) {
    objName = new AR.GeoObject(loc, {
      drawables: {
        cam: [modelEarth],
        indicator: [indicatorDrawable]
      }
    });
    //console.log("models created");
  },

  //initialize user position and obj array
  initPosition: function initPositionFn() {
    if (loc0.distanceToUser() <= 10) {
      objArr.push(obj0);
    }

    if (loc1.distanceToUser() <= 10) {
      objArr.push(obj1);
    }

    if (loc2.distanceToUser() <= 10) {
      objArr.push(obj2);
    }
    //console.log("position initialized");
  },

  //adds and removes objects from objArr depending on how far user is from them
  scan: function scanFn() {
    //removes objects from objArr if they're out of range
    for (var i = 0; i < objArr.length; i++) {
      if (locArr[i].distanceToUser() > 10) {
        objArr.pop(objArr[i]);
      }
    }

    //adds objects to objArr
    for (var i = 0; i < locArr.length; i++) {
      if (locArr[i].distanceToUser() <= 10) {
        objArr.push(objArr[i]);
      }
    }
    this.displayModels();
  },

  //spawns models at specified location
  displayModels: function displayModels() {
    for (var i = 0; i < objArr.length; i++) {
      this.createModel(objArr[i], locArr[i]);
    }
  },
};

World.init();
