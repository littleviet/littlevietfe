import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationDetailComponent } from './reservation-management/reservation-detail/reservation-detail.component';
import { ReservationManagementComponent } from './reservation-management/reservation-management.component';
import { WelcomeComponent } from './welcome.component';

const routes: Routes = [
  { 
    path: '',
    component: WelcomeComponent,
    data: {
      breadcrumb: 'Home'
    },
    children: [
      { 
        path: 'reservations',
        component: ReservationManagementComponent,
        data: {
          breadcrumb: 'Reservations'
        },
        children: [
          {
            path: ':id',
            component: ReservationDetailComponent,
            data: {
              breadcrumb: 'Detail'
            }
          }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
