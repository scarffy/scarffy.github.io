import { Component, ElementRef, ViewChild } from '@angular/core';//OnDestroy
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { LocationService } from '../../providers/location-service';
import { GlobalService } from '../../providers/global-service';
import { LoadingController } from 'ionic-angular';
import { SavedLocationPage } from '../savedlocation/savedlocation';
import { ISubscription } from "rxjs/Subscription";
import { Storage } from '@ionic/storage';
/*
  Generated class for the Projectdetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var google;

@Component({
  selector: 'page-projectdetails',
  templateUrl: 'projectdetails.html'
})
export class ProjectDetailsPage  /*implements OnDestroy*/ {

  private subscription: ISubscription;
  @ViewChild('map') mapElement: ElementRef;
  projectName: string;
  activityName: string;
  locationName;
  favActivity: any;
  showSearchResult: any;
  places: any;
  nearByPlaces: LOCATION[] = [];
  autoCompleteService: any;
  placeService: any;
  //loader: any;
  currentLocation: any = {};
  map: any;
  activity: any;
  selectedRadioButton;
  checkedNumber;
  constructor(public navCtrl: NavController, public location: LocationService, public globalservice: GlobalService,
    public loadingCtrl: LoadingController, public navParams: NavParams, public alertCtrl: AlertController,
    public storage: Storage) {

    this.projectName = navParams.get("project");
    this.activityName = navParams.get("activity");
    this.activity = navParams.get("activity");
    this.locationName = navParams.get("location");
    //this.checkedNumber = 0;
    this.autoCompleteService = new google.maps.places.AutocompleteService();
    this.places = [];
    this.favActivity = this.globalservice.favActivities;
    this.favActivity.sort((a, b) => {
      if (a.workPackageName < b.workPackageName) return -1;
      if (a.workPackageName > b.workPackageName) return 1;
      return 0;
    });

  }


  ngOnInit() {

  }

  ngOnDestroy() {

    console.log("Page is destroyed");
    this.subscription.unsubscribe();
  }

  loadMap() {

    var self = this;

    var loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();

    console.log(self.currentLocation.LAT, self.currentLocation.LON);
    let latLng = new google.maps.LatLng(self.currentLocation.LAT, self.currentLocation.LON);

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

      if (status == google.maps.places.PlacesServiceStatus.OK) {

        self.nearByPlaces = [];

        if (results == null) {
          results = [];
        }

        // if (results.length > 0) {
        //   var place = results[0];
        //   self.locationName = place.name;
        // }

        for (var i = 0; i < results.length; i++) {

          var object = results[i];


          var changedName = self.globalservice.getSpecificLocation(object.name);

          if (object.name == self.locationName || changedName == self.locationName)
            self.checkedNumber = i;

          if (changedName == "not")
            changedName = object.name;

          var obj = {
            original: object.name,
            changed: changedName
          }
          // self.nearByPlaces.push(results[i]);
          self.nearByPlaces.push(obj);

        }


        console.log("Nearby Places" + self.nearByPlaces);
        loader.dismiss();
      }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectDetailsPage');

    var loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();

    var self = this;

    this.location.initLocation();
    self.subscription = self.location.callAsyncService.subscribe(function (currentLocation) {
      self.currentLocation.name = currentLocation.name;
      self.currentLocation.LAT = currentLocation.LAT;
      self.currentLocation.LON = currentLocation.LON;
      self.loadMap();
      console.log(currentLocation);
      loader.dismiss();
    });
  }



  onSelectionActivity() {

    let item = this.activity;//.workPackageName;
    this.activityName = item;//item.workPackageName;
    console.log('The selected project button is' + this.activityName);
  }

  savechanges() {

    var changedName = this.globalservice.getSpecificLocation(this.locationName);

    if (changedName == "not")
      changedName = this.locationName;

    var localProjType = {
      "name": this.projectName,
      "activity": this.activityName,
      "locationName": changedName,
      "originalLocation": this.locationName
    }
    this.globalservice.storeProjectsAndLocation(localProjType);
    this.navCtrl.pop();
  }


  onSelectionChange(entry) {
    this.selectedRadioButton = entry;
    this.locationName = entry;
    console.log('The selected radio button is' + this.selectedRadioButton);
  }

  dismiss() {

  }

  manageSavedLocation() {

    this.navCtrl.push(SavedLocationPage/*, {
      "location": this.nearByPlaces
    }*/);
  }

}

interface LOCATION {
  original: string,
  changed: string
}
