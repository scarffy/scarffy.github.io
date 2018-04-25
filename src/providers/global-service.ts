import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
@Injectable()
export class GlobalService {

  public user: any;
  public isPushed: boolean;
  public current_staff_activity: any;
  public favProjects: any;
  public favActivities: any;
  public projects: typeProject[] = [];
  public locations: any[] = [];
  public breaktime;
  public clocktime;
  public intermittenttime;
  public fromMenu: boolean;

  constructor(public storage: Storage, public events: Events) {
    this.fromMenu = false;
  }

  storeLocations(locationobj) {


    if (!this.checkIfExist(locationobj))
      this.locations.push(locationobj);

    //store the user proj details
    this.storage.remove('locations');
    this.storage.set('locations', this.locations);
  }

  checkIfExist(name) {

    var isPresent = false;

    for (var i = 0; i < this.locations.length; i++) {
      var obj = this.locations[i];
      if (obj.original == name.original) {
        isPresent = true;
        obj.changed = name.changed;
        break;
      }
    }
    return isPresent;
  }

  getLocations() {

    this.storage.get('locations').then((val) => {
      console.log('location', val);

      if (val != null)
        this.locations = val;
      else
        this.locations = [];
    });

    return this.locations;
  }

  getSpecificLocation(locName) {

    var changedName = "not";
    if (this.locations.length == 0)
      this.getLocations();

    for (var i = 0; i < this.locations.length; i++) {
      var object = this.locations[i];

      if (object.original == locName) {
        changedName = object.changed;
        break;
      }
    }
    return changedName;
  }

  //store the coupled project and location.
  storeProjectsAndLocation(object) {

    if (!this.checkIfProject_LocationExist(object))
      this.projects.push(object);

    //store the user proj details
    this.storage.remove('projects');
    this.storage.set('projects', this.projects);
  }

  getProjectsAndLocation() {

    this.storage.get('projects').then(
      (val) => {
        if (val != null)
          this.projects = val;
      }
    );
  }

  checkIfProject_LocationExist(object) {

    var isPresent: boolean = false;
    var index = -1;
    if (this.projects.length > 0) {
      for (var i = 0; i < this.projects.length; i++) {
        var obj = this.projects[i];

        if ((object.name == obj.name) &&
          (object.activity == obj.activity)) {
          index = i;
          isPresent = true;
          break;
        }
      }
    }
    if (isPresent && index != -1) {
      this.projects[index] = object;
    }
    return isPresent;
  }

}

interface typeProject {
  name: string,
  activity: string,
  locationName: string,
  originalLocation: string
}
