import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { TimeSheetAddModalPage } from '../timesheetadd/timesheetadd';
import { ApiService } from '../../providers/api-service';
import { Config } from '../../providers/_config';
import { GlobalService } from '../../providers/global-service';
import { LoadingController } from 'ionic-angular';
import { AlertController } from "ionic-angular/index";
//import { PopoverController } from 'ionic-angular';
import { Platform, ActionSheetController } from 'ionic-angular';
import { ChartsModule } from 'ng2-charts';



@Component({
  selector: 'page-timesheet',
  templateUrl: 'timesheet.html',

  providers: [ApiService, Config]
})

export class TimesheetPage {

  dataUser: any;
  isPushed: boolean;
  selectedButtonIndex;
  totalWorkingHrs: any;
  totalWorkingHrs_month: any;
  totalbreak: any;
  totalbreak_month: any;
  projects: PROJECT[] = [];
  arrOfSelectedProjects: PROJECT[] = [];
  projActivities = [];
  activityListItems: ACTIVITYFORMAT[] = [];
  isSelected: boolean;
  daySelected = "1";
  selectedIndex;
  curSelectedProject: PROJECTTEST;
  iconType: any[] = [];
  dateNow: any;
  dateNow_Month: any;
  singleDayActivity: DAY[] = [];
  singleWeekActivity: SINGLEWEEK[] = [];
  totalOngoingProjects;
  busiestProject: string;
  totalProjHours: TOTALPROJECTHOURS[] = [];
  totalWeek: WEEKHOURS[] = [];
  isFooterbtnDisabled: boolean = false;
  arrOfDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  weekdayNames = ["Mon", "Tue", "Wed", "Thus", "Fri", "Sat", "Sun"];
  //arrOfDays = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  //weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thus", "Fri", "Sat"];
  monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  arrOfWeekDays: any[] = [" ", " ", " ", " ", " ", " ", " "];
  arrOfWeekDates: any[] = [" ", " ", " ", " ", " ", " ", " "];
  workinghours = ["0:00", "0:00", "0:00", "0:00", "0:00", "0:00", "0:00"];

  timesheet_segment: string = "weekly";

  headerLabels: dayFormat[] = [];
  headerLabels_Monthly: dayFormat_Monthly[] = [];

  loader: any;
  shownGroup = null;
  saveSubmit: string;
  monthlyrequest: boolean;
  numericFirst;
  numericSecond;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
    public api: ApiService, public config: Config, public globalservice: GlobalService, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, public platform: Platform, public actionsheetCtrl: ActionSheetController) {

    var self = this;
    self.isPushed = self.globalservice.isPushed;
    self.totalWorkingHrs = "0:00 hrs";
    self.totalWorkingHrs_month = "0:00 hrs";
    self.totalbreak = "0:00 hrs";
    self.totalbreak_month = "0:00 hrs";
    self.isSelected = false;
    self.dateNow = "null";
    self.dateNow_Month = "null";
    self.totalOngoingProjects = 0;
    self.busiestProject = "None";
    self.monthlyrequest = false;
    // self.daySelected = 1;

    /* Get the arrOfWeekDays with this function */
    self.startCalender();

    /* Get the monthly calendar with this function */
    var date = new Date();
    this.createMonthCalendar(date);

  }

  // Edit and Done Toggle
  // public buttonClicked: boolean = false; //Whatever you want to initialise it as

  // public toggleEditMode() {

  //   this.buttonClicked = !this.buttonClicked;
  // }

  submitOrSave() {

    var startDate = this.arrOfWeekDates[0];
    var endDate = this.arrOfWeekDates[6];

    var arrOfStartDates = startDate.split("-");
    var arrOfEndDates = endDate.split("-");

    var st_monthNo = +arrOfStartDates[1];
    var st_dayNo = +arrOfStartDates[2];

    var en_monthNo = +arrOfEndDates[1];
    var en_dayNo = +arrOfEndDates[2];

    var st_month = this.monthNames[st_monthNo - 1];
    var en_month = this.monthNames[en_monthNo - 1];

    var msg = st_month + " " + st_dayNo + " - " + en_month + " " + en_dayNo;

    let actionSheet = this.actionsheetCtrl.create({
      title: 'Timesheet for ' + " " + msg,
      cssClass: 'action-sheets-basic-page save-timesheet',
      buttons: [
        {
          text: 'Save Changes',
          // icon: !this.platform.is('ios') ? 'share' : null,
          handler: () => {
            console.log('Saved Changes');
            this.saveSubmit = "SAVE CHANGES";
            this.submitTimeSheet();
          }
        },
        {
          text: 'Discard Changes',
          role: 'destructive',
          // icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            console.log('Discarded Changes');
            this.deleteAllActivities();
          }
        },
        {
          text: 'Submit Timesheet',
          // icon: !this.platform.is('ios') ? 'arrow-dropright-circle' : null,
          handler: () => {

            console.log('Submitted Timesheet');
            this.saveSubmit = "SUBMIT";
            this.submitTimeSheet();
          }
        },
        // {
        //   text: 'Favorite',
        //   icon: !this.platform.is('ios') ? 'heart-outline' : null,
        //   handler: () => {
        //     console.log('Favorite clicked');
        //   }
        // },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          // icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel');
          }
        }
      ]
    });
    actionSheet.present();
  }

  segmentClick() {
    console.log("Selected segment is: " + this.timesheet_segment);
  }

  ngOnInit() {
    var self = this;
    self.dataUser = self.globalservice.user;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimesheetPage');

    // if(!this.ifSingleDayActivityPresent()){
    // var today =  new Date();
    this.createViewTimeSheetArgs();
    // }
    this.isPushed = this.globalservice.isPushed;
  }


  ionViewDidAppear() {
    this.isPushed = this.globalservice.isPushed;
  }

  backbtnClick() {
    this.navCtrl.pop();
  }

  //show the weekly calendar
  startCalender() {

    var today = new Date();
    this.dateNow = today;
    var index = today.getDay() - 1;
    //this.saveSubmit = "SAVE CHANGES";
    this.saveSubmit = "SUBMIT";
    this.isFooterbtnDisabled = true;

    this.arrOfWeekDays[index] = today.getDate().toString();

    var prevDate = today.getDate() - 1;
    var prevmonth = today.getMonth() + 1;
    var fullYear = today.getFullYear();

    var prevMonthStr;
    var todayStr;

    if (prevmonth < 10) {
      prevMonthStr = "0" + prevmonth.toString();
    } else
      prevMonthStr = prevmonth.toString();

    if (today.getDate() < 10) {
      todayStr = "0" + today.getDate().toString();
    } else
      todayStr = today.getDate().toString();

    this.arrOfWeekDates[index] = fullYear.toString() + "-" + prevMonthStr + "-" + todayStr;

    for (var i = index - 1; i >= 0; i--) {

      if (prevDate >= 1) {
        this.arrOfWeekDays[i] = prevDate.toString();
        if (prevmonth < 10) {
          prevMonthStr = "0" + prevmonth.toString();
        } else
          prevMonthStr = prevmonth.toString();

        var prevStr;
        if (prevDate < 10) {
          prevStr = "0" + prevDate.toString();
        } else
          prevStr = prevDate.toString();

        this.arrOfWeekDates[i] = fullYear.toString() + "-" + prevMonthStr + "-" + prevStr;
        prevDate--;

      } else if (prevDate < 1) {

        if (prevmonth > 1)
          prevmonth--;
        else {
          prevmonth = 12;
          fullYear -= 1;
        }
        var lastdayOfPrevMonth = this.daysInMonth(prevmonth, fullYear);
        prevDate = lastdayOfPrevMonth;
        this.arrOfWeekDays[i] = prevDate.toString();

        var prevMNStr;
        var prevStr;

        if (prevmonth < 10) {
          prevMNStr = "0" + prevmonth.toString();
        } else
          prevMNStr = prevmonth.toString();

        if (prevDate < 10) {
          prevStr = "0" + prevDate.toString();
        } else
          prevStr = prevDate.toString();

        this.arrOfWeekDates[i] = fullYear.toString() + "-" + prevMNStr + "-" + prevStr;
        prevDate--;

      }
    }

    var nextDate = today.getDate() + 1;
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    var first = 1;

    for (var i = index + 1; i < this.arrOfWeekDays.length; i++) {

      if (nextDate <= this.daysInMonth(month, year)) {
        this.arrOfWeekDays[i] = nextDate.toString();

        var monthstr;
        var nextDatestr;

        if (month < 10) {
          monthstr = "0" + month.toString();
        } else
          monthstr = month.toString();

        if (nextDate < 10) {
          nextDatestr = "0" + nextDate.toString();
        } else
          nextDatestr = nextDate.toString();

        this.arrOfWeekDates[i] = year.toString() + "-" + monthstr + "-" + nextDatestr;
        nextDate++;

      } else if (nextDate > this.daysInMonth(month, year)) {

        nextDate = first;

        if (month > 12) {
          month = 1;
          year += 1;

        } else {
          month += 1;
        }

        var monthstr1;
        var nextDatestr1;

        if (month < 10) {
          monthstr1 = "0" + month.toString();
        } else
          monthstr1 = month.toString();

        if (nextDate < 10) {
          nextDatestr1 = "0" + nextDate.toString();
        } else
          nextDatestr1 = nextDate.toString();

        this.arrOfWeekDays[i] = nextDate.toString();
        this.arrOfWeekDates[i] = year.toString() + "-" + monthstr1 + "-" + nextDatestr1;
        nextDate++;

      }
    }

    //everytime the day selected by default will be the first element of the array
    this.daySelected = this.arrOfWeekDays[0];

    this.combineData(false);

  }

  refreshHeaderLabels() {

    var statusV: boolean[] = [false, false, false, false, false, false, false];

    this.headerLabels.splice(0, this.headerLabels.length);


    for (var i = 0; i < this.arrOfWeekDays.length; i++) {

      var date = this.arrOfWeekDates[i];

      var arr = date.split("-");

      var today = new Date();
      var testDate = new Date(+arr[0], +arr[1] - 1, +arr[2]);

      var isBig = false;
      if (testDate > today)
        isBig = true;

      this.headerLabels[i] = {
        dayString: this.arrOfWeekDates[i],
        dateString: this.arrOfWeekDays[i],
        hours: this.workinghours[i],
        isGreater: isBig,
        status: statusV[i]
      }
    }


  }

  combineData(isTrue) {


    this.refreshHeaderLabels();

    for (var j = 0; j < this.headerLabels.length; j++) {

      var obj = this.headerLabels[j];
      var day = obj.dayString;
      var obj1 = this.searchforDataonDay(day);
      obj.hours = obj1.time;
      obj.status = obj1.isSubmitted;
    }

    console.log("WeekDays: " + this.arrOfWeekDays);

    if (isTrue) {
      if (!this.ifSingleDayActivityPresent())
        this.fillDefaultProjects();
    }
  }

  isProjectPresentinList(project, activities) {

    var isPresent = false;
    var index;
    for (var i = 0; i < this.arrOfSelectedProjects.length; i++) {
      var obj = this.arrOfSelectedProjects[i];
      if (obj.name == project.name) {
        isPresent = true;
        index = i;
        break;
      }
    }

    if (isPresent) {
      var tempProject = this.arrOfSelectedProjects[i];
      tempProject.activities = activities;
    }

    return isPresent;
  }


  toggleGroup(index) {

    this.selectedIndex = index;
    var project;
    for (var i = 0; i < this.singleDayActivity.length; i++) {
      var obj = this.singleDayActivity[i];

      if (this.daySelected == obj.day) {
        project = obj.project[index];
        break;
      }
    }

    if (project != null) {
      if (project.activities == null) {
        project.activities = [];
      }

      this.curSelectedProject = project;

      for (var i = 0; i < this.curSelectedProject.activities.length; i++) {
        var acObj = this.curSelectedProject.activities[i];
        var time = acObj.activityTime;
        var arrtime = time.split(":");
        acObj.hour = arrtime[0];
        acObj.min = arrtime[1];
      }

    }

    if (this.iconType[index] == "Down")
      this.iconType[index] = "Up";
    else
      this.iconType[index] = "Down";

    if (this.isGroupShown(index)) {
      this.shownGroup = null;
    }
    else {
      this.shownGroup = index;
    }

  }

  isGroupShown(index) {
    return this.shownGroup === index;
  }


  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  createMonthCalendar(date) {

    this.dateNow_Month = date;

    var y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    var noOfDays = this.daysInMonth(date.getMonth() + 1, date.getFullYear());
    var noOfDays1 = this.daysInMonth(date.getMonth() + 1, date.getFullYear());

    this.headerLabels_Monthly.splice(0, this.headerLabels_Monthly.length);
    this.totalWeek.splice(0, this.totalWeek.length);

    var day = firstDay.getDay() - 1;

    noOfDays = noOfDays + day - 1;

    for (var i = 0; i <= noOfDays; i++) {
      this.headerLabels_Monthly[i] = {
        dayString: "",
        dateString: "",
        hours: "",
        isGreater: false,
        status: false
      }
    }


    var countIndex = 1;

    for (var ii = 0; ii <= noOfDays; ii++) {

      if (ii >= day) {
        var objX = this.headerLabels_Monthly[ii];

        objX.dateString = countIndex.toString();
        objX.hours = "00:00";
        var month = m + 1;

        var monthstr;

        if (month < 10)
          monthstr = "0" + month.toString();
        else
          monthstr = month.toString();

        var yearStr = y.toString();

        var daystr;

        if (countIndex < 10)
          daystr = "0" + countIndex.toString();
        else
          daystr = countIndex.toString();


        var dateStr = yearStr + "-" + monthstr + "-" + daystr;

        var today = new Date();
        var testDate = new Date(y, month - 1, countIndex);

        if (testDate > today)
          objX.isGreater = true;
        else
          objX.isGreater = false;

        objX.dayString = dateStr;

        countIndex++;
        console.log(ii);
      }

    }


  }



  updateMonthCalendar(dateArr) {

    var hour = 0;
    var min = 0;
    for (var i = 0; i < this.headerLabels_Monthly.length; i++) {

      var obj = this.headerLabels_Monthly[i];

      for (var j = 0; j < dateArr.length; j++) {

        var obj1 = dateArr[j];

        if (obj1.day == obj.dayString) {

          var arr = obj1.data;

          for (var k = 0; k < arr.length; k++) {

            var item = arr[k];
            var worktime = item.workTime;
            var headerWorkTime = obj.hours;

            var arr1 = worktime.split(":");
            var arr2 = headerWorkTime.split(":");

            var index1 = +arr1[0];
            var index2 = +arr1[1];

            var index3 = +arr2[0];
            var index4 = +arr2[1];

            var index5 = index1 + index3;
            var index6 = index2 + index4;

            while (index6 >= 60) {
              index5 += 1;
              index6 = index6 - 1;
            }
            var hh;
            var mins;

            if (index5 < 10)
              hh = "0" + index5.toString();
            else
              hh = index5.toString();

            if (index6 < 10)
              mins = "0" + index6.toString();
            else
              mins = index6.toString();

            obj.hours = hh + ":" + mins;

          }
        }
      }

      if (obj.hours != "") {
        var hours = obj.hours;
        var arrhrs = hours.split(":");

        var h = +arrhrs[0];
        var s = +arrhrs[1];

        hour += h;
        min += s;
      }


    }


    /* If minutes is greater than 60 then increase the hour and modify minutes */
    while (min >= 60) {
      hour += 1;
      min = min - 60;
    }


    if (min == 0)
      this.totalWorkingHrs_month = hour.toString() + ":00 hrs";
    else
      this.totalWorkingHrs_month = hour.toString() + ":" + min.toString() + " hrs";

    this.findTotalandBusiestProject(dateArr);


    var tempArr = [];
    var weekArr = [];

    var count = 0;
    var weekIndex = 1;
    var firstDay;
    var seventhDay;
    var tody = new Date();
    var hr = 0;
    var mm = 0;
    var month = this.monthNames[tody.getMonth()];
    var firstEntry = false;
    for (var k = 0; k < this.headerLabels_Monthly.length; k++) {

      var obj = this.headerLabels_Monthly[k];
      var time = obj.hours;

      if (obj.dateString != "" && !firstEntry) {
        firstEntry = true;
        firstDay = obj.dateString;
      } else
        seventhDay = obj.dateString;

      if (time != "") {
        var arrtime = time.split(":");

        var index11 = +arrtime[0];
        var index12 = +arrtime[1];

        hr += index11;
        mm += index12;

        while (mm >= 60) {
          hr += 1;
          mm = mm - 60;
        }
      }

      if (count == 6) {

        this.totalWeek.push({
          name: "Week " + weekIndex.toString(),
          week: firstDay + " " + month + " - " + seventhDay + " " + month,
          time: (mm == 0) ? hr.toString() + ":00hrs" : hr.toString() + ":" + mm.toString() + "hrs"
        });

        count = 0;
        hr = 0;
        mm = 0;
        firstEntry = false;
        weekIndex++;
      } else
        count++;


      // if(obj.dayString != ""){
      //     tempArr.push({
      //     name:obj.dateString,
      //     time: obj.hours
      //   });
      // }

    }

    console.log("Week Data: ", this.totalWeek);
    //  var count = 0;

    //  var index = 1;



    //  for(var m = 0;m<tempArr.length;m++){
    //      var obj11 = tempArr[m];
    //      var totalTime = obj11.time;
    //      var arrOfTotalTime = totalTime.split(":");

    //     if(count == 0){
    //       firstDay = m + 1;
    //     }
    //     if(count <=6){
    //       hr += +arrOfTotalTime[0];
    //       mm += +arrOfTotalTime[1];
    //     }

    //     if(mm >= 60){
    //       hr += 1;
    //       mm = mm - 60;
    //     }
    //     if(count == 6){
    //       count = 0;
    //       seventhDay = m + 1;

    //       weekArr.push({
    //         name:"Week " + index.toString(),
    //         week: firstDay.toString() + " " + month + " - " + seventhDay.toString() + " "+ month,
    //         time: (mm == 0)?hr.toString() + ":00hrs" : hr.toString() + ":" + mm.toString() + "hrs"
    //       });
    //       index++;
    //       hr = 0;
    //       mm = 0;
    //     }else  
    //       count++;
    //  }

    //  for(var i = weekArr.length -1;i> 0;i--){
    //       var weekobj = weekArr[i];
    //       var weekTime = weekobj.time;

    //       var arrOfWeekTime = weekTime.split(":");

    //       var index1 = +arrOfWeekTime[0];
    //       var index22 = arrOfWeekTime[1];
    //       index22 = index22.substring(0,index22.indexOf(" ",2));
    //       var index3 = +index22;

    //       if(index1 > 0 || index3 > 0){

    //         if(!this.isWeekObjpresent(weekobj))
    //           this.totalWeek.push(weekobj);
    //       }

    //  }

  }

  isWeekObjpresent(weekobj) {
    var isPresent: boolean = false;

    for (var i = 0; i < this.totalWeek.length; i++) {

      var obj111 = this.totalWeek[i];

      if (obj111.name == weekobj.name) {
        isPresent = true;
        obj111.time = weekobj.time;
        break;
      }
    }
    return isPresent;
  }


  findTotalandBusiestProject(dateArr) {

    var arrOfProjects = [];
    var busyProject: string;
    var maxHour = 0;
    var maxMin = 0;
    var activites = [];

    for (var i = 0; i < dateArr.length; i++) {
      var obj = dateArr[i];

      var projectArr = obj.data;

      for (var j = 0; j < projectArr.length; j++) {
        var proj = projectArr[j];
        var projName = proj.projectName;
        var projTime = proj.workTime;

        var arrOfTime = projTime.split(":");

        if (arrOfTime.length > 1) {
          var item1 = +arrOfTime[0];
          var item2 = +arrOfTime[1];


          if (item2 > 0 || item1 > 0) {
            if (!this.isSimilarProjectPresent(arrOfProjects, projName))
              arrOfProjects.push(projName);
          }

          while (item2 >= 60) {
            item1 += 1;
            item2 = item2 - 60;
          }
          if (item1 > maxHour) {
            maxHour = item1;
            busyProject = projName;

          } else if (item1 == maxHour) {
            if (item2 > maxMin) {
              maxMin = item2;
              busyProject = projName;
            }
          }
          if (item2 > 0 || item1 > 0) {
            if (!this.isSameActivity(activites, item1, item2, projName)) {
              activites.push({
                name: projName,
                time: (item2 == 0) ? item1.toString() + ":00" + "hrs" : item1.toString() + ":" + item2.toString() + "hrs"
              });
            }
          }
        }

      }
    }

    this.totalOngoingProjects = arrOfProjects.length.toString();
    this.busiestProject = busyProject;
    this.totalProjHours = activites;
  }

  isSameActivity(activities, time1, time2, projectName) {

    var isSame: boolean = false;

    for (var i = 0; i < activities.length; i++) {
      var obj = activities[i];
      if (obj.name == projectName) {
        isSame = true;

        var time = obj.time;
        var arrOfTime = time.split(":");
        var hour = +arrOfTime[0];
        var min = arrOfTime[1];
        min = min.substring(0, min.indexOf(" ", 2));
        var minInt = +min;

        hour += time1;
        minInt += time2;

        while (minInt >= 60) {
          hour += 1;
          minInt = minInt - 60;
        }
        if (minInt == 0)
          obj.time = hour.toString() + ":00" + " hrs";
        else
          obj.time = hour.toString() + ":" + minInt.toString() + " hrs";

        break;
      }
    }
    return isSame;
  }

  isSimilarProjectPresent(arrOfProjects, projectName) {

    var isPresent: boolean = false;

    for (var i = 0; i < arrOfProjects.length; i++) {
      var obj = arrOfProjects[i];
      if (obj == projectName) {
        isPresent = true;
        break;
      }
    }
    return isPresent;
  }



  searchforDataonDay(day) {

    var returnObj = {
      time: "0:00",
      isSubmitted: false
    };

    for (var i = 0; i < this.singleDayActivity.length; i++) {
      var obj = this.singleDayActivity[i];

      if (day == obj.date) {
        returnObj.time = obj.totalTime;
        returnObj.isSubmitted = obj.isSubmitted;
        break;
      }
    }
    return returnObj;
  }

  setAllActivities() {

    var items = this.globalservice.favProjects;

    for (var i = 0; i < this.globalservice.favActivities.length; i++) {
      this.projActivities.push(this.globalservice.favActivities[i].workPackageName);
    }

    for (var i = 0; i < items.length; i++) {
      var projectName = items[i].projectName;
      this.iconType[i] = "Down";
      var activity: ACTIVITYFORMAT[] = [];
      this.projects[i] = {
        name: projectName,
        type: "",
        location: "",
        time: "0:00 hrs",
        activities: activity
      }

    }
  }

  fillDefaultProjects() {

    var items = this.globalservice.favProjects;

    this.setAllActivities();

    //refresh singleday activity
    if (this.singleDayActivity.length > 0)
      this.singleDayActivity.splice(0, this.singleDayActivity.length);

    //fill the list of selected projects
    for (var i = 0; i < this.arrOfWeekDays.length; i++) {

      var day = this.arrOfWeekDays[i];
      var date = this.arrOfWeekDates[i];

      var objectsArr = [];
      for (var ii = 0; ii < items.length; ii++) {

        var projectName = items[ii].projectName;
        var activity: ACTIVITYFORMAT[] = [];
        var obj1 = {
          name: projectName,
          type: "",
          location: "",
          time: "0:00 hrs",
          activities: activity
        }
        objectsArr.push(obj1);
      }
      var obj = {
        day: day,
        date: date,
        totalTime: "0:00",
        isSubmitted: false,
        project: objectsArr
      }

      var returnObj = this.entryExisInSingleDayActivity(date);

      if (returnObj.status) {
        this.deleteEntryFromSingleDayActivity(returnObj.count);
      }

      this.singleDayActivity.push(obj);


    }

    this.daySelected = this.arrOfWeekDays[0];

    /*
    fill the array of activities per week which will change if you change week
    This is to calculate the PROJECT HOURS for whole week
    */
    this.updateSingleWeekActivity();

  }

  checkSingleWeekEntryExist(object) {
    var isPresent = false;
    var index = -1;

    var minStr; var hourStr;

    for (var i = 0; i < this.singleWeekActivity.length; i++) {

      var obj = this.singleWeekActivity[i];

      if (obj.name == object.name) {

        index = i;

        var innerTime = obj.time;
        var arrOfInnerTime = innerTime.split(":");
        var innerHour = +arrOfInnerTime[0];
        var str_innerMin = arrOfInnerTime[1];
        var arrOfInnerMin = str_innerMin.split(" ");
        var innerMin = +arrOfInnerMin[0];

        var argumentTime = object.time;
        var arrOfargumentTime = argumentTime.split(":");
        var argumentHour = +arrOfargumentTime[0];
        var str_argumentMin = arrOfargumentTime[1];
        var arrOfargumentMin = str_argumentMin.split(" ");
        var argumentMin = +arrOfargumentMin[0];

        var totalHours = innerHour + argumentHour;
        var totalMins = innerMin + argumentMin;

        while (totalMins >= 60) {
          totalHours += 1;
          totalMins = totalMins - 60;
        }

        hourStr = totalHours.toString();

        if (totalMins < 10) {
          minStr = "0" + totalMins.toString() + " hrs";
        } else
          minStr = totalMins.toString() + " hrs";

        isPresent = true;
        break;
      }

    }


    if (index != -1) {

      var item = this.singleWeekActivity[index];
      item.time = hourStr + ":" + minStr;
    }
    return isPresent;
  }

  updateSingleWeekActivity() {

    this.singleWeekActivity = [];

    for (var i = 0; i < this.arrOfWeekDates.length; i++) {
      var date = this.arrOfWeekDates[i];
      var returnObj = this.getDataBasedonDateFromSingleActivity(date);

      var projlist = returnObj.project;

      for (var j = 0; j < projlist.length; j++) {

        var object = {
          "name": projlist[j].name,
          "time": projlist[j].time,
          "location": projlist[j].location
        }

        if (!this.checkSingleWeekEntryExist(object))
          this.singleWeekActivity.push(object);

      }

    }

  }

  getDataBasedonDateFromSingleActivity(date) {

    var returnObj;

    for (var i = 0; i < this.singleDayActivity.length; i++) {
      var obj = this.singleDayActivity[i];
      if (date == obj.date) {
        returnObj = obj;
        break;
      }
    }
    return returnObj;
  }


  entryExisInSingleDayActivity(date) {

    var isPresent = false;
    var index = -1;
    for (var i = 0; i < this.singleDayActivity.length; i++) {

      var obj = this.singleDayActivity[i];
      if (date == obj.date) {
        isPresent = true;
        index = i;
        break;
      }

    }
    var returnobj = {
      status: isPresent,
      count: index
    }
    return returnobj;

  }

  deleteEntryFromSingleDayActivity(popIndex) {

    this.singleDayActivity.splice(popIndex, 1);
  }

  ifSingleDayActivityPresent() {
    var ispresent: boolean = false;

    for (var i = 0; i < this.singleDayActivity.length; i++) {
      var obj = this.singleDayActivity[i];

      for (var j = 0; j < this.arrOfWeekDays.length; j++) {
        var day = this.arrOfWeekDays[j];
        if (day == obj.day)
          ispresent = true;
      }
    }
    return ispresent;
  }

  weekdayClick(value, p) {

    this.shownGroup = null;
    if (this.arrOfWeekDays[p] == " ")
      return;
    this.curSelectedProject = null;

    var firstDay = this.arrOfWeekDays[p];

    //this.daySelected = firstDay.toString();
    var today = new Date();
    var lastDay = this.daysInMonth(today.getMonth() + 1, today.getFullYear());

    this.footerStatus();
    this.footerStatus1(p);

    var firstDayOfCompare = +this.arrOfWeekDays[0];
    var lastDayOfCompare = +lastDay;

    var dayString = today.getDay() + 1;

    if (this.daySelected == value) {
      if (this.isSelected) {


        this.isSelected = false;
        this.selectedButtonIndex = -1;

        if (!this.checkifTimeEntered())
          this.isFooterbtnDisabled = false;
        else
          this.isFooterbtnDisabled = true;

      } else {
        this.isSelected = true;
        this.selectedButtonIndex = p;
        this.isFooterbtnDisabled = true;
      }
    } else {
      this.isSelected = true;
      this.selectedButtonIndex = p;
      this.isFooterbtnDisabled = true;


    }

    this.daySelected = value;

  }

  monthDayClick(value, p) {

  }

  isDayPresentinList(value) {

    var isPresent: boolean = false;

    for (var i = 0; i < this.singleDayActivity.length; i++) {
      var obj = this.singleDayActivity[i];
      if (obj.day == value) {
        isPresent = true;
        break;
      }
    }
    return isPresent;
  }

  updateDayActivity(value) {

    var index = -1;
    for (var i = 0; i < this.singleDayActivity.length; i++) {
      var obj = this.singleDayActivity[i];
      if (obj.day == value) {
        index = i;
        break;
      }
    }

    if (index != -1) {
      var obj = this.singleDayActivity[index];
      obj.project = this.arrOfSelectedProjects;
    }
  }

  indexofSingleDayActivity() {

    var index;
    for (var i = 0; i < this.singleDayActivity.length; i++) {
      var obj = this.singleDayActivity[i];
      if (obj.day == this.daySelected) {
        index = i;
        break;
      }
    }
    return index;
  }

  expandCollapseClick(index) {

    if (this.iconType[index] == "Down")
      this.iconType[index] = "Up";
    else
      this.iconType[index] = "Down";
  }



  leftbtnClick() {

    if (this.timesheet_segment == 'weekly') {
      console.log("Left");

      var currentFirstelement_str = this.arrOfWeekDays[0];

      // if(currentFirstelement_str == " ")
      //   return;

      this.daySelected = "1";
      this.isSelected = false;
      this.selectedButtonIndex = -1;

      var currentFirstelement = +currentFirstelement_str;

      var firstDayDate = this.arrOfWeekDates[0];
      var arrOfitems = firstDayDate.split("-");
      var month = +arrOfitems[1];
      var year = +arrOfitems[0];
      var day = +arrOfitems[2];

      if (currentFirstelement - 7 <= 0) {

        month -= 1;
        if (month <= 0) {
          year -= 1;
          month = 12;
        }

        var difference = 7 - currentFirstelement;
        var noOfDays = this.daysInMonth(month, year);

        var monthstr;
        var noOfDaysStr;

        if (month < 10) {
          monthstr = "0" + month.toString();
        } else {
          monthstr = month.toString();
        }


        for (var i = difference; i >= 0; i--) {

          if (noOfDays < 10) {
            noOfDaysStr = "0" + noOfDays.toString();
          } else {
            noOfDaysStr = noOfDays.toString();
          }
          this.arrOfWeekDays[i] = noOfDays.toString();
          this.arrOfWeekDates[i] = year.toString() + "-" + monthstr + "-" + noOfDaysStr;
          noOfDays--;
        }

        var firstItem = 1;
        var tempMonth = month + 1;

        var monthstr1;
        if (tempMonth < 10) {
          monthstr1 = "0" + tempMonth.toString();
        } else {
          monthstr1 = tempMonth.toString();
        }

        for (var i = difference + 1; i < this.arrOfWeekDays.length; i++) {

          var noOfDaysStr1;
          if (firstItem < 10) {
            noOfDaysStr1 = "0" + firstItem.toString();
          } else {
            noOfDaysStr1 = firstItem.toString();
          }

          this.arrOfWeekDays[i] = firstItem.toString();
          this.arrOfWeekDates[i] = year.toString() + "-" + monthstr1 + "-" + noOfDaysStr1;
          firstItem++;
        }

      } else if (currentFirstelement - 7 > 0) {

        var monthstr;

        if (month < 10) {
          monthstr = "0" + month.toString();
        } else {
          monthstr = month.toString();
        }

        currentFirstelement = currentFirstelement - 7;
        for (var i = 0; i < 7; i++) {


          var noOfDaysStr1;
          if (currentFirstelement < 10) {
            noOfDaysStr1 = "0" + currentFirstelement.toString();
          } else {
            noOfDaysStr1 = currentFirstelement.toString();
          }

          this.arrOfWeekDays[i] = currentFirstelement.toString();
          this.arrOfWeekDates[i] = year.toString() + "-" + monthstr + "-" + noOfDaysStr1;
          currentFirstelement++;

        }

      }

      var today = new Date();
      var todayDay = today.getDate();
      var todayMonth = today.getMonth() + 1;
      var todayYear = today.getFullYear();

      var isPresent = false;
      for (var b = 0; b < this.arrOfWeekDates.length; b++) {
        var dayObj = this.arrOfWeekDates[b];

        var arr = dayObj.split("-");
        var yr = arr[0];
        var mn = arr[1];
        var dd = arr[2];

        if (todayMonth == mn && todayDay == dd && todayYear == yr) {
          //if(dayObj == todayDay.toString()){
          isPresent = true;
          break;
        }
      }
      if (isPresent) {
        this.dateNow = today;
      } else {
        var currentDateNow = new Date(year, month - 1, day);
        this.dateNow = currentDateNow;
      }


      var firstDay = this.arrOfWeekDays[0];
      var lastDay = this.arrOfWeekDays[6];
      this.daySelected = firstDay.toString();

      this.createViewTimeSheetArgs();

      this.saveSubmit = "SUBMIT";

      var today = new Date();

      // this.footerStatus();

      this.combineData(true);

      //this.calculateTotalTimeforDay();
    } else {


      var dateObject;

      for (var i = 0; i < this.headerLabels_Monthly.length; i++) {

        var objC = this.headerLabels_Monthly[i];

        if (objC.dateString != "") {
          dateObject = objC;
          break;
        }
      }
      // = this.headerLabels_Monthly[0];

      var date = dateObject.dayString;

      var datearr = date.split("-");

      var yy = +datearr[0];
      var MM = +datearr[1];
      var ddd = +datearr[2];

      MM -= 2;

      if (MM < 0) {
        MM = 11;
        yy -= 1;
        ddd = 1;
      }

      var newdate = new Date(yy, MM, ddd);
      this.createMonthCalendar(newdate);

      this.createTimeSheetMonthly(newdate);

    }
  }


  checkforSubmitStatus(dd) {

    var isSubmit = false;

    for (var i = 0; i < this.singleDayActivity.length; i++) {

      var obj = this.singleDayActivity[i];

      if (obj.date == dd) {
        isSubmit = obj.isSubmitted;
        break;
      }
    }
    return isSubmit;
  }

  footerStatus1(p) {

    var date = this.arrOfWeekDates[p];

    var isSubmit = this.checkforSubmitStatus(date);

    if (isSubmit) {
      this.isFooterbtnDisabled = true;
    } else
      this.isFooterbtnDisabled = false;

    var arr1 = date.split("-");

    var minDate = new Date(arr1[0], arr1[1] - 1, arr1[2]);

    var minDateDay = minDate.getDay();

    var today = new Date();

    //  if(minDate == today){
    //       if(minDateDay == 0 || minDateDay >= 5)
    //         this.saveSubmit = "SUBMIT";
    //       else
    //         this.saveSubmit = "SAVE CHANGES";

    //  }else if(minDate < today){
    //     this.saveSubmit = "SUBMIT";

    // }else if(minDate > today){

    //     this.saveSubmit = "SAVE CHANGES";
    //  }
  }


  footerStatus() {

    var today = new Date();

    var minDateString = this.arrOfWeekDates[0];
    var maxDateString = this.arrOfWeekDates[6];

    var arr1 = minDateString.split("-");
    var arr2 = maxDateString.split("-");


    var minDate = new Date(arr1[0], arr1[1] - 1, arr1[2]);
    var maxDate = new Date(arr2[0], arr2[1] - 1, arr2[2]);


    if (today > minDate && today < maxDate) {
      //alert('Correct Date')
      this.saveSubmit = "SAVE CHANGES";

      var day = today.getDay();

      if (day == 0 || day >= 5) {
        this.saveSubmit = "SUBMIT";
      }

    }
    else if (today < minDate && today < maxDate) {

      //alert('Out Side range !!')
      this.saveSubmit = "SAVE CHANGES";

    } else if (today > minDate && today > maxDate) {

      this.saveSubmit = "SUBMIT";

      for (var i = 0; i < this.arrOfWeekDates.length; i++) {

        var dd = this.arrOfWeekDates[i];

        if (this.checkforSubmitStatus(dd))
          this.isFooterbtnDisabled = true;
        else
          this.isFooterbtnDisabled = false;
      }

    }


    // var today = new Date();
    // var dt = this.arrOfWeekDates[number];
    // var compareDate = this.stringToDate(dt,"yyyy-MM-dd","-");

    // if ((compareDate.getTime()) >= (today.getTime())) {
    //       this.saveSubmit = "SAVE CHANGES";
    // } else {
    //       this.saveSubmit = "SUBMIT";
    // }

    // var isSubmit = false;

    // for(var i = 0;i<this.arrOfWeekDates.length;i++){
    //     var date = this.arrOfWeekDates[i];

    //     for(var j=0;j<this.singleDayActivity.length;j++){

    //       var obj = this.singleDayActivity[j];

    //       if(obj.date == date){
    //          isSubmit = obj.isSubmitted;
    //         break;
    //       }
    //     }
    // }

    // if(isSubmit)
    //     this.isFooterbtnDisabled = true;  
    // else
    //     this.isFooterbtnDisabled = false;      
    //   var thisday:boolean = false;
    //   var today = new Date();
    //   var isGreater:boolean;

    //   for(var i = 0;i<this.arrOfWeekDays.length;i++){
    //       if(today.getDate() > this.arrOfWeekDays[i])
    //           isGreater = true;
    //       else if(today.getDate() == this.arrOfWeekDays[i])
    //           thisday = true;  
    //       else{
    //           isGreater = false;
    //           }      
    //   }

    // this.isFooterbtnDisabled = isGreater;
    // if(thisday){
    //     if(today.getDay() >= 5)
    //       this.isFooterbtnDisabled = true;
    //     else
    //       this.isFooterbtnDisabled = false;  
    // }
  }

  rightbtnClick() {
    console.log("Right");

    if (this.timesheet_segment == 'weekly') {

      var currentFirstelement_str = this.arrOfWeekDays[6];

      var lastDayDate = this.arrOfWeekDates[6];
      var arrOfitems = lastDayDate.split("-");
      var month = +arrOfitems[1];
      var year = +arrOfitems[0];
      var day = +arrOfitems[2];

      // if(currentFirstelement_str == " ")
      //   return;

      this.isSelected = false;
      this.selectedButtonIndex = -1;
      var today = new Date();


      var currentFirstelement = +currentFirstelement_str;

      currentFirstelement += 1;


      if (currentFirstelement <= this.daysInMonth(month, year)) {


        var noOfDays1 = this.daysInMonth(month, year);
        var diff = noOfDays1 - (currentFirstelement - 1);

        var monthstr;
        if (month < 10) {
          monthstr = "0" + month.toString();
        } else
          monthstr = month.toString();

        if (diff >= 7) {

          for (var i = 0; i < 7; i++) {

            var curEle;
            if (currentFirstelement < 10) {
              curEle = "0" + currentFirstelement.toString();
            } else
              curEle = currentFirstelement.toString();

            this.arrOfWeekDays[i] = currentFirstelement.toString();
            this.arrOfWeekDates[i] = year.toString() + "-" + monthstr + "-" + curEle;
            currentFirstelement++;
          }

        } else if (diff < 7) {

          var count2 = 7 - diff;

          for (var i = 0; i < diff; i++) {

            var curEle;
            if (currentFirstelement < 10) {
              curEle = "0" + currentFirstelement.toString();
            } else
              curEle = currentFirstelement.toString();

            this.arrOfWeekDays[i] = currentFirstelement.toString();
            this.arrOfWeekDates[i] = year.toString() + "-" + monthstr + "-" + curEle;
            currentFirstelement++;
          }
          var firstItem = 1;
          var tempMonth1 = month + 1;

          if (tempMonth1 > 12) {
            tempMonth1 = 1;
            year += 1;
          }

          var tempMontst;

          if (tempMonth1 < 10) {
            tempMontst = "0" + tempMonth1.toString();
          } else
            tempMontst = tempMonth1.toString();

          for (var i = 0; i < count2; i++) {

            var curEle;
            if (firstItem < 10) {
              curEle = "0" + firstItem.toString();
            } else
              curEle = firstItem.toString();

            this.arrOfWeekDays[i + diff] = firstItem.toString();
            this.arrOfWeekDates[i + diff] = year.toString() + "-" + tempMontst + "-" + curEle;
            firstItem++;
          }
        }


        // for(var i = 0;i<7;i++){
        //   if(currentFirstelement <= this.daysInMonth(today.getMonth() + 1,today.getFullYear())){
        //     this.arrOfWeekDays[i] = currentFirstelement.toString();
        //     currentFirstelement++;
        //   }else{
        //     this.arrOfWeekDays[i] = " ";
        //   }
        // }
      } else {
        var firstItem = 1;
        var tempMonth1 = month + 1;

        if (tempMonth1 > 12) {
          tempMonth1 = 1;
          year += 1;
        }

        var mnst;
        if (tempMonth1 < 10) {
          mnst = "0" + tempMonth1.toString();
        } else
          mnst = tempMonth1.toString();

        for (var i = 0; i < 7; i++) {

          var curEle;
          if (firstItem < 10) {
            curEle = "0" + firstItem.toString();
          } else
            curEle = firstItem.toString();

          this.arrOfWeekDays[i] = firstItem.toString();
          this.arrOfWeekDates[i] = year.toString() + "-" + mnst + "-" + curEle;
          firstItem++;
        }
      }





      var today = new Date();
      var todayDay = today.getDate();
      var todayMonth = today.getMonth() + 1;
      var todayYear = today.getFullYear();

      var isPresent = false;
      for (var b = 0; b < this.arrOfWeekDates.length; b++) {
        var dayObj = this.arrOfWeekDates[b];

        var arr = dayObj.split("-");
        var yr = arr[0];
        var mn = arr[1];
        var dd = arr[2];

        if (todayMonth == mn) {
          //if(dayObj == todayDay.toString()){
          isPresent = true;
          break;
        }
      }
      if (isPresent) {
        this.dateNow = today;
      } else {
        var currentDateNow = new Date(year, todayMonth, day);
        this.dateNow = currentDateNow;
      }

      var firstDay = this.arrOfWeekDays[0];
      this.daySelected = firstDay.toString();

      this.createViewTimeSheetArgs();

      this.saveSubmit = "SUBMIT";


      var today = new Date();

      // this.footerStatus();




      this.combineData(true);

      //  this.calculateTotalTimeforDay();

    } else {

      var dateObject;

      for (var i = 0; i < this.headerLabels_Monthly.length; i++) {

        var objC = this.headerLabels_Monthly[i];

        if (objC.dateString != "") {
          dateObject = objC;
          break;
        }
      }
      // = this.headerLabels_Monthly[0];

      var date = dateObject.dayString;

      var datearr = date.split("-");

      var yy = +datearr[0];
      var MM = +datearr[1];
      var ddd = +datearr[2];

      MM += 1;

      if (MM > 12) {
        MM = 1;
        yy += 1;
        ddd = 1;
      }

      var newdate = new Date(yy, MM - 1, ddd);
      this.createMonthCalendar(newdate);
      this.createTimeSheetMonthly(newdate);
    }
  }

  stringToDate(_date, _format, _delimiter) {

    var formatLowerCase = _format.toLowerCase();
    var formatItems = formatLowerCase.split(_delimiter);
    var dateItems = _date.split(_delimiter);
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return formatedDate;
  }


  createTimeSheetMonthly(date) {

    var y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);

    var firstDayYear = y.toString();
    var firstDayMonth = m + 1;
    var firstDayMonthStr = firstDayMonth.toString();
    var firstDayDay = firstDay.getDate();

    var fromDate = firstDayYear + "-" + firstDayMonthStr + "-" + firstDayDay;

    var lastDayYear = y.toString();
    var lastDayMonth = m + 1;
    var lastDayMonthStr = lastDayMonth.toString();
    var lastDayDay = lastDay.getDate();

    var toDate = lastDayYear + "-" + lastDayMonthStr + "-" + lastDayDay;


    this.requestServerForTimeSheet_Monthly(fromDate, toDate);

  }

  createViewTimeSheetArgs() {

    var fromDate = this.arrOfWeekDates[0];
    var toDate = this.arrOfWeekDates[6];

    this.requestServerForTimeSheet(fromDate, toDate);
  }

  requestServerForTimeSheet(fromDate, toDate) {

    this.totalWorkingHrs = "0:00 hrs";
    this.totalbreak = "0:00 hrs";

    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });

    this.loader.present();
    let url = this.config.getApiPath().VIEW_TIMESHEET;

    var self = this;
    self.dataUser = self.globalservice.user;

    let request = {
      "loginUserId": self.dataUser.Deskara_Id,
      "fromDate": fromDate,
      "toDate": toDate,
      "orgId": self.dataUser.Org_DeskeraId,//"dfb69754-db19-11e1-8d50-0022b052d769",
      "environment": "PDC"
    };

    this.api.callService(url, request).subscribe(

      result => {
        self.loader.dismiss();
        this.fillDefaultProjects();
        this.refreshHeaderLabels();

        if (result.error) {
          console.log("Null result");
          this.footerStatus();

        } else if (result.result != null) {
          console.log(result.result);
          this.processTimesheetData(result.result);

          if (!this.monthlyrequest) {
            this.monthlyrequest = true;

            var date = new Date();
            this.createTimeSheetMonthly(date);
          }
        } else {
          console.log("Null result");
          this.footerStatus();
        }
      },
      err => {
        console.error("Error : " + err);
        self.loader.dismiss();
        this.fillDefaultProjects();
        this.refreshHeaderLabels();
        this.footerStatus();

        if (!this.monthlyrequest) {
          this.monthlyrequest = true;

          var date = new Date();
          this.createTimeSheetMonthly(date);
        }
      },
      () => {
        console.log('Data Received');

      }


    );
  }

  requestServerForTimeSheet_Monthly(fromDate, toDate) {

    this.totalWorkingHrs_month = "0:00 hrs";
    this.totalbreak_month = "0 hrs";


    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });

    this.loader.present();

    let url = this.config.getApiPath().VIEW_TIMESHEET;

    var self = this;
    self.dataUser = self.globalservice.user;

    let request = {
      "loginUserId": self.dataUser.Deskara_Id,
      "fromDate": fromDate,
      "toDate": toDate,
      "orgId": "dfb69754-db19-11e1-8d50-0022b052d769",
      "environment": "PDC"
    };

    this.api.callService(url, request).subscribe(

      result => {
        self.loader.dismiss();
        // this.fillDefaultProjects();
        //  this.refreshHeaderLabels();

        if (result.error) {
          console.log("Null result");


        } else if (result.result != null) {
          if (Array.isArray(result.result)) {
            this.processTimeSheetMonthly(result.result);
          } else
            this.processTimeSheetMonthly(result.result.timeSheetResponse.timeSheet);

        } else {
          console.log("Null result");

        }
      },
      err => {
        console.error("Error : " + err);
        self.loader.dismiss();

      },
      () => {
        console.log('Monthly Data Received');

      }


    );

  }


  findSelectedIndexInSingleActivity(searchDate) {

    var indexCount;
    for (var i = 0; i < this.singleDayActivity.length; i++) {

      var obj = this.singleDayActivity[i];

      if (obj.date == searchDate) {

        indexCount = i;
        break;
      }
    }

    return indexCount;
  }

  findObjectInSingleActivity(object) {

    var searchDate = object.day;
    var projectArr = object.data;

    /* search the date in singledayactivity and update the list with records from server */
    var count = this.findSelectedIndexInSingleActivity(searchDate);

    for (var i = 0; i < projectArr.length; i++) {

      var item = projectArr[i];
      if (item.workTime != null)
        this.pushDatainSingleDayActivity(item, count);
    }
  }


  pushDatainSingleDayActivity(item, count) {

    var obj = this.singleDayActivity[count];

    if (item.isApproved == "1" || item.isSubmitted == "1")
      obj.isSubmitted = true;

    var projectArr = obj.project;

    for (var i = 0; i < projectArr.length; i++) {
      var projectItem = projectArr[i];
      if (item.projectName == projectItem.name) {

        //calculate the totaltime and then put it here
        var time = this.calculateTotalTime(projectItem.time, item.workTime);
        projectItem.time = time;

        obj.totalTime = this.calculateTotalTime(projectItem.time, obj.totalTime);

        var temparr = obj.totalTime.split(" ");
        obj.totalTime = temparr[0];

        if (!this.checkForProjectActivityArray(item, projectItem.activities)) {

          if (item.timesheetId != null)
            projectItem.activities.push({
              activityName: item.workPackageName,
              activityTime: item.workTime,
              timeSheet: item.timesheetId

            });
          else {
            projectItem.activities.push({
              activityName: item.workPackageName,
              activityTime: item.workTime,
              timeSheet: ""

            });
          }
        }

      }
    }

  }

  calculateTotalTime(time, worktime) {

    var timeArr = time.split(" ");
    time = timeArr[0];
    var timeArr1 = time.split(":");

    var index1 = +timeArr1[0];
    var index2 = +timeArr1[1];

    var workTimeArr = worktime.split(":");

    var index3 = +workTimeArr[0];
    var index4 = +workTimeArr[1];

    var index5 = index1 + index3;
    var index6 = index2 + index4;

    if (index6 >= 60) {
      index5 += 1;
      index6 = index6 - 60;
    }

    var hrstring;
    var minstring;

    if (index5 < 10) {
      hrstring = "0" + index5.toString();
    } else
      hrstring = index5.toString();

    if (index6 < 10) {
      minstring = "0" + index6.toString();
    } else
      minstring = index6.toString();

    return hrstring + ":" + minstring + " hrs";
  }

  processTimesheetData(records) {

    var dateArr = [];

    for (var i = 0; i < records.length; i++) {
      var obj = records[i];

      if (obj.workTime != null && obj.workTime != "00:00") {

        var dateObj = {
          day: "",
          data: []
        };

        dateObj.day = obj.date;
        dateObj.data.push(obj);

        if (!this.checkforSameDayData(dateArr, obj.date, obj))
          dateArr.push(dateObj);
      }

    }


    for (var i = 0; i < dateArr.length; i++) {

      var obj = dateArr[i];
      this.findObjectInSingleActivity(obj);

    }

    //update the singleweek activity
    this.updateSingleWeekActivity();

    this.footerStatus();


    for (var j = 0; j < this.headerLabels.length; j++) {

      var headerobj = this.headerLabels[j];
      var day1 = headerobj.dayString;
      var headerobj1 = this.searchforDataonDay(day1);

      if (day1 != " ")
        headerobj.hours = headerobj1.time;
      else
        headerobj.hours = "";
      headerobj.status = headerobj1.isSubmitted;
    }
    //this.combineData(false);



    this.calculateTotalHoursForWeek();
  }

  searchProjectData(datearg, dateArr, projectName) {

    var totalTimeHr = 0;
    var totalTimeMin = 0;
    var isSubmitted;
    var projactivity: ACTIVITYFORMAT[] = [];

    for (var i = 0; i < dateArr.length; i++) {

      var dateObj = dateArr[i];

      if (dateObj.day == datearg) {

        var arrOfProj = dateObj.data;

        for (var j = 0; j < arrOfProj.length; j++) {

          var projObj = arrOfProj[j];
          if (projObj.projectName == projectName && projObj.workTime != null) {
            //check if element exist in projactivity

            var timesheetid;
            if (projObj.timesheetId != null)
              timesheetid = projObj.timesheetId;

            if (!this.checkForProjectActivityArray(projObj, projactivity))

              if (projObj.timesheetId != null)
                projactivity.push({
                  activityName: projObj.workPackageName,
                  activityTime: projObj.workTime,
                  timeSheet: projObj.timesheetId

                });
              else {
                projactivity.push({
                  activityName: projObj.workPackageName,
                  activityTime: projObj.workTime,
                  timeSheet: ""

                });
              }

            var time = projObj.workTime;
            var timeArr = time.split(":");

            var timeIndex1 = +timeArr[0];
            var timeIndex2 = +timeArr[1];

            totalTimeHr += timeIndex1;
            totalTimeMin += timeIndex2;

          }
        }

      }
    }

    while (totalTimeMin >= 60) {
      totalTimeHr += 1;
      totalTimeMin = totalTimeMin - 60;
    }

    var totalHrString;
    var totalMinString;
    var totalTime;

    totalHrString = totalTimeHr.toString();

    if (totalTimeMin < 10) {
      totalMinString = "0" + totalTimeMin.toString();
    } else
      totalMinString = totalTimeMin.toString();

    totalTime = totalHrString + ":" + totalMinString;

    var returnobj = {
      time: totalTime,
      activity: projactivity
    }

    return returnobj;
  }

  checkforSameDayData(dateArr, dateArg, obj) {
    var isPresent = false;
    for (var i = 0; i < dateArr.length; i++) {
      var object = dateArr[i];
      var arrOfdata = object.data;

      if (object.day == dateArg) {
        var isUpdate = false;
        var changeIndex;
        for (var j = 0; j < arrOfdata.length; j++) {
          var dataobj = arrOfdata[j];

          if ((dataobj.projectName == obj.projectName) &&
            (dataobj.workPackageName == obj.workPackageName) && ((obj.calculated == "1"))) {
            // arrOfdata[j] = obj;

            isUpdate = true;
            changeIndex = j;
            break;

          } else if ((dataobj.projectName == obj.projectName) &&
            (dataobj.workPackageName == obj.workPackageName) && ((dataobj.calculated == "1"))) {
            isUpdate = true;
            changeIndex = -1;
          }

        }

        if (isUpdate && changeIndex >= 0) {
          arrOfdata[changeIndex] = obj;

        } else if (!isUpdate)
          object.data.push(obj);

        isPresent = true;
        break;
      }
    }
    return isPresent;
  }

  checkForProjectActivityArray(projObj, projactivity) {

    var isPresent: boolean = false;

    for (var i = 0; i < projactivity.length; i++) {

      var activityObj = projactivity[i];

      if (projObj.workPackageName == activityObj.activityName) {

        var time1 = activityObj.activityTime;
        var time2 = projObj.workTime;

        if (projObj.timesheetId != null) {
          activityObj.timeSheet = projObj.timesheetId;
        }

        var arr1 = time1.split(":")
        var arr2 = time2.split(":")

        var index1 = +arr1[0];
        var index2 = +arr1[1];

        var index3 = +arr2[0];
        var index4 = +arr2[1];

        var index5 = index1 + index3;
        var index6 = index2 + index4;

        while (index6 >= 60) {
          index5 += 1;
          index6 = index6 - 60;
        }

        var hrstring;
        var minstring;

        if (index5 < 10) {
          hrstring = "0" + index5.toString();
        } else
          hrstring = index5.toString();

        if (index6 < 10) {
          minstring = "0" + index6.toString();
        } else
          minstring = index6.toString();

        activityObj.activityTime = hrstring + ":" + minstring;
        isPresent = true;
        break;
      }
    }


    return isPresent;
  }


  checkifTimeEntered() {
    var isEntered: boolean = false;
    for (var i = 0; i < this.singleDayActivity.length; i++) {

      var obj = this.singleDayActivity[i];
      var time = obj.totalTime;
      if (time == "0:00" || (time == "0:0")) {

      } else {
        isEntered = true;
        break;
      }

    }
    return isEntered;
  }


  processTimeSheetMonthly(records) {

    var dateArr = [];

    for (var i = 0; i < records.length; i++) {

      var obj = records[i];//obj.workTime != null
      //if ('null' != val)
      if (!!obj.workTime) {

        var dateObj = {
          day: "",
          data: []
        };

        dateObj.day = obj.date;
        dateObj.data.push(obj);

        if (!this.checkforSameDayData(dateArr, obj.date, obj))
          dateArr.push(dateObj);
      }

    }

    this.updateMonthCalendar(dateArr);


  }

  findProjectID(projectName) {

    var returnString: string;

    for (var i = 0; i < this.globalservice.favProjects.length; i++) {
      var projObjN = this.globalservice.favProjects[i];
      if (projObjN.projectName == projectName) {
        returnString = projObjN.projectId;
        break;
      }
    }
    return returnString;
  }

  findActivityID(activityName) {

    var returnString: string;

    for (var i = 0; i < this.globalservice.favActivities.length; i++) {
      var activityObjN = this.globalservice.favActivities[i];
      if (activityObjN.workPackageName == activityName) {
        returnString = activityObjN.workPackageId;
        break;
      }
    }
    return returnString;
  }

  submitTimeSheet() {

    console.log("Hello");
    var timesheetArr: TIMEHSEET[] = [];


    for (var i = 0; i < this.singleDayActivity.length; i++) {

      var dayOb = this.singleDayActivity[i];

      if (dayOb.day != " ") {
        var projArr = dayOb.project;

        for (var j = 0; j < projArr.length; j++) {

          var actiOb = projArr[j];

          if (actiOb.time != "0:00 hrs") {

            var projectName = actiOb.name;
            var activities = [];

            activities = actiOb.activities;

            for (var k = 0; k < activities.length; k++) {

              var activityObj = activities[k];

              var activityName = activityObj.activityName;
              var activityTime = activityObj.activityTime;
              var timeSheetID = activityObj.timeSheet;

              var arr = activityTime.split(":");
              if (arr.length > 2) {
                var index1 = +arr[0];
                var index2 = +arr[1];
                activityTime = index1.toString() + ":" + index2.toString();
              }
              var date = dayOb.date;
              var arrr = date.split("-");
              var mn = +arrr[1];
              var dd = +arrr[2];
              var mon: string;
              var da: string;
              if (mn < 10) {
                mon = "0" + mn.toString();
              } else
                mon = mn.toString();
              if (dd < 10) {
                da = "0" + dd.toString();
              } else
                da = dd.toString();

              var actualDate = arrr[0] + "-" + mon + "-" + da;

              var arrofWork = activityTime.split(":");

              var inde1 = +arrofWork[0];
              var inde2 = +arrofWork[1];
              var inde3;
              var inde4;
              if (inde1 < 10) {
                inde3 = "0" + inde1.toString();
              } else
                inde3 = inde1.toString();
              if (inde2 < 10) {
                inde4 = "0" + inde2.toString();
              } else
                inde4 = inde2.toString();

              var actualWorkTime = inde3 + ":" + inde4;
              var arrObj;

              if (timeSheetID != "") {
                arrObj = {
                  "date": actualDate,
                  "workTime": actualWorkTime,
                  "projectId": this.findProjectID(projectName),
                  "workPackageId": this.findActivityID(activityName),
                  "timesheetId": timeSheetID

                }
              } else {
                arrObj = {
                  "date": actualDate,
                  "workTime": actualWorkTime,
                  "projectId": this.findProjectID(projectName),
                  "workPackageId": this.findActivityID(activityName)
                }
              }

              timesheetArr.push(arrObj);
            }
          }
        }
      }
    }

    // var reqArr = [];

    var reqObj = {
      "userId": this.globalservice.user.Deskara_Id,
      "orgId": "dfb69754-db19-11e1-8d50-0022b052d769",
      "environment": "PDC",
      "timeSheet": timesheetArr
    }

    // reqArr.push(reqObj);


    if (this.saveSubmit == "SUBMIT") {
      if (!this.checkifTimeEntered()) {
        let alert = this.alertCtrl.create({
          title: 'Alert',
          subTitle: "Please enter valid timesheet",
          buttons: ['OK']
        });
        alert.present();
        return;
      }
    }

    var message;
    var successMessage;
    if (this.saveSubmit == "SUBMIT") {
      message = "Submitting timesheet...";
      successMessage = "Timesheet submitted successfully.";
    } else {
      message = "Saving timesheet...";
      successMessage = "Timesheet is saved successfully.";
    }

    this.loader = this.loadingCtrl.create({
      content: message
    });

    this.loader.present();

    let url;

    var self = this;
    self.dataUser = self.globalservice.user;

    if (this.saveSubmit == "SUBMIT") {
      url = this.config.getApiPath().SUBMIT_TIMESHEET;
      let request = {
        "input": reqObj
      }
      //   let request= {
      //      "loginUserId": self.dataUser.Deskara_Id,
      //      "date":"2015-11-25",
      //      "workTime":"11:00",
      //      "projectId":"1c4413d1-ee7c-11e4-8c55-001a4a1c1a16",
      //      "workPackageId":"e95411ab-ee7c-11e4-8c55-001a4a1c1a16",
      //      "timesheetId": "8a98a0c754293870015961a0015e74dd"
      //  };
      this.api.callService(url, request).subscribe(

        result => {
          self.loader.dismiss();
          if (result.result != null) {
            console.log(result.result);

            for (var i = 0; i < this.headerLabels.length; i++) {
              var obj = this.headerLabels[i];
              obj.status = true;
            }

            for (var j = 0; j < this.singleDayActivity.length; j++) {
              var obj1 = this.singleDayActivity[j];
              obj1.isSubmitted = true;
            }

            let alert = self.alertCtrl.create({
              title: 'Success',
              subTitle: successMessage,
              buttons: ['OK']
            });
            alert.present();

            this.createViewTimeSheetArgs();


          } else {
            console.log("Null result");

          }
        },
        err => {
          console.error("Error : " + err);
          self.loader.dismiss();
        },
        () => {
          console.log('Data Received');
          this.isSelected = false;
        }


      );

    } else {

      url = this.config.getApiPath().SAVE_TIMESHEET;
      let request = {
        "input": reqObj
      }
      //   let request= {
      //      "loginUserId": self.dataUser.Deskara_Id,
      //      "date":"2015-11-25",
      //      "workTime":"11:00",
      //      "projectId":"1c4413d1-ee7c-11e4-8c55-001a4a1c1a16",
      //      "workPackageId":"e95411ab-ee7c-11e4-8c55-001a4a1c1a16"
      //  };
      this.api.callService(url, request).subscribe(

        result => {
          self.loader.dismiss();
          if (result.result != null) {
            console.log(result.result);

            for (var i = 0; i < this.headerLabels.length; i++) {
              var obj = this.headerLabels[i];
              obj.status = false;
            }

            for (var j = 0; j < this.singleDayActivity.length; j++) {
              var obj1 = this.singleDayActivity[j];
              obj1.isSubmitted = false;
            }

            let alert = self.alertCtrl.create({
              title: 'Success',
              subTitle: successMessage,
              buttons: ['OK']
            });
            alert.present();

          } else {
            console.log("Null result");

          }
        },
        err => {
          console.error("Error : " + err);
          self.loader.dismiss();
        },
        () => {
          console.log('Data Received');
          this.isSelected = false;
        }

      );
    }

  }

  addActivity(index) {
    // Object with options used to create the alert

    // Now we add the radio buttons
    var activities_temp = [];
    console.log('One activity is' + this.projActivities[0]);

    for (let i = 0; i < this.projActivities.length; i++) {

      activities_temp.push({
        type: 'checkbox',
        label: this.projActivities[i],
        value: this.projActivities[i]
      });
      //activities_temp.push({ name: 'options', value: this.projActivities[i],
      //label: this.projActivities[i], type: 'radio' });
    }

    activities_temp.sort((a, b) => {
      if (a.value < b.value) return -1;
      if (a.value > b.value) return 1;
      return 0;
    });
    var options = {
      title: 'Add Activity',
      message: '',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {

            var item: ACTIVITYFORMAT[] = [];

            for (var i = 0; i < data.length; i++) {
              item[i] = {
                activityName: data[i],
                activityTime: "0:00",
                timeSheet: ""
              }
            }

            if (data != null) {
              // var project = this.projects[index];
              var project;

              for (var i = 0; i < this.singleDayActivity.length; i++) {

                var obj = this.singleDayActivity[i];


                if (this.daySelected == obj.day) {
                  project = obj.project[this.selectedIndex];
                  break;
                }
              }

              if (project != null) {

                if (project.activities == null)
                  project.activities = [];

                for (var j = 0; j < item.length; j++)
                  project.activities.push(item[j]);

                this.curSelectedProject = project;

                for (var i = 0; i < this.curSelectedProject.activities.length; i++) {
                  var acObj = this.curSelectedProject.activities[i];
                  var time = acObj.activityTime;
                  var arrtime = time.split(":");
                  acObj.hour = arrtime[0];
                  acObj.min = arrtime[1];
                }
              }
            }

          }

        }
      ],
      inputs: activities_temp
    };

    // Create the alert with the options
    let alert = this.alertCtrl.create(options);
    alert.present();
  }

  //   printSingle(){

  //     for(var i = 0;i<this.singleDayActivity.length;i++){
  //      var obj1 = this.singleDayActivity[i];
  //      console.log("The day is: " + obj1.day);

  //      for(var ii = 0;ii < obj1.project.length;ii++){
  //          var proj = obj1.project[ii];
  //          console.log("The project is: " + proj.name);

  //          for(var iii = 0;iii<proj.activities.length;iii++){
  //            var act = proj.activities[iii];
  //            console.log("The activity name: " + act.activityName);
  //          }
  //      }
  //    }
  //   }

  changedMin(val, i) {
    console.log("The value is: " + val + "at Index: " + i);

    if (+val >= 60) {
      this.numericSecond = val.slice(0, -1);
      return;
    }

    if (val.length == 0)
      val = "0";

    var project;

    for (var j = 0; i < this.singleDayActivity.length; j++) {
      var obj = this.singleDayActivity[j];

      if (this.daySelected == obj.day) {
        project = obj.project[this.selectedIndex];
        break;
      }
    }

    var item = project;

    if (item != null) {
      var activity = item.activities[i];
      var time = activity.activityTime;

      var arrOfTime = time.split(":");

      var item1 = arrOfTime[0];
      var item2 = arrOfTime[1];

      item2 = val;

      activity.activityTime = item1 + ":" + item2;
      activity.hour = item1;
      activity.min = item2;

      var totalTime: string;
      var item6 = 0;
      var item7 = 0;

      for (var k = 0; k < item.activities.length; k++) {
        var act = item.activities[k];
        var actTime = act.activityTime;
        var arrOfTime = actTime.split(":");

        var hourTime = +arrOfTime[0];
        var minTime = +arrOfTime[1];

        item6 += hourTime;
        item7 += minTime;
      }

      while (item7 >= 60) {
        item7 = item7 - 60;
        item6 += 1;
      }

      var minIndex;
      if (item7 < 10) {
        minIndex = "0" + item7.toString();
      } else
        minIndex = item7.toString();

      totalTime = item6 + ":" + minIndex + " hrs";
      item.time = totalTime;

      this.calculateTotalTimeforDay();

    }

    this.updateSingleWeekActivity();
  }

  changedHour(val, i) {
    console.log("The value is: " + val + "at Index: " + i);

    if (val.length == 0)
      val = "0";

    var project;

    for (var j = 0; i < this.singleDayActivity.length; j++) {
      var obj = this.singleDayActivity[j];

      if (this.daySelected == obj.day) {
        project = obj.project[this.selectedIndex];
        break;
      }
    }

    var item = project;

    if (item != null) {
      var activity = item.activities[i];
      var time = activity.activityTime;

      var arrOfTime = time.split(":");

      var item1 = arrOfTime[0];
      var item2 = arrOfTime[1];

      item1 = val;

      activity.activityTime = item1 + ":" + item2;
      activity.hour = item1;
      activity.min = item2;

      var totalTime: string;
      var item6 = 0;
      var item7 = 0;

      for (var k = 0; k < item.activities.length; k++) {
        var act = item.activities[k];
        var actTime = act.activityTime;
        var arrOfTime = actTime.split(":");

        var hourTime = +arrOfTime[0];
        var minTime = +arrOfTime[1];

        item6 += hourTime;
        item7 += minTime;
      }

      while (item7 >= 60) {
        item7 = item7 - 60;
        item6 += 1;
      }
      totalTime = item6 + ":" + item7 + " hrs";
      item.time = totalTime;

      this.calculateTotalTimeforDay();

    }

    this.updateSingleWeekActivity();
  }

  incrementClick(index) {

    var project;

    for (var i = 0; i < this.singleDayActivity.length; i++) {
      var obj = this.singleDayActivity[i];

      if (this.daySelected == obj.day) {
        project = obj.project[this.selectedIndex];
        break;
      }
    }
    var item = project;

    if (item != null) {
      var activity = item.activities[index];
      var time = activity.activityTime;

      var arrOfTime = time.split(":");

      var item1 = +arrOfTime[0];
      var item2 = +arrOfTime[1];

      item2++;

      while (item2 >= 60) {
        item1 += 1;
        item2 = item2 - 60;
      }

      var item3: string;
      var item4: string;


      item3 = item1.toString();
      if (item2 == 0) {
        item4 = "00";
      } else
        item4 = item2.toString();

      activity.activityTime = item3 + ":" + item4;
      activity.hour = item3;
      activity.min = item4;

      var totalTime: string;
      var item5 = 0;
      var item6 = 0;

      for (var k = 0; k < item.activities.length; k++) {
        var act = item.activities[k];
        var actTime = act.activityTime;
        var arrOfTime = actTime.split(":");

        var hourTime = +arrOfTime[0];
        var minTime = +arrOfTime[1];

        item5 += hourTime;
        item6 += minTime;
      }

      while (item6 >= 60) {
        item6 = item6 - 60;
        item5 += 1;
      }
      totalTime = item5 + ":" + item6 + " hrs";
      item.time = totalTime;

      this.calculateTotalTimeforDay();

    }

    //update the singleweek activity
    this.updateSingleWeekActivity();

  }

  calculateTotalTimeforDay() {

    var index;
    for (var j = 0; j < this.headerLabels.length; j++) {
      var obj1 = this.headerLabels[j];
      if (this.daySelected == obj1.dateString) {
        index = j;
      }
      // //work around for "" and " " in headerLabels[j].dayString
      // if(this.daySelected == " " || this.daySelected == ""){
      //   this.daySelected = "";

      //   if(this.daySelected == obj1.dayString){
      //     index = j;
      //   }
      // }
    }

    var hour = 0;
    var minute = 0;
    var singleDayIndex = -1;

    for (var i = 0; i < this.singleDayActivity.length; i++) {
      var obj = this.singleDayActivity[i];

      if (this.daySelected == obj.day) {
        singleDayIndex = i;
        var arrOfProj = obj.project;
        for (var k = 0; k < arrOfProj.length; k++) {
          var proj = arrOfProj[k];
          var projTime = proj.time;
          var arrOfTime = projTime.split(":");

          var item1 = arrOfTime[0];
          var item2 = arrOfTime[1];
          item2 = item2.substring(0, 2);
          var item3 = +item2;

          hour += +item1;
          minute += item3;

        }
      }
    }

    while (minute >= 60) {
      minute = minute - 60;
      hour += 1;
    }



    var obj1 = this.headerLabels[index];

    var hrst; var minst;

    if (hour < 10) {
      hrst = "0" + hour.toString();
    } else
      hrst = hour.toString();

    if (minute < 10) {
      minst = "0" + minute.toString();
    } else
      minst = minute.toString();

    var totalTime = hrst + ":" + minst;


    if (minute == 0)
      totalTime = hrst + ":00";

    if (obj1.dayString != " ")
      obj1.hours = totalTime;
    else
      obj1.hours = "";

    if (singleDayIndex != -1) {
      var obj = this.singleDayActivity[singleDayIndex];
      obj.totalTime = totalTime;
    }

    this.calculateTotalHoursForWeek();
  }


  calculateTotalHoursForWeek() {

    var totalHour = 0;
    var totalMin = 0;

    for (var j = 0; j < this.arrOfWeekDays.length; j++) {
      var day = this.arrOfWeekDays[j];

      for (var i = 0; i < this.singleDayActivity.length; i++) {
        var obj = this.singleDayActivity[i];

        if (day == obj.day) {
          var time = obj.totalTime;
          var arrOfTime = time.split(":");

          var hour = +arrOfTime[0];
          var min = +arrOfTime[1];

          totalHour += hour;
          totalMin += min;
          break;
        }
      }

    }

    while (totalMin >= 60) {

      totalHour += 1;
      totalMin -= 60;
    }

    var totalHourStr;

    if (totalHour < 10) {
      totalHourStr = "0" + totalHour.toString();
    } else
      totalHourStr = totalHour.toString();


    if (totalMin == 0)
      this.totalWorkingHrs = totalHourStr + ":00 hrs";
    else if (totalMin < 10)
      this.totalWorkingHrs = totalHourStr + ":0" + totalMin.toString() + " hrs";
    else
      this.totalWorkingHrs = totalHourStr + ":" + totalMin.toString() + " hrs";

  }

  deleteActivity(index) {

    var project;
    for (var i = 0; i < this.singleDayActivity.length; i++) {
      var obj = this.singleDayActivity[i];

      if (this.daySelected == obj.day) {
        project = obj.project[this.selectedIndex];
        break;
      }
    }
    var item = project;

    if (item != null) {
      item.activities.splice(index, 1);

      var totalTime: string;
      var item5 = 0;
      var item6 = 0;

      for (var k = 0; k < item.activities.length; k++) {
        var act = item.activities[k];
        var actTime = act.activityTime;
        var arrOfTime = actTime.split(":");

        var hourTime = +arrOfTime[0];
        var minTime = +arrOfTime[1];

        item5 += hourTime;
        item6 += minTime;
      }

      while (item6 >= 60) {
        item6 = item6 - 60;
        item5 += 1;
      }
      totalTime = item5 + ":" + item6 + " hrs";
      item.time = totalTime;

      this.calculateTotalTimeforDay();
    }

    //update the singleweek activity
    this.updateSingleWeekActivity();

  }

  deleteAllActivities() {

    for (var i = 0; i < this.singleDayActivity.length; i++) {
      var obj = this.singleDayActivity[i];

      for (var j = 0; j < obj.project.length; j++) {
        var project = obj.project[j];
        var length = 0;
        if (project.activities != null)
          length = project.activities.length;
        project.activities.splice(0, length);
        project.time = "0:00 hrs";
      }
    }

    this.calculateTotalTimeforDay();
    //update the singleweek activity
    this.updateSingleWeekActivity();

  }

  changeDate(totalHours, index) {

    var project;

    for (var i = 0; i < this.singleDayActivity.length; i++) {
      var obj = this.singleDayActivity[i];

      if (this.daySelected == obj.day) {
        project = obj.project[this.selectedIndex];
        break;
      }
    }
    var item = project;

    if (item != null) {
      var activity = item.activities[index];
      var time = activity.activityTime;

      console.log("time: " + totalHours);

      var arrOfTime = totalHours.split(":");

      var item1 = +arrOfTime[0];
      var item2 = +arrOfTime[1];

      activity.activityTime = totalHours
      activity.hour = item1;
      activity.min = item2;


      var totalTime: string;
      var item5 = 0;
      var item6 = 0;

      for (var k = 0; k < item.activities.length; k++) {
        var act = item.activities[k];
        var actTime = act.activityTime;
        var arrOfTime = actTime.split(":");

        var hourTime = +arrOfTime[0];
        var minTime = +arrOfTime[1];

        item5 += hourTime;
        item6 += minTime;
      }

      while (item6 >= 60) {
        item6 = item6 - 60;
        item5 += 1;
      }

      var item5st; var item6sst;

      if (item5 < 10)
        item5st = "0" + item5.toString();
      else
        item5st = item5.toString();

      if (item5 < 10)
        item6sst = "0" + item5.toString();
      else
        item6sst = item5.toString();

      totalTime = item5st + ":" + item6sst + " hrs";
      item.time = totalTime;

      this.calculateTotalTimeforDay();
    }

    //update the singleweek activity
    this.updateSingleWeekActivity();
  }

  decrementClick(index) {

    var project;

    for (var i = 0; i < this.singleDayActivity.length; i++) {
      var obj = this.singleDayActivity[i];

      if (this.daySelected == obj.day) {
        project = obj.project[this.selectedIndex];
        break;
      }
    }
    var item = project;//this.curSelectedProject;

    if (item != null) {
      var activity = item.activities[index];

      var time = activity.activityTime;

      var arrOfTime = time.split(":");

      var item1 = +arrOfTime[0];
      var item2 = +arrOfTime[1];


      var decrementCount = 1;

      if (item1 == 0 && item2 == 0) {
        item.activities.splice(index, 1);

      } else if (item1 == 0 && item2 > 0) {
        item2 -= 1;
      } else if (item1 >= 1 && item2 == 0) {
        item1 -= 1;
        item2 = 60 - decrementCount;

      } else if (item1 >= 1 && item2 > 0) {
        item2 -= 1;
      }

      var item3: string;
      var item4: string;

      item3 = item1.toString();
      if (item2 == 0) {
        item4 = "00";
      } else
        item4 = item2.toString();

      activity.activityTime = item3 + ":" + item4;
      activity.hour = item3;
      activity.min = item4;
      var totalTime: string;

      totalTime = item.time;
      var arrOfTime1 = totalTime.split(":");

      var item5 = +arrOfTime1[0];
      var item7 = arrOfTime1[1];
      item7 = item7.substring(0, 2);
      var item6 = +item7;

      if (item6 == 0) {

        if (item5 > 0) {
          item5 -= 1;
          item6 = 60 - decrementCount;
        } else if (item5 == 0) {
          item5 = 0;
          //item6 -= 1;
        } else {
          item6 = 0;
          item5 = 0;
        }
      } else {
        item6 -= 1;
      }/*else if (item6 < ) {
        item5 -= 1;
        item6 = 15 - item6;
        if (item6 > 0) {
          item6 = 60 - item6;
        }
      } else if (item6 >= 15) {
        item6 = item6 - 15;
      }*/

      if (item6 == 0)
        totalTime = item5 + ":" + "00" + " hrs";
      else
        totalTime = item5 + ":" + item6 + " hrs";
      item.time = totalTime;

      this.calculateTotalTimeforDay();
    }

    //update the singleweek activity
    this.updateSingleWeekActivity();

  }


  chartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: false
  };

  chartLabels: string[] = ['Work', 'Meeting', 'Client', 'Break'];
  chartType: string = 'doughnut';
  chartLegend: boolean = false;

  chartData: any[] = [
    {
      data: [50, 30, 15, 5],
      label: ''
    }
  ];
  chartColors: any = [
    {
      backgroundColor: ['#14A5CC', '#554499', '#5FCB8B', '#90A4B4'],
      borderColor: ['#14A5CC', '#554499', '#5FCB8B', '#90A4B4'],
      //    pointBackgroundColor: ['#14A5CC', '#554499', '#5FCB8B', '#90A4B4']
    }
  ];

  chartShadowType: string = 'pie';
  chartShadowColors: any = [
    {
      backgroundColor: ['#117C9E', '#372B72', '#169C75', '#666E75'],
      borderColor: ['#117C9E', '#372B72', '#169C75', '#666E75'],
      //    pointBackgroundColor: ['#14A5CC', '#554499', '#5FCB8B', '#90A4B4']
    }
  ]

  // presentModal() {
  //   const modal = this.modalCtrl.create(TimeSheetAddModalPage);
  //   modal.present();
  // }

}

interface dayFormat {
  dayString: string,
  dateString: string,
  hours: string,
  isGreater: boolean,
  status: boolean
}

interface dayFormat_Monthly {
  dayString: string,
  dateString: string,
  hours: string,
  isGreater: boolean,
  status: boolean
}

interface ACTIVITYFORMAT {
  activityName: string,
  activityTime: string,
  timeSheet: string
}

interface ACTIVITYFORMATTEST {
  activityName: string,
  activityTime: string,
  hour: string,
  min: string,
  timeSheet: string
}

interface PROJECT {
  name: string,
  type: string,
  location: string,
  time: string,
  activities: ACTIVITYFORMAT[]
}

interface PROJECTTEST {
  name: string,
  type: string,
  location: string,
  time: string,
  hour: string,
  min: string,
  activities: ACTIVITYFORMATTEST[]
}


interface TOTALPROJECTHOURS {

  name: string,
  time: string
}

interface WEEKHOURS {

  name: string,
  week: string,
  time: string
}

interface DAY {
  day: string,
  date: string,
  totalTime: string,
  isSubmitted: boolean,
  project: PROJECT[]
}

interface ARROFDAY {
  day: string,
  data: {}[]
}


interface TIMEHSEET {
  date: string,
  workTime: string,
  projectId: string,
  workPackageId: string
}

interface SINGLEWEEK {

  name: string,
  time: string,
  location: string
}
