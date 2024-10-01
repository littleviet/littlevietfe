import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckOutSuccessfulComponent } from 'src/commons/components/check-out-successful/check-out-successful.component';
import { PageNotFoundComponent } from 'src/commons/components/page-not-found/page-not-found.component';
import { CheckoutComponent } from './customer/checkout/checkout.component';
import { CouponComponent } from './customer/coupon/coupon.component';
import { HomeComponent } from './customer/home/home.component';
import { LoginComponent } from './customer/login/login.component';
import { ReservationComponent } from './customer/reservation/reservation.component';
import { SignUpComponent } from './customer/sign-up/sign-up.component';
import { TakeAwayComponent } from './customer/take-away/take-away.component';
import { AuthGuard } from './helper/auth.guard';
import { MenuComponent } from './customer/menu/menu.component';

const routes: Routes = [
  { path: 'admin', canActivate: [AuthGuard], loadChildren: () => import('./admin/welcome.module').then(m => m.WelcomeModule), data: { breadcrumb: 'Home' } },
  { path: '', canActivate: [AuthGuard], component: HomeComponent },
  { path: 'take-away', canActivate: [AuthGuard], component: TakeAwayComponent },
  { path: 'checkout', canActivate: [AuthGuard], component: CheckoutComponent, children: [
      { path: 'order-successful', data: { orderSuccess: true}, component: CheckOutSuccessfulComponent},
      { path: 'order-canceled', data: { orderSuccess: false}, component: CheckOutSuccessfulComponent}
    ]
  },
  { path: 'reservation', canActivate: [AuthGuard], component: ReservationComponent },
  { path: 'login', canActivate: [AuthGuard], component: LoginComponent },
  { path: 'sign-up', canActivate: [AuthGuard], component: SignUpComponent },
  { path: 'coupon-gift', canActivate: [AuthGuard], component: CouponComponent },
  { path: 'menu', canActivate: [AuthGuard], component: MenuComponent },
  { path: 'not-found', component: PageNotFoundComponent},
  { path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: "enabled",
    onSameUrlNavigation: "reload",
    // enableTracing: true,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
