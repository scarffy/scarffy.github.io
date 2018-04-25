import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar } from 'ionic-angular';
import { GlobalService } from '../../providers/global-service';

import { ProjectAddPage } from '../projectadd/projectadd';
import { ProjectDetailsPage } from '../projectdetails/projectdetails';


/*
  Generated class for the Projectschedule page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-projectschedule',
  templateUrl: 'projectschedule.html'
})
export class ProjectSchedulePage {
  @ViewChild(Navbar) navBar: Navbar;
  items = [];
  typeProjects = [];

  storedProjects: TYPEPROJECT[] = [];
  listofItems: TYPEPROJECT[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalservice: GlobalService) {


  }

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e: UIEvent) => {
      // todo something
      this.navCtrl.pop();
    }
  }
  ionViewWillEnter() {

    this.items = this.globalservice.favProjects;
    this.typeProjects = this.globalservice.projects;

    if (this.typeProjects == null)
      this.typeProjects = [];

    this.createListItems();

  }

  isPresent(obj): boolean {

    return false;
  }


  createListItems() {

    for (var i = 0; i < this.items.length; i++) {

      var projectName = this.items[i];
      var locationName = this.searchForLocation(projectName);
      var activityName = this.searchForActivity(projectName);

      this.listofItems[i] = {
        name: this.items[i].projectName,
        activity: activityName,
        locationName: locationName
      }
    }

    this.listofItems.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    console.log("LIst: ", this.listofItems);
  }

  searchForLocation(project) {

    var location = "Undefined";

    for (var i = 0; i < this.typeProjects.length; i++) {

      var obj = this.typeProjects[i];

      if (obj.name == project.projectName) {
        location = obj.locationName;
        break;
      }

    }
    return location;
  }

  searchForActivity(project) {

    var activity = "";

    for (var i = 0; i < this.typeProjects.length; i++) {

      var obj = this.typeProjects[i];

      if (obj.name == project.projectName) {
        activity = obj.activity;
        break;
      }
    }
    return activity;

  }


  onAddProject() {

  }

  addProject() {
    this.navCtrl.push(ProjectAddPage);
  }


  viewDetails(item) {
    this.navCtrl.push(ProjectDetailsPage, {
      "project": item.name,
      "activity": item.activity,
      "location": item.locationName

    });
  }


}

interface TYPEPROJECT {
  name: string,
  activity: string,
  locationName: string
}

interface LISTPROTOTYPE {
  name: string,
  location: string
}