import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AdminGetReservationById } from 'src/app/actions/admin.action';
import { AdminState } from 'src/app/states/admin.state';
import { AdminReservation } from 'src/dtos/reservation/admin-reservation';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss']
})
export class ReservationDetailComponent implements OnInit {

  @Select(AdminState.getReservation) reservationObs!: Observable<AdminReservation>;
  reservation!: AdminReservation;

  constructor(private route: ActivatedRoute, private store: Store) { }

  ngOnInit() {
    this.reservationObs.subscribe((result) => {
      this.reservation = result;
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.store.dispatch(new AdminGetReservationById(id));
    }
  }

}
