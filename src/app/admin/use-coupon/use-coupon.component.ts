import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AdminUseCoupon, SearchUseCoupons } from 'src/app/actions/admin.action';
import { AdminState } from 'src/app/states/admin.state';
import { AdminUseCouponInfo } from 'src/dtos/coupon/admin-use-coupon-info';
import { CouponQueryRequest } from 'src/dtos/coupon/coupon-query-request';
import { PaginationResponse } from 'src/dtos/pagination-response';

@Component({
  selector: 'app-use-coupon',
  templateUrl: './use-coupon.component.html',
  styleUrls: ['./use-coupon.component.scss']
})
export class UseCouponComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;
  @Select(AdminState.getActions) adminActionsObs!: Observable<string[]>;
  @Select(AdminState.getUseCoupons) adminCouponsObs!: Observable<PaginationResponse<AdminUseCouponInfo[]>>;
  @Select(AdminState.getCouponQuery) couponQueryObs!: Observable<CouponQueryRequest>;
  couponQuery!: CouponQueryRequest;
  couponInfo!: AdminUseCouponInfo | null;
  adminCoupons!: PaginationResponse<AdminUseCouponInfo[]>;
  adminActions!: string[];
  afterUsingCoupon = false;

  filterFG = this._fb.group({
    'keyword': ['', [Validators.required]]
  });

  useCouponFG = this._fb.group({
    'usage': [0, [Validators.required, Validators.min(1)]]
  });

  constructor(private store: Store, private _fb: FormBuilder) { }

  ngOnInit() {
    this.useCouponFG.valueChanges.subscribe((v) => {
    });
    this.adminCouponsObs.subscribe((result) => {
      this.adminCoupons = result;
      if (this.adminCoupons != null && this.adminCoupons.payload.length > 0) {
        if (this.afterUsingCoupon) {
          this.couponInfo = this.adminCoupons.payload.find(cp => cp.id == this.couponInfo?.id) || null;
          this.afterUsingCoupon = false;
        } else if (this.couponInfo == null) {
          this.couponInfo = this.adminCoupons.payload[0];
        }
      } else {
        this.couponInfo = null;
      }

      if (this.couponInfo != null) {
        this.useCouponFG.controls['usage'].setValidators([
          Validators.max(this.couponInfo.currentQuantity),
          Validators.min(1),
          Validators.required
        ]);
      }
    });

    this.couponQueryObs.subscribe((result) => {
      this.couponQuery = result;
    });

    this.adminActionsObs.subscribe((result) => {
      this.adminActions = result;
    });
  }

  onFilter() {
    let query = _.clone(this.couponQuery);
    if (this.filterFG.value['keyword'] != null && this.filterFG.value['keyword'] != '') {
      query.keyword = this.filterFG.value['keyword'];
    }
    query.pageNumber = 1;
    this.store.dispatch(new SearchUseCoupons(query));
    this.couponInfo = null
  }

  handler(e: any) {
    const total = this.viewPort.getDataLength();
    if (e == (total - 9) && this.adminCoupons.pageNumber < Math.ceil(this.adminCoupons.total / this.adminCoupons.pageSize)) {
      let query = _.cloneDeep(this.couponQuery)
      if (query.pageNumber != null) {
        query.pageNumber += 1;
      }
      this.store.dispatch(new SearchUseCoupons(query));
    }
  }

  itemClick(id: string) {
    let coupon = this.adminCoupons.payload.find(cp => cp.id == id);
    if (coupon != null) {
      this.couponInfo = coupon;
      this.useCouponFG.controls['usage'].setValidators([
        Validators.max(this.couponInfo.currentQuantity),
        Validators.min(1),
        Validators.required
      ]);
      this.useCouponFG.updateValueAndValidity();
    }
  }

  useCoupon() {
    this.afterUsingCoupon = true;
    this.store.dispatch(new AdminUseCoupon({
      couponCode: this.couponInfo?.couponCode,
      usage: this.useCouponFG.value['usage']
    }));
  }
}
