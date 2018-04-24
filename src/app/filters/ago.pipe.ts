import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ago'
})
export class AgoPipe implements PipeTransform {

  transform(value: Date): string {
    // var date = new Date(value)
    var seconds = Math.floor((new Date().getTime() - value.getTime()) / 1000)

    var intervals = {
      'year': 31536000,
      'month': 2592000,
      'day': 86400,
      'hour': 3600,
      'minute': 60,
      'second': 1
    }

    var counter;
    for (var intv in intervals) {
      counter = Math.floor(seconds / intervals[intv])
      if (counter > 0) {
        return counter + ' ' + intv + 's ago'
      }
    }
  }

}
