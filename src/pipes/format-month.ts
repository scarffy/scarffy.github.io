import { Pipe } from '@angular/core';

@Pipe({
  name: 'formatMonth'
})

export class FormatMonth {
  transform(value, args) {
    if(value === null || value === undefined || value === "") return "";
    var date = new Date(value);
    return this.formatMonth(date);
  }

  formatMonth(today) {
    var monthNames = [
      "January", "February", "March", "April", "May", "June", "July","August", "September", "October","November", "December"
    ];
    

     return  monthNames[today.getMonth()] + ' ' + today.getFullYear();
    
    }
}