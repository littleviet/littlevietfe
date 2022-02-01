import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { differenceInCalendarDays } from 'date-fns';
import { Observable } from 'rxjs';
import { ClearReservation, UpdateReservationInfo } from 'src/app/actions/take-away.action';
import { TakeAwayState } from 'src/app/states/take-away.state';
import { ReservationConfirmDialogComponent } from 'src/commons/components/reservation-confirm-dialog/reservation-confirm-dialog.component';
import { CancellationPolicyDialogComponent } from './cancellation-policy-dialog/cancellation-policy-dialog.component';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  @Select(TakeAwayState.isReservationSuccess) reservationSuccessObs!: Observable<boolean>;
  menuOpen: boolean = false;
  numberOfPeople = Array(15).fill(0);
  reservationSuccess: boolean | null = null;
  hours = ["13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00",
  "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", "22:45", "23:00"];

  noPeopleFC = new FormControl("1", [Validators.required]);
  dayFC = new FormControl(new Date(), [Validators.required]);
  hourFC = new FormControl("13:00", [Validators.required]);
  today = new Date();
  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) < 0;

  reservationFG = new FormGroup({
    numberOfPeople: this.noPeopleFC,
    day: this.dayFC,
    hour: this.hourFC
  });

  constructor(public dialog: MatDialog, private store: Store) { }

  ngOnInit() {
    this.reservationSuccessObs.subscribe((result) => {
      this.reservationSuccess = result;
    });
  }

  clickBtn() {
    this.menuOpen = !this.menuOpen;
  }

  openDialog(): void {
    this.store.dispatch(new UpdateReservationInfo(this.reservationFG.value));
    const dialogRef = this.dialog.open(ReservationConfirmDialogComponent, {
      width: '1200px',
      panelClass: 'my-dialog',
      maxHeight: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.reservationSuccess != null) {
        this.store.dispatch(new ClearReservation());
      }
    });
  }

  viewPolicy() {
    const dialogRef = this.dialog.open(CancellationPolicyDialogComponent, {
      width: '1000px',
      panelClass: 'my-dialog',
      maxHeight: '80%'
    });
  }
}
