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

@NgModule({
  imports: [
    CommonModule,
    CustomerRoutes,
    SharedModule,
    FlexLayoutModule,
    CarouselModule,
    MatDividerModule
  ],
  declarations: [
    HomeComponent,
    MenuSlideComponent,
    LandingTitleComponent
  ]
})
export class CustomerModule { }
