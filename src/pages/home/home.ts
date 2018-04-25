import { ViewChild, ElementRef, Component } from '@angular/core';

import { NavController, ModalController, ToastController, FabContainer, AlertController, Platform } from 'ionic-angular';

import { SampleModalPage } from '../modal/modal';
import { WeeklyPage } from '../weekly/weekly';
import { LoadGeometryPage } from '../loadgeometry/loadgeometry';
import { LoadingController } from 'ionic-angular';
import { HomeService } from '../../providers/home-service';
import { LocationService } from '../../providers/location-service';
import { GlobalService } from '../../providers/global-service';
import { Geolocation } from 'ionic-native';
import { ApiService } from '../../providers/api-service';
import { Config } from '../../providers/_config';
import { SchedulePage } from '../schedule/schedule';
import { EmergencyPage } from '../emergency/emergency';
import { TimesheetPage } from '../timesheet/timesheet';
import { ProjectSchedulePage } from '../projectschedule/projectschedule';
import { Storage } from '@ionic/storage';
import { ISubscription } from "rxjs/Subscription";
import { InAppBrowser } from 'ionic-native';
import { BackgroundMode } from '@ionic-native/background-mode';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ApiService, Config, HomeService, LocationService]
})

export class HomePage {

  private subscription: ISubscription;
  today_history: string = "today";
  datenow: any;
  shift: any;
  onbreak: boolean;
  autoCompleteService: any;
  scheduleTitle: string;
  breakTimeString;
  clockedInTimeString;
  intermittentTimeString;
  timer;
  isClockHistory: boolean;
  isShiftForToday: boolean;

  @ViewChild('map1') mapElement: ElementRef;
  currentLocation: any = {};
  map1: any;
  allprojects: PROJECT[];
  favProjects: FAVPROJECT[];
  favActivities: FAVACTIVITY[];
  modalData: MODAL;
  placeService: any;

  currentActivity: any = {};
  status: {
    clock: string,
    break: string
  }

  time: any = {};

  currentWork: string;
  selectedProject: string;
  selectedActivity: string;
  activity: any;
  dataUser: any;
  organization: any;
  stationname:any;
  shiftSchedule: any;
  locationArr: any = [];
  googleLocation: any;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public homeService: HomeService, public toastCtrl: ToastController,
    public location: LocationService, public globalservice: GlobalService, public api: ApiService, public config: Config,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, public storage: Storage,
    public backgroundMode: BackgroundMode, private ga: GoogleAnalytics, public platform: Platform) {


    var self = this;

    this.initializeMembers();

    // Start the timer method. It will help us to get the current date and time
    self.startTime();

    //load the activity if existed.
    self.loadActivity();


    self.platform.ready().then(
      () => {
        self.ga.startTrackerWithId('UA-58698748-5')
          .then(() => {
            self.ga.trackView('Home Screen Constructor');
          })
          .catch(e => console.log('Error starting GoogleAnalytics', JSON.stringify(e)));
      },
      (error) => {
        console.log("GA Error is: ", JSON.stringify(error));
      }
    );

  }


  //During the start up of the view initialize all the member variables
  initializeMembers() {
    var self = this;

    self.datenow = "null";
    self.shift = "null";
    self.status = {
      clock: "CLOCK IN",
      break: "DAY OFF"
    };

    self.isShiftForToday = false;
    self.stationname = "";

    //Changing from side menu back to the screen
    if (self.globalservice.fromMenu) {
      self.breakTimeString = self.globalservice.breaktime;
      self.clockedInTimeString = self.globalservice.clocktime;
      self.intermittentTimeString = self.globalservice.intermittenttime;

    } else {
      self.breakTimeString = "00:00 00";
      self.clockedInTimeString = "00:00 00";
      self.intermittentTimeString = "00:00 00";
    }

    self.currentActivity.title = "CLOCK IN";
    self.currentActivity.activity = "clockin";

    if (self.globalservice.user != undefined) {
      console.log(self.globalservice.user);
      self.organization = self.globalservice.user.Organization;
      self.shiftSchedule = "8.00 am - 6.00 pm";

      if (self.globalservice.user.Organization == "MRDA")
        self.scheduleTitle = "SHOW MY SCHEDULE";
      else
        self.scheduleTitle = "MY PROJECT LIST";
    }

  }

  //On initializing the Page
  ngOnInit() {
    var self = this;
    self.dataUser = self.globalservice.user; //this.homeService.getUser();
    if (self.globalservice.user != undefined) {
      console.log(self.globalservice.user);
      self.organization = self.globalservice.user.Organization;
      self.shiftSchedule = "8.00 am - 6.00 pm";
      console.log(self.shiftSchedule);
      /* let toast = this.toastCtrl.create({
      message: 'Welcome ' + self.globalservice.user.Person_Name + ', '+ self.globalservice.user.Organization,
      position: 'bottom',
      duration: 3000
    });
    toast.present();*/
    }

  }

  //On destroying the page
  ngOnDestroy() {
    console.log("Page is destroyed");
    // this.subscription.unsubscribe();
  }


  ionViewDidLoad() {

    var test = this.storage.get('projects');
    console.log("test proj: ", test);

    this.isClockHistory = false;
    this.loadUserLocation();
    this.loadMap();
    this.requestForVersionCheck();

  }

  /*
   Load the user location with this method. It calls asynchronous method to get the location.
   Once we get the location, we load the map and set the current activity for the day.
  */
  loadUserLocation() {

    var self = this;

    this.platform.ready().then(

      () => {
        self.location.callAsyncService.subscribe(

          (currentLocation) => {
            self.googleLocation = currentLocation;
            // self.currentActivity.location = currentLocation.name;
            self.currentActivity.LAT = currentLocation.LAT;
            self.currentActivity.LON = currentLocation.LON;
            //self.loadMap();
          },
          (error) => {
            console.log("Error happened" + error);
          },
          () => {
            console.log("the subscription is completed");
          }
        );
      }
    );

    //self.location.initLocation();


  }

  /*
   This function will check the latest version from the server
   and will give an alert to the user if any version update is 
   required.
  */
  requestForVersionCheck() {

    var ver_number = 1.3;

    let url = this.config.getApiPath().VERSION_CHECK;

    var self = this;
    self.dataUser = self.globalservice.user;

    let request = {
      "device_type": "ionic",
      "app_name": "IStaff"
    };

    this.api.callService(url, request).subscribe(

      (result) => {

        if (result.records) {
          //if (result.records.Version != null) {

          if (result.records != null) {
            var object = result.records[0];
            var version = +object.Version;
            // var version = +result.records.Version;

            //comparing the server version with the local one
            if (ver_number < version) {
              let alert = this.alertCtrl.create({
                title: 'Alert',
                subTitle: 'Please download the latest version of the app',
                buttons: [{
                  text: 'OK',
                  handler: () => {
                    console.log("Second OK");
                    let browser = new InAppBrowser("https://www.csc-crowddynamics.com/istaff.html", '_blank');
                    alert.dismiss(); // DISMISSING MANUALLY
                  }
                }]
              });
              alert.present();
              return;

            } //else {
            if (this.globalservice.user != null) {
              if (this.globalservice.user.Organization != "MRDA")
                this.requestServerForFavProj();
              else {
                //call MRDA web service
                this.requestServerForStaffSchedule();
                //this.loadMap();
              }
            } else
              this.loginprocess();
            // }
          }
        }

      },
      (error) => {
        console.error("Error happned in calling Fav Projects: " + error);
      },
      () => {
        console.log("Get FavProjects success");
      }
    );

  }

  /*
    This method is called to maintain persistent login if the user
    has not logged out.
  */
  loginprocess() {

    var self = this;
    self.storage.get('user').then((val) => {
      console.log('username', val);

      if (val != null) {
        self.storage.get('password').then((val1) => {

          console.log('password', val1);

          let loader = self.loadingCtrl.create({
            content: "Please wait..."
          });
          loader.present();
          let url = this.config.getApiPath().USER_LOGIN;

          let request = {
            "Username": val,
            "User_Password": val1
          };
          this.api.callService(url, request).subscribe(function (data) {

            loader.dismiss();

            if (data.rows != undefined) {

              //storing the data in the local database which are providers
              self.homeService.setUser(data.rows[0]);
              self.globalservice.user = self.homeService.dataUser;

              //trigerring the event for pushing the login details from where
              //side menu will have their user data
              self.globalservice.events.publish('user:login', data.rows[0]);

              //storing locally in the class
              self.dataUser = self.globalservice.user;

              if (self.globalservice.user != undefined) {
                console.log(self.globalservice.user);
                self.organization = self.globalservice.user.Organization;
                self.shiftSchedule = "8.00 am - 6.00 pm";
              }

              if (self.globalservice.user.Organization == "MRDA")
                self.scheduleTitle = "SHOW MY SCHEDULE";
              else
                self.scheduleTitle = "MY PROJECT LIST";

              //this.logintoAppologic(val1, self.globalservice.user);

              //For XM and YTL employees, call the Deskara webservice to get the favorite projects  
              if (self.globalservice.user.Organization != "MRDA")
                self.requestServerForFavProj();
              else {
                self.requestServerForStaffSchedule();
                // self.loadMap();
              }

            }

          },
            function (error) {
              console.log("Error happened" + error);
            },
            function () {
              console.log("the subscription is completed");
            });
        });

      } else {

      }

    });
  }

 /* logintoAppologic(password, object) {

    this.platform.ready().then(
      () => {
        alert("platform ready");

        var alUser = {
          'userId': object.Person_Name,   //Replace it with the userId of the logged in user
          'password': password,  //Put password here
          'authenticationTypeId': 1,
          'applicationId': '13cb0db78677b8d972d085c6d83ffb8ef' //replace "applozic-sample-app" with Application Key from Applozic 
        };
        alert("login to chat : " + JSON.stringify(alUser));
        applozic.login(alUser, function (a) {
          alert("REsult : " + a);

        }, function (d) { alert("d:" + d) });
      });
  } */

  /*
    This method will pull the favorite projects from the Deskara for YTL and XM employees.
    and store it in our database
  */
  requestServerForFavProj1() {

    var self = this;
    let loader = this.loadingCtrl.create({
      content: "Please wait...Loading projects"
    });
    loader.present();

    let url = this.config.getApiPath().VIEW_FAVPROJECTS;

    self.dataUser = self.globalservice.user;

    let request = {
      "loginUserId": self.dataUser.Deskara_Id,
      "orgId": self.dataUser.Org_DeskeraId,
      "environment": "PDC"
    };

    this.api.callService(url, request).subscribe(

      (result) => {
        loader.dismiss();
        if (result.result) {
          this.favProjects = result.result.favouriteProjectsResponse.favouriteProjects;

          self.homeService.setFavProjectData(this.favProjects);
          self.globalservice.favProjects = this.favProjects;//self.homeService.favProjData;

          //call this method to get the favorite activities registered in Deskara
          self.requestServerForFavActivity1();
        }

      },
      (error) => {
        loader.dismiss();
        console.error("Error happened in calling Fav Projects: " + error);
      },
      () => {
        console.log("Get FavProjects success");
      }
    );

  }


  requestServerForFavProj() {

    var self = this;
    let loader = this.loadingCtrl.create({
      content: "Please wait...Loading projects"
    });
    loader.present();

    let url = this.config.getApiPath().VIEW_FAVPROJECTS;

    self.dataUser = self.globalservice.user;

    let request = {
      "loginUserId": self.dataUser.Deskara_Id,
      "orgId": self.dataUser.Org_DeskeraId,
      "environment": "PDC"

    };

    this.api.callService(url, request).subscribe(

      (result) => {
        loader.dismiss();
        if (result.result) {
          self.favProjects = result.result.favouriteProjectsResponse.favouriteProjects;
          self.homeService.setFavProjectData(this.favProjects);
          self.globalservice.favProjects = self.homeService.favProjData;
          self.selectedProject = this.favProjects[0].projectName;

          // this.currentActivity.title = this.favProjects[0].projectName;

          if (this.locationArr.length > 0)
            this.currentActivity.location = this.locationArr[0].changed;

          //call this method to get the favorite activities from the Deskara
          self.requestServerForFavActivity();
        }

      },
      (error) => {
        loader.dismiss();
        console.error("Error happned in calling Fav Projects: " + error);
      },
      () => {
        console.log("Get FavProjects success");
      }
    );

  }

  /*
  This method will get the current schedule for the staff
  */
  requestServerForStaffSchedule() {
    var self = this;
    let loader = this.loadingCtrl.create({
      content: "Please wait...Loading schedule"
    });
    loader.present();

    var url = this.config.getApiPath().VIEW_STAFF_CUR_SCHEDULE;

    self.dataUser = self.globalservice.user;

    var today = new Date();
    var month = today.getMonth() + 1;
    var monthStr;

    if (month < 10)
      monthStr = "0" + month.toString();
    else
      monthStr = month.toString();

    var day = today.getDate();
    var dayString;

    if (day < 10)
      dayString = "0" + day.toString();
    else
      dayString = day.toString();

    var hr = today.getHours().toString();
    var min = today.getMinutes().toString();
    var sec = today.getSeconds().toString();

    var datestring = today.getFullYear().toString() + "-" + monthStr + "-" + dayString + " " + hr + ":" + min + ":" + sec;
    //Susanta harcoding to see the schdule 
    //datestring = "2016-09-12 00:00:00";

    url = url + "?date=" + datestring + "&staffId=" + self.dataUser.User_Id + "&orgId=" + self.dataUser.Org_Id.toString();


    self.api.callServiceGet(url).subscribe(
      (result) => {
        loader.dismiss();
        console.log("Response is" + result);
        if (result.result != null) {
          self.isShiftForToday = true;
          self.stationname =  result.result[0].StationName;
          self.showdirection(self.currentLocation.LAT, self.currentLocation.LON, result.result[0].Latitude, result.result[0].Longitude);
        } else {
          self.isShiftForToday = false;
          //self.loadMap();
        }

      },
      (error) => {
        loader.dismiss();
        //self.loadMap();
        console.error("Error happned in calling Fav Projects: " + error);
      },
      () => {
        console.log("Get FavProjects success");
      }
    );
  }

  /*
   This method is responsible to get all the favorite projects from the Deskara.
  */
  requestServerForFavActivity1() {

    var self = this;
    let url = this.config.getApiPath().VIEW_FAVACTIVITIES;
    self.dataUser = self.globalservice.user;

    let request = {
      "loginUserId": self.dataUser.Deskara_Id,
      "orgId": self.dataUser.Org_DeskeraId,
      "environment": "PDC"
    };

    this.api.callService1(url, request).subscribe(

      (result) => {
        if (result.result) {
          self.favActivities = result.result.favouriteActivitiesResponse.favouriteWorkPackage;
          self.homeService.setFavActivityData(this.favActivities);
          self.globalservice.favActivities = self.homeService.favActivityData;


        }
      },

      (error) => {
        console.log("Error happnd in calling fav activities");
      },

      () => {
        console.log("Fav activities success");
      }
    );
  }

  requestServerForFavActivity() {

    var self = this;
    let url = this.config.getApiPath().VIEW_FAVACTIVITIES;
    self.dataUser = self.globalservice.user;

    let request = {
      "loginUserId": self.dataUser.Deskara_Id,
      "orgId": self.dataUser.Org_DeskeraId,
      "environment": "PDC"
    };

    this.api.callService1(url, request).subscribe(

      (result) => {
        if (result.result) {

          this.favActivities = result.result.favouriteActivitiesResponse.favouriteWorkPackage;
          this.selectedActivity = this.favActivities[0].workPackageName;
          self.homeService.setFavActivityData(this.favActivities);
          self.globalservice.favActivities = self.homeService.favActivityData;


          // this.currentActivity.currentWork = this.favActivities[0].workPackageName;
          // this.currentActivity.activity = this.favActivities[0].workPackageName;

          //get the projects from the storage DB
          this.updateGlobalProjects();

          //get the last status of the application
          this.requestServerGetClockStatus();
        }
      },

      (error) => {
        console.log("Error happnd in calling fav activities");
      },

      () => {
        console.log("Fav activities success");
      }
    );
  }

  /*
   This method gives the information about the last activity status of the user
   faye:"267205c6-dc7c-49fb-b182-056c49d80efd"
  */
  requestServerGetClockStatus() {

    var today = new Date();

    var month = today.getMonth() + 1;
    var monthStr;

    if (month < 10)
      monthStr = "0" + month.toString();
    else
      monthStr = month.toString();

    var day = today.getDate();
    var dayString;

    if (day < 10)
      dayString = "0" + day.toString();
    else
      dayString = day.toString();

    var datestring = today.getFullYear().toString() + "-" + monthStr + "-" + dayString;

    let loader = this.loadingCtrl.create({
      content: "Please wait...Get Clock Status"
    });
    loader.present();

    let url = this.config.getApiPath().CLOCK_GET_STATUS;

    let request = {
      "loginUserId": this.globalservice.user.Deskara_Id,
      "date": datestring
    };

    this.api.callService(url, request).subscribe(

      (result) => {
        loader.dismiss();
        console.log("Get Clock Status: " + result.result);

        if (result.result != null) {

          if (result.result.length == 0) {
            //this.incrementClock();
            //this.loadMap();
            return;
          }

          var tempObj = result.result[0];

          var data = {
            proj: tempObj.projectId,
            type: "",
            activity: tempObj.workPackageId,
            location: tempObj.locationName
          };

          this.modalData = data;
          this.isClockHistory = true;

          if (tempObj.status != "click_out") {

            this.selectedProject = tempObj.projectName;
            this.currentActivity.title = tempObj.projectName;
            this.currentActivity.location = tempObj.locationName;
            this.selectedActivity = tempObj.workPackageName;
            this.currentActivity.currentWork = tempObj.workPackageName;
            this.currentActivity.activity = tempObj.workPackageName;

            this.setDefaultLoc_Activity();
            //this.findLastClockedInProject(tempObj);
            // this.findLastClockedInActivity(tempObj);


            if (tempObj.status == "pause") {

              this.status.clock = "CLOCK OUT";
              this.currentActivity.activity = "break";
              this.currentActivity.title = "On break";

              var time = tempObj.time;
              time = time.substr(0, 8);
              var timearr = time.split(":");

              var date = tempObj.date;
              var datearr = date.split("-");

              var year = datearr[0];
              var month = datearr[1];
              var day = datearr[2];

              var hr = timearr[0];
              var min = timearr[1];

              this.currentActivity.from = new Date(year, month, day, hr, min);

              this.time.break = this.time.current;

              this.breakTimeString = this.clockedInTimeString;
              this.globalservice.breaktime = this.breakTimeString;

              this.clockedInTimeString = "00:00 00";
              this.globalservice.clocktime = this.clockedInTimeString;
              this.incrementClock();

              this.onbreak = true;
              this.status.break = "RESUME";


            } else if (tempObj.status == "resume") {
              //this.clockedInTimeString = this.breakTimeString;
              this.breakTimeString = "00:00 00";
              this.globalservice.breaktime = this.breakTimeString;

              this.status.clock = "CLOCK OUT";
              this.time.break = this.time.current;
              this.status.break = "BREAK";
              this.onbreak = false;

              var time = tempObj.time;
              var timearr = time.split("-");
              time = timearr[1];
              var timearr = time.split(":");

              var date = tempObj.date;
              var datearr = date.split("-");

              var year = datearr[0];
              var month = datearr[1];
              var day = datearr[2];

              var hr = timearr[0];
              var min = timearr[1];

              this.currentActivity.from = new Date(year, month, day, hr, min);

              this.incrementClock();

            } else if (tempObj.status == "click_in") {
              this.time.break = this.time.current;
              this.status.clock = "CLOCK OUT";
              this.status.break = "BREAK";
              //this.breakTimeString = this.clockedInTimeString;

              var time = tempObj.time;

              var timearr = time.split(":");

              var date = tempObj.date;
              var datearr = date.split("-");

              var year = datearr[0];
              var month = datearr[1];
              var day = datearr[2];

              var hr = timearr[0];
              var min = timearr[1];

              this.currentActivity.from = new Date(year, month, day, hr, min);

              this.incrementClock();
            }
          }

          else {
            this.status.clock = "END CLOCK";

          }
          this.modifyTimelineActivity(result.result);

          //this.loadUserLocation();
          // this.loadMap();

        } else {
          this.setDefaultLoc_Activity();
          //this.loadUserLocation();
          //this.loadMap();
        }
      },

      (error) => {
        loader.dismiss();
        console.error("Error : " + JSON.stringify(error.err));
        // this.loadUserLocation();
        //this.loadMap();
        // if (this.currentLocation.name != undefined)
        //this.loadMap();

      },
      () => {
        console.log('getData completed1');

      }


    );
  }

  updateGlobalProjects() {

    this.storage.get('projects').then(
      (value) => {
        console.log("Stored projects: ", JSON.stringify(value));
        console.log("Stored projects: ", value);
        if (value != null) {
          for (var i = 0; i < value.length; i++) {
            this.globalservice.projects.push(value[i]);
          }
        } else
          this.globalservice.projects = [];
      });
  }

  requestServerForClockStatus(request) {

    let loader = this.loadingCtrl.create({
      content: "Please wait...clock"
    });
    loader.present();

    let url = this.config.getApiPath().CLOCK_ADD_STATUS;

    this.api.callService(url, request).subscribe(function (result) {

      loader.dismiss();
      console.log("Set Clock status: " + request.status + ": " + result.result);

    },
      function (error) {
        loader.dismiss();
        console.error("Error : " + JSON.stringify(error.err));
      },
      function () {
        console.log('requestServerForClockStatus success');
      }
    );

    /*  this.api.callService(url, request).subscribe(
   
        result => {
          loader.dismiss();
          console.log("Set Clock status: " + request.status + ": " + result.result);
   
        },
        err => {
          loader.dismiss();
          console.error("Error : " + err);
   
   
        },
        () => {
          console.log('getData completed1');
   
        }
   
   
      );*/
  }


  findLastClockedInProject(tempObj) {

    for (var i = 0; i < this.favProjects.length; i++) {
      var obj = this.favProjects[i];
      if (obj.projectId == tempObj.ProjectId) {
        this.selectedProject = obj.projectName;
        this.currentActivity.title = obj.projectName;
        break;
      }
    }
  }

  findLastClockedInActivity(tempObj) {

    for (var i = 0; i < this.favActivities.length; i++) {
      var obj = this.favActivities[i];
      if (obj.workPackageId == tempObj.WorkPackageId) {
        this.selectedActivity = obj.workPackageName;
        this.currentActivity.currentWork = obj.workPackageName;
        this.currentActivity.activity = obj.workPackageName;
        break;
      }
    }
  }

  modifyTimelineActivity(result) {

    var totalArr = [];

    var tempArr = result.slice();

    for (var i = 1; i < result.length; i++) {

      var timesheetobj = result[i];
      if (timesheetobj.status == "pause") {

        var tempTimeSheetobj = result[i - 1];
        var activitylocal: any = {};
        activitylocal.title = "On break";
        activitylocal.currentWork = "break";
        activitylocal.activity = "break";

        var clockouttime = tempTimeSheetobj.time;
        var clockoutArr = clockouttime.split("-");
        var clockoutFrom = clockoutArr[0];
        var clockoutTo = clockoutArr[1];
        var date = tempTimeSheetobj.date;
        var datearr = date.split("-");
        var clockoutFromArr = clockoutFrom.split(":");
        var clockoutToArr = clockoutTo.split(":");
        var year = datearr[0];
        var month = datearr[1];
        var day = datearr[2];
        var fromHour = +clockoutFromArr[0];
        var fromMin = +clockoutFromArr[1];
        var fromSec = +clockoutFromArr[2];
        var toHour = +clockoutToArr[0];
        var toMin = +clockoutToArr[1];
        var toSec = +clockoutToArr[2];

        activitylocal.from = new Date(year, month, day, fromHour, fromMin, fromSec);
        activitylocal.to = new Date(year, month, day, toHour, toMin, toSec);

        var dur = tempTimeSheetobj.duration;
        var durArr = dur.split(":");
        var durHr = +durArr[0];
        var durMin = +durArr[1];
        var durSec = +durArr[2];

        var tailStr;

        if (durHr >= 1) {

          if (durMin > 0)
            tailStr = "hrs";
          else
            tailStr = "hr";

        } else if (durHr == 0 && durMin == 0) {
          if (durSec > 1)
            tailStr = "secs";
          else if (durSec == 1)
            tailStr = "sec";

        } else if (durHr == 0 && durMin >= 1) {
          if (durMin > 1)
            tailStr = "mins"
          else
            tailStr = "min"
        }

        var totalDur;
        if (durHr >= 1) {
          if (durMin > 10)
            totalDur = durHr.toString() + ":" + durMin.toString() + " " + tailStr;
          else
            totalDur = durHr.toString() + ":0" + durMin.toString() + " " + tailStr;
        }
        else if (durHr == 0 && durMin >= 1) {
          if (durMin > 10)
            totalDur = durMin.toString() + " " + tailStr;
          else
            totalDur = durMin.toString() + " " + tailStr;

        } if (durMin == 0 && durSec > 0) {
          totalDur = durSec.toString() + " " + tailStr;
        }
        activitylocal.duration = totalDur;
        totalArr.push(activitylocal);

      }

      if ((timesheetobj.status == "click_in") || (timesheetobj.status == "resume")) {
        var activitylocal: any = {};

        activitylocal.title = timesheetobj.projectName;
        activitylocal.currentWork = timesheetobj.workPackageName;
        activitylocal.activity = "clockin";
        activitylocal.location = timesheetobj.locationName;

        var time = timesheetobj.time;
        time = time.substr(0, 5);
        var timearr = time.split(":");

        var date = timesheetobj.date;
        var datearr = date.split("-");

        var year = datearr[0];
        var month = datearr[1];
        var day = datearr[2];

        var hr = timearr[0];
        var min = timearr[1];

        activitylocal.from = new Date(year, month, day, hr, min);

        totalArr.push(activitylocal);

      } else if (timesheetobj.status == "click_out") {

        var activitylocal: any = {};

        if (timesheetobj.status == "click_out") {
          activitylocal.title = timesheetobj.projectName;
          activitylocal.currentWork = timesheetobj.workPackageName;
          activitylocal.activity = timesheetobj.workPackageName;
          activitylocal.location = timesheetobj.locationName;

        } else {
          activitylocal.title = "On break";
          activitylocal.currentWork = "break";
          activitylocal.activity = "break";
        }

        var clockouttime = timesheetobj.time;
        var clockoutArr = clockouttime.split("-");
        var clockoutFrom = clockoutArr[0];
        // clockoutFrom = clockoutFrom.substr(0,5);
        var clockoutTo = clockoutArr[1];
        // clockoutTo = clockoutTo.substr(0,5);

        var date = timesheetobj.date;
        var datearr = date.split("-");
        var clockoutFromArr = clockoutFrom.split(":");
        var clockoutToArr = clockoutTo.split(":");

        var year = datearr[0];
        var month = datearr[1];
        var day = datearr[2];

        var fromHour = +clockoutFromArr[0];
        var fromMin = +clockoutFromArr[1];
        var fromSec = +clockoutFromArr[2];

        var toHour = +clockoutToArr[0];
        var toMin = +clockoutToArr[1];
        var toSec = +clockoutToArr[2];

        activitylocal.from = new Date(year, month, day, fromHour, fromMin, fromSec);
        activitylocal.to = new Date(year, month, day, toHour, toMin, toSec);

        var dur = timesheetobj.duration;
        var durArr = dur.split(":");
        var durHr = +durArr[0];
        var durMin = +durArr[1];
        var durSec = +durArr[2];

        var tailStr;

        if (durHr >= 1) {

          if (durMin > 0)
            tailStr = "hrs";
          else
            tailStr = "hr";

        } else if (durHr == 0 && durMin == 0) {
          if (durSec > 1)
            tailStr = "secs";
          else if (durSec == 1)
            tailStr = "sec";

        } else if (durHr == 0 && durMin >= 1) {
          if (durMin > 1)
            tailStr = "mins"
          else
            tailStr = "min"
        }

        var totalDur;
        if (durHr >= 1) {
          if (durMin > 10)
            totalDur = durHr.toString() + ":" + durMin.toString() + " " + tailStr;
          else
            totalDur = durHr.toString() + ":0" + durMin.toString() + " " + tailStr;
        }
        else if (durHr == 0 && durMin >= 1) {
          if (durMin > 10)
            totalDur = durMin.toString() + " " + tailStr;
          else
            totalDur = durMin.toString() + " " + tailStr;

        } if (durMin == 0 && durSec > 0) {
          totalDur = durSec.toString() + " " + tailStr;
        }
        activitylocal.duration = totalDur;

        totalArr.push(activitylocal);

      } /*else if (timesheetobj.status == "pause") {
        var activitylocal: any = {};
        activitylocal.title = "On break";
        activitylocal.currentWork = "break";
        activitylocal.activity = "break";


        // var object = this.searchtimelineArrayForResume(tempArr, timesheetobj.workPackageId, timesheetobj.projectId);

        // if (object.index != null && object.totalTime != null) {
        //   var breaktimetime = object.totalTime;
        //   var breakArr = breaktimetime.split("-");
        //   var breakFrom = breakArr[0];
        //   var breakTo = breakArr[1];

        //   var date = timesheetobj.date;
        //   var datearr = date.split("-");
        //   var breakFromArr = breakFrom.split(":");
        //   var breakToArr = breakTo.split(":");

        //   var year = datearr[0];
        //   var month = datearr[1];
        //   var day = datearr[2];

        //   var fromHour = +breakFromArr[0];
        //   var fromMin = +breakFromArr[1];
        //   var fromSec = +breakFromArr[2];

        //   var toHour = +breakToArr[0];
        //   var toMin = +breakToArr[1];
        //   var toSec = +breakToArr[2];

        //   activitylocal.from = new Date(year, month, day, fromHour, fromMin, fromSec);
        //   activitylocal.to = new Date(year, month, day, toHour, toMin, toSec);
        //   activitylocal.duration = this.calculateTimeDifference(activitylocal);


        //   totalArr.push(activitylocal);

        //   tempArr.splice(object.index, 1);
        // }
      }*/

    }

    totalArr.reverse();

    for (var i = 0; i < totalArr.length; i++) {
      this.createActivity(totalArr[i]);
    }
    this.loadActivity();
  }

  searchtimelineArrayForResume(tempResult, activity, project) {

    var resultIndex;
    var time;

    for (var i = 0; i < tempResult.length; i++) {
      var obj = tempResult[i];

      if (obj.status == "resume") {
        var projectID = obj.projectId;
        var activityID = obj.workPackageId;

        if (projectID == project && (activityID == activity)) {
          resultIndex = i;
          time = obj.time;
          break;
        }

      }
    }

    var returnObject = {
      index: resultIndex,
      totalTime: time
    }

    return returnObject;

  }

  loadActivity() {
    this.activity = this.homeService.loadActivity();
  }

  createActivity(activity) {
    this.homeService.createActivity(activity);
  }

  searchProjectID(projectName) {

    var projectID;
    for (var i = 0; i < this.favProjects.length; i++) {

      if (projectName == this.favProjects[i].projectName) {
        projectID = this.favProjects[i].projectId;
        break;
      }
    }
    return projectID;
  }

  searchActivityID(activityName) {

    var workpkgID;

    for (var i = 0; i < this.favActivities.length; i++) {

      if (activityName == this.favActivities[i].workPackageName) {
        workpkgID = this.favActivities[i].workPackageId;
        break;
      }
    }
    return workpkgID;
  }

  goToClock() {
    var self = this;
    if (self.status.clock == "CLOCK IN" || self.status.clock == "END CLOCK") {

      self.breakTimeString = "00:00 00";
      self.globalservice.breaktime = self.breakTimeString;

      self.clockedInTimeString = "00:00 00";
      self.globalservice.clocktime = self.clockedInTimeString;

      self.intermittentTimeString = "00:00 00";
      self.globalservice.intermittenttime = self.intermittentTimeString;

      self.currentActivity.from = self.time.current;

      if (self.currentActivity.title != "CLOCK IN")
        self.createActivity(self.currentActivity);

      self.currentActivity.activity = this.selectedActivity;

      //self.currentActivity.currentProject = this.selectedProject;
      //self.currentActivity.title = self.currentActivity.location;
      self.currentActivity.title = this.selectedProject;
      self.currentActivity.currentWork = this.selectedActivity;

      if (self.currentActivity.location == null) {
        this.searchLocation(this.selectedProject, this.selectedActivity);
      }
      self.time.break = self.time.current;
      self.status.clock = "CLOCK OUT";
      self.status.break = "BREAK";

      self.setDefaultLoc_Activity();

      self.modalData = {
        proj: this.searchProjectID(self.currentActivity.title),
        type: "",
        activity: this.searchActivityID(self.currentActivity.currentWork),
        location: self.currentActivity.location
      }

      //  if (self.status.clock == "END CLOCK") {
      this.breakTimeString = this.clockedInTimeString;
      this.globalservice.breaktime = this.breakTimeString;
      this.incrementClock();
      //  }

      var param = {
        loginUserId: this.globalservice.user.Deskara_Id,
        projectId: this.searchProjectID(self.currentActivity.title),
        workPackageId: this.searchActivityID(self.currentActivity.currentWork),
        status: "click_in",
        projectName: self.currentActivity.title,
        workPackageName: self.currentActivity.currentWork,
        locationName: self.currentActivity.location
      }

      if (param.locationName == null || param.locationName == "") {

        let alert = this.alertCtrl.create({
          title: 'Alert',
          subTitle: 'Location is not tracked.Please update the location by clicking the side menu',
          buttons: [{
            text: 'OK',
            handler: () => {
              console.log("Second OK");
            }
          }]
        });
        alert.present();
      } else
        self.requestServerForClockStatus(param);

    } else {
      self.currentActivity.to = self.time.current;
      var duration = this.calculateTimeDifference(self.currentActivity);//(self.currentActivity.to - self.currentActivity.from);///36e5;
      self.currentActivity.duration = duration;//Math.round(duration * 10)/10;


      console.log(self.currentActivity.duration);
      self.createActivity(self.currentActivity);

      var param = {
        loginUserId: this.globalservice.user.Deskara_Id,
        projectId: this.searchProjectID(self.currentActivity.title),
        workPackageId: this.searchActivityID(self.currentActivity.currentWork),
        status: "click_out",
        projectName: self.currentActivity.title,
        workPackageName: self.currentActivity.currentWork,
        locationName: self.currentActivity.location
      }
      self.requestServerForClockStatus(param);

      self.currentActivity.to = null;
      self.currentActivity.activity = "clockin";
      self.currentActivity.title = "CLOCK IN";

      //self.status.clock = "CLOCK IN";
      self.status.clock = "END CLOCK";
      self.status.break = "DAY OFF";

      clearTimeout(this.timer);
    }
  }


  calculateTimeDifference(curActivity): string {

    var timeStart = curActivity.from;
    var timeEnd = curActivity.to;
    var hourDiff = timeEnd - timeStart; //in ms
    var secDiff = hourDiff / 1000; //in s
    var minDiff = hourDiff / 60 / 1000; //in minutes
    var hDiff = hourDiff / 3600 / 1000; //in hours
    var humanReadable = <any>{};
    humanReadable.hours = Math.floor(hDiff);
    humanReadable.minutes = minDiff - 60 * humanReadable.hours;
    humanReadable.minutes = Math.floor(humanReadable.minutes);
    if (humanReadable.hours > 0) {

      if (humanReadable.hours == 1 && humanReadable.minutes == 1)
        return humanReadable.hours + 'hr' + humanReadable.minutes + 'min';
      else if (humanReadable.hours == 1 && humanReadable.minutes > 1)
        return humanReadable.hours + 'hr' + humanReadable.minutes + 'mins';
      else if (humanReadable.hours > 1 && humanReadable.minutes > 1)
        return humanReadable.hours + 'hrs' + humanReadable.minutes + 'mins';
      else if (humanReadable.hourDiff > 1 && humanReadable.minutes > 0)
        return humanReadable.hours + 'hrs' + humanReadable.minutes + 'min';

    } else if (humanReadable.minutes > 0) {

      if (humanReadable.minutes > 1)
        return humanReadable.minutes + 'mins';
      else
        return humanReadable.minutes + 'min';
    } else {
      secDiff = Math.floor(secDiff);
      if (secDiff > 1)
        return secDiff + 'secs'
      else
        return secDiff + 'sec'
    }
  }

  goToBreak() {
    var self = this;
    if (self.status.break == "BREAK") {

      self.currentActivity.to = self.time.current;
      var duration = this.calculateTimeDifference(self.currentActivity);//(self.currentActivity.to - self.currentActivity.from);///36e5;
      self.currentActivity.duration = duration;//Math.round(duration * 10)/10;
      console.log(self.currentActivity.duration);
      self.createActivity(self.currentActivity);

      var param1 = {
        loginUserId: this.globalservice.user.Deskara_Id,
        projectId: this.searchProjectID(self.currentActivity.title),
        workPackageId: this.searchActivityID(self.currentActivity.currentWork),
        status: "pause",
        projectName: self.currentActivity.title,
        workPackageName: self.currentActivity.currentWork,
        locationName: self.currentActivity.location
      }
      this.requestServerForClockStatus(param1);

      self.currentActivity.activity = "break";
      self.currentActivity.title = "On break";
      self.currentActivity.from = self.time.current;

      self.time.break = self.time.current;

      self.breakTimeString = self.clockedInTimeString;
      self.globalservice.breaktime = self.breakTimeString;

      self.clockedInTimeString = self.intermittentTimeString;//"00:00 00";
      self.globalservice.clocktime = self.clockedInTimeString;

      self.onbreak = true;
      self.status.break = "RESUME";

    } else {// resume

      self.currentActivity.to = self.time.current;
      var duration = this.calculateTimeDifference(self.currentActivity);//(self.currentActivity.to - self.currentActivity.from);///36e5;
      self.currentActivity.duration = duration;//Math.round(duration * 10)/10;
      console.log(self.currentActivity.duration);
      self.createActivity(self.currentActivity);
      self.loadActivity();

      self.currentActivity.activity = this.selectedActivity;

      self.currentActivity.title = this.selectedProject;
      self.currentActivity.currentWork = this.selectedActivity;
      self.currentActivity.activity = this.selectedActivity;
      self.currentActivity.from = self.time.current;

      self.intermittentTimeString = self.clockedInTimeString;
      self.globalservice.intermittenttime = self.intermittentTimeString;

      self.clockedInTimeString = self.breakTimeString;
      self.globalservice.clocktime = self.clockedInTimeString;

      self.breakTimeString = self.intermittentTimeString;//"00:00 00";
      self.globalservice.breaktime = self.breakTimeString;


      self.status.break = "BREAK";
      self.onbreak = false;

      var param2 = {
        loginUserId: this.globalservice.user.Deskara_Id,
        projectId: this.searchProjectID(self.currentActivity.title),
        workPackageId: this.searchActivityID(self.currentActivity.currentWork),
        status: "resume",
        projectName: self.currentActivity.title,
        workPackageName: self.currentActivity.currentWork,
        locationName: self.currentActivity.location
      }
      this.requestServerForClockStatus(param2);
    }

  }

  ionViewWillEnter() {
    this.globalservice.isPushed = false;
    this.setDefaultLoc_Activity();
  }

  setDefaultLoc_Activity() {
    var returnObj = this.searchActivityInStorage(this.currentActivity.title);

    if (returnObj.activity != "")
      this.currentActivity.currentWork = returnObj.activity;

    if (returnObj.locationName != "")
      this.currentActivity.location = returnObj.locationName;

    if (this.currentActivity.location == null) {

      if (this.locationArr.length > 0)
        this.currentActivity.location = this.locationArr[0].changed;
    }
  }


  presentModal() {
    const modal = this.modalCtrl.create(SampleModalPage, { proj: this.currentActivity.title, activity: this.currentActivity.currentWork, location: this.currentActivity.location, google: this.googleLocation });

    modal.onDidDismiss(data => {

      if (data.type == "completed") {

        this.selectedProject = data.proj.projectName;
        this.selectedActivity = data.activity.workPackageName;
        this.currentActivity.to = this.time.current;
        this.currentActivity.location = data.location;
        this.currentActivity.currentWork = data.activity.workPackageName;
        this.currentActivity.activity = data.activity.workPackageName;
        var duration = this.calculateTimeDifference(this.currentActivity);
        this.currentActivity.duration = duration;
        this.createActivity(this.currentActivity);

        let totalLength = this.favProjects.length;

        var random = Math.floor(Math.random() * ((totalLength - 1) + 1) + 1);

        //this.currentActivity.activity = "working";

        if (this.favProjects[random]) {

          var proj = this.favProjects[random].projectName;

          this.currentActivity.title = this.favProjects[random].projectName;

          var returnObj = this.searchActivityInStorage(proj);

          if (returnObj.activity != "")
            this.currentActivity.currentWork = returnObj.activity;
          else
            this.currentActivity.currentWork = this.favActivities[random].workPackageName;

          if (returnObj.locationName != "")
            this.currentActivity.location = returnObj.locationName;

          this.currentActivity.from = this.time.current;
        }

        // var param4 = {
        //   loginUserId: this.globalservice.user.Deskara_Id,
        //   projectId: data.proj.projectId,
        //   workPackageId: data.activity.workPackageId,
        //   status: "click_in",
        //   projectName: data.proj.projectName,
        //   workPackageName: data.activity.workPackageName,
        //   locationName: data.location
        // }

        this.modalData = data;

        var param3 = {
          loginUserId: this.globalservice.user.Deskara_Id,
          projectId: data.proj.projectId,
          workPackageId: data.activity.workPackageId,
          status: "click_out",
          projectName: data.proj.projectName,
          workPackageName: data.activity.workPackageName,
          locationName: data.location
        }


        this.requestServerForClockStatus(param3);

        this.requestServerForFavProj1();

      } else if (data.type == "dismiss") {
        console.log("Dismiss");
        this.requestServerForFavProj1();

      } else {

        //clockout
        var param = {
          loginUserId: this.globalservice.user.Deskara_Id,
          projectId: this.searchProjectID(data.oldproj),
          workPackageId: this.searchActivityID(data.oldactivity),
          status: "click_out",
          projectName: data.oldproj,
          workPackageName: data.oldactivity,
          locationName: data.oldlocation,

        }

        //this.requestServerForClockStatus(param);

        //update
        this.selectedProject = data.proj.projectName;
        this.selectedActivity = data.activity.workPackageName;
        this.currentActivity.title = data.proj.projectName;
        this.currentActivity.currentWork = data.activity.workPackageName;
        this.currentActivity.location = data.location;

        this.modalData = data;

        var param4 = {
          loginUserId: this.globalservice.user.Deskara_Id,
          projectId: data.proj.projectId,
          workPackageId: data.activity.workPackageId,
          status: "click_in",
          projectName: data.proj.projectName,
          workPackageName: data.activity.workPackageName,
          locationName: data.location
        }

        this.subsequentServerCall(param, param4);
        //this.requestServerForClockStatus(param4);

      }

    });
    modal.present();
  }


  subsequentServerCall(param, param4) {

    let loader = this.loadingCtrl.create({
      content: "Please wait...clock"
    });
    loader.present();

    let url = this.config.getApiPath().CLOCK_ADD_STATUS;

    this.api.callService(url, param).subscribe(

      (result) => {
        loader.dismiss();
        console.log("Set Clock status: " + param.status + ": " + result.result);
        this.requestServerForClockStatus(param4);

        this.requestServerForFavProj1();

      },
      (error) => {
        loader.dismiss();
        console.error("Error : " + JSON.stringify(error.err));
      },
      () => {
        console.log('requestServerForClockStatus success');
      }
    );
  }

  searchActivityInStorage(project) {

    var returnObj = {
      "activity": "",
      "locationName": ""
    }

    for (var i = 0; i < this.globalservice.projects.length; i++) {
      var object = this.globalservice.projects[i];
      if (object.name == project) {
        returnObj.activity = object.activity;
        returnObj.locationName = object.locationName;
        break;
      }
    }
    return returnObj;
  }

  /*
  This function will help to find the location for a project and activity
  from the storage
  */
  searchLocation(projectName, activityName) {

    if (this.globalservice.projects.length > 0) {

      for (var i = 0; i < this.globalservice.projects.length; i++) {
        var projectObject = this.globalservice.projects[i];

        if (projectName == projectObject.name && activityName == projectObject.activity) {
          this.currentActivity.location = projectObject.locationName;
        }
      }
    } else {
      if (this.locationArr.length > 0) {
        var locationObject = this.locationArr[1];
        var locationName = locationObject.changed;
        if (this.currentActivity.location == null)
          this.currentActivity.location = locationName;
      }
    }
  }


  startTime() {

    this.backgroundMode.enable();

    var today = new Date();
    this.time.current = today;
    this.datenow = today;
    this.shift = today;

    setTimeout(() => { // <=== 
      this.startTime();
    }, 500);
  }

  incrementClock() {

    this.backgroundMode.enable();

    var cur = this.clockedInTimeString;

    var arrOfItems = cur.split(":");

    var firstItem = +arrOfItems[0];
    var secondString = arrOfItems[1];

    var arrOfItems1 = secondString.split(" ");

    var secondItem = +arrOfItems1[0];
    var thirdItem = +arrOfItems1[1];


    thirdItem += 1;
    while (thirdItem >= 60) {

      secondItem += 1;
      while (secondItem >= 60) {
        firstItem += 1;
        secondItem = 60 - secondItem;
      }
      thirdItem = 60 - thirdItem;
    }

    var index1;
    var index2;
    var index3;


    if (firstItem == 0)
      index1 = "00";
    else if (firstItem < 10)
      index1 = "0" + firstItem.toString();
    else
      index1 = firstItem.toString();

    if (secondItem == 0)
      index2 = "00";
    else if (secondItem < 10)
      index2 = "0" + secondItem.toString();
    else
      index2 = secondItem.toString();

    if (thirdItem == 0)
      index3 = "00";
    else if (thirdItem < 10)
      index3 = "0" + thirdItem.toString();
    else
      index3 = thirdItem.toString();


    this.clockedInTimeString = index1 + ":" + index2 + " " + index3;
    this.globalservice.clocktime = this.clockedInTimeString;

    this.timer = setTimeout(() => {
      this.incrementClock();
    }, 1000);
  }

  viewWeekly() {
    const modal = this.modalCtrl.create(WeeklyPage);
    modal.present();
  }

  changeActivity(activity: string, fab: FabContainer) {
    this.currentActivity.activity = activity;
    fab.close();
  }

  goToGeometry() {
    this.navCtrl.push(LoadGeometryPage);
  }


  /*
   This function helps to get the nearby location based on current location.
   We then store them and update the current activity location. The boundary
   for search is 100ms.
  */
  getNearbyLocations(latLng) {

    var self = this;
    var requestNearPlace = {
      location: latLng,
      radius: '100'
    };


    self.placeService = new google.maps.places.PlacesService(self.map1);

    self.placeService.nearbySearch(requestNearPlace, function (results, status) {

      if (status == google.maps.places.PlacesServiceStatus.OK) {

        if (results == null) {
          results = [];
        }

        for (var i = 0; i < results.length; i++) {

          var object = results[i];
          var changedName = self.globalservice.getSpecificLocation(object.name);
          if (changedName == "not")
            changedName = object.name;

          var obj = {
            original: object.name,
            changed: changedName
          }
          self.locationArr.push(obj);
        }

        self.updateCurrentActivityLoc();
      }
    });

  }

  loadMap() {

    var self = this;
    let loader = this.loadingCtrl.create({
      content: "Updating location..."
    });
    loader.present();

    let options = { timeout: 10000, enableHighAccuracy: true };

    Geolocation.getCurrentPosition(options).then(

      (position) => {

        loader.dismiss();

        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let mapOptions = {
          center: latLng,
          zoom: 15,
          fullscreenControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        //self.map1 = new google.maps.Map(document.querySelector('#map1'), mapOptions);

        if (!this.isClockHistory) {
          self.map1 = new google.maps.Map(document.querySelector('#map1'), mapOptions);

          let marker = new google.maps.Marker({
            map: self.map1,
            animation: google.maps.Animation.DROP,
            position: latLng,
            icon: {
              url: 'http://14.1.197.36/demo/istaff/assets/svg_bluepin.svg'//'assets/images/svg_pinblue.svg'
            }

          });

          let content = "<p>" + self.currentLocation.name + "</p>";

          self.addInfoWindow(marker, content);
        }

        self.currentLocation = self.location.getCurrentLocation();
        this.getNearbyLocations(latLng);
      },

      (err) => {

        loader.dismiss();
        let latLng = new google.maps.LatLng(self.currentActivity.LAT, self.currentActivity.LON);
        let mapOptions = {
          center: latLng,
          zoom: 15,
          fullscreenControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        if (!this.isClockHistory) {
          self.map1 = new google.maps.Map(document.querySelector('#map1'), mapOptions);

          let marker = new google.maps.Marker({
            map: self.map1,
            animation: google.maps.Animation.DROP,
            position: latLng,
            icon: {
              url: 'http://14.1.197.36/demo/istaff/assets/svg_bluepin.svg'
            }

          });

          //self.currentLocation = self.location.getCurrentLocation();

          let content = "<p>" + self.currentActivity.name + "</p>";

          self.addInfoWindow(marker, content);
        }

        this.getNearbyLocations(latLng);

      }
    );
  }

  /*
  Update the current Activity with the project Name, activity Name and location Name
  */
  updateCurrentActivityLoc() {

    if (this.currentActivity.title != "CLOCK IN") {
      this.setDefaultLoc_Activity();
    }
  }


  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map1, marker);
    });

  }
  goToTimeSheet() {
    this.navCtrl.push(TimesheetPage);
  }

  emergencyDialPage() {
    this.navCtrl.push(EmergencyPage);
  }

  mySchedulePage() {

    if (this.scheduleTitle == "MY PROJECT LIST")
      this.navCtrl.push(ProjectSchedulePage);
    else
      this.navCtrl.push(SchedulePage);

  }

  //Show direction from current location to destination - Train stationname
  showdirection(fromlat, fromlon, tolat, tolon) {
    console.log("fromlat:"+ fromlat + " fromlon:"+ fromlon + " tolat:"+ tolat + " tolon:"+tolon);
    
    tolat = 1.279552;
    tolon = 103.847941;   

    var self = this;
    var directionsService = new google.maps.DirectionsService;
       var directionsDisplay = new google.maps.DirectionsRenderer;
      /* var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: {lat: 41.85, lng: -87.65}
        }); */
        directionsDisplay.setMap(self.map1);
        calculateAndDisplayRoute(directionsService, directionsDisplay);

      function calculateAndDisplayRoute(directionsService, directionsDisplay) {

       /*   var waypts = [];
          var checkboxArray:any[] = [
              'winnipeg', 'regina','calgary'
      ];
      for (var i = 0; i < checkboxArray.length; i++) {

            waypts.push({
              location: checkboxArray[i],
              stopover: true
            });

        }*/

        directionsService.route({
          //origin: {lat: 41.85, lng: -87.65},
          //destination: {lat: 49.3, lng: -123.12},
          //origin: {lat: 1.3748923, lng: 103.7385331},
          //destination: {lat: 1.279552, lng: 103.847941},
          origin: {lat: fromlat, lng: fromlon},
          destination: {lat: tolat, lng: tolon},
          //waypoints: waypts,
          //optimizeWaypoints: true,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }

  }
}

interface PROJECT {
  projectId: string,
  projectName: string
}

interface FAVPROJECT {
  favprojId: string,
  projectId: string,
  projectName: string
}

interface FAVACTIVITY {
  favouriteId: string,
  workPackageId: string,
  workPackageName: string
}

interface CLOCK {

  current: string,
  break: string
}

interface MODAL {
  proj: string,
  type: string,
  activity: string,
  location: string
}
