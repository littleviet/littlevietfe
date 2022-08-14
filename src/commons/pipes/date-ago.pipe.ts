import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dateAgo',
    pure: true
})
export class DateAgoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
    // if (seconds < 30 && seconds >= 0) // less than 30 seconds ago will show as 'Just now'
    //   return 'Just now';
    const intervals: { [key: string]: number } = {
      'year': 31536000,
      'month': 2592000,
      'week': 604800,
      'day': 86400,
      'hour': 3600,
      'minute': 60,
      'second': 1
    };
    let counter;
    if (seconds > 0) {
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0) {
          if (counter === 1) {
            return counter + ' ' + i + ' ago'; // singular (1 day ago)
          } else {
              return counter + ' ' + i + 's ago'; // plural (2 days ago)
          }
        }
      }
    } else {
      for (const i in intervals) {
        counter = Math.floor(-seconds / intervals[i]);
        if (counter > 0) {
          if (counter === 1) {
            return 'in ' + counter + ' ' + i; // singular (in 1 day)
          } else {
            return 'in ' + counter + ' ' + i + 's'; // plural (in 2 days)
          }
        }
      }
    }
    
    return value;
  }
}