import {
  Component,
  ViewChild,
  ElementRef,
  NgZone
} from '@angular/core';

import {
  NavController,
  Platform,
  ModalController,
  AlertController,
  LoadingController,
  ToastController
} from 'ionic-angular';

import {SettingsPage} from '../settings/settings';
import {GeofencePage} from '../geofence/geofence';
import {BGService} from '../../lib/BGService';
import {SettingsService} from '../../lib/SettingsService';
import {LongPress} from '../../lib/LongPress';
import {GlobalService} from '../../providers/global-service';

declare var google;

// Colors
const COLORS = {
  gold: '#fedd1e',
  white: "#fff",
  blue: "#2677FF",
  light_blue: "#3366cc",
  polyline_color: "#00B3FD",
  green: "#16BE42",
  dark_purple: "#2A0A73",
  grey: "#404040",
  red: "#FE381E",
  dark_red: "#A71300",
  black: "#000"
}
// Icons
const ICON_MAP = {
  activity_unknown: "help-circle",
  activity_still: "body",
  activity_shaking: "walk",
  activity_on_foot: "walk",
  activity_walking: "walk",
  activity_running: "walk",
  activity_on_bicycle: "bicycle",
  activity_in_vehicle: "car",
  pace_true: "pause",
  pace_false: "play",
  provider_network: "wifi",
  provider_gps: "locate",
  provider_disabled: "warning"
};

// Messages
const MESSAGE = {
  reset_odometer_success: 'Reset odometer success',
  reset_odometer_failure: 'Failed to reset odometer: {result}',
  sync_success: 'Sync success ({result} records)',
  sync_failure: 'Sync error: {result}',
  destroy_locations_success: 'Destroy locations success ({result} records)',
  destroy_locations_failure: 'Destroy locations error: {result}',
  removing_markers: 'Removing markers...',
  rendering_markers: 'Rendering markers...'
}

@Component({
  selector: 'page-loadgeometry',
  templateUrl: 'loadgeometry.html'
})

export class LoadGeometryPage {

  @ViewChild('map') mapElement: ElementRef;

  /**
  * @property {google.Map} Reference to Google Map instance
  */
  map: any;
  /**
  * @property {Object} state
  */
  state: any;
  /**
  * @property {BackgroundGeolocation} Reference to actual BackgroundGeolocation plugin
  */
  bgGeo: any;
  /**
  * @property {Object} lastLocation
  */
  lastLocation: any;
  /**
  * @property {Object} map of icons
  */
  iconMap: any;

  currentLocationMarker: any;
  locationAccuracyCircle:  any;
  geofenceHitMarkers: any;
  polyline: any;
  stationaryRadiusCircle: any;
  geofenceCursor: any;
  locationMarkers: any;
  geofenceMarkers: any;
  lastDirectionChangeLocation: any;

  // Geofence Hits
  geofenceHits: any;

  // FAB Menu
  isMainMenuOpen: boolean;
  isSyncing: boolean;
  isDestroyingLocations: boolean;
  isResettingOdometer: boolean;
  isMapMenuOpen: boolean;

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private bgService:BGService,
    private settingsService:SettingsService,
    private zone:NgZone,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalController: ModalController,
    public globalservice: GlobalService) {

    this.bgService.on('change', this.onBackgroundGeolocationSettingsChanged.bind(this));    
    this.bgService.on('start', this.onBackgroundGeolocationStarted.bind(this));

    this.settingsService.on('change', this.onSettingsChanged.bind(this));

    this.isMainMenuOpen = false;
    this.isMapMenuOpen = false;
    this.isSyncing = false;
    this.isResettingOdometer = false;

    this.iconMap = ICON_MAP;

    this.geofenceHits = [];

    // Initial state
    this.state = {
      enabled: false,
      isMoving: false,
      geofenceProximityRadius: 1000,
      trackingMode: 'location',
      paceIcon: this.iconMap['pace_false'],
      isChangingPace: false,
      activityIcon: this.iconMap['activity_unknown'],
      odometer: 0,
      provider: {
        gps: true,
        network: true,
        enabled: true,
        status: -1
      }
    }
  }

  ionViewDidLoad(){
    this.platform.ready().then(() => {
      this.configureMap();
      this.configureBackgroundGeolocation();
    });
  }

  /**
  * Configure Google Maps
  */
  configureMap(){
    this.locationMarkers = [];
    this.geofenceMarkers = [];
    this.geofenceHitMarkers = [];

    let latLng = new google.maps.LatLng(-34.9290, 138.6010);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      mapTypeControl: false,
      panControl: false,
      rotateControl: false,
      scaleControl: false,
      streetViewControl: false,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    // Create LongPress event-handler
    new LongPress(this.map, 500);

    // Tap&hold detected.  Play a sound a draw a circular cursor.
    google.maps.event.addListener(this.map, 'longpresshold', this.onLongPressStart.bind(this));
    // Longpress cancelled.  Get rid of the circle cursor.
    google.maps.event.addListener(this.map, 'longpresscancel', this.onLongPressCancel.bind(this));
    // Longpress initiated, add the geofence
    google.maps.event.addListener(this.map, 'longpress', this.onLongPress.bind(this));

    // Blue current location marker
    this.currentLocationMarker = new google.maps.Marker({
      zIndex: 10,
      map: this.map,
      title: 'Current Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: COLORS.blue,
        fillOpacity: 1,
        strokeColor: COLORS.white,
        strokeOpacity: 1,
        strokeWeight: 6
      }
    });
    // Light blue location accuracy circle
    this.locationAccuracyCircle = new google.maps.Circle({
      map: this.map,
      zIndex: 9,
      fillColor: COLORS.light_blue,
      fillOpacity: 0.4,
      strokeOpacity: 0
    });
    // Stationary Geofence
    this.stationaryRadiusCircle = new google.maps.Circle({
      zIndex: 0,
      fillColor: COLORS.red,
      strokeColor: COLORS.red,
      strokeWeight: 2,
      fillOpacity: 0.3,
      strokeOpacity: 0.7,
      map: this.map
    });
    // Route polyline
    this.polyline = new google.maps.Polyline({
      map: (this.settingsService.state.mapHidePolyline) ? null : this.map,
      zIndex: 1,
      geodesic: true,
      strokeColor: COLORS.polyline_color,
      strokeOpacity: 0.7,
      strokeWeight: 6
    });
    // Popup geofence cursor for adding geofences via LongPress
    this.geofenceCursor = new google.maps.Marker({
      clickable: false,
      zIndex: 100,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 100,
        fillColor: COLORS.green,
        fillOpacity: 0.2,
        strokeColor: COLORS.green,
        strokeWeight: 2,
        strokeOpacity: 0.5
      }
    });
  }

  /**
  * Configure BackgroundGeolocation plugin
  */
  configureBackgroundGeolocation() {
    var bgGeo = this.bgService.getPlugin();

    // Listen to events
    bgGeo.on('location', this.onLocation.bind(this));
    bgGeo.on('motionchange', this.onMotionChange.bind(this));
    bgGeo.on('geofence', this.onGeofence.bind(this));
    bgGeo.on('activitychange', this.onActivityChange.bind(this));
    bgGeo.on('providerchange', this.onProviderChange.bind(this));
    bgGeo.on('geofenceschange', this.onGeofencesChange.bind(this))
    bgGeo.on('http', this.onHttpSuccess.bind(this), this.onHttpFailure.bind(this));

    // Fetch current settings from BGService
    this.bgService.getState((config) => {
      // Configure
      config.url = 'http://45.32.107.244:8081/locations';
      console.log("sync person name.."+ this.globalservice.user.Person_Name);
      config.extras = {
        user_id: this.globalservice.user.Person_Name,//"user_id",
        staff_activity: "working"
      };
      bgGeo.configure(config, (state) => {
        this.zone.run(() => {
          this.state.enabled = config.enabled;
          this.state.isMoving = config.isMoving;
          this.state.geofenceProximityRadius = config.geofenceProximityRadius;
          this.state.trackingMode = (state.trackingMode === 1 || state.trackingMode === 'location') ? 'location' : 'geofence';
          this.state.paceIcon = this.iconMap['pace_' + config.isMoving];
        });
        console.log('[js] Confgure success');
      });
    });
  }

  ////
  // UI event handlers
  //
  onClickMainMenu() {
    this.isMainMenuOpen = !this.isMainMenuOpen;
    if (this.isMainMenuOpen) {
      this.bgService.playSound('OPEN');
    } else {
      this.bgService.playSound('CLOSE');
    }
  }
  onClickSettings() {
    //this.navCtrl.push(SettingsPage);
    this.bgService.playSound('OPEN');
    let modal = this.modalController.create(SettingsPage, {});
    modal.present();
  }

  onClickSync() {
    this.bgService.playSound('BUTTON_CLICK');

    function onComplete(message, result) {
      this.toast(message, result);
      this.zone.run(() => { this.isSyncing = false; })
    };

    let bgGeo = this.bgService.getPlugin();
    bgGeo.getCount((count) => {
      let message = 'Sync ' + count + ' location' + ((count>1) ? 's' : '') + '?';
      this.confirm('Confirm Sync', message, () => {
        this.isSyncing = true;
        bgGeo.sync((rs, taskId) => {
          this.bgService.playSound('MESSAGE_SENT');
          bgGeo.finish(taskId);
          onComplete.call(this, MESSAGE.sync_success, count);
        }, function(error) {
          onComplete.call(this, MESSAGE.sync_failure, error);
        });
      });
    });
  }

  onClickDestroyLocations() {
    this.bgService.playSound('BUTTON_CLICK');

    function onComplete(message, result) {
      this.toast(message, result);
      this.zone.run(() => { this.isDestroyingLocations = false; })
    };

    let bgGeo = this.bgService.getPlugin();
    bgGeo.getCount((count) => {
      if (!count) {
        this.toast('Locations database is empty');
        return;
      }
      // Confirm destroy
      let message = 'Destroy ' + count + ' location' + ((count>1) ? 's' : '') + '?';
      this.confirm('Confirm Delete', message, () => {
        // Good to go...
        this.isDestroyingLocations = true;
        bgGeo.destroyLocations((res) => {
          onComplete.call(this, MESSAGE.destroy_locations_success, count);
        }, function(error) {
          onComplete.call(this, MESSAGE.destroy_locations_failure, error);
        });
      });
    });
  }

  onClickEmailLogs() {
    this.bgService.playSound('BUTTON_CLICK');
    let storage = (<any>window).localStorage;
    var email = storage.getItem('settings:email');
    if (!email) {
      this.toast('Please enter an email address in the Settings screen');
      return;
    }
    var bgGeo = this.bgService.getPlugin();
    bgGeo.emailLog(email);
  }

  onClickResetOdometer() {
    this.state.odometer = '0.0';
    this.bgService.playSound('BUTTON_CLICK');
    let bgGeo = this.bgService.getPlugin();
    this.isResettingOdometer = true;

    function onComplete(message, result?) {
      this.toast(message, result);
      this.zone.run(() => { this.isResettingOdometer = false; })
    };

    bgGeo.resetOdometer((location) => {
      onComplete.call(this, MESSAGE.reset_odometer_success);
    }, (error) => {
      onComplete.call(this, MESSAGE.reset_odometer_failure, error);
    });
  }

  onClickMapMenu() {
    this.isMapMenuOpen = !this.isMapMenuOpen;
    let soundId = (this.isMapMenuOpen) ? 'OPEN' : 'CLOSE';
    this.bgService.playSound(soundId);
  }

  onSelectMapOption(name) {
     this.bgService.playSound('BUTTON_CLICK');
     this.settingsService.state[name] = !this.settingsService.state[name];
     this.settingsService.set(name, this.settingsService.state[name]);
  }

  onToggleEnabled() {
    this.bgService.playSound('BUTTON_CLICK');
    let bgGeo = this.bgService.getPlugin();
    if (this.state.enabled) {
      if (this.state.trackingMode === 'location') {
        bgGeo.start();
      } else {
        bgGeo.startGeofences();
      }
    } else {
      this.state.paceIcon = this.iconMap['pace_false'];
      this.state.isMoving = false;
      bgGeo.stop();
      this.clearMarkers();
    }
  }

  onClickGetCurrentPosition() {
    this.bgService.playSound('BUTTON_CLICK');
    let bgGeo = this.bgService.getPlugin();
    bgGeo.getCurrentPosition((location, taskId) => {
      console.log('[js] getCurrentPosition: ', location);
      bgGeo.finish(taskId);
    }, function(error) {
      console.warn('[js] getCurrentPosition FAILURE: ', error);
      alert('Location error: ' + error);
    });
  }

  onClickChangePace() {
    if (!this.state.enabled) {
      return;
    }
    function onComplete() {
      this.zone.run(() => { this.isChangingPace = false; })
    }
    this.bgService.playSound('BUTTON_CLICK');
    let bgGeo = this.bgService.getPlugin();

    this.state.isChangingPace = true;
    this.state.isMoving = !this.state.isMoving;
    this.state.paceIcon = this.iconMap['pace_' + this.state.isMoving];
    bgGeo.changePace(this.state.isMoving, () => {
      onComplete.call(this);
    }, (error) => {
      onComplete.call(this);
      alert('Failed to changePace');
    });
  }

  ////
  // Map events
  //
  onLongPressStart(e) {
    this.bgService.playSound('LONG_PRESS_ACTIVATE');
    this.geofenceCursor.setPosition(e.latLng);
    this.geofenceCursor.setMap(this.map);
  }

  onLongPressCancel(e) {
    this.bgService.playSound('LONG_PRESS_CANCEL');
    this.geofenceCursor.setMap(null);
  }

  onLongPress(e) {
    var latlng = e.latLng;
    this.geofenceCursor.setMap(null);
    let modal = this.modalController.create(GeofencePage, {
      latitude: latlng.lat(),
      longitude: latlng.lng()
    });
    modal.present();
  }

  ////
  // SettingsService listeners
  //
  onSettingsChanged(name:string, value:any) {
    let map = null;

    switch(name) {
      case 'mapHideMarkers':
        var loader = this.loadingCtrl.create({
          content: (value) ? MESSAGE.removing_markers : MESSAGE.rendering_markers
        });
        loader.present();
        map = (value === true) ? null : this.map;
        this.locationMarkers.forEach((marker) => {
          marker.setMap(map);
        });
        loader.dismiss();
        this.toast((value) ? 'Hide location markers' : 'Show location markers', null, 1000);
        break;
      case 'mapHidePolyline':
        map = (value === true) ? null : this.map;
        this.polyline.setMap(map);
        this.toast((value) ? 'Hide  polyline' : 'Show polyline', null, 1000);
        break;
      case 'mapShowGeofenceHits':
        map = (value === true) ? this.map : null;
        this.geofenceHitMarkers.forEach((marker) => {
          marker.setMap(map);
        });
        this.toast((value) ? 'Show geofence hits' : 'Hide geofence hits', null, 1000);
        break;
    }
  }

  ////
  // BgService listeners
  //
  onBackgroundGeolocationSettingsChanged(name:string, value:any) {
    console.log('Home settingschanged: ', name, value);
    switch(name) {
      case 'geofenceProximityRadius':
        this.state.geofenceProximityRadius = value;
        this.stationaryRadiusCircle.setRadius(value/2);
        break;
    }
  }

  onBackgroundGeolocationStarted(trackingMode:string, state:any) {
    this.clearMarkers();

    //this.stationaryRadiusCircle.setRadius(value/2);
    this.zone.run(() => {
      this.state.enabled = state.enabled;
      this.state.isMoving = state.isMoving;
    });
  }
  ////
  // Background Geolocation event-listeners
  //
  onLocation(location:any, taskId:any) {
    console.log('[js] location: ', location);
    let bgGeo = this.bgService.getPlugin();
    this.setCenter(location);
    if (!location.sample) {
      this.zone.run(() => {
        // Convert meters -> km -> round nearest hundredth -> fix float xxx.x
        this.state.odometer = parseFloat((Math.round((location.odometer/1000)*10)/10).toString()).toFixed(1);
      });
    }
    bgGeo.finish(taskId);
  }

  onMotionChange(isMoving:boolean, location:any, taskId:any) {
    console.log('[js] motionchange: ', isMoving, location);
    let bgGeo = this.bgService.getPlugin();
    if (isMoving) {
      this.hideStationaryCircle();
    } else {
      this.showStationaryCircle(location);
    }
    this.zone.run(() => {
      this.state.paceIcon = this.iconMap['pace_' + isMoving];
      this.state.isChangingPace = false;
      this.state.isMoving = isMoving;
    });
    bgGeo.finish(taskId);
  }

  onActivityChange(activityName:string) {
    this.zone.run(() => {
      this.state.activityName = activityName;
      this.state.activityIcon = this.iconMap['activity_' + activityName];
    });
    console.log('[js] activitychange: ', activityName);
  }

  onProviderChange(provider:any) {
    this.zone.run(() => { this.state.provider = provider; });
    console.log('[js] providerchange: ', provider);
  }

  onGeofencesChange(event:any) {
    console.log('[js] geofenceschange: ', event);

    // Filter out all "off" geofences.
    this.geofenceMarkers = this.geofenceMarkers.filter((circle) => {
      if (event.off.indexOf(circle.identifier) < 0) {
        return true;
      } else {
        circle.setMap(null);
        return false;
      }
    });

    // Add new "on" geofences.
    event.on.forEach((geofence) => {
      var circle = this.geofenceMarkers.find((marker) => { return marker.identifier === geofence.identifier;});
      // Already added?
      if (circle) { return; }
      this.geofenceMarkers.push(this.buildGeofenceMarker(geofence));
    });

  }

  onGeofence(event:any) {
    console.log('[js] geofence: ', event);

    var circle = this.geofenceMarkers.find((marker) => {
      return marker.identifier === event.identifier;
    });

    if (!circle) { return; }
    var map = (this.settingsService.state.mapShowGeofenceHits) ? this.map : null;

    let location = event.location;
    let geofence = this.geofenceHits[event.identifier];
    if (!geofence) {
      geofence = {
        circle: new google.maps.Circle({
          zIndex: 100,
          fillOpacity: 0,
          strokeColor: COLORS.black,
          strokeWeight: 1,
          strokeOpacity: 1,
          radius: circle.getRadius()+1,
          center: circle.getCenter(),
          map: map
        }),
        events: []
      };
      this.geofenceHits[event.identifier] = geofence;
      this.geofenceHitMarkers.push(geofence.circle);
    }

    var color, heading;
    if (event.action === 'ENTER') {
      color = COLORS.red;
    } else {
      color = COLORS.red;
    }

    let circleLatLng = geofence.circle.getCenter();
    let locationLatLng = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
    let distance = google.maps.geometry.spherical.computeDistanceBetween (circleLatLng, locationLatLng);

    // Push event
    geofence.events.push({
      action: event.action,
      location: event.location,
      distance: distance
    });

    heading = google.maps.geometry.spherical.computeHeading(circleLatLng, locationLatLng);
    let circleEdgeLatLng = google.maps.geometry.spherical.computeOffset(circleLatLng, geofence.circle.getRadius(), heading);

    geofence.events.push({
      location: event.location,
      action: event.action,
      distance: distance
    });

    var geofenceEdgeMarker = new google.maps.Marker({
      zIndex: 1000,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        fillColor: (event.action === 'ENTER') ? COLORS.green : COLORS.red,
        fillOpacity: 0.7,
        strokeColor: COLORS.black,
        strokeWeight: 1,
        strokeOpacity: 1
      },
      map: map,
      position: circleEdgeLatLng
    });
    this.geofenceHitMarkers.push(geofenceEdgeMarker);

    var locationMarker = this.buildLocationMarker(location, {
      showHeading: true
    });
    locationMarker.setMap(map);
    this.geofenceHitMarkers.push(locationMarker);

    var polyline = new google.maps.Polyline({
      map: map,
      zIndex: 1000,
      geodesic: true,
      strokeColor: COLORS.black,
      strokeOpacity: 1,
      strokeWeight: 1,
      path: [circleEdgeLatLng, locationMarker.getPosition()]
    });
    this.geofenceHitMarkers.push(polyline);

    // Change the color of activated geofence to light-grey.
    circle.activated = true;
    circle.setOptions({
      fillColor: COLORS.grey,
      fillOpacity: 0.2,
      strokeColor: COLORS.grey,
      strokeOpacity: 0.4
    });
  }

  onHttpSuccess(response) {
    console.log('[js] http success: ', response);
  }

  onHttpFailure(response) {
    console.log('[js] http FAILURE: ', response);
  }

  setCenter(location) {
    this.updateCurrentLocationMarker(location);
    setTimeout(function() {
      this.map.setCenter(new google.maps.LatLng(location.coords.latitude, location.coords.longitude));
    }.bind(this));
  }

  updateCurrentLocationMarker(location) {
    var latlng = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
    this.currentLocationMarker.setPosition(latlng);
    this.locationAccuracyCircle.setCenter(latlng);
    this.locationAccuracyCircle.setRadius(location.coords.accuracy);

    if (this.lastLocation) {
      this.locationMarkers.push(this.buildLocationMarker(location));
    }
    if (location.sample === true) {
      return;
    }
    // Add breadcrumb to current Polyline path.
    this.polyline.getPath().push(latlng);
    if (!this.settingsService.state.mapHidePolyline) {
      this.polyline.setMap(this.map);
    }
    this.lastLocation = location;
  }

  // Build a bread-crumb location marker.
  buildLocationMarker(location, options?) {
    options = options || {};
    var icon = google.maps.SymbolPath.CIRCLE;
    var scale = 5;
    var zIndex = 1;
    var anchor;
    var strokeWeight = 1;

    if (!this.lastDirectionChangeLocation) {
      this.lastDirectionChangeLocation = location;
    }

    // Render an arrow marker if heading changes by 10 degrees or every 5 points.
    var deltaHeading = Math.abs(location.coords.heading - this.lastDirectionChangeLocation.coords.heading);
    if ((deltaHeading >= 15) || !(this.locationMarkers.length % 5) || options.showHeading) {
      icon = google.maps.SymbolPath.FORWARD_CLOSED_ARROW;
      scale = 3;
      strokeWeight = 1;
      anchor = new google.maps.Point(0, 2.6);
      this.lastDirectionChangeLocation = location;
    }

    return new google.maps.Marker({
      zIndex: zIndex,
      icon: {
        path: icon,
        rotation: location.coords.heading,
        scale: scale,
        anchor: anchor,
        fillColor: COLORS.polyline_color,
        fillOpacity: 1,
        strokeColor: COLORS.black,
        strokeWeight: strokeWeight,
        strokeOpacity: 1
      },
      map: (!this.settingsService.state.mapHideMarkers) ? this.map : null,
      position: new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
    });
  }

  buildGeofenceMarker(params) {
    // Add longpress event for adding GeoFence of hard-coded radius 200m.
    var geofence = new google.maps.Circle({
      identifier: params.identifier,
      zIndex: 100,
      fillColor: COLORS.green,
      fillOpacity: 0.2,
      strokeColor: COLORS.green,
      strokeWeight: 2,
      strokeOpacity: 0.5,
      params: params,
      radius: parseInt(params.radius, 10),
      center: new google.maps.LatLng(params.latitude, params.longitude),
      map: this.map
    });
    // Add 'click' listener to geofence so we can edit it.
    google.maps.event.addListener(geofence, 'click', () => {
      this.toast('Click geofence ' + geofence.identifier, null, 1000);
    });
    return geofence;
  }

  buildStopZoneMarker(latlng:any) {
    return new google.maps.Marker({
      zIndex: 1,
      map: this.map,
      position: latlng,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: COLORS.red,
        fillOpacity: 0.3,
        strokeColor: COLORS.red,
        strokeWeight: 1,
        strokeOpacity: 0.7
      }
    });
  }

  showStationaryCircle(location:any) {
    var coords = location.coords;
    var radius = this.bgService.isLocationTrackingMode() ? 200 : (this.state.geofenceProximityRadius / 2);
    var center = new google.maps.LatLng(coords.latitude, coords.longitude);

    this.stationaryRadiusCircle.setRadius(radius);
    this.stationaryRadiusCircle.setCenter(center);
    this.stationaryRadiusCircle.setMap(this.map);
    this.map.setCenter(center);
  }

  hideStationaryCircle() {
    // Create a little red breadcrumb circle of our last stop-position
    var latlng = this.stationaryRadiusCircle.getCenter();
    var stopZone = this.buildStopZoneMarker(latlng);
    var lastMarker = this.locationMarkers.pop();
    if (lastMarker) {
      lastMarker.setMap(null);
    }
    this.locationMarkers.push(stopZone);
    this.stationaryRadiusCircle.setMap(null);
  }

  clearMarkers() {
    // Clear location-markers.
    this.locationMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    this.locationMarkers = [];

    // Clear geofence hit markers
    this.geofenceHitMarkers.forEach((marker) => {
      marker.setMap(null);
    })
    // Clear geofence markers.
    this.geofenceMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    this.geofenceMarkers = [];

    // Clear red stationaryRadius marker
    this.stationaryRadiusCircle.setMap(null);

    // Clear blue route PolyLine
    this.polyline.setMap(null);
    this.polyline.setPath([]);
  }

  alert(title, message) {

  }

  confirm(title, message, callback) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
            alert.dismiss();
        }
      }, {
        text: 'Confirm',
        handler: callback
      }]
    });
    alert.present();
  }

  toast(message, result?, duration?) {
    if (typeof(result) !== undefined) {
      message = message.replace("\{result\}", result)
    }
    this.toastCtrl.create({
      message: message,
      duration: duration || 3000
    }).present();
  }
}
