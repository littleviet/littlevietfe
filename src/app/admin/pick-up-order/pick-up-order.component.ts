import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AdminCompletePickUpOrder, SearchPickUpOrderById, SearchPickUpOrders } from 'src/app/actions/admin.action';
import { AdminState } from 'src/app/states/admin.state';
import { OrderStatus, OrderType } from 'src/commons/enums/app-enum';
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
  @Select(AdminState.getPickUpOders) pickUpOrdersObs!: Observable<PaginationResponse<AdminOrder[]>>;
  @Select(AdminState.getPickUpOderQuery) pickUpOderQueryObs!: Observable<AdminOrderQueryRequest>;
  @Select(AdminState.getPickUpOrder) pickUpOrderObs!: Observable<AdminOrderInfo>;
  orderQuery!: AdminOrderQueryRequest;
  pickUpOrder!: AdminOrderInfo | null;
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
    query.orderBy = "pickupTime desc";
    query.statuses = [OrderStatus.Paid];
    query.orderTypes = [OrderType.TakeAway];
    this.store.dispatch(new SearchPickUpOrders(query));
    this.pickUpOrdersObs.subscribe((result) => {
      this.adminOrders = result;
      if (this.selectedId == null && this.adminOrders != null && this.adminOrders.payload.length > 0) {
        this.selectedId = this.adminOrders.payload[0].id;
        this.store.dispatch(new SearchPickUpOrderById(this.selectedId));
      }

      if (this.adminOrders == null || this.adminOrders.payload.length <= 0) {
        this.pickUpOrder = null;
      }
    });

    this.pickUpOderQueryObs.subscribe((result) => {
      this.orderQuery = result;
    });

    this.pickUpOrderObs.subscribe((result) => {
      this.pickUpOrder = result;
    });

    this.adminActionsObs.subscribe((result) => {
      this.adminActions = result;
    });
  }

  onFilter() {
    let query = _.clone(this.orderQuery);
    if (this.nameFC.value != null && this.nameFC.value != '') {
      query.fullName = this.nameFC.value;
    }
    if (this.phoneFC.value != null && this.phoneFC.value != '') {
      query.phoneNumber = this.phoneFC.value;
    }
    query.pageNumber = 1;
    this.store.dispatch(new SearchPickUpOrders(query));
  }

  handler(e: any) {
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

  completePickUpOrder() {
    this.store.dispatch(new AdminCompletePickUpOrder(this.selectedId));
  }

  isDiplayLoading() {
    if (this.adminActions && this.adminActions.findIndex(ac => ac == SearchPickUpOrderById.name) >= 0) {
      return true;
    }
    return false;
  }
}
