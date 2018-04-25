import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { MessagesPage } from '../messages/messages';
import { GlobalService } from '../../providers/global-service';
import { Storage } from '@ionic/storage';
//import { MessageComposePage } from '../messagecompose/messagecompose';

/*
  Generated class for the Messageinbox page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var applozic: any;

@Component({
  selector: 'page-messageinbox',
  templateUrl: 'messageinbox.html'
})



export class MessageInboxPage {

  //applozic: any;
  password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public storage: Storage, public platform: Platform, public globalService: GlobalService) {



    platform.ready().then(
      () => {
        // alert("platform ready");

        this.storage.get('password').then((val1) => {

          console.log('password', val1);
          this.password = val1;
          var alUser = {
            'userId': this.globalService.user.Person_Name,   //Replace it with the userId of the logged in user
            'password': this.password,  //Put password here
            'authenticationTypeId': 1,
            'applicationId': 'asia153b5d60107de7651e3a0dea2e77ce0ce' //replace "applozic-sample-app" with Application Key from Applozic 
          };
          //  alert("login to chat : " + JSON.stringify(alUser));
           applozic.login(alUser, function (a) {
          // alert("REsult : " + a);
          applozic.launchChat(function (b) { alert("b : " + b); }, function (c) { alert("c : " + c); });
        }, function (d) { alert("d:" + d) });
         });

      });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MessageInboxPage');
  }

  messages() {
    this.navCtrl.push(MessagesPage);
  }

  compose() {
    // this.navCtrl.push(MessageComposePage);
    //   const modal = this.modalCtrl.create(MessageComposePage);

    //  modal.present(); 
  }

}
