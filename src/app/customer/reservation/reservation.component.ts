import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
  @ViewChild('footer') footerEl!: ElementRef;
  @ViewChild('menuBtn', { static: true }) menuEl!: ElementRef;
  
  menuOpen: boolean = false;
  footerHeight: number = 0;
  numberOfPeople = Array(15).fill(0);
  reservationSuccess: boolean | null = null;
  hours = ["13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30",
  "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30"];
  sundayHours = ["13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30",
  "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30"];
  noPeopleFC = new UntypedFormControl("1", [Validators.required]);
  dayFC = new UntypedFormControl(new Date(), [Validators.required]);
  hourFC = new UntypedFormControl("13:00", [Validators.required]);
  today = new Date();
  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) < 0 || current.getDay() == 2
      || this.isChristmas(current);

  reservationFG = new UntypedFormGroup({
    numberOfPeople: this.noPeopleFC,
    day: this.dayFC,
    hour: this.hourFC
  });

  constructor(public dialog: MatDialog, private store: Store,
    private cdRef : ChangeDetectorRef, private renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e: any) => {
      if (e.path.indexOf(this.menuEl.nativeElement) === -1) {
        if (this.menuOpen) {
          this.menuOpen = false;
        }
      }
    });
  }

  ngOnInit() {
    this.reservationSuccessObs.subscribe((result) => {
      this.reservationSuccess = result;
    });
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

  ngAfterViewChecked() {
    this.footerHeight = this.footerEl.nativeElement.getBoundingClientRect().height;
    this.cdRef.detectChanges();
  }

  viewPolicy() {
    const dialogRef = this.dialog.open(CancellationPolicyDialogComponent, {
      width: '1000px',
      panelClass: 'my-dialog',
      maxHeight: '80%'
    });
  }

  isValidDate(): boolean {
    if (this.dayFC.value != null && this.hourFC.value != null) {
      let bookingDate = new Date(this.dayFC.value);
      if (bookingDate.getDay() == 2) {
        return false;
      }
      bookingDate.setHours(parseInt(this.hourFC.value.substring(0, 2)));
      bookingDate.setMinutes(parseInt(this.hourFC.value.substring(3)));
      var currentDate = new Date();
      
      if (bookingDate > currentDate) {
        return true;
      }
    }

    return false;
  }

  isChristmas(date: Date) {
    return date.getMonth() == 11 && (date.getDate() == 23 || date.getDate() == 24);
  }

  isSunday(): boolean {
    if (this.dayFC.value != null) {
      let bookingDate = new Date(this.dayFC.value);
      if (bookingDate.getDay() == 0) {
        if (this.hourFC.value) {
          this.hourFC.setValue(this.sundayHours.includes(this.hourFC.value) ? this.hourFC.value : this.sundayHours[0]) 
        }

        return true;
      }
    }

    return false;
  }
}
