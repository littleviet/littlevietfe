import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CheckoutCoupon, UpdateCouponBuyingInfo } from 'src/app/actions/coupon.action';
import { AuthenticationState } from 'src/app/states/authentication.state';
import { CouponState } from 'src/app/states/coupon.state';
import { LoginAccountInfo } from 'src/dtos/account/login-account-info';
import { CustomerCouponType } from 'src/dtos/coupon-type/customer-coupon-type';
import { CustomerCouponRequest } from 'src/dtos/coupon/customer-coupon-request';

@Component({
  selector: 'app-coupon-confirm-dialog',
  templateUrl: './coupon-confirm-dialog.component.html',
  styleUrls: ['./coupon-confirm-dialog.component.scss']
})
export class CouponConfirmDialogComponent implements OnInit {
  @Select(CouponState.isCouponBuyingSuccess) couponBuyingSuccessObs!: Observable<boolean | null>;
  @Select(CouponState.getCouponBuyingInfo) couponBuyingInfoObs!: Observable<CustomerCouponRequest>;
  @Select(AuthenticationState.getLoggedInAccountInfo) userInfoObs!: Observable<LoginAccountInfo>;
  @Select(CouponState.getActions) couponActionsObs!: Observable<string[]>;
  @Select(CouponState.getCouponTypes) couponTypesObs!: Observable<CustomerCouponType[]>;
  couponTypes: CustomerCouponType[] = [];
  couponInfo!: CustomerCouponRequest;
  userInfo!: LoginAccountInfo;
  couponBuyingSuccess: boolean | null = null;
  selectedCoupon: CustomerCouponType | null = null;

  emailFC = new UntypedFormControl("", [Validators.required, Validators.email]);
  firstNameFC = new UntypedFormControl("", [Validators.required]);
  lastNameFC = new UntypedFormControl("", [Validators.required]);
  phoneFC = new UntypedFormControl("", [Validators.required]);
  vatFC = new UntypedFormControl();
  acceptConditionFC = new UntypedFormControl("", [Validators.required]);
  consentInfoConidtionFC = new UntypedFormControl("", [Validators.required]);

  couponBuyingFG = new UntypedFormGroup(
    {
      email: this.emailFC,
      firstName: this.firstNameFC,
      lastName: this.lastNameFC,
      phoneNumber: this.phoneFC,
      vat: this.vatFC,
      acceptCondition: this.acceptConditionFC,
      consentInfoConidtion: this.consentInfoConidtionFC,
    }
  );

  constructor(public dialogRef: MatDialogRef<CouponConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store) {
  }

  ngOnInit() {
    this.couponTypesObs.subscribe((result) => {
      this.couponTypes = result;
    });

    this.couponBuyingInfoObs.subscribe((result) => {
      this.couponInfo = result;
    });

    this.couponBuyingSuccessObs.subscribe((result) => {
      this.couponBuyingSuccess = result;
      if (this.couponBuyingSuccess != null && this.couponBuyingSuccess == false) {
        this.dialogRef.close();
      }
    });

    this.userInfoObs.subscribe((result) => {
      this.userInfo = result;
      if (this.userInfo != null) {
        this.emailFC.setValue(this.userInfo.email);
        this.firstNameFC.setValue(this.userInfo.firstname);
        this.lastNameFC.setValue(this.userInfo.lastname);
        this.phoneFC.setValue(this.userInfo.phoneNumber1);
      }
    });

    this.selectedCoupon = this.couponTypes.find(type => type.id == this.couponInfo.couponTypeId) || null;
  }
  
  onSubmit() {
    this.store.dispatch(new CheckoutCoupon(this.couponBuyingFG.value));
  }
}
