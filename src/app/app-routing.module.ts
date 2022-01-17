import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { CheckoutComponent } from './customer/checkout/checkout.component';
import { TakeAwayComponent } from './customer/take-away/take-away.component';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '', pathMatch: 'full', loadChildren: () => import('./customer/customer.module').then((m) => m.CustomerModule) },
  { path: 'take-away', component: TakeAwayComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'admin', component: AdminComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
