import { Pipe } from '@angular/core';

@Pipe({
  name: 'formatTime'
})

export class FormatTime {

  transform(value, args) {
    if (value === null || value === undefined || value === "") return "";
    var date = new Date(value);
    var am_pm = "am";
    var h = date.getHours();

    if (h > 12) {
      h = h - 12;
      am_pm = "pm";
    } else if (h == 12) {
      am_pm = "pm";
    }

    h = this.checkTime(h);
    var m = date.getMinutes();
    var s = date.getSeconds();
    // add a zero in front of numbers<10
    m = this.checkTime(m);
    s = this.checkTime(s);
    return h + ":" + m + " " + am_pm;
    //return h + ":" + m + " " + s; // + am_pm;
  }

  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
}
