cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-background-fetch.BackgroundFetch",
    "file": "plugins/cordova-plugin-background-fetch/www/BackgroundFetch.js",
    "pluginId": "cordova-plugin-background-fetch",
    "clobbers": [
      "window.BackgroundFetch"
    ]
  },
  {
    "id": "cordova-background-geolocation-lt.BackgroundGeolocation",
    "file": "plugins/cordova-background-geolocation-lt/www/BackgroundGeolocation.js",
    "pluginId": "cordova-background-geolocation-lt",
    "clobbers": [
      "window.BackgroundGeolocation"
    ]
  },
  {
    "id": "cordova-plugin-device.device",
    "file": "plugins/cordova-plugin-device/www/device.js",
    "pluginId": "cordova-plugin-device",
    "clobbers": [
      "device"
    ]
  },
  {
    "id": "cordova-plugin-google-analytics.UniversalAnalytics",
    "file": "plugins/cordova-plugin-google-analytics/www/analytics.js",
    "pluginId": "cordova-plugin-google-analytics",
    "clobbers": [
      "analytics",
      "ga"
    ]
  },
  {
    "id": "cordova-plugin-ionic-keyboard.keyboard",
    "file": "plugins/cordova-plugin-ionic-keyboard/www/android/keyboard.js",
    "pluginId": "cordova-plugin-ionic-keyboard",
    "clobbers": [
      "window.Keyboard"
    ]
  },
  {
    "id": "cordova-plugin-network-information.network",
    "file": "plugins/cordova-plugin-network-information/www/network.js",
    "pluginId": "cordova-plugin-network-information",
    "clobbers": [
      "navigator.connection",
      "navigator.network.connection"
    ]
  },
  {
    "id": "cordova-plugin-network-information.Connection",
    "file": "plugins/cordova-plugin-network-information/www/Connection.js",
    "pluginId": "cordova-plugin-network-information",
    "clobbers": [
      "Connection"
    ]
  },
  {
    "id": "cordova-plugin-splashscreen.SplashScreen",
    "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
    "pluginId": "cordova-plugin-splashscreen",
    "clobbers": [
      "navigator.splashscreen"
    ]
  },
  {
    "id": "cordova-plugin-statusbar.statusbar",
    "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
    "pluginId": "cordova-plugin-statusbar",
    "clobbers": [
      "window.StatusBar"
    ]
  },
  {
    "id": "cordova-sqlite-storage.SQLitePlugin",
    "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
    "pluginId": "cordova-sqlite-storage",
    "clobbers": [
      "SQLitePlugin"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-background-fetch": "5.2.1",
  "cordova-background-geolocation-lt": "2.10.1",
  "cordova-plugin-cocoalumberjack": "0.0.4",
  "cordova-plugin-console": "1.0.5",
  "cordova-plugin-device": "1.1.4",
  "cordova-plugin-google-analytics": "1.8.3",
  "cordova-plugin-ionic-keyboard": "2.0.5",
  "cordova-plugin-ionic-webview": "1.2.0",
  "cordova-plugin-network-information": "1.3.2",
  "cordova-plugin-splashscreen": "4.0.3",
  "cordova-plugin-statusbar": "2.2.1",
  "cordova-plugin-whitelist": "1.3.1",
  "cordova-sqlite-storage": "2.0.4"
};
// BOTTOM OF METADATA
});