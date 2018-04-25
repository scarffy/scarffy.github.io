import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-admintimesheet',
  templateUrl: 'admintimesheet.html'
})
export class AdminTimesheetPage {

  timesheet_admin: string = "timesheets";

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminTimesheetPage');
  }

  public buttonClicked: boolean = false; //Whatever you want to initialise it as

  public selectItem() {

    this.buttonClicked = !this.buttonClicked;
  }

}
