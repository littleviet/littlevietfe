import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AdminClearReservation, AdminGetReservationById, AdminUpdateReservation } from 'src/app/actions/admin.action';
import { AdminState } from 'src/app/states/admin.state';
import { AdminReservation } from 'src/dtos/reservation/admin-reservation';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss']
})
export class ReservationDetailComponent implements OnInit {
  @Select(AdminState.getActions) adminActionsObs!: Observable<string[]>;
  @Select(AdminState.getReservation) reservationObs!: Observable<AdminReservation>;
  reservation!: AdminReservation;
  emailFC = new UntypedFormControl("", [Validators.required,  Validators.email]);
  firstNameFC = new UntypedFormControl("", [Validators.required]);
  lastNameFC = new UntypedFormControl("", [Validators.required]);
  bookingDateFC = new UntypedFormControl("", [Validators.required]);
  statusFC = new UntypedFormControl("", [Validators.required]);
  noPeopleFC = new UntypedFormControl("", [Validators.required]);
  futherRequestFC = new UntypedFormControl("");
  phoneNumberFC = new UntypedFormControl("", [Validators.required]);

  validateForm: UntypedFormGroup = new UntypedFormGroup({
    email: this.emailFC,
    firstName: this.firstNameFC,
    lastName: this.lastNameFC,
    bookingDate: this.bookingDateFC,
    noOfPeople: this.noPeopleFC,
    furtherRequest: this.futherRequestFC,
    phoneNumber: this.phoneNumberFC
  });

  constructor(private route: ActivatedRoute, private store: Store) { }

  ngOnInit() {
    this.reservationObs.subscribe((result) => {
      this.reservation = result;
      if (this.reservation != null) {
        this.validateForm.reset();
        this.firstNameFC.setValue(this.reservation.firstName);
        this.lastNameFC.setValue(this.reservation.lastName);
        this.bookingDateFC.setValue(this.reservation.bookingDate);
        this.emailFC.setValue(this.reservation.email);
        this.futherRequestFC.setValue(this.reservation.furtherRequest);
        this.noPeopleFC.setValue(this.reservation.noOfPeople);
        this.phoneNumberFC.setValue(this.reservation.phoneNumber);
      }
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.store.dispatch(new AdminGetReservationById(id));
    }
  }

  submitForm(): void {
    let reservation = _.clone(this.reservation);
    reservation.email = this.emailFC.value;
    reservation.firstName = this.firstNameFC.value;
    reservation.lastName = this.lastNameFC.value;
    reservation.bookingDate = this.bookingDateFC.value;
    reservation.furtherRequest = this.futherRequestFC.value;
    reservation.noOfPeople = this.noPeopleFC.value;
    reservation.phoneNumber = this.phoneNumberFC.value;
    this.store.dispatch(new AdminUpdateReservation(reservation));
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    if (this.reservation != null) {
      this.firstNameFC.setValue(this.reservation.firstName);
      this.lastNameFC.setValue(this.reservation.lastName);
      this.bookingDateFC.setValue(this.reservation.bookingDate);
      this.emailFC.setValue(this.reservation.email);
      this.futherRequestFC.setValue(this.reservation.furtherRequest);
      this.noPeopleFC.setValue(this.reservation.noOfPeople);
      this.phoneNumberFC.setValue(this.reservation.phoneNumber);
    }
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }

  onUpdateStatus(status: string) {
    let reservation = _.clone(this.reservation);
    reservation.status = status;
    this.store.dispatch(new AdminUpdateReservation(reservation));
  }

  ngOnDestroy() {
    this.store.dispatch(new AdminClearReservation());
  }
}
