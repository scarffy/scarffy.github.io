import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

/*
  Generated class for the Language page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-language',
  templateUrl: 'language.html'
})
export class LanguagePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LanguagePage');
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Change Language?',
      message: "You'll need to restart the app after changing the language.",
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Change',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }



}
