import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-time-picker-dialog',
  templateUrl: './time-picker-dialog.component.html',
  styleUrls: ['./time-picker-dialog.component.scss']
})
export class TimePickerDialogComponent implements OnInit {
  daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  today!: string;

  hourFormControl = new FormControl('', [Validators.required]);

  constructor(public dialogRef: MatDialogRef<TimePickerDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  
  ngOnInit(): void {
    this.setUpTimeDropdown();
  }
  
  setUpTimeDropdown() {
    var date = new Date();
    console.log(
      date.toLocaleString('es-ES', { hour: 'numeric', hour12: false })
    );  
    this.today = this.daysOfWeek[ date.getDay()];
  }

  onSubmit() {
    console.log(this.hourFormControl.value);
  }
}
