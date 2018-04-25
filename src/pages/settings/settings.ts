import { Component, NgZone } from '@angular/core';
import {
  AlertController,
  ModalController,
  ViewController,
  LoadingController
} from "ionic-angular";

import { BGService } from '../../lib/BGService';
import { SettingsService } from '../../lib/SettingsService';

const TRACKING_MODE_OPTIONS = [
  'location',
  'geofence'
];
const LOG_LEVEL_OPTIONS = ['OFF', 'ERROR', 'WARNING', 'INFO', 'DEBUG', 'VERBOSE'];

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {
  isLoaded: boolean;
  loader: any;
  storage: any;
  alert: any;
  state: any;
  basicTab: any;
  listTab: any;
  selectedSegment: string;
  trackingModeOptions: any;
  desiredAccuracyOptions: any;
  distanceFilterOptions: any;
  autoSyncThresholdOptions: any;
  geofenceProximityRadiusOptions: any;
  heartbeatIntervalOptions: any;
  logLevelOptions: any;
  logMaxDaysOptions: any;
  settings: any;
  //geofenceOptions: any;
  //mapOptions: any;
  email: string;
  isSyncing: boolean;
  isEmailingLog: boolean;
  isAddingGeofences: boolean;
  isResettingOdometer: boolean;

  constructor(
    // // private bgService: BGService,
    // // private settingsService: SettingsService,
    // // private alertCtrl: AlertController,
    // // private viewCtrl: ViewController,
    // // private modalCtrl: ModalController,
    // // private loadingCtrl: LoadingController,
    // // private zone: NgZone) {
  ) {
    // this.isLoaded = false;
    // this.loader = this.loadingCtrl.create({
    //   content: "Loading..."
    // });

    // // We do a BackgroundGeolocation#getState each time Settings screen is shown.
    // this.trackingModeOptions = TRACKING_MODE_OPTIONS;
    // this.logLevelOptions = LOG_LEVEL_OPTIONS;

    // this.isSyncing = false;
    // this.isAddingGeofences = false;
    // this.isResettingOdometer = false;

    // let settings = this.bgService.getSettings();
    // this.state = {};
    // this.bgService.getState((state) => {
    //   settings.forEach((setting) => {
    //     this.state[setting.name] = state[setting.name];
    //   });
    //   this.state.trackingMode = (state.trackingMode === 1 || state.trackingMode === 'location') ? 'location' : 'geofence';
    //   this.state.logLevel = this.decodeLogLevel(state.logLevel);
    //   if (this.state.triggerActivities) {
    //     this.state.triggerActivities = this.decodeTriggerActivities(this.state.triggerActivities);
    //   }
    //   // Hide the Loading...
    //   this.isLoaded = true;
    //   this.loader.dismiss();
    // });
  }

  ionViewDidLoad() {
    // Load email address for email log
    // let storage = (<any>window).localStorage;
    // var email = storage.getItem('settings:email');
    // if (email) {
    //   this.email = email;
    // }
  }
  ionViewWillEnter() {
    // if (!this.isLoaded) {
    //   this.loader.present();
    // }
  }

  onClickClose() {
    // this.bgService.playSound("CLOSE");
    // this.viewCtrl.dismiss();
  }

  onChangeValue(name) {
    // var value = this.state[name];
    // console.info('onChangeValue: ', name, value);

    // if (typeof (value) !== 'undefined') {
    //   switch (name) {
    //     case 'logLevel':
    //       value = this.encodeLogLevel(value);
    //       break;
    //     case 'trackingMode':
    //       this.setTrackingMode(value);
    //       break;
    //     case 'geofenceProximityRadius':
    //       this.bgService.playSound('ADD_GEOFENCE');
    //       break;
    //     case 'triggerActivities':
    //       value = this.encodeTriggerActivities(value);
    //       break;
    //     case 'hideMarkers':
    //       break;
    //     case 'hidePolyline':
    //       break;
    //     case 'showGeofenceHits':
    //       break;
    //   }
    //   this.bgService.set(name, value);
    // }
  }

  onChangeSetting(name) {
    // var value = this.settings[name];
    // this.settingsService.set(name, value);
  }

  setTrackingMode(mode) {
    // this.bgService.start(mode);
  }

  onClickResetOdometer() {
    // this.bgService.playSound('BUTTON_CLICK');
    // var bgGeo = this.bgService.getPlugin();
    // this.isResettingOdometer = true;

    // function onComplete() {
    //   this.zone.run(() => { this.isResettingOdometer = false; });
    // }
    // bgGeo.resetOdometer((location) => {
    //   onComplete.call(this);
    // }, (error) => {
    //   onComplete.call(this);
    //   this.notify('Reset odometer error', error);
    // });
  }

  onUpdateUrl() {
    // this.onChangeValue('url');
  }

  onClickSync() {
    // this.bgService.playSound('BUTTON_CLICK');
    // this.isSyncing = true;

    // var bgGeo = this.bgService.getPlugin();

    // function onComplete() {
    //   this.zone.run(() => { this.isSyncing = false; });
    // };

    // bgGeo.sync((rs, taskId) => {
    //   this.bgService.playSound('MESSAGE_SENT');
    //   onComplete.call(this);
    //   bgGeo.finish(taskId);
    // }, (error) => {
    //   onComplete.call(this);
    //   this.bgService.playSound('ERROR');
    //   this.notify('Sync error', error);
    // });
  }

  onUpdateEmail() {
    // this.bgService.playSound('BUTTON_CLICK');
    // let storage = (<any>window).localStorage;
    // storage.setItem('settings:email', this.email);
  }

  onClickEmailLogs() {
    // this.bgService.playSound('BUTTON_CLICK');

    // if (!this.email) {
    //   this.notify('Email logs', 'Please enter an email address');
    //   return;
    // }

    // this.isEmailingLog = true;

    // function onComplete() {
    //   this.zone.run(() => { this.isEmailingLog = false; });
    // }

    // this.bgService.getPlugin().emailLog(this.email, () => {
    //   onComplete.call(this);
    // }, (error) => {
    //   onComplete.call(this);
    //   this.notify('Email error', error);
    // });
  }

  onClickRemoveGeofences() {
    // this.bgService.playSound('BUTTON_CLICK');

    // this.bgService.getPlugin().removeGeofences(() => {
    //   this.bgService.playSound('MESSAGE_SENT');
    // }, (error) => {
    //   this.bgService.playSound('ERROR');
    //   this.notify('Remove geofences error', error);
    // });
  }

  onClickLoadGeofences() {
    // this.bgService.playSound('BUTTON_CLICK');
    // this.isAddingGeofences = true;

    // var bgGeo = this.bgService.getPlugin();
    // var data = this.bgService.getCityDriveData();
    // var geofences = [], latlng;

    // for (var n = 0, len = data.length; n < len; n++) {
    //   latlng = data[n];
    //   geofences.push({
    //     identifier: 'city_drive_' + (n + 1),
    //     latitude: parseFloat(latlng.lat),
    //     longitude: parseFloat(latlng.lng),
    //     radius: this.settingsService.state.geofenceRadius,
    //     notifyOnEntry: this.settingsService.state.geofenceNotifyOnEntry,
    //     notifyOnExit: this.settingsService.state.geofenceNotifyOnExit,
    //     notifyOnDwell: this.settingsService.state.geofenceNotifyOnDwell,
    //     loiteringDelay: this.settingsService.state.geofenceLoiteringDelay,
    //     extras: { 'geofence_extra': 'foo' }
    //   });
  }

  onComplete() {
    //   this.zone.run(() => { this.isAddingGeofences = false; })
    // };

    // bgGeo.addGeofences(geofences, () => {
    //   onComplete.call(this);
    //   this.bgService.playSound('ADD_GEOFENCE');
    // }, (error) => {
    //   onComplete.call(this);
    //   this.bgService.playSound('ERROR');
    //   this.notify('Add geofences error', error);
    // });
  }

  notify(title, message) {
    // this.alertCtrl.create({
    //   title: title,
    //   subTitle: message,
    //   buttons: ['Dismiss']
    // }).present();
  }

  decodeLogLevel(value) {
    // switch (value) {
    //   case 0:
    //     value = 'OFF';
    //     break;
    //   case 1:
    //     value = 'ERROR';
    //     break;
    //   case 2:
    //     value = 'WARNING';
    //     break;
    //   case 3:
    //     value = 'INFO';
    //     break;
    //   case 4:
    //     value = 'DEBUG';
    //     break;
    //   case 5:
    //     value = 'VERBOSE';
    //     break;
    // }
    // return value;
  }
  encodeLogLevel(value) {
    // switch (value) {
    //   case 'OFF':
    //     value = 0;
    //     break;
    //   case 'ERROR':
    //     value = 1;
    //     break;
    //   case 'WARNING':
    //     value = 2;
    //     break;
    //   case 'INFO':
    //     value = 3;
    //     break;
    //   case 'DEBUG':
    //     value = 4;
    //     break;
    //   case 'VERBOSE':
    //     value = 5;
    // }
    // return value;
  }
  decodeTriggerActivities(value) {
    // return value.split(',');
  }
  encodeTriggerActivities(value) {
    // return value.join(',');
  }

}
