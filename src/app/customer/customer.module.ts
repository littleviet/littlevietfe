import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutes } from './customer.routing';
import { SharedModule } from 'src/commons/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './home/home.component';
import { MenuSlideComponent } from './home/menu-slide/menu-slide.component';
import { MatDividerModule } from '@angular/material/divider';
import { LandingTitleComponent } from 'src/commons/components/landing-title/landing-title.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TakeAwayComponent } from './take-away/take-away.component';
import { MenuButtonComponent } from 'src/commons/components/menu-button/menu-button.component';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from 'src/commons/components/footer/footer.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartButtonComponent } from 'src/commons/components/cart-button/cart-button.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { CartDetailComponent } from 'src/commons/components/cart-detail/cart-detail.component';
import { TimePickerDialogComponent } from 'src/commons/components/time-picker-dialog/time-picker-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ProgressSpinnerComponent } from 'src/commons/components/progress-spinner/progress-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SideProgressSpinnerComponent } from 'src/commons/components/side-progress-spinner/side-progress-spinner.component';
import { ReservationComponent } from './reservation/reservation.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ReservationConfirmDialogComponent } from 'src/commons/components/reservation-confirm-dialog/reservation-confirm-dialog.component';
import { CouponComponent } from './coupon/coupon.component';
import { PageNotFoundComponent } from 'src/commons/components/page-not-found/page-not-found.component';
import { CancellationPolicyDialogComponent } from './reservation/cancellation-policy-dialog/cancellation-policy-dialog.component';
import { GlobalErrorDialogComponent } from 'src/commons/components/global-error-dialog/global-error-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    CustomerRoutes,
    SharedModule,
    FlexLayoutModule,
    CarouselModule,
    MatDividerModule,
    MatIconModule,
    MatExpansionModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatMenuModule,
    MatBadgeModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    NzDatePickerModule,
  ],
  declarations: [
    HomeComponent,
    MenuSlideComponent,
    LandingTitleComponent,
    TakeAwayComponent,
    ReservationComponent,
    MenuButtonComponent,
    FooterComponent,
    CheckoutComponent,
    CartButtonComponent,
    CartDetailComponent,
    TimePickerDialogComponent,
    ProgressSpinnerComponent,
    SideProgressSpinnerComponent,
    CouponComponent,
    ReservationConfirmDialogComponent,
    PageNotFoundComponent,
    CancellationPolicyDialogComponent,
    GlobalErrorDialogComponent
  ]
})
export class CustomerModule { }
