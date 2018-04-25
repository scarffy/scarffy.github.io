import { Component } from '@angular/core';
import { NavController, MenuController, AlertController} from 'ionic-angular';

@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html'
})
export class ForgotPasswordPage {

  constructor(public navCtrl: NavController, private menu: MenuController, public alertCtrl: AlertController) {
    this.menu.swipeEnable(false, 'left_menu');
    
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Password Reset',
      subTitle: 'An email containing your new password has been sent to your email address.',
      buttons: ['OK']
    });
    alert.present();
  }

}
