import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
  reservationSuccessful: boolean | null = null;

  emailFC = new UntypedFormControl("", [Validators.required,  Validators.email]);
  firstNameFC = new UntypedFormControl("", [Validators.required]);
  lastNameFC = new UntypedFormControl("", [Validators.required]);
  phoneNumberFC = new UntypedFormControl("", [Validators.required]);
  vatFC = new UntypedFormControl();
  specificRequestFC = new UntypedFormControl();
  acceptConditionFC = new UntypedFormControl("", [Validators.required]);
  consentInfoConidtionFC = new UntypedFormControl("", [Validators.required]);

  bookReservationFG = new UntypedFormGroup(
    {
      email: this.emailFC,
      firstName: this.firstNameFC,
      lastName: this.lastNameFC,
      vat: this.vatFC,
      specificRequest: this.specificRequestFC,
      acceptCondition: this.acceptConditionFC,
      consentInfoConidtion: this.consentInfoConidtionFC,
      phoneNumber: this.phoneNumberFC
    }
  );

  constructor(public dialogRef: MatDialogRef<ReservationConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store) {
  }

  ngOnInit() {
    this.reservationInfoObs.subscribe((result) => {
      this.reservationInfo = result;
    });

    this.reservationSuccessObs.subscribe((result) => {
      this.reservationSuccessful = result;
      if (this.reservationSuccessful != null && this.reservationSuccessful == false) {
        this.dialogRef.close();
      }
    });

    this.userInfoObs.subscribe((result) => {
      this.userInfo = result;
      if (this.userInfo != null) {
        this.emailFC.setValue(this.userInfo.email);
        this.firstNameFC.setValue(this.userInfo.firstname);
        this.lastNameFC.setValue(this.userInfo.lastname);
        this.phoneNumberFC.setValue(this.userInfo.phoneNumber1);
      }
    });
  }
  
  onSubmit() {
    this.store.dispatch(new UpdateReservationBookerInfo(this.bookReservationFG.value));
  }
}
