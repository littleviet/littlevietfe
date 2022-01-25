import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { exhaustMap, map, take } from "rxjs/operators";
import { LoginAccountInfo } from "src/dtos/account/login-account-info";
import { AuthenticationState } from "../states/authentication.state";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  @Select(AuthenticationState.getLoggedInAccountInfo) loginAccountInfo!: Observable<LoginAccountInfo>;
  loginInfo: LoginAccountInfo | null = null; 
  constructor() {
    this.loginAccountInfo.subscribe(v => {
      this.loginInfo = v;
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.loginInfo || !this.loginInfo.token) {
      return next.handle(req);
    }
    const modifiedReq = req.clone({
      headers: req.headers.append('Authorization', 'Bearer ' + this.loginInfo.token)
    });
    return next.handle(modifiedReq);
  }
}
