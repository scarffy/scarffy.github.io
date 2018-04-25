import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PasswordPage } from '../password/password';
import { LanguagePage } from '../language/language';
import { GlobalService } from '../../providers/global-service';
import { AlertController } from 'ionic-angular';



@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  profileName;
  employeeID;
  role;
  department;
  email;
  phoneNumber;
  isMDA;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalservice: GlobalService, public alertCtrl: AlertController) {

    this.profileName = "-";
    this.employeeID = "-";
    this.role = "-";
    this.department = "-";
    this.email = "-";
    this.phoneNumber = "-";

    if (this.globalservice.user.Organization != "MDA")
      this.isMDA = "not";
    else
      this.isMDA = "MDA";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');

    if (this.globalservice.user != null) {
      this.profileName = this.globalservice.user.Person_Name;

      if (this.globalservice.user.Email != null)
        this.email = this.globalservice.user.Email;
    }

  }

  changePassword() {
    this.navCtrl.push(PasswordPage);
  }
  changeLanguage() {
    this.navCtrl.push(LanguagePage);
  }

  editProfile() {

  }
  // addFingerPrint() {

  //   let alert = this.alertCtrl.create({
  //     title: 'Adding Finger Print',
  //     subTitle: 'Place your finger on the finger print reader and hold it for few seconds until you received success message.',
  //     buttons: ['Cancel'],
  //     cssClass: 'fingerprint'
  //   });
  //   alert.present();
  // }
}
