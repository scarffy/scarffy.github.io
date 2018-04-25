import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { TimesheetPage } from '../timesheet/timesheet';
import { TrainingPage } from '../training/training';
import { CsaPage } from '../csa/csa';
import { ExpensePage } from '../expense/expense';
import { LocatePage } from '../locate/locate';
import { MessageInboxPage } from '../messageinbox/messageinbox';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = TimesheetPage;
  //tab3Root: any = CsaPage; //TrainingPage;
  // tab3Root: any = ExpensePage;
  tab3Root: any = ExpensePage;
  //tab4Root: any = MessageInboxPage;

  constructor() {
  }

}
