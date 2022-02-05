import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-global-error-dialog',
  templateUrl: './global-error-dialog.component.html',
  styleUrls: ['./global-error-dialog.component.scss']
})
export class GlobalErrorDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string },
    public dialogRef: MatDialogRef<GlobalErrorDialogComponent>, private ngZone: NgZone) { 
  }

  ngOnInit() {
  }

  close() {
    this.ngZone.run(() => {
      this.dialogRef.close();
    });
  }

}
