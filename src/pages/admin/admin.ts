import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AdminTimesheetPage } from '../admintimesheet/admintimesheet';
import { AdminLeavesPage } from '../adminleaves/adminleaves';

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  manageTimesheets() {
    this.navCtrl.push(AdminTimesheetPage);
  }
  manageLeaves() {
    this.navCtrl.push(AdminLeavesPage);
  }

}
