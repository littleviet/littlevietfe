import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { SearchUseCoupons } from 'src/app/actions/admin.action';
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
  couponInfo!: AdminUseCouponInfo;
  adminCoupons!: PaginationResponse<AdminUseCouponInfo[]>;
  adminActions!: string[];

  filterFG = this._fb.group({
    'keyword': ['', [Validators.required]]
  });

  constructor(private store: Store, private _fb: FormBuilder) { }

  ngOnInit() {
    this.adminCouponsObs.subscribe((result) => {
      this.adminCoupons = result;
      if (this.couponInfo == null && this.adminCoupons != null && this.adminCoupons.payload.length > 0) {
        this.couponInfo = this.adminCoupons.payload[0];
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
  }

  handler(e: any) {
    const total = this.viewPort.getDataLength();
    if (e == (total - 7) && this.adminCoupons.pageNumber < Math.ceil(this.adminCoupons.total / this.adminCoupons.pageSize)) {
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
    }
  }

  completePickUpOrder() {
    // this.store.dispatch(new AdminCompletePickUpOrder(this.selectedId));
  }
}
