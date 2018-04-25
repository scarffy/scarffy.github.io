import { Pipe } from '@angular/core';

@Pipe({
  name: 'formatDays'
})

export class FormatDays {
  transform(value, args) {
    //if(value === null || value === undefined || value === "") return "";
    var date = new Date(value);
    return this.formatDays(date);
  }

  formatDays(today) {
    return today.getDate();
  }
}