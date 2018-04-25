import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Config } from './_config';
import 'rxjs/Rx';

@Injectable()
export class ApiService {

  loader: any;

  constructor(public http: Http, public config: Config, public loadingCtrl: LoadingController) {
    this.loader = loadingCtrl.create({
      content: "Please wait...api"
    });
  }

  callService1(url, request) {
    var self = this;
    // self.loader.present();
    let URL = this.config.getApiPath().SERVER_URL + url;
    let body = JSON.stringify(request);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    console.log("URL: " + URL);
    return this.http.post(URL, body, options)
      .map(function (response) {
        return response.json();
      })
      .catch(function (error) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
      });

    // return this.http.post(URL, body, options).toPromise()
    //   .then(res => { return res.json(); },
    //   err => { console.log(err); return Observable.throw(err.json().error || 'Server error'); }
    //   );

  }
  callServiceGet(url) {
    var self = this;
    let URL = this.config.getApiPath().SERVER_URL + url;

    //get(url: string, options?: RequestOptionsArgs): Observable<Response>;
    return this.http.get(URL)
      .map(function (response) {
        return response.json();
      })
      .catch(function (error) {
        console.error(JSON.stringify(error.err));
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  callService(url, request) {
    var self = this;
    // self.loader.present();
    let URL = this.config.getApiPath().SERVER_URL + url;
    let body = JSON.stringify(request);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(URL, body, options)
      .map(function (response) {
        // self.loader.dismiss();
        return response.json();
      })
      .catch(function (error) {
        // self.loader.dismiss();
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  callServiceNoBody(url) {
    var self = this;
    self.loader.present();
    let URL = this.config.getApiPath().SERVER_URL + url;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(URL, null, options)
      .map(function (response) {
        self.loader.dismiss();
        return response.json();
      })
      .catch(function (error) {
        self.loader.dismiss();
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
      });
  }

}


