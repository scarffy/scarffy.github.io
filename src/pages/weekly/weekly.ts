
import { ViewChild, ElementRef, Component } from '@angular/core';
import {ViewController} from 'ionic-angular';

declare var google;

@Component({
  selector: 'page-weekly',
  templateUrl: 'weekly.html'
})
export class WeeklyPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(private viewCtrl: ViewController) {

  }

  ngOnInit(){
    this.loadMap();
    this.addMarker();
  }

  loadMap(){
 
    let latLng = new google.maps.LatLng(3.185, 101.686);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
  }

  addMarker(){
 
  let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter()
  });
 
  let content = "<p>Office</p>";          
 
  this.addInfoWindow(marker, content);
 
}

addInfoWindow(marker, content){
 
  let infoWindow = new google.maps.InfoWindow({
    content: content
  });
 
  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
  });
 
}

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

}