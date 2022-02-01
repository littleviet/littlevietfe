import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UpdateReservationBookerInfo } from 'src/app/actions/take-away.action';
import { AuthenticationState } from 'src/app/states/authentication.state';
import { TakeAwayState } from 'src/app/states/take-away.state';
import { LoginAccountInfo } from 'src/dtos/account/login-account-info';
import { CusReservation } from 'src/dtos/reservation/cus-reservation';

@Component({
  selector: 'app-reservation-confirm-dialog',
  templateUrl: './reservation-confirm-dialog.component.html',
  styleUrls: ['./reservation-confirm-dialog.component.scss']
})
export class ReservationConfirmDialogComponent implements OnInit {
  @Select(TakeAwayState.getReservationInfo) reservationInfoObs!: Observable<CusReservation>;
  @Select(AuthenticationState.getLoggedInAccountInfo) userInfoObs!: Observable<LoginAccountInfo>;
  @Select(TakeAwayState.isReservationSuccess) reservationSuccessObs!: Observable<boolean | null>;
  @Select(TakeAwayState.getActions) takeAwayActionsObs!: Observable<string[]>;
  reservationInfo!: CusReservation;
  userInfo!: LoginAccountInfo;

  emailFC = new FormControl("", [Validators.required,  Validators.email]);
  firstNameFC = new FormControl("", [Validators.required]);
  lastNameFC = new FormControl("", [Validators.required]);
  vatFC = new FormControl();
  specificRequestFC = new FormControl();
  acceptConditionFC = new FormControl("", [Validators.required]);
  consentInfoConidtionFC = new FormControl("", [Validators.required]);

  bookReservationFG = new FormGroup(
    {
      email: this.emailFC,
      firstName: this.firstNameFC,
      lastName: this.lastNameFC,
      vat: this.vatFC,
      specificRequest: this.specificRequestFC,
      acceptCondition: this.acceptConditionFC,
      consentInfoConidtion: this.consentInfoConidtionFC,
    }
  );

  constructor(public dialogRef: MatDialogRef<ReservationConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store) {
  }

  ngOnInit() {
    this.reservationInfoObs.subscribe((result) => {
      this.reservationInfo = result;
    });

    this.userInfoObs.subscribe((result) => {
      this.userInfo = result;
      if (this.userInfo != null) {
        this.emailFC.setValue(this.userInfo.email);
        this.firstNameFC.setValue(this.userInfo.firstname);
        this.lastNameFC.setValue(this.userInfo.lastname);
      }
    });
  }
  
  onSubmit() {
    this.store.dispatch(new UpdateReservationBookerInfo(this.bookReservationFG.value));
  }

}
