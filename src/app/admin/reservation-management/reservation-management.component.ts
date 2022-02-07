import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, Subscription, tap } from 'rxjs';
import { AdminGetReservations } from 'src/app/actions/admin.action';
import { AdminState } from 'src/app/states/admin.state';
import { ColumnItem } from 'src/dtos/column-item';
import { PaginationResponse } from 'src/dtos/pagination-response';
import { AdminReservation } from 'src/dtos/reservation/admin-reservation';
import { AdminReservationQueryRequest } from 'src/dtos/reservation/admin-reservation-query-request';


@Component({
  selector: 'app-reservation-management',
  templateUrl: './reservation-management.component.html',
  styleUrls: ['./reservation-management.component.scss']
})
export class ReservationManagementComponent implements OnInit, AfterContentChecked {
  private routeSub!: Subscription;
  setOfCheckedId = new Set<string>();
  checked = false;
  indeterminate = false;
  nameSearchValue = '';
  emailSearchValue = '';
  phoneSearchValue = '';
  noPeopleSearchValue = '';
  furtherRequestSearchValue = '';
  nameVisible = false;
  emailVisible = false;
  phoneVisible = false;
  furtherRequestVisible = false;
  noPeopleVisible = false;
  @Select(AdminState.getReservations) reservationsObs!: Observable<PaginationResponse<AdminReservation[]>>;
  @Select(AdminState.getReservationQuery) reservationsQueryObs!: Observable<AdminReservationQueryRequest>;
  @Select(AdminState.getActions) adminActionsObs!: Observable<string[]>;
  @Select(AdminState.getReservation) reservationObs!: Observable<AdminReservation>;
  nameColumn: ColumnItem<AdminReservation> = {
      name: 'Name',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
  };

  emailColumn: ColumnItem<AdminReservation> = {
    name: 'Email',
    sortOrder: null,
    sortDirections: ['descend', 'ascend', null],
  }

  phoneColumn: ColumnItem<AdminReservation> = {
    name: 'Phone',
  }

  bookingDateColumn: ColumnItem<AdminReservation> = {
    name: 'Booking Date',
    sortOrder: null,
    sortDirections: ['ascend', 'descend', null],
  }

  noOfPeopleColumn: ColumnItem<AdminReservation> = {
    name: 'No People',
    sortOrder: null,
    sortDirections: ['ascend', 'descend', null],
  }

  furtherRequestColumn: ColumnItem<AdminReservation> = {
    name: 'Further Request',
  }

  statusColumn: ColumnItem<AdminReservation> = {
    name: 'Status',
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

  reservations!: PaginationResponse<AdminReservation[]>;
  reservation!: AdminReservation;
  reservationQuery!: AdminReservationQueryRequest;

  constructor(private store: Store, private route: ActivatedRoute, private router: Router,
    private cdRef : ChangeDetectorRef) { }

  ngOnInit() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (this.router.url.split('/').length < 4 && this.route.parent?.snapshot.url[2].path == 'reservations') {
          let query = _.clone(this.reservationQuery);
          this.router.navigate(['/admin/reservations'], { queryParams: query });
        }
      }
    });
    this.reservationsObs.subscribe((result) => {
      this.reservations = result;
    });

    this.reservationObs.subscribe((result) => {
      this.reservation = result;
    });

    this.reservationsQueryObs.subscribe((result) => {
      this.reservationQuery = result;
      this.nameSearchValue = this.reservationQuery.fullName || '';
      this.emailSearchValue = this.reservationQuery.email || '';
      this.phoneSearchValue = this.reservationQuery.phoneNumber || '';
      this.noPeopleSearchValue = this.reservationQuery.noOfPeople?.toString() || '';
      this.furtherRequestSearchValue = this.reservationQuery.furtherRequest || '';
      if (this.statusColumn.listOfFilter != null &&  this.statusColumn.listOfFilter.length > 0) {
        this.statusColumn.listOfFilter.forEach((v) => {
          this.reservationQuery.statuses?.forEach((status) => {
            if (status == v.value) {
              v.byDefault = true;
            }
          });
        });
      }
    });

    this.routeSub = this.route.queryParams
      .subscribe(params => {
        if ( this.router.url.split('/').length >= 4) {
          return;
        }
        let query: AdminReservationQueryRequest = JSON.parse(JSON.stringify(params));
        if (query.pageNumber == null || query.pageNumber == undefined) {
          query.pageNumber = 1;
        }
        query.pageSize = 3;
        this.store.dispatch(new AdminGetReservations(query));
        this.setOfCheckedId.clear();
      }
    );
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    let query = _.clone(this.reservationQuery);
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

    if (filter != null && filter.length > 0) {
      query.statuses = filter[0].value;
    } else {
      query.statuses = [];
    }
    
    this.router.navigate(['/admin/reservations'], { queryParams: query });
  }

  resetSearchName(): void {
    this.nameSearchValue = '';
    this.searchName();
  }

  searchName(): void {
    this.nameVisible = false;
    let query = _.clone(this.reservationQuery);
    query.fullName = this.nameSearchValue;
    query.pageNumber = 1;
    this.router.navigate(['/admin/reservations'], { queryParams: query });
  }

  resetSearchEmail(): void {
    this.emailSearchValue = '';
    this.searchEmail();
  }

  searchEmail(): void {
    this.emailVisible = false;
    let query = _.clone(this.reservationQuery);
    query.email = this.emailSearchValue;
    query.pageNumber = 1;
    this.router.navigate(['/admin/reservations'], { queryParams: query });
  }

  resetSearchPhone(): void {
    this.phoneSearchValue = '';
    this.searchPhone();
  }

  searchPhone(): void {
    this.phoneVisible = false;
    let query = _.clone(this.reservationQuery);
    query.phoneNumber = this.phoneSearchValue;
    query.pageNumber = 1;
    this.router.navigate(['/admin/reservations'], { queryParams: query });
  }

  resetSearchNoPeole(): void {
    this.noPeopleSearchValue = '';
    this.searchNoPeople();
  }

  searchNoPeople(): void {
    this.noPeopleVisible = false;
    let query = _.clone(this.reservationQuery);
    query.noOfPeople = Number.parseInt(this.noPeopleSearchValue) || null;
    query.pageNumber = 1;
    this.router.navigate(['/admin/reservations'], { queryParams: query });
  }

  resetSearchFurtherRequest(): void {
    this.furtherRequestSearchValue = '';
    this.searchFurtherRequest();
  }

  searchFurtherRequest(): void {
    this.furtherRequestVisible = false;
    let query = _.clone(this.reservationQuery);
    query.furtherRequest = this.furtherRequestSearchValue;
    query.pageNumber = 1;
    this.router.navigate(['/admin/reservations'], { queryParams: query });
  }

  onAllChecked(value: boolean): void {
    this.reservations.payload.forEach(item => this.updateCheckedSet(item.id, value));
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

  getCheckedItem() : AdminReservation | null | undefined {
    if (this.setOfCheckedId == null || this.setOfCheckedId.size != 1
        || this.reservations == null || this.reservations.payload == null ||  this.reservations.payload.length == 0) {
      return null;
    }
    return this.reservations.payload.find(res => this.setOfCheckedId.has(res.id));
  }

  refreshCheckedStatus(): void {
    this.checked = this.reservations.payload.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.reservations.payload.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
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

