import { NgModule, ErrorHandler } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ChartsModule } from 'ng2-charts';
import '../../node_modules/chart.js/dist/Chart.bundle.min.js';
import { ParallaxHeader } from '../components/parallax-header/parallax-header';

//Onboarding
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
import { SampleModalPage } from '../pages/modal/modal';
import { TimeSheetAddModalPage } from '../pages/timesheetadd/timesheetadd';
import { WeeklyPage } from '../pages/weekly/weekly';
import { CsaPage } from '../pages/csa/csa';

// Geometry
import { LoadGeometryPage } from '../pages/loadgeometry/loadgeometry';
import { GeofencePage } from '../pages/geofence/geofence';

import { FormatTime } from '../pipes/format-time';
import { FormatDate } from '../pipes/format-date';
import { FormatDays } from '../pipes/format-day';
import { FormatMonth } from '../pipes/format-month';
import { ShiftTime } from '../pipes/shift-time';

import { BGService } from '../lib/BGService';
import { SettingsService } from '../lib/SettingsService';
import { GlobalService } from '../providers/global-service';
import { LocationService } from '../providers/location-service';

// import { IonicStorageModule } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage';
import { TouchID } from '@ionic-native/touch-id';
import { BackgroundMode } from '@ionic-native/background-mode';
//import { CalendarModule } from 'angular-calendar';

import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Geofence } from 'ionic-native';
import { AugmentedRealityPage } from '../pages/augmentedreality/augmentedreality';

@NgModule({
  declarations: [
    //All components
    MyApp,

    LoginPage,
    ForgotPasswordPage,
    SignUpPage,
    TermsPage,

    HomePage,
    TimesheetPage,
    MessageInboxPage,
    MessagesPage,
    AdminPage,
    AdminTimesheetPage,
    AdminLeavesPage,

    ProfilePage,
    PasswordPage,
    LanguagePage,
    ProjectSchedulePage,
    ProjectAddPage,
    ProjectDetailsPage,
    SavedLocationPage,
    SchedulePage,
    ScheduleTodayPage,
    ScheduleDetailsPage,
    ScheduleChangePage,
    TeamPage,
    DashboardPage,

    JourneyPage,
    JourneyStartPage,
    JourneyDelayedPage,
    EmergencyPage,
    EmergencyLogsPage,
    LocatePage,
    TrainSchedulePage,
    EvacuationPage,
    ScannerPage,
    ScannedHistoryPage,
    ScannedProfilePage,

    TrainingPage,
    LeavesPage,
    ExpensePage,
    MrbsPage,
    ServicePage,
    SurveysPage,

    AccessCardPage,
    MedicalPage,
    TravelPage,
    AssetsPage,
    DocumentsPage,

    OrganizationPage,
    LogsPage,
    ConfigPage,

    SettingsPage,
    TabsPage,
    SampleModalPage,
    WeeklyPage,
    CsaPage,
    DetailsPage,
    LoadGeometryPage,
    GeofencePage,
    TimeSheetAddModalPage,
    AugmentedRealityPage,

    ParallaxHeader,

    //All pipes, directives
    FormatTime,
    FormatDate,
    FormatDays,
    FormatMonth,
    ShiftTime

  ],

  // imports: [
  //   IonicModule.forRoot(MyApp),
  //   //CalendarModule.forRoot()
  imports: [

    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
      deps: [Http]
    }),

    ChartsModule,

    IonicModule.forRoot(MyApp, {
      mode: 'ios',
      backButtonText: ''
    }),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['sqlite', 'indexeddb', 'websql']//['indexeddb', 'sqlite', 'websql']
    })
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    ForgotPasswordPage,
    SignUpPage,
    TermsPage,
    HomePage,
    JourneyPage,
    JourneyStartPage,
    JourneyDelayedPage,
    SchedulePage,
    ScheduleTodayPage,
    ScheduleDetailsPage,
    ScheduleChangePage,
    ProjectSchedulePage,
    ProjectAddPage,
    ProjectDetailsPage,
    SavedLocationPage,
    TimesheetPage,
    EmergencyPage,
    EmergencyLogsPage,
    LocatePage,
    ScannerPage,
    ScannedHistoryPage,
    ScannedProfilePage,
    DashboardPage,
    MessageInboxPage,
    MessagesPage,
    //MessageComposePage,
    ProfilePage,
    PasswordPage,
    LanguagePage,
    LogsPage,
    SettingsPage,
    AdminPage,
    AdminTimesheetPage,
    AdminLeavesPage,
    LeavesPage,
    ExpensePage,
    TrainingPage,
    TrainSchedulePage,
    EvacuationPage,
    ServicePage,
    AssetsPage,
    SampleModalPage,
    WeeklyPage,
    CsaPage,
    DetailsPage,
    TimeSheetAddModalPage,
    TabsPage,
    LoadGeometryPage,
    GeofencePage,
    AugmentedRealityPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BGService,
    SettingsService,
    LocationService,
    GlobalService,
    StatusBar,
    SplashScreen,
    BackgroundMode,
    TouchID,
    GoogleAnalytics,
    Storage]
})
export class AppModule { }
