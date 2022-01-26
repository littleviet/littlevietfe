import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckOutSuccessfulComponent } from 'src/commons/components/check-out-successful/check-out-successful.component';
import { CheckoutComponent } from './customer/checkout/checkout.component';
import { TakeAwayComponent } from './customer/take-away/take-away.component';

const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./admin/welcome.module').then(m => m.WelcomeModule) },
    { path: '', pathMatch: 'full', loadChildren: () => import('./customer/customer.module').then((m) => m.CustomerModule) },
    { path: 'take-away', component: TakeAwayComponent },
    { path: 'checkout', component: CheckoutComponent, children: [
      { path: 'order-successful', data: { orderSuccess: true}, component: CheckOutSuccessfulComponent},
      { path: 'order-canceled', data: { orderSuccess: false}, component: CheckOutSuccessfulComponent}
    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
