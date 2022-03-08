import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { map } from 'lodash';
import { distinctUntilChanged, filter } from 'rxjs';
import { PickUpOrderComponent } from './pick-up-order/pick-up-order.component';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.scss']
})
export class TaskManagementComponent implements OnInit {
  isDisplay = true;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    if (this.route.snapshot.children[0]?.url[0]?.path == 'pick-up-task'
        || this.router.url.split('/')[3] == 'check-in-reservation-task') {
      this.isDisplay = false;
    }

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (this.router.url.split('/').length < 5 &&
          (this.router.url.split('/')[3] == 'pick-up-task' || this.router.url.split('/')[3] == 'check-in-reservation-task')) {
          this.isDisplay = false;
        } else {
          this.isDisplay = true;
        }
      }
    });
  }
}
