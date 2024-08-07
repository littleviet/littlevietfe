import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { UpdatePickUpTime } from 'src/app/actions/take-away.action';

@Component({
  selector: 'app-time-picker-dialog',
  templateUrl: './time-picker-dialog.component.html',
  styleUrls: ['./time-picker-dialog.component.scss']
})
export class TimePickerDialogComponent implements OnInit {
  daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  today!: string;

  hourFormControl = new UntypedFormControl([Validators.required]);

  constructor(public dialogRef: MatDialogRef<TimePickerDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
            private store: Store) {
              this.hourFormControl.setValue('Hour*', {onlySelf: true});
            }

  pickUpTimeValues: any[] = [];
  ngOnInit(): void {
    this.setUpTimeDropdown();
    this.hourFormControl.valueChanges.subscribe(v => {
      if (v == 'Hour*') {
        this.hourFormControl.setErrors({'required': true});
      }
    });
  }
  
  setUpTimeDropdown() {
    var date = new Date();
    this.today = this.daysOfWeek[date.getDay()];
    this.generateTimeValues();
  }

  onSubmit() {
    this.store.dispatch(new UpdatePickUpTime(this.hourFormControl.value));
  }

  generateTimeValues() {
    var date = new Date();
    let startMinute = 0;

    switch(true) { 
      case (date.getMinutes() >= 45):
        startMinute = 0;
        date.setHours(date.getHours() + 1);
        break; 
      case (date.getMinutes() >= 30):
        startMinute = 45;
        break; 
      case (date.getMinutes() >= 15):
        startMinute = 30;
        break; 
      case (date.getMinutes() >= 0):
        startMinute = 15;
        break; 
      default:
        break;
    }

    date.setMinutes(startMinute);
    date.setSeconds(0);
    while (date.getHours() < 23) {
      if ((date.getHours() >= 13 && date.getHours() < 16) || (date.getHours() >= 20 && date.getHours() < 23)) {
        this.pickUpTimeValues.push(new Date(date));
      }
      date.setMinutes(date.getMinutes() + 15);
    }
  }
}
