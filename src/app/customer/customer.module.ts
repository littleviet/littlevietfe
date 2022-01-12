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
    MatCheckboxModule
  ],
  declarations: [
    HomeComponent,
    MenuSlideComponent,
    LandingTitleComponent,
    TakeAwayComponent,
    MenuButtonComponent,
    FooterComponent,
    CheckoutComponent,
    CartButtonComponent,
  ]
})
export class CustomerModule { }
