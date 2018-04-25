import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurveysPage } from './surveys';

@NgModule({
  declarations: [
    SurveysPage,
  ],
  imports: [
    IonicPageModule.forChild(SurveysPage),
  ],
  exports: [
    SurveysPage
  ]
})
export class SurveysPageModule {}
