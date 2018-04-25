import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';//'@ionic-native';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';

// Onboarding
import { LoginPage } from '../pages/login/login';
import { ForgotPasswordPage } from '../pages/forgotpassword/forgotpassword';
import { SignUpPage } from '../pages/signup/signup';
import { TermsPage } from '../pages/terms/terms';

// Main
import { HomePage } from '../pages/home/home';
import { TimesheetPage } from '../pages/timesheet/timesheet';
import { MessageInboxPage } from '../pages/messageinbox/messageinbox';
import { MessagesPage } from '../pages/messages/messages';
import { AdminPage } from '../pages/admin/admin';
import { AdminTimesheetPage } from '../pages/admintimesheet/admintimesheet';
import { AdminLeavesPage } from '../pages/adminleaves/adminleaves';

// Personal Details
import { ProfilePage } from '../pages/profile/profile';
import { PasswordPage } from '../pages/password/password';
import { LanguagePage } from '../pages/language/language';
import { ProjectSchedulePage } from '../pages/projectschedule/projectschedule';
import { ProjectAddPage } from '../pages/projectadd/projectadd';
import { ProjectDetailsPage } from '../pages/projectdetails/projectdetails';
import { SavedLocationPage } from '../pages/savedlocation/savedlocation';
import { SchedulePage } from '../pages/schedule/schedule';
import { ScheduleTodayPage } from '../pages/scheduletoday/scheduletoday';
import { ScheduleDetailsPage } from '../pages/scheduledetails/scheduledetails';
import { ScheduleChangePage } from '../pages/schedulechange/schedulechange';
import { TeamPage } from '../pages/team/team';
import { DashboardPage } from '../pages/dashboard/dashboard';

// MRDA Related
import { JourneyPage } from '../pages/journey/journey';
import { JourneyStartPage } from '../pages/journeystart/journeystart';
import { JourneyDelayedPage } from '../pages/journeydelayed/journeydelayed';
import { EmergencyPage } from '../pages/emergency/emergency';
import { EmergencyLogsPage } from '../pages/emergencylogs/emergencylogs';
import { LocatePage } from '../pages/locate/locate';
import { TrainSchedulePage } from '../pages/trainschedule/trainschedule';
import { EvacuationPage } from '../pages/evacuation/evacuation';
import { ScannerPage } from '../pages/scanner/scanner';
import { ScannedHistoryPage } from '../pages/scannedhistory/scannedhistory';
import { ScannedProfilePage } from '../pages/scannedprofile/scannedprofile';

// Services
import { TrainingPage } from '../pages/training/training';
import { LeavesPage } from '../pages/leaves/leaves';
import { ExpensePage } from '../pages/expense/expense';
import { MrbsPage } from '../pages/mrbs/mrbs';
import { ServicePage } from '../pages/service/service';
import { SurveysPage } from '../pages/surveys/surveys';

// Personal Assets
import { AccessCardPage } from '../pages/accesscard/accesscard';
import { MedicalPage } from '../pages/medical/medical';
import { TravelPage } from '../pages/travel/travel';
import { AssetsPage } from '../pages/assets/assets';
import { DocumentsPage } from '../pages/documents/documents';

// General
import { OrganizationPage } from '../pages/organization/organization';
import { LogsPage } from '../pages/logs/logs';
import { ConfigPage } from '../pages/config/config';

// Misc
import { SettingsPage } from '../pages/settings/settings';
import { DetailsPage } from '../pages/details/details';
import { GlobalService } from '../providers/global-service';
import { CsaPage } from '../pages/csa/csa';
import { CsaService } from '../providers/csa.service';
import { Storage } from '@ionic/storage';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { AugmentedReality } from '../pages/augmentedreality'; 
import { AugmentedRealityPage } from '../pages/augmentedreality/augmentedreality';

declare var applozic: any;


@Component({
  templateUrl: 'app.html',
  providers: [CsaService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  //rootPage = LoginPage;
  rootPage: any;
  personName;
  companyName;
  // pages: Array<{ title: string, icon: string, component: any }>;
  pages2: any = [];
  alert;
  // cordova: any;

  constructor(public platform: Platform, public storage: Storage, translate: TranslateService,
    private toastCtrl: ToastController, private alertCtrl: AlertController, private _SplashScreen: SplashScreen,
    private statusBar: StatusBar, public events: Events, public globalService: GlobalService) {

    this.personName = "";
    this.companyName = "";

    this.initializeApp();
    this.pages2 = [
      // {
      //   group: '.',
      //   pages: [
      //     { title: 'Home', icon: 'svg-hom', component: TabsPage },
      //     // { title: 'Messages', icon: 'ios-notifications-outline', component: MessagesInboxPage },
      //     { title: 'Admin Dashboard', icon: 'ios-checkmark-circle-outline', component: AdminPage },
      //   ]
      // },
      {
        group: '.',
        pages: [
          { title: 'My Project List', icon: 'ios-calendar-outline', component: ProjectSchedulePage },
          { title: 'My Schedule', icon: 'ios-calendar-outline', component: SchedulePage },
          { title: 'My Team', icon: 'ios-contacts-outline', component: TeamPage },
          { title: 'My KPI Dashboard', icon: 'svg-report', component: DashboardPage },
        ]
      },
      {
        group: 'MRDA',
        pages: [
          { title: 'Journey', icon: 'ios-pin-outline', component: JourneyPage },
          { title: 'Emergency', icon: 'ios-alert-outline', component: EmergencyPage },
          { title: 'Locate', icon: 'ios-locate-outline', component: LocatePage },
          { title: 'Train Schedule', icon: 'ios-train-outline', component: TrainSchedulePage },
          { title: 'Evacuation Map', icon: 'ios-map-outline', component: EvacuationPage },
          { title: 'Barcode Scanning', icon: 'ios-barcode-outline', component: ScannerPage },
        ]
      },
      {
        group: '.',
        pages: [
          // { title: 'Training', icon: 'svg-courses', component: TrainingPage },
          { title: 'Leave Application', icon: 'ios-calendar-outline', component: LeavesPage },
          { title: 'Expenses', icon: 'svg-expense', component: ExpensePage },
          { title: 'Meeting Room Booking', icon: 'svg-meetingroom', component: MrbsPage },
          { title: 'Service Request', icon: 'svg-services', component: ServicePage },
          { title: 'Surveys', icon: 'ios-list-outline', component: SurveysPage },
        ]
      },
      {
        group: 'PERSONAL',
        pages: [
          { title: 'Access Card', icon: 'svg-accesscard', component: AccessCardPage },
          { title: 'Medical Card', icon: 'svg-medicalcard', component: MedicalPage },
          { title: 'Travel Details', icon: 'ios-plane-outline', component: TravelPage },
          { title: 'Staff Assets', icon: 'svg-mobile', component: AssetsPage },
          { title: 'Documents', icon: 'svg-report', component: DocumentsPage },
        ]
      },
      {
        group: '.',
        pages: [
          { title: 'Organization', icon: 'ios-paper-outline', component: OrganizationPage },
          { title: 'Activity Logs', icon: 'ios-paper-outline', component: LogsPage },
          //{ title: 'Settings', icon: 'svg-settings', component: ConfigPage },
          // { title: 'Email logs', icon: 'ios-settings-outline', component: TabsPage },
          // { title: 'Sync', icon: 'ios-cloud-upload-outline', component: TabsPage },
          // { title: 'Thrash locations', icon: 'ios-trash-outline', component: TabsPage },
          { title: 'Augmented Reality', icon: 'svg-mobile', component: AugmentedRealityPage},
          { title: 'Logout', icon: 'ios-exit-outline', component: LoginPage }
        ]
      }
    ];

    this.storage.get('user').then((val) => {
      console.log('Your username is', val);

      if (val != null) {

        if (val != "")
          this.rootPage = TabsPage;
        else
          this.rootPage = LoginPage;

      } else
        this.rootPage = LoginPage;
    });

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');

    //listen to events
    this.listenToLoginEvents();

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    // console.log("OpenPage function is called : ", page);
    //this.nav.push(page.component);

    if (page.title == "Logout") {
      this.storage.set('user', "");
      this.storage.set('password', "");
      this.nav.setRoot(page.component);
    }
    else
      this.nav.push(page.component);
  }

  goToHome() {

    //this.globalService.fromMenu = true;
    //this.nav.setRoot(this.rootPage);
    // this.nav.popTo(this.rootPage);
    //this.nav.push(this.rootPage);
    // this.nav.popToRoot();
    //this.nav.popAll();
    //this.nav.popTo(TabsPage);
    // this.rootPage = TabsPage;
    this.nav.setRoot(this.rootPage);
  }

  viewProfile() {
    this.nav.setRoot(ProfilePage);
    //this.nav.push(ProfilePage);
  }
  messageInbox() {
    //this.nav.push(MessageInboxPage);
    //this.nav.setRoot(MessageInboxPage);

    this.platform.ready().then(
      () => {
        // alert("platform ready");

        this.storage.get('password').then((val1) => {

          console.log('password', val1);
          var alUser = {
            'userId': this.globalService.user.Person_Name,   //Replace it with the userId of the logged in user
            'password': val1,  //Put password here
            'authenticationTypeId': 1,
            'applicationId': 'asia153b5d60107de7651e3a0dea2e77ce0ce' //replace "applozic-sample-app" with Application Key from Applozic 
          };
          //  alert("login to chat : " + JSON.stringify(alUser));
          applozic.login(alUser, function (a) {
            // alert("REsult : " + a);
            applozic.launchChat(function (b) { }, function (c) { });
          }, function (d) { });
        });

      });
  }
  adminDashboard() {
    this.nav.push(AdminPage);
    //this.nav.setRoot(AdminPage);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this._SplashScreen.hide();

      // this.cordova.plugins.Keyboard.disableScroll(true);

      // if (window.cordova && window.cordova.plugins.Keyboard) {
      //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      //   cordova.plugins.Keyboard.disableScroll(true);
      // }
      // if(window.cordova && window.cordova.plugins.Keyboard) {
      //     window.cordova.plugins.Keyboard.disableScroll(true);
      //   }

      this.platform.registerBackButtonAction(() => {

        if (this.nav.canGoBack()) {
          if (this.nav.root == TabsPage) {
            if (this.alert) {
              this.alert.dismiss();
              this.alert = null;
            } else
              this.showAlert();
          } else
            this.nav.pop();
        } else {
          if (this.alert) {
            this.alert.dismiss();
            this.alert = null;
          } else {
            this.showAlert();
          }
        }
      });
    });
  }

  showAlert() {
    this.alert = this.alertCtrl.create({
      title: 'Exit?',
      message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.alert = null;
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    this.alert.present();
  }

  showToast() {
    let toast = this.toastCtrl.create({
      message: 'Press Again to exit',
      duration: 2000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', (obj) => {
      console.log("The EVENT data is: ", obj.Person_Name);
      this.personName = obj.Person_Name;
      this.companyName = obj.Organization;

    });
  }
}
