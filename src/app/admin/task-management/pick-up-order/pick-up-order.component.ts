import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { SearchPickUpOrderById, SearchPickUpOrders } from 'src/app/actions/admin.action';
import { AdminState } from 'src/app/states/admin.state';
import { AdminOrder } from 'src/dtos/order/admin-order';
import { AdminOrderQueryRequest } from 'src/dtos/order/admin-order-query-request';
import { AdminOrderInfo } from 'src/dtos/order/admin-order.info';
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
  @Select(AdminState.getPickUpOrder) pickUpOderObs!: Observable<AdminOrderInfo>;
  orderQuery!: AdminOrderQueryRequest;
  pickUpOder!: AdminOrderInfo;
  adminOrders!: PaginationResponse<AdminOrder[]>;
  adminActions!: string[];
  selectedId!: string;
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
      if (this.selectedId == null && this.adminOrders != null && this.adminOrders.payload.length > 0) {
        this.selectedId = this.adminOrders.payload[0].id;
        this.store.dispatch(new SearchPickUpOrderById(this.selectedId));
      }
    });

    this.pickUpOderQueryObs.subscribe((result) => {
      this.orderQuery = result;
    });

    this.pickUpOderObs.subscribe((result) => {
      this.pickUpOder = result;
    });

    this.adminActionsObs.subscribe((result) => {
      this.adminActions = result;
    });
  }

  onFilter() {

  }

  handler(e: any) {
    console.log("E ne:", e, this.viewPort.getDataLength());
    const total = this.viewPort.getDataLength();
    if (e == (total - 7) && this.adminOrders.pageNumber < Math.ceil(this.adminOrders.total / this.adminOrders.pageSize)) {
      let query = _.cloneDeep(this.orderQuery)
      if (query.pageNumber != null) {
        query.pageNumber += 1;
      }
      this.store.dispatch(new SearchPickUpOrders(query));
    }
  }

  itemClick(id: string) {
    this.selectedId = id;
    this.store.dispatch(new SearchPickUpOrderById(id));
  }

  isDiplayLoading() {
    if (this.adminActions && this.adminActions.findIndex(ac => ac == SearchPickUpOrderById.name) >= 0) {
      return true;
    }
    return false;
  }

}
