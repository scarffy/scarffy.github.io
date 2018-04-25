import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SavedLocationPage } from '../savedlocation/savedlocation';


/*
  Generated class for the Projectadd page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-projectadd',
  templateUrl: 'projectadd.html'
})
export class ProjectAddPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectAddPage');
  }

  manageSavedLocation(){
    this.navCtrl.push(SavedLocationPage);
  }

}
