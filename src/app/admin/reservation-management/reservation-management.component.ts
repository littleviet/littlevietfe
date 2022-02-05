import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';
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
export class ReservationManagementComponent implements OnInit {
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
    filterMultiple: true,
    listOfFilter: [
      { text: 'Reserved', value: 'Reserved' },
      { text: 'Completed', value: 'Completed' },
      { text: 'Cancelled', value: 'Cancelled' }
    ],
    filterFn: null,
  }

  reservations!: PaginationResponse<AdminReservation[]>;
  reservationQuery!: AdminReservationQueryRequest;

  constructor(private store: Store, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.reservationsObs.subscribe((result) => {
      this.reservations = result;
    });
    this.reservationsQueryObs.subscribe((result) => {
      this.reservationQuery = result;
    });

    this.route.queryParams
      .subscribe(params => {
        let query: AdminReservationQueryRequest = JSON.parse(JSON.stringify(params));
        this.store.dispatch(new AdminGetReservations(query));
      }
    );
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    let query = _.clone(this.reservationQuery);
    query.pageNumber = pageIndex;

    if (sortField != null && sortOrder != null) {
      query.orderBy = sortField.toString() + " " + (sortOrder.toString() == 'descend' ? 'desc' : 'asc');
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
    this.router.navigate(['/admin/reservations'], { queryParams: query });
  }

  resetSearchNoPeole(): void {
    this.noPeopleSearchValue = '';
    this.searchNoPeople();
  }

  searchNoPeople(): void {
    this.noPeopleVisible = false;
    let query = _.clone(this.reservationQuery);
    query.noOfPeople = Number.parseInt(this.noPeopleSearchValue);
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

  refreshCheckedStatus(): void {
    this.checked = this.reservations.payload.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.reservations.payload.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }
}

