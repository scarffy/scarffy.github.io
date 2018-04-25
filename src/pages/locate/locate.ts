import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Locate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-locate',
  templateUrl: 'locate.html'
})
export class LocatePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  mapview_segment: string = "map";

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocatePage');
  }

}
