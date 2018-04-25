
import { ViewChild, ElementRef, Component } from '@angular/core';
import {ViewController} from 'ionic-angular';



@Component({
  selector: 'page-timesheetadd',
  templateUrl: 'timesheetadd.html'
 
})
export class TimeSheetAddModalPage {

    eventSource;
    viewTitle;
    isToday: boolean;
    calendar = {
        mode: 'month',
        currentDate: new Date()
    }; // these are the variable used by the calendar.

  constructor(private viewCtrl: ViewController) {
  
  }

  ngOnInit(){
    
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }

  loadweek() {

  }

}