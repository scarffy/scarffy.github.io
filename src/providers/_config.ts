import { Injectable } from '@angular/core';

/*
  Generated class for the HomeService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class Config {

  constructor() {
  }

  getApiPath() {
    return {
      //Root service url
      SERVER_URL: "https://www.csc-crowddynamics.com/api/",
      //Description services
      USER_LOGIN: "user/login",
      GET_TIMESHEET: "deskeraWebserviceWrapper/viewTimesheet",
      VIEW_ALLPROJECTS: "deskeraWebserviceWrapper/viewAllProjects",
      VIEW_FAVPROJECTS: "deskeraWebserviceWrapper/viewListOfFavouriteProjects",
      VIEW_STAFF_CUR_SCHEDULE: "staff/get_shift_byStation_date",
      VIEW_FAVACTIVITIES: "deskeraWebserviceWrapper/viewListOfFavouriteActivities",
      VIEW_TIMESHEET: "deskeraWebserviceWrapper/viewTimesheet",
      SUBMIT_TIMESHEET: "deskeraWebserviceWrapper/submitTimesheets",
      SAVE_TIMESHEET: "deskeraWebserviceWrapper/saveTimesheet",
      CLOCK_ADD_STATUS: "deskeraWebserviceWrapper/addStatusTracking",
      CLOCK_GET_STATUS: "deskeraWebserviceWrapper/getDeskeraStatusTracking",
      VERSION_CHECK: "latest_app"
    }
  }

}
