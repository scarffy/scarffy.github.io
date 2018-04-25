import { Injectable, EventEmitter } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Geolocation } from 'ionic-native';
import { Network } from 'ionic-native';
import { Platform } from 'ionic-angular';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

declare var google;
declare var Connection;

@Injectable()
export class LocationService {

  loader: any;
  onDevice: boolean;
  isCalled: boolean;

  callAsyncService: EventEmitter<any> = new EventEmitter();
  currentLoction: any = {};
  selectedProject: any;
  selectedActivity: any;

  constructor(public loadingCtrl: LoadingController, public platform: Platform) {
    this.onDevice = this.platform.is('cordova');
    // this.loader = loadingCtrl.create({
    // content:"Please wait..."
    // });
    this.isCalled = true;
    this.initLocation();
  }

  initLocation() {
    var self = this;
    //self.loader.present();
    Geolocation.getCurrentPosition().then((position) => {
      self.currentLoction.LAT = position.coords.latitude;
      self.currentLoction.LON = position.coords.longitude;
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'location': latLng }, function (results, status) {
        if (status === 'OK') {
          console.log(results);
          // self.loader.dismiss();
          self.currentLoction.name = results[0].formatted_address;
          self.callAsyncService.emit(self.currentLoction);
        } else {
          window.alert('Geocoder failed due to: ' + status);

        }
        // self.loader.dismiss();
      });

    }, (error) => {

      // self.loader.dismiss();
      self.callAsyncService.emit("Error");
      console.log("err=> " + JSON.stringify(error.err));
    });

  }

  setCurrentLocation(newLocation) {
    var self = this;
    self.currentLoction.name = newLocation.name;
    self.currentLoction.LAT = newLocation.LAT;
    self.currentLoction.LON = newLocation.LON;
    self.callAsyncService.emit(self.currentLoction);
  }

  setSelectedProject(proj) {
    this.selectedProject = proj;
  }

  getSelectedProject() {

    return this.selectedProject;
  }

  setSelectedActivity(activity) {
    this.selectedActivity = activity;
  }

  getSelectedActivity() {
    return this.selectedActivity;
  }

  getCurrentLocation() {
    return this.currentLoction;
  }

  isOnline(): boolean {
    if (this.onDevice && Network.type) {
      return Network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  isOffline(): boolean {
    if (this.onDevice && Network.type) {
      return Network.type === Connection.NONE;
    } else {
      return !navigator.onLine;
    }
  }
}


