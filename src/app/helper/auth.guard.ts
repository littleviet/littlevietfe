import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { AuthenticationState } from '../states/authentication.state';
import { LoginAccountInfo } from 'src/dtos/account/login-account-info';
import { Role } from 'src/commons/enums/app-enum';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  @Select(AuthenticationState.getLoggedInAccountInfo) loggedInAccountObs!: Observable<LoginAccountInfo>;
  constructor(private router: Router, private store: Store) {}

  canActivate() : boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this.loggedInAccountObs.pipe(
      take(1),
      map(loginInfo => {
        if (loginInfo != null && (loginInfo.accountType.toString() == Role[Role.ADMIN] || loginInfo.accountType.toString()  == Role[Role.MANAGER])) {
          return true;
        }
        
        return this.router.createUrlTree(['']);
      })
    );
  }
}
