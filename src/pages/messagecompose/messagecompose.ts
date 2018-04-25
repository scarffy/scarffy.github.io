
// import { ViewChild, ElementRef, Component } from '@angular/core';
// import {ViewController} from 'ionic-angular';
// import {LocationService} from '../../providers/location-service';
// import {GlobalService} from '../../providers/global-service';
// import {LoadingController} from 'ionic-angular';



// declare var google;

// @Component({
//   selector: 'page-messagecompose',
//   templateUrl: 'messagecompose.html',
//   providers: [LocationService]
// })
// export class MessageComposePage {

//   // @ViewChild('map') mapElement: ElementRef;
//   // currentLocation: any = {};
//   // map: any;
//   // showSearchResult: any;
//   // places: any;
//   // nearByPlaces: any;
//   // autoCompleteService:any;
//   // placeService: any;
//   // loader : any;
//   // favProjects: any;
//   // favActivity: any;
//   // selectedRadioButton;
//   // projectCode:any;
//   // activity:any;
//   // selectedProject;
//   // selectedActivity;
//   // objReturned:returnedObject;
//   // localProjType:TYPEPROJECT;

//   constructor(private viewCtrl: ViewController, public location: LocationService, public globalservice: GlobalService,
//   public loadingCtrl: LoadingController) {
//     var self = this;
//     self.showSearchResult = true;

//   }


//   dismiss() {
//     // this.location.setCurrentLocation(this.currentLocation);
    
//     // this.objReturned = {
//     //   proj: "",
//     //   type:"dismiss",
//     //   activity: "",
//     //   location: this.currentLocation
//     // };
//     //this.viewCtrl.dismiss(this.currentLocation);
//     this.viewCtrl.dismiss(this.objReturned);
//   }

//   // update(){
//   //   this.location.setCurrentLocation(this.currentLocation);
//   //   this.location.setSelectedProject(this.selectedProject);
//   //   this.location.setSelectedActivity(this.selectedActivity);

//   //   this.objReturned = {
//   //     proj: this.selectedProject,
//   //     type:"update",
//   //     activity: this.selectedActivity,
//   //     location: this.currentLocation
//   //   };
    
    
//   //   /* add the ptoject type with name,activity and location stored in global service*/
//   //   this.localProjType = {
//   //      name:this.selectedProject,
//   //      activity:this.selectedActivity,
//   //      locationName:this.selectedRadioButton
//   //   }
//   //   // if(this.globalservice.projects.length >0){
//   //    if(this.globalservice.projects == null){
//   //     var isPresent:boolean = false;
    
//   //    this.globalservice.projects = [];
//   //     for(var i =0;i<this.globalservice.projects.length;i++){
//   //         var obj = this.globalservice.projects[i];

//   //         //modify the object with new entry
//   //         if(this.selectedProject == obj.name){
//   //           isPresent = true;
//   //           obj.activity = this.selectedActivity;
//   //           obj.locationName = this.selectedRadioButton;
//   //           break;
//   //         }
//   //     }

//   //     if(!isPresent)
//   //      this.globalservice.projects.push(this.localProjType);

//   //   }else{
//   //     this.globalservice.projects = [];
//   //     this.globalservice.projects.push(this.localProjType);
//   //   }

//   //   //this.viewCtrl.dismiss(this.currentLocation);
//   //   this.viewCtrl.dismiss(this.objReturned);
//   // }

//   // completed(){

//   //   this.location.setCurrentLocation(this.currentLocation);
//   //   this.location.setSelectedProject(this.selectedProject);
//   //   this.location.setSelectedActivity(this.selectedActivity);

//   //   this.objReturned = {
//   //     proj: this.selectedProject,
//   //     type:"completed",
//   //     activity: this.selectedActivity,
//   //     location: this.currentLocation
//   //   };

//   //   /* add the ptoject type with name,activity and location stored in global service*/
//   //   this.localProjType ={
//   //      name:this.selectedProject,
//   //      activity:this.selectedActivity,
//   //      locationName:this.selectedRadioButton
//   //   }
     
     
//   //   //if(this.globalservice.projects.length >0){
//   //    if(this.globalservice.projects == null){

//   //      this.globalservice.projects = [];
//   //     var isPresent:boolean = false;
//   //     var index;

//   //     for(var i =0;i<this.globalservice.projects.length;i++){
//   //         var obj = this.globalservice.projects[i];

//   //         //modify the object with new entry
//   //         if(this.selectedProject == obj.name){
//   //           isPresent = true;
//   //           index = i;
//   //           obj.activity = this.selectedActivity;
//   //           obj.locationName = this.selectedRadioButton;
//   //           break;
//   //         }
//   //     }

//   //     if(!isPresent)
//   //      this.globalservice.projects.push(this.localProjType);

//   //   }else{
//   //     this.globalservice.projects = [];
//   //     this.globalservice.projects.push(this.localProjType);
//   //   }

//   //   //this.viewCtrl.dismiss(this.currentLocation);
//   //   this.viewCtrl.dismiss(this.objReturned);
//   // }



// }
