import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { GlobalService } from '../../providers/global-service';
/*
  Generated class for the SavedLocation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-savedlocation',
  templateUrl: 'savedlocation.html'
})
export class SavedLocationPage {

  nearbyPlaces: LOCATION[] = [];
  locationNames: LOCATION[] = [];


  constructor(public globalservice: GlobalService, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {

    //this.nearbyPlaces = navParams.get("location");
    this.nearbyPlaces = [];

    this.globalservice.getProjectsAndLocation();

    if (this.globalservice.projects.length > 0) {

      for (var i = 0; i < this.globalservice.projects.length; i++) {
        var object = this.globalservice.projects[i];
        var obj = {
          original: object.locationName,
          changed: object.originalLocation
        }
        if (!this.checkIfExists(obj))
          this.nearbyPlaces.push(obj);
      }
    }
  }

  checkIfExists(obj) {
    var isPresent = false;

    for (var i = 0; i < this.nearbyPlaces.length; i++) {
      var object = this.nearbyPlaces[i];
      if (obj.original == object.original) {
        isPresent = true;
        break;
      }
    }
    return isPresent;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SavedLocationPage');

    // for (var i = 0; i < this.nearbyPlaces.length; i++) {

    //   var placeName = this.nearbyPlaces[i];
    //   this.locationNames[i] = {
    //     original: placeName.original,
    //     changed: placeName.changed
    //   }
    // }
  }

  renamePrompt(index) {
    let prompt = this.alertCtrl.create({
      title: 'Location Name',
      message: "",
      inputs: [
        {
          name: 'title',
          placeholder: 'Enter custom name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Rename',
          handler: data => {
            console.log('Saved clicked', data.title);

            this.updateLocationInfo(data.title, index);

          }
        }
      ]
    });
    prompt.present();
  }

  updateLocationInfo(changedLocation, index) {

    var object = this.nearbyPlaces[index];
    object.changed = changedLocation;

    for (var i = 0; i < this.globalservice.projects.length; i++) {
      var projectObj = this.globalservice.projects[i];
      if (projectObj.originalLocation == object.original) {
        this.globalservice.projects[i].locationName = object.changed;
      }
    }
    //store the user proj details
    this.globalservice.storage.remove('projects');
    this.globalservice.storage.set('projects', this.globalservice.projects);
    // this.globalservice.storeLocations(object);
  }

}

interface LOCATION {
  original: string,
  changed: string
}

