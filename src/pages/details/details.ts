import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { CsaService } from '../../providers/csa.service';

@Component({
  templateUrl : 'details.html'
})
export class DetailsPage {

    strToken    :     string;
    intCourseId :     number;
    arrmixCourse :    any;
    arrmixContents :  any;

  constructor( public navCtrl: NavController, public params:NavParams, public loadingCtrl: LoadingController, private csaService: CsaService ) {
    this.arrmixCourse = params.get( 'arrmixCourse' );
    this.intCourseId  = params.get( 'intCourseId' );
    this.strToken     = params.get( 'strToken' );  
  }

  ngOnInit() {
    this.handleGetCourseById();
  }

  handleGetCourseById() {

	var objParser = new DOMParser;
	var objDom = objParser.parseFromString(
		this.arrmixCourse.summary,
		'text/html');
	var strDecodedSummary = objDom.body.textContent;
	this.arrmixCourse.summary = strDecodedSummary;

	let loading = this.loadingCtrl.create( {
		content: 'Loading...'
	} );
	loading.present();

    // console.log(this.arrmixCourse);
    this.csaService.handleGetCourseById( this.strToken, this.intCourseId ).subscribe( objResponse => {
		this.arrmixContents = objResponse;
	  loading.dismiss();
      } );
  }

}
