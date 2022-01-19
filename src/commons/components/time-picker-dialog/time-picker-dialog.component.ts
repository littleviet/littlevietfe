import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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

  hourFormControl = new FormControl([Validators.required]);

  constructor(public dialogRef: MatDialogRef<TimePickerDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
            private store: Store) {
              this.hourFormControl.setValue('Hour*', {onlySelf: true});
            }

  pickUpTimeValuesDropdown = ['Hour*', '10:00', '10:15','10:30', '10:45','11:00', '11:15','11:30', '11:45','12:00', '12:15','12:30', '12:45'];

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
    console.log(
      date.toLocaleString('es-ES', { hour: 'numeric', hour12: false })
    );  
    this.today = this.daysOfWeek[ date.getDay()];
  }

  onSubmit() {
    this.store.dispatch(new UpdatePickUpTime(this.hourFormControl.value));
  }
}
