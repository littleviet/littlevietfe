import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AdminClearOrder, AdminGetOrderById } from 'src/app/actions/admin.action';
import { AdminState } from 'src/app/states/admin.state';
import { AdminOrderInfo } from 'src/dtos/order/admin-order-info';

@Component({
  selector: 'app-take-away-detail',
  templateUrl: './take-away-detail.component.html',
  styleUrls: ['./take-away-detail.component.scss']
})
export class TakeAwayDetailComponent implements OnInit {
  @Select(AdminState.getActions) adminActionsObs!: Observable<string[]>;
  @Select(AdminState.getOrder) orderObs!: Observable<AdminOrderInfo>;
  order!: AdminOrderInfo;

  constructor(private route: ActivatedRoute, private store: Store) { }

  ngOnInit() {
    this.orderObs.subscribe((result) => {
      this.order = result;
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.store.dispatch(new AdminGetOrderById(id));
    }
  }

  getColor(): string {
    switch (this.order.orderStatus) {
      case "Cancelled":
        return 'red';
      case "Ordered":
        return 'geekblue';
      case "Paid":
        return 'blue';
      case "Expired":
        return 'volcano';
      case "PickedUp":
        return 'green';
    }
    return "";
  }

  ngOnDestroy() {
    this.store.dispatch(new AdminClearOrder());
  }
}
