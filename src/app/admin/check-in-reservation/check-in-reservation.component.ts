import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AdminCheckInReservation, SearchReservationOrderById, SearchReservationOrders } from 'src/app/actions/admin.action';
import { AdminState } from 'src/app/states/admin.state';
import { ReservationStatus } from 'src/commons/enums/app-enum';
import { PaginationResponse } from 'src/dtos/pagination-response';
import { AdminReservation } from 'src/dtos/reservation/admin-reservation';
import { AdminReservationQueryRequest } from 'src/dtos/reservation/admin-reservation-query-request';

@Component({
  selector: 'app-check-in-reservation',
  templateUrl: './check-in-reservation.component.html',
  styleUrls: ['./check-in-reservation.component.scss']
})
export class CheckInReservationComponent implements OnInit {
  dateFormat = "yyyy-MM-dd'T'HH:mm:ss'Z'";
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;
  @Select(AdminState.getActions) adminActionsObs!: Observable<string[]>;
  @Select(AdminState.getReservationOders) reservationOdersObs!: Observable<PaginationResponse<AdminReservation[]>>;
  @Select(AdminState.getReservationOder) reservationOderObs!: Observable<AdminReservation>;
  @Select(AdminState.getReservationOderQuery) reservationOderQueryObs!: Observable<AdminReservationQueryRequest>;
  reservationQuery!: AdminReservationQueryRequest;
  reservationOrder!: AdminReservation | null;
  adminReservations!: PaginationResponse<AdminReservation[]>;
  adminActions!: string[];
  selectedId!: string;

  filterFG: FormGroup = this._fb.group({
    'fullName': [''],
    'phoneNumber': [''],
    'email': [''],
    'dateFromTo': [''],
    'noOfPeople': [''],
  });
  
  constructor(private _fb: FormBuilder, private store: Store) { }

  ngOnInit() {
    let query = new AdminReservationQueryRequest();
    query.pageNumber = 1;
    query.orderBy = "bookingDate asc";
    query.statuses = [ReservationStatus.Reserved];
    this.store.dispatch(new SearchReservationOrders(query));
    this.reservationOdersObs.subscribe((result) => {
      this.adminReservations = result;
      if (this.selectedId == null && this.adminReservations != null && this.adminReservations.payload.length > 0) {
        this.selectedId = this.adminReservations.payload[0].id;
        this.store.dispatch(new SearchReservationOrderById(this.selectedId));
      }

      if (this.adminReservations != null && this.adminReservations.payload.length > 0) {
        this.reservationOrder = null;
      }
    });

    this.reservationOderQueryObs.subscribe((result) => {
      this.reservationQuery = result;
    });

    this.reservationOderObs.subscribe((result) => {
      this.reservationOrder = result;
    });

    this.adminActionsObs.subscribe((result) => {
      this.adminActions = result;
    });
  }

  handler(e: any) {
    const total = this.viewPort.getDataLength();
    if (e == (total - 7) && this.adminReservations.pageNumber < Math.ceil(this.adminReservations.total / this.adminReservations.pageSize)) {
      let query = _.cloneDeep(this.reservationQuery)
      if (query.pageNumber != null) {
        query.pageNumber += 1;
      }
      this.store.dispatch(new SearchReservationOrders(query));
    }
  }

  itemClick(id: string) {
    this.selectedId = id;
    this.store.dispatch(new SearchReservationOrderById(id));
  }

  onFilter() {
    let query = _.clone(this.reservationQuery);
    query.fullName = this.filterFG.value['fullName'];
    query.phoneNumber = this.filterFG.value['phoneNumber'];
    query.email = this.filterFG.value['email'];
    query.noOfPeople = this.filterFG.value['noOfPeople'];

    if (this.filterFG.value['dateFromTo'] != null && this.filterFG.value['dateFromTo'].length > 0) {
      let dateFrom = new Date(this.filterFG.value['dateFromTo'][0]);
      let dateTo = new Date(this.filterFG.value['dateFromTo'][1]);
      let utcMilTo = formatDate(dateTo, this.dateFormat, 'en-US');
      let utcMilFrom = formatDate(dateFrom, this.dateFormat, 'en-US');
      query.bookingDateFrom = utcMilFrom;
      query.bookingDateTo = utcMilTo;
    } else {
      query.bookingDateFrom = null;
      query.bookingDateTo = null;
    }

    query.pageNumber = 1;
    this.store.dispatch(new SearchReservationOrders(query));
  }

  isDiplayLoading() {
    if (this.adminActions && this.adminActions.findIndex(ac => ac == SearchReservationOrderById.name) >= 0) {
      return true;
    }
    return false;
  }

  checkInReservation() {
    this.store.dispatch(new AdminCheckInReservation(this.selectedId));
  }
}
