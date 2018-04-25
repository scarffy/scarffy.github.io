
import { ViewChild, ElementRef, Component } from '@angular/core';
import { ViewController, NavParams, AlertController } from 'ionic-angular';
import { LocationService } from '../../providers/location-service';
import { GlobalService } from '../../providers/global-service';
import { LoadingController } from 'ionic-angular';
import { ISubscription } from "rxjs/Subscription";
//home, timesheet, modal

declare var google;

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
  providers: [LocationService]
})
export class SampleModalPage {

  private subscription: ISubscription;
  @ViewChild('map') mapElement: ElementRef;
  currentLocation: any = {};
  map: any;
  showSearchResult: any;
  places: any;
  nearByPlaces: any;
  autoCompleteService: any;
  placeService: any;
  loader: any;
  favProjects: any;
  favActivity: any;
  selectedRadioButton;
  projectCode: any;
  projectCode_arg: any;
  location_arg: any;
  activity: any;
  activity_arg: any;
  selectedProject: any;
  selectedActivity: any;
  objReturned: returnedObject;
  objReturned1: returnedObject_update;
  localProjType: TYPEPROJECT;
  checkedNumber;
  geoLocation_google: any;

  constructor(private viewCtrl: ViewController, public location: LocationService, public globalservice: GlobalService,
    public loadingCtrl: LoadingController, params: NavParams, public alertCtrl: AlertController) {

    var self = this;
    self.showSearchResult = true;

    this.projectCode_arg = params.get("proj");
    // this.selectedProject.projectName = params.get("proj");

    this.activity_arg = params.get("activity");
    // this.selectedActivity.workPackageName = params.get("activity");

    this.location_arg = params.get("location");

    this.geoLocation_google = params.get("google");

    self.currentLocation.name = this.geoLocation_google.name;
    self.currentLocation.LAT = this.geoLocation_google.LAT;
    self.currentLocation.LON = this.geoLocation_google.LON;



  }

  ngOnInit() {
    // this.autoCompleteService = new google.maps.places.AutocompleteService();
    this.places = [];

    this.favProjects = this.globalservice.favProjects.slice();
    this.favActivity = this.globalservice.favActivities.slice();
    this.favActivity.sort((a, b) => {
      if (a.workPackageName < b.workPackageName) return -1;
      if (a.workPackageName > b.workPackageName) return 1;
      return 0;
    });

    for (var i = 0; i < this.favProjects.length; i++) {

      var project = this.favProjects[i];
      if (project.projectName == this.projectCode_arg) {
        this.projectCode = project.projectName;
        this.selectedProject = project;
        break;
      }
    }

    for (var i = 0; i < this.favActivity.length; i++) {

      var activityObj = this.favActivity[i];
      if (activityObj.workPackageName == this.activity_arg) {
        this.activity = activityObj.workPackageName;
        this.selectedActivity = activityObj;
        break;
      }
    }
    this.loadMap();
    this.addMarker();
    console.log(this.currentLocation);

  }

  ngOnDestroy() {

    console.log("Page is destroyed");
    // this.subscription.unsubscribe();
  }

  setPlace(place) {
    let self = this;
    self.showSearchResult = true;
    self.currentLocation.name = place.name;
    self.currentLocation.LAT = place.geometry.location.lat();
    self.currentLocation.LON = place.geometry.location.lng();
    self.loadMap();
    self.addMarker();
  }

  getPlaces(ev: any) {
    let self = this;
    self.showSearchResult = true;
    if (ev.target.value == '' || ev.target.value == undefined) {
      self.places = [];
      return;
    }
    let config = {
      types: ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
      input: ev.target.value
    }
    self.autoCompleteService.getPlacePredictions(config, function (predictions, status) {
      console.log(predictions);
      self.places = [];
      if (predictions != null) {
        predictions.forEach(function (prediction) {
          self.places.push(prediction);

        });
      }
    });
  }

  loadMap() {

    var self = this;

    self.loader = this.loadingCtrl.create({
      content: "Please wait...loading map"
    });
    self.loader.present();

    console.log(self.currentLocation.LAT, self.currentLocation.LON);
    let latLng = new google.maps.LatLng(self.currentLocation.LAT, self.currentLocation.LON);
    //var latLng = { lat: self.currentLocation.LAT, lng: self.currentLocation.LON };
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    self.map = new google.maps.Map(self.mapElement.nativeElement, mapOptions);
    var requestNearPlace = {
      location: latLng,
      radius: '100'
    };

    self.placeService = new google.maps.places.PlacesService(self.map);


    self.placeService.nearbySearch(requestNearPlace, function (results, status) {

      self.loader.dismiss();
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        self.nearByPlaces = [];

        if (results == null)
          results = [];

        for (var i = 0; i < results.length; i++) {

          var object = results[i];
          var obj = {
            original: object.name,
            changed: object.name
          }
          obj.changed = self.findChangedLocationIfExist(obj.original);

          if (obj.changed == "")
            obj.changed = object.name;

          if ((object.name == self.location_arg) /*|| (object.name == obj.changed)*/) {
            self.checkedNumber = i;
            self.selectedRadioButton = self.location_arg;
          }
          self.nearByPlaces.push(obj);
        }
      }
    });

  }

  /*
   This method search the global services projects that are stored
   and find out the location for the peoject selected and if the user
   has changed the name of the location, then it will collect it and 
   show to the user
  */
  findChangedLocationIfExist(searchLoc) {

    var loc = "";
    for (var i = 0; i < this.globalservice.projects.length; i++) {

      var project = this.globalservice.projects[i];
      if (project.name == this.projectCode_arg) {
        if (searchLoc == project.originalLocation) {
          loc = project.locationName;
          break;
        }
      }
    }
    return loc;
  }

  addMarker() {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
      icon: {
        url: 'http://14.1.197.36/demo/istaff/assets/svg_bluepin.svg'
      }
    });

    let content = "<p>" + this.currentLocation.name + "</p>";

    this.addInfoWindow(marker, content);

  }

  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  showNearByPlaces() {
    if (this.places.length <= 0) {
      this.showSearchResult = false;
    }
  }

  dismiss() {

    //this.loader.dismiss();
    this.location.setCurrentLocation(this.currentLocation);

    this.objReturned = {
      proj: "",
      type: "dismiss",
      activity: "",
      location: this.currentLocation
    };
    //this.viewCtrl.dismiss(this.currentLocation);
    this.viewCtrl.dismiss(this.objReturned);
  }

  update() {

    // if (this.selectedProject == null && this.selectedActivity == null) {
    if (this.selectedProject.projectName == this.projectCode_arg
      && (this.selectedActivity.workPackageName == this.activity_arg) && (this.location_arg != null)) {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'You are clocked in with the same project or activity:',
        buttons: ['OK']
      });
      alert.present();
      return;

    }

    this.location.setCurrentLocation(this.currentLocation);
    this.location.setSelectedProject(this.selectedProject.projectName);
    this.location.setSelectedActivity(this.selectedActivity.workPackageName);

    // var loc = this.location_arg;

    //var obj1 = this.nearByPlaces[0];

    // if (this.selectedRadioButton == null)
    //   loc = obj1.changed;
    // else
    var loc = this.selectedRadioButton;


    this.objReturned1 = {
      proj: this.selectedProject,
      type: "update",
      activity: this.selectedActivity,
      oldproj: this.projectCode_arg,
      oldactivity: this.activity_arg,
      location: loc,
      oldlocation: this.location_arg
    };


    /* add the ptoject type with name,activity and location stored in global service */
    this.localProjType = {
      name: this.selectedProject.projectName,
      activity: this.selectedActivity.workPackageName,
      locationName: loc,
      originalLocation: this.location_arg
    }

    //update the local storage
    this.saveProjectIdentity();
    this.viewCtrl.dismiss(this.objReturned1).catch(() => console.log('view was not dismissed'));
  }



  completed() {

    // if (this.selectedProject != null) {
    if (this.selectedProject.projectName != this.projectCode_arg
      || (this.selectedActivity.workPackageName != this.activity_arg)) {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: " This project or activity is not clocked-in. Please clock-in",
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    this.location.setCurrentLocation(this.currentLocation);
    this.location.setSelectedProject(this.selectedProject.projectName);
    this.location.setSelectedActivity(this.selectedActivity.workPackageName);

    var loc;
    // var obj1 = this.nearByPlaces[0];

    // if (this.selectedRadioButton == null)
    //   loc = obj1.changed;
    // else
    loc = this.selectedRadioButton;

    this.objReturned1 = {
      proj: this.selectedProject,
      type: "completed",
      activity: this.selectedActivity,
      oldproj: this.projectCode_arg,
      oldactivity: this.activity_arg,
      location: loc,
      oldlocation: this.location_arg
    };

    /* add the ptoject type with name,activity and location stored in global service*/
    this.localProjType = {
      name: this.selectedProject.projectName,
      activity: this.selectedActivity.workPackageName,
      locationName: loc,
      originalLocation: this.location_arg
    }


    //update the local storage
    this.saveProjectIdentity();

    this.viewCtrl.dismiss(this.objReturned1);
  }

  saveProjectIdentity() {
    this.globalservice.storeProjectsAndLocation(this.localProjType);
  }

  onSelectionChange(entry) {
    this.selectedRadioButton = entry;
    console.log('The selected radio button is ' + this.selectedRadioButton);
  }

  onSelectionProject() {
    let item = this.projectCode;

    for (var i = 0; i < this.favProjects.length; i++) {
      if (this.favProjects[i].projectName == item) {
        this.selectedProject = this.favProjects[i];
        break;
      }
    }
    console.log('The selected project button is ' + this.selectedProject.projectName);

    this.searchActivityandLocation(this.selectedProject.projectName);
  }

  onSelectionActivity() {

    let item = this.activity;
    for (var i = 0; i < this.favActivity.length; i++) {
      if (this.favActivity[i].workPackageName == item) {
        this.selectedActivity = this.favActivity[i];
        break;
      }
    }
    console.log('The selected activity button is ' + this.selectedActivity.workPackageName);
  }

  searchActivityandLocation(proj) {

    if (this.globalservice.projects.length > 0) {

      for (var i = 0; i < this.globalservice.projects.length; i++) {
        var object = this.globalservice.projects[i];
        var projectName = object.name;
        if (projectName == proj) {
          this.getActivity(object.activity);
          this.getLocation(object);
          break;
        }
      }
    }
  }

  getActivity(activityobj) {

    for (var i = 0; i < this.favActivity.length; i++) {
      var act = this.favActivity[i];
      if (act.workPackageName == activityobj) {
        this.activity = act.workPackageName;
        this.selectedActivity = act;
        break;
      }
    }
  }

  getLocation(object) {
    for (var i = 0; i < this.nearByPlaces.length; i++) {
      var original = this.nearByPlaces[i].original;
      var changed = this.nearByPlaces[i].changed;

      if (object.locationName == original || (object.originalLocation == original)) {
        this.checkedNumber = i;
        break;
      }
      else if (object.locationName == changed || (object.original == changed)) {
        this.checkedNumber = i;
        break;
      }
    }
  }


}

interface returnedObject {
  proj: string,
  type: string,
  activity: string,
  location: any,
}

interface returnedObject_update {
  proj: string,
  type: string,
  activity: string,
  oldproj: string,
  oldactivity: string,
  location: any,
  oldlocation: string
}

interface TYPEPROJECT {
  name: string,
  activity: string,
  locationName: string,
  originalLocation: string
}