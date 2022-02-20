import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { SearchPickUpOrders } from 'src/app/actions/admin.action';
import { AdminState } from 'src/app/states/admin.state';
import { AdminOrder } from 'src/dtos/order/admin-order';
import { AdminOrderQueryRequest } from 'src/dtos/order/admin-order-query-request';
import { PaginationResponse } from 'src/dtos/pagination-response';

@Component({
  selector: 'app-pick-up-order',
  templateUrl: './pick-up-order.component.html',
  styleUrls: ['./pick-up-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickUpOrderComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;
  @Select(AdminState.getActions) adminActionsObs!: Observable<string[]>;
  @Select(AdminState.getPickUpOders) pickUpOdersObs!: Observable<PaginationResponse<AdminOrder[]>>;
  @Select(AdminState.getPickUpOderQuery) pickUpOderQueryObs!: Observable<AdminOrderQueryRequest>;
  orderQuery!: AdminOrderQueryRequest;
  adminOrders!: PaginationResponse<AdminOrder[]>;
  nameFC = new FormControl('');
  phoneFC = new FormControl('');

  filterFG = new FormGroup({
    fullName: this.nameFC,
    phoneNumber: this.phoneFC,
  });

  constructor(private store: Store) { }

  ngOnInit() {
    let query = new AdminOrderQueryRequest();
    query.pageNumber = 1;
    this.store.dispatch(new SearchPickUpOrders(query));
    this.pickUpOdersObs.subscribe((result) => {
      this.adminOrders = result;
    });

    this.pickUpOderQueryObs.subscribe((result) => {
      this.orderQuery = result;
    });
  }

  onFilter() {

  }

  handler(e: any) {
    console.log("E ne:", e, this.viewPort.getDataLength());
    const total = this.viewPort.getDataLength();
    // if (e == (total - 7) && this.adminOrders.pageNumber < this.adminOrders.total ) {
    //   let query = _.cloneDeep(this.orderQuery)
    //   if (query.pageNumber != null) {
    //     query.pageNumber += 1;
    //   }
    //   this.store.dispatch(new SearchPickUpOrders(query));
    // }
  }

}
