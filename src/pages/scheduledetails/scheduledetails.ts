import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

/*
  Generated class for the Scheduledetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-scheduledetails',
  templateUrl: 'scheduledetails.html'
})
export class ScheduleDetailsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScheduleDetailsPage');
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
