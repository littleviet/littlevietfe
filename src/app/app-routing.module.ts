import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TakeAwayComponent } from './customer/take-away/take-away.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./customer/customer.module').then((m) => m.CustomerModule) },
  { path: 'take-away', component: TakeAwayComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
