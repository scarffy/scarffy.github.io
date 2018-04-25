import { Component } from '@angular/core';
import { NavController, MenuController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { checkFirstCharacterValidator } from '../validators/customValidators';
import { TabsPage } from '../tabs/tabs';
import { ForgotPasswordPage } from '../forgotpassword/forgotpassword';
import { SignUpPage } from '../signup/signup';
import { ApiService } from '../../providers/api-service';
import { Config } from '../../providers/_config';
import { HomeService } from '../../providers/home-service'
import { GlobalService } from '../../providers/global-service';
import { LoadingController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TouchID } from '@ionic-native/touch-id';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

//declare var applozic: any;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ApiService, Config, HomeService]
})
export class LoginPage {

  result: any;
  loginForm: FormGroup;
  response: any;
  submitAttempt: boolean = false;
  loader: any;


  constructor(public navCtrl: NavController, public api: ApiService, public config: Config,
    public alertCtrl: AlertController, public formBuilder: FormBuilder, private menu: MenuController,
    public homeService: HomeService, public globalservice: GlobalService, private ga: GoogleAnalytics,
    public loadingCtrl: LoadingController, public storage: Storage, public touchId: TouchID, public platform: Platform) {

    this.menu.swipeEnable(false, 'left_menu');
    this.loginForm = formBuilder.group({
      employeeId: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });


    this.ga.startTrackerWithId('UA-58698748-5')
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.trackView('Login View Contructor');

      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));

  }

  goToHome() {


    this.ga.startTrackerWithId('UA-58698748-5')
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.trackView('Login Button Click:LoginViewController');

      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));

    var username = this.loginForm.value.employeeId;
    var password = this.loginForm.value.password;

    if (username.length == 0) {
      let alert = this.alertCtrl.create({
        title: 'Alert',
        subTitle: 'Please enter username',
        buttons: ['OK']
      });
      alert.present();
      return;
    } else if (password.length == 0) {
      let alert = this.alertCtrl.create({
        title: 'Alert',
        subTitle: 'Please enter password',
        buttons: ['OK']
      });
      alert.present();
      return;
    }
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();

    var self = this;
    this.submitAttempt = true;
    if (this.loginForm.valid) {
      let url = this.config.getApiPath().USER_LOGIN;
      //username: maryam.falahsafari
      //pass: 123456
      let request = {
        "Username": this.loginForm.value.employeeId,
        "User_Password": this.loginForm.value.password
      };
      this.api.callService(url, request).subscribe(function (data) {

        console.log(data);
        self.loader.dismiss();

        //store the user credentials
        self.storage.set('user', username);
        self.storage.set('password', password);


        if (data.rows != undefined) {
          self.homeService.setUser(data.rows[0]);
          self.globalservice.user = self.homeService.dataUser;
          self.globalservice.events.publish('user:login', data.rows[0]);

          self.navCtrl.push(TabsPage);
          //this.logintoAppologic(password, self.globalservice.user);
        }
        else {
          let alert = self.alertCtrl.create({
            title: 'Message',
            subTitle: 'Wrong user crendentials.',
            buttons: ['OK']
          });
          alert.present();
        }
      });
    }

  }

  // logintoAppologic(password, object) {

  //   this.platform.ready().then(
  //     () => {
  //       alert("platform ready");

  //       var alUser = {
  //         'userId': object.Person_Name,   //Replace it with the userId of the logged in user
  //         'password': password,  //Put password here
  //         'authenticationTypeId': 1,
  //         'applicationId': '13cb0db78677b8d972d085c6d83ffb8ef' //replace "applozic-sample-app" with Application Key from Applozic 
  //       };
  //       alert("login to chat : " + JSON.stringify(alUser));
  //       applozic.login(alUser, function (a) {
  //         alert("REsult : " + a);

  //       }, function (d) { alert("d:" + d) });
  //     });
  // }

  loginAutomatic() {


    this.ga.startTrackerWithId('UA-58698748-5')
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.trackView('Auto Login:LoginViewController');

      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));

    var self = this;
    self.storage.get('user').then((val) => {
      console.log('username', val);

      if (val != null) {
        self.storage.get('password').then((val1) => {

          console.log('password', val1);

          let loader = self.loadingCtrl.create({
            content: "Please wait...login"
          });
          loader.present();
          let url = this.config.getApiPath().USER_LOGIN;

          let request = {
            "Username": val,
            "User_Password": val1
          };
          this.api.callService(url, request).subscribe(function (data) {

            console.log(data);
            self.loader.dismiss();

            //store the user credentials
            self.storage.set('user', val);
            self.storage.set('password', val1);

            if (data.rows != undefined) {
              self.homeService.setUser(data.rows[0]);
              self.globalservice.user = self.homeService.dataUser;
              self.globalservice.events.publish('user:login', data.rows[0]);

              self.navCtrl.push(TabsPage);
            }
            else {
              let alert = self.alertCtrl.create({
                title: 'Message',
                subTitle: 'Wrong user crendentials.',
                buttons: ['OK']
              });
              alert.present();
            }
          });
        });

      } else {
        let alert = this.alertCtrl.create({
          title: "Alert",
          message: "Touch ID can be used after one successful manual login",
          buttons: ['OK']
        });
        alert.present();
      }

    });
  }

  goToForgotPassword() {
    this.navCtrl.push(ForgotPasswordPage);
  }

  goToSignUp() {
    this.navCtrl.push(SignUpPage);
  }

  touchIDforiOS() {
    this.touchId.isAvailable()
      .then(
      (res) => {

        console.log('TouchID is available!');
        this.touchId.verifyFingerprint('Scan your fingerprint to login').

          then(
          (res) => {
            console.log('Success', res);
            this.loginAutomatic();
          },
          (err) => {
            console.error('Error', err);

          });
      },
      (err) => {
        console.error('TouchID is not available', err);
        let alert = this.alertCtrl.create({
          title: "Alert",
          message: "TouchID is not available",
          buttons: ['OK']
        });
        alert.present();
      });
  }

  touchIDforAndroid() {
    let alert = this.alertCtrl.create({
      title: "Alert",
      message: "Will come in next version",
      buttons: ['OK']
    });
    alert.present();
  }



  addFingerPrint() {

    if (this.platform.is('ios')) {
      console.log("I'm an iOS device!");
      this.touchIDforiOS();

    } else if (this.platform.is('android')) {
      this.touchIDforAndroid();
    }

    // let alert = this.alertCtrl.create({
    //   title: 'Touch ID for iStaff',
    //   subTitle: 'Scan fingerprint below to login',
    //   buttons: ['Cancel'],
    //   cssClass: 'fingerprint-login'
    // });
    // alert.present();
  }

}
