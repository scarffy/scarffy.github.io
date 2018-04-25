import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicalPage } from './medical';

@NgModule({
  declarations: [
    MedicalPage,
  ],
  imports: [
    IonicPageModule.forChild(MedicalPage),
  ],
  exports: [
    MedicalPage
  ]
})
export class MedicalPageModule {}
