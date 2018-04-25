import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the HomeService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HomeService {
  count: number;
  activityData: any;
  dataUser: any;
  favProjData: any;
  favActivityData:any;

  constructor(public http: Http) {
    //Generate a list ativity 
    this.activityData = [];
    this.count = 0;
  }

  getUser(){
    return this.dataUser;
  }

  setUser(user){
    this.dataUser = user;
  }

 setFavProjectData(faProj){
   this.favProjData = faProj;
 }

 getFavProjectData(){

   return this.favProjData;
 }

 setFavActivityData(faActivity){
   this.favActivityData = faActivity;
 }

 getFavActivityData(){

   return this.favActivityData;
 }
 
  loadActivity(){
    return this.activityData;
  }

  createActivity(activity){
    let newActivity = {
      "id": this.count++,
      "title": activity.title,
      "location": activity.location,
      "currentWork":activity.currentWork,
      "LAT": activity.LAT,
      "LON": activity.LON,
      "activity": activity.activity,
      "from": activity.from,
      "to": activity.to,
      "duration": activity.duration
    };
    this.activityData.unshift(newActivity);
  }

}
