import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { ReservationManagementComponent } from './reservation-management/reservation-management.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { CommonModule } from '@angular/common';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReservationDetailComponent } from './reservation-management/reservation-detail/reservation-detail.component';


@NgModule({
  imports: [
    WelcomeRoutingModule,
    FormsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzTableModule,
    CommonModule,
    NzPaginationModule,
    NzDropDownModule,
    NzBreadCrumbModule,
    NzButtonModule
  ],
  declarations: [
    WelcomeComponent,
    ReservationManagementComponent,
    ReservationDetailComponent
  ],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
