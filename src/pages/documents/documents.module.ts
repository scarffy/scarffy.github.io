import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocumentsPage } from './documents';

@NgModule({
  declarations: [
    DocumentsPage,
  ],
  imports: [
    IonicPageModule.forChild(DocumentsPage),
  ],
  exports: [
    DocumentsPage
  ]
})
export class DocumentsPageModule {}
