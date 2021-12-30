import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { CustomerRoutes } from './customer.routing';
import { SharedModule } from 'src/commons/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CustomerRoutes,
    SharedModule
  ],
  declarations: [CustomerComponent]
})
export class CustomerModule { }
