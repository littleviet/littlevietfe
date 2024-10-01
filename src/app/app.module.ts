import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from 'src/commons/shared.module';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptorService } from './helper/auth-interceptor.service';
import { AuthenticationState } from './states/authentication.state';
import { LandingPageState } from './states/landing-page.state';
import { TakeAwayState } from './states/take-away.state';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CheckOutSuccessfulComponent } from 'src/commons/components/check-out-successful/check-out-successful.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ErrorDialogService } from './services/error-dialog.service';
import { AdminState } from './states/admin.state';
import { CouponState } from './states/coupon.state';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HomeComponent } from './customer/home/home.component';
import { MenuSlideComponent } from './customer/home/menu-slide/menu-slide.component';
import { LandingTitleComponent } from 'src/commons/components/landing-title/landing-title.component';
import { TakeAwayComponent } from './customer/take-away/take-away.component';
import { ReservationComponent } from './customer/reservation/reservation.component';
import { MenuButtonComponent } from 'src/commons/components/menu-button/menu-button.component';
import { FooterComponent } from 'src/commons/components/footer/footer.component';
import { CheckoutComponent } from './customer/checkout/checkout.component';
import { CartButtonComponent } from 'src/commons/components/cart-button/cart-button.component';
import { CartDetailComponent } from 'src/commons/components/cart-detail/cart-detail.component';
import { TimePickerDialogComponent } from 'src/commons/components/time-picker-dialog/time-picker-dialog.component';
import { ProgressSpinnerComponent } from 'src/commons/components/progress-spinner/progress-spinner.component';
import { SideProgressSpinnerComponent } from 'src/commons/components/side-progress-spinner/side-progress-spinner.component';
import { CouponComponent } from './customer/coupon/coupon.component';
import { ReservationConfirmDialogComponent } from 'src/commons/components/reservation-confirm-dialog/reservation-confirm-dialog.component';
import { PageNotFoundComponent } from 'src/commons/components/page-not-found/page-not-found.component';
import { CancellationPolicyDialogComponent } from './customer/reservation/cancellation-policy-dialog/cancellation-policy-dialog.component';
import { GlobalErrorDialogComponent } from 'src/commons/components/global-error-dialog/global-error-dialog.component';
import { LoginComponent } from './customer/login/login.component';
import { CouponConfirmDialogComponent } from './customer/coupon/coupon-confirm-dialog/coupon-confirm-dialog.component';
import { SignUpComponent } from './customer/sign-up/sign-up.component';
import { MenuComponent } from './customer/menu/menu.component';

registerLocaleData(en);

export function httpTranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [		
    AppComponent,
    CheckOutSuccessfulComponent,
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
    GlobalErrorDialogComponent,
    LoginComponent,
    CouponConfirmDialogComponent,
    SignUpComponent,
    MenuComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    CommonModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatMenuModule,
    HttpClientModule,
    NgxsModule.forRoot([LandingPageState, TakeAwayState, AuthenticationState, AdminState, CouponState], {
      developmentMode: !environment.production
    }),
    NgxsStoragePluginModule.forRoot({
      key: ['authentication.loggedinUser', 'takeaway.cart', 'takeaway.timePickUp']
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    MatIconModule,
    MatDialogModule,
    FormsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzDatePickerModule,
    CarouselModule,
    MatDividerModule,
    MatExpansionModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    { provide: NZ_I18N, useValue: en_US },
    ErrorDialogService,
    DatePipe
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
