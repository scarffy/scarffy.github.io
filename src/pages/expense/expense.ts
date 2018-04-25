import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-expense',
  templateUrl: 'expense.html'
})
export class ExpensePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  expense_segment: string = "expense";


  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpensePage');
  }


}
