import { Pipe } from '@angular/core';

@Pipe({
  name: 'formatDate'
})

export class FormatDate {
  transform(value, args) {
    if(value === null || value === undefined || value === "") return "";
    var date = new Date(value);
    return this.formatDate(date);
  }

  formatDate(today) {
    var monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct","Nov", "Dec"
    ];

    var weekdayNames = [
      "Sun", "Mon", "Tue", "Wed", "Thus", "Fri", "Sat"
    ];

    return weekdayNames[today.getDay()] + ', ' + today.getDate() + ' '
            + monthNames[today.getMonth()] + ' ' + today.getFullYear();
  }
}
