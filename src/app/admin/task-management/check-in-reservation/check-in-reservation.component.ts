import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AdminState } from 'src/app/states/admin.state';

@Component({
  selector: 'app-check-in-reservation',
  templateUrl: './check-in-reservation.component.html',
  styleUrls: ['./check-in-reservation.component.scss']
})
export class CheckInReservationComponent implements OnInit {
  @Select(AdminState.getActions) adminActionsObs!: Observable<string[]>;
  nameFC = new FormControl('');
  phoneFC = new FormControl('');
  noOfPeople = new FormControl('');

  filterFG = new FormGroup({
    fullName: this.nameFC,
    phoneNumber: this.phoneFC,
  });
  
  constructor() { }

  ngOnInit() {
  }

  onFilter() {
    // let query = _.clone(this.orderQuery);
    // if (this.nameFC.value != null && this.nameFC.value != '') {
    //   query.fullName = this.nameFC.value;
    // }
    // if (this.phoneFC.value != null && this.phoneFC.value != '') {
    //   query.phoneNumber = this.phoneFC.value;
    // }
    // query.pageNumber = 1;
    // this.store.dispatch(new SearchPickUpOrders(query));
  }

}
