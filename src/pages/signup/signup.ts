import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';



@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignUpPage {

  isSubmit: any;
  signupmodel = {};

  constructor(public navCtrl: NavController, private menu: MenuController, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.menu.swipeEnable(false, 'left_menu');
    this.isSubmit = false;

  }

  viewUserDetails() {
    this.isSubmit = true;

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 2000
    });
    loader.present();

  }

  confirmUserDetails() {

    let alert = this.alertCtrl.create({
      title: 'You have successfully signed up.',
      subTitle: 'Your account information has been sent to your email address.',
      buttons: ['OK']
    });
    alert.present();
  }

  addFingerPrint() {

    let alert = this.alertCtrl.create({
      title: 'Adding Finger Print',
      subTitle: 'Place your finger on the finger print reader and hold it for few seconds until you received success message.',
      buttons: ['Cancel'],
      cssClass: 'fingerprint'
    });
    alert.present();
  }

}
