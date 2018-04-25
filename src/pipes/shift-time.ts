import { Pipe } from '@angular/core';

@Pipe({
  name: 'shiftTime'
})

export class ShiftTime {
  
  transform(value, args) {
    var shiftdate = ["Night", "Morning", "Afternoon", "Evening"];
    if(value === null || value === undefined || value === "") return "";
    var date = new Date(value);
    var h = date.getHours();
    var indexShift = Math.floor(h/6);
    return shiftdate[indexShift];
  }
}
