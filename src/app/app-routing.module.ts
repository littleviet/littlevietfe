import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckOutSuccessfulComponent } from 'src/commons/components/check-out-successful/check-out-successful.component';
import { PageNotFoundComponent } from 'src/commons/components/page-not-found/page-not-found.component';
import { CheckoutComponent } from './customer/checkout/checkout.component';
import { CouponComponent } from './customer/coupon/coupon.component';
import { ReservationComponent } from './customer/reservation/reservation.component';
import { TakeAwayComponent } from './customer/take-away/take-away.component';

const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./admin/welcome.module').then(m => m.WelcomeModule) },
    { path: '', pathMatch: 'full', loadChildren: () => import('./customer/customer.module').then((m) => m.CustomerModule) },
    { path: 'take-away', component: TakeAwayComponent },
    { path: 'checkout', component: CheckoutComponent, children: [
      { path: 'order-successful', data: { orderSuccess: true}, component: CheckOutSuccessfulComponent},
      { path: 'order-canceled', data: { orderSuccess: false}, component: CheckOutSuccessfulComponent}
    ]},
    { path: 'reservation', component: ReservationComponent },
    { path: 'coupon-gift', component: CouponComponent },
    {path: 'not-found', component: PageNotFoundComponent},
    {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
