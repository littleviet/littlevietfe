import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetCouponTypes, UpdateCouponBuyingInfo } from 'src/app/actions/coupon.action';
import { CouponState } from 'src/app/states/coupon.state';
import { CustomerCouponType } from 'src/dtos/coupon-type/customer-coupon-type';
import { CouponConfirmDialogComponent } from './coupon-confirm-dialog/coupon-confirm-dialog.component';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {
  @Select(CouponState.getCouponTypes) couponTypesObs!: Observable<CustomerCouponType[]>;
  @Select(CouponState.isCouponBuyingSuccess) couponBuyingSuccessObs!: Observable<boolean | null>;
  couponBuyingSuccess: boolean | null = null;
  couponTypes: CustomerCouponType[] = [];
  numberOfUnit = Array(10).fill(0);
  couponTypeFC = new FormControl("", [Validators.required]);
  unitFC = new FormControl(1, [Validators.required]);
  couponFG = new FormGroup({
    couponTypeId: this.couponTypeFC,
    unit: this.unitFC,
  });
  menuOpen: boolean = false;
  constructor(private store: Store, public dialog: MatDialog) { }

  ngOnInit() {
    this.store.dispatch(new GetCouponTypes());

    this.couponTypesObs.subscribe((result) => {
      this.couponTypes = result;
      if (this.couponTypes != null && this.couponTypes.length > 0) {
        this.couponTypeFC.setValue(this.couponTypes[0].id);
      }
    });

    this.couponBuyingSuccessObs.subscribe((result) => {
      this.couponBuyingSuccess = result;
    });
  }

  openDialog(): void {
    this.store.dispatch(new UpdateCouponBuyingInfo(this.couponFG.value));
    const dialogRef = this.dialog.open(CouponConfirmDialogComponent, {
      width: '1200px',
      panelClass: 'my-dialog',
      maxHeight: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.couponBuyingSuccess != null) {
        // this.store.dispatch(new ClearReservation());
      }
    });
  }

}
