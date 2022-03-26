import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable, throwError, map } from "rxjs";
import { catchError } from "rxjs/operators";
import { LoginAccountInfo } from "src/dtos/account/login-account-info";
import { ErrorDialogService } from "../services/error-dialog.service";
import { AuthenticationState } from "../states/authentication.state";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  @Select(AuthenticationState.getLoggedInAccountInfo) loginAccountInfo!: Observable<LoginAccountInfo>;
  loginInfo: LoginAccountInfo | null = null; 
  constructor(public errorDialogService: ErrorDialogService) {
    this.loginAccountInfo.subscribe(v => {
      this.loginInfo = v;
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const modifiedReq = req.clone({
      headers: req.headers.append('Authorization', this.loginInfo && this.loginInfo.token ? 'Bearer ' + this.loginInfo.token : "")
    });
    return next.handle(modifiedReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.body && event.body.success == false) {  // client-side error
          this.errorDialogService.openDialog(event.body.message);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {  // client-side error
          this.errorDialogService.openDialog(error.error.message);
        } else { // server-side error
          var errorMsg = "";
          Object.entries(error.error.errors).forEach(([key, value]) => {
            errorMsg += value + '\n';
          })
          this.errorDialogService.openDialog(errorMsg);
        }
        return throwError(error);
      })
    );
  }
}
