import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { ProjectSchedulePage } from '../projectschedule/projectschedule';
import { ScheduleDetailsPage } from '../scheduledetails/scheduledetails';


@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {

  schedule_segment: string =  "today";

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {}
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePage');
  }

  viewProjectList(){
    this.navCtrl.push(ProjectSchedulePage);
  }

  viewScheduleDetails(){
    this.navCtrl.push(ScheduleDetailsPage);
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Coming',
      subTitle: 'Developing in the next release',
      buttons: ['OK']
    });
    alert.present();
  }

}
