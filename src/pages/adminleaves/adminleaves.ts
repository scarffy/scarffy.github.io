import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-adminleaves',
  templateUrl: 'adminleaves.html'
})
export class AdminLeavesPage {

  leaves_admin: string = "leaves";

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminLeavesPage');
  }

}
