import { CommonModule, registerLocaleData } from '@angular/common';
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
import { FormsModule } from '@angular/forms';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CheckOutSuccessfulComponent } from 'src/commons/components/check-out-successful/check-out-successful.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ErrorDialogService } from './services/error-dialog.service';
import { AdminState } from './states/admin.state';
import { CouponState } from './states/coupon.state';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

registerLocaleData(en);

export function httpTranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [		
    AppComponent,
    CheckOutSuccessfulComponent,
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

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    { provide: NZ_I18N, useValue: en_US },
    ErrorDialogService,
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
