import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, Subscription } from 'rxjs';
import { AdminGetOrders } from 'src/app/actions/admin.action';
import { AdminState } from 'src/app/states/admin.state';
import { ColumnItem } from 'src/dtos/column-item';
import { AdminOrder } from 'src/dtos/order/admin-order';
import { AdminOrderQueryRequest } from 'src/dtos/order/admin-order-query-request';
import { PaginationResponse } from 'src/dtos/pagination-response';

@Component({
  selector: 'app-take-away-management',
  templateUrl: './take-away-management.component.html',
  styleUrls: ['./take-away-management.component.scss']
})
export class TakeAwayManagementComponent implements OnInit, AfterContentChecked {
  private routeSub!: Subscription;
  setOfCheckedId = new Set<string>();
  checked = false;
  indeterminate = false;
  priceFromSearchValue = '';
  priceToSearchValue = '';
  pickUpTimeFromSearchValue = '';
  pickUpTimeToSearchValue = '';
  priceVisible = false;
  pickUpTimeVisible = false;
  @Select(AdminState.getOrders) ordersObs!: Observable<PaginationResponse<AdminOrder[]>>;
  @Select(AdminState.getOrderQuery) orderQueryObs!: Observable<AdminOrderQueryRequest>;
  @Select(AdminState.getActions) adminActionsObs!: Observable<string[]>;

  nameColumn: ColumnItem<AdminOrder> = {
    name: 'Name',
    sortOrder: null,
    sortDirections: ['descend', 'ascend', null],
  }

  phoneColumn: ColumnItem<AdminOrder> = {
    name: 'Phone',
  }

  pickUpDateColumn: ColumnItem<AdminOrder> = {
    name: 'Pick Up Time',
    sortOrder: null,
    sortDirections: ['ascend', 'descend', null],
  }

  priceColumn: ColumnItem<AdminOrder> = {
    name: 'Price',
    sortOrder: null,
    sortDirections: ['ascend', 'descend', null],
  }

  paymentTypeColumn: ColumnItem<AdminOrder> = {
    name: 'Payment Type',
    filterMultiple: false,
    listOfFilter: [
      { text: 'Reserved', value: 'Reserved' },
      { text: 'Completed', value: 'Completed' },
      { text: 'Cancelled', value: 'Cancelled' }
    ],
    filterFn: () => {
      return true
    },
  }

  orderTypeColumn: ColumnItem<AdminOrder> = {
    name: 'Order Type',
    filterMultiple: false,
    listOfFilter: [
      { text: 'Eat in', value: 'Eat in' },
      { text: 'Take away', value: 'Take away' },
    ],
    filterFn: () => {
      return true
    },
};

  orders!: PaginationResponse<AdminOrder[]>;
  order!: AdminOrder;
  orderQuery!: AdminOrderQueryRequest;

  constructor(private store: Store, private route: ActivatedRoute, private router: Router,
    private cdRef : ChangeDetectorRef) { }

  ngOnInit() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (this.router.url.split('/').length < 4 && this.route.parent?.snapshot.url[2]?.path == 'orders') {
          let query = _.clone(this.orderQuery);
          this.router.navigate(['/admin/orders'], { queryParams: query });
        }
      }
    });
    this.ordersObs.subscribe((result) => {
      this.orders = result;
    });

    this.orderQueryObs.subscribe((result) => {
      this.orderQuery = result;
      // this.nameSearchValue = this.reservationQuery.fullName || '';
      // this.emailSearchValue = this.reservationQuery.email || '';
      // this.phoneSearchValue = this.reservationQuery.phoneNumber || '';
      // this.noPeopleSearchValue = this.reservationQuery.noOfPeople?.toString() || '';
      // this.furtherRequestSearchValue = this.reservationQuery.furtherRequest || '';
      // if (this.statusColumn.listOfFilter != null &&  this.statusColumn.listOfFilter.length > 0) {
      //   this.statusColumn.listOfFilter.forEach((v) => {
      //     this.reservationQuery.statuses?.forEach((status) => {
      //       if (status == v.value) {
      //         v.byDefault = true;
      //       }
      //     });
      //   });
      // }
    });

    this.routeSub = this.route.queryParams
      .subscribe(params => {
        if ( this.router.url.split('/').length >= 4) {
          return;
        }
        let query: AdminOrderQueryRequest = JSON.parse(JSON.stringify(params));
        if (query.pageNumber == null || query.pageNumber == undefined) {
          query.pageNumber = 1;
        }
        this.store.dispatch(new AdminGetOrders(query));
        this.setOfCheckedId.clear();
      }
    );
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    let query = _.clone(this.orderQuery);
    if (query.pageNumber != pageIndex) {
      query.pageNumber = pageIndex;
    } else {
      query.pageNumber = 1;
    }

    if (sortField != null && sortOrder != null) {
      query.orderBy = sortField.toString() + " " + (sortOrder.toString() == 'descend' ? 'desc' : 'asc');
    } else {
      query.orderBy = null;
    }

    query.pageSize = pageSize;

    // if (filter != null && filter.length > 0) {
    //   query.statuses = filter[0].value;
    // } else {
    //   query.statuses = [];
    // }
    
    this.router.navigate(['/admin/orders'], { queryParams: query });
  }

  resetSearchPrice(): void {
    this.priceFromSearchValue = '';
    this.priceToSearchValue = '';
    this.searchPrice();
  }

  searchPrice(): void {
    this.priceVisible = false;
    let query = _.clone(this.orderQuery);
    // query.fullName = this.nameSearchValue;
    query.pageNumber = 1;
    this.router.navigate(['/admin/orders'], { queryParams: query });
  }

  resetSearchPickUpTime(): void {
    this.pickUpTimeFromSearchValue = '';
    this.pickUpTimeToSearchValue = '';
    this.searchPickUpTime();
  }

  searchPickUpTime(): void {
    this.pickUpTimeVisible = false;
    let query = _.clone(this.orderQuery);
    // query.email = this.emailSearchValue;
    query.pageNumber = 1;
    this.router.navigate(['/admin/orders'], { queryParams: query });
  }

  onAllChecked(value: boolean): void {
    this.orders.payload.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  getCheckedItem() : AdminOrder | null | undefined {
    if (this.setOfCheckedId == null || this.setOfCheckedId.size != 1
        || this.orders == null || this.orders.payload == null ||  this.orders.payload.length == 0) {
      return null;
    }
    return this.orders.payload.find(order => this.setOfCheckedId.has(order.id));
  }

  refreshCheckedStatus(): void {
    this.checked = this.orders.payload.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.orders.payload.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  viewClick(id: string) {
    if (id == '') return;
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  ngAfterContentChecked() : void {
    this.cdRef.detectChanges();
  }
}
